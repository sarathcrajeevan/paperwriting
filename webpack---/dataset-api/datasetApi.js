'use strict'

import {
    cloneDeep,
    identity,
    flow,
    noop,
    mapValues
} from 'lodash-es'
import datasetActions from '../dataset-controller/actions'
import routerDatasetApiCreator from './routerDatasetApi'
import recordActions from '../records/actions'
import configActions from '../dataset-config/actions'
import {
    performHandshake
} from '../dependency-resolution/actions'
import {
    isDatasetReady,
    selectCurrentRecordIndex,
    selectLastSavedRecord,
    selectCurrentRecord,
    isWriteOnly,
    isReadOnly,
    getPaginationData,
    getCurrentPageSize,
    getTotalPageCount,
    getCurrentPageIndex,
} from '../dataset-controller/rootReducer'
import DatasetError from './DatasetError'
import * as modes from '@wix/wix-data-client-common/src/dataset-configuration/readWriteModes'
import {
    breadcrumbWrapper,
    reportCallbackError
} from '../logger'
import {
    assertDatasetLimitations,
    assertDatasetReady,
    assertHasCurrentItem,
    assertValidIndex,
    assertValidNumberArgument,
    assertValidCallback,
    assertValidFilter,
    assertValidSort,
    assertScopeIsNotFixedItem,
    assertValidPageIndex,
    assertValidNaturalNumber,
    assetValidHandshakeInfo,
} from './datasetApiAssertions'
import {
    shouldWrapWithVerbose,
    verboseWrapper
} from './verbosity'

