import { convertDateToRfcStartOfDay } from '../../utils/dateAndTime/dateAndTime';
import { SlotAvailability } from '@wix/ambassador-availability-calendar/types';

export function createDummyDateAvailability(date: Date = new Date()) {
  const startOfMonthDate = new Date(date);
  startOfMonthDate.setMilliseconds(0);
  startOfMonthDate.setDate(1);
  const sundayStartOfMonth = new Date(
    +startOfMonthDate - daysToMilliseconds(startOfMonthDate.getDay()),
  );
  const availableDays: any[] = [
    new Date(+sundayStartOfMonth + daysToMilliseconds(2)),
    new Date(+sundayStartOfMonth + daysToMilliseconds(3)),
    new Date(+sundayStartOfMonth + daysToMilliseconds(4)),
    new Date(+sundayStartOfMonth + daysToMilliseconds(9)),
    new Date(+sundayStartOfMonth + daysToMilliseconds(10)),
    new Date(+sundayStartOfMonth + daysToMilliseconds(11)),
    new Date(+sundayStartOfMonth + daysToMilliseconds(16)),
    new Date(+sundayStartOfMonth + daysToMilliseconds(17)),
    new Date(+sundayStartOfMonth + daysToMilliseconds(18)),
    new Date(+sundayStartOfMonth + daysToMilliseconds(23)),
    new Date(+sundayStartOfMonth + daysToMilliseconds(24)),
    new Date(+sundayStartOfMonth + daysToMilliseconds(25)),
    new Date(+sundayStartOfMonth + daysToMilliseconds(30)),
    new Date(+sundayStartOfMonth + daysToMilliseconds(31)),
    new Date(+sundayStartOfMonth + daysToMilliseconds(32)),
    new Date(+sundayStartOfMonth + daysToMilliseconds(37)),
    new Date(+sundayStartOfMonth + daysToMilliseconds(38)),
    new Date(+sundayStartOfMonth + daysToMilliseconds(39)),
  ]
    .filter((availableDay) => date < availableDay)
    .filter((availableDay) => availableDay.getMonth() === date.getMonth())
    .map(createAvailableDay);
  return {
    availabilityEntries: availableDays,
  };
}

function daysToMilliseconds(days: number) {
  return 1000 * 60 * 60 * 24 * days;
}

function createAvailableDay(date: Date): SlotAvailability {
  return {
    bookable: true,
    slot: {
      startDate: convertDateToRfcStartOfDay(date),
    },
  };
}
