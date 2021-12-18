/* global self */
/* global VERBOSE */
/* global DEV_MODE */
'use strict'

import '../helpers/polyfills'
import {
    get,
    noop
} from 'lodash-es'
import parseUrl from 'url-parse'
import {
    traceCreators,
    logger as loggerCreator
} from '../logger'
import {
    isEnvEditor,
    isEnvLive
} from '../helpers/viewMode'
import FesDataFetcher from '../inverted-dependencies/FesDataFetcher'
import WixDataFetcher from '../inverted-dependencies/WixDataFetcher'
import DataCache from '../inverted-dependencies/DataCache'
import Features from '../inverted-dependencies/Features'
import DataBinding from './DataBinding'
import {
    createDataSchemasClientForBrowser
} from '@wix/wix-data-schemas-client'
import {
    viewerAutomationsClientCreator
} from '@wix/wix-code-automations-client'
import {
    APP_NAME
} from '../helpers/constants'

export default class App {
    constructor({
        //TODO: all this crap is in constructor, because it can be passed from IT tests. AAAAAAA!!!!!
        //TODO: kurva!!! should be removed after crappy it tests for internal business logic will be changed to units.
        //TODO: And WixDataFetcher integration with wix data and schemas should be tested separately
        wixDataSchemasForItTests,
        errorReporter = (message, error) => console.error(message, error), // eslint-disable-line no-console
        verboseReporter = (...args) => console.verbose(...args), // eslint-disable-line no-console
        shouldVerbose = Boolean(VERBOSE),
        appLogger = loggerCreator({
            global: self,
            appName: APP_NAME,
        }),
        automationsClientCreator = ({
            httpClient
        }) =>
        viewerAutomationsClientCreator({
            httpClient,
        }),
        getElementorySupport = () => global.elementorySupport,
    } = {}) {
        this.#appLogger = appLogger
        this.#wixDataSchemasForItTests = wixDataSchemasForItTests
        this.#getElementorySupport = getElementorySupport
        this.#errorReporter = errorReporter
        this.#originalVerboseReporter = verboseReporter
        this.#shouldVerbose = shouldVerbose
        this.#automationsClientCreator = automationsClientCreator

        return {
            initAppForPage: this.initAppForPage,
            createControllers: this.createControllers,
        }
    }

    initAppForPage = ({
            routerReturnedData,
            ...appParams
        },
        _,
        wixSdk, {
            bi: {
                pageId,
                viewerSessionId,
                pageUrl,
                metaSiteId,
                svSession
            } = {},
            reportTrace = noop,
            monitoring: {
                createMonitor: createRavenClient
            },
            fedOpsLoggerFactory,
            biLoggerFactory,
            essentials,
        } = {},
    ) => {
        try {
            const {
                instance,
                gridAppId
            } = extractInstanceAndGridAppId(
                appParams,
                this.#getElementorySupport(),
            )
            const {
                window: {
                    viewMode,
                    rendering: {
                        env
                    },
                    warmupData,
                },
                location: {
                    baseUrl
                },
                data: wixData,
            } = wixSdk

            const appState = {
                pageId,
                pageUrl,
                viewMode,
                metaSiteId,
                baseUrl,
                instance,
                gridAppId,
                userId: svSession,
                sessionId: viewerSessionId,
                mode: {
                    dev: DEV_MODE,
                    ssr: env === 'backend',
                    csr: env !== 'backend',
                },
                env: {
                    live: isEnvLive(viewMode),
                    editor: isEnvEditor(viewMode),
                },
            }

            const features = new Features({
                experiments: essentials.experiments,
                appState,
            })

            this.#appLogger.addSessionData(() => ({
                routerReturnedData
            }))
            this.#appLogger.init({
                appLogger: this.#appLogger,
                user: {
                    id: get(wixSdk, ['user', 'currentUser', 'id']),
                },
                inSsr: get(wixSdk, ['window', 'rendering', 'env']) === 'backend',
                viewMode,
                platformBiParams: {
                    pageId,
                    viewerSessionId
                },
                browserUrlGetter: () => get(wixSdk, ['location', 'url']),
                reportTrace,
                createRavenClient,
                fedOpsLoggerFactory,
                biLoggerFactory,
            })

            const dataFetcher = features.fes ?
                new FesDataFetcher({
                    httpClient: essentials.httpClient,
                    getRequestParams: () => ({
                        instance,
                        gridAppId
                    }),
                }) :
                new WixDataFetcher({
                    wixData: wixData || self.require('wix-data').default,
                    wixDataSchemas: this.#wixDataSchemasForItTests || createWixDataSchemas(appState),
                    wixDataCodeZone: this.#appLogger.wixDataCodeZone,
                })

            const dataCache = new DataCache({
                warmupData
            })

            this.#dataBinding = new DataBinding({
                appState,
                dataFetcher,
                dataCache,
                features,

                appLogger: this.#appLogger,
                errorReporter: this.#errorReporter,
                wixSdk,
                routerReturnedData,
                shouldVerbose: this.#shouldVerbose,
                originalVerboseReporter: this.#originalVerboseReporter,
                automationsClientCreator: () =>
                    this.#automationsClientCreator({
                        httpClient: essentials.httpClient,
                    }),
            })

            return Promise.resolve()
        } catch (e) {
            this.#appLogger.error(e)
            return Promise.reject(e)
        }
    }

    createControllers = rawControllerConfigs => {
        return this.#appLogger.traceSync(traceCreators.createControllers(), () => {
            try {
                if (rawControllerConfigs.length === 0) {
                    return []
                }

                return this.#dataBinding.initializeDatasets({
                    rawControllerConfigs
                })
            } catch (e) {
                this.#appLogger.error(e)
                return []
            }
        })
    }

    #
    dataBinding# appLogger# wixDataSchemasForItTests# getElementorySupport# errorReporter# originalVerboseReporter# shouldVerbose# automationsClientCreator
}

const extractInstanceAndGridAppId = (appParams, elementorySupport) => {
    if (appParams.instance && appParams.appData) {
        return {
            instance: appParams.instance,
            gridAppId: appParams.appData.gridAppId,
        }
    }

    const {
        query: {
            instance,
            gridAppId
        },
    } = parseUrl(`?${elementorySupport.queryParameters}`, true)

    return {
        instance,
        gridAppId
    }
}

const createWixDataSchemas = ({
    instance,
    gridAppId,
    baseUrl,
    env: {
        editor
    },
}) => {
    const {
        protocol,
        hostname
    } = parseUrl(baseUrl)

    const serverBaseUrl = editor ?
        undefined :
        `${protocol}//${hostname}/_api/cloud-data/v1/schemas`

    return createDataSchemasClientForBrowser(instance, gridAppId, {
        baseUrl: serverBaseUrl,
    })
}