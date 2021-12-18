export const widgetDefaults = {
  pageName: 'booking_calendar_widget',
};

export const RelatedPages = {
  BookingForm: 'booking_form_widget',
};

export enum WidgetComponents {
  TIME_PICKER = 'time_picker',
  DATE_PICKER = 'date_picker',
  BOOKING_DETAILS = 'booking_details',
  TIMEZONE_PICKER = 'timezone_picker',
  RESCHEDULE_DIALOG = 'reschedule_dialog',
  JOIN_WAITLIST_DIALOG = 'join_waitlist_dialog',
  PREMIUM_VIEWER_DIALOG = 'premium_viewer_dialog',
  FILTER = 'filter',
}

export enum WidgetElements {
  TIME_SLOT = 'time_slot',
  MONTH_ARROW = 'month_arrow',
  WEEK_ARROW = 'week_arrow',
  DATE_IN_MONTH = 'date_in_month',
  GO_TO_NEXT_AVAILABLE_DATE_LINK = 'go_to_next_available_date_link',
  CONFIRM_BUTTON = 'confirm_button',
  DROPDOWN = 'dropdown',
  CLOSE_BUTTON = 'close_button',
  CHECKBOX = 'checkbox',
  COUNTER = 'counter',
  CHECKBOX_ALL = 'checkbox_all',
  FILTER_BUTTON = 'filter_button',
  CLEAR_BUTTON = 'clear_button',
  SHOW_ALL_SESSIONS_BUTTON = 'show_all_sessions_button',
}

export enum InitializeCalendarDateOptions {
  FIRST_AVAILABLE_DATE = 'first_available_date',
  TODAY = 'today',
}

export type TimeSlotsAvailability = {
  AVAILABLE: number;
  FULL: number;
  TOO_LATE_TO_BOOK: number;
  TOO_EARLY_TO_BOOK: number;
  WAITLIST: number;
};
