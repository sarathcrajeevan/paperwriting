'use strict'

import {
    FILTER_INPUT_ROLE
} from '@wix/wix-data-client-common/src/connection-config/roles'
import {
    Maybe
} from '@wix/wix-code-adt'
import {
    parseStandardFilter
} from '../helpers/parseStandardFilter'
import castValueToFieldType from './castValueToFieldType'
import {
    getComponentValueAccessorName
} from '../helpers/componentValueUtils'

const resolve = (unresolvedFilterValue, components) => {
    const {
        filterId
    } = unresolvedFilterValue
    const userFilterComponent = components.find(
        comp => comp.connectionConfig.filters[filterId],
    )

    if (!userFilterComponent) {
        return
    }

    const valueAccessorName = getComponentValueAccessorName(userFilterComponent)
    return userFilterComponent[valueAccessorName]
}

export default ({
    getConnectedComponents,
    getFieldType
}) =>
filter => {
    const connectedComponents = getConnectedComponents()
    if (!connectedComponents) {
        return Maybe.Nothing()
    }

    const filterInputComponents = connectedComponents
        .filter(({
            role
        }) => role === FILTER_INPUT_ROLE)
        .map(({
            component
        }) => component)

    return parseStandardFilter(filter).map(
        ({
            field,
            condition,
            value,
            positive
        }) => {
            const fieldType = getFieldType(field)
            const resolvedValue = resolve(value, filterInputComponents)
            const castValue = castValueToFieldType(fieldType, resolvedValue)

            if (!castValue && castValue !== 0) {
                return {
                    $and: []
                }
            }

            const parsedFilter = {
                [field]: {
                    [condition]: castValue
                }
            }

            return positive ? parsedFilter : {
                $not: [parsedFilter]
            }
        },
    )
}