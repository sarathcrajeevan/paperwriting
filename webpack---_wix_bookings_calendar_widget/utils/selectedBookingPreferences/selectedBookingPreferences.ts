import {
  BookingPreference,
  BookingPreferenceOption,
  SelectedBookingPreference,
} from '../bookingPreferences/bookingPreferences';
import { Optional, Preference } from '../../types/types';

export const isSelectedBookingPreferenceWithWaitingList = (
  selectedPreference: SelectedBookingPreference,
  bookingPreferences: BookingPreference[],
): boolean => {
  const bookingPreference = getBookingPreferenceFromSelectedPreference(
    selectedPreference,
    bookingPreferences,
  );

  return !!bookingPreference?.options.some(
    (bookingPreferenceOption: BookingPreferenceOption) =>
      bookingPreferenceOption.id === selectedPreference.value &&
      bookingPreferenceOption.isWithWaitingList,
  );
};

const getBookingPreferenceFromSelectedPreference = (
  selectedPreference: SelectedBookingPreference,
  bookingPreferences: BookingPreference[],
) => {
  return bookingPreferences.filter(
    (bookingPreference: BookingPreference) =>
      bookingPreference.key === selectedPreference.key,
  )[0];
};

export const getSelectedValuesOfAllBookingPreferences = (
  selectedBookingPreferences: SelectedBookingPreference[],
): Optional<string>[] => {
  return [
    Preference.LOCATION,
    Preference.STAFF_MEMBER,
    Preference.DURATION,
  ].map((currentPreference: Preference) => {
    const currentPreferenceSelection = selectedBookingPreferences.find(
      (selectedBookingPreference: SelectedBookingPreference) =>
        selectedBookingPreference.key === currentPreference,
    );
    return currentPreferenceSelection?.value;
  });
};
