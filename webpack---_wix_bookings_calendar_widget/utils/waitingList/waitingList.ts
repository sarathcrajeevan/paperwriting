import { isSlotWithOpenWaitingList } from '../timeSlots/timeSlots';
import { SlotAvailability } from '@wix/ambassador-availability-calendar/types';
import { Optional } from '../../types/types';
import {
  BookingPreference,
  SelectedBookingPreference,
} from '../bookingPreferences/bookingPreferences';
import { isSelectedBookingPreferenceWithWaitingList } from '../selectedBookingPreferences/selectedBookingPreferences';

export const isWaitingListFlow = ({
  selectableSlots,
  selectedBookingPreferences,
  bookingPreferences,
}: {
  selectableSlots: Optional<SlotAvailability[]>;
  selectedBookingPreferences: SelectedBookingPreference[];
  bookingPreferences: BookingPreference[];
}): boolean => {
  return (
    areAllSlotsWithWaitingList(selectableSlots) ||
    isAtLeastOneSelectedPreferenceWithWaitingList(
      selectedBookingPreferences,
      bookingPreferences,
    )
  );
};

const areAllSlotsWithWaitingList = (
  selectableSlots: Optional<SlotAvailability[]>,
): boolean => {
  return selectableSlots?.length
    ? selectableSlots.reduce(
        (accumulator: boolean, slotAvailability: SlotAvailability) =>
          isSlotWithOpenWaitingList(slotAvailability) && accumulator,
        true,
      )
    : false;
};

const isAtLeastOneSelectedPreferenceWithWaitingList = (
  selectedBookingPreferences: SelectedBookingPreference[],
  bookingPreferences: BookingPreference[],
): boolean => {
  return selectedBookingPreferences.reduce(
    (
      accumulator: boolean,
      selectedBookingPreference: SelectedBookingPreference,
    ) =>
      isSelectedBookingPreferenceWithWaitingList(
        selectedBookingPreference,
        bookingPreferences,
      ) || accumulator,
    false,
  );
};
