import {FedopsInteractions as _1} from '@wix/wixstores-client-storefront-sdk/dist/es/src/enums/fedopsInteractions';

export const FedopsInteractions = _1;

export const CART_COMMANDS_URL =
  '/_api/wix-ecommerce-renderer-web/store-front/cart/{commandName}?returnCartSummary=false';

export const CHECKOUT_URL = '/_api/wix-ecommerce-renderer-web/store-front/checkout/cart/{cartId}';

export const START_FAST_FLOW_URL = '/_api/wix-ecommerce-renderer-web/store-front/checkout/cart/{cartId}/startFastFlow';

export const EMPTY_CART_ID = '00000000-000000-000000-000000000000';

export enum StyleParam {
  ShowContinueShopping = 'cart_showContinueShopping',
  CornerRadius = 'cartButton_cornersRadius',
  dynamicPaymentMethodsTheme = 'cartButton_dynamicPaymentMethodsTheme',
  dynamicPaymentMethodsShape = 'cartButton_dynamicPaymentMethodsShape',
  SelectedSkin = 'cartButton_selectedSkin',
  ShowCoupon = 'cart_showCoupon',
  ShowBuyerNote = 'cart_showBuyerNote',
  ShowTax = 'cart_showTax',
  ShowShipping = 'cart_showShipping',
  Responsive = 'responsive',
}

export const BI_APP_NAME = 'Stores';

export const ORIGIN = 'shopping cart';

export enum ContinueShoppingBiOrigin {
  shoppingCart = 'shopping cart',
  minimumOrder = 'minimum_order_cart',
}

export enum OriginTypes {
  Paypal = 'paypal',
  AddToCart = 'addToCart',
}

export const PAYPAL_METHOD_NAME = 'PayPal';

export enum PaymentMethodType {
  creditCard = 'CREDIT_CARD',
  eWallet = 'HOSTED',
  offline = 'OFFLINE',
}

export enum ShippingMethodType {
  NONE = 'none',
  PICKUP = 'store pickup',
  SHIPPING = 'shipping',
}
