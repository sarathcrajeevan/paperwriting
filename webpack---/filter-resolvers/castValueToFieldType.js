import {
    get
} from 'lodash-es'
import {
    FieldType
} from '@wix/wix-data-schema-types'

const {
    stringArray,
    number
} = FieldType

export default (fieldType, value) =>
fieldType
    .map(type => {
        if (
            type === number &&
            typeof value === 'string' &&
            /^[+-]?(?:\d+\.?\d*|\d*\.?\d+)$/.test(value.trim())
        ) {
            return Number(value)
        }

        if (type === stringArray && get(value, 'length', 0) === 0) {
            return null
        }

        return value
    })
    .getOrElse(value)