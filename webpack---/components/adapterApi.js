'use strict'
import {
    Maybe
} from '@wix/wix-code-adt'
import {
    cloneDeep
} from 'lodash-es'
import {
    FILTER_INPUT_ROLE
} from '@wix/wix-data-client-common/src/connection-config/roles'
import QueryResults from '../helpers/queryResults'
import {
    setCurrentIndex,
    updateFields,
    refresh,
    fetchCurrentPage,
    doFetch,
} from '../records/actions'
import {
    selectCurrentRecordIndex
} from '../dataset-controller/rootReducer'

const adapterApiCreator =
    ({
        dispatch,
        recordStore,
        componentAdapterContexts
    }) =>
    () => {
        const actions = {
            fetchRecordById: (recordId, byRefField) =>
                recordStore(byRefField).fold(
                    () => Maybe.Nothing(),
                    service => service.getRecordById(recordId),
                ),

            fetchAll: byRefField => doFetch(recordStore, 0, 1000, byRefField),

            fetchCurrentItems: state =>
                fetchCurrentPage(recordStore, state).catch(() =>
                    QueryResults.Empty().get(),
                ),

            fetchOne: () => doFetch(recordStore, 0, 1),

            fetch: (fromIndex, length, byRefField) =>
                doFetch(recordStore, fromIndex, length, byRefField),

            getTotalItemsCount: byRefField => {
                return recordStore(byRefField)
                    .map(service => service.getMatchingRecordCount())
                    .getOrElse(0)
            },

            getInitialData: () =>
                recordStore().fold(
                    () => QueryResults.Empty(),
                    service => service.externalApi.getSeedRecords(),
                ),

            setCurrentIndex: (index, suppressRefreshView) =>
                dispatch(setCurrentIndex(index, suppressRefreshView)),

            setFieldInCurrentRecordAndSynchronize: (
                field,
                value,
                componentIdToExcludeFromUpdatingComponentsBasedOnRecord,
            ) => {
                dispatch(
                    updateFields({
                            [field]: cloneDeep(value)
                        },
                        componentIdToExcludeFromUpdatingComponentsBasedOnRecord,
                    ),
                )
            },

            refresh: () => dispatch(refresh()),

            resetUserInputFilters: () => {
                const userFilterComponentContexts = componentAdapterContexts.filter(
                    ({
                        role
                    }) => role === FILTER_INPUT_ROLE,
                )

                if (userFilterComponentContexts.length) {
                    componentAdapterContexts.forEach(componentAdapterContext => {
                        const api = apiOf(componentAdapterContext)
                        api.resetUserFilter && api.resetUserFilter(componentAdapterContext)
                    })

                    actions.refresh()
                }
            },

            isCurrentRecordNew: state =>
                recordStore().fold(
                    () => false,
                    service => service.isNewRecord(selectCurrentRecordIndex(state)),
                ),

            isCurrentRecordPristine: state =>
                recordStore().fold(
                    () => false,
                    service => service.isPristine(selectCurrentRecordIndex(state)),
                ),

            getUniqueFieldValues: fieldKey =>
                recordStore().fold(
                    () => false,
                    service => service.getUniqueFieldValues(fieldKey),
                ),
        }

        const apiOf = componentAdapterContext => componentAdapterContext.api

        const api = {
            isValidContext: componentAdapterContext =>
                apiOf(componentAdapterContext).isValidContext(componentAdapterContext),

            hideComponent: options => {
                componentAdapterContexts.map(componentAdapterContext =>
                    apiOf(componentAdapterContext).hideComponent(
                        componentAdapterContext,
                        options,
                    ),
                )
            },

            showComponent: options => {
                componentAdapterContexts.map(componentAdapterContext =>
                    apiOf(componentAdapterContext).showComponent(
                        componentAdapterContext,
                        options,
                    ),
                )
            },

            clearComponent: () => {
                componentAdapterContexts.map(componentAdapterContext =>
                    apiOf(componentAdapterContext).clearComponent(
                        componentAdapterContext,
                    ),
                )
            },

            bindToComponent: () => {
                componentAdapterContexts.map(componentAdapterContext =>
                    apiOf(componentAdapterContext).bindToComponent(
                        componentAdapterContext,
                        actions,
                        api,
                    ),
                )
            },

            currentRecordModified: (updatedFields = [], compIdToFilter = null) =>
                componentAdapterContexts
                .filter(
                    context => !compIdToFilter || context.compId !== compIdToFilter,
                )
                .map(componentAdapterContext =>
                    apiOf(componentAdapterContext).currentRecordModified(
                        componentAdapterContext,
                        actions,
                        updatedFields,
                        api,
                    ),
                ),

            recordSetLoaded: () =>
                componentAdapterContexts.map(componentAdapterContext =>
                    apiOf(componentAdapterContext).recordSetLoaded(
                        componentAdapterContext,
                        actions,
                        api,
                    ),
                ),

            currentViewChanged: () =>
                componentAdapterContexts.map(componentAdapterContext =>
                    apiOf(componentAdapterContext).currentViewChanged(
                        componentAdapterContext,
                        actions,
                        api,
                    ),
                ),

            currentIndexChanged: () =>
                componentAdapterContexts.map(componentAdapterContext =>
                    apiOf(componentAdapterContext).currentIndexChanged(
                        componentAdapterContext,
                        actions,
                        api,
                    ),
                ),
        }

        return api
    }

export default adapterApiCreator