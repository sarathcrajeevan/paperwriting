'use strict'

import {
    TraceType
} from '../traceType'

const createHooks = function(logger) {
    function startHook({
        name
    }) {
        logger.trace(
            TraceType.Breadcrumb({
                category: 'interaction start',
                message: `interaction ${name} started`,
            }),
        )
    }

    function endHook({
        name,
        duration
    }) {
        logger.trace(
            TraceType.Breadcrumb({
                category: 'interaction end',
                message: `interaction ${name} ended after ${duration} ms`,
            }),
        )
    }

    return {
        startHook,
        endHook,
    }
}

export {
    createHooks
}