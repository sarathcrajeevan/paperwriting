import {SPECS as SdkSpecs} from '@wix/wixstores-client-storefront-sdk/dist/es/src/constants';

export const translationPath = (baseUrl: string, locale: string) =>
  `${baseUrl}assets/locale/productWidget/productWidget_${locale}.json`;

export enum FormFactor {
  Desktop = 'Desktop',
  Mobile = 'Mobile',
  Tablet = 'Tablet',
}

export const origin = 'product-widget';

export const SPECS = {
  ...SdkSpecs,
};

export const MULTILINGUAL_TO_TRANSLATIONS_MAP = {
  NAVIGATE_TO_PRODUCT_PAGE_BUTTON: 'PRODUCT_WIDGET_BUTTON_TEXT',
  ADD_TO_CART_BUTTON: 'PRODUCT_WIDGET_BUTTON_TEXT',
  OUT_OF_STOCK: 'PRODUCT_WIDGET_BUTTON_OOS_TEXT',
};

export enum Experiments {}
