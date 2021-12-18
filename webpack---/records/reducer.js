'use strict'

import {
    inRange
} from 'lodash-es'
import {
    Result
} from '@wix/wix-code-adt'
import * as defaultDatasetConfiguration from '@wix/wix-data-client-common/src/dataset-configuration/defaults'
import actionTypes from './actionTypes'
import rootActions from '../dataset-controller/actions'
import configActionTypes from '../dataset-config/actionTypes'
import isFormDataset from '../helpers/isForm'
import datasetConfigParser from '../dataset-config/datasetConfigParser'

const actionToResult = ({
        error,
        payload
    }) =>
    error ? Result.Error(payload) : Result.Ok(payload)

const initialRecordsState = {
    currentRecord: {
        index: undefined,
        data: undefined,
        fieldsToUpdate: undefined,
        updateSource: undefined,
    },
    lastSavedRecord: {
        index: undefined,
        data: undefined,
    },
    desiredIndex: undefined,
    refreshCurrentRecord: false,
    removeCurrentRecord: false,
    newRecordIndex: null,
    refreshCurrentView: false,
    refreshController: false,
    revertChanges: false,
    saveRecord: false,
    defaultRecord: undefined,
    isForm: undefined,
    page: {
        numPagesToShow: 1,
        offset: 0,
        size: defaultDatasetConfiguration.pageSize,
    },
    schema: undefined,
}

const getDefaultDraft = state => ({
    ...state.defaultRecord,
})

const isIndexInView = (index, state) =>
    inRange(
        index,
        getPaginationData(state).offset,
        getPaginationData(state).offset + getPaginationData(state).size,
    )

const isCurrentIndexInView = state =>
    isIndexInView(selectCurrentRecordIndex(state), state)

const setCurrentRecord = (state, index, record, updateSource) => {
    const newState = {
        ...state,
        currentRecord: {
            index,
            data: record,
            updateSource
        },
        desiredIndex: index,
        refreshCurrentRecord: false,
        refreshController: false,
    }

    return isCurrentIndexInView(newState) ?
        newState :
        {
            ...newState,

            page: {
                ...newState.page,

                offset: Math.floor(newState.currentRecord.index / newState.page.size) *
                    newState.page.size,

                numPagesToShow: 1,
            },
        }
}

const reducer = (state = initialRecordsState, action) => {
    switch (action.type) {
        case actionTypes.SET_CURRENT_RECORD:
            {
                const {
                    recordIndex,
                    record,
                    updateSource
                } = action
                return setCurrentRecord(state, recordIndex, record, updateSource)
            }

        case actionTypes.NEW_RECORD:
            {
                return {
                    ...state,
                    newRecordIndex: action.atIndex,
                }
            }

        case actionTypes.NEW_RECORD_RESULT:
            {
                return actionToResult(action).fold(
                    () => ({
                        ...state,
                        newRecordIndex: null,
                    }),
                    record => ({
                        ...setCurrentRecord(state, state.newRecordIndex, record),
                        newRecordIndex: null,
                    }),
                )
            }

        case actionTypes.UPDATE_FIELDS:
            {
                const {
                    fieldsToUpdate,
                    updateSource
                } = action

                return {
                    ...state,

                    currentRecord: {
                        ...state.currentRecord,
                        fieldsToUpdate,
                        updateSource,
                    },
                }
            }

        case actionTypes.GO_TO_INDEX:
            {
                return {
                    ...state,
                    desiredIndex: action.index,
                }
            }

        case actionTypes.GET_RECORD_BY_INDEX_RESULT:
            {
                return actionToResult(action).fold(
                    () => ({
                        ...state,
                        desiredIndex: state.currentRecord.index,
                        refreshCurrentRecord: false,
                        refreshController: false,
                    }),
                    value => {
                        return value.matchWith({
                            Record: ({
                                    index,
                                    record
                                }) =>
                                setCurrentRecord(state, index, record),
                            InvalidIndex: () => ({
                                ...state,
                                desiredIndex: state.currentRecord.index,
                                refreshCurrentRecord: false,
                            }),
                            NoRecord: () => setCurrentRecord(state, null, null),
                        })
                    },
                )
            }

        case actionTypes.REFRESH_CURRENT_RECORD:
            {
                return {
                    ...state,
                    refreshCurrentRecord: true,
                }
            }

        case actionTypes.REMOVE_CURRENT_RECORD:
            {
                return {
                    ...state,
                    removeCurrentRecord: true,
                }
            }

        case actionTypes.REMOVE_CURRENT_RECORD_RESULT:
            {
                return actionToResult(action).fold(
                    () => {
                        return {
                            ...state,
                            removeCurrentRecord: false,
                        }
                    },
                    () => {
                        return {
                            ...state,
                            removeCurrentRecord: false,
                            refreshCurrentRecord: true,
                        }
                    },
                )
            }

        case actionTypes.REFRESH_CURRENT_VIEW:
            {
                return {
                    ...state,
                    refreshCurrentView: true,
                }
            }

        case actionTypes.CURRENT_VIEW_UPDATED:
            {
                return {
                    ...state,
                    refreshCurrentView: false,
                }
            }

        case actionTypes.REVERT_CHANGES:
            {
                return {
                    ...state,
                    revertChanges: true,
                }
            }

        case actionTypes.RECORD_REVERTED:
            {
                return {
                    ...state,
                    revertChanges: false,
                }
            }

        case actionTypes.SET_DEFAULT_RECORD:
            {
                const {
                    record
                } = action

                return {
                    ...state,
                    defaultRecord: record,
                }
            }

        case rootActions.actionTypes.INIT:
            {
                const {
                    datasetConfig,
                    connections
                } = action
                const configuredPageSize = datasetConfigParser.getPageSize(datasetConfig)
                const readWriteType = datasetConfigParser.getReadWriteType(datasetConfig)
                return {
                    ...state,
                    isForm: isFormDataset(readWriteType, connections),

                    page: {
                        ...state.page,
                        size: configuredPageSize || state.page.size,
                    },
                }
            }

        case rootActions.actionTypes.SET_PAGINATION_DATA:
            {
                const newState = {
                    ...state,

                    page: {
                        ...state.page,
                        ...action.paginationData,
                    },
                }

                return isCurrentIndexInView(newState) ?
                    newState :
                    {
                        ...newState,
                        desiredIndex: newState.page.offset,
                    }
            }

        case actionTypes.GO_TO_NEXT_PAGE:
            {
                const paginationData = getPaginationData(state)
                const currentPageSize = getCurrentPageSize(state)
                const offset = paginationData.offset + currentPageSize

                const newState = {
                    ...state,

                    page: {
                        ...state.page,
                        numPagesToShow: 1,
                        offset,
                    },
                }

                return isCurrentIndexInView(newState) ?
                    newState :
                    {
                        ...newState,
                        desiredIndex: newState.page.offset,
                    }
            }

        case actionTypes.GO_TO_PREVIOUS_PAGE:
            {
                const paginationData = getPaginationData(state)
                const offset = Math.max(0, paginationData.offset - paginationData.size)

                const newState = {
                    ...state,

                    page: {
                        ...state.page,
                        numPagesToShow: 1,
                        offset,
                    },
                }

                return isCurrentIndexInView(newState) ?
                    newState :
                    {
                        ...newState,
                        desiredIndex: newState.page.offset,
                    }
            }

        case actionTypes.LOAD_PAGE:
            {
                const {
                    size
                } = getPaginationData(state)
                const newState = {
                    ...state,

                    page: {
                        ...state.page,
                        numPagesToShow: 1,
                        offset: size * (action.pageNumber - 1),
                    },
                }

                return isCurrentIndexInView(newState) ?
                    newState :
                    {
                        ...newState,
                        desiredIndex: newState.page.offset,
                    }
            }

        case actionTypes.INCREMENT_NUM_PAGES_TO_SHOW:
            {
                return {
                    ...state,

                    page: {
                        ...state.page,
                        numPagesToShow: state.page.numPagesToShow + 1,
                    },
                }
            }

        case actionTypes.SAVE_RECORD:
            {
                return {
                    ...state,
                    saveRecord: true,

                    lastSavedRecord: {
                        index: undefined,
                        data: undefined,
                    },
                }
            }

        case actionTypes.SAVE_RECORD_RESULT:
            {
                return actionToResult(action).fold(
                    () => ({
                        ...state,
                        saveRecord: false,
                    }),
                    savedRecord => {
                        return {
                            ...state,
                            saveRecord: false,

                            lastSavedRecord: {
                                index: state.currentRecord.index,
                                data: savedRecord,
                            },
                        }
                    },
                )
            }

        case configActionTypes.SET_FILTER:
        case configActionTypes.SET_SORT:
        case actionTypes.REFRESH:
            {
                return {
                    ...state,
                    refreshController: true,
                }
            }

        default:
            return state
    }
}

const getCurrentPageSize = state => state.page.size

const getNumberOfPagesToShow = state => state.page.numPagesToShow

const selectCurrentRecord = state => state.currentRecord.data

const getPaginationData = state => state.page

const selectCurrentRecordIndex = state => state.currentRecord.index

export default {
    reducer,

    getCurrentPageSize,

    getNumberOfPagesToShow,

    getPaginationData,

    getCurrentPage: state =>
        state.page.offset / getCurrentPageSize(state) +
        getNumberOfPagesToShow(state),

    hasCurrentRecord: state => !!selectCurrentRecord(state),

    selectDefaultDraft: getDefaultDraft,

    selectCurrentRecord,

    selectCurrentRecordIndex,

    selectDesiredRecordIndex: state => state.desiredIndex,

    selectFieldsToUpdate: state => state.currentRecord.fieldsToUpdate,

    selectLastSavedRecord: state => state.lastSavedRecord.data,

    selectLastSavedRecordIndex: state => state.lastSavedRecord.index,

    selectRefreshCurrentRecord: state => state.refreshCurrentRecord,

    selectRemoveCurrentRecord: state => state.removeCurrentRecord,

    selectRefreshController: state => state.refreshController,

    selectRefreshCurrentView: state => state.refreshCurrentView,

    selectRevertChanges: state => state.revertChanges,

    selectSaveRecord: state => state.saveRecord,

    selectUpdateSource: state => state.currentRecord.updateSource,

    selectNewRecordIndex: state => state.newRecordIndex,

    isDuringSave: state => state.saveRecord,

    isForm: state => state.isForm,
}