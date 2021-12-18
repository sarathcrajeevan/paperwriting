'use strict'

import {
    DETAILS_DATASET_ROLE
} from '@wix/wix-data-client-common/src/connection-config/roles'

export default () => {
    let connectedComponents //TODO: cannot be inited as an empty array because of userInput filters

    const findConnectedComponents = (roles, $w) => {
        const result = []
        roles.forEach(role => {
            const components = $w('@' + role)
            components &&
                components.forEach(
                    component =>
                    component &&
                    result.push({
                        role,
                        component,
                        compId: component.uniqueId
                    }),
                )
        })

        return result
    }

    const setConnectedComponents = components =>
        (connectedComponents = components)

    const getConnectedComponents = () => connectedComponents

    const getConnectedComponentIds = () =>
        connectedComponents && connectedComponents.map(({
            compId
        }) => compId)

    const resolveHandshakes = ({
            datasetApi,
            components,
            controllerConfig,
            controllerConfigured,
        }) =>
        components
        .filter(({
            role
        }) => role === DETAILS_DATASET_ROLE)
        .map(({
            component,
            role
        }) => ({
            controller: component,
            handshakeInfo: {
                controllerApi: datasetApi,
                controllerConfig,
                controllerConfigured,
                connectionConfig: component.connectionConfig,
                role: DETAILS_DATASET_ROLE,
            },
        }))

    return {
        findConnectedComponents,
        setConnectedComponents,
        resolveHandshakes,
        getConnectedComponents,
        getConnectedComponentIds,
    }
}