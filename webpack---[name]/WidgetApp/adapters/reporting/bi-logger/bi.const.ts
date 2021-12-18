export const WidgetViewerEvents = {
  WIDGET_VIEWER_CLICK: { evid: 501 },
  WIDGET_VIEWER_PAGE_LOADED: { evid: 540 },
  WIDGET_VIEWER_EXPOSURE_TEST: { evid: 666 },
  WIDGET_CANT_BOOK_GROUPS: { evid: 527 },
  WIDGET_ALL_SERVICES_CATEGORY_EXPOSURE: { evid: 602 },
};

export const BI_OFFERING_TYPE = {
  INDIVIDUAL: 'ind',
  GROUP: 'class',
};

export const WIDGET_BI_REFERRAL = {
  WIDGET: 'widget',
  WIDGET_IMAGE: 'widget_image',
  WIDGET_TITLE: 'widget_title',
  WIDGET_DESCRIPTION: 'widget_description',
  WIDGET_BUTTON: 'widget_button',
  WIDGET_MORE_INFO: 'widget_more_info_label',
};

export const ACTION_NAMES = {
  NAVIGATE_TO_CALENDAR: 'navigate_to_calendar',
};

export const BI_BOOKINGS_SRC = 16;
export const BI_BOOKINGS_USER_OF_USER_END_POINT = 'wixboost-ugc';
export const WIDGET_NAME_PHASE_1 = 'widget-phase-one';

export interface AllServicesCategoryExposureInfo {
  isExposedToTest: boolean;
  allServicesCategoryShown: boolean;
  allServicesCategorySettingsValue: boolean;
  isMobile: boolean;
}
