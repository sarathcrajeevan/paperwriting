// https://stackoverflow.com/questions/63961803/eslint-says-all-enums-in-typescript-app-are-already-declared-in-the-upper-scope
/* eslint-disable no-shadow */
import {
  IAppData,
  IPlatformAPI,
} from '@wix/native-components-infra/dist/src/types/types';
import { IWixStatic } from '@wix/yoshi-flow-editor/tpa-settings';

export const biDefaults = {
  appName: 'service_page',
  page_name: 'service_page',
  widget_name: 'service_page',
  service_page_referral_info: 'service_details_widget',
  bookingsPlatform: 'new_bookings_server',
};

export const generateSettingsDefaults = (Wix: IWixStatic) => ({
  biToken: Wix.Utils.getInstanceValue('biToken'),
  businessId: Wix.Utils.getInstanceId,
});

export const generateWidgetDefaults = (
  appParams: IAppData,
  platformAPIs: IPlatformAPI,
  inEditor: boolean,
) => ({
  biToken: platformAPIs.bi?.biToken,
  businessId: appParams.instanceId,
  is_over_editor: inEditor,
});

export enum BITabName {
  MAIN = 'service_page/main',
  MANAGE = 'service_page/manage',
  LAYOUT = 'service_page/layout',
  TEXT = 'service_page/text',
  DESIGN = 'service_page/design',
  SECTIONS = 'service_page/sections',
  SECTIONS_TITLE = 'service_page/sections/title',
  SECTIONS_DESCRIPTION = 'service_page/sections/description',
  SECTIONS_DETAILS = 'service_page/sections/details',
  SECTIONS_GALLERY = 'service_page/sections/gallery',
  SECTIONS_POLICY = 'service_page/sections/policy',
  SECTIONS_CONTACT = 'service_page/sections/contact',
  SECTIONS_SCHEDULE = 'service_page/sections/schedule',
  DESIGN_BODY = 'service_page/design/body',
  DESIGN_HEADER = 'service_page/design/header',
  DESIGN_SIDEBAR = 'service_page/design/sidebar',
  DESIGN_SCHEDULE = 'service_page/design/schedule',
  DESIGN_DETAILS = 'service_page/design/details',
  DESIGN_GALLERY = 'service_page/design/gallery',
}

export enum BIPlatformName {
  EDITOR = 'editor',
  ADI = 'ADI',
}

export const ACTION_NAMES = {
  NAVIGATE_TO_CALENDAR: 'navigate_to_calendar',
  NAVIGATE_TO_BOOKING_FORM: 'navigate_to_booking_form',
  NAVIGATE_TO_CONTACT_FORM: 'navigate_to_contact_form',
};
