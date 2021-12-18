import {
    get,
    noop,
    pick,
    flatten,
    difference,
    find,
    isEqual
} from 'lodash-es'
import appContext, {
    dataBindingAppContext
} from './DataBindingAppContext'
import DataProvider from '../data/DataProvider'
import {
    convertFromCustomFormat,
    convertToCustomFormat,
} from '@wix/cloud-elementory-protocol'
import {
    PRIMARY
} from '../data/sequenceType'
import * as DATASET_TYPES from '@wix/wix-data-client-common/src/datasetTypes'
import completeControllerConfigs from '../dataset-controller/completeControllerConfigs'
import {
    parseUrlPattern
} from '../helpers/urlUtils'
import {
    isEnvEditor,
    isModePreview,
    isModeLivePreview,
} from '../helpers/viewMode'
import createDatabindingVerboseReporter from '../verbose/databindingVerboseReporter'
import Deferred from '../helpers/Deferred'
import {
    TraceType
} from '../logger/traceType'
import {
    createRecordStoreService
} from '../record-store'
import createControllerFactory from '../dataset-controller/controllerFactory'
import AppState from './AppState'

export default class DataBinding {#
    dataProvider# dataCache# features# appState

    //TODO: invert
    # wixSdk# appLogger# errorReporter# verboseReporter# routerPayload# automationsClient# shouldVerbose# recordStoreCache

