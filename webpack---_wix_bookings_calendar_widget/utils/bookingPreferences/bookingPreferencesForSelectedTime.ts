import { SlotAvailability } from '@wix/ambassador-availability-calendar/types';
import { TFunction } from '../../components/BookingCalendar/controller';
import { CalendarContext } from '../context/contextFactory';
import {
  getBookingPreferences,
  BookingPreference,
  BookingPreferenceOption,
  SelectedBookingPreference,
} from './bookingPreferences';
import { isSlotWithOpenWaitingList } from '../timeSlots/timeSlots';
import { CalendarErrors } from '../../types/types';

export const getBookingPreferencesForSelectedTime = ({
  selectableSlotsAtSelectedTime,
  selectedBookingPreferences,
  calendarErrors,
  context,
}: {
  selectableSlotsAtSelectedTime: SlotAvailability[];
  selectedBookingPreferences?: SelectedBookingPreference[];
  calendarErrors: CalendarErrors[];
  context: CalendarContext;
}): BookingPreference[] => {
  const bookingPreferences = getBookingPreferences({
    context,
  });
  const { t } = context;
  return createBookingPreferencesForSelectedTime({
    bookingPreferences,
    selectableSlotsAtSelectedTime,
    selectedBookingPreferences,
    calendarErrors,
    t,
  });
};

const createBookingPreferencesForSelectedTime = ({
  bookingPreferences,
  selectableSlotsAtSelectedTime,
  selectedBookingPreferences,
  calendarErrors,
  t,
}: {
  bookingPreferences: BookingPreference[];
  selectableSlotsAtSelectedTime: SlotAvailability[];
  selectedBookingPreferences?: SelectedBookingPreference[];
  calendarErrors: CalendarErrors[];
  t: TFunction;
}): BookingPreference[] => {
  return bookingPreferences.map(
    (currentBookingPreference: BookingPreference) => {
      const { key, error, placeholder } = currentBookingPreference;
      const hasError = calendarErrors.includes(error.key);
      const options = createOptionsForBookingPreference({
        selectableSlotsAtSelectedTime,
        bookingPreferences,
        selectedBookingPreferences,
        currentBookingPreference,
        t,
      });

      const selectableOptions = options.filter((option) => option.isSelectable);

      const preselectedOptionId =
        selectableOptions.length === 1 ? selectableOptions[0].id : undefined;

      return {
        preselectedOptionId,
        key,
        options,
        error: {
          key: error.key,
          message: hasError ? error.message : '',
        },
        placeholder,
      };
    },
  );
};

const createOptionsForBookingPreference = ({
  selectableSlotsAtSelectedTime,
  bookingPreferences,
  selectedBookingPreferences,
  currentBookingPreference,
  t,
}: {
  selectableSlotsAtSelectedTime: SlotAvailability[];
  bookingPreferences: BookingPreference[];
  selectedBookingPreferences?: SelectedBookingPreference[];
  currentBookingPreference: BookingPreference;
  t: TFunction;
}): BookingPreferenceOption[] => {
  const filteredBookableSlots: SlotAvailability[] = filterBookableSlotsAccordingToSelectedPreferences(
    {
      selectableSlotsAtSelectedTime,
      bookingPreferences,
      selectedBookingPreferences,
      currentBookingPreference,
    },
  );

  let bookingPreferenceOptions: BookingPreferenceOption[] = [];
  selectableSlotsAtSelectedTime.forEach((bookableSlots) => {
    const slotBookingPreferenceOption = currentBookingPreference.getBookingPreferenceOptionFromSlot!(
      bookableSlots,
    );

    const isSelectable = isBookingPreferenceOptionSelectable({
      filteredBookableSlots,
      currentBookingPreference,
      slotBookingPreferenceOption,
    });

    const isWithWaitingList = isBookingPreferenceOptionWithWaitingList({
      selectableSlotsAtSelectedTime,
      currentBookingPreference,
      slotBookingPreferenceOption,
    });

    bookingPreferenceOptions.push({
      ...slotBookingPreferenceOption,
      isWithWaitingList,
      isSelectable,
    });
  });

  bookingPreferenceOptions = removeDuplicatePreferenceOptions(
    bookingPreferenceOptions,
  );

  return bookingPreferenceOptions;
};

