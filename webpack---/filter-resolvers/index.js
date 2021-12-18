'use strict'

import {
    isEmpty
} from 'lodash-es'
import {
    transformFilter,
    getFilterPartsByPredicate
} from '../helpers/filters'
import currentUserFilterResolver from './currentUser'
import dataBindingFilterResolver from './databinding'
import userInputResolver from './userInput'
import {
    shouldResolve as shouldCurrentUserResolve
} from '@wix/dbsm-common/src/filter-resolvers/currentUserFilterResolver'
import {
    shouldResolve as shouldDataBindingResolve
} from '@wix/dbsm-common/src/filter-resolvers/dataBindingFilterResolver'
import {
    shouldResolve as shouldUserInputResolve
} from '@wix/dbsm-common/src/filter-resolvers/userInputFilterResolver'
import {
    parseStandardFilter
} from '../helpers/parseStandardFilter'

const shouldResolve = filterExpression =>
    shouldCurrentUserResolve(filterExpression) ||
    shouldDataBindingResolve(filterExpression) ||
    shouldUserInputResolveWholeFilter(filterExpression)

const resolveFilter = filterResolvers => filter => {
    const resolveExpressionValue = filterExpression => {
        if (shouldCurrentUserResolve(filterExpression)) {
            return filterResolvers.currentUser()
        }

        if (shouldDataBindingResolve(filterExpression)) {
            return filterResolvers.dataBinding(filterExpression)
        }

        if (shouldUserInputResolveWholeFilter(filterExpression)) {
            return filterResolvers.userInput(filterExpression)
        }
    }

    const maybeResolvedFilter = transformFilter(
        shouldResolve,
        resolveExpressionValue,
        filter,
    )

    return maybeResolvedFilter
}

const shouldUserInputResolveWholeFilter = filterExpression =>
    parseStandardFilter(filterExpression)
    .map(({
        value
    }) => shouldUserInputResolve(value))
    .getOrElse(false)

// getPartsForDatabindingResolver :: Filter -> [FilterPart]
const getPartsForDatabindingResolver = filter =>
    getFilterPartsByPredicate(shouldDataBindingResolve, filter)

// hasPartsForUserInputResolver :: Filter -> Boolean
const hasPartsForUserInputResolver = filter =>
    !isEmpty(getFilterPartsByPredicate(shouldUserInputResolve, filter))

// hasPartsForCurrentUserResolver :: Filter -> Boolean
const hasPartsForCurrentUserResolver = filter =>
    !isEmpty(getFilterPartsByPredicate(shouldCurrentUserResolve, filter))

// hasDatabindingDependencies :: Filter -> Boolean
const hasDatabindingDependencies = filter =>
    getPartsForDatabindingResolver(filter).length > 0

// getDatabindingDependencyIds :: Filter -> [DependencyId]
const getDatabindingDependencyIds = filter =>
    getPartsForDatabindingResolver(filter).map(
        ({
            filterExpression
        }) => filterExpression.filterId,
    )

const hasDynamicFilter = filter =>
    hasPartsForUserInputResolver(filter) ||
    hasPartsForCurrentUserResolver(filter) ||
    hasDatabindingDependencies(filter)

const createValueResolvers = (
    dependenciesMap,
    wixSdk,
    getConnectedComponents,
    getFieldType,
) => ({
    dataBinding: dataBindingFilterResolver(dependenciesMap),
    currentUser: currentUserFilterResolver(wixSdk),
    userInput: userInputResolver({
        getConnectedComponents,
        getFieldType
    }),
})

export {
    resolveFilter as createFilterResolver,
    createValueResolvers,
    hasDatabindingDependencies,
    getDatabindingDependencyIds,
    getPartsForDatabindingResolver as getExpressions,
    hasPartsForUserInputResolver as hasUserInputDependencies,
    hasDynamicFilter,
}