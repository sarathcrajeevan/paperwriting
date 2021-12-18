'use strict'

import {
    Maybe
} from '@wix/wix-code-adt'
import {
    isPlainObject
} from 'lodash-es'
import {
    resolveDynamicProperties
} from './dynamicProperties'
import emptyConnectionConfig from '../helpers/emptyConnectionConfig'
import {
    PAGE_ROLE
} from '@wix/wix-data-client-common/src/connection-config/roles'

const createAdapterContext = ({
    getFieldType,
    role,
    compId,
    component,
    $w,
    api,
}) => {
    const connectionConfig = Maybe.fromNullable(component.connectionConfig)
        .filter(isPlainObject)
        .map(connectionConfig =>
            resolveDynamicProperties({
                connectionConfig
            }, role, getFieldType),
        )
        .getOrElse(emptyConnectionConfig)

    if (role === PAGE_ROLE) {
        component = $w('Document')
    }

    const adapterContext = {
        role,
        compId,
        connectionConfig,
        component,
        api,
    }

    return adapterContext
}

export {
    createAdapterContext
}