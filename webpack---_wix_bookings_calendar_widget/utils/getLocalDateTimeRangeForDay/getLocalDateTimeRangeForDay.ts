import { getFirstDayOfTheWeek } from '../dateAndTime/weekStart';
import {
  getDateTimeFromLocalDateTime,
  getLocalDateTimeEndOfDay,
  getLocalDateTimeStartOfDay,
} from '../dateAndTime/dateAndTime';
import { getWeekDatesRange } from 'wix-ui-tpa/dist/src/components/WeeklyDateNavigation/dateUtils/dateUtils';

export const getLocalDateTimeRangeForDay = (
  locale: string,
  dayAsLocalDateTime: string,
) => {
  const firstDayOfTheWeek = getFirstDayOfTheWeek(locale);
  const { startOfWeek, endOfWeek } = getWeekDatesRange(
    getDateTimeFromLocalDateTime(dayAsLocalDateTime),
    firstDayOfTheWeek,
  );
  const fromAsLocalDateTime = getLocalDateTimeStartOfDay(startOfWeek);
  const toAsLocalDateTime = getLocalDateTimeEndOfDay(endOfWeek);
  return { fromAsLocalDateTime, toAsLocalDateTime };
};
