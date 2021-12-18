import { FormFactor } from '../WidgetApp/constants/environment.const';
import * as _ from 'lodash';
import { BusinessInfo, TimezoneType } from '@wix/bookings-uou-types';

export const getPresetId = (): any =>
  new Promise((resolve) => {
    window.Wix.Data.Public.get(
      'presetId',
      { scope: 'COMPONENT' },
      (data) => resolve(data),
      () => resolve(undefined),
    );
  });

export const getSiteTextPresets = () =>
  new Promise((resolve) => {
    window.Wix.Styles.getSiteTextPresets(resolve, resolve);
  });

export const getSiteColors = () =>
  new Promise((resolve) => {
    window.Wix.Styles.getSiteColors(resolve, resolve);
  });

export const getStyleParams = () =>
  new Promise((resolve) => {
    window.Wix.Styles.getStyleParams(resolve, resolve);
  });

export const getCurrentStyles = () =>
  Promise.all([getSiteColors(), getSiteTextPresets(), getStyleParams()]);

export const isMobileFromFormFactor = (props) =>
  _.get(props, 'host.formFactor', FormFactor.DESKTOP) === FormFactor.MOBILE;

export function cleanNulls(object: any) {
  object &&
    Object.keys(object).forEach(
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      (key) => object[key] === null && delete object[key],
    );
  return object;
}

export const getDefaultTimezone = (businessInfo?: BusinessInfo) => {
  const localTimezone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
  const businessTimezone = businessInfo?.timeZone;
  const defaultTimezoneType = businessInfo?.timezoneProperties?.defaultTimezone;
  return defaultTimezoneType === TimezoneType.CLIENT
    ? localTimezone
    : businessTimezone;
};
