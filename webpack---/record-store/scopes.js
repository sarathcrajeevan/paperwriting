'use strict'

import {
    flow
} from 'lodash-es'
import {
    Maybe
} from '@wix/wix-code-adt'
import {
    assign,
    bind
} from './utils'
import {
    getRecordId
} from './records'

const freshScope = () => ({
    records: [],
    numMatchingRecords: null,
    numSeedRecords: 0,
    newRecordMarkers: [],
})

const setScopeRecords = records => assign({
    records
})

const updateNumMatchingRecords = fn => scope => ({
    ...scope,
    numMatchingRecords: fn(scope.numMatchingRecords),
})

const setNumMatchingRecords = numMatchingRecords => scope => ({
    ...scope,
    numMatchingRecords: numMatchingRecords + newRecordMarkersOffset(scope),
})

const setNumSeedRecords = scope => ({
    ...scope,
    numSeedRecords: scope.records.length,
})

const setSeedInScope = seed =>
    seed.matchWith({
        Empty: () => setNumMatchingRecords(0),
        Results: ({
                items,
                totalCount,
                offset
            }) =>
            flow(
                setScopeRecords(items.map(item => getRecordId(item))),
                setNumMatchingRecords(totalCount),
                setNumSeedRecords,
            ),
    })

const setNewRecordMarkers = newRecordMarkers => assign({
    newRecordMarkers
})

const updateNewRecordMarkers = fn => scope => ({
    ...scope,
    newRecordMarkers: fn(scope.newRecordMarkers),
})

const newRecordMarkersOffset = (scope, index) =>
    scope.newRecordMarkers.filter(marker => index == null || marker <= index)
    .length

const storeResultsInScope = queryResult =>
    queryResult.matchWith({
        Empty: () => setNumMatchingRecords(0),
        Results: ({
                items,
                totalCount,
                offset
            }) =>
            flow(
                setNumMatchingRecords(totalCount),
                items.length > 0 ? mergeRecords(offset, items) : _ => _,
            ),
    })

const mergeRecords = (
    startIndex,
    addedRecords, {
        overwrite = true,
        fixIndex = true
    } = {},
) => {
    const doMerge = scope => {
        const correctedStartIndex =
            startIndex + (fixIndex ? newRecordMarkersOffset(scope, startIndex) : 0)
        const padLength = Math.max(0, correctedStartIndex - scope.records.length)
        const tailIndex =
            correctedStartIndex + (overwrite ? addedRecords.length : 0)

        return scope.records
            .slice(0, correctedStartIndex)
            .concat(new Array(padLength))
            .concat(addedRecords.map(record => getRecordId(record)))
            .concat(scope.records.slice(tailIndex))
    }

    return bind(doMerge, setScopeRecords)
}

const overwriteRecordAtIndex = (at, record) =>
    mergeRecords(at, [record], {
        fixIndex: false
    })

const insertRecordAtIndex = (at, record) =>
    mergeRecords(at, [record], {
        overwrite: false,
        fixIndex: false
    })

const removeRecordById = id =>
    bind(
        scope => scope.records.filter(recordId => recordId !== id),
        setScopeRecords,
    )

const recordIndexById = (id, scope) => scope.records.indexOf(id)

const scopeHasRecord = id => scope => scope.records.includes(id)

const findLastIndex = (predicate, records) => {
    if (records.length > 0) {
        for (let i = records.length - 1; i >= 0; i = i - 1) {
            if (predicate(records[i])) {
                return i
            }
        }
    }

    return -1
}

const calculateMissingRange = (scope, from, to) => {
    const requestedRange = scope.records.slice(from, to)

    const firstMissingIndexIfAny = requestedRange.findIndex(isExistingRecord)
    const lastMissingIndexIfAny = findLastIndex(isExistingRecord, requestedRange)

    const firstMissingIndex = getMissingIndex(firstMissingIndexIfAny, from)
    const lastMissingIndex = getMissingIndex(lastMissingIndexIfAny, to)

    const indexCorrection = newRecordMarkersOffset(scope, firstMissingIndex)
    const correctedFirstMissingIndex = firstMissingIndex - indexCorrection
    const correctedLastMissingIndex = lastMissingIndex - indexCorrection
    const numMissingRecords =
        correctedLastMissingIndex - correctedFirstMissingIndex

    return numMissingRecords === 0 ?
        Maybe.Nothing() :
        Maybe.Just({
            from: correctedFirstMissingIndex,
            length: numMissingRecords,
        })

    function isExistingRecord(record) {
        return typeof record !== 'string'
    }

    function getMissingIndex(missingIndexIfAny, requestedIndex) {
        return missingIndexIfAny === -1 ?
            Math.max(scope.records.length, requestedIndex) :
            firstMissingIndexIfAny + requestedIndex
    }
}

export {
    calculateMissingRange,
    freshScope,
    insertRecordAtIndex,
    newRecordMarkersOffset,
    overwriteRecordAtIndex,
    recordIndexById,
    removeRecordById,
    scopeHasRecord,
    setNewRecordMarkers,
    setSeedInScope,
    storeResultsInScope,
    updateNewRecordMarkers,
    updateNumMatchingRecords,
}