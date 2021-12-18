export const translationPath = (baseUrl, locale) => `${baseUrl}assets/locale/productPage/productPage_${locale}.json`;
export const widgetId = '13a94f09-2766-3c40-4a32-8edb5acdd8bc';
export const baseModalUrl = '//ecom.wix.com';
export const PRODUCT_PAGE_APP_NAME = 'wixstores-product-page';
export const QUICK_VIEW_APP_NAME = 'wixstores-product-page-quick-view';
export const PRODUCT_PAGE_WIXCODE_APP_NAME = 'wixstores-product-page-wixcode';

export const defaultFontSize = 16;

export const enum ArrowsDir {
  LEFT = 'left',
  RIGHT = 'right',
  UP = 'up',
  DOWN = 'down',
}

export enum TabsDirection {
  start = 'left',
  end = 'right',
}

export const enum GalleryNavigationType {
  THUMBNAILS = 'thumbnails',
  DOTS = 'dots',
}

export const enum GalleryNavigationLocation {
  INSIDE = 'inside',
  OUTSIDE = 'outside',
}

export const enum GalleryNavigationPosition {
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
}

export const enum ErrorTooltipPlacement {
  Top = 'top',
  Left = 'left',
  Bottom = 'bottom',
  Right = 'right',
}

export const enum LayoutId {
  EmptyState = 0,
  Classic = 1,
  QuickView = 2,
  Sleek = 4,
  Stunning = 5,
  Spotlight = 6,
  Simple = 7,
  Responsive = 8,
}

export const enum Layout {
  Classic = 'classic',
  EmptyState = 'empty-state',
  Mobile = 'mobile',
  QuickView = 'quickView',
  Responsive = 'responsive',
  Simple = 'simple',
  Sleek = 'sleek',
  Spotlight = 'spotlight',
  Stunning = 'stunning',
}

export enum InfoSectionLayoutId {
  Collapse = 1,
  Stacked = 3,
  Tabs = 2,
  Columns = 4,
}

export const enum MediaFrameMediaType {
  SECURE_PICTURE = 'secure_picture',
  SECURE_VIDEO = 'secure_video',
  SECURE_DOCUMENT = 'secure_document',
  SECURE_MUSIC = 'secure_music',
  SECURE_ARCHIVE = 'secure_archive',
}

export const enum ProductType {
  DIGITAL = 'digital',
  PHYSICAL = 'physical',
}

export const enum Alignment {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
}

export const enum ProductInventoryStatus {
  OUT_OF_STOCK = 'out_of_stock',
  IN_STOCK = 'in_stock',
}

export const enum ProductOptionType {
  COLOR = 'COLOR',
  DROP_DOWN = 'DROP_DOWN',
}

export const enum MediaType {
  PHOTO = 'PHOTO',
  VIDEO = 'VIDEO',
}

export interface IKeyboardEvent {
  keyCode: number;
  charCode: number;
}

export const keyboardEvents: {[key: string]: IKeyboardEvent} = {
  ENTER: {keyCode: 13, charCode: 13},
  SPACEBAR: {keyCode: 32, charCode: 13},
  ARROW_UP: {keyCode: 38, charCode: 38},
  ARROW_DOWN: {keyCode: 40, charCode: 40},
  ARROW_RIGHT: {keyCode: 39, charCode: 39},
  ARROW_LEFT: {keyCode: 37, charCode: 37},
};

export const enum SocialVendor {
  WhatsApp = 'whatsapp',
  Facebook = 'facebook',
  Twitter = 'twitter',
  Pinterest = 'pinterest',
  MobileNative = 'mobilenativeshare',
}

export const enum UserInputType {
  Selection = 'selection',
  Text = 'text',
  Quantity = 'quantity',
  SubscriptionPlan = 'subscriptionPlan',
}

export const enum productPageFedopsEvent {
  AddToCart = 'add-to-cart',
  BuyNow = 'buy-now',
  Subscribe = 'subscribe',
  AddToWishlist = 'add-to-wishlist',
  RemoveFromWishlist = 'remove-from-wishlist',
  WixCodeGetProduct = 'wixcode-get-product',
  WixCodeGetProductSSR = 'wixcode-get-product-ssr',
  WixCodeGetCustomTextFieldValues = 'wixcode-get-custom-text-field-values',
  WixCodeGetCustomTextFieldValuesSSR = 'wixcode-get-custom-text-field-values-ssr',
}

export const enum graphqlOperation {
  GetDefaultProduct = 'getDefaultProduct',
  GetCartService = 'getCartService',
  GetProductBySlug = 'getProductBySlug',
  GetNextPrevProducts = 'getNextPrevProducts',
  GetStoreMetaData = 'getStoreMetaData',
  CreateCart = 'createCart',
  GetCountryCodes = 'getCountryCodes',
  GetCheckoutSettings = 'getCheckoutSettings',
  GetBackInStockSettings = 'getBackInStockSettings',
}

export const GRAPHQL_SOURCE = 'WixStoresWebClient';

export const MULTILINGUAL_TO_TRANSLATIONS_MAP = {
  ADD_TO_CART_BUTTON: 'PRODUCT_PAGE_BUTTON_TEXT',
  BUY_NOW_BUTTON: 'PRODUCT_PAGE_BUY_NOW_BUTTON_TEXT',
  PRODUCT_OUT_OF_STOCK_BUTTON: 'PRODUCT_PAGE_BUTTON_OOS_TEXT',
  'productPage.backInStock.notifyWhenAvailable.button': 'PRODUCT_PAGE_BUTTON_BIS_TEXT',
  PRODUCT_PAGE_SUBSCRIBE_NOW_BUTTON: 'productPage_subscribeButtonText',
  'wishlist.button': 'productPage_addWishlistButtonText',
  'wishlist.remove.button': 'productPage_removeWishlistButtonText',
};

export const COMPONENTS_ADD_TO_CART_TEXT_KEYS = [
  'quickView_addToCartButton',
  'PRODUCT_WIDGET_BUTTON_TEXT',
  'ADD_TO_CART_BUTTON_TEXT',
];

export const COMPONENTS_OUT_OF_STOCK_TEXT_KEYS = ['gallery_oosButtonText', 'PRODUCT_PAGE_BUTTON_OOS_TEXT'];
export const COMPONENTS_BACK_IN_STOCK_TEXT_KEYS = ['PRODUCT_PAGE_BUTTON_BIS_TEXT'];

export const enum MarginBottom {
  LARGE = 'large',
  MEDIUM = 'medium',
  SMALL = 'small',
}

export const enum ImageModeType {
  CROP = 'crop',
  FIT = 'fit',
}

export const enum ModalTheme {
  DEFAULT = 'DEFAULT',
  BARE = 'BARE',
}

export const enum ModalState {
  OPEN,
  CLOSE,
}

export const enum ErrorNames {
  StoreInfoError,
}

export const LayoutNames = {
  [LayoutId.Classic]: 'classic',
  [LayoutId.EmptyState]: 'empty-state',
  [LayoutId.QuickView]: 'quickview',
  [LayoutId.Responsive]: 'responsive',
  [LayoutId.Simple]: 'simple',
  [LayoutId.Sleek]: 'sleek',
  [LayoutId.Spotlight]: 'spotlight',
  [LayoutId.Stunning]: 'stunning',
};

export const imageMobileWidth = 240;

export enum ModalType {
  SetShipping = 'SetShipping',
  SetPayment = 'SetPayment',
  UpgradeToPremium = 'UpgradeToPremium',
  NotInLiveSite = 'NotInLiveSite',
  NoOnlinePayments = 'NoOnlinePayments',
  Subscriptions = 'subscriptions',
  HighArpuSubscriptions = 'highArpuSubscriptions',
}

export enum Origin {
  PRODUCT_PAGEֹֹ_CHECKOUT = 'product page',
  PRODUCT_PAGE = 'product-page',
  QUICK_VIEW = 'quick-view',
}

export enum BiExposureTestName {
  PRODUCT_PAGE = 'product_page_loaded',
  QUICK_VIEW = 'quick_view_loaded',
}

export enum BiInventoryStatus {
  IN_STOCK = 'in_stock',
  OUT_OF_STOCK = 'out_of_stock',
  PARTIALLY = 'partially',
}

export const DEFAULT_ONE_TIME_PURCHASE_OPTION_LOCATION = 0;

export enum ImageRatio {
  AUTO = -1,
  THREE_BY_TWO = 0,
  FOUR_BY_THREE = 1,
  ONE_BY_ONE = 2,
  THREE_BY_FOUR = 3,
  TWO_BY_THREE = 4,
}

export const BI_APP_NAME = 'productPageApp';

export enum PaymentOptionsBreakdownTheme {
  LIGHT = 1,
  DARK = 2,
}

export enum PaymentOptionsBreakdownThemeValue {
  DARK = 'dark',
  LIGHT = 'light',
}

export const BACK_IN_STOCK_MODAL_APP_NAME = 'back-in-stock-request-modal';
export const BACK_IN_STOCK_MODAL_OPENED_INTERACTION = 'open-request-modal';
