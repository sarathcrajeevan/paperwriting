'use strict'

import {
    flow,
    isPlainObject,
    curry,
    mapValues
} from 'lodash-es'
import QueryResults from '../helpers/queryResults'
import {
    assign,
    bind
} from './utils'
import {
    cleanseRecord,
    createDraft,
    getRecordId,
    markRecordDirty,
    mergeRecord,
} from './records'

const freshCollection = () => ({
    records: {},
    drafts: {},
    scopes: {},
})

const insertToObjectMap = (accessor, idFn, items) => object =>
    Object.assign({},
        accessor(object),
        ...items.map(item => ({
            [idFn(item)]: item
        })),
    )

const updateInObjectMap = (accessor, id, updateFn) => object => ({
    ...accessor(object),
    [id]: updateFn(accessor(object)[id]),
})

const removeFromObjectMap = (accessor, id) => object =>
    Object.assign({},
        ...Object.keys(accessor(object))
        .filter(mapId => mapId !== id)
        .map(mapId => ({
            [mapId]: accessor(object)[mapId]
        })),
    )

const setCollectionRecords = records => assign({
    records
})

const setDrafts = drafts => assign({
    drafts
})

const setScope = curry((key, scope, collection) =>
    assign({
        scopes: {
            ...collection.scopes,
            [key]: scope,
        },
    })(collection),
)

const getScope = scopeKey => collection => collection.scopes[scopeKey]

const iterateScopes = (iterateFn, predicate, collection) =>
    Object.keys(collection.scopes)
    .filter(key => predicate(collection.scopes[key], key))
    .map(key => iterateFn(collection.scopes[key], key))

const insertRecords = records =>
    bind(
        insertToObjectMap(({
            records
        }) => records, getRecordId, records),
        setCollectionRecords,
    )

const insertRecord = record => insertRecords([record])

const insertDrafts = drafts =>
    bind(
        insertToObjectMap(({
            drafts
        }) => drafts, getRecordId, drafts),
        setDrafts,
    )

const insertDraft = draft => insertDrafts([draft])

const removeRecord = recordId =>
    bind(
        removeFromObjectMap(({
            records
        }) => records, recordId),
        setCollectionRecords,
    )

const removeDraft = draft =>
    bind(
        removeFromObjectMap(({
            drafts
        }) => drafts, getRecordId(draft)),
        setDrafts,
    )

const resetDraft = (draft, defaultDraft) =>
    bind(
        updateInObjectMap(
            ({
                drafts
            }) => drafts,
            getRecordId(draft),
            d => createDraft(defaultDraft, d._id),
        ),
        setDrafts,
    )

const clearDrafts = () => setDrafts({})

const updateScope = (scopeKey, updateFn) =>
    bind(flow(getScope(scopeKey), updateFn), setScope(scopeKey))

const storeQueryResults = queryResult =>
    queryResult.matchWith({
        Empty: () => _ => _,
        Results: ({
                items,
                totalCount,
                offset
            }) =>
            items.length > 0 ? insertRecords(items) : _ => _,
    })

const updateRecordFields = (recordId, fieldValues) =>
    bind(
        updateInObjectMap(
            ({
                drafts
            }) => drafts,
            recordId,
            draft => ({
                ...markRecordDirty(draft),
                ...fieldValues,
            }),
        ),
        setDrafts,
    )

const doesRecordExist = (id, collection) => !!collection.records[id]

const getDraftOrRecord = (id, collection) => {
    if (isPlainObject(collection.records[id])) {
        const mergedRecord = mergeRecord(
            collection.records[id],
            collection.drafts[id],
        )

        return mergedRecord
    } else {
        return isPlainObject(collection.drafts[id]) ?
            mergeRecord(collection.drafts[id]) :
            null
    }
}

const readFromCollection = (
    scopeKey,
    fromIndex,
    toIndex,
    collection,
    allowMissing = false,
) => {
    const scope = getScope(scopeKey)(collection)
    const numRequestedRecords = toIndex - fromIndex
    const requestedRecordsSlice = scope.records.slice(fromIndex, toIndex)
    const matchingRecords = requestedRecordsSlice.reduce((acc, id) => {
        const record = getDraftOrRecord(id, collection)
        return record != null ? acc.concat(cleanseRecord(record)) : acc
    }, [])

    return QueryResults.of({
        items: matchingRecords,
        totalCount: scope.numMatchingRecords || 0,
        offset: fromIndex,
    }).filter(hasRequestedMatchingItems)

    function hasRequestedMatchingItems({
        items
    }) {
        return allowMissing || items.length >= numRequestedRecords
    }
}

const fromWarmupCollection = collection => {
    const fromWarmupScope = ({
        records,
        numMatchingRecords,
        numSeedRecords,
        newRecordMarkers,
    }) => {
        const recordsWithoutDrafts = records.filter(
            (_, i) => !newRecordMarkers.includes(i),
        )

        return {
            records: recordsWithoutDrafts,
            numMatchingRecords: numMatchingRecords - newRecordMarkers.length,
            numSeedRecords: recordsWithoutDrafts.length,
            newRecordMarkers: [],
        }
    }

    return {
        records: collection.records,
        drafts: {},
        scopes: mapValues(collection.scopes, fromWarmupScope),
    }
}

const curriedIterateScopes = curry(iterateScopes)
const curriedReadFromCollection = curry(readFromCollection)
const curriedUpdateScope = curry(updateScope)

export {
    clearDrafts,
    doesRecordExist,
    freshCollection,
    fromWarmupCollection,
    getDraftOrRecord,
    getScope,
    insertDraft,
    insertRecord,
    removeDraft,
    removeRecord,
    resetDraft,
    setScope,
    storeQueryResults,
    updateRecordFields,
    curriedIterateScopes as iterateScopes,
    curriedReadFromCollection as readFromCollection,
    curriedUpdateScope as updateScope,
}