'use strict'

const isTimeValid = value => /^\d{2}:\d{2}:\d{2}\.\d{3}$/.test(value)
const isDateValid = value => value instanceof Date && !isNaN(value)
const mergeDateWithTime = ({
    time,
    date
}) => {
    const [hours, minutes] = time.split(':')

    date.setHours(hours)
    date.setMinutes(minutes)
    date.setSeconds(0)
    date.setMilliseconds(0)

    return date
}
const getTimeFromDate = value => `${value.toTimeString().split(' ')[0]}.000`

const getTodayAtMidnightDate = value => {
    const newDate = new Date()
    newDate.setHours(0)
    newDate.setMinutes(0)
    newDate.setSeconds(0)
    newDate.setMilliseconds(0)

    return newDate
}

const getValidDate = value => {
    const validDateCandidate = new Date(value)
    return isDateValid(validDateCandidate) ?
        validDateCandidate :
        getTodayAtMidnightDate()
}

export {
    isTimeValid,
    isDateValid,
    mergeDateWithTime,
    getTimeFromDate,
    getTodayAtMidnightDate,
    getValidDate,
}