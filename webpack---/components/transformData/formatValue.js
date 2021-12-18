import formatTypes from '@wix/dbsm-common/src/connection-config/formatTypes'
import {
    isDate
} from 'lodash-es'

const formatByType = (value, formatter, {
    format,
    wixSdk
}) => {
    switch (format.type) {
        case formatTypes.DATETIME:
            if (!isDate(value)) {
                return value
            }

            if (!formatter) {
                return ''
            }

            return formatter.formatDateTime(value, format.params.dateFormat)
        default:
            return value
    }
}

export default (value, formatter, {
    format,
    wixSdk
}) => {
    if (format) {
        return formatByType(value, formatter, {
            format,
            wixSdk
        })
    }

    return value
}