'use strict'
import {
    combineReducers
} from 'redux'
import records from '../records/reducer'
import config from '../dataset-config/reducer'
import dependencyResolution from '../dependency-resolution/reducer'
import dynamicPages from '../dynamic-pages/reducer'

export default combineReducers({
    records: records.reducer,
    config: config.reducer,
    dependencyResolution: dependencyResolution.reducer,
    dynamicPages: dynamicPages.reducer,
})

export const shouldAllowWixDataAccess = state =>
    config.shouldAllowWixDataAccess(state.config)
export const areDependenciesResolved = state =>
    dependencyResolution.areDependenciesResolved(state.dependencyResolution)
export const getCollectionName = state => config.getCollectionName(state.config)
export const getCurrentPageSize = state =>
    records.getCurrentPageSize(state.records)
export const getNumberOfPagesToShow = state =>
    records.getNumberOfPagesToShow(state.records)
export const getTotalPageCount = (state, itemsCount) =>
    Math.ceil(itemsCount / getCurrentPageSize(state))
export const getCurrentPageIndex = state =>
    records.getCurrentPage(state.records)
export const getFixedFilterItem = state =>
    config.getFixedFilterItem(state.config)
export const getFilter = state => config.getFilter(state.config)
export const getSort = state => config.getSort(state.config)
export const getIncludes = state => config.getIncludes(state.config)
export const getPageSize = state => config.getPageSize(state.config)
export const getPaginationData = state =>
    records.getPaginationData(state.records)
export const getPreloadData = state => config.getPreloadData(state.config)
export const getCurrentPage = state => records.getCurrentPage(state.records)
export const getReadWriteMode = state => config.getReadWriteMode(state.config)
export const hasCurrentRecord = state => records.hasCurrentRecord(state.records)
export const isDatasetConfigured = state =>
    config.isDatasetConfigured(state.config)
export const isDatasetReady = state => config.isDatasetReady(state.config)
export const isDuringSave = state => records.isDuringSave(state.records)
export const isForm = state => records.isForm(state.records)
export const isReadOnly = state => config.isReadOnly(state.config)
export const isWriteOnly = state => config.isWriteOnly(state.config)
export const isEditable = state => hasCurrentRecord(state) && !isReadOnly(state)
export const isDatasetRouter = state => config.isDatasetRouter(state.config)
export const isDatasetMaster = state => config.isDatasetMaster(state.config)
export const isDatasetVirtual = state => config.isDatasetVirtual(state.config)
export const isDatasetReal = state => config.isDatasetReal(state.config)
export const isDatasetDeferred = state => config.isDatasetDeferred(state.config)
export const shouldLinkDynamicPageNavComponents = state =>
    config.shouldLinkDynamicPageNavComponents(state.config)
export const getDatasetStaticConfig = state => ({
    datasetIsRouter: isDatasetRouter(state),
    datasetIsMaster: isDatasetMaster(state),
    datasetIsVirtual: isDatasetVirtual(state),
    datasetIsReal: isDatasetReal(state),
    datasetIsDeferred: isDatasetDeferred(state),
    datasetIsWriteOnly: isWriteOnly(state),
    datasetCollectionName: getCollectionName(state),
    dynamicPageNavComponentsShouldBeLinked: shouldLinkDynamicPageNavComponents(state),
})
export const selectCurrentRecord = state =>
    records.selectCurrentRecord(state.records)
export const selectCurrentRecordIndex = state =>
    records.selectCurrentRecordIndex(state.records)
export const selectDefaultDraft = state =>
    records.selectDefaultDraft(state.records)
export const selectDesiredRecordIndex = state =>
    records.selectDesiredRecordIndex(state.records)
export const selectFieldsToUpdate = state =>
    records.selectFieldsToUpdate(state.records)
export const selectLastSavedRecord = state =>
    records.selectLastSavedRecord(state.records)
export const selectUpdateSource = state =>
    records.selectUpdateSource(state.records)
export const selectNewRecordIndex = state =>
    records.selectNewRecordIndex(state.records)
export const selectNextDynamicPageUrl = state =>
    dynamicPages.selectNextDynamicPageUrl(state.dynamicPages)
export const selectPreviousDynamicPageUrl = state =>
    dynamicPages.selectPreviousDynamicPageUrl(state.dynamicPages)
export const selectRefreshController = state =>
    records.selectRefreshController(state.records)
export const selectRefreshCurrentRecord = state =>
    records.selectRefreshCurrentRecord(state.records)
export const selectRefreshCurrentView = state =>
    records.selectRefreshCurrentView(state.records)
export const selectRemoveCurrentRecord = state =>
    records.selectRemoveCurrentRecord(state.records)
export const selectRevertChanges = state =>
    records.selectRevertChanges(state.records)
export const selectSaveRecord = state => records.selectSaveRecord(state.records)