import { DialogType } from '../../components/BookingCalendar/ViewModel/dialogViewModel/dialogViewModel';
import { TimeSlotsAvailability, WidgetComponents } from './consts';
import { Optional } from '../../types/types';
import { TimeSlotAvailabilityStatus } from '../timeSlots/timeSlots';

export const mapDialogTypeToWidgetComponent = (
  dialogType: Optional<DialogType>,
): Optional<WidgetComponents> => {
  switch (dialogType) {
    case DialogType.PremiumViewer:
      return WidgetComponents.PREMIUM_VIEWER_DIALOG;
    case DialogType.JoinWaitlist:
      return WidgetComponents.JOIN_WAITLIST_DIALOG;
    case DialogType.RescheduleConfirm:
      return WidgetComponents.RESCHEDULE_DIALOG;
  }
};

export const mapTimeSlotsByAvailabilityStatusesToTimeSlotsAvailability = (
  timeSlotsByAvailabilityStatuses: Map<string, TimeSlotAvailabilityStatus>,
): TimeSlotsAvailability => {
  const timeSlotsAvailability: TimeSlotsAvailability = {
    AVAILABLE: 0,
    FULL: 0,
    TOO_LATE_TO_BOOK: 0,
    TOO_EARLY_TO_BOOK: 0,
    WAITLIST: 0,
  };

  timeSlotsByAvailabilityStatuses.forEach(
    (status: TimeSlotAvailabilityStatus) => {
      if (status.tooLateToBookAllSlots) {
        timeSlotsAvailability.TOO_LATE_TO_BOOK++;
      } else if (status.allSlotsAreFull && !status.withWaitingList) {
        timeSlotsAvailability.FULL++;
      } else if (status.withWaitingList) {
        timeSlotsAvailability.WAITLIST++;
      } else if (status.tooEarlyToBookAllSlots) {
        timeSlotsAvailability.TOO_EARLY_TO_BOOK++;
      } else {
        timeSlotsAvailability.AVAILABLE++;
      }
    },
  );

  return timeSlotsAvailability;
};
