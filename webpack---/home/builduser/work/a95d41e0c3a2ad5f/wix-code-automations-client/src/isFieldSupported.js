import {
    FieldType
} from '@wix/wix-data-schema-types'

const {
    text,
    boolean,
    number,
    dateTime,
    richText,
    url,
    reference,
    stringArray,
} = FieldType

const supportedAutomationFieldsTypes = [
    text,
    richText,
    boolean,
    dateTime,
    reference,
    number,
    url,
    stringArray,
]

export const isFieldSupported = (fieldData, fieldName) => {
    const supportedSystemFieldsNames = ['_createdDate', '_updatedDate']
    const fieldType = fieldData.type
    const isSupportedType = supportedAutomationFieldsTypes.includes(fieldType)
    const isSystemField = !!fieldData.systemField
    const isSupportedSystemField = supportedSystemFieldsNames.includes(
        fieldName || fieldData.name,
    )
    return (!isSystemField || isSupportedSystemField) && isSupportedType
}