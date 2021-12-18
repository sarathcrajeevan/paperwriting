import {
    flow
} from 'lodash-es'
import {
    UPLOAD_BUTTON_ROLE
} from '@wix/wix-data-client-common/src/connection-config/roles'
import convertDateTime from './convertDateTime'
import convertUploadResult from './convertUploadResult'
import {
    FieldType
} from '@wix/wix-data-schema-types'

const {
    reference,
    dateTime
} = FieldType

export default ({
    value,
    currentValue,
    fieldType,
    fieldName,
    role,
    utils: {
        referenceFetcher,
        mediaItemUtils
    } = {},
}) => {
    const arrayOfConvertorsAndConditions = [{
            converter: value =>
                referenceFetcher(
                    value, // referenced record id
                    fieldName,
                ),
            condition: fieldType === reference,
        },
        {
            converter: value => convertDateTime(currentValue, value),
            condition: fieldType === dateTime,
        },
        {
            converter: value =>
                convertUploadResult({
                    value,
                    currentValue,
                    fieldType,
                    mediaItemUtils,
                }),
            condition: role === UPLOAD_BUTTON_ROLE,
        },
    ]

    const conversionFlow = arrayOfConvertorsAndConditions.reduce(
        (acc, {
            converter,
            condition
        }) => {
            if (condition) acc.push(converter)
            return acc
        }, [],
    )
    return flow(conversionFlow)(value)
}