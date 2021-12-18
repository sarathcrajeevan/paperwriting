'use strict'

import {
    Result
} from '@wix/wix-code-adt'
import {
    set
} from 'lodash-es'
import {
    TraceType
} from '../logger/traceType'

const addBreadcrumbResult = (value, breadcrumb) => {
    return value == null ? breadcrumb : set(breadcrumb, ['data', 'result'], value)
}

// :: (Raven, (String, [*]) -> Breadcrumb, * -> *) -> { Wrapper, AsyncWrapper }
export default (logger, createBreadcrumb, sanitise) => ({
    // withBreadcrumbs :: (String, [*] -> *) -> [*] -> *
    withBreadcrumbs:
        (name, fn) =>
        (...args) => {
            const breadcrumb = createBreadcrumb(name, args)

            return Result.try(() => fn(...args)).fold(
                message => {
                    breadcrumb.data = breadcrumb.data || {}
                    breadcrumb.data.exception = message
                    breadcrumb.level = 'error'
                    logger.trace(TraceType.Breadcrumb(breadcrumb))
                    throw message
                },
                value => {
                    const resultBreadcrumb = addBreadcrumbResult(
                        sanitise(value),
                        breadcrumb,
                    )
                    logger.trace(TraceType.Breadcrumb(resultBreadcrumb))
                    return value
                },
            )
        },

    // withBreadcrumbsAsync :: (String, [*] -> *) -> [*] -> Promise *
    withBreadcrumbsAsync:
        (name, fn) =>
        (...args) => {
            const breadcrumb = createBreadcrumb(name, args)

            return fn(...args).then(
                value => {
                    const resultBreadcrumb = addBreadcrumbResult(
                        sanitise(value),
                        breadcrumb,
                    )
                    logger.trace(TraceType.Breadcrumb(resultBreadcrumb))
                    return value
                },
                message => {
                    breadcrumb.data = breadcrumb.data || {}
                    breadcrumb.data.exception = message
                    breadcrumb.level = 'error'
                    logger.trace(TraceType.Breadcrumb(breadcrumb))
                    throw message
                },
            )
        },
})