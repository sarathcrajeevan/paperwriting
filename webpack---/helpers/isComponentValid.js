'use strict'

import {
    some,
    values,
    omit,
    get,
    isEmpty
} from 'lodash-es'
import componentTypes from '@wix/dbsm-common/src/componentTypes'

const {
    UploadButton: uploadButtonSdkType
} = componentTypes
const isUploadButtonValid = (component, record, connectionConfig) => {
    if (component.validity.valid) {
        return true
    }

    const hasErrorOtherThanValueMissing = some(
        values(omit(component.validity, ['valid', 'valueMissing'])),
        value => value,
    )
    if (hasErrorOtherThanValueMissing) {
        return false
    }

    const fieldConnectedToValue = get(
        connectionConfig,
        'properties.value.fieldName',
    )

    return !isEmpty(record[fieldConnectedToValue])
}

export default ({
    component,
    connectionConfig
}, currentRecord) => {
    if (component.type === uploadButtonSdkType) {
        return isUploadButtonValid(component, currentRecord, connectionConfig)
    }

    // Feature detection for validationMixin
    if (typeof component.validity === 'object') {
        return component.validity.valid
    }

    return true
}