import {
    isTimeValid,
    mergeDateWithTime,
    getTimeFromDate,
    getValidDate,
} from './dateTimeUtils'

export default (currentValue, newValue) => {
    const destructuredCurrentValue = {}
    const destructuredNewValue = {}
    if (isTimeValid(currentValue)) {
        destructuredCurrentValue.time = currentValue
        destructuredCurrentValue.date = new Date()
    } else {
        const currentDate = getValidDate(currentValue)
        destructuredCurrentValue.date = currentDate
        destructuredCurrentValue.time = getTimeFromDate(currentDate)
    }

    if (isTimeValid(newValue)) {
        destructuredNewValue.time = newValue
    } else {
        destructuredNewValue.date = getValidDate(newValue)
    }

    return mergeDateWithTime({
        ...destructuredCurrentValue,
        ...destructuredNewValue,
    })
}