import { TFunction } from '../../components/BookingCalendar/controller';
import { minutesDifferencesBetweenTwoDates } from '../dateAndTime/dateAndTime';
import {
  DurationMapper,
  DurationMapperOptions,
} from '@wix/bookings-uou-mappers';

export const getSlotDuration = ({
  rfcStartTime,
  rfcEndTime,
  t,
  dateRegionalSettingsLocale,
}: {
  rfcStartTime: string;
  rfcEndTime: string;
  t: TFunction;
  dateRegionalSettingsLocale: string;
}): { durationText: string; durationAriaText: string } => {
  const durationInMinutes = minutesDifferencesBetweenTwoDates(
    rfcStartTime,
    rfcEndTime,
  );

  const durationOptions: DurationMapperOptions = {
    hourUnit: 'duration.units.hours',
    hourAriaUnit: 'duration.units.aria-hours',
    minuteUnit: 'duration.units.minutes',
    minuteAriaUnit: 'duration.units.aria-minutes',
  };

  const durationMapper = new DurationMapper(
    dateRegionalSettingsLocale,
    durationOptions,
    t,
  );

  return {
    durationText: durationMapper.durationTextFromMinutes(durationInMinutes),
    durationAriaText:
      durationMapper.durationAriaLabelFromMinutes(durationInMinutes),
  };
};