    constructor({
        appState,
        dataFetcher,
        dataCache,
        features,

        appLogger,
        errorReporter,
        wixSdk,
        //TODO: add to dataCache, and distinguish there which data should be saved to warmup store.
        //TODO: for now routerData schemas are also saved to the warmup data which is not oprimal
        routerReturnedData,
        shouldVerbose,
        originalVerboseReporter,
        automationsClientCreator,
    }) {
        dataBindingAppContext.set({
            appState,
            features,
            dataFetcher,
        })

        this.#appState = new AppState()
        this.#dataProvider = new DataProvider({
            appLogger,
            errorReporter,
        })
        this.#dataCache = dataCache
        this.#features = features

        const viewMode = getViewMode(wixSdk)

        this.#wixSdk = wixSdk
        this.#appLogger = appLogger
        this.#errorReporter = errorReporter
        this.#shouldVerbose = shouldVerbose
        this.#verboseReporter =
            shouldVerbose && isModePreview(viewMode) ? originalVerboseReporter : noop
        this.#routerPayload = routerReturnedData
        this.#automationsClient = automationsClientCreator()
        this.#recordStoreCache = {}
    }

    initializeDatasets({
        //TODO: temp interface
        rawControllerConfigs,
    }) {
        const {
            appState: {
                mode: {
                    csr,
                    ssr
                },
            },
        } = appContext
        const controllerConfigs = completeControllerConfigs(
            rawControllerConfigs,
            this.#routerPayload,
        )
        const updatedDatasetIds = this.#updateDatasetConfigsState(controllerConfigs)
        const viewMode = getViewMode(this.#wixSdk)
        const {
            routerData,
            dynamicPagesData
        } = this.#routerPayload ?
            extractRouterPayload(
                this.#routerPayload,
                convertFromCustomFormat,
                controllerConfigs,
            ) :
            {}
        const warmupDataIsEnabled = this.#features.warmupData
        const reportFormEventToAutomation =
            this.#automationsClient.reportFormEventToAutomationCreator({
                isPreview: isEnvEditor(viewMode),
            })
        const instantiateDatabindingVerboseReporter =
            createDatabindingVerboseReporter(
                this.#verboseReporter,
                this.#shouldVerbose,
            )
        const fetchingAllDatasetsData = []
        const renderingControllers = []
        const {
            resolve: renderDeferredControllers,
            promise: renderingRegularControllers,
        } = new Deferred()

        const cachedSchemas =
            warmupDataIsEnabled && csr ? this.#dataCache.get('schemas') : undefined

        const schemasLoading = this.#dataProvider
            .loadSchemas(
                getUniqueCollectionIds(controllerConfigs, this.#routerPayload), {
                    ...cachedSchemas,
                    ...this.#routerPayload ? .schemas,
                },
            )
            .then(
                schemas =>
                warmupDataIsEnabled && ssr && this.#dataCache.set('schemas', schemas),
            )

        const cachedStore =
            csr &&
            warmupDataIsEnabled &&
            convertFromCache(this.#dataCache.get('dataStore'))

        if (cachedStore) {
            this.#dataProvider.setStore(cachedStore)
        }

        this.#dataProvider.setStore(routerData) //TODO: consider moving router data to cache
        this.#dataProvider.createBulkRequest(
            this.#getBulkRequestConfigs(controllerConfigs, updatedDatasetIds),
        )

        const controllers = controllerConfigs.map(
            ({
                type,
                config,
                connections,
                $w,
                compId: datasetId,
                livePreviewOptions: {
                    shouldFetchData: dataIsInvalidated,
                    compsIdsToReset: updatedCompIds = [],
                } = {},
                platformAPIs,
                wixCodeApi: wixSdk,
            }) => {
                const {
                    datasetIsRouter,
                    datasetIsDeferred
                } =
                config.datasetStaticConfig
                this.#appLogger.trace(
                    TraceType.Breadcrumb({
                        level: 'info',
                        category: 'createControllers',
                        message: 'warmup data contents',
                        data: {
                            datasetId,
                            datasetType: type,
                            env: get(wixSdk, ['window', 'rendering', 'env']),
                            warmupData: Boolean(cachedStore),
                        },
                    }),
                )

                const recordStoreService = createRecordStoreService({
                    primaryDatasetId: datasetId,
                    recordStoreCache: this.#recordStoreCache,
                    refreshStoreCache: dataIsInvalidated,
                    warmupStore: undefined,
                    dataProvider: this.#dataProvider,
                    controllerConfig: config,
                    logger: this.#appLogger,
                })

                const {
                    promise: fetchingDatasetData,
                    resolve: markDatasetDataFetched,
                } = new Deferred()
                if (!datasetIsRouter && !datasetIsDeferred) {
                    // But router will be in dataStore anyway. Filter out?
                    fetchingAllDatasetsData.push(fetchingDatasetData)
                }

                const {
                    promise: renderingController,
                    resolve: markControllerAsRendered,
                } = new Deferred()
                renderingControllers.push(renderingController)

                const controllerFactory = createControllerFactory(this.#appLogger, {
                    $w,
                    controllerConfig: config,
                    datasetType: type,
                    connections,
                    recordStoreService,
                    dataProvider: this.#dataProvider,
                    firePlatformEvent: this.#appLogger.userCodeZone($w.fireEvent),
                    wixSdk,
                    errorReporter: this.#errorReporter,
                    verboseReporter: this.#verboseReporter,
                    instantiateDatabindingVerboseReporter,
                    dynamicPagesData: datasetIsRouter ? dynamicPagesData : undefined,
                    appLogger: this.#appLogger,
                    datasetId,
                    handshakes: [],
                    schemasLoading,
                    reportFormEventToAutomation,
                    platformAPIs,
                    updatedCompIds,
                    markControllerAsRendered,
                    markDatasetDataFetched,
                    renderingRegularControllers,
                    // isModeLivePreview is ture only if the LivePreview feature is enabled,
                    // since in other case the Viewer won't be loaded at all
                    modeIsLivePreview: isModeLivePreview(viewMode),
                    modeIsSSR: ssr,
                    useLowerCaseDynamicPageUrl: get(this.#routerPayload, [
                        'config',
                        'dataset',
                        'lowercase',
                    ]),
                })

                const datasetController = extractPlatformControllerAPI(
                    controllerFactory.createPrimaryController(),
                )
                return Promise.resolve(datasetController)
            },
        )

        if (ssr && warmupDataIsEnabled && fetchingAllDatasetsData.length) {
            Promise.all(fetchingAllDatasetsData).then(() => {
                this.#dataCache.set(
                    'dataStore',
                    convertToCache(this.#dataProvider.getStore()),
                )
            })
        }
        Promise.all(renderingControllers).then(renderDeferredControllers)

        return controllers
    }

    #
    updateDatasetConfigsState(datasetConfigs) {
        return datasetConfigs.reduce(
            (updatedDatasetIds, {
                compId: datasetId,
                config: {
                    dataset
                }
            }) => {
                const datasetConfigState = this.#appState.datasetConfigs.get(datasetId)
                if (datasetConfigState && !isEqual(datasetConfigState, dataset)) {
                    updatedDatasetIds.push(datasetId)
                }
                this.#appState.datasetConfigs.set(datasetId, dataset)

                return updatedDatasetIds
            }, [],
        )
    }

    #
    getBulkRequestConfigs(datasetConfigs, updatedDatasetIds) {
        return datasetConfigs.reduce(
            (
                acc, {
                    compId: datasetId,
                    config: {
                        datasetStaticConfig: {
                            sequenceType
                        },
                    },
                    livePreviewOptions: {
                        shouldFetchData
                    } = {},
                },
            ) =>
            sequenceType === PRIMARY ?
            [
                ...acc,
                {
                    id: datasetId,
                    refresh: shouldFetchData || updatedDatasetIds.includes(datasetId),
                },
            ] :
            acc, [],
        )
    }
}

