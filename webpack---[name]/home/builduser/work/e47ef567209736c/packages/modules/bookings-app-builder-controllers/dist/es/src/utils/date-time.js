import {
    dateToShiftedRfcString,
    rfcToShiftedDate,
} from '@wix/bookings-date-time';
export function getShiftedRfcStringDateStart(rfcString) {
    var _a = rfcString.split(/[-T:.+]/),
        year = _a[0],
        month = _a[1],
        day = _a[2];
    var localDate = new Date(Number(year), Number(month) - 1, Number(day));
    return dateToShiftedRfcString(localDate);
}
export function getStartOfDayInSelectedTimezone(timezone) {
    var dateTimeFormat = new Intl.DateTimeFormat('en-us', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: timezone,
    });
    var dateString = dateTimeFormat.format(new Date());
    var _a = dateString.split('/'),
        month = _a[0],
        day = _a[1],
        year = _a[2];
    var localDate = new Date(Number(year), Number(month) - 1, Number(day));
    return dateToShiftedRfcString(localDate);
}
export function getEndOfMonthShiftedRfcString(shiftedDateString, addMonths) {
    var shiftedDate = rfcToShiftedDate(shiftedDateString);
    var endOfMonthAsDate = new Date(shiftedDate.getFullYear(), shiftedDate.getMonth() + addMonths, 0);
    return dateToShiftedRfcString(endOfMonthAsDate);
}
//# sourceMappingURL=date-time.js.map