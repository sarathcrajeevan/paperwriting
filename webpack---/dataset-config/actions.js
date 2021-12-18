'use strict'

import actionTypes from './actionTypes'

export const setFilter = filter => ({
    type: actionTypes.SET_FILTER,
    filter,
})

export const setSort = sort => ({
    type: actionTypes.SET_SORT,
    sort,
})

export const setIsDatasetReady = isDatasetReady => ({
    type: actionTypes.SET_IS_DATASET_READY,
    isDatasetReady,
})

export const setFixedFilterItem = fixedFilterItem => ({
    type: actionTypes.SET_FIXED_FILTER_ITEM,
    fixedFilterItem,
})

export default {
    setFilter,
    setSort,
    setIsDatasetReady,
    setFixedFilterItem,
}