'use strict'

import {
    uniq,
    get,
    mapValues,
    groupBy,
    flow,
    isNull
} from 'lodash-es'
import {
    Maybe
} from '@wix/wix-code-adt'
import {
    UPLOAD_BUTTON_ROLE,
    SIGNATURE_INPUT_ROLE,
} from '@wix/wix-data-client-common/src/connection-config/roles'
import {
    SCOPE_TYPES
} from '@wix/dbsm-common/src/scopes/consts'
import {
    getFilter,
    getSort,
    shouldAllowWixDataAccess,
    selectCurrentRecord,
    selectCurrentRecordIndex,
    getDatasetStaticConfig,
    isDatasetConfigured,
    getCurrentPageSize,
} from './rootReducer'
import recordActions from '../records/actions'
import dynamicPagesActions from '../dynamic-pages/actions'
import configActions from '../dataset-config/actions'
import rootActions from './actions'
import configureDatasetStore from './configureStore'
import {
    performHandshake
} from '../dependency-resolution/actions'
import datasetApiCreator from '../dataset-api/datasetApi'
import eventListenersCreator from '../dataset-events/eventListeners'
import syncComponentsWithState from '../side-effects/syncComponentsWithState'
import {
    getFieldTypeCreator
} from '../data/utils'
import createConnectedComponentsStore from '../connected-components'
import {
    adapterApiCreator,
    createComponentAdapterContexts,
    createDetailsRepeatersAdapterContexts,
    initAdapters,
} from '../components'
import {
    createFilterResolver,
    createValueResolvers,
    hasDatabindingDependencies,
} from '../filter-resolvers'
import wixFormattingCreator from '@wix/wix-code-formatting'
import dependenciesManagerCreator from '../dependency-resolution/dependenciesManager'
import {
    isSameRecord,
    createRecordStoreInstance
} from '../record-store'
import {
    reportDatasetActiveOnPage
} from '../bi/events'
import rootSubscriber from './rootSubscriber'
import dynamicPagesSubscriber from '../dynamic-pages/subscriber'
import createSiblingDynamicPageUrlGetter from '../dynamic-pages/siblingDynamicPageGetterFactory'
import fetchData from './dataFetcher'
import {
    traceCreators
} from '../logger'
import generateRecordFromDefaultComponentValues from '../helpers/generateRecordFromDefaultComponentValues'
import {
    getComponentsToUpdate
} from '../helpers/livePreviewUtils'

const onChangeHandler = (getState, dispatch, adapterApi, logger) => {
    const areArgumentsIllegal = (before, after) => isNull(before) && isNull(after)
    const recordWasAdded = (before, after) => isNull(before)
    const recordWasDeleted = (before, after) => isNull(after)
    const currentRecordWasChanged = (changedRecord, currentRecord) =>
        isSameRecord(changedRecord, currentRecord)

    return (before, after, componentIdToExclude) => {
        const argsAreIllegal = areArgumentsIllegal(before, after)
        if (argsAreIllegal) {
            logger.error(
                new Error('onChangeHandler invoked with illegal arguments'), {
                    extra: {
                        arguments: {
                            before,
                            after,
                            componentIdToExclude
                        }
                    }
                },
            )
            return
        }

        if (recordWasAdded(before, after)) {
            dispatch(recordActions.refreshCurrentView()).catch(() => {})
            return
        }

        const currentRecord = selectCurrentRecord(getState())

        if (recordWasDeleted(before, after)) {
            if (isSameRecord(before, currentRecord)) {
                dispatch(recordActions.refreshCurrentRecord()).catch(() => {})
            }
            dispatch(recordActions.refreshCurrentView()).catch(() => {})
            return
        }

        if (currentRecordWasChanged(before, currentRecord)) {
            const currentRecordIndex = selectCurrentRecordIndex(getState())

            dispatch(
                recordActions.setCurrentRecord(
                    after,
                    currentRecordIndex,
                    componentIdToExclude,
                ),
            ).catch(() => {})
        }
    }
}

function waitForAllChildControllersToBeReady(controllerStore) {
    return Promise.all(
        controllerStore.getAll().map(
            scope =>
            new Promise(resolve => {
                scope.staticExports.onReady(resolve)
            }),
        ),
    )
}

const getFirstRecord = service =>
    service.getSeedRecords().matchWith({
        Empty: () => Maybe.Nothing(),
        Results: ({
            items
        }) => Maybe.Just(items[0]),
    })

