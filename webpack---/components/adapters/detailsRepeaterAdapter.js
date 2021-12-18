'use strict'

import {
    addComponentEventListener
} from './helpers'
import baseAdapter from './baseAdapter'

const adapter = ({
    controllerFactory,
    controllerStore,
    applicationCodeZone,
}) => {
    const itemReady = compId => (scoped$w, itemData, index) => {
        const scopeInfo = {
            compId,
            itemId: itemData._id
        }
        const controller = controllerFactory.createDetailsController({
            scopeInfo,
            scoped$w: scoped$w.scoped,
        })
        controllerStore.setController(scopeInfo, controller)
        controller.pageReady()
    }

    const itemRemoved = compId => itemData => {
        const scopeInfo = {
            compId,
            itemId: itemData._id
        }
        controllerStore.removeController(scopeInfo)
    }

    return {
        ...baseAdapter,

        bindToComponent({
                connectionConfig: {
                    properties,
                    events,
                    filters
                },
                component,
                compId
            },
            actions,
            api,
        ) {
            addComponentEventListener(
                component,
                'onItemReady',
                itemReady(compId),
                applicationCodeZone,
            )
            addComponentEventListener(
                component,
                'onItemRemoved',
                itemRemoved(compId),
                applicationCodeZone,
            )
        },
    }
}

export default adapter