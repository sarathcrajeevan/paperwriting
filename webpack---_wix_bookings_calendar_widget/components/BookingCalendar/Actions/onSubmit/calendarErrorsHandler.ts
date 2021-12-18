import {
  BookingPreference,
  SelectedBookingPreference,
} from '../../../../utils/bookingPreferences/bookingPreferences';
import { AddError } from '../addError/addError';

export const updateCalendarErrors = (
  bookingPreferences: BookingPreference[],
  addErrorAction: AddError,
  selectedBookingPreferences?: SelectedBookingPreference[],
) => {
  bookingPreferences.forEach((bookingPreference: BookingPreference) => {
    const isMultipleOptions = bookingPreference.options.length > 1;

    const isOptionSelected = selectedBookingPreferences?.some(
      (selectedPreference: SelectedBookingPreference) =>
        selectedPreference.key === bookingPreference.key,
    );

    if (isMultipleOptions && !isOptionSelected) {
      addErrorAction(bookingPreference.error.key);
    }
  });
};