const {
    READ,
    WRITE,
    READ_WRITE
} = modes
const datasetApiCreator = ({
    store: {
        dispatch,
        getState
    },
    recordStore,
    logger,
    eventListeners: {
        fireEvent,
        register
    },
    handshakes,
    controllerStore,
    errorReporter,
    verboseReporter,
    datasetId,
    datasetType,
    isForUser,
    isFixedItem,
    siblingDynamicPageUrlGetter,
    dependenciesManager,
    onIdle,
    getConnectedComponentIds,
}) => {
    const createBreadcrumb = (fnName, args) => ({
        category: 'datasetAPI',
        level: 'info',
        message: `${fnName}-${datasetId}`,
    })
    const {
        withBreadcrumbs
    } = breadcrumbWrapper(
        logger,
        createBreadcrumb,
        value => undefined, // we only want to trace user calls, no need for return value
    )

    const addBreadcrumb = functionName => fn => withBreadcrumbs(functionName, fn)

    const fireErrorEvent = (operation, e) => {
        fireEvent('datasetError', operation, e)
    }

    const getCurrentIndex = () => selectCurrentRecordIndex(getState())
    const getTotalCount = () =>
        recordStore().fold(
            () => null,
            service => service.getMatchingRecordCount(),
        )

    const flushDraft = async function() {
        try {
            await dispatch(recordActions.flushDraft())
            // the save process must return the record as it was returned from wixData, ignoring any
            // changes made to it afterwards (e.g., after save callback). If there was no draft to flush,
            // it must return the current record.
            const updatedRecord =
                selectLastSavedRecord(getState()) || selectCurrentRecord(getState())
            return cloneDeep(updatedRecord)
        } catch (e) {
            fireErrorEvent('save', e)
            throw e
        }
    }

    const addNewItem = async function(atIndex, methodName) {
        assertDatasetReady(getState, methodName)
        assertDatasetLimitations(
            getState,
            methodName, [WRITE, READ_WRITE],
            datasetType,
            false,
        )
        if (atIndex) {
            assertValidNumberArgument('atIndex', atIndex)
        }
        try {
            await flushDraft()
            const currentIndex = getCurrentIndex()
            const newIndex =
                atIndex != null ? atIndex : currentIndex == null ? 0 : currentIndex + 1

            const totalCount = getTotalCount()
            if (newIndex < 0 || (totalCount != null && newIndex > totalCount)) {
                throw new DatasetError('DS_INDEX_OUT_OF_RANGE', 'Invalid index')
            }

            await dispatch(recordActions.newRecord(newIndex))
        } catch (e) {
            fireErrorEvent(methodName, e)
            throw e
        }
    }

    return isForUser => {
        const userCodeZone = isForUser ? logger.userCodeZone : identity

        const baseApi = {
            async isIdle() {
                await new Promise(resolve => {
                    const unregisterIdleCallback = onIdle(() => {
                        unregisterIdleCallback()
                        resolve()
                    })
                })
            },

            onBeforeSave: cb => {
                assertValidCallback('onBeforeSave', cb)
                assertDatasetLimitations(
                    getState,
                    'onBeforeSave', [WRITE, READ_WRITE],
                    datasetType,
                    false,
                )
                return register('beforeSave', userCodeZone(cb))
            },

            onAfterSave: cb => {
                assertValidCallback('onAfterSave', cb)
                assertDatasetLimitations(
                    getState,
                    'onAfterSave', [WRITE, READ_WRITE],
                    datasetType,
                    false,
                )
                return register('afterSave', userCodeZone(cb))
            },

            async save() {
                assertDatasetLimitations(
                    getState,
                    'save', [WRITE, READ_WRITE],
                    datasetType,
                    false,
                )
                const updatedRecord = await flushDraft()
                if (isWriteOnly(getState())) {
                    await dispatch(recordActions.reInitWriteOnly())
                }
                return updatedRecord
            },

            async getItems(fromIndex, numberOfItems) {
                assertDatasetLimitations(
                    getState,
                    'getItems', [READ, READ_WRITE],
                    datasetType,
                    false,
                )
                assertValidNumberArgument('fromIndex', fromIndex)
                assertValidNumberArgument('numberOfItems', numberOfItems)
                try {
                    return await recordActions.doFetch(
                        recordStore,
                        fromIndex,
                        numberOfItems,
                    )
                } catch (e) {
                    fireErrorEvent('getItems', e)
                    throw e
                }
            },

            getTotalCount: () => {
                assertDatasetLimitations(
                    getState,
                    'getTotalCount', [READ, READ_WRITE],
                    datasetType,
                    false,
                )
                return getTotalCount()
            },

            getCurrentItem: () => {
                assertDatasetLimitations(
                    getState,
                    'getCurrentItem', [READ, WRITE, READ_WRITE],
                    datasetType,
                )
                const record = selectCurrentRecord(getState())
                if (!record) {
                    return null
                }
                return cloneDeep(record)
            },

            getCurrentItemIndex: () => {
                assertDatasetLimitations(
                    getState,
                    'getCurrentItemIndex', [READ, READ_WRITE],
                    datasetType,
                )
                const index = selectCurrentRecordIndex(getState())
                if (index === undefined) {
                    return null
                }
                return index
            },

            async setCurrentItemIndex(index) {
                assertScopeIsNotFixedItem(isFixedItem, 'setCurrentItemIndex')
                assertDatasetLimitations(
                    getState,
                    'setCurrentItemIndex', [READ, READ_WRITE],
                    datasetType,
                    false,
                )
                assertValidIndex(index)

                await new Promise(resolve => api.onReady(resolve))

                try {
                    if (!isReadOnly(getState())) {
                        await flushDraft()
                    }
                    await dispatch(recordActions.setCurrentIndex(index))
                } catch (e) {
                    fireErrorEvent('setCurrentItemIndex', e)
                    throw e
                }
            },

            setFieldValue: (fieldName, value) => {
                assertDatasetReady(getState, 'setFieldValue')
                assertDatasetLimitations(
                    getState,
                    'setFieldValue', [WRITE, READ_WRITE],
                    datasetType,
                )
                assertHasCurrentItem(getState)
                dispatch(recordActions.updateFields({
                    [fieldName]: cloneDeep(value)
                }))
            },

            setFieldValues: fieldValues => {
                assertDatasetReady(getState, 'setFieldValues')
                assertDatasetLimitations(
                    getState,
                    'setFieldValues', [WRITE, READ_WRITE],
                    datasetType,
                )
                assertHasCurrentItem(getState)
                dispatch(recordActions.updateFields(mapValues(fieldValues, cloneDeep)))
            },

            async next() {
                assertScopeIsNotFixedItem(isFixedItem, 'next')
                assertDatasetReady(getState, 'next')
                assertDatasetLimitations(
                    getState,
                    'next', [READ, READ_WRITE],
                    datasetType,
                    false,
                )
                try {
                    if (!isReadOnly(getState())) {
                        await flushDraft()
                    }
                    if (!api.hasNext()) {
                        throw new DatasetError(
                            'NO_SUCH_ITEM',
                            'There are no more items in the dataset',
                        )
                    }
                    await dispatch(recordActions.setCurrentIndex(getCurrentIndex() + 1))
                    return api.getCurrentItem()
                } catch (e) {
                    fireErrorEvent('next', e)
                    throw e
                }
            },

            async previous() {
                assertScopeIsNotFixedItem(isFixedItem, 'previous')
                assertDatasetReady(getState, 'previous')
                assertDatasetLimitations(
                    getState,
                    'previous', [READ, READ_WRITE],
                    datasetType,
                    false,
                )
                try {
                    if (!isReadOnly(getState())) {
                        await flushDraft()
                    }
                    if (!api.hasPrevious()) {
                        throw new DatasetError(
                            'NO_SUCH_ITEM',
                            'This is the first item in the dataset',
                        )
                    }
                    await dispatch(recordActions.setCurrentIndex(getCurrentIndex() - 1))
                    return api.getCurrentItem()
                } catch (e) {
                    fireErrorEvent('previous', e)
                    throw e
                }
            },

            hasNext: () => {
                assertDatasetLimitations(
                    getState,
                    'hasNext', [READ, READ_WRITE],
                    datasetType,
                )
                const currentRecordIndex = selectCurrentRecordIndex(getState())
                const totalCount = getTotalCount()
                return (
                    currentRecordIndex != null &&
                    totalCount != null &&
                    currentRecordIndex < totalCount - 1
                )
            },

            hasPrevious: () => {
                assertDatasetLimitations(
                    getState,
                    'hasPrevious', [READ, READ_WRITE],
                    datasetType,
                )
                const currentRecordIndex = selectCurrentRecordIndex(getState())
                return currentRecordIndex != null && currentRecordIndex > 0
            },

            async new(atIndex) {
                return addNewItem(atIndex, 'new')
            },

            async add(atIndex) {
                return addNewItem(atIndex, 'add')
            },

            async remove() {
                assertDatasetReady(getState, 'remove')
                assertDatasetLimitations(
                    getState,
                    'remove', [READ_WRITE],
                    datasetType,
                    false,
                )
                try {
                    const index = getCurrentIndex()
                    if (index == null) {
                        throw new DatasetError('DS_INDEX_OUT_OF_RANGE', 'Invalid index')
                    }
                    await dispatch(recordActions.remove())
                } catch (e) {
                    fireErrorEvent('remove', e)
                    throw e
                }
            },

            async revert() {
                assertDatasetReady(getState, 'revert')
                assertDatasetLimitations(
                    getState,
                    'revert', [WRITE, READ_WRITE],
                    datasetType,
                    false,
                )
                assertHasCurrentItem(getState)
                return dispatch(recordActions.revert())
            },

            async refresh() {
                assertDatasetReady(getState, 'refresh')
                assertDatasetLimitations(
                    getState,
                    'refresh', [READ, WRITE, READ_WRITE],
                    datasetType,
                    false,
                )
                try {
                    await dispatch(recordActions.refresh())
                } catch (e) {
                    fireErrorEvent('refresh', e)
                    throw e
                }
            },

            onCurrentIndexChanged: cb => {
                assertValidCallback('onCurrentIndexChanged', cb)
                assertDatasetLimitations(
                    getState,
                    'onCurrentIndexChanged', [READ_WRITE, READ],
                    datasetType,
                    false,
                )
                return register('currentIndexChanged', userCodeZone(cb))
            },

            onItemValuesChanged: cb => {
                assertValidCallback('onItemValuesChanged', cb)
                assertDatasetLimitations(
                    getState,
                    'onItemValuesChanged', [READ_WRITE, WRITE],
                    datasetType,
                    false,
                )
                return register('itemValuesChanged', userCodeZone(cb))
            },

            onError: cb => {
                assertValidCallback('onError', cb)
                assertDatasetLimitations(
                    getState,
                    'onError', [READ_WRITE, READ, WRITE],
                    datasetType,
                    false,
                )
                return register('datasetError', userCodeZone(cb))
            },

            onReady: cb => {
                assertValidCallback('onReady', cb)
                assertDatasetLimitations(
                    getState,
                    'onReady', [READ, WRITE, READ_WRITE],
                    datasetType,
                    false,
                )
                if (!isDatasetReady(getState())) {
                    return register('datasetReady', userCodeZone(cb))
                } else {
                    Promise.resolve(userCodeZone(cb)()).catch(
                        reportCallbackError('onReady', errorReporter),
                    )
                    return noop
                }
            },

            async setSort(sort) {
                assertScopeIsNotFixedItem(isFixedItem, 'setSort')
                assertDatasetLimitations(
                    getState,
                    'setSort', [READ, READ_WRITE],
                    datasetType,
                    false,
                )
                assertValidSort(sort)

                try {
                    await new Promise(resolve => api.onReady(resolve))

                    if (!isReadOnly(getState())) {
                        await flushDraft()
                    }

                    const buildSort = userCodeZone(() => sort._build())
                    await dispatch(configActions.setSort(cloneDeep(buildSort())))
                } catch (exc) {
                    fireErrorEvent('setSort', exc)
                    throw exc
                }
            },

            async setFilter(filter) {
                assertScopeIsNotFixedItem(isFixedItem, 'setFilter')
                assertDatasetLimitations(
                    getState,
                    'setFilter', [READ, READ_WRITE],
                    datasetType,
                    false,
                )
                assertValidFilter(filter)

                try {
                    await new Promise(resolve => api.onReady(resolve))

                    if (!isReadOnly(getState())) {
                        await flushDraft()
                    }

                    const buildFilter = userCodeZone(() => filter._build())
                    await dispatch(configActions.setFilter(cloneDeep(buildFilter())))
                } catch (exc) {
                    fireErrorEvent('setFilter', exc)
                    throw exc
                }
            },

            loadMore: async () => {
                assertScopeIsNotFixedItem(isFixedItem, 'loadMore')
                assertDatasetReady(getState, 'loadMore')
                assertDatasetLimitations(
                    getState,
                    'loadMore', [READ, READ_WRITE],
                    datasetType,
                    false,
                )
                await dispatch(recordActions.incrementNumOfPagesToShow())
            },

            async nextPage() {
                assertScopeIsNotFixedItem(isFixedItem, 'nextPage')
                assertDatasetReady(getState, 'nextPage')
                assertDatasetLimitations(
                    getState,
                    'nextPage', [READ, READ_WRITE],
                    datasetType,
                    false,
                )
                try {
                    if (!isReadOnly(getState())) {
                        await flushDraft()
                    }
                    if (!api.hasNextPage()) {
                        throw new DatasetError(
                            'NO_SUCH_PAGE',
                            'There are no more pages in the dataset',
                        )
                    }
                    await dispatch(recordActions.nextPage())
                    const {
                        items
                    } = await recordActions.fetchCurrentPage(
                        recordStore,
                        getState(),
                    )
                    return items
                } catch (e) {
                    fireErrorEvent('nextPage', e)
                    throw e
                }
            },

            async previousPage() {
                assertScopeIsNotFixedItem(isFixedItem, 'previousPage')
                assertDatasetReady(getState, 'previousPage')
                assertDatasetLimitations(
                    getState,
                    'previousPage', [READ, READ_WRITE],
                    datasetType,
                    false,
                )
                try {
                    if (!isReadOnly(getState())) {
                        await flushDraft()
                    }
                    if (!api.hasPreviousPage()) {
                        throw new DatasetError(
                            'NO_SUCH_PAGE',
                            'This is the first page in the dataset',
                        )
                    }
                    await dispatch(recordActions.previousPage())
                    const {
                        items
                    } = await recordActions.fetchCurrentPage(
                        recordStore,
                        getState(),
                    )
                    return items
                } catch (e) {
                    fireErrorEvent('previousPage', e)
                    throw e
                }
            },

            hasNextPage() {
                assertDatasetLimitations(
                    getState,
                    'hasNextPage', [READ, READ_WRITE],
                    datasetType,
                )
                const state = getState()
                const paginationData = getPaginationData(state)
                return (
                    paginationData.offset + getCurrentPageSize(state) < getTotalCount()
                )
            },

            hasPreviousPage() {
                assertDatasetLimitations(
                    getState,
                    'hasPreviousPage', [READ, READ_WRITE],
                    datasetType,
                )
                const paginationData = getPaginationData(getState())
                return paginationData.offset > 0
            },

            getTotalPageCount() {
                assertDatasetLimitations(
                    getState,
                    'getTotalPageCount', [READ, READ_WRITE],
                    datasetType,
                )

                return getTotalPageCount(getState(), getTotalCount())
            },

            getCurrentPageIndex() {
                assertDatasetLimitations(
                    getState,
                    'getCurrentPageIndex', [READ, READ_WRITE],
                    datasetType,
                )

                return getCurrentIndex() === undefined ?
                    null :
                    getCurrentPageIndex(getState())
            },

            async loadPage(pageNumber) {
                assertDatasetLimitations(
                    getState,
                    'loadPage', [READ, READ_WRITE],
                    datasetType,
                    false,
                )
                assertScopeIsNotFixedItem(isFixedItem, 'loadPage')
                assertDatasetReady(getState, 'loadPage')
                assertValidPageIndex(pageNumber, api.getTotalPageCount())

                try {
                    if (!isReadOnly(getState())) {
                        await flushDraft()
                    }
                    await dispatch(recordActions.loadPage(pageNumber))
                    const {
                        items
                    } = await recordActions.fetchCurrentPage(
                        recordStore,
                        getState(),
                    )
                    return items
                } catch (e) {
                    fireErrorEvent('loadPage', e)
                    throw e
                }
            },

            handshake(handshakeInfo) {
                //details controller
                assertDatasetLimitations(
                    getState,
                    'handshake', [READ, READ_WRITE, WRITE],
                    datasetType,
                    false,
                )
                assetValidHandshakeInfo(handshakeInfo)

                handshakes.push(handshakeInfo)
                performHandshake(dependenciesManager, dispatch, handshakeInfo)
            },

            inScope: (compId, itemId) => {
                assertDatasetLimitations(
                    getState,
                    'inScope', [READ, WRITE, READ_WRITE],
                    datasetType,
                    false,
                )
                const controller = controllerStore.getController({
                    compId,
                    itemId,
                })
                return controller ? controller.staticExports : api
            },

            isConnectedToComponent: compId => {
                assertDatasetLimitations(
                    getState,
                    'isConnectedToComponent', [READ, WRITE, READ_WRITE],
                    datasetType,
                    false,
                )
                return getConnectedComponentIds().includes(compId)
            },

            getPageSize: () => {
                assertDatasetLimitations(
                    getState,
                    'getPageSize', [READ, READ_WRITE],
                    datasetType,
                )
                return getPaginationData(getState()).size
            },

            async setPageSize(size) {
                assertDatasetLimitations(
                    getState,
                    'setPageSize', [READ, READ_WRITE],
                    datasetType,
                    false,
                )
                assertValidNaturalNumber('size', size)

                await new Promise(resolve => api.onReady(resolve))

                try {
                    if (!isReadOnly(getState())) {
                        await flushDraft()
                    }
                    await dispatch(datasetActions.setPaginationData({
                        size
                    }))
                } catch (e) {
                    fireErrorEvent('setPageSize', e)
                    throw e
                }
            },
        }

        const routerDatasetApi = routerDatasetApiCreator({
            datasetType,
            siblingDynamicPageUrlGetter,
        })

        const mergedApi = Object.assign(baseApi, routerDatasetApi)
        const api = {}
        const wrappedApi = {}
        const shouldBeWrappedWithVerbose = shouldWrapWithVerbose(verboseReporter)

        for (const functionName in mergedApi) {
            api[functionName] = shouldBeWrappedWithVerbose ?
                verboseWrapper(verboseReporter, mergedApi[functionName], functionName) :
                mergedApi[functionName]

            wrappedApi[functionName] = flow(
                logger.applicationCodeZone,
                addBreadcrumb(functionName),
            )(api[functionName])
        }

        return wrappedApi
    }
}

export default datasetApiCreator