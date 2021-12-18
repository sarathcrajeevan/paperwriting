'use strict'

import {
    forEach
} from 'lodash-es'

export default connectionConfig => {
    const {
        properties,
        events,
        behaviors
    } = connectionConfig
    const bindingDescription = {}

    forEach(properties, ({
        fieldName
    }, propName) => {
        bindingDescription[propName] = fieldName
    })
    forEach(events, ({
        action
    }, eventName) => {
        bindingDescription[eventName] = action
    })
    forEach(behaviors, ({
        type: behavior
    }) => {
        bindingDescription.text = behavior
    })

    return bindingDescription
}