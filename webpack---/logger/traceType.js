'use strict'

import {
    union
} from '@wix/wix-code-adt'

const TraceType = union('TraceType', {
    Breadcrumb: ({
        category,
        message,
        level,
        data
    }) => ({
        category,
        message,
        level,
        data,
    }),
    Action: ({
        actionName,
        options
    }) => ({
        actionName,
        options
    }),
})

export {
    TraceType
}