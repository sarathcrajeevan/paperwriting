'use strict'

import {
    addComponentEventListener
} from './helpers'
import baseAdapter from './baseAdapter'
import {
    getComponentValueAccessorName,
    getComponentDefaultValue,
} from '../../helpers/componentValueUtils'

export default ({
    applicationCodeZone
}) => {
    return {
        ...baseAdapter,

        bindToComponent({
            component
        }, actions) {
            if (typeof component.onChange === 'function') {
                addComponentEventListener(
                    component,
                    'onChange',
                    actions.refresh,
                    applicationCodeZone,
                )
            }
        },

        resetUserFilter({
            component
        }) {
            const componentAccessorName = getComponentValueAccessorName(component)
            component[componentAccessorName] = getComponentDefaultValue(component)
        },
    }
}