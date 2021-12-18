'use strict'

import {
    union
} from '@wix/wix-code-adt'
import {
    matchAny
} from '@wix/wix-code-client-logger'
import {
    noop,
    merge
} from 'lodash-es'
import ravenApps from '@wix/dbsm-common/src/raven/apps'
import setupRaven from '../raven/setupRaven'
import {
    errorBoundaryScopes
} from '../error-boundaries/errorBoundaries'

const {
    DBSMViewer,
    UserErrors,
    WixData
} = ravenApps
const {
    USER_SCOPE,
    WIX_DATA_SCOPE,
    APPLICATION_SCOPE
} = errorBoundaryScopes

const ravenHandlerCreator =
    ({
        global: globalScope,
        appName
    }) =>
    () => {
        const createReportOptions = ({
            level,
            sessionData,
            options = {}
        }) => {
            return merge({
                level
            }, {
                extra: sessionData
            }, options)
        }
        let zoneToRavenMap = {}

        const getZoneReporter = zone => {
            const raven = zoneToRavenMap[zone]
            if (!raven) {
                throw new Error('Raven was not initialized')
            }
            return raven
        }

        return {
            init: ({
                user,
                createRavenClient,
                platformBiParams
            }) => {
                const Raven = createRavenClient(DBSMViewer.dsn)
                const UserRaven = createRavenClient(UserErrors.dsn)
                const WixDataRaven = createRavenClient(WixData.dsn)
                const params = {
                    tags: {
                        msid: platformBiParams.metaSiteId
                    }
                }

                setupRaven({
                    Raven,
                    globalScope,
                    dsn: DBSMViewer.dsn,
                    appName,
                    user,
                    params,
                })
                setupRaven({
                    Raven: UserRaven,
                    globalScope,
                    dsn: UserErrors.dsn,
                    appName,
                    user,
                    params,
                })
                setupRaven({
                    Raven: WixDataRaven,
                    globalScope,
                    dsn: WixData.dsn,
                    appName,
                    user,
                    params,
                })

                zoneToRavenMap = {
                    [APPLICATION_SCOPE]: Raven,
                    [USER_SCOPE]: UserRaven,
                    [WIX_DATA_SCOPE]: WixDataRaven,
                }
            },
            log: logEvent => {
                logEvent.matchWith({
                    Trace: ({
                            payload
                        }) =>
                        payload.matchWith({
                            Breadcrumb: breadcrumb =>
                                getZoneReporter(APPLICATION_SCOPE).captureBreadcrumb(
                                    breadcrumb,
                                ),
                            [union.any]: noop,
                        }),
                    Info: ({
                        message,
                        options,
                        sessionData
                    }) => {
                        getZoneReporter(APPLICATION_SCOPE).captureMessage(
                            message,
                            createReportOptions({
                                level: 'info',
                                sessionData,
                                options
                            }),
                        )
                    },
                    Warn: ({
                        message,
                        options,
                        sessionData
                    }) => {
                        getZoneReporter(APPLICATION_SCOPE).captureMessage(
                            message,
                            createReportOptions({
                                level: 'warning',
                                sessionData,
                                options
                            }),
                        )
                    },
                    Error: ({
                            error,
                            options,
                            sessionData
                        }) =>
                        getZoneReporter(options.zone).captureException(
                            error,
                            createReportOptions({
                                sessionData,
                                options
                            }),
                        ),
                    [matchAny]: noop,
                })
            },
        }
    }

export {
    ravenHandlerCreator
}