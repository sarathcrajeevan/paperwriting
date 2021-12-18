import { CalendarState } from '../../components/BookingCalendar/controller';
import { CalendarErrors, Optional } from '../../types/types';

// eslint-disable-next-line no-shadow
export enum ToastType {
  RescheduleError = 'reschedule-error',
  AvailableSlotsError = 'available-slots-error',
  NextAvailableSlotError = 'next-available-slot-error',
}

export default function getToastType(
  state: CalendarState,
): Optional<ToastType> {
  const { calendarErrors } = state;
  if (calendarErrors.includes(CalendarErrors.RESCHEDULE_SERVER_ERROR)) {
    return ToastType.RescheduleError;
  }
  if (calendarErrors.includes(CalendarErrors.AVAILABLE_SLOTS_SERVER_ERROR)) {
    return ToastType.AvailableSlotsError;
  }
  if (
    calendarErrors.includes(CalendarErrors.NEXT_AVAILABLE_DATE_SERVER_ERROR)
  ) {
    return ToastType.NextAvailableSlotError;
  }
}
