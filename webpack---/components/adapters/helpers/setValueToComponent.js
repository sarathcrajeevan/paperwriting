'use strict'
import componentTypes from '@wix/dbsm-common/src/componentTypes'
import isRecord from './isRecord'
import {
    get
} from 'lodash-es'

const setPropAtPath = (component, propPath, valueToSet) => {
    const propNames = propPath.split('.')
    const path = propNames.slice(0, -1)
    const prop = propNames.slice(-1)
    const objToSet = path.length > 0 ? get(component, path) : component
    objToSet[prop] = valueToSet
}

const isValueReference = (value, fieldType) =>
    fieldType === 'reference' && isRecord(value)

const isValueEmpty = value =>
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)

const isComponentWriteOnly = ({
        type
    }) =>
    type === componentTypes.SignatureInput

export default ({
    component,
    fieldType,
    propPath,
    value: _value,
    modeIsLivePreview,
}) => {
    const value = isValueReference(_value, fieldType) ? _value._id : _value

    if (isComponentWriteOnly(component)) {
        if (!value) {
            component.clear()
        }
        return
    }

    if (modeIsLivePreview && isValueEmpty(value)) return

    //set doesn't work if oldValue and newValue are the same.
    setPropAtPath(component, propPath, value)
}