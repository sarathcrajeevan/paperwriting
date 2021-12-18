import { BusinessInfo } from '../../types/types';
import { TimezoneType } from '@wix/bookings-uou-types';
import {
  BookingsQueryParams,
  WixOOISDKAdapter,
} from '@wix/bookings-adapter-ooi-wix-sdk';
import { getSessionValues } from '../storageFunctions';

export const getDefaultTimezone = (businessInfo?: BusinessInfo): string => {
  const localTimezone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
  const businessTimezone = businessInfo!.timeZone!;
  const defaultTimezoneType = businessInfo?.timezoneProperties?.defaultTimezone;
  return defaultTimezoneType === TimezoneType.CLIENT
    ? localTimezone
    : businessTimezone;
};

export const getCurrentTimezone = ({
  wixSdkAdapter,
  businessInfo,
}: {
  wixSdkAdapter: WixOOISDKAdapter;
  businessInfo: BusinessInfo;
}) => {
  const selectedTimezone: Maybe<string> = getSessionValues(
    wixSdkAdapter,
    BookingsQueryParams.TIMEZONE,
  );
  return selectedTimezone || getDefaultTimezone(businessInfo);
};
