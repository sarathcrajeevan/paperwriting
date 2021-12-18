import {createSettingsParams, SettingsParamType} from 'yoshi-flow-editor-runtime/tpa-settings';

export type ISettingsParams = {
  THANK_YOU_PAGE_TITLE: SettingsParamType.String;
  THANK_YOU_PAGE_SUBTITLE: SettingsParamType.String;
  THANK_YOU_PAGE_SUBSCRIPTION_TITLE: SettingsParamType.String;
  THANK_YOU_PAGE_SUBSCRIPTION_SUBTITLE: SettingsParamType.String;
  THANK_YOU_PAGE_SUBSCRIPTION_PLAN: SettingsParamType.String;
  THANK_YOU_PAGE_ORDER_NUMBER_LABEL: SettingsParamType.String;
  THANK_YOU_PAGE_TOTAL_COST_LABEL: SettingsParamType.String;
  THANK_YOU_PAGE_SHIPPING_ADDRESS_LABEL: SettingsParamType.String;
  THANK_YOU_PAGE_CONTINUE_SHOPPING_LINK_CAPTION: SettingsParamType.String;
  THANK_YOU_PAGE_CONTINUE_SHOPPING_LINK_OBJECT: SettingsParamType.Object;
};

export default createSettingsParams<ISettingsParams>({
  THANK_YOU_PAGE_TITLE: {
    type: SettingsParamType.String,
    getDefaultValue: () => null,
    inheritFromAppScope: true,
  },
  THANK_YOU_PAGE_SUBTITLE: {
    type: SettingsParamType.String,
    getDefaultValue: ({t}) => t('thankYou.SUBTITLE'),
    inheritFromAppScope: true,
  },
  THANK_YOU_PAGE_SUBSCRIPTION_TITLE: {
    type: SettingsParamType.String,
    getDefaultValue: () => null,
    inheritFromAppScope: true,
  },
  THANK_YOU_PAGE_SUBSCRIPTION_SUBTITLE: {
    type: SettingsParamType.String,
    getDefaultValue: ({t}) => t('thankYou.SUBTITLE'),
    inheritFromAppScope: true,
  },
  THANK_YOU_PAGE_SUBSCRIPTION_PLAN: {
    type: SettingsParamType.String,
    getDefaultValue: ({t}) => t('THANK_YOU_PAGE_SUBSCRIPTION_PLAN_LABEL'),
    inheritFromAppScope: true,
  },
  THANK_YOU_PAGE_ORDER_NUMBER_LABEL: {
    type: SettingsParamType.String,
    getDefaultValue: ({t}) => t('thankYou.ORDER_NUMBER_LABEL'),
    inheritFromAppScope: true,
  },
  THANK_YOU_PAGE_TOTAL_COST_LABEL: {
    type: SettingsParamType.String,
    getDefaultValue: ({t}) => t('thankYou.TOTAL_LABEL'),
    inheritFromAppScope: true,
  },
  THANK_YOU_PAGE_SHIPPING_ADDRESS_LABEL: {
    type: SettingsParamType.String,
    getDefaultValue: ({t}) => t('thankYou.SHIPPING_LABEL'),
    inheritFromAppScope: true,
  },
  THANK_YOU_PAGE_CONTINUE_SHOPPING_LINK_CAPTION: {
    type: SettingsParamType.String,
    getDefaultValue: ({t}) => t('thankYou.FOOTER_LINK'),
    inheritFromAppScope: true,
  },
  THANK_YOU_PAGE_CONTINUE_SHOPPING_LINK_OBJECT: {
    type: SettingsParamType.Object,
    getDefaultValue: () => null,
    inheritFromAppScope: true,
  },
});
