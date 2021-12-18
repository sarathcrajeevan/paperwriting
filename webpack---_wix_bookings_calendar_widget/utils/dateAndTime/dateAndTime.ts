import { rfcToShiftedDate, DateTimeFormatter } from '@wix/bookings-date-time';

export const getLocalTimezone = (): string => {
  return new Intl.DateTimeFormat().resolvedOptions().timeZone;
};

// example - return 2020-10-05T00:00:00
export const getLocalDateTimeStartOfDay = (date: Date): string => {
  const localDate = getLocalDateFromDateTime(date);
  return `${localDate}T00:00:00`;
};

// example - return 2020-10-05T23:59:59
export const getLocalDateTimeEndOfDay = (date: Date): string => {
  const localDate = getLocalDateFromDateTime(date);
  return getEndOfDayFromLocalDate(localDate);
};

export const convertDateToRfcStartOfDay = (date: Date): string => {
  const localDate = getLocalDateFromDateTime(date);
  return `${localDate}T00:00:00.000Z`;
};

export const getLocalDateFromDateTime = (date: Date): string => {
  const addZero = (num: number) => (num < 10 ? `0${num}` : `${num}`);
  return `${date.getFullYear()}-${addZero(date.getMonth() + 1)}-${addZero(
    date.getDate(),
  )}`;
};

export const getDateTimeFromLocalDateTime = (localDateTime: string): Date =>
  rfcToShiftedDate(localDateTime);

export const formatLocalDateTimeToDateView = (
  localDateTime: string,
  locale?: string,
) => new DateTimeFormatter(locale!).formatDayOfMonth(localDateTime);

export const formatRfcTimeStringToTimeSlotView = (
  rfcTime: string,
  locale?: string,
) => new DateTimeFormatter(locale!).formatTime(rfcTime);

export const formatLocalDateTimeToDay = (
  localDateTime: string,
  locale: string,
) => new DateTimeFormatter(locale).formatDay(localDateTime);

export const formatLocalDateTimeToShortWeekday = (
  localDateTime: string,
  locale: string,
) => new DateTimeFormatter(locale).formatShortWeekday(localDateTime);

export const formatLocalDateTimeToWeekday = (
  localDateTime: string,
  locale: string,
) => new DateTimeFormatter(locale).formatWeekday(localDateTime);

export const formatMonth = (dateString: string, locale: string) =>
  new DateTimeFormatter(locale).formatMonth(dateString);

export const formatShortDate = (
  dateString: string,
  locale?: string,
  timezone?: string,
) => new DateTimeFormatter(locale!, timezone).formatShortDate(dateString);

export const formatShortTime = (
  dateString: string,
  locale?: string,
  timezone?: string,
) => new DateTimeFormatter(locale!, timezone).formatTime(dateString);

export const formatRfcTimeStringToDateAndTimeView = (
  rfcTime: string,
  locale: string,
) => new DateTimeFormatter(locale!).formatDateAndTime(rfcTime);

export const minutesDifferencesBetweenTwoDates = (
  rfcStartTime: string,
  rfcEndTime: string,
) => {
  const secondsInDay = 86400;
  const minutesInHour = 60;
  const hoursInDay = 24;
  const minutesInDay = minutesInHour * hoursInDay;

  const delta =
    Math.abs(
      new Date(rfcStartTime).getTime() - new Date(rfcEndTime).getTime(),
    ) / 1000;

  const days = Math.floor(delta / secondsInDay);
  const hours =
    Math.floor(delta / (minutesInHour * minutesInHour)) % hoursInDay;
  const minutes = Math.floor(delta / minutesInHour) % minutesInHour;

  return minutes + hours * minutesInHour + days * minutesInDay;
};

export function getTodayLocalDateTimeStartOfDay(timezone: string): string {
  const dateTimeFormat = new Intl.DateTimeFormat('en-us', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: timezone,
  });
  const dateString = dateTimeFormat.format(new Date());
  const shiftedDate = new Date(dateString);

  return getLocalDateTimeStartOfDay(shiftedDate);
}

export function getStartOfMonthAsLocalDateTime(localDateTime: string): string {
  const date = rfcToShiftedDate(localDateTime);
  date.setDate(1);
  return getLocalDateTimeStartOfDay(date);
}

export function getStartOfNextDateLocalDateTime(localDateTime: string): string {
  const date = rfcToShiftedDate(localDateTime);
  date.setDate(date.getDate() + 1);
  return getLocalDateTimeStartOfDay(date);
}

export function getEndOfMonthAsLocalDateTime(
  localDateTime: string,
  monthRange: number,
): string {
  const date = rfcToShiftedDate(localDateTime);
  const endOfMonthAsDate = new Date(
    date.getFullYear(),
    date.getMonth() + monthRange,
    0,
  );
  const endOfMonthAsLocalDate = getLocalDateFromDateTime(endOfMonthAsDate);
  return getEndOfDayFromLocalDate(endOfMonthAsLocalDate);
}

export function getEndOfDayFromLocalDateTime(localDateTime: string): string {
  const localDate = localDateTime.substr(0, localDateTime.indexOf('T'));
  return getEndOfDayFromLocalDate(localDate);
}

export function getEndOfDayFromLocalDate(localDate: string): string {
  return `${localDate}T23:59:59`;
}

export function convertRfcTimeToLocalDateTimeStartOfDay(
  rfcTime: string,
): string {
  const localDate = rfcTime.substr(0, rfcTime.indexOf('T'));
  return `${localDate}T00:00:00`;
}

export function isMonthDifferent(
  localDateTime1: string,
  localDateTime2: string,
) {
  return (
    rfcToShiftedDate(localDateTime1).getMonth() !==
    rfcToShiftedDate(localDateTime2).getMonth()
  );
}
