import { FilterTypes } from '../components/BookingCalendar/ViewModel/filterViewModel/filterViewModel';

export type Optional<T> = T | undefined;

export type FilterOptions = {
  [key in keyof typeof FilterTypes]: string[];
};

export type LocalDateTimeRange = {
  fromAsLocalDateTime: string;
  toAsLocalDateTime: string;
};

export enum CalendarErrors {
  RESCHEDULE_SERVER_ERROR = 'reschedule_server_error',
  AVAILABLE_SLOTS_SERVER_ERROR = 'available_slots_server_error',
  NEXT_AVAILABLE_DATE_SERVER_ERROR = 'next_available_date_server_error',
  NO_SELECTED_LOCATION_ERROR = 'selected_slot_validation_no_selected_location',
  NO_SELECTED_DURATION_ERROR = 'selected_slot_validation_no_selected_duration',
  NO_SELECTED_STAFF_MEMBER_ERROR = 'selected_slot_validation_no_selected_staff_member',
  NO_TIME_SELECTED_ERROR = 'selected_slot_validation_no_time_selected_error',
  NO_VALID_PRICING_PLAN_IN_RESCHEDULE_FLOW_ERROR = 'no_valid_pricing_plan_in_reschedule_flow_error',
  NO_VALID_PRICING_PLAN_WARNING = 'no_valid_pricing_plan_warning',
  NO_NEXT_AVAILABLE_DATE_WARNING = 'no_next_available_date',
}

export enum Preference {
  LOCATION = 'location',
  DURATION = 'duration',
  STAFF_MEMBER = 'staffMember',
}

export enum TriggeredByOptions {
  INITIALIZE_WIDGET = 'initialize_widget',
  TIMEZONE_CHANGED = 'timezone_changed',
  DATE_SELECTED = 'date_selected',
  MONTH_SELECTED = 'month_selected',
  WEEK_SELECTED = 'week_selected',
  BOOKING_DETAILS_CLEAR_BUTTON = 'booking_details_clear_button',
  STAFF_MEMBER_BOOKING_PREFERENCE_SELECTED = 'staff_member_booking_preference_selected',
  LOCATION_BOOKING_PREFERENCE_SELECTED = 'location_booking_preference_selected',
  BOOKING_DETAILS_BOOKING_PREFERENCE_SELECTED = 'booking_details_booking_preference_selected',
  GO_TO_NEXT_AVAILABLE_DATE_LINK = 'go_to_next_available_date_link',
  TIME_SELECTED = 'time_selected',
  SUBMIT = 'submit',
  FILTER_CHANGED = 'filter_changed',
}

export enum SettingsTab {
  Manage = 'calendar_page/manage',
  Layout = 'calendar_page/layout',
  Display = 'calendar_page/display',
  Design = 'calendar_page/design',
  Text = 'calendar_page/text',
  Support = 'calendar_page/support',
}

export enum HelpArticleIds {
  Manage = 'acfff058-943d-43d2-92c7-4b6c1d47478a',
  Layout = '18119bc9-bbd8-4c60-8804-f5e7d445fdb3',
  Display = '3f84e08d-7e3c-4897-82f4-41e8cb047e24',
  Design = '58565384-f8b9-47cc-8a9f-f8eae3cd3740',
  Text = '0fd3809d-1ec8-4af2-9aec-7b1be69e412b',
  Support = '978668a8-1233-415b-8bb3-3e8c514df734',
}

export enum AlignmentOptions {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
  STRETCH = 'stretch',
}

export enum LayoutOptions {
  DAILY_MONTH = 'daily_month',
  DAILY_WEEK = 'daily_week',
  WEEKLY = 'weekly',
}

export enum SourceOptions {
  CUSTOM,
  SERVICE,
}

export enum SlotsAvailability {
  ALL,
  ONLY_AVAILABLE,
}

export enum SlotsStatus {
  LOADING = 'LOADING',
  NO_AVAILABLE_SLOTS = 'NO_AVAILABLE_SLOTS',
  AVAILABLE_SLOTS = 'AVAILABLE_SLOTS',
}