const removeDuplicatePreferenceOptions = (
  bookingPreferenceOptions: BookingPreferenceOption[],
): BookingPreferenceOption[] => {
  const uniqueBookingPreferenceOptions: BookingPreferenceOption[] = [];

  bookingPreferenceOptions.forEach((bookingPreferenceOption) => {
    const uniqueBookingPreferenceOptionWithTheSameId = uniqueBookingPreferenceOptions.find(
      (uniqueBookingPreferenceOption: BookingPreferenceOption) =>
        bookingPreferenceOption.id === uniqueBookingPreferenceOption.id,
    );

    const isBookingPreferenceOptionNotExists = !uniqueBookingPreferenceOptionWithTheSameId;
    if (isBookingPreferenceOptionNotExists) {
      uniqueBookingPreferenceOptions.push(bookingPreferenceOption);
    }
  });

  return uniqueBookingPreferenceOptions;
};

const filterBookableSlotsAccordingToSelectedPreferences = ({
  selectableSlotsAtSelectedTime,
  bookingPreferences,
  selectedBookingPreferences,
  currentBookingPreference,
}: {
  selectableSlotsAtSelectedTime: SlotAvailability[];
  bookingPreferences: BookingPreference[];
  selectedBookingPreferences?: SelectedBookingPreference[];
  currentBookingPreference: BookingPreference;
}): SlotAvailability[] => {
  let filteredBookableSlotsAtSelectedTime = selectableSlotsAtSelectedTime;
  bookingPreferences.forEach((preference: BookingPreference) => {
    const selectedBookingPreference = selectedBookingPreferences?.find(
      (selectedPreference) => preference.key === selectedPreference.key,
    );

    if (
      selectedBookingPreference &&
      preference.key !== currentBookingPreference.key
    ) {
      filteredBookableSlotsAtSelectedTime = filteredBookableSlotsAtSelectedTime.filter(
        (bookableSlot) =>
          preference.getBookingPreferenceOptionFromSlot!(bookableSlot).id ===
          selectedBookingPreference.value,
      );
    }
  });
  return filteredBookableSlotsAtSelectedTime;
};

const isBookingPreferenceOptionSelectable = ({
  filteredBookableSlots,
  currentBookingPreference,
  slotBookingPreferenceOption,
}: {
  filteredBookableSlots: SlotAvailability[];
  currentBookingPreference: BookingPreference;
  slotBookingPreferenceOption: BookingPreferenceOption;
}) => {
  return filteredBookableSlots.some((filteredSlot: SlotAvailability) => {
    return (
      currentBookingPreference.getBookingPreferenceOptionFromSlot!(filteredSlot)
        .id === slotBookingPreferenceOption.id
    );
  });
};

const isBookingPreferenceOptionWithWaitingList = ({
  selectableSlotsAtSelectedTime,
  currentBookingPreference,
  slotBookingPreferenceOption,
}: {
  selectableSlotsAtSelectedTime: SlotAvailability[];
  currentBookingPreference: BookingPreference;
  slotBookingPreferenceOption: BookingPreferenceOption;
}) => {
  const filteredBookableSlotsByGivenSlotPreferenceOption = selectableSlotsAtSelectedTime.filter(
    (bookableSlot) => {
      return (
        currentBookingPreference.getBookingPreferenceOptionFromSlot!(
          bookableSlot,
        ).id === slotBookingPreferenceOption.id
      );
    },
  );
  return filteredBookableSlotsByGivenSlotPreferenceOption.every(
    isSlotWithOpenWaitingList,
  );
};
