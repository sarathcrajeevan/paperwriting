import {
    FILTER_INPUT_ROLE
} from '@wix/wix-data-client-common/src/connection-config/roles'

export const getComponentsToUpdate = ({
    connectedComponents,
    updatedCompIds,
    datasetIsReal,
}) => {
    if (updatedCompIds.length && datasetIsReal) {
        const connectedCompsToUpdate = []
        for (const connectedComponent of connectedComponents) {
            const {
                role,
                compId
            } = connectedComponent
            if (updatedCompIds.includes(compId)) {
                if (role === FILTER_INPUT_ROLE) return connectedComponents
                connectedCompsToUpdate.push(connectedComponent)
            }
        }

        return connectedCompsToUpdate
    }

    return connectedComponents
}