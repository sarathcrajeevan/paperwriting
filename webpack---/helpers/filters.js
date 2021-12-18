'use strict'

import {
    Maybe
} from '@wix/wix-code-adt'
import {
    isPlainObject,
    flatMap,
    set,
    cloneDeep,
    clone
} from 'lodash-es'
import sequence from '@wix/dbsm-common/src/fp/sequence'

const isFilterLeaf = filterExpression =>
    !Array.isArray(filterExpression) && !isPlainObject(filterExpression)

const getFilterPartsByPredicate = (
    predicate,
    filterOrExpression,
    path = [],
) => {
    if (predicate(filterOrExpression)) {
        return [{
            path: clone(path),
            filterExpression: filterOrExpression,
        }, ]
    }

    if (!isFilterLeaf(filterOrExpression)) {
        return flatMap(filterOrExpression, (value, key) =>
            getFilterPartsByPredicate(predicate, value, path.concat(key)),
        )
    }

    return []
}

const mutateMergeValueAtPath = (filter, path, resolvedValue) =>
    set(filter, path, resolvedValue)

// transformFilterExpressions :: (FilterExpression -> Maybe FilterExpression) -> [filterPart] -> Maybe [filterPart]
const transformFilterParts = (transformer, filterParts) =>
    sequence(
        Maybe,
        filterParts.map(({
            path,
            filterExpression
        }) => {
            const maybeTransformedExpression = transformer(filterExpression)
            return maybeTransformedExpression.map(filterExpression => ({
                path,
                filterExpression,
            }))
        }),
    )

// mergeFilterParts :: Filter -> [FilterParts] -> Filter
const mergeFilterParts = filter => filterParts =>
    filterParts.reduce(
        (mergedFilter, {
            path,
            filterExpression
        }) =>
        mutateMergeValueAtPath(mergedFilter, path, filterExpression),
        cloneDeep(filter),
    )

// tranformFilter :: (predicateFunction, transformFunction) -> Filter -> Maybe Filter
const transformFilter = (predicate, transformer, filter) => {
    const filterPartsToTransform = getFilterPartsByPredicate(predicate, filter)

    const maybeTransformedFilterParts = transformFilterParts(
        transformer,
        filterPartsToTransform,
    )

    const maybeTransformedFilter = maybeTransformedFilterParts.map(
        mergeFilterParts(filter),
    )

    return maybeTransformedFilter
}

export {
    getFilterPartsByPredicate,
    transformFilter
}