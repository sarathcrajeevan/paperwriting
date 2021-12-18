'use strict'

import {
    addComponentEventListener
} from './helpers'
import {
    selectCurrentRecord
} from '../../dataset-controller/rootReducer'
import {
    traceCreators
} from '../../logger'
import performance from '../../helpers/performance'
import baseAdapter from './baseAdapter'

const adapter = ({
    appLogger,
    getState,
    controllerFactory,
    controllerStore,
    applicationCodeZone,
    databindingVerboseReporter,
    modeIsLivePreview,
}) => {
    const itemReadyPromises = []

    const itemReady = (compId, compNickname) => (scoped$w, itemData, index) => {
        appLogger.traceSync(traceCreators.repeaterItemReady(index), () => {
            const scopeInfo = {
                compId,
                itemId: itemData._id
            }
            const controller = controllerFactory.createFixedItemController({
                scopeInfo,
                fixedItem: itemData,
                parentId: compNickname,
                scoped$w: scoped$w.scoped,
            })
            controllerStore.setController(scopeInfo, controller)
            const pageReadyPromise = controller.pageReady()
            itemReadyPromises.push(pageReadyPromise)
        })
    }

    const itemRemoved = compId => itemData => {
        const scopeInfo = {
            compId,
            itemId: itemData._id
        }
        controllerStore.removeController(scopeInfo)
    }

    const refreshView =
        traceAction =>
        async ({
            component
        }, actions) => {
            return appLogger.traceAsync(traceAction, async () => {
                const {
                    items
                } = await actions.fetchCurrentItems(getState())
                if (modeIsLivePreview && items.length === 0) return

                databindingVerboseReporter.logValue({
                    component,
                    valueDescription: {
                        data: items
                    },
                })
                appLogger.traceSync(traceCreators.repeaterSetData(), () => {
                    performance.mark('repeater.refreshView.beforeSetDataItems')
                    component.data = items
                })
                await Promise.all(itemReadyPromises)
                performance.measure(
                    'repeater.refreshView.renderItemsTime',
                    'repeater.refreshView.beforeSetDataItems',
                )
                itemReadyPromises.splice(0)
            })
        }

    return {
        ...baseAdapter,

        clearComponent({
            component
        }) {
            component.data = []
        },

        bindToComponent({
            component,
            compId
        }, actions, api) {
            const {
                id: compNickname
            } = component

            addComponentEventListener(
                component,
                'onItemReady',
                itemReady(compId, compNickname),
                applicationCodeZone,
            )
            addComponentEventListener(
                component,
                'onItemRemoved',
                itemRemoved(compId),
                applicationCodeZone,
            )

            databindingVerboseReporter.logBinding({
                component
            })
        },

        currentRecordModified({
            component
        }, actions, updatedFields) {
            const updatedItem = selectCurrentRecord(getState())
            if (component.data && component.data.length > 0) {
                const existingItems = component.data

                const newItems = existingItems.map(existingItem =>
                    existingItem._id === updatedItem._id ? updatedItem : existingItem,
                )
                component.data = newItems
            }
        },

        recordSetLoaded: refreshView(traceCreators.repeaterRecordSetLoaded()),
        currentViewChanged: refreshView(traceCreators.repeaterCurrentViewChanged()),
    }
}

export default adapter