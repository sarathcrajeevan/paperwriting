import {
  createSettingsParams,
  createSettingsParam,
  SettingsParamType,
} from '@wix/yoshi-flow-editor/tpa-settings';
import {
  AlignmentOptions,
  LayoutOptions,
  SlotsAvailability,
  SourceOptions,
} from '../../types/types';

export type ISettingsParams = {
  columnAlignment: SettingsParamType.String;
  textAlignment: AlignmentOptions;
  calendarLayout: LayoutOptions;
  dateAndTimeSectionHeader: SettingsParamType.Text;
  bookingDetailsSectionHeader: SettingsParamType.Text;
  headerSubtitleVisibility: SettingsParamType.Boolean;
  headerFiltersVisibility: SettingsParamType.Boolean;
  headerSubtitleSource: SourceOptions;
  headerSubtitle: SettingsParamType.Text;
  noSessionsOffered: SettingsParamType.Text;
  noUpcomingTimeSlots: SettingsParamType.Text;
  goToNextAvailableDate: SettingsParamType.Text;
  fullyBookedDateNotification: SettingsParamType.Text;
  loadMoreTimeSlots: SettingsParamType.Text;
  limitTimeSlotsDisplay: SettingsParamType.Boolean;
  maxTimeSlotsDisplayedPerDay: SettingsParamType.Number;
  videoConferenceBadgeVisibility: SettingsParamType.Boolean;
  videoConferenceBadge: SettingsParamType.Text;
  preferencesTitle: SettingsParamType.Text;
  staffMemberLabel: SettingsParamType.Text;
  locationLabel: SettingsParamType.Text;
  durationLabel: SettingsParamType.Text;
  bookingDetailsPricingPlanText: SettingsParamType.Text;
  bookingDetailsClearText: SettingsParamType.Text;
  nextButton: SettingsParamType.Text;
  pendingApprovalButton: SettingsParamType.Text;
  joinWaitlistButton: SettingsParamType.Text;
  rescheduleButton: SettingsParamType.Text;
  slotsAvailability: SlotsAvailability;
  waitlistIndication: SettingsParamType.Text;
  buttonsFullWidth: SettingsParamType.Boolean;
};

const calendarLayout = createSettingsParam('calendarLayout', {
  getDefaultValue: () => LayoutOptions.DAILY_MONTH,
  inheritDesktop: false,
});

export default createSettingsParams<ISettingsParams>({
  columnAlignment: {
    getDefaultValue: (): AlignmentOptions => AlignmentOptions.CENTER,
  },
  textAlignment: {
    getDefaultValue: ({ isRTL }): AlignmentOptions =>
      isRTL ? AlignmentOptions.RIGHT : AlignmentOptions.LEFT,
  },
  calendarLayout: calendarLayout as any,
  dateAndTimeSectionHeader: {
    type: SettingsParamType.Text,
    getDefaultValue: () => '',
  },
  bookingDetailsSectionHeader: {
    type: SettingsParamType.Text,
    getDefaultValue: () => '',
  },
  headerSubtitleVisibility: {
    type: SettingsParamType.Boolean,
    getDefaultValue: () => true,
  },
  headerFiltersVisibility: {
    type: SettingsParamType.Boolean,
    getDefaultValue: () => true,
  },
  headerSubtitleSource: {
    getDefaultValue: () => SourceOptions.CUSTOM,
  },
  headerSubtitle: {
    type: SettingsParamType.Text,
    getDefaultValue: () => '',
  },
  noSessionsOffered: {
    type: SettingsParamType.Text,
    getDefaultValue: () => '',
  },
  noUpcomingTimeSlots: {
    type: SettingsParamType.Text,
    getDefaultValue: () => '',
  },
  goToNextAvailableDate: {
    type: SettingsParamType.Text,
    getDefaultValue: () => '',
  },
  fullyBookedDateNotification: {
    type: SettingsParamType.Text,
    getDefaultValue: () => '',
  },
  loadMoreTimeSlots: {
    type: SettingsParamType.Text,
    getDefaultValue: () => '',
  },
  limitTimeSlotsDisplay: {
    type: SettingsParamType.Boolean,
    getDefaultValue: () => true,
  },
  maxTimeSlotsDisplayedPerDay: {
    type: SettingsParamType.Number,
    getDefaultValue: ({ getSettingParamValue }) => {
      const layout =
        getSettingParamValue(calendarLayout) || LayoutOptions.DAILY_MONTH;
      return layout === LayoutOptions.WEEKLY ? 5 : 10;
    },
  },
  preferencesTitle: {
    type: SettingsParamType.Text,
    getDefaultValue: () => '',
  },
  staffMemberLabel: {
    type: SettingsParamType.Text,
    getDefaultValue: () => '',
  },
  locationLabel: {
    type: SettingsParamType.Text,
    getDefaultValue: () => '',
  },
  durationLabel: {
    type: SettingsParamType.Text,
    getDefaultValue: () => '',
  },
  bookingDetailsPricingPlanText: {
    type: SettingsParamType.Text,
    getDefaultValue: ({ t }) =>
      t('app.settings.defaults.booking-details.pricing-plan.title'),
  },
  bookingDetailsClearText: {
    type: SettingsParamType.Text,
    getDefaultValue: ({ t }) =>
      t('app.settings.defaults.booking-details.clear.title'),
  },
  nextButton: {
    type: SettingsParamType.Text,
    getDefaultValue: () => '',
  },
  rescheduleButton: {
    type: SettingsParamType.Text,
    getDefaultValue: () => '',
  },
  pendingApprovalButton: {
    type: SettingsParamType.Text,
    getDefaultValue: () => '',
  },
  joinWaitlistButton: {
    type: SettingsParamType.Text,
    getDefaultValue: () => '',
  },
  videoConferenceBadgeVisibility: {
    type: SettingsParamType.Boolean,
    getDefaultValue: () => true,
  },
  videoConferenceBadge: {
    type: SettingsParamType.Text,
    getDefaultValue: () => '',
  },
  slotsAvailability: {
    getDefaultValue: () => SlotsAvailability.ALL,
  },
  waitlistIndication: {
    type: SettingsParamType.String,
    getDefaultValue: () => '',
  },
  buttonsFullWidth: {
    type: SettingsParamType.Boolean,
    inheritDesktop: false,
    getDefaultValue: () => true,
  },
});
