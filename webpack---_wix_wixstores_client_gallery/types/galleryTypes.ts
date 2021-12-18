/* eslint-disable import/no-cycle */
import {IWixStyleParams} from '@wix/wixstores-client-core/dist/es/src/types/wix-sdk';
import {IControllerConfig, IStyle} from '@wix/native-components-infra/dist/src/types/types';
import {ISantaProps} from '@wix/wixstores-client-storefront-sdk/dist/es/src/types/native-types';
import {GalleryStore} from '../viewerScript/GalleryStore';
import {GetDataQuery, ProductFilters, ProductSort} from '../graphql/queries-schema';
import {IFilterValue} from '@wix/wixstores-graphql-schema';
import {CollectionFilterModel} from '../models/CollectionFilterModel';
import {CustomCollectionFilterModel} from '../models/CustomCollectionFilterModel';
import {ListFilterModel} from '../models/ListFilterModel';
import {ColorFilterModel} from '../models/ColorFilterModel';
import {PriceFilterModel} from '../models/PriceFilterModel';
import {AddToCartActionOption, ActionStatus} from '@wix/wixstores-client-core/dist/es/src/constants';
import {AddToCartState} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/AddToCartService/constants';
import {ProductsVariantInfoMap} from '../services/ProductsOptionsService';
import type {ISentryErrorBoundaryPropsInjectedByViewerScript} from '@wix/native-components-infra/dist/es/src/HOC/sentryErrorBoundary/sentryErrorBoundary';
import {HeadingTags} from '@wix/wixstores-client-core/dist/es/src/types/heading-tags';
import {ProductsPriceRangeServiceMap} from '../services/ProductsPriceRangeService';

export interface IGalleryStyleParams extends IWixStyleParams {
  booleans: Partial<{
    responsive: boolean;
    full_width: boolean;
    galleryFiltersCategories: boolean;
    galleryFiltersPrice: boolean;
    galleryFiltersProductOptions: boolean;
    galleryShowFilters: boolean;
    galleryShowSort: boolean;
    gallerySortNameAsc: boolean;
    gallerySortNameDes: boolean;
    gallerySortNewest: boolean;
    gallerySortPriceAsc: boolean;
    gallerySortPriceDes: boolean;
    gallery_addToCartButtonShowOnHover: boolean;
    gallery_showAddToCartButton: boolean;
    gallery_showAddToCartQuantity: boolean;
    gallery_showDividers: boolean;
    gallery_showPrice: boolean;
    gallery_showProductName: boolean;
    gallery_showTitle: boolean;
    gallery_paginationFirstLastArrows: boolean;
    gallery_showProductOptionsButton: boolean;
    showAlternativeImage: boolean;
    showQuickView: boolean;
  }>;
  numbers: Partial<{
    galleryColumns: number;
    galleryRows: number;
    galleryMargin: number;
    gallery_imageMode: ImageModeId;
    gallery_productMargin: number;
    gallery_addToCartAction: AddToCartActionOption;
    galleryImageRatio: ImageRatioId;
    gallery_productsCount: number;
    gallery_productSize: number;
    gallery_gapSize: number;
    ['mobile:galleryColumns']: number;
    ['mobile:galleryMargin']: number;
    gallery_gridType: GridType;
    gallery_loadMoreProductsType: LoadMoreType;
    gallery_paginationFormat: PaginationType;
    gallery_productOptionsShowOptions: ProductOptionsShowOptionsOption;
  }>;
  fonts?: Partial<{
    gallery_hoverType: {fontStyleParam: boolean; value: HoverType};
    gallery_paginationAlignment: {fontStyleParam: boolean; value: ContentJustification};
  }>;
}

export interface IGalleryControllerConfig extends IControllerConfig {
  style: {
    styleParams: IGalleryStyleParams;
  };
}

export interface IGalleryStyle extends IStyle {
  styleParams: IGalleryStyleParams;
}

export interface IGallerySantaProps extends ISantaProps {
  style: IGalleryStyle;
}

export interface IPriceRangeValue {
  min: string;
  max: string;
}

export interface IRangeValue {
  min: number;
  max: number;
}

export interface ITextsMap extends IMandatoryTextMap {
  allCollectionsFilterButtonText: string;
  clearFiltersButtonText: string;
  filtersSubmitButtonText?: string;
  filtersTitleText: string;
  galleryRegionSR: string;
  loadMoreButtonText: string;
  mobileFiltersButtonText?: string;
  noProductsFilteredMessageText: string;
  noProductsMessageText: string;
  sortOptionHighPriceText: string;
  sortOptionLowPriceText: string;
  sortOptionNameAZText: string;
  sortOptionNameZAText: string;
  sortOptionNewestText: string;
  sortTitleText: string;
  announceFiltersUpdate: string;
  pricePerUnitSR: string;
  measurementUnits: {[key: string]: {[key: string]: string}};
}

export interface IMandatoryTextMap {
  galleryAddToCartButtonText: string;
  addToCartContactSeller: string;
  addToCartOutOfStock: string;
  addToCartSuccessSR: string;
  digitalProductBadgeAriaLabelText: string;
  productOutOfStockText: string;
  productPriceAfterDiscountSR: string;
  productPriceBeforeDiscountSR: string;
  productPriceWhenThereIsNoDiscountSR: string;
  quickViewButtonText: string;
  quantityAddSR: string;
  quantityChooseAmountSR: string;
  quantityInputSR: string;
  quantityRemoveSR: string;
  quantityMaximumAmountSR: string;
  quantityTotalSR: string;
  quantityMinimumAmountSR: string;
  priceRangeText: string;
}

export interface IPropsInjectedByViewerScript extends ISentryErrorBoundaryPropsInjectedByViewerScript {
  allowFreeProducts: boolean;
  clearFilters: Function;
  currentPage: number;
  linkForAllPages: string[];
  nextPrevLinks: string[];
  setTotalPages: (total: number) => void;
  cssBaseUrl: string;
  filterModels: FilterModel[];
  filterProducts(filterId: number, value: IFilterSelectionValue): void;
  filterProductsOnMobile: Function;
  focusedProductIndex?: number;
  getCategoryProducts?(params: {limit: number; offset?: number; total?: number}): void;
  handleProductItemClick: GalleryStore['handleProductItemClick'];
  sendSortClickBiEvent: Function;
  sendClickShippingInfoLinkSf(productId: string): void;
  handleAddToCart(params: {productId: string; index: number; quantity: number}): void;
  handleProductsOptionsChange: GalleryStore['handleOptionSelectionsChange'];
  handlePagination(page: number): void;
  updateAddToCartStatus(productId: string, status: ActionStatus): void;
  hasMoreProductsToLoad: boolean;
  hasSelectedFilters: boolean;
  htmlTags: {
    productNameHtmlTag: HeadingTags;
  };
  isFirstPage: boolean;
  isInteractive: boolean;
  isLiveSiteMode: boolean;
  isPreviewMode: boolean;
  isLoaded: boolean;
  isMobile: boolean;
  isRTL: boolean;
  isAutoGrid: boolean;
  loadMoreProducts: Function;
  loadMoreType: LoadMoreType;
  loading: boolean;
  mainCollectionId: string;
  onAppLoaded: Function;
  openQuickView: GalleryStore['openQuickView'];
  paginationMode: PaginationTypeName;
  priceBreakdown: GalleryStore['priceBreakdown'];
  productsManifest: ProductsManifest;
  products: IProduct[];
  productsVariantInfoMap: ProductsVariantInfoMap;
  productsPriceRangeMap: ProductsPriceRangeServiceMap;
  shouldShowClearFilters: boolean;
  shouldShowMobileFiltersModal: boolean;
  shouldShowSort: boolean;
  showShowLightEmptyState: boolean;
  shouldShowProductOptions: boolean;
  sortProducts: Function;
  textsMap: ITextsMap;
  toggleFiltersModalVisibility: Function;
  totalProducts: number;
  experiments: {
    isGalleryProductOptionsVisibilitySettings: boolean;
    isPaginationForSeoEnabled: boolean;
  };
  numberOfSelectedFilterTypes: number;
  sortingOptions: ISortingOption[];
  selectedSort: ISortingOption;
  shouldShowAddToCartSuccessAnimation: boolean;
  addedToCartStatus: {[productId: string]: ActionStatus};
  productsRequestInProgress: boolean;
  isOptionsRevealEnabled: boolean;
}

export interface ProductsManifest {
  [productId: string]: {
    url: string;
    addToCartState: AddToCartState;
  };
}

export interface ISortingOption {
  field: SortingOptionField;
  direction?: SortingDirection;
  id: SortingOptionId;
  titleKey: SortingOptionTitleKey;
  settingsShouldDisplayKey?: SortingOptionBooleanKey;
}

export type SortingOptionField = 'creationDate' | 'comparePrice' | 'name' | '';
export enum SortingDirection {
  Ascending = 'ASC',
  Descending = 'DESC',
}

export type SortingOptionId =
  | 'default'
  | 'newest'
  | 'price_ascending'
  | 'price_descending'
  | 'name_ascending'
  | 'name_descending';

export type SortingOptionTitleKey =
  | 'sortOptionNameZAText'
  | 'sortOptionNameAZText'
  | 'sortOptionHighPriceText'
  | 'sortOptionLowPriceText'
  | 'sortOptionNewestText'
  | 'sortTitleText';

export type SortingOptionBooleanKey =
  | 'gallerySortNameDes'
  | 'gallerySortNameAsc'
  | 'gallerySortPriceDes'
  | 'gallerySortPriceAsc'
  | 'gallerySortNewest'
  | 'sortTitleText';

export type IProduct = GetDataQuery['catalog']['category']['productsWithMetaData']['list'][0];
export type IProductOption = IProduct['options'][0];
export type IProductOptionSelection = IProductOption['selections'][0];
export type ReducedOptionSelection = {
  selectionKey: IProductOptionSelection['key'];
  selectionId: IProductOptionSelection['id'];
  optionId: IProductOption['id'];
  optionKey: IProductOption['key'];
};

export enum ProductType {
  DIGITAL = 'digital',
  PHYSICAL = 'physical',
}

export enum MediaFrameMediaType {
  SECURE_PICTURE = 'secure_picture',
  SECURE_VIDEO = 'secure_video',
  SECURE_DOCUMENT = 'secure_document',
  SECURE_MUSIC = 'secure_music',
  SECURE_ARCHIVE = 'secure_archive',
}

export interface IProductItemData {
  id: string;
  name: string;
  urlPart: string;
  price: number;
  comparePrice: number;
  formattedPrice: string;
  formattedComparePrice: string;
  ribbon: string;
  isOptionMandatory: boolean;
  media: IMediaData[];
  inventoryStatus: any;
  isInStock?: boolean;
  productType: ProductType;
  digitalProductFilesTypes: MediaFrameMediaType[];
}

export interface IMediaData extends IImageDimension {
  url: string;
  mediaType: string;
  index: number;
  title: string;
  altText: string;
}

export interface IImageDimension {
  width: number;
  height: number;
}

export type IFilterSelectionValue = string | IPriceRangeValue;

export interface IFilterModel {
  activeOptions: any;
  filterId: number;
  filterType: FilterType;
  title: string;
  toDTO?: Function;
  options: IFilterOption[];

  updateActiveOptions(value: IFilterSelectionValue): void;
  hasActiveOptions?(): boolean;
  resetActiveOptions(): void;
}

export type IFilterOption = IFilterValue;

export interface IFilterConfig {
  filterTitle: string;
  filterType: FilterConfigType;
  show: boolean;
  custom?: boolean;
  selected?: {[id: string]: string}[];
  id?: string;
}

export enum FilterType {
  COLLECTION = 'COLLECTION',
  CUSTOM_COLLECTION = 'CUSTOM_COLLECTION',
  PRICE = 'PRICE ',
  COLOR_OPTION = 'COLOR_OPTION',
  LIST_OPTION = 'LIST_OPTION',
}

export enum FilterTypeFromFetch {
  CATEGORY = 'CATEGORY',
  FILTERED_CATEGORIES = 'FILTERED_CATEGORIES',
  PRICE = 'PRICE',
  COLOR = 'OPTION_COLOR',
  LIST = 'OPTION_LIST',
}

export enum FilterTypeForFetch {
  CATEGORY = 'CATEGORY',
  FILTERED_CATEGORIES = 'FILTERED_CATEGORIES',
  OPTIONS = 'OPTIONS',
  PRICE = 'PRICE',
}

export enum FilterConfigType {
  CATEGORY = 'CATEGORY',
  PRICE = 'PRICE',
  OPTIONS = 'OPTIONS',
  OPTION_LIST = 'OPTION_LIST',
}

export type FilterModel =
  | CollectionFilterModel
  | CustomCollectionFilterModel
  | ListFilterModel
  | ColorFilterModel
  | PriceFilterModel;

export interface IFilterDTO {
  field: string;
  op: FilterEqOperation;
  values: any[];
}

export interface ICollectionIdsFilterDTO {
  mainCategory: string;
  subCategory?: string;
  customCategories?: string[][];
}

export interface IDeprecatedFilterConfigDTO {
  filterTitle: string;
  filterType: FilterConfigType;
  show: boolean;
  custom?: boolean;
  selected?: {[id: string]: string}[];
}

export interface IFilterConfigDTO {
  filterType: FilterConfigType;
  id: string;
  show: boolean;
  custom?: boolean;
  selected?: {[id: string]: string}[];
}

export enum FilterEqOperation {
  EQUALS = 'EQUALS',
  GTE = 'GTE', // Greater than or equal to
  LTE = 'LTE', // Less than or equal to
  BETWEEN = 'BETWEEN',
  IN = 'IN',
  IN_ALL = 'IN_ALL',
}

export interface IFilteredCategoryProductsViewResponse {
  data: {
    products: IProductItemData[];
    totalCount: number;
  };
  errors?: any[];
}

export type nonCollectionFilterModel = ListFilterModel | ColorFilterModel | PriceFilterModel;

export interface IColorOption {
  rgbValue: string;
  name: string;
}

export enum ImageModeId {
  Crop = 1,
  Fit = 2,
}

export enum HoverType {
  None = 'none',
  Zoom = 'zoom',
  Border = 'border',
  Alternate = 'alternate',
}

export enum ImageRatioId {
  _3x2 = 0,
  _4x3 = 1,
  _1x1 = 2,
  _3x4 = 3,
  _2x3 = 4,
  _16x9 = 5,
  _9x16 = 6,
}

export interface ISorting extends ISortingParam {
  id: string;
  titleKey: string;
}

export interface IAmountLimit {
  from: number;
  to: number;
}

export interface ISortingParam {
  field: string;
  direction?: SortingDirection;
}

export interface IFilteredProductsRequestParams {
  filters: IFilterDTO[];
  limit: IAmountLimit;
  sort?: ISortingParam;
  offset?: number;
  categories?: ICollectionIdsFilterDTO;
  withOptions?: boolean;
  withPriceRange: boolean;
}

export interface IFilteredProductsRequest {
  viewName: string;
  params: IFilteredProductsRequestParams;
}

export enum GALLERY_TYPE {
  COLLECTION = 1,
  RELATED_PRODUCTS = 2,
}

export interface IOldGetInitialData {
  externalId: string;
  compId: string;
  limit?: number;
  withPriceRange: boolean;
}

export interface IGetInitialData {
  externalId: string;
  compId: string;
  limit?: number;
  sort?: ProductSort;
  filters?: ProductFilters;
  offset?: number;
  withOptions?: boolean;
  withPriceRange: boolean;
  mainCollectionId?: string;
}

export interface IGetCategoryProducts {
  compId: string;
  limit: number;
  offset: number | null;
}

export interface IQueryParamsFilter {
  key: string;
  value: string;
  filterId: number;
}

export enum PaginationType {
  PAGES = 1,
  COMPACT = 2,
}

export type PaginationTypeName = 'compact' | 'pages';

export enum LoadMoreType {
  BUTTON = 1,
  PAGINATION = 2,
  INFINITE = 3,
}

export enum ContentJustification {
  START = 'start',
  CENTER = 'center',
  END = 'end',
}

export enum GridType {
  MANUAL = 1,
  AUTO = 2,
}

export interface IAddProductImpression {
  id: string;
  name: string;
  list: string;
  category: string;
  position: number;
  price: number;
  currency: string;
  dimension3: 'in stock' | 'out of stock';
}

export enum ProductOptionsShowOptionsOption {
  REVEAL = 1,
  EXPOSED = 2,
}
