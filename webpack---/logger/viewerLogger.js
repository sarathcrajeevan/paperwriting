'use strict'

import {
    registerToUnexpectedErrors
} from '@wix/dbsm-common/src/errors/registerToWorkerUnexpectedErrors'
import {
    errorBoundariesCreator,
    isErrorHandled,
    errorBoundaryScopes,
} from './error-boundaries/errorBoundaries'
import {
    ravenHandlerCreator
} from './handlers/raven'
import {
    biHandlerCreator
} from './handlers/bi'
import {
    systemTracingHandlerCreator
} from './handlers/systemTracing'
import {
    fedopsHandlerCreator
} from './handlers/fedops'
import {
    create as createLogger
} from '@wix/wix-code-client-logger'

const {
    USER_SCOPE,
    WIX_DATA_SCOPE,
    APPLICATION_SCOPE
} = errorBoundaryScopes

const viewerLogger = ({
    global,
    appName,
    consoleHandler
}) => {
    const ravenHandler = ravenHandlerCreator({
        global,
        appName,
    })
    const biHandler = biHandlerCreator()
    const systemTracingHandler = systemTracingHandlerCreator()
    const fedopsHandler = fedopsHandlerCreator()
    const logger = createLogger({
        handlerCreators: [
            consoleHandler,
            ravenHandler,
            biHandler,
            systemTracingHandler,
            fedopsHandler,
        ],
    })

    const reportErrorWithZone = zone => (error, options) => {
        const optionsWithZone = {
            ...options,
            zone,
        }
        logger.error(error, optionsWithZone)
    }

    const errorBoundaries = errorBoundariesCreator({
        [USER_SCOPE]: reportErrorWithZone(USER_SCOPE),
        [WIX_DATA_SCOPE]: reportErrorWithZone(WIX_DATA_SCOPE),
        [APPLICATION_SCOPE]: reportErrorWithZone(APPLICATION_SCOPE),
    })

    registerToUnexpectedErrors({
        onError: error => {
            if (!isErrorHandled(error)) {
                const options = {
                    level: 'info',
                    tags: {
                        unHandledRejection: true
                    },
                }
                reportErrorWithZone(APPLICATION_SCOPE)(error, options)
            }
        },
        appName,
        global,
    })

    const loggerWithZones = {
        ...logger,
        error: reportErrorWithZone(APPLICATION_SCOPE),
        applicationCodeZone: errorBoundaries.applicationCodeZone,
        userCodeZone: errorBoundaries.userCodeZone,
        wixDataCodeZone: errorBoundaries.wixDataCodeZone,
    }

    return loggerWithZones
}

export const loggerCreator = viewerLogger