'use strict'

import {
    omit
} from 'lodash-es'
import createBreadcrumbMessage from '../helpers/createBreadcrumbMessage'
import {
    TraceType
} from '../logger/traceType'

export const createTraceReduxMiddleware =
    (logger, datasetId) => store => next => action => {
        logger.trace(
            TraceType.Breadcrumb({
                category: 'redux',
                message: createBreadcrumbMessage(action.type, datasetId),
                data: omit(action, 'type', 'record'),
            }),
        )

        return next(action)
    }