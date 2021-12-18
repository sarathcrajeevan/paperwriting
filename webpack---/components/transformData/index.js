import {
    flow
} from 'lodash-es'
import formatValue from './formatValue'
import convertValue from './transformFromRecordToView'
import transformFromViewToRecord from './transformFromViewToRecord'

const transformFromRecordToView = ({
        value,
        role,
        fieldType,
        propPath,
        componentIsInput,
        format,
        utils: {
            formatter,
            mediaItemUtils
        } = {},
    }) =>
    flow([
        value => formatValue(value, formatter, {
            format
        }),
        value =>
        convertValue(value, {
            fieldType,
            role,
            componentIsInput,
            propPath,
            mediaItemUtils,
        }),
    ])(value)

export {
    transformFromRecordToView,
    transformFromViewToRecord
}