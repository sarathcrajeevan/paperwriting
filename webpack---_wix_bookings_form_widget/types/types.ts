import { BusinessInfoBase, ServicePaymentDto } from '@wix/bookings-uou-types';
import { DialogProps } from '../components/BookingsForm/Widget/Dialog/Dialog';

export enum TabsTranslationsKeys {
  Manage = 'app.settings.tabs.manage',
  Layout = 'app.settings.tabs.layout',
  Display = 'app.settings.tabs.display',
  Design = 'app.settings.tabs.design',
  Text = 'app.settings.tabs.text',
}

export enum TabsDataHooks {
  Manage = 'manage-tab-button',
  Layout = 'layout-tab-button',
  Display = 'display-tab-button',
  Design = 'design-tab-button',
  Text = 'text-tab-button',
  Support = 'support-tab-button',
  Premium = 'premium-tab-button',
}

export enum SettingsTab {
  Manage = 'manage',
  Layout = 'layout',
  Display = 'display',
  Design = 'design',
  Text = 'text',
  Support = 'support',
}

export type SettingsSubTab = DesignTabSubSettings;

export enum DesignTabSubSettings {
  STYLES = 'styles',
  TEXT = 'text',
  BUTTON = 'button',
  INPUT_FIELD_STYLE = 'INPUT_FIELD_STYLE',
}

export enum AlignmentOptions {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
}

export enum BorderStyle {
  UNDERLINE = 'line',
  BOX = 'box',
}

export enum PaymentMethod {
  MEMBERSHIP = 'membership',
  SINGLE = 'single',
}

export enum PaymentVariationType {
  PP = 'PP',
  BuyPP = 'BUY_PP',
  Custom = 'CUSTOM',
  Fixed = 'FIXED',
}

export enum ReservedPaymentOptionIds {
  SingleSession = 'SINGLE_SESSION_ID',
  BuyAPricingPlan = 'BUY_A_PRICING_PLAN_ID',
}

export interface BusinessInfo extends BusinessInfoBase {
  isSMSReminderEnabled: boolean;
}

export type TFunction = (
  key: string | string[],
  options?: Record<string, any>,
  defaultValue?: string,
) => string;

export enum FormEvents {
  SETTINGS_TAB_CHANGED = 'settings_tab_changed',
  SETTINGS_SUB_TAB_SELECTED = 'settings_sub_tab_selected',
}

export type PaymentOption = {
  id: string;
  disabled: boolean;
  label: string;
  validUntil?: string;
  suffix?: string;
  creditRemain?: number;
};

export enum DialogType {
  OwnerSubmit = 'owner-form-submit',
}

export type Dialog = {
  type: DialogType;
  props: DialogProps;
};

export type ServicePaymentDetails = ServicePaymentDto & {
  totalPrice: number;
  payNow?: number;
};

export enum PaymentType {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  PRICING_PLAN = 'PRICING_PLAN',
}

export enum FieldLayout {
  SHORT = 'shorten',
  LONG = 'stretch',
}
