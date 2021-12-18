'use strict'

import {
    memoize,
    flow,
    times,
    flatten,
    isEmpty,
    isEqual,
    isPlainObject,
    some,
    every,
    cloneDeep,
} from 'lodash-es'
import {
    Maybe,
    Result
} from '@wix/wix-code-adt'
import {
    breadcrumbWrapper,
    traceCreators
} from '../logger'
import sequence from '@wix/dbsm-common/src/fp/sequence'
import * as readWriteModes from '@wix/wix-data-client-common/src/dataset-configuration/readWriteModes'
import QueryResults from '../helpers/queryResults'
import {
    cleanseRecord,
    createDraft,
    getRecordId,
    hasDraft,
    isRecordPristine,
} from './records'
import {
    calculateMissingRange,
    freshScope,
    insertRecordAtIndex,
    overwriteRecordAtIndex,
    recordIndexById,
    removeRecordById,
    scopeHasRecord,
    setNewRecordMarkers,
    setSeedInScope,
    storeResultsInScope,
    updateNewRecordMarkers,
    updateNumMatchingRecords,
} from './scopes'
import {
    clearDrafts,
    doesRecordExist,
    freshCollection,
    getDraftOrRecord,
    getScope,
    insertDraft,
    insertRecord,
    iterateScopes,
    readFromCollection,
    removeDraft,
    removeRecord,
    resetDraft,
    setScope,
    storeQueryResults,
    updateRecordFields,
    updateScope,
} from './collections'
import {
    freshStore,
    fromWarmupStore,
    getCollection,
    setCollection,
    updateCollection,
} from './store'
import {
    registrar,
    memoize as memoizeWithCacheKey
} from './utils'
import {
    getSchemaMaxPageSize
} from '../data/utils'

const WIXDATA_MAX_RECORD_LIMIT = 1000
const ignoreArgs = ['setFieldsValues', 'newRecord']

const modeIsWriteOnly = readWriteType => readWriteType === readWriteModes.WRITE

const resolveCacheKey = ([{
    datasetId
}]) => datasetId
/* areFiltersEqual - this check was used because of performance (10x faster than a simplest deep equality function,
100x time faster (for first call) than lodash isEqual). In common cases filters objects will keep the same order of
properties. In worse case when filters are the same but an order of properties differs, filters will be identified like
different and cache result will not be used */
const areFiltersEqual = (filter, anotherFilter) =>
    JSON.stringify(filter) === JSON.stringify(anotherFilter)
const shouldUseCachedResult = ([currentArg], [cachedArg]) =>
    every(currentArg, (arg, propertyName) =>
        propertyName === 'filter' ?
        areFiltersEqual(arg, cachedArg[propertyName]) :
        arg === cachedArg[propertyName],
    )

