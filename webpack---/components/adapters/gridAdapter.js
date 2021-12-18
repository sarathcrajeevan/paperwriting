'use strict'
import {
    forEach,
    get
} from 'lodash-es'
import {
    addComponentEventListener
} from './helpers'
import baseAdapter from './baseAdapter'
import {
    selectCurrentRecord
} from '../../dataset-controller/rootReducer'

export default ({
    datasetApi,
    applicationCodeZone,
    databindingVerboseReporter,
    getState,
    modeIsLivePreview,
}) => {
    const getRows = (fetch, logGridValue) =>
        async function(startRow, endRow /*, sorting, filter*/ ) {
            const {
                items,
                totalCount
            } = await fetch(startRow, endRow - startRow)
            logGridValue(items)
            return {
                pageRows: items,
                totalRowsCount: totalCount,
            }
        }

    const logVerboseForBinding = grid => {
        const bindingDescription = {}

        grid.columns.forEach(({
            label,
            dataPath,
            linkPath
        }) => {
            if (dataPath || linkPath) {
                bindingDescription[label] = Object.assign(
                    dataPath ? {
                        dataPath
                    } : {},
                    linkPath ? {
                        linkPath
                    } : {},
                )
            }
        })

        databindingVerboseReporter.logBinding({
            component: grid,
            bindingDescription,
        })
    }

    const logVerboseValueDescription = component => items => {
        const valueDescription = []
        const columns = component.columns

        forEach(items, item => {
            const value = {}
            forEach(columns, column => {
                value[column.label] = get(item, column.dataPath)
            })
            valueDescription.push(value)
        })

        databindingVerboseReporter.logValue({
            component,
            valueDescription,
        })
    }

    return {
        ...baseAdapter,

        clearComponent({
            component: grid
        }) {
            grid.rows = []
            grid.dataFetcher = undefined
        },

        bindToComponent({
            component: grid
        }, actions) {
            // Synchronously set initial data for SEO rendering
            actions.getInitialData().chain(({
                items
            }) => {
                grid.rows = items
            })

            const logGridValue = logVerboseValueDescription(grid)
            const record = selectCurrentRecord(getState())

            if (!modeIsLivePreview || record) {
                grid.dataFetcher = getRows(actions.fetch, logGridValue)
            }

            addComponentEventListener(
                grid,
                'onCellSelect',
                ({
                    cellRowIndex
                }) => {
                    datasetApi.setCurrentItemIndex(cellRowIndex)
                },
                applicationCodeZone,
            )

            addComponentEventListener(
                grid,
                'onRowSelect',
                ({
                    rowIndex
                }) => {
                    datasetApi.setCurrentItemIndex(rowIndex)
                },
                applicationCodeZone,
            )
            logVerboseForBinding(grid)
        },

        currentRecordModified({
            component: grid
        }, actions, updatedFields) {
            grid.refresh()
        },

        recordSetLoaded({
            component: grid
        }, actions) {
            grid.refresh()
        },

        currentViewChanged({
            component: grid
        }, actions) {
            grid.refresh()
        },
    }
}