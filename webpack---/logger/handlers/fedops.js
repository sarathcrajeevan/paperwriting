'use strict'

import {
    noop
} from 'lodash-es'
import {
    union
} from '@wix/wix-code-adt'
import {
    matchAny
} from '@wix/wix-code-client-logger'
import createOptions from '../fedops/createOptions'
import {
    filterByReportToHandlers
} from './filterByReportToHandlers'

const id = 'FEDOPS'

const Environment = union('Environment', {
    NotInitialized() {},
    Initialized({
        appLogger,
        fedOpsLoggerFactory
    }) {
        const options = createOptions(appLogger)
        const logger = fedOpsLoggerFactory.getLoggerForWidget(options)
        return {
            logger
        }
    },
})

const fedopsHandlerCreator = () => {
    let environment = Environment.NotInitialized()

    const getLogger = () =>
        environment.matchWith({
            Initialized: ({
                logger
            }) => logger,
            NotInitialized: () => {
                throw new Error(
                    `You cannot report to fedops before setting the logger environment.
            Make sure you call logger.init before reporting.`,
                )
            },
        })

    const traceStart = interactionName => {
        const logger = getLogger()
        logger.interactionStarted(interactionName)
    }

    const traceEnd = interactionName => {
        const logger = getLogger()
        logger.interactionEnded(interactionName)
    }

    const fedopsHandler = () => ({
        init: ({
            appLogger,
            fedOpsLoggerFactory
        }) => {
            environment = Environment.Initialized({
                appLogger,
                fedOpsLoggerFactory
            })
        },
        log: filterByReportToHandlers(id, logEvent => {
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
                                    traceStart(actionName)
                                },
                                End: ({
                                    result
                                }) => {
                                    // TODO: report only on Ok result
                                    // result.map(() => traceEnd(actionName))
                                    traceEnd(actionName)
                                },
                                [matchAny]: noop,
                            })
                        },
                        [union.any]: noop,
                    })
                },
                [matchAny]: noop,
            })
        }),
    })

    return fedopsHandler
}

export {
    id,
    fedopsHandlerCreator
}