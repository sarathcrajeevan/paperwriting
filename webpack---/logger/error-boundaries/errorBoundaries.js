'use strict'

import {
    isError
} from 'lodash-es'
import errorBoundaries from 'wix-error-boundaries'

export const errorBoundaryScopes = {
    USER_SCOPE: 'userCodeZone',
    APPLICATION_SCOPE: 'applicationCodeZone',
    WIX_DATA_SCOPE: 'wixDataCodeZone',
}
const WIX_DATA_USER_ERROR_CODES = [
    'WD_SITE_IN_TEMPLATE_MODE',
    'WD_PERMISSION_DENIED',
]
const WIX_DATA_UNKNOWN_ERROR = 'WD_UNKNOWN_ERROR'
const handled = Symbol('error was handled')
const errorBoundaryScope = Symbol('error-boundary-scope')

export const isErrorHandled = e => e[handled]

const isUserError = (error, scope) =>
    error[errorBoundaryScope] === errorBoundaryScopes.USER_SCOPE ||
    scope === errorBoundaryScopes.USER_SCOPE ||
    (scope === errorBoundaryScopes.WIX_DATA_SCOPE &&
        WIX_DATA_USER_ERROR_CODES.includes(error.code))

const isWixDataError = (error, scope) =>
    error.code === WIX_DATA_UNKNOWN_ERROR ||
    scope === errorBoundaryScopes.WIX_DATA_SCOPE

const reportException = (logFn, e) => {
    logFn(e)
    e[handled] = true
}

const dbsmViewerErrorHandler = logFunctionsPerScope => (e, scope) => {
    if (!(!isError(e) || isErrorHandled(e))) {
        if (isUserError(e, scope)) {
            reportException(logFunctionsPerScope[errorBoundaryScopes.USER_SCOPE], e)
        } else if (isWixDataError(e, scope)) {
            reportException(
                logFunctionsPerScope[errorBoundaryScopes.WIX_DATA_SCOPE],
                e,
            )
        } else if (scope === errorBoundaryScopes.APPLICATION_SCOPE) {
            reportException(
                logFunctionsPerScope[errorBoundaryScopes.APPLICATION_SCOPE],
                e,
            )
        }
    }
    throw e
}

export const errorBoundariesCreator = logFunctionsPerScope => {
    return errorBoundaries({
        scopes: Object.values(errorBoundaryScopes),
        errorHandler: dbsmViewerErrorHandler(logFunctionsPerScope),
    })
}

export const setErrorScope = (error, scope) =>
    (error[errorBoundaryScope] = scope)

export default {
    errorBoundariesCreator,
    isErrorHandled,
    errorBoundaryScopes,
    setErrorScope,
}