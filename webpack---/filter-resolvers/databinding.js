'use strict'

import {
    Maybe
} from '@wix/wix-code-adt'

const dataBindingFilterResolver =
    dependenciesMap =>
    ({
        filterId
    }) =>
    Maybe.fromNullable(dependenciesMap[filterId]).chain(
        ({
            controllerApi,
            fieldName
        }) =>
        Maybe.fromNullable(controllerApi.getCurrentItem()).map(item => {
            const value = item[fieldName]

            return value === undefined ? null : value
        }),
    )

export default dataBindingFilterResolver