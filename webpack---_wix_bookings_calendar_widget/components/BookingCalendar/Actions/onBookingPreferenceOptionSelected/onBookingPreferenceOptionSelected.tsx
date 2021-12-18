import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { getBookingPreferencesForSelectedTime } from '../../../../utils/bookingPreferences/bookingPreferencesForSelectedTime';
import {
  BookingPreference,
  SelectedBookingPreference,
} from '../../../../utils/bookingPreferences/bookingPreferences';
import { isSelectedBookingPreferenceWithWaitingList } from '../../../../utils/selectedBookingPreferences/selectedBookingPreferences';
import { CalendarBiLogger } from '../../../../utils/bi/biLoggerFactory';
import {
  Optional,
  Preference,
  TriggeredByOptions,
} from '../../../../types/types';
import { RemoveError } from '../removeError/removeError';

export type OnBookingPreferenceOptionSelected = (
  selectedSlotOption: SelectedBookingPreference,
) => Promise<void>;

export function createOnBookingPreferenceOptionSelectedAction(
  {
    getControllerState,
    context,
  }: ActionFactoryParams<CalendarState, CalendarContext>,
  removeError: RemoveError,
): OnBookingPreferenceOptionSelected {
  return async (userSelectedBookingPreference: SelectedBookingPreference) => {
    const [state, setState] = getControllerState();
    const { biLogger } = context;
    const {
      selectedBookingPreferences: initialPreviouslySelectedBookingPreferences,
      selectedTime,
      selectableSlotsAtSelectedTime,
      calendarErrors,
    } = state;

    if (selectableSlotsAtSelectedTime) {
      const markedSelectedPreferences: Map<
        SelectedBookingPreference['key'],
        SelectedBookingPreference
      > = new Map(
        initialPreviouslySelectedBookingPreferences.map((pref) => [
          pref.key,
          pref,
        ]),
      );
      const markSelectedPreference = (
        selectedBookingPreference: SelectedBookingPreference,
        previouslySelectedBookingPreferences: SelectedBookingPreference[],
      ) => {
        markedSelectedPreferences.set(
          selectedBookingPreference.key,
          selectedBookingPreference,
        );

        const selectedBookingPreferencesToUpdate = getUpdateSelectedBookingPreferences(
          {
            previouslySelectedBookingPreferences,
            selectedBookingPreference,
          },
        );

        const bookingPreferences: BookingPreference[] = getBookingPreferencesForSelectedTime(
          {
            selectableSlotsAtSelectedTime,
            selectedBookingPreferences: selectedBookingPreferencesToUpdate,
            calendarErrors,
            context,
          },
        );
        updateCalendarErrors({
          bookingPreferences,
          selectedBookingPreference,
          removeError,
        });

        sendBookingDetailsLoadedBiEvent({
          previouslySelectedBookingPreferences,
          selectedBookingPreference,
          bookingPreferences,
          selectedTime,
          biLogger,
        });
        bookingPreferences.forEach((bookingPreference) => {
          // mark all drop downs with only one selectable option as selected
          if (
            bookingPreference.preselectedOptionId &&
            !markedSelectedPreferences.has(bookingPreference.key)
          ) {
            markSelectedPreference(
              {
                key: bookingPreference.key,
                value: bookingPreference.preselectedOptionId,
              },
              selectedBookingPreferencesToUpdate,
            );
          }
        });
      };
      markSelectedPreference(
        userSelectedBookingPreference,
        initialPreviouslySelectedBookingPreferences,
      );
      setState({
        selectedBookingPreferences: Array.from(
          markedSelectedPreferences.values(),
        ),
      });
    }
  };
}

const updateCalendarErrors = ({
  bookingPreferences,
  selectedBookingPreference,
  removeError,
}: {
  bookingPreferences: BookingPreference[];
  selectedBookingPreference: SelectedBookingPreference;
  removeError: RemoveError;
}) => {
  const selectedPreference = bookingPreferences.filter(
    (preference: BookingPreference) =>
      preference.key === selectedBookingPreference.key,
  );
  const preferenceError = selectedPreference?.[0]?.error.key;

  if (preferenceError) {
    removeError(preferenceError);
  }
};

const getUpdateSelectedBookingPreferences = ({
  previouslySelectedBookingPreferences,
  selectedBookingPreference,
}: {
  previouslySelectedBookingPreferences: SelectedBookingPreference[];
  selectedBookingPreference: SelectedBookingPreference;
}) => {
  const previouslySelectedPreferencesOnlyFromOtherPreferences = previouslySelectedBookingPreferences.filter(
    (previouslySelectedBookingPreference: SelectedBookingPreference) =>
      previouslySelectedBookingPreference.key !== selectedBookingPreference.key,
  );
  return [
    ...previouslySelectedPreferencesOnlyFromOtherPreferences,
    selectedBookingPreference,
  ];
};

const sendBookingDetailsLoadedBiEvent = ({
  previouslySelectedBookingPreferences,
  selectedBookingPreference,
  bookingPreferences,
  selectedTime,
  biLogger,
}: {
  previouslySelectedBookingPreferences: SelectedBookingPreference[];
  selectedBookingPreference: SelectedBookingPreference;
  bookingPreferences: BookingPreference[];
  selectedTime: Optional<string>;
  biLogger: CalendarBiLogger;
}) => {
  void biLogger.bookingsCalendarBookingDetailsLoad({
    triggeredBy: getPreferenceTriggeredBy(selectedBookingPreference.key),
    selectedSlot: selectedTime,
    properties: JSON.stringify({
      previouslySelectedBookingPreferences,
      selectedBookingPreference: {
        ...selectedBookingPreference,
        ...(isSelectedBookingPreferenceWithWaitingList(
          selectedBookingPreference,
          bookingPreferences,
        )
          ? { waitlist: true }
          : {}),
      },
    }),
  });
};

const getPreferenceTriggeredBy = (preference: Preference) => {
  switch (preference) {
    case Preference.STAFF_MEMBER:
      return TriggeredByOptions.STAFF_MEMBER_BOOKING_PREFERENCE_SELECTED;
    case Preference.LOCATION:
      return TriggeredByOptions.LOCATION_BOOKING_PREFERENCE_SELECTED;
    case Preference.DURATION:
      return TriggeredByOptions.BOOKING_DETAILS_BOOKING_PREFERENCE_SELECTED;
    default:
      return '';
  }
};
