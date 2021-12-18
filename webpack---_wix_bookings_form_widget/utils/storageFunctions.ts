import {
  BookingsQueryParams,
  WixOOISDKAdapter,
} from '@wix/bookings-adapter-ooi-wix-sdk';
import { Submission } from '@wix/forms-ui/types';

export function getSessionValues(
  wixSdkAdapter: WixOOISDKAdapter,
  key: BookingsQueryParams,
) {
  const valueFromStorage = wixSdkAdapter.getFromSessionStorage(key);

  if (valueFromStorage) {
    return JSON.parse(valueFromStorage);
  }
}

export function setFieldsValuesInStorage(
  wixSdkAdapter: WixOOISDKAdapter,
  submission: Submission,
) {
  if (submission) {
    wixSdkAdapter.setToSessionStorage(
      BookingsQueryParams.FILLED_FIELDS,
      JSON.stringify(submission),
    );
  }
}
