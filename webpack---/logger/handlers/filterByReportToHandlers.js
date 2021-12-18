'use strict'

import {
    union
} from '@wix/wix-code-adt'
import {
    matchAny
} from '@wix/wix-code-client-logger'

const filterByReportToHandlers = (id, logFn) => logEvent => {
    logEvent.matchWith({
        Trace: ({
            payload
        }) => {
            payload.matchWith({
                Action: ({
                    options
                }) => {
                    if (options.reportToHandlers.includes(id)) {
                        logFn(logEvent)
                    }
                },
                [union.any]: () => logFn(logEvent),
            })
        },
        [matchAny]: () => logFn(logEvent),
    })
}

export {
    filterByReportToHandlers
}