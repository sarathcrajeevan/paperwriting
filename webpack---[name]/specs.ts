import {SPECS as SdkSpecs} from '@wix/wixstores-client-storefront-sdk/dist/es/src/constants';

export const SPECS = {
  ...SdkSpecs,
  CASHIER_EXPRESS_IN_PRODUCT_PAGE: 'specs.stores.CashierExpressInProductPage',
  SUBSCRIPTION_PLAN_USE_TPA_RADIO_BUTTON: 'specs.stores.SubscriptionPlanUseTpaRadioButton',
  USE_LIGHTBOXES: 'specs.stores.UseLightboxes',
  MIGRATE_VOLATILE_CART_API_TO_GRAPHQL_NODE: 'specs.stores.MigrateVolatileCartApiToGraphqlNode',
  BACK_IN_STOCK_MULTIPLE_LANGUAGES: 'specs.stores.BackInStockMultiLangs',
  USE_DROPDOWN_TPA_LABEL: 'specs.stores.UseDropdownTpaLabel',
  USE_CHECKOUT_ID_IN_FAST_FLOW: 'specs.stores.UseCheckoutIdInProductPageFastFlow',
  USE_CHECKOUT_ID_IN_SUBSCRIPTION: 'specs.stores.UseCheckoutIdInSubscription',
  BUY_NOW_WITHOUT_GC: 'specs.stores.BuyNowWithoutGC',
  SHOW_STOCK_INDICATOR: 'specs.stores.ShowStockIndicatorInProductPage',
  SHOW_OUT_OF_STOCK_INDICATOR_WHEN_BACK_IN_STOCK_ACTIVE: 'specs.stores.ShowOutOfStockIndicatorWhenBackInStockActive',
  CART_TOOLTIP_WITHOUT_NUMBER: 'specs.stores.CartTooltipWithoutNumber',
  FAST_FLOW_CUSTOM_FIELD: 'specs.stores.FastFlowCustomField',
  EXPRESS_CASHIER_BI_FIX: 'specs.stores.ExpressCashierBiFix',
} as const;
