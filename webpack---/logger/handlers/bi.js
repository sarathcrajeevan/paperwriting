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
import {
    setupBiLogger
} from '../bi/setupBiLogger'
import getDefaultBIParams from '../bi/getDefaults'

const Environment = union('Environment', {
    NotInitialized: () => {},
    SSR: () => {},
    Client: ({
        viewMode,
        platformBiParams,
        biLoggerFactory
    }) => {
        const biLogger = setupBiLogger(
            viewMode,
            getDefaultBIParams(platformBiParams, viewMode),
            biLoggerFactory,
        )
        return {
            biLogger
        }
    },
})

const biHandlerCreator = () => {
    let environment = Environment.NotInitialized()

    const biHandler = () => ({
        init: ({
            inSsr,
            viewMode,
            platformBiParams,
            biLoggerFactory
        }) => {
            environment = inSsr ?
                Environment.SSR() :
                Environment.Client({
                    viewMode,
                    platformBiParams,
                    biLoggerFactory
                })
        },
        log: logEvent => {
            logEvent.matchWith({
                BI: ({
                    biEvent
                }) => {
                    environment.matchWith({
                        Client: ({
                            biLogger
                        }) => biLogger.log(biEvent),
                        SSR: noop,
                        NotInitialized: () => {
                            throw new Error(
                                `You cannot report to BI before setting the logger environment.
                  Make sure you call logger.init before reporting.`,
                            )
                        },
                    })
                },
                [matchAny]: () => {},
            })
        },
    })

    return biHandler
}

export {
    biHandlerCreator
}