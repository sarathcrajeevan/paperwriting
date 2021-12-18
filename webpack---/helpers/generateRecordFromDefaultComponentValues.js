'use strict'
import {
    isTimeValid,
    isDateValid,
    mergeDateWithTime,
} from '../components/transformData/dateTimeUtils'
import {
    has
} from 'lodash-es'

const mergeValueWithRecord = (value, fieldName, record) => {
    const currentValue = record[fieldName]

    if (isTimeValid(currentValue) && isDateValid(value)) {
        record[fieldName] = mergeDateWithTime({
            time: currentValue,
            date: value,
        })
    } else if (isDateValid(currentValue) && isTimeValid(value)) {
        record[fieldName] = mergeDateWithTime({
            time: value,
            date: currentValue,
        })
    } else {
        record[fieldName] = value
    }

    return record
}

const generateRecordFromDefaultComponentValues = componentAdapterContexts => {
    const inputComponentsProps = ['value', 'checked'] //todo: export to constant
    return componentAdapterContexts.reduce(
        (record, {
            component,
            connectionConfig: {
                properties
            }
        }) => {
            inputComponentsProps.forEach(propName => {
                if (has(properties, propName)) {
                    mergeValueWithRecord(
                        component[propName],
                        properties[propName].fieldName,
                        record,
                    )
                }
            })
            return record
        }, {},
    )
}

export default generateRecordFromDefaultComponentValues