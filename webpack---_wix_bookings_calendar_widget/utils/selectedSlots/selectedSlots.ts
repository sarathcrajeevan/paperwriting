import { TFunction } from '../../components/BookingCalendar/controller';
import { SelectedBookingPreference } from '../bookingPreferences/bookingPreferences';
import { getSelectedValuesOfAllBookingPreferences } from '../selectedBookingPreferences/selectedBookingPreferences';
import { Optional } from '../../types/types';
import { getSlotDuration } from '../duration/duration';
import {
  LocationType,
  Slot,
  SlotAvailability,
} from '@wix/ambassador-availability-calendar/types';

export const getSelectedSlots = ({
  selectableSlotsAtSelectedTime,
  dateRegionalSettingsLocale,
  t,
  selectedBookingPreferences,
}: {
  selectableSlotsAtSelectedTime: SlotAvailability[];
  dateRegionalSettingsLocale: string;
  t: TFunction;
  selectedBookingPreferences: SelectedBookingPreference[];
}): SlotAvailability[] => {
  const [selectedLocation, selectedStaffMember, selectedDuration] =
    getSelectedValuesOfAllBookingPreferences(selectedBookingPreferences);

  return selectableSlotsAtSelectedTime.filter(
    (selectableSlot: SlotAvailability) => {
      return (
        isSlotLocationSelected(selectableSlot?.slot, selectedLocation) &&
        isSlotStaffSelected(selectableSlot.slot, selectedStaffMember) &&
        isSlotDurationSelected(
          selectableSlot.slot,
          selectedDuration,
          dateRegionalSettingsLocale,
          t,
        )
      );
    },
  );
};

const isSlotLocationSelected = (
  slot: Optional<Slot>,
  selectedLocation: Optional<string>,
) => {
  const isAtClientPlace = slot?.location?.locationType === LocationType.CUSTOM;
  const isSlotOnSelectedLocation =
    isAtClientPlace ||
    slot?.location?.id === selectedLocation ||
    slot?.location?.formattedAddress === selectedLocation;

  return selectedLocation ? isSlotOnSelectedLocation : true;
};

const isSlotStaffSelected = (
  slot: Optional<Slot>,
  selectedStaffMember: Optional<string>,
) => {
  const isSlotWithSelectedStaffMember =
    slot?.resource?.id === selectedStaffMember;

  return selectedStaffMember ? isSlotWithSelectedStaffMember : true;
};

const isSlotDurationSelected = (
  slot: Optional<Slot>,
  selectedDuration: Optional<string>,
  dateRegionalSettingsLocale: string,
  t: TFunction,
) => {
  const isSlotWithSelectedDuration =
    getSlotDuration({
      rfcStartTime: slot?.startDate!,
      rfcEndTime: slot?.endDate!,
      t,
      dateRegionalSettingsLocale,
    }).durationText === selectedDuration;

  return selectedDuration ? isSlotWithSelectedDuration : true;
};