const createDataset =
    (controllerFactory, controllerStore) =>
    (
        isScoped,
        isFixedItem, {
            $w,
            controllerConfig,
            datasetType,
            connections,
            dataProvider,
            wixSdk,
            firePlatformEvent,
            errorReporter,
            verboseReporter,
            dynamicPagesData,
            appLogger,
            datasetId,
            fixedRecordId,
            handshakes = [],
            recordStoreService,
            reportFormEventToAutomation,
            instantiateDatabindingVerboseReporter,
            parentId,
            platformAPIs,
            updatedCompIds,
            markControllerAsRendered,
            markDatasetDataFetched,
            renderingRegularControllers,
            modeIsLivePreview,
            modeIsSSR,
            useLowerCaseDynamicPageUrl,
            schemasLoading,
        },
    ) => {
        const isThunderboltRenderer =
            get(platformAPIs, ['bi', 'viewerName']) === 'thunderbolt'
        const locale = wixSdk.site.regionalSettings || wixSdk.window.browserLocale

        const {
            findConnectedComponents,
            setConnectedComponents,
            resolveHandshakes,
            getConnectedComponents,
            getConnectedComponentIds,
        } = createConnectedComponentsStore()
        const unsubscribeHandlers = []
        const eventListeners = eventListenersCreator(
            firePlatformEvent,
            errorReporter,
            verboseReporter,
        )

        const {
            fireEvent
        } = eventListeners
        unsubscribeHandlers.push(eventListeners.dispose)

        const {
            store,
            subscribe,
            onIdle
        } = configureDatasetStore(
            appLogger,
            datasetId,
        )

        unsubscribeHandlers.push(
            appLogger.addSessionData(() => ({
                [datasetId]: {
                    datasetType,
                    state: store.getState(),
                    connections,
                },
            })),
        )

        store.dispatch(
            rootActions.init({
                controllerConfig,
                connections,
                isScoped,
                datasetType,
            }),
        )
        const {
            datasetIsVirtual,
            datasetIsReal,
            datasetIsDeferred,
            datasetIsWriteOnly,
            datasetCollectionName,
            dynamicPageNavComponentsShouldBeLinked,
        } = getDatasetStaticConfig(store.getState())

        unsubscribeHandlers.push(
            appLogger.addSessionData(() => ({
                scopes: controllerStore.getAll()
            })),
        )

        const dependenciesManager = dependenciesManagerCreator()
        unsubscribeHandlers.push(dependenciesManager.unsubscribe)

        const filter = getFilter(store.getState())

        const getSchema = (schemaName = datasetCollectionName) => {
            return Maybe.fromNullable(dataProvider.getSchema(schemaName))
        }

        const getFieldType = fieldName => {
            const schema = getSchema(datasetCollectionName)
            const referencedCollectionsSchemas = dataProvider.getReferencedSchemas(
                datasetCollectionName,
            )
            return schema.chain(s =>
                Maybe.fromNullable(
                    getFieldTypeCreator(s, referencedCollectionsSchemas)(fieldName),
                ),
            )
        }

        const valueResolvers = createValueResolvers(
            dependenciesManager.get(),
            wixSdk,
            getConnectedComponents,
            getFieldType,
        )
        const filterResolver = createFilterResolver(valueResolvers)

        const recordStore = createRecordStoreInstance({
            recordStoreService,
            getFilter: flow(_ => store.getState(), getFilter),
            getSort: flow(_ => store.getState(), getSort),
            getPageSize: flow(_ => store.getState(), getCurrentPageSize),
            shouldAllowWixDataAccess: flow(
                _ => store.getState(),
                shouldAllowWixDataAccess,
            ),
            datasetId,
            filterResolver,
            getSchema,
            fixedRecordId,
        })

        const siblingDynamicPageUrlGetter = dynamicPageNavComponentsShouldBeLinked ?
            createSiblingDynamicPageUrlGetter({
                dataProvider,
                dynamicPagesData,
                collectionName: datasetCollectionName,
                useLowerCaseDynamicPageUrl,
            }) :
            null

        if (dynamicPageNavComponentsShouldBeLinked) {
            subscribe(dynamicPagesSubscriber(siblingDynamicPageUrlGetter))
            store.dispatch(dynamicPagesActions.initialize(connections))
        }

        const datasetApi = datasetApiCreator({
            store,
            recordStore,
            logger: appLogger,
            eventListeners,
            handshakes,
            controllerStore,
            errorReporter,
            verboseReporter,
            datasetId,
            datasetType,
            isFixedItem,
            siblingDynamicPageUrlGetter,
            dependenciesManager,
            onIdle,
            getConnectedComponentIds,
        })

        const uniqueRoles = uniq(connections.map(conn => conn.role))
        const appDatasetApi = datasetApi(false)
        const componentAdapterContexts = []
        const databindingVerboseReporter = instantiateDatabindingVerboseReporter(
            datasetCollectionName,
            parentId,
        )

        const adapterParams = {
            getState: store.getState,
            datasetApi: appDatasetApi,
            wixSdk,
            errorReporter,
            platformAPIs,
            eventListeners,
            roles: uniqueRoles,
            getFieldType,
            getSchema,
            appLogger,
            applicationCodeZone: appLogger.applicationCodeZone,
            controllerFactory,
            controllerStore,
            databindingVerboseReporter,
            parentId,
            modeIsLivePreview,
            wixFormatter:
                (modeIsSSR && !isThunderboltRenderer) || !locale ?
                null :
                wixFormattingCreator({
                    locale,
                }),
        }
        const adapterApi = adapterApiCreator({
            dispatch: store.dispatch,
            recordStore,
            componentAdapterContexts,
        })

        unsubscribeHandlers.push(
            recordStoreService
            .map(service =>
                service.onChange(
                    onChangeHandler(
                        store.getState,
                        store.dispatch,
                        adapterApi,
                        appLogger,
                    ),
                ),
            )
            .getOrElse(() => {}),
        )

        const setCurrentRecord = maybeRecord =>
            maybeRecord.map(record =>
                store.dispatch(recordActions.setCurrentRecord(record, 0)),
            )

        const {
            fetchingInitialData,
            resolveUserInputDependency,
            resolveControllerDependencies,
        } = fetchData({
            shouldFetchInitialData: controllerConfig && !datasetIsWriteOnly,
            recordStore,
            errorReporter,
            appLogger,
            store,
            filter,
            datasetIsDeferred,
            modeIsSSR,
        })

        fetchingInitialData
            .then(() => {
                markDatasetDataFetched()
                recordStore().fold(
                    () => null,
                    service => {
                        setCurrentRecord(getFirstRecord(service))
                    },
                )
            })
            .then(() =>
                datasetIsDeferred ?
                renderingRegularControllers :
                Promise.resolve(Maybe.Nothing()),
            )

        handshakes.forEach(handshake =>
            performHandshake(dependenciesManager, store.dispatch, handshake),
        )

        const shouldRefreshDataset = () => {
            const currentRecordIndex = selectCurrentRecordIndex(store.getState())
            const isPristine = recordStore().fold(
                () => false,
                service => service.isPristine(currentRecordIndex),
            )

            return isPristine && !datasetIsWriteOnly
        }

        const pageReady = async function() {
            wixSdk.user.onLogin(() => {
                // THIS SHOULD HAPPEN SYNCHRONOUSLY SO TESTS WILL REMAIN MEANINGFUL
                // IF YOU EVER FIND THE NEED TO MAKE IT ASYNC - TALK TO leeor@wix.com
                if (shouldRefreshDataset()) {
                    appDatasetApi.refresh()
                }
            })

            setConnectedComponents(
                getComponentsToUpdate({
                    connectedComponents: findConnectedComponents(uniqueRoles, $w),
                    updatedCompIds,
                    datasetIsReal,
                }),
            )

            // THIS SHOULD HAPPEN SYNCHRONOUSLY AFTER PAGE READY IS CALLED TO KEEP CONTROLLERS RUNNING SEQUENCE
            const detailsControllersToHandshake = resolveHandshakes({
                datasetApi: appDatasetApi,
                components: getConnectedComponents(),
                controllerConfig,
                controllerConfigured: isDatasetConfigured(store.getState()),
            })
            detailsControllersToHandshake.forEach(({
                    controller,
                    handshakeInfo
                }) =>
                controller.handshake(handshakeInfo),
            )

            if (hasDatabindingDependencies(filter)) {
                await resolveControllerDependencies()
            }

            const dependencies = dependenciesManager.get()

            // scoped datasets are sure to have the schema resolved and therefore don't have to wait
            if (datasetIsReal) {
                await schemasLoading
            }

            resolveUserInputDependency()

            // removed collection, nothing to bind.
            if (!dataProvider.hasSchema(controllerConfig.dataset.collectionName)) {
                // yes, this is nonsense. but this is how our product works now.
                // even if collection is removed, so there is imposible to bind,
                // datasetApi still works! it returns emty data,
                // but works and there can be users out there, relying on this shitty behaviour.
                // TODO: so we need to investigate and get product decision for this case... Triascia!
                fetchingInitialData.then(() => {
                    markControllerAsRendered()
                    store.dispatch(configActions.setIsDatasetReady(true))
                    fireEvent('datasetReady')
                })

                return Promise.resolve()
            }

            componentAdapterContexts.push(
                ...createComponentAdapterContexts({
                    connectedComponents: getConnectedComponents(),
                    $w,
                    adapterApi,
                    getFieldType,
                    ignoreItemsInRepeater: datasetIsReal,
                    dependencies,
                    adapterParams,
                }),
            )

            if (datasetIsReal) {
                //TODO: add additional check by master dataset
                const detailsRepeatersAdapterContexts =
                    createDetailsRepeatersAdapterContexts(
                        getConnectedComponents(),
                        getFieldType,
                        dependencies,
                        adapterParams,
                    )
                componentAdapterContexts.push(...detailsRepeatersAdapterContexts)
            }

            subscribe(
                rootSubscriber(
                    recordStore,
                    adapterApi,
                    getFieldType,
                    eventListeners.executeHooks,
                    appLogger,
                    datasetId,
                    componentAdapterContexts,
                    getSchema,
                    datasetCollectionName,
                    reportFormEventToAutomation,
                    fireEvent,
                    verboseReporter,
                ),
            )

            unsubscribeHandlers.push(
                addComponentDataToExceptions(
                    componentAdapterContexts,
                    appLogger,
                    datasetId,
                ),
            )

            unsubscribeHandlers.push(
                syncComponentsWithState(
                    store,
                    componentAdapterContexts,
                    appLogger,
                    datasetId,
                    recordStore,
                ),
            )

            const defaultRecord = generateRecordFromDefaultComponentValues(
                componentAdapterContexts.filter(
                    ({
                        role
                    }) =>
                    ![UPLOAD_BUTTON_ROLE, SIGNATURE_INPUT_ROLE].includes(role),
                ),
            )

            store.dispatch(recordActions.setDefaultRecord(defaultRecord))
            if (isDatasetConfigured(store.getState()) && datasetIsWriteOnly) {
                await store.dispatch(recordActions.initWriteOnly(datasetIsVirtual))
            }

            if (datasetIsDeferred) {
                // we should hide all components connected to deferred dataset before telling the Platform we are ready
                adapterApi().hideComponent({
                    rememberInitiallyHidden: true
                })

                if (modeIsSSR) adapterApi().clearComponent()
            }

            const pageReadyResult = fetchingInitialData.then(async () => {
                try {
                    reportDatasetActiveOnPage(
                        appLogger.bi,
                        store.getState(),
                        connections,
                        datasetType,
                        datasetIsVirtual,
                        datasetId,
                        wixSdk,
                    )
                } catch (err) {
                    appLogger.error(err)
                }
                await initAdapters(adapterApi())
                if (datasetIsReal) {
                    await waitForAllChildControllersToBeReady(controllerStore)
                }
                if (datasetIsDeferred) {
                    // we should show all components connected to deferred dataset only after all child controllers (repeater items) are ready
                    adapterApi().showComponent({
                        ignoreInitiallyHidden: true
                    })
                }
                store.dispatch(configActions.setIsDatasetReady(true))
                fireEvent('datasetReady')
            })

            if (datasetIsDeferred) {
                markControllerAsRendered()

                return Promise.resolve()
            } else {
                pageReadyResult.then(markControllerAsRendered)

                return pageReadyResult
            }
        }

        const userCodeDatasetApi = datasetApi(true)
        const dynamicExports = (scope /*, $w*/ ) => {
            switch (scope.type) {
                case SCOPE_TYPES.COMPONENT:
                    return userCodeDatasetApi.inScope(
                        scope.compId,
                        scope.additionalData.itemId,
                    )
                default:
                    return userCodeDatasetApi
            }
        }

        const dispose = () => {
            componentAdapterContexts.splice(0)
            unsubscribeHandlers.forEach(h => h())
        }

        const finalPageReady = datasetIsVirtual ?
            pageReady :
            () => appLogger.traceAsync(traceCreators.pageReady(), pageReady)

        return {
            pageReady: appLogger.applicationCodeZone(finalPageReady),
            exports: dynamicExports,
            staticExports: userCodeDatasetApi,
            dispose,
        }
    }

const addComponentDataToExceptions = (
    componentAdapterContexts,
    logger,
    datasetId,
) => {
    const componentIdToRole = mapValues(
        groupBy(componentAdapterContexts, cac => cac.component.id),
        cacArray => cacArray.map(cac => cac.role).join(),
    )

    return logger.addSessionData(() => ({
        [datasetId]: {
            components: componentIdToRole,
        },
    }))
}

export default createDataset