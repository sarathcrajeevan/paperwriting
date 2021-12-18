import { CalendarBiLogger } from '../biLoggerFactory';
import { TriggeredByOptions } from '../../../types/types';
import {
  QueryAvailabilityResponse,
  SlotAvailability,
} from '@wix/ambassador-availability-calendar/types';
import {
  getTimeSlotsAvailabilityStatuses,
  TimeSlotAvailabilityStatus,
} from '../../timeSlots/timeSlots';
import { mapTimeSlotsByAvailabilityStatusesToTimeSlotsAvailability } from '../mappers';

export const sendDatePickerLoadedBiEvent = ({
  biLogger,
  availableSlotsPerDay,
  triggeredBy,
}: {
  biLogger: CalendarBiLogger;
  availableSlotsPerDay?: QueryAvailabilityResponse;
  triggeredBy: TriggeredByOptions;
}) => {
  let dateAvailability;
  if (availableSlotsPerDay) {
    dateAvailability = JSON.stringify({
      datesWithAvailableSlots:
        availableSlotsPerDay.availabilityEntries?.filter(
          (availabilityEntry: SlotAvailability) => availabilityEntry.bookable,
        ).length || 0,
      datesWithUnavailableSlots:
        availableSlotsPerDay.availabilityEntries?.filter(
          (availabilityEntry: SlotAvailability) => !availabilityEntry.bookable,
        ).length || 0,
    });
  }
  biLogger.bookingsCalendarDatePickerLoad({
    dateAvailability,
    triggeredBy,
  });
};

export const sendTimePickerLoadedBiEvent = ({
  availableSlots,
  selectedDate,
  triggeredBy,
  biLogger,
}: {
  availableSlots?: QueryAvailabilityResponse;
  selectedDate?: string;
  triggeredBy: TriggeredByOptions;
  biLogger: CalendarBiLogger;
}) => {
  const timeSlotsAvailabilityStatuses: Map<string, TimeSlotAvailabilityStatus> =
    getTimeSlotsAvailabilityStatuses(availableSlots);

  const timeSlotsAvailability =
    mapTimeSlotsByAvailabilityStatusesToTimeSlotsAvailability(
      timeSlotsAvailabilityStatuses,
    );

  void biLogger.bookingsCalendarTimePickerLoad({
    triggeredBy,
    selectedDate,
    timeSlotsAvailability: JSON.stringify(timeSlotsAvailability),
  });
};
