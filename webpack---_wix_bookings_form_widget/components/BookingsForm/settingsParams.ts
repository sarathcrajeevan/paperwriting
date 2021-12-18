import {
  BorderStyle,
  AlignmentOptions,
  PaymentMethod,
} from '../../types/types';
import {
  createSettingsParams,
  SettingsParamType,
} from '@wix/yoshi-flow-editor/tpa-settings';
import { SelectedPaymentOption } from '@wix/ambassador-gateway/types';

export type ISettingsParams = {
  titlesAlignment: AlignmentOptions;
  fieldsBorderStyle: BorderStyle;
  stretchButtonToFullWidth: SettingsParamType.Boolean;
  formTitle: SettingsParamType.Text;
  selectPaymentTitle: SettingsParamType.Text;
  selectPaymentMethodTitle: SettingsParamType.Text;
  pricingPlanText: SettingsParamType.Text;
  singleSessionText: SettingsParamType.Text;
  selectPaymentTypeLabel: SettingsParamType.Text;
  payOnlineText: SettingsParamType.Text;
  payOfflineText: SettingsParamType.Text;
  offlinePaymentButtonText: SettingsParamType.Text;
  onlinePaymentButtonText: SettingsParamType.Text;
  requestBookingButtonText: SettingsParamType.Text;
  chooseAPlanText: SettingsParamType.Text;
  summarySectionTitle: SettingsParamType.Text;
  videoConferenceTitle: SettingsParamType.Text;
  summaryPaymentSectionTitle: SettingsParamType.Text;
  videoConferenceBadgeVisibility: SettingsParamType.Boolean;
  defaultPaymentMethod: PaymentMethod;
  defaultPaymentTime: SelectedPaymentOption;
};

export default createSettingsParams<ISettingsParams>({
  titlesAlignment: {
    getDefaultValue: ({ isRTL }): AlignmentOptions =>
      isRTL ? AlignmentOptions.RIGHT : AlignmentOptions.LEFT,
  },
  fieldsBorderStyle: {
    getDefaultValue: () => BorderStyle.BOX,
  },
  stretchButtonToFullWidth: {
    type: SettingsParamType.Boolean,
    getDefaultValue: () => true,
  },
  formTitle: {
    type: SettingsParamType.Text,
    getDefaultValue: ({ t }) => t('app.form.fill-out-your-details.title'),
  },
  selectPaymentTitle: {
    type: SettingsParamType.Text,
    getDefaultValue: ({ t }) => t('app.booking-details.payment-options.title'),
  },
  selectPaymentMethodTitle: {
    type: SettingsParamType.Text,
    getDefaultValue: ({ t }) =>
      t('app.booking-details.payment-options.how-do-you-want-to-pay.label'),
  },
  pricingPlanText: {
    type: SettingsParamType.Text,
    getDefaultValue: ({ t }) =>
      t('app.booking-details.payment-options.buy-a-pricing-plan.label'),
  },
  singleSessionText: {
    type: SettingsParamType.Text,
    getDefaultValue: ({ t }) =>
      t('app.booking-details.payment-options.pay-for-single-session.label'),
  },
  selectPaymentTypeLabel: {
    type: SettingsParamType.Text,
    getDefaultValue: ({ t }) =>
      t('app.booking-details.payment-options.when-do-you-want-to-pay.label'),
  },
  payOnlineText: {
    type: SettingsParamType.Text,
    getDefaultValue: ({ t }) =>
      t('app.booking-details.payment-options.pay-online.label'),
  },
  payOfflineText: {
    type: SettingsParamType.Text,
    getDefaultValue: ({ t }) =>
      t('app.booking-details.payment-options.pay-offline.label'),
  },
  offlinePaymentButtonText: {
    type: SettingsParamType.Text,
    getDefaultValue: ({ t }) => t('app.booking-details.summary.cta.book.label'),
  },
  onlinePaymentButtonText: {
    type: SettingsParamType.Text,
    getDefaultValue: ({ t }) =>
      t('app.booking-details.summary.cta.pay-now.label'),
  },
  requestBookingButtonText: {
    type: SettingsParamType.Text,
    getDefaultValue: ({ t }) =>
      t('app.booking-details.summary.cta.request-to-book.label'),
  },
  chooseAPlanText: {
    type: SettingsParamType.Text,
    getDefaultValue: ({ t }) =>
      t('app.booking-details.pricing-plans.choose-a-plan-label'),
  },
  summarySectionTitle: {
    type: SettingsParamType.Text,
    getDefaultValue: ({ t }) => t('app.booking-details.booking-summary.text'),
  },
  summaryPaymentSectionTitle: {
    type: SettingsParamType.Text,
    getDefaultValue: ({ t, experiments }) => {
      return experiments.enabled('specs.bookings.FormChangePaymentSummary')
        ? t('app.booking-details.payment-summary.title')
        : t('app.booking-details.payment-section.title');
    },
  },
  videoConferenceTitle: {
    type: SettingsParamType.Text,
    getDefaultValue: ({ t }) => t('app.booking-details.video-conference.text'),
  },
  videoConferenceBadgeVisibility: {
    type: SettingsParamType.Boolean,
    getDefaultValue: () => true,
  },
  defaultPaymentMethod: {
    getDefaultValue: () => PaymentMethod.MEMBERSHIP,
  },
  defaultPaymentTime: {
    getDefaultValue: () => SelectedPaymentOption.ONLINE,
  },
});