const getViewMode = sdk => get(sdk, ['window', 'viewMode'])

const getUniqueCollectionIds = (datasetConfigs, routerData) => {
    const uniqueCollectionIds = datasetConfigs.reduce(
        (
            uniqueIds, {
                config: {
                    dataset: {
                        collectionName
                    },
                },
            },
        ) => (collectionName ? uniqueIds.add(collectionName) : uniqueIds),
        new Set(),
    )

    if (routerData ? .schemas) {
        for (const collectionId of Object.keys(routerData.schemas)) {
            uniqueCollectionIds.add(collectionId)
        }
    }

    return [...uniqueCollectionIds]
}

const extractRouterPayload = (payload, parser, controllerConfigs) => {
    const routerDataset = find(controllerConfigs, {
        type: DATASET_TYPES.ROUTER_DATASET,
    })
    const datasetId = routerDataset && routerDataset.compId
    if (!datasetId) return {}
    const collectionName = get(routerDataset, 'config.dataset.collectionName')

    const {
        dynamicUrl,
        userDefinedFilter,
        items = [],
        totalCount,
        config,
    } = payload
    const parsedItems = parser(items)
    const record = parsedItems[0]
    const datasetSort = get(config, 'dataset.sort', []) || []
    const patternFields =
        dynamicUrl && record ? parseUrlPattern(dynamicUrl).fields : []
    const datasetSortFields = getDatasetSortFields(datasetSort)
    const unsortedPatternFields = difference(patternFields, datasetSortFields)
    const sort = getSortObject([
        ...datasetSort,
        ...getDefaultFieldsSort(unsortedPatternFields),
    ])
    const sortFields = [...datasetSortFields, ...unsortedPatternFields]

    const dynamicUrlPatternFieldsValues =
        extractDynamicUrlPatternFieldsValuesFromRecord(
            dynamicUrl,
            record,
            sortFields,
            patternFields,
        )

    return {
        routerData: {
            recordsInfoByDataset: {
                [datasetId]: {
                    itemIds: parsedItems.map(({
                        _id
                    }) => _id),
                    totalCount,
                },
            },
            recordsByCollection: {
                [collectionName]: parsedItems.reduce(
                    (acc, record) => ({
                        ...acc,
                        [record._id]: record,
                    }), {},
                ),
            },
        },
        dynamicPagesData: {
            dynamicUrl,
            userDefinedFilter,
            dynamicUrlPatternFieldsValues,
            sort,
            sortFields,
            patternFields,
        },
    }
}

const getDatasetSortFields = sort =>
    flatten(sort.map(sortItem => Object.keys(sortItem).map(key => key)))

const getSortObject = sortArray =>
    sortArray.reduce(
        (accumulator, currentValue) => Object.assign(accumulator, currentValue), {},
    )

const getDefaultFieldsSort = patternFields =>
    patternFields.map(field => ({
        [field]: 'asc'
    }))

const extractDynamicUrlPatternFieldsValuesFromRecord = (
    dynamicUrl,
    record,
    sortFields,
    patternFields,
) => {
    const sortAndPatternFields = patternFields.concat(sortFields)
    return patternFields.length ? pick(record, sortAndPatternFields) : null
}

const extractPlatformControllerAPI = ({
    pageReady,
    exports,
    dispose
}) => ({
    pageReady,
    exports,
    dispose,
})

const createConverter = convert => dataStore => {
    // TODO: change date format to ISO string and this conversion won't be needed
    if (dataStore) {
        return {
            ...dataStore,
            recordsByCollection: Object.entries(dataStore.recordsByCollection).reduce(
                (acc, [collection, recordsById]) => {
                    acc[collection] = convert(recordsById)
                    return acc
                }, {},
            ),
        }
    }
}
const convertToCache = createConverter(convertToCustomFormat)
const convertFromCache = createConverter(convertFromCustomFormat)