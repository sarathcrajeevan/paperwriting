/* eslint-disable import/no-cycle */
import {ISortingOption, SortingDirection} from './types/galleryTypes';
import {APP_DEFINITION_ID} from '@wix/wixstores-client-core/dist/src/constants';

export const translationPath = (baseUrl, locale) => `${baseUrl}assets/locale/gallery/gallery_${locale}.json`;
export const DEFAULT_COLLECTION_ID = '00000000-000000-000000-000000000001';
export const TRACK_EVENT_COLLECTION = 'All Products';
export const BI_APP_NAME = 'galleryApp';
export const GALLERY_FEDOPS_APP_NAME = 'wixstores-gallery';
export const SLIDER_GALLERY_FEDOPS_APP_NAME = 'wixstores-slider-gallery';
export const FORCE_RELATED_GALLERY_RENDER_TIMEOUT = 500;
export const origin = 'gallery-page';
export const MAX_PRODUCTS = 10000;
export const MAX_PRODUCTS_BATCHING = 2000;

export enum GALLERY_PUBLIC_DATA_PRESET_ID {
  COLLECTION = 'Wix_Store_Slider_Product_Gallery_1',
  RELATED_PRODUCTS = 'Wix_Store_Related_Product_Gallery_1',
}

export const sortOptions: ISortingOption[] = [
  {
    field: '',
    id: 'default',
    titleKey: 'sortTitleText',
  },
  {
    field: 'creationDate',
    direction: SortingDirection.Descending,
    id: 'newest',
    titleKey: 'sortOptionNewestText',
    settingsShouldDisplayKey: 'gallerySortNewest',
  },
  {
    field: 'comparePrice',
    direction: SortingDirection.Ascending,
    id: 'price_ascending',
    titleKey: 'sortOptionLowPriceText',
    settingsShouldDisplayKey: 'gallerySortPriceAsc',
  },
  {
    field: 'comparePrice',
    direction: SortingDirection.Descending,
    id: 'price_descending',
    titleKey: 'sortOptionHighPriceText',
    settingsShouldDisplayKey: 'gallerySortPriceDes',
  },
  {
    field: 'name',
    direction: SortingDirection.Ascending,
    id: 'name_ascending',
    titleKey: 'sortOptionNameAZText',
    settingsShouldDisplayKey: 'gallerySortNameAsc',
  },
  {
    field: 'name',
    direction: SortingDirection.Descending,
    id: 'name_descending',
    titleKey: 'sortOptionNameZAText',
    settingsShouldDisplayKey: 'gallerySortNameDes',
  },
];

export interface IKeyboardEvent {
  keyCode: number;
  charCode: number;
}

export const keyboardEvents: {[key: string]: IKeyboardEvent} = {
  ENTER: {keyCode: 13, charCode: 13},
  SPACEBAR: {keyCode: 32, charCode: 32},
  ARROW_UP: {keyCode: 38, charCode: 38},
  ARROW_DOWN: {keyCode: 40, charCode: 40},
  ARROW_RIGHT: {keyCode: 39, charCode: 39},
  ARROW_LEFT: {keyCode: 37, charCode: 37},
};

export const MAX_COLS = 6;
export const MAX_ROWS = 12;
export const DEFAULT_COLS = 4;
export const DEFAULT_ROWS = 5;
export const DEFAULT_MOBILE_PRODUCTS_COUNT = 10;
export const DEFAULT_AUTO_GRID_PRODUCTS_COUNT = 24;
export const DEFAULT_MANUAL_GRID_PRODUCTS_COUNT = DEFAULT_COLS * DEFAULT_ROWS;
export const DEFAULT_PRODUCT_IMAGE_SIZE = 240;
export const BATCH_MAX_SIZE = 100;

export enum Experiments {
  ClientGalleryArrowlessMobileSlider = 'specs.stores.ClientGalleryArrowlessMobileSlider',
  GalleryProductOptionsVisibilitySettings = 'specs.stores.GalleryProductOptionsVisibilitySettings',
  GalleryPaginationForSeo = 'specs.stores.GalleryPaginationForSeo',
  FixGalleryFiltersUrlBug = 'specs.stores.FixGalleryFiltersUrlBug',
  SetGalleryCollectionVelo = 'specs.stores.SetGalleryCollectionVelo',
  IsSplitToBatchesEnabled = 'specs.stores.IsSplitToBatchesEnabled',
}

export enum FedopsInteraction {
  Filter = 'gallery-filter',
  MobileFilter = 'gallery-mobile-filter',
  Sort = 'gallery-sort',
  AddToCart = 'add-to-cart-from-gallery',
  LoadMore = 'load-more',
  Pagination = 'pagination',
  InfiniteScroll = 'infinite',
}

export enum BiEventParam {
  LoadMore = 'button',
  Pagination = 'pagination',
  InfiniteScroll = 'infinite',
}

export enum TrackEvents {
  AddToCart = 'AddToCart',
  ViewContent = 'ViewContent',
}

export const trackEventMetaData = {
  appDefId: APP_DEFINITION_ID,
  category: 'All Products',
  origin: 'Stores',
} as const;

export const ProductOptionsDiplayLimit = {
  totalLimit: 2,
  colorPickersLimit: 1,
} as const;
