'use strict'

import {
    isLocalhost
} from '@wix/dbsm-common/src/worker/getUrl'
import {
    loggerCreator
} from './viewerLogger'
import {
    consoleHandlerCreator
} from '@wix/wix-code-client-logger'
import {
    id as systemTracingId
} from './handlers/systemTracing'
import {
    id as fedopsId
} from './handlers/fedops'

const traceHandlerIds = {
    SYSTEM_TRACING: systemTracingId,
    FEDOPS: fedopsId,
}

const loggerWithHandlers = ({
    global,
    appName
}) => {
    const {
        consoleHandler
    } = consoleHandlerCreator({
        shouldLog: isLocalhost,
    })

    return loggerCreator({
        global,
        appName,
        consoleHandler,
    })
}

export {
    loggerWithHandlers as logger, traceHandlerIds
}