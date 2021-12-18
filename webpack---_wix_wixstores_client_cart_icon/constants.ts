export const POPUP_URL = 'https://ecom.wix.com/storefront/cartwidgetPopup';
export const EMPTY_CART_GUID = '00000000-000000-000000-000000000000';
export const CART_ICON_APP_NAME = 'wixstores-cart-icon';

export const cartIconTranslationPath = (baseUrl: string, locale = 'en') =>
  `${baseUrl}assets/locale/cartIcon/cartIcon_${locale}.json`;

export const specs = {
  stores: {
    USE_LIGHTBOXES: 'specs.stores.UseLightboxes',
    QUERY_NODE: 'specs.stores.MinicartQueryNode',
  },
};

// eslint-disable-next-line no-shadow
export enum FedopsInteraction {
  ADD_TO_CART = 'velo-add-to-cart',
  ADD_ITEMS_TO_CART = 'velo-add-items-to-cart',
}

export const origin = 'cart-icon';