const serviceCreator = ({
    primaryDatasetId,
    recordStoreCache,
    refreshStoreCache,
    warmupStore,
    dataProvider,
    mainCollectionName,
    includes,
    uniqueFieldValues,
    readWriteType,
    logger,
}) => {
    const getStore = () => recordStoreCache[primaryDatasetId]
    const setStore = newStore => {
        recordStoreCache[primaryDatasetId] = newStore
    }

    if (
        isEmpty(getStore()) ||
        refreshStoreCache ||
        modeIsWriteOnly(readWriteType)
    ) {
        setStore(
            isEmpty(warmupStore) ?
            freshStore(mainCollectionName) :
            fromWarmupStore(warmupStore), //TODO: seems like we don't need it.
        )
    }

    const onChangeHandlers = []

    const service = memoizeWithCacheKey(
        ({
            pageSize,
            sort,
            filter,
            datasetId,
            allowWixDataAccess,
            referencedCollectionName,
            fixedRecordId,
        }) => {
            const collectionName =
                referencedCollectionName != null ?
                referencedCollectionName :
                mainCollectionName

            const scopeKey = JSON.stringify({
                filter,
                sort
            })
            const getCurrentCollection = getCollection(collectionName)
            const updateCurrentCollection = updateCollection(collectionName)
            const getCurrentScope = flow(getCurrentCollection, getScope(scopeKey))
            const updateCurrentScope = updateScope(scopeKey)
            const getCurrentCollectionSchema = () =>
                dataProvider.getSchema(collectionName)

            // pageAlign :: Integer -> Integer
            const pageAlignedFromIndex = from => from - (from % pageSize)

            // pageAlign :: (Integer, Integer) -> Integer
            const pageAlignedToIndex = (from, to) =>
                Math.ceil(
                    (pageAlignedFromIndex(from) + (to - pageAlignedFromIndex(from))) /
                    pageSize,
                ) * pageSize

            // findRecords :: (Integer, Integer) -> Promise QueryResults
            const findRecords = memoize((offset, length) => {
                if (!allowWixDataAccess) {
                    return Promise.resolve(QueryResults.Empty())
                }

                return logger.traceAsync(
                    traceCreators.findRecords({
                        collectionName,
                        filter,
                        sort,
                        offset,
                        length,
                    }),
                    () =>
                    dataProvider
                    .getData({
                        collectionId: collectionName,
                        filter,
                        sort,
                        offset,
                        length,
                        includes: referencedCollectionName != null ? undefined : includes,
                        uniqueFieldValues,
                    })
                    .then(wixDataQueryResults => {
                        return QueryResults.fromWixDataQueryResults(
                            wixDataQueryResults,
                            offset,
                        )
                    }),
                )
            })

            // fetchMissingRanges :: (Scope, Integer, Integer) -> Promise ([QueryResults])
            const fetchMissingRange = (scope, fromIndex, toIndex) => {
                const fetchFrom = pageAlignedFromIndex(fromIndex)
                const fetchTo = pageAlignedToIndex(fromIndex, toIndex)
                const limit =
                    getSchemaMaxPageSize(getCurrentCollectionSchema()) ||
                    WIXDATA_MAX_RECORD_LIMIT

                const missingRange = calculateMissingRange(scope, fetchFrom, fetchTo)
                const correctedRange = missingRange.map(({
                        from,
                        length
                    }) =>
                    length <= limit ?
                    [{
                        from,
                        length
                    }] :
                    flatten(
                        times(Math.ceil(length / limit), x => [{
                            from: from + x * limit,
                            length: Math.min(limit, length - x * limit),
                        }, ]),
                    ),
                )

                return Promise.all(
                    correctedRange
                    .getOrElse([])
                    .map(({
                        from,
                        length
                    }) => findRecords(from, length)),
                )
            }

            const notify = (before, after, componentIdToExclude) =>
                sequence(
                    Result,
                    onChangeHandlers.map(handler =>
                        Result.try(() =>
                            handler(
                                before != null ? cleanseRecord(before) : null,
                                after != null ? cleanseRecord(after) : null,
                                componentIdToExclude,
                            ),
                        ),
                    ),
                )

            // runApiCommand
            //   :: (([Store -> Store] -> (), Record, Integer, [*]) -> *, () -> *, Integer, [*]) -> *
            const runApiCommand = (f, g, index, ...args) => {
                const recordId = getCurrentScope(getStore()).records[index]
                const record = getDraftOrRecord(
                    recordId,
                    getCurrentCollection(getStore()),
                )

                if (record == null) {
                    return g()
                } else {
                    const update = (...handlers) => {
                        setStore(flow(...handlers)(getStore()))
                    }

                    const notifyIfChanged = componentIdToExclude => {
                        const updatedRecord = getDraftOrRecord(
                            recordId,
                            getCurrentCollection(getStore()),
                        )
                        if (!isEqual(record, updatedRecord)) {
                            return notify(record, updatedRecord, componentIdToExclude)
                        } else {
                            return Result.Ok([])
                        }
                    }

                    return f({
                        update,
                        notifyIfChanged
                    }, record, index, ...args)
                }
            }

            // withRecordByIndex
            //   :: (([Store -> Store] -> (), Record, Integer, [*]) -> *, () -> *) -> (Integer, [*]) -> *
            const withRecordByIndex =
                (f, g) =>
                (index, ...args) => {
                    return runApiCommand(f, g, index, ...args)
                }

            // withRecordByIndexAsync
            //   :: (([Store -> Store] -> (), Record, Integer, [*]) -> *, () -> *) -> (Integer, [*]) -> *
            const withRecordByIndexAsync =
                (f, g) =>
                async (index, ...args) => {
                    return runApiCommand(f, g, index, ...args)
                }

            // sanitise :: * -> *
            const sanitise = something => {
                const go = object =>
                    Object.keys(object)
                    .filter(key => key.startsWith('_'))
                    .reduce(
                        (acc, key) =>
                        Object.assign(acc, {
                            [key]: isPlainObject(object[key]) ?
                                go(object[key]) :
                                object[key],
                        }), {},
                    )

                if (QueryResults.Results.hasInstance(something)) {
                    return something.map(({
                        items
                    }) => {
                        const sanitisedItems = items.map(item => go(item))

                        return {
                            items: sanitisedItems
                        }
                    })
                } else if (typeof something === 'object' && something) {
                    return go(something)
                } else {
                    return something
                }
            }

            // createBreadcrumb :: (String, [*]) -> Breadcrumb
            const createBreadcrumb = (fnName, args = []) => ({
                category: 'recordStore',
                level: 'info',
                message: `${fnName}(${
          ignoreArgs.includes(fnName)
            ? `..${args.length} arguments..`
            : args.map(value => JSON.stringify(value)).join(', ')
        }) (${datasetId})`,
                data: {
                    scope: scopeKey,
                },
            })

            const {
                withBreadcrumbs,
                withBreadcrumbsAsync
            } = breadcrumbWrapper(
                logger,
                createBreadcrumb,
                sanitise,
            )

            const isNewRecord = record =>
                record &&
                !doesRecordExist(getRecordId(record), getCurrentCollection(getStore()))

            const api = {
                // getRecords :: (Integer, Integer) -> Promise QueryResults
                getRecords: withBreadcrumbsAsync(
                    'getRecords',
                    async (fromIndex, length) => {
                        const totalMatchingRecords = getCurrentScope(
                            getStore(),
                        ).numMatchingRecords
                        const toIndex =
                            typeof totalMatchingRecords === 'number' ?
                            Math.min(fromIndex + length, totalMatchingRecords) :
                            fromIndex + length
                        const reader = readFromCollection(scopeKey, fromIndex, toIndex)

                        return reader(
                            getCurrentCollection(getStore()),
                            modeIsWriteOnly(readWriteType) || totalMatchingRecords === 0,
                        ).orElse(async () => {
                            const missingRange = await fetchMissingRange(
                                getCurrentScope(getStore()),
                                fromIndex,
                                toIndex,
                            )
                            const notifyUpdatedRecords = (old, current) =>
                                Object.keys(old.records)
                                .filter(
                                    key =>
                                    isPlainObject(current.records[key]) &&
                                    current.records[key]._updatedDate >
                                    old.records[key]._updatedDate,
                                )
                                .forEach(key =>
                                    notify(old.records[key], current.records[key]),
                                )
                            const go = updateCurrentCollection(
                                flow(
                                    ...missingRange.map(range =>
                                        flow(
                                            storeQueryResults(range),
                                            updateCurrentScope(storeResultsInScope(range)),
                                        ),
                                    ),
                                ),
                            )

                            const oldStore = getStore()
                            setStore(go(getStore()))
                            notifyUpdatedRecords(
                                getCurrentCollection(oldStore),
                                getCurrentCollection(getStore()),
                            )
                            return reader(getCurrentCollection(getStore()), true)
                        })
                    },
                ),

                // eventually should be replaced by getDistinctRecords
                getRecordsLimitedByMaxPageSize: (fromIndex, length) => {
                    const limit = Math.min(
                        length,
                        getSchemaMaxPageSize(getCurrentCollectionSchema()) || length,
                    )

                    return api.getRecords(fromIndex, limit)
                },

                // seed :: () -> Promise ()
                seed: withBreadcrumbsAsync('seed', () => {
                    if (getCurrentScope(getStore()).numSeedRecords === 0) {
                        const request = fixedRecordId ?
                            dataProvider.getData({
                                collectionId: collectionName,
                                filter,
                                sort,
                                offset: 0,
                                length: pageSize,
                                includes: referencedCollectionName != null ? undefined : includes,
                                uniqueFieldValues,
                            }) :
                            dataProvider.getDataFromBulk({
                                datasetId: primaryDatasetId,
                                collectionId: collectionName,
                                filter,
                                sort,
                                length: pageSize,
                                includes,
                                uniqueFieldValues,
                            })

                        return request.then(data => {
                            const queryResult = QueryResults.fromWixDataQueryResults(data, 0)
                            const go = updateCurrentCollection(
                                flow(
                                    storeQueryResults(queryResult),
                                    updateCurrentScope(setSeedInScope(queryResult)),
                                ),
                            )

                            setStore(go(getStore()))
                        })
                    } else {
                        return Promise.resolve()
                    }
                }),

                getTheStore: getStore,

                // getSeedRecords :: () -> QueryResults
                getSeedRecords: withBreadcrumbs('getSeedRecords', () =>
                    readFromCollection(
                        scopeKey,
                        0,
                        getCurrentScope(getStore()).numSeedRecords,
                        getCurrentCollection(getStore()),
                        true,
                    ),
                ),

                // getTotalCount :: () -> Integer
                getMatchingRecordCount: withBreadcrumbs(
                    'getMatchingRecordCount',
                    () => getCurrentScope(getStore()).numMatchingRecords || 0,
                ),

                // getRecordById :: RecordId -> Maybe Record
                getRecordById: withBreadcrumbs('getRecordById', recordId => {
                    return Maybe.fromNullable(
                        getCurrentCollection(getStore()).records[recordId],
                    )
                }),

                // removeRecord :: Integer -> Promise (Result)
                // recordId is a maybe because new records don't have IDs
                removeRecord: withBreadcrumbsAsync(
                    'removeRecord',
                    withRecordByIndexAsync(
                        async ({
                            update,
                            notifyIfChanged
                        }, record, index) => {
                            const recordId = getRecordId(record)
                            if (!isNewRecord(record) && recordId) {
                                await dataProvider.remove({
                                    collectionId: collectionName,
                                    recordId,
                                })
                            }
                            findRecords.cache.clear()
                            const doUpdateMarkers = recordIndex => markers =>
                                markers.filter(marker => marker !== recordIndex)
                            const updateScopesFlow = iterateScopes(
                                (scope, scopeKey) =>
                                updateScope(
                                    scopeKey,
                                    flow(
                                        removeRecordById(recordId),
                                        updateNumMatchingRecords(x => (x != null ? x - 1 : null)),
                                        updateNewRecordMarkers(
                                            doUpdateMarkers(recordIndexById(recordId, scope)),
                                        ),
                                    ),
                                ),
                                scopeHasRecord(recordId),
                                getCurrentCollection(getStore()),
                            )
                            update(
                                updateCurrentCollection(
                                    flow(
                                        flow(removeDraft(record), removeRecord(recordId)),
                                        ...updateScopesFlow,
                                    ),
                                ),
                            )
                            return notifyIfChanged()
                        },
                        () => {
                            return Promise.resolve(
                                Result.Error('cannot remove record: index not found'),
                            )
                        },
                    ),
                ),

                // reset :: () -> ()
                reset: withBreadcrumbs('reset', () => {
                    findRecords.cache.clear()
                    setStore(
                        updateCurrentCollection(
                            flow(setScope(scopeKey, freshScope()), clearDrafts()),
                        )(getStore()),
                    )
                }),

                // newRecord :: (Integer, DefaultDraft) -> ()
                newRecord: withBreadcrumbs('newRecord', (index, defaultDraft) => {
                    // There Can Only Be One new record
                    const draft = createDraft(defaultDraft)
                    const go = updateCurrentCollection(
                        flow(
                            insertDraft(draft),
                            updateCurrentScope(
                                flow(
                                    updateNumMatchingRecords(x => x + 1),
                                    setNewRecordMarkers([index]),
                                    insertRecordAtIndex(index, draft),
                                ),
                            ),
                        ),
                    )

                    setStore(go(getStore()))
                    notify(null, draft)
                    return cleanseRecord(draft)
                }),

                // save :: Integer -> Promise(Record)
                saveRecord: withBreadcrumbsAsync(
                    'saveRecord',
                    withRecordByIndexAsync(
                        async ({
                            update,
                            notifyIfChanged
                        }, record, index) => {
                            const postSaveRecord = await dataProvider.save({
                                collectionId: collectionName,
                                record: cleanseRecord(record),
                                includeReferences: true,
                            })
                            const doUpdateMarkers = markers =>
                                markers.filter(marker => marker !== index)
                            update(
                                updateCurrentCollection(
                                    flow(
                                        insertRecord(postSaveRecord),
                                        removeDraft(record),
                                        updateCurrentScope(
                                            flow(
                                                overwriteRecordAtIndex(index, postSaveRecord),
                                                updateNewRecordMarkers(doUpdateMarkers),
                                            ),
                                        ),
                                    ),
                                ),
                            )
                            notifyIfChanged()

                            return cleanseRecord(postSaveRecord)
                        },
                        () => {
                            return Promise.reject(
                                new Error('cannot save record: index not found'),
                            )
                        },
                    ),
                ),

                // setFieldsValues :: (Integer, FieldsValues) -> Result
                setFieldsValues: withBreadcrumbs(
                    'setFieldsValues',
                    withRecordByIndex(
                        ({
                                update,
                                notifyIfChanged
                            },
                            record,
                            _,
                            fieldValues,
                            componentIdToExclude,
                        ) => {
                            if (Object.keys(fieldValues).length) {
                                update(
                                    updateCurrentCollection(
                                        updateRecordFields(getRecordId(record), fieldValues),
                                    ),
                                )
                            }
                            return notifyIfChanged(componentIdToExclude)
                        },
                        () => Result.Error('cannot update field values: index not found'),
                    ),
                ),

                // isPristine :: Integer -> Boolean
                isPristine: withBreadcrumbs(
                    'isPristine',
                    withRecordByIndex(
                        (_, record) => isRecordPristine(record),
                        () => true,
                    ),
                ),

                // hasDraft :: Integer -> Boolean
                hasDraft: withBreadcrumbs(
                    'hasDraft',
                    withRecordByIndex(
                        (_, record) => hasDraft(record),
                        () => false,
                    ),
                ),

                // isNewRecord :: Integer -> Boolean
                isNewRecord: withBreadcrumbs(
                    'isNewRecord',
                    withRecordByIndex(
                        (_, record) => isNewRecord(record),
                        () => true,
                    ),
                ),

                clearDrafts: withBreadcrumbs('clearDrafts', () => {
                    setStore(updateCurrentCollection(clearDrafts())(getStore()))
                }),

                // resetDraft :: (Integer, DefaultDraft) -> Result
                resetDraft: withBreadcrumbs(
                    'resetDraft',
                    withRecordByIndex(
                        ({
                            update,
                            notifyIfChanged
                        }, record, index, defaultDraft) => {
                            update(
                                updateCurrentCollection(
                                    isNewRecord(record) ?
                                    resetDraft(record, defaultDraft) :
                                    removeDraft(record),
                                ),
                            )
                            return notifyIfChanged()
                        },
                        () => Result.Error('cannot reset draft: index not found'),
                    ),
                ),

                hasSeedData: withBreadcrumbs(
                    'hasSeedData',
                    () => getCurrentScope(getStore()).numSeedRecords > 0,
                ),

                getUniqueFieldValues: withBreadcrumbs(
                    'getUniqueFieldValues',
                    fieldKey =>
                    dataProvider.getUniqueFieldValues({
                        collectionId: collectionName,
                        fieldKey,
                    }),
                ),
            }

            if (!getCurrentCollection(getStore())) {
                setStore(setCollection(collectionName, freshCollection())(getStore()))
            }

            if (!getCurrentCollection(getStore()).scopes[scopeKey]) {
                const initScope = []

                if (fixedRecordId) {
                    const record =
                        dataProvider.getRecord({
                            // TODO: case for repeater whose data is set via userCode. We should everything only via datasetAPI
                            collectionId: collectionName,
                            recordId: fixedRecordId,
                            includes,
                        }) ||
                        getDraftOrRecord(fixedRecordId, getCurrentCollection(getStore()))
                    const items = record ? [record] : []

                    // TODO: refactor, a lot of transformations for consistency with fp record store
                    const seedData = QueryResults.fromWixDataQueryResults({
                            items,
                            totalCount: items.length
                        },
                        0,
                    )
                    const seed = seedData.matchWith({
                        Empty: Maybe.Nothing,
                        Results: flow(QueryResults.of, Maybe.Just),
                    })

                    if (some(items, isNewRecord)) {
                        initScope.push(storeQueryResults(seedData))
                    }
                    seed.fold(
                        () => {
                            initScope.push(setScope(scopeKey, freshScope()))
                        },
                        seedData => {
                            initScope.push(
                                setScope(scopeKey, setSeedInScope(seedData)(freshScope())),
                            )
                        },
                    )
                } else {
                    initScope.push(setScope(scopeKey, freshScope()))
                }

                setStore(updateCurrentCollection(flow(...initScope))(getStore()))
            }

            api.externalApi = {
                // This is the single place, where all adapters and datasetApi are integrated one way or another with logic of fetching data
                // So this tiny improvements guarantees nobody will influence our data by reference
                getRecords: async (fromIndex, length) =>
                    (await api.getRecords(fromIndex, length)).map(
                        ({
                            items,
                            ...rest
                        }) => ({
                            items: cloneDeep(items),
                            ...rest
                        }),
                    ),
                getSeedRecords: () =>
                    api.getSeedRecords().map(({
                        items,
                        ...rest
                    }) => ({
                        items: cloneDeep(items),
                        ...rest,
                    })),
                getRecordsLimitedByMaxPageSize: async (fromIndex, length) =>
                    (await api.getRecordsLimitedByMaxPageSize(fromIndex, length)).map(
                        ({
                            items,
                            ...rest
                        }) => ({
                            items: cloneDeep(items),
                            ...rest
                        }),
                    ),
            }

            return api
        },
        resolveCacheKey,
        shouldUseCachedResult,
    )

    service.onChange = registrar(onChangeHandlers)

    return service
}

export default serviceCreator