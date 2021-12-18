import {createSettingsParams, SettingsParamType} from 'yoshi-flow-editor-runtime/tpa-settings';

export type TextSettingsParams = keyof typeof settingsParams;
export type ISettingsParams = Record<TextSettingsParams, typeof settingsParams[TextSettingsParams]['type']>;

const settingsParams = {
  CART_TITLE: {
    type: SettingsParamType.String,
    getDefaultValue: ({t}: {t: Function}) => t('cart.shopping_cart_title'),
    inheritFromAppScope: true,
  },
  CART_EMPTY_CART: {
    type: SettingsParamType.String,
    getDefaultValue: ({t}: {t: Function}) => t('cart.empty_cart_title'),
    inheritFromAppScope: true,
  },
  CART_CONTINUE_SHOPPING_LINK: {
    type: SettingsParamType.String,
    getDefaultValue: ({t}: {t: Function}) => t('cart.continue_shopping'),
    inheritFromAppScope: true,
  },
  CART_CONTINUE_SHOPPING_LINK_OBJECT: {
    type: SettingsParamType.Object,
  },
  CART_ADD_NOTE_LINK: {
    type: SettingsParamType.String,
    getDefaultValue: ({t}: {t: Function}) => t('cart.buyer_note_add_button_label'),
    inheritFromAppScope: true,
  },
  CART_INSTRUCTIONS_TEXT: {
    type: SettingsParamType.String,
    getDefaultValue: ({t}: {t: Function}) => t('cart.buyer_note_placeholder'),
    inheritFromAppScope: true,
  },
  CART_ADD_PROMO_CODE_LINK: {
    type: SettingsParamType.String,
    getDefaultValue: ({t}: {t: Function}) => t('cart.coupon_add_button_label'),
    inheritFromAppScope: true,
  },
  CART_BUTTON_TEXT: {
    type: SettingsParamType.String,
    getDefaultValue: ({t}: {t: Function}) => t('cart.secure_checkout'),
    inheritFromAppScope: true,
  },
  CART_V2_DISCLAIMER: {
    type: SettingsParamType.String,
    getDefaultValue: (): null => null,
    inheritFromAppScope: true,
  },
};

export const getFreeTextKeys = (): TextSettingsParams[] =>
  Object.entries(settingsParams)
    .reduce((acc, [k, v]) => [...acc, v.type === SettingsParamType.String ? k : undefined], [])
    .filter(Boolean);

export default createSettingsParams<Omit<ISettingsParams, 'CART_CONTINUE_SHOPPING_LINK_OBJECT'>>(settingsParams);
