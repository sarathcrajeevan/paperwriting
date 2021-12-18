'use strict'

import {
    union
} from '@wix/wix-code-adt'
import {
    getCurrentPageSize,
    getPaginationData,
    getNumberOfPagesToShow,
} from '../dataset-controller/rootReducer'
import actionTypes from './actionTypes'
import QueryResults from '../helpers/queryResults'

export const GoToIndexResult = union('GoToIndexResult', {
    Record: (index, record) => ({
        index,
        record
    }),
    InvalidIndex: () => ({}),
    NoRecord: () => ({}),
})

export const setCurrentIndex = (index, suppressRefreshView = false) => ({
    type: actionTypes.GO_TO_INDEX,
    index,
    suppressRefreshView,
})

export const goToRecordByIndexResult = (error, payload) => ({
    type: actionTypes.GET_RECORD_BY_INDEX_RESULT,
    error,
    payload,
})

export const refreshCurrentRecord = () => ({
    type: actionTypes.REFRESH_CURRENT_RECORD,
})

export const refreshCurrentView = () => ({
    type: actionTypes.REFRESH_CURRENT_VIEW,
})

export const setCurrentRecord = (record, recordIndex, updateSource) => ({
    type: actionTypes.SET_CURRENT_RECORD,
    record,
    recordIndex,
    updateSource,
})

export const updateFields = (fieldsToUpdate, updateSource) => ({
    type: actionTypes.UPDATE_FIELDS,
    fieldsToUpdate,
    updateSource,
})

export const incrementNumOfPagesToShow = () => ({
    type: actionTypes.INCREMENT_NUM_PAGES_TO_SHOW,
})

export const nextPage = () => ({
    type: actionTypes.GO_TO_NEXT_PAGE,
})

export const previousPage = () => ({
    type: actionTypes.GO_TO_PREVIOUS_PAGE,
})

export const loadPage = pageNumber => ({
    type: actionTypes.LOAD_PAGE,
    pageNumber,
})

export const updateCurrentViewResult = (error, payload) => ({
    type: actionTypes.CURRENT_VIEW_UPDATED,
    error,
    payload,
})

export const revert = () => ({
    type: actionTypes.REVERT_CHANGES,
})

export const revertResult = (error, payload) => ({
    type: actionTypes.RECORD_REVERTED,
    error,
    payload,
})

export const flushDraft = () => ({
    type: actionTypes.SAVE_RECORD,
})

export const saveRecordResult = (error, payload) => ({
    type: actionTypes.SAVE_RECORD_RESULT,
    error,
    payload,
})

export const setDefaultRecord = record => ({
    type: actionTypes.SET_DEFAULT_RECORD,
    record,
})

export const newRecord = atIndex => ({
    type: actionTypes.NEW_RECORD,
    atIndex,
})

export const newRecordResult = (error, payload) => ({
    type: actionTypes.NEW_RECORD_RESULT,
    error,
    payload,
})

export const remove = () => ({
    type: actionTypes.REMOVE_CURRENT_RECORD,
})

export const removeCurrentRecordResult = (error, payload) => ({
    type: actionTypes.REMOVE_CURRENT_RECORD_RESULT,
    error,
    payload,
})

export const refresh = () => ({
    type: actionTypes.REFRESH,
})

export const refreshResult = (error, payload) => ({
    type: actionTypes.GET_RECORD_BY_INDEX_RESULT,
    error,
    payload,
})

export const reInitWriteOnly = () => newRecord(0)

export const initWriteOnly = isScoped =>
    isScoped ? setCurrentIndex(0) : newRecord(0)

export const doFetch = async (recordStore, fromIndex, length, byRefField) => {
    const fetchedItems = await recordStore(byRefField).fold(
        () => QueryResults.Empty(),
        service =>
        service.externalApi.getRecordsLimitedByMaxPageSize(fromIndex, length),
    )

    return fetchedItems.get()
}

export const fetchCurrentPage = (recordStore, state) => {
    const pageSize = getCurrentPageSize(state) * getNumberOfPagesToShow(state)
    const {
        offset
    } = getPaginationData(state)

    return doFetch(recordStore, offset, pageSize)
}

export default {
    doFetch,
    fetchCurrentPage,
    flushDraft,
    goToRecordByIndexResult,
    incrementNumOfPagesToShow,
    initWriteOnly,
    loadPage,
    newRecord,
    newRecordResult,
    nextPage,
    previousPage,
    reInitWriteOnly,
    refresh,
    refreshCurrentRecord,
    refreshCurrentView,
    refreshResult,
    remove,
    removeCurrentRecordResult,
    revert,
    revertResult,
    saveRecordResult,
    setCurrentIndex,
    setCurrentRecord,
    setDefaultRecord,
    updateCurrentViewResult,
    updateFields,
    GoToIndexResult,
}