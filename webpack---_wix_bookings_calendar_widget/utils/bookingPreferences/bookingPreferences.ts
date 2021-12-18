import settingsParams from '../../components/BookingCalendar/settingsParams';
import {
  LocationType,
  SlotAvailability,
} from '@wix/ambassador-availability-calendar/types';
import { TFunction } from '../../components/BookingCalendar/controller';
import { CalendarContext } from '../context/contextFactory';
import { CalendarErrors, Optional, Preference } from '../../types/types';
import { getSlotDuration } from '../duration/duration';

export type BookingsPreferenceError = {
  key: CalendarErrors;
  message: string;
};

export type SelectedBookingPreference = {
  key: Preference;
  value: string;
};

export type BookingPreferenceOption = {
  id?: string;
  value?: string;
  ariaLabel?: string;
  isSelectable?: boolean;
  isWithWaitingList?: boolean;
};

export type BookingPreference = {
  key: Preference;
  error: BookingsPreferenceError;
  options: BookingPreferenceOption[];
  preselectedOptionId?: BookingPreferenceOption['id'];
  placeholder: string;
  getBookingPreferenceOptionFromSlot?: (
    slotAvailability: SlotAvailability,
  ) => BookingPreferenceOption;
};

export const getBookingPreferences = ({
  context,
}: {
  context: CalendarContext;
}): BookingPreference[] => {
  const { getContent, t, businessInfo } = context;
  const locationLabel = getContent({
    settingsParam: settingsParams.locationLabel,
    translationKey: 'app.settings.defaults.location-label',
  });
  const location: BookingPreference = {
    key: Preference.LOCATION,
    error: {
      key: CalendarErrors.NO_SELECTED_LOCATION_ERROR,
      message: t('app.booking-details.dropdowns.error.location.text'),
    },
    placeholder: locationLabel,
    options: [],
    getBookingPreferenceOptionFromSlot: (
      slotAvailability: SlotAvailability,
    ) => {
      const locationId = slotAvailability!.slot!.location!.id;
      const locationText = getLocationText(slotAvailability!.slot!.location, t);

      return {
        id: locationId || locationText!,
        value: locationText!,
      };
    },
  };

  const staffMemberLabel = getContent({
    settingsParam: settingsParams.staffMemberLabel,
    translationKey: 'app.settings.defaults.staff-member-label',
  });
  const staffMember: BookingPreference = {
    key: Preference.STAFF_MEMBER,
    error: {
      key: CalendarErrors.NO_SELECTED_STAFF_MEMBER_ERROR,
      message: t('app.booking-details.dropdowns.error.staff-member.text'),
    },
    placeholder: staffMemberLabel,
    options: [],
    getBookingPreferenceOptionFromSlot: (
      slotAvailability: SlotAvailability,
    ) => {
      const staffMemberName = slotAvailability.slot?.resource?.name!;
      const staffMemberId = slotAvailability.slot?.resource?.id!;

      return {
        id: staffMemberId,
        value: staffMemberName,
      };
    },
  };

  const durationLabel = getContent({
    settingsParam: settingsParams.durationLabel,
    translationKey: 'app.settings.defaults.duration-label',
  });
  const duration: BookingPreference = {
    key: Preference.DURATION,
    error: {
      key: CalendarErrors.NO_SELECTED_DURATION_ERROR,
      message: t('app.booking-details.dropdowns.error.duration.text'),
    },
    placeholder: durationLabel,
    options: [],
    getBookingPreferenceOptionFromSlot: (
      slotAvailability: SlotAvailability,
    ) => {
      const rfcStartTime = slotAvailability.slot?.startDate!;
      const rfcEndTime = slotAvailability.slot?.endDate!;
      const slotDuration = getSlotDuration({
        rfcStartTime,
        rfcEndTime,
        t,
        dateRegionalSettingsLocale: businessInfo!.dateRegionalSettingsLocale!,
      });

      return {
        id: slotDuration.durationText,
        value: slotDuration.durationText,
        ariaLabel: slotDuration.durationAriaText,
      };
    },
  };

  return [location, staffMember, duration];
};

const getLocationText = (location: any, t: TFunction): Optional<string> => {
  switch (location?.locationType) {
    case LocationType.OWNER_BUSINESS:
      return location.name;
    case LocationType.OWNER_CUSTOM:
      return location.formattedAddress;
    case LocationType.CUSTOM:
      return t('app.booking-details.dropdowns.locations.client-place.text');
    default:
      return '';
  }
};
