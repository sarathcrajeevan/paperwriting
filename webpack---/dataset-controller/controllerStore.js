'use strict'

import {
    unset,
    get
} from 'lodash-es'
import {
    TraceType
} from '../logger/traceType'

const controllerStore = logger => {
    const scopesMap = {}
    return {
        setController: ({
            compId,
            itemId
        }, controller) => {
            logger.trace(
                TraceType.Breadcrumb({
                    level: 'info',
                    category: 'scopeStore',
                    message: 'adding scope',
                    data: {
                        componentId: compId,
                        itemId
                    },
                }),
            )
            scopesMap[compId] = scopesMap[compId] || {}
            scopesMap[compId][itemId] = controller
        },
        getController: ({
            compId,
            itemId
        }) => {
            const componentScopes = scopesMap[compId]
            return componentScopes && componentScopes[itemId]
        },
        removeController: ({
            compId,
            itemId
        }) => {
            logger.trace(
                TraceType.Breadcrumb({
                    level: 'info',
                    category: 'scopeStore',
                    message: 'removing scope',
                    data: {
                        componentId: compId,
                        itemId
                    },
                }),
            )
            const componentScopes = scopesMap[compId]
            if (get(componentScopes, itemId)) {
                componentScopes[itemId].dispose()
                unset(componentScopes, itemId)
            }
        },
        getAll: () => {
            return Object.values(scopesMap).reduce(
                (acc, curr) => acc.concat(Object.values(curr)), [],
            )
        },
    }
}

export default controllerStore