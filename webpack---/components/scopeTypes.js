'use strict'

const SCOPE_TYPES = {
    PRIMARY: 'PRIMARY',
    DETAILS: 'DETAILS',
    OTHER: 'OTHER',
}

const getScopeType = (repeaterCompId, dependencies, connectedComponents) => {
    if (connectedComponents.some(({
            compId
        }) => compId === repeaterCompId)) {
        return SCOPE_TYPES.PRIMARY
    }

    const isOneOfMyMastersConnectedToRepeater = Object.values(dependencies).some(
        dependency =>
        dependency.controllerApi &&
        dependency.controllerApi.isConnectedToComponent &&
        dependency.controllerApi.isConnectedToComponent(repeaterCompId),
    )

    if (isOneOfMyMastersConnectedToRepeater) {
        return SCOPE_TYPES.DETAILS
    }

    return SCOPE_TYPES.OTHER
}

export {
    SCOPE_TYPES,
    getScopeType
}