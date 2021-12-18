'use strict'

import {
    noop
} from 'lodash-es'
import {
    Result,
    union
} from '@wix/wix-code-adt'
import {
    matchAny
} from '@wix/wix-code-client-logger'
import {
    filterByReportToHandlers
} from './filterByReportToHandlers'

const id = 'SYSTEM_TRACING'

const Environment = union('Environment', {
    NotInitialized() {},
    Initialized({
        reportTrace
    }) {
        return {
            reportTrace
        }
    },
})

function doTrace(reportTrace, params) {
    Result.try(() => reportTrace(params))
}

const systemTracingHandlerCreator = () => {
    let environment = Environment.NotInitialized()

    const systemTracingHandler = () => ({
        init: ({
            reportTrace
        }) => {
            environment = Environment.Initialized({
                reportTrace
            })
        },
        log: filterByReportToHandlers(id, logEvent => {
            environment.matchWith({
                Initialized: ({
                    reportTrace
                }) => {
                    logEvent.matchWith({
                        Trace: ({
                            payload,
                            position
                        }) => {
                            payload.matchWith({
                                Action: ({
                                    actionName
                                }) => {
                                    position.matchWith({
                                        Start: () => {
                                            doTrace(reportTrace, {
                                                actionName,
                                                tracePosition: 'before',
                                            })
                                        },
                                        End: ({
                                            durationMs: actionDurationMs
                                        }) => {
                                            doTrace(reportTrace, {
                                                actionName,
                                                tracePosition: 'after',
                                                actionDurationMs,
                                            })
                                        },
                                        [matchAny]: noop,
                                    })
                                },
                                [union.any]: noop,
                            })
                        },
                        [matchAny]: noop,
                    })
                },
                NotInitialized: () => {
                    throw new Error(
                        `You cannot report to system tracer before setting the logger environment.
              Make sure you call logger.init before reporting.`,
                    )
                },
            })
        }),
    })

    return systemTracingHandler
}

export {
    id,
    systemTracingHandlerCreator
}