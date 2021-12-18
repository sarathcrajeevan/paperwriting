import {
  QueryAvailabilityResponse,
  Slot,
  SlotAvailability,
  SlotResource,
} from '@wix/ambassador-availability-calendar/types';
import { ServiceLocationType } from '@wix/bookings-uou-types';
import { LayoutOptions } from '../../types/types';

function toTime(num: number) {
  const s = '00' + num;
  return s.substr(s.length - 2) + ':00';
}

function createSlot({
  id,
  scheduleId,
  date,
  startTime,
  endTime,
  location,
  resource,
}: {
  id: string;
  scheduleId: string;
  date: string;
  startTime: string;
  endTime: string;
  location: any;
  resource: SlotResource;
}): Slot {
  return {
    sessionId: id,
    scheduleId,
    startDate: `${date}T${startTime}:00.000Z`,
    endDate: `${date}T${endTime}:00.000Z`,
    location,
    resource,
  };
}

function createSlotAvailability(date: Date, index: number) {
  const dateISOString = date.toISOString();
  const day = dateISOString.substr(0, dateISOString.indexOf('T'));
  return {
    bookable: true,
    openSpots: 5,
    totalSpots: 10,
    slot: createSlot({
      id: `${index}`,
      scheduleId: `123`,
      date: day,
      startTime: toTime(index),
      endTime: toTime(index + 1),
      location: {
        locationType: ServiceLocationType.OWNER_BUSINESS,
        formattedAddress: 'Shlomo Ibn Gabirol Street 114',
        id: 'location-1-id',
        name: 'Tel Aviv',
      },
      resource: {
        id: 'staff-1-id',
        name: 'Staff 1',
      },
    }),
  };
}

function getNumberOfSlotsForADay(dayInTheWeek: number) {
  switch (dayInTheWeek) {
    case 2:
    case 3:
      return 6;
    case 4:
      return 0;
    default:
      return 4;
  }
}

export function createDummySlots({
  from,
  calendarLayout = LayoutOptions.DAILY_MONTH,
  isWeeklyCalendarEnabled = false,
}: {
  from?: string;
  calendarLayout?: LayoutOptions;
  isWeeklyCalendarEnabled?: boolean;
} = {}): QueryAvailabilityResponse {
  let availabilityEntries = [];

  if (isWeeklyCalendarEnabled) {
    if (calendarLayout === LayoutOptions.WEEKLY) {
      const date = from ? new Date(from) : new Date();
      for (let dayInTheWeek = 0; dayInTheWeek < 7; dayInTheWeek++) {
        date.setDate(date.getDate() + 1);
        const numberOfSlots = getNumberOfSlotsForADay(dayInTheWeek);
        const availabilityEntriesForThisDay = new Array(numberOfSlots)
          .fill('00:00')
          .map(
            (_, index): SlotAvailability => createSlotAvailability(date, index),
          );
        availabilityEntries.push(...availabilityEntriesForThisDay);
      }
    } else {
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      availabilityEntries = new Array(18).fill('00:00').map(
        (_, index): SlotAvailability => {
          date.setDate(index + 1);
          return createSlotAvailability(date, index);
        },
      );
    }
  } else {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    availabilityEntries = new Array(18).fill('00:00').map(
      (_, index): SlotAvailability => {
        date.setDate(index + 1);
        return createSlotAvailability(date, index);
      },
    );
  }

  return {
    availabilityEntries,
  };
}
