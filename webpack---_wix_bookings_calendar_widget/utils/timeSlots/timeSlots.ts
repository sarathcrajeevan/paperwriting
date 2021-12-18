import {
  QueryAvailabilityResponse,
  SlotAvailability,
} from '@wix/ambassador-availability-calendar/types';
import { Optional } from '../../types/types';
import {
  convertRfcTimeToLocalDateTimeStartOfDay,
  getDateTimeFromLocalDateTime,
} from '../dateAndTime/dateAndTime';

export interface TimeSlotAvailabilityStatus {
  allSlotsAreFull: boolean;
  tooLateToBookAllSlots: boolean;
  tooEarlyToBookAllSlots: boolean;
  withWaitingList: boolean;
}

export const getTimeSlotsAvailabilityStatuses = (
  slotAvailabilities: Optional<QueryAvailabilityResponse>,
): Map<string, TimeSlotAvailabilityStatus> => {
  const timeSlotsAvailabilityStatus = new Map<
    string,
    TimeSlotAvailabilityStatus
  >();

  const compressedSlotsByRfcStartTime: Map<
    string,
    SlotAvailability[]
  > = compressSlotsByRfcStartTime(
    slotAvailabilities?.availabilityEntries || [],
  );
  compressedSlotsByRfcStartTime.forEach(
    (slots: SlotAvailability[], rfcStartTime: string) => {
      const timeSlotStatus = getTimeSlotAvailabilityStatus(slots);
      timeSlotsAvailabilityStatus.set(rfcStartTime, timeSlotStatus);
    },
  );

  return timeSlotsAvailabilityStatus;
};

export const getOnlyFutureSlotAvailabilities = (
  availableSlots?: QueryAvailabilityResponse,
): SlotAvailability[] => {
  const now = new Date();
  const onlyFutureEntries = availableSlots?.availabilityEntries?.filter(
    (availabilityEntry) => {
      const rfcStartTime = availabilityEntry?.slot?.startDate;
      return rfcStartTime && new Date(rfcStartTime) >= now;
    },
  );
  return onlyFutureEntries || [];
};

const compressSlotsByRfcStartTime = (
  slotAvailabilities: SlotAvailability[],
): Map<string, SlotAvailability[]> => {
  const slotsByRfcStartTime = new Map<string, SlotAvailability[]>();
  slotAvailabilities?.forEach((slot: SlotAvailability) => {
    const rfcStartTime = slot?.slot?.startDate;
    if (rfcStartTime) {
      const currentValue = slotsByRfcStartTime.get(rfcStartTime) || [];
      slotsByRfcStartTime.set(rfcStartTime, [...currentValue, slot]);
    }
  });
  return slotsByRfcStartTime;
};

const getTimeSlotAvailabilityStatus = (
  slots: SlotAvailability[],
): TimeSlotAvailabilityStatus => {
  const allSlotsAreFull = isAllSlotsAreFull(slots);
  const tooLateToBookAllSlots = isTooLateToBookAllSlots(slots);
  const tooEarlyToBookAllSlots = isTooEarlyToBookAllSlots(slots);
  const atLeastOneSlotIsWithWaitingList = isAtLeastOneSlotIsWithOpenWaitingList(
    slots,
  );

  return {
    allSlotsAreFull: allSlotsAreFull && !atLeastOneSlotIsWithWaitingList,
    tooLateToBookAllSlots,
    tooEarlyToBookAllSlots,
    withWaitingList: allSlotsAreFull && atLeastOneSlotIsWithWaitingList,
  };
};

export const isAtLeastOneSlotIsWithOpenWaitingList = (
  slots: SlotAvailability[],
): boolean => {
  return slots.some((slotAvailability: SlotAvailability) =>
    isSlotWithOpenWaitingList(slotAvailability),
  );
};

export const isAllSlotsAreFull = (slots: SlotAvailability[]): boolean => {
  return slots.every((slotAvailability: SlotAvailability) =>
    isFullSlot(slotAvailability),
  );
};

const isTooLateToBookAllSlots = (slots: SlotAvailability[]): boolean => {
  return slots.every((slotAvailability: SlotAvailability) =>
    isTooLateToBookSlot(slotAvailability),
  );
};

const isTooEarlyToBookAllSlots = (slots: SlotAvailability[]): boolean => {
  return slots.every((slotAvailability: SlotAvailability) =>
    isTooEarlyToBookSlot(slotAvailability),
  );
};

export const isSlotWithOpenWaitingList = (slot: SlotAvailability): boolean => {
  return isFullSlot(slot) && Number(slot.waitingList?.openSpots) > 0;
};

const isFullSlot = (slot: SlotAvailability): boolean => {
  return Number(slot.openSpots) === 0;
};

const isTooEarlyToBookSlot = (slot: SlotAvailability): boolean => {
  return !!slot.bookingPolicyViolations?.tooEarlyToBook;
};

const isTooLateToBookSlot = (slot: SlotAvailability): boolean => {
  return !!slot.bookingPolicyViolations?.tooLateToBook;
};

export const filterTimeSlotsAvailabilityStatusesByDate = (
  timeSlotsAvailabilityStatuses: Map<string, TimeSlotAvailabilityStatus>,
  dateAsLocalDate: string,
): Map<string, TimeSlotAvailabilityStatus> => {
  const timeSlotAvailabilityStatusesInGivenDate = new Map<
    string,
    TimeSlotAvailabilityStatus
  >();
  timeSlotsAvailabilityStatuses.forEach(
    (timeSlotStatus: TimeSlotAvailabilityStatus, rfcStartTime: string) => {
      const startOfDay = convertRfcTimeToLocalDateTimeStartOfDay(rfcStartTime);
      if (
        getDateTimeFromLocalDateTime(startOfDay).getTime() ===
        getDateTimeFromLocalDateTime(dateAsLocalDate).getTime()
      ) {
        timeSlotAvailabilityStatusesInGivenDate.set(
          rfcStartTime,
          timeSlotStatus,
        );
      }
    },
  );
  return timeSlotAvailabilityStatusesInGivenDate;
};

export const getNumberOfAvailableTimeSlots = (
  timeSlotsAvailabilityStatuses: Map<string, TimeSlotAvailabilityStatus>,
): number => {
  let numberOfAvailableTimeSlots = 0;
  timeSlotsAvailabilityStatuses.forEach(
    (status: TimeSlotAvailabilityStatus) => {
      if (
        !status.tooLateToBookAllSlots &&
        !status.tooEarlyToBookAllSlots &&
        !status.allSlotsAreFull
      ) {
        numberOfAvailableTimeSlots++;
      }
    },
  );
  return numberOfAvailableTimeSlots;
};
