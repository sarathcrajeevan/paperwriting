import { BusinessInfo, TimezoneType } from '@wix/bookings-uou-types';

export interface SchedulingTimezoneViewModel {
  canChangeTimezone?: boolean;
  viewTimezone?: string;
  viewTimezoneType?: TimezoneType;
  timezoneDropdownOptions?: TimezoneDropdownOption[];
  isBookingCalendarInstalled: boolean;
  timezoneLocale: string;
}

export interface TimezoneDropdownOption {
  id: TimezoneType;
  value: string;
}

export const schedulingTimezoneViewModelFactory = ({
  businessInfo,
  selectedTimezoneType,
  isBookingCalendarInstalled,
}: {
  businessInfo: BusinessInfo;
  selectedTimezoneType?: TimezoneType;
  isBookingCalendarInstalled?: boolean;
}): SchedulingTimezoneViewModel => {
  let selectedTimezone;
  const localTimezone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
  const isLocalTimezoneDefined = !!localTimezone;
  const businessTimezone = businessInfo.timeZone;
  const defaultTimezoneType = businessInfo?.timezoneProperties?.defaultTimezone;
  const defaultTimezone =
    defaultTimezoneType === TimezoneType.CLIENT && isLocalTimezoneDefined
      ? localTimezone
      : businessTimezone;
  const canChangeTimezone =
    businessInfo?.timezoneProperties?.clientCanChooseTimezone &&
    localTimezone !== businessTimezone &&
    isLocalTimezoneDefined;
  if (selectedTimezoneType) {
    selectedTimezone =
      isLocalTimezoneDefined && selectedTimezoneType === TimezoneType.CLIENT
        ? localTimezone
        : businessTimezone;
  }
  const viewTimezone = selectedTimezone || defaultTimezone;
  const viewTimezoneType = selectedTimezoneType || defaultTimezoneType;
  const timezoneDropdownOptions = canChangeTimezone
    ? [
        { id: TimezoneType.BUSINESS, value: businessTimezone || '' },
        { id: TimezoneType.CLIENT, value: localTimezone },
      ]
    : [];

  return {
    viewTimezone,
    viewTimezoneType,
    canChangeTimezone,
    timezoneDropdownOptions,
    isBookingCalendarInstalled: !!isBookingCalendarInstalled,
    timezoneLocale: businessInfo.dateRegionalSettingsLocale!,
  };
};
