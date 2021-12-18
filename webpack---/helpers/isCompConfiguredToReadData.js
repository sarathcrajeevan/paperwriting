import {
    GRID_ROLE,
    PAGINATION_ROLE,
} from '@wix/wix-data-client-common/src/connection-config/roles'

const isCompConfiguredToReadData = (role, config) => [GRID_ROLE, PAGINATION_ROLE].includes(role) ||
    (config && config.properties && Object.keys(config.properties).length > 0)

export default isCompConfiguredToReadData