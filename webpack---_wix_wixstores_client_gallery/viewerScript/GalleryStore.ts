/* eslint-disable prefer-const */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  FilterModel,
  GridType,
  IFilterSelectionValue,
  IGalleryControllerConfig,
  IGalleryStyleParams,
  IProduct,
  IPropsInjectedByViewerScript,
  ISorting,
  ISortingOption,
  ITextsMap,
  LoadMoreType,
  PaginationType,
  PaginationTypeName,
  ProductOptionsShowOptionsOption,
  ProductsManifest,
} from '../types/galleryTypes';
import {
  BI_APP_NAME,
  BiEventParam,
  DEFAULT_COLLECTION_ID,
  Experiments,
  FedopsInteraction,
  origin,
  sortOptions,
  translationPath,
} from '../constants';
import {
  ActionStatus,
  AddToCartActionOption,
  APP_DEFINITION_ID,
  PageMap,
  StoresWidgetID,
} from '@wix/wixstores-client-core/dist/es/src/constants';
import {FilterConfigsService} from '../services/FilterConfigsService';
import {FiltersService} from './FiltersService';
import {IControllerConfig, IWidgetControllerConfig} from '@wix/native-components-infra/dist/es/src/types/types';
import {getReleaseFromBaseUrl} from '@wix/native-components-infra/dist/es/src/sentryUtils/getReleaseFromBaseUrl';
import {MultilingualService} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/MultilingualService/MultilingualService';
import {ProductsService} from '../services/ProductsService';
import {DefaultQueryParamKeys, GalleryQueryParamsService} from '../services/GalleryQueryParamsService';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {SortService} from '../services/SortService';
import {getStyleParamsWithDefaultsFunc} from '../getStyleParamsWithDefaultsFunc';
import {getStyleParamsWithDefaults} from '@wix/wixstores-client-common-components/dist/src/outOfIframes/defaultStyleParams/getStyleParamsWithDefaults';
import {getTranslations, isWorker} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/utils';
import {getInitialProductsCountToFetch} from './utils';
import {AddToCartService} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/AddToCartService/AddToCartService';
import {actualPrice} from '@wix/wixstores-client-core/dist/es/src/productOptions/productUtils';
import type {ISentryErrorBoundaryPropsInjectedByViewerScript} from '@wix/native-components-infra/dist/es/src/HOC/sentryErrorBoundary/sentryErrorBoundary';
import {ProductsVariantInfoMap} from '../services/ProductsOptionsService';
import {ProductOptionType} from '@wix/wixstores-graphql-schema/dist/src/graphql-schema';
import {
  BI_PRODUCT_OPTION_ACTION,
  BI_PRODUCT_OPTION_TYPE,
} from '@wix/wixstores-client-storefront-sdk/dist/es/src/constants';
import {CustomUrlApi} from '@wix/wixstores-client-storefront-sdk/dist/es/src/utils/CustomUrl/CustomUrlApi';
import {QueryParamsService} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/QueryParamsService/QueryParamsService';
import {BaseGalleryStore} from './BaseGalleryStore';
import _ from 'lodash';
import {ProductPriceRange} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/ProductPriceRange/ProductPriceRange';
import {unitsTranslations} from './../common/components/ProductItem/ProductPrice/unitsTranslations';
import {ProductPriceBreakdown} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/ProductPriceBreakdown/ProductPriceBreakdown';

export class GalleryStore extends BaseGalleryStore {
  private addedToCartStatus: {[p: string]: ActionStatus} = {};
  private currentPage: number = 1;
  private filterConfigsService: FilterConfigsService;
  private filtersService: FiltersService;
  private isFedopsReport: boolean = true;
  private multilingualService: MultilingualService;
  private productPageSectionUrl: string;
  private readonly productsPerPage: number;
  private queryParamsService: GalleryQueryParamsService;
  private readonly fedopsLogger;
  private readonly publicData: IControllerConfig['publicData'];
  private readonly sortService: SortService;
  private translations;
  private readonly productsService: ProductsService;
  private readonly addToCartService: AddToCartService;
  private readonly customUrlApi: CustomUrlApi;
  private isUrlWithOverrides: boolean = false;
  private readonly externalQueryParamsService: QueryParamsService;
  private totalPages: number = 0;

  constructor(
    public styleParams: IGalleryStyleParams,
    config: IWidgetControllerConfig['config'],
    private readonly updateComponent: (props: Partial<IPropsInjectedByViewerScript>) => void,
    siteStore: SiteStore,
    private readonly compId: string,
    private readonly type: string,
    private mainCollectionId: string,
    private readonly reportError: (e) => any
  ) {
    super({config}, siteStore);

    this.externalQueryParamsService = new QueryParamsService(this.siteStore);

    this.publicData = _.cloneDeep(this.config.publicData);
    const fedopsLoggerFactory = this.siteStore.platformServices.fedOpsLoggerFactory;
    this.fedopsLogger = fedopsLoggerFactory.getLoggerForWidget({
      appId: APP_DEFINITION_ID,
      widgetId: this.type,
    });

    if (isWorker()) {
      this.fedopsLogger.appLoadStarted();
    }

    this.sortService = new SortService();
    this.styleParams = styleParams;
    this.addToCartService = new AddToCartService(this.siteStore, this.publicData);
    const isAutoGrid = this.styleParams.numbers.gallery_gridType === GridType.AUTO;

    const initialProductsCount = getInitialProductsCountToFetch(
      this.siteStore.isMobile(),
      this.siteStore.isEditorMode(),
      isAutoGrid,
      this.styleParams.numbers.galleryRows,
      this.styleParams.numbers.galleryColumns,
      this.styleParams.numbers.gallery_productsCount
    );

    this.productsService = new ProductsService(
      this.siteStore,
      initialProductsCount,
      'Grid Gallery',
      this.shouldShowProductOptions,
      this.shouldRenderPriceRange,
      this.fedopsLogger,
      this.type === StoresWidgetID.GALLERY_PAGE
    );
    this.productsPerPage = this.productsService.getProductPerPage();
    this.customUrlApi = new CustomUrlApi(this.siteStore.location.buildCustomizedUrl);
    this.handleUrlChange();
  }

  private get shouldRenderPriceRange(): boolean {
    return new ProductPriceRange(this.siteStore).shouldShowPriceRange();
  }

  private get sentryErrorBoundaryProps(): ISentryErrorBoundaryPropsInjectedByViewerScript {
    return {
      ravenUserContextOverrides: {id: this.siteStore.storeId, uuid: this.siteStore.uuid as string},
      sentryRelease: getReleaseFromBaseUrl(this.siteStore.baseUrls.galleryBaseUrl, {
        artifactName: true,
      }),
    };
  }

  private get shouldShowProductOptions(): boolean {
    return this.styleParams.booleans.gallery_showProductOptionsButton;
  }

  private get productsVariantInfoMap(): ProductsVariantInfoMap {
    return this.shouldShowProductOptions ? this.productsService.getVariantInfoMap() : {};
  }

  private handleUrlChange() {
    if (this.siteStore.experiments.enabled(Experiments.FixGalleryFiltersUrlBug)) {
      this.siteStore.location.onChange(async () => {
        await this.setInitialState();
      });
    } else {
      let currency = this.siteStore.location.query.currency;
      this.siteStore.location.onChange(async () => {
        if (currency !== this.siteStore.location.query.currency) {
          currency = this.siteStore.location.query.currency;
          await this.setInitialState();
        }
      });
    }
  }

  public setMainCollection(collectionId) {
    this.mainCollectionId = collectionId;
  }

  private getTranslation() {
    return this.translations
      ? Promise.resolve(this.translations)
      : getTranslations(translationPath(this.siteStore.baseUrls.galleryBaseUrl, this.siteStore.locale));
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  public async setInitialState(): Promise<any> {
    let data, translations, url, sorting: ISortingOption, products, limit;

    if (this.isAutoGrid()) {
      limit = this.styleParams.numbers.gallery_productsCount;
    }

    this.queryParamsService = new GalleryQueryParamsService(this.siteStore);
    if (this.siteStore.location.query.sort) {
      sorting = this.getSortFromQueryParam();
    }

    if (this.siteStore.location.query.page) {
      limit = this.getProductsLimitByPageFromQueryParam(this.productsService.getProductPerPage());
      this.currentPage = +this.queryParamsService.getQueryParam('page');
    } else if (this.siteStore.experiments.enabled(Experiments.FixGalleryFiltersUrlBug)) {
      this.currentPage = +this.queryParamsService.getQueryParam('page') || 1;
    }

    [translations, data, {url}] = await Promise.all([
      this.getTranslation(),
      this.productsService.getInitialData(
        {
          externalId: this.config.externalId,
          compId: this.compId,
          sort: this.sortService.getSortDTO(sorting),
          filters: null,
          limit,
          offset: 0,
          mainCollectionId: this.mainCollectionId,
        },
        this.siteStore.experiments.enabled(Experiments.IsSplitToBatchesEnabled)
      ),
      this.siteStore.getSectionUrl(PageMap.PRODUCT),
    ]).catch(this.reportError);

    this.isUrlWithOverrides = await this.customUrlApi.init();

    sorting && this.sortService.setSelectedSort(sorting.id);

    products = data.catalog.category.productsWithMetaData.list;
    this.translations = translations;

    this.productPriceBreakdown = new ProductPriceBreakdown(this.siteStore, this.translations, {
      excludedPattern: 'gallery.price.tax.excludedParam.label',
      includedKey: 'gallery.price.tax.included.label',
      includedPattern: 'gallery.price.tax.includedParam.label',
      excludedKey: 'gallery.price.tax.excluded.label',
    });

    this.productPageSectionUrl = url;
    this.mainCollectionId = this.productsService.getMainCollectionId();

    this.multilingualService = new MultilingualService(
      this.siteStore,
      this.publicData.COMPONENT,
      data.appSettings.widgetSettings
    );

    this.filterConfigsService = new FilterConfigsService(
      data.appSettings.widgetSettings.FILTERS,
      this.publicData.COMPONENT.FILTERS?.data,
      this.styleParams.booleans,
      this.multilingualService,
      translations
    );

    this.filtersService = new FiltersService(this.siteStore, this.mainCollectionId, this.filterConfigsService);
    let filterModels: FilterModel[] | [] = [];
    if (this.shouldShowFilters()) {
      filterModels = await this.fetchFilters();

      filterModels = this.getFiltersFromQueryParams(filterModels);
      this.productsService.updateFiltersAndSort(this.filtersService.getFilterDTO(), sorting);

      products = await this.getFilterProducts({limit});
    }

    if (this.loadMoreType() === LoadMoreType.PAGINATION && this.queryParamsService.getQueryParam('page')) {
      products = await this.loadProductsByPage(this.currentPage);
    }

    let isFirstPage = true;

    if (this.currentPage > 1) {
      isFirstPage = false;
    }

    this.updateComponent({
      ...this.getPropsToInject(products, filterModels),
      isFirstPage,
    });

    if (!this.siteStore.isSSR()) {
      this.productsService.storeNavigation(this.siteStore.siteApis.currentPage.id);
    }

    if (this.siteStore.isSSR()) {
      this.fedopsLogger.appLoaded();
    }
  }

  public onAppLoaded(): void {
    /* istanbul ignore next: hard to test it */
    if (this.isFedopsReport) {
      this.fedopsLogger.appLoaded();
      this.isFedopsReport = false;

      const page_load_type = {
        [LoadMoreType.BUTTON]: BiEventParam.LoadMore,
        [LoadMoreType.PAGINATION]: BiEventParam.Pagination,
        [LoadMoreType.INFINITE]: BiEventParam.InfiniteScroll,
      }[this.styleParams.numbers.gallery_loadMoreProductsType];

      this.siteStore.biLogger.viewGallerySf({
        isMobileFriendly: this.siteStore.isMobileFriendly,
        addToCart: this.styleParams.booleans.gallery_showAddToCartButton,
        filterType:
          (this.styleParams.booleans.galleryShowFilters &&
            this.filtersService
              .getFilterModels()
              .map((m) => m.filterType)
              .join(',')) ||
          '',
        hasOptions: this.styleParams.booleans.gallery_showProductOptionsButton,
        hasPrice: this.styleParams.booleans.gallery_showPrice,
        hasQuantity: this.styleParams.booleans.gallery_showAddToCartQuantity,
        hasQuickView: this.styleParams.booleans.showQuickView,
        hasSorting: this.styleParams.booleans.galleryShowSort,
        hoverType: this.styleParams.fonts.gallery_hoverType.value,
        loadType: page_load_type,
        navigationClick: this.getNavigationClick(),
        productsLogic: this.mainCollectionId !== DEFAULT_COLLECTION_ID ? 'collection' : 'All products',
        priceBreakdown: this.productPriceBreakdown.priceBreakdownBIParam,
        type: this.type,
      });
    }
  }

  private getNavigationClick(): string {
    if (!this.styleParams.booleans.gallery_showAddToCartButton) {
      return '';
    } else if (this.getAddToCartAction() === AddToCartActionOption.MINI_CART) {
      return 'mini-cart';
    } else if (this.getAddToCartAction() === AddToCartActionOption.CART) {
      return 'cart';
    }
    return 'none';
  }

  private readonly shouldShowClearFilters = () => {
    return this.siteStore.isMobile() || this.filtersService.shouldShowClearFilters();
  };

  protected getPropsToInject(products: IProduct[], filterModels: FilterModel[] | []): IPropsInjectedByViewerScript {
    return {
      ...this.getComputedProps(products),
      ...this.sentryErrorBoundaryProps,
      ...super.getCommonPropsToInject(),
      allowFreeProducts: this.addToCartService.allowFreeProducts,
      addedToCartStatus: this.addedToCartStatus,
      clearFilters: this.clearFilters.bind(this),
      cssBaseUrl: this.siteStore.baseUrls.galleryBaseUrl,
      linkForAllPages: this.getlinksForAllPages(),
      nextPrevLinks: this.nextPrevLinks(),
      setTotalPages: this.setTotalPages.bind(this),
      filterModels,
      filterProducts: this.filterProducts.bind(this),
      filterProductsOnMobile: this.filterProductsOnMobile.bind(this),
      handleAddToCart: this.handleAddToCart.bind(this),
      sendSortClickBiEvent: this.sendSortClickBiEvent.bind(this),
      handlePagination: this.handlePagination.bind(this),
      handleProductItemClick: this.handleProductItemClick.bind(this),
      hasMoreProductsToLoad: this.productsService.hasMoreProductsToLoad(),
      hasSelectedFilters: this.hasSelectedFilters(),
      isAutoGrid: this.isAutoGrid(),
      isFirstPage: true,
      isInteractive: this.siteStore.isInteractive(),
      isLiveSiteMode: this.siteStore.isSiteMode(),
      isLoaded: true,
      isMobile: this.siteStore.isMobile(),
      isPreviewMode: this.siteStore.isPreviewMode(),
      isRTL: this.siteStore.isRTL(),
      isOptionsRevealEnabled: this.getIsOptionsRevealEnabled(),
      loadMoreProducts: this.loadMoreProducts.bind(this),
      loadMoreType: this.loadMoreType(),
      loading: false,
      mainCollectionId: this.mainCollectionId,
      numberOfSelectedFilterTypes: 0,
      onAppLoaded: this.onAppLoaded.bind(this),
      openQuickView: this.openQuickView.bind(this),
      paginationMode: this.getPaginationMode(),
      selectedSort: this.sortService.getSelectedSort(),
      shouldShowAddToCartSuccessAnimation: this.getAddToCartAction() === AddToCartActionOption.NONE,
      shouldShowClearFilters: this.shouldShowClearFilters(),
      shouldShowMobileFiltersModal: false,
      shouldShowSort: this.shouldShowSort(),
      shouldShowProductOptions: this.shouldShowProductOptions,
      showShowLightEmptyState: this.productsService.hideGallery,
      sortProducts: this.sortProducts.bind(this),
      sortingOptions: this.getSortingOptions(),
      textsMap: this.getTextsMap(),
      toggleFiltersModalVisibility: this.toggleFiltersModalVisibility.bind(this),
      totalProducts: this.productsService.totalCount,
      updateAddToCartStatus: this.updateAddToCartStatus.bind(this),
      experiments: {
        isGalleryProductOptionsVisibilitySettings: this.siteStore.experiments.enabled(
          Experiments.GalleryProductOptionsVisibilitySettings
        ),
        isPaginationForSeoEnabled: this.siteStore.experiments.enabled(Experiments.GalleryPaginationForSeo),
      },
      handleProductsOptionsChange: this.handleOptionSelectionsChange.bind(this),
      productsRequestInProgress: false,
    };
  }

  private getTextsMap(): ITextsMap {
    return {
      addToCartContactSeller: this.translations['gallery.contactSeller.button'],
      addToCartOutOfStock:
        this.multilingualService.get('gallery_oosButtonText') || this.translations['gallery.outOfStock.button'],
      addToCartSuccessSR: this.translations['gallery.sr.addToCartSuccess'],
      allCollectionsFilterButtonText: this.translations['filter.CATEGORY_ALL'],
      clearFiltersButtonText: this.translations['filter.CLEAN_ALL'],
      digitalProductBadgeAriaLabelText: this.translations['sr.digitalProduct'],
      galleryAddToCartButtonText:
        this.multilingualService.get('gallery_addToCartText') || this.translations['gallery.addToCart.button'],
      galleryRegionSR: this.translations['sr.region.GALLERY'],
      filtersSubmitButtonText: this.translations['gallery.mobile.filters.buttonApply'],
      filtersTitleText: this.multilingualService.get('FILTERS_MAIN_TITLE') || this.translations['filter.MAIN_TITLE'],
      loadMoreButtonText: this.multilingualService.get('LOAD_MORE_BUTTON') || this.translations.LOAD_MORE_BUTTON,
      mobileFiltersButtonText: this.translations['gallery.mobile.filters.title.button'],
      noProductsFilteredMessageText: this.translations.NO_PRODUCTS_FILTERED_MESSAGE_MAIN,
      noProductsMessageText: this.translations.NO_PRODUCTS_MESSAGE_MAIN,
      sortOptionNewestText: this.translations['sort.NEWEST'],
      sortOptionLowPriceText: this.translations['sort.PRICE_LOW'],
      sortOptionHighPriceText: this.translations['sort.PRICE_HIGH'],
      sortOptionNameAZText: this.translations['sort.NAME_AZ'],
      sortOptionNameZAText: this.translations['sort.NAME_ZA'],
      sortTitleText: this.multilingualService.get('SORTING_MAIN_TITLE') || this.translations.SORT_BY,
      productOutOfStockText:
        this.multilingualService.get('gallery_oosButtonText') || this.translations.OUT_OF_STOCK_LABEL,
      productPriceBeforeDiscountSR: this.translations['sr.PRODUCT_PRICE_BEFORE_DISCOUNT'],
      productPriceAfterDiscountSR: this.translations['sr.PRODUCT_PRICE_AFTER_DISCOUNT'],
      productPriceWhenThereIsNoDiscountSR: this.translations['sr.PRODUCT_PRICE_WHEN_THERE_IS_NO_DISCOUNT'],
      quickViewButtonText: this.translations.QUICK_VIEW,
      quantityAddSR: this.translations['gallery.sr.addQty'],
      quantityChooseAmountSR: this.translations['gallery.sr.chooseQty'],
      quantityRemoveSR: this.translations['gallery.sr.removeQty'],
      quantityInputSR: this.translations['gallery.sr.quantity'],
      announceFiltersUpdate: this.translations['sr.ANNOUNCE_FOUND_ITEMS_ON_FILTERS_UPDATE'],
      quantityMaximumAmountSR: this.translations['gallery.exceedsQuantity.error'],
      quantityTotalSR: this.translations['gallery.sr.totalQty'],
      quantityMinimumAmountSR: this.translations['gallery.minimumQuantity.error'],
      priceRangeText: this.translations['gallery.price.from.label'],
      pricePerUnitSR: this.translations['gallery.sr.units.basePrice.label'],
      measurementUnits: this.getMeasurementUnitsTranslation(),
    };
  }

  private getlinksForAllPages(): string[] {
    const numberOfPages = this.totalPages < 1000 ? this.totalPages : 1000;
    return _.times(numberOfPages, (i) => this.externalQueryParamsService.getUrlWithCustomPageParam(i + 1));
  }

  private nextPrevLinks(): string[] {
    const res = [];
    const prevIndex = this.currentPage - 1;
    const nextIndex = this.currentPage + 1;

    if (prevIndex > 0) {
      res.push(this.externalQueryParamsService.getUrlWithCustomPageParam(prevIndex));
    }

    if (nextIndex <= this.totalPages) {
      res.push(this.externalQueryParamsService.getUrlWithCustomPageParam(nextIndex));
    }

    return res;
  }

  private setTotalPages(totalPages: number) {
    this.totalPages = totalPages;
    this.updateComponent({linkForAllPages: this.getlinksForAllPages(), nextPrevLinks: this.nextPrevLinks()});
  }

  private getMeasurementUnitsTranslation() {
    return _.reduce(
      unitsTranslations,
      (result, types, unit) => {
        result[unit] = result[unit] || {};
        _.each(types, (translationKey, type) => {
          result[unit][type] = this.translations[translationKey];
        });
        return result;
      },
      {}
    );
  }

  private generateProductsManifest(products: IProduct[]): ProductsManifest {
    return products.reduce((acc: ProductsManifest, product) => {
      acc[product.id] = {
        url: this.getProductPageUrl(product.urlPart),
        addToCartState: this.addToCartService.getButtonState({price: actualPrice(product), inStock: product.isInStock}),
      };
      return acc;
    }, {});
  }

  private getProductPageUrl(slug) {
    return this.isUrlWithOverrides
      ? this.customUrlApi.buildProductPageUrl({slug})
      : `${this.productPageSectionUrl}/${slug}`;
  }

  private async filterProducts(filterId: number, selectionValue: IFilterSelectionValue) {
    this.fedopsLogger.interactionStarted(FedopsInteraction.Filter);

    this.filtersService.updateActiveFilterOption(filterId, selectionValue);

    if (this.siteStore.isMobile() && this.siteStore.experiments.enabled(Experiments.FixGalleryFiltersUrlBug)) {
      this.queryParamsService.updateFiltersQueryParamsState(
        filterId,
        this.filtersService.getFilterModels(),
        this.mainCollectionId
      );
    } else {
      this.queryParamsService.updateFiltersQueryParams(
        filterId,
        this.filtersService.getFilterModels(),
        this.mainCollectionId
      );
    }

    if (this.siteStore.isMobile()) {
      this.updateComponent({
        filterModels: this.filtersService.getFilterModels(),
        hasSelectedFilters: this.hasSelectedFilters(),
      });
      this.fedopsLogger.interactionEnded(FedopsInteraction.Filter);
      return;
    }

    this.siteStore.biLogger.clickToChangeGalleryFiltersSf({
      filterType: this.filtersService.getFilterModel(filterId).filterType,
    });
    await this.updateComponentWithFilteredProducts();
    this.fedopsLogger.interactionEnded(FedopsInteraction.Filter);
  }

  private async filterProductsOnMobile() {
    this.fedopsLogger.interactionStarted(FedopsInteraction.MobileFilter);
    this.siteStore.biLogger.galleryClickApplyFilter({
      filterTypes: this.filtersService.getSelectedFilterTypes().toString(),
    });

    this.filtersService.updateSnapshotWithActiveOptions();

    if (this.siteStore.experiments.enabled(Experiments.FixGalleryFiltersUrlBug)) {
      this.queryParamsService.applyQueryParamsStateOnUrl();
    }

    this.updateComponent({
      loading: true,
      numberOfSelectedFilterTypes: this.filtersService.getSelectedFilterTypes().length,
    });

    await this.updateComponentWithFilteredProducts();
    this.updateComponent({loading: false, shouldShowMobileFiltersModal: false});
    this.fedopsLogger.interactionEnded(FedopsInteraction.MobileFilter);
  }

  private async clearFilters() {
    this.filtersService.resetFilters();
    this.queryParamsService.clearAllFiltersQueryParams(
      this.filtersService.getFilterModels().map((filterModel) => filterModel.title)
    );

    this.siteStore.biLogger.galleryClickClearAllFilters({});

    if (this.siteStore.isMobile()) {
      this.updateComponent({
        filterModels: this.filtersService.getFilterModels(),
        hasSelectedFilters: this.hasSelectedFilters(),
      });
    } else {
      await this.updateComponentWithFilteredProducts();
    }
  }

  private toggleFiltersModalVisibility(show: boolean) {
    if (show) {
      this.filtersService.updateSnapshotWithActiveOptions();
      this.siteStore.biLogger.galleryClickFilter({});
    } else {
      this.filtersService.updateActiveOptionsWithSnapshot();
    }

    this.updateComponent({
      shouldShowMobileFiltersModal: show,
      filterModels: this.filtersService.getFilterModels(),
      hasSelectedFilters: this.hasSelectedFilters(),
    });
  }

  private async getFilterProducts({limit}: {limit?: number}) {
    const filterDTO = this.filtersService.getFilterDTO();
    const shouldSpecificCollectionQuery = this.filtersService.shouldSpecificCollectionQuery(this.mainCollectionId);
    return this.productsService.filterProducts({
      filters: filterDTO,
      collectionIds: this.filtersService.getCollectionIdsFilterDTO(),
      shouldSpecificCollectionQuery,
      limit,
      isSplitToBatchesEnabled: this.siteStore.experiments.enabled(Experiments.IsSplitToBatchesEnabled),
    });
  }

  private async updateComponentWithFilteredProducts() {
    const nextProducts = await this.getFilterProducts({});

    this.currentPage = 1;
    this.queryParamsService.updatePageQueryParam();

    this.updateComponent({
      ...this.getComputedProps(nextProducts),
      filterModels: this.filtersService.getFilterModels(),
      hasMoreProductsToLoad: this.productsService.hasMoreProductsToLoad(),
      hasSelectedFilters: this.hasSelectedFilters(),
      shouldShowClearFilters: this.shouldShowClearFilters(),
      shouldShowSort: this.shouldShowSort(),
      totalProducts: this.productsService.totalCount,
    });
  }

  private hasSelectedFilters(): boolean {
    return this.filtersService.shouldShowClearFilters();
  }

  private readonly loadMoreType = (): LoadMoreType => {
    return this.styleParams.numbers.gallery_loadMoreProductsType;
  };

  private async loadMoreProducts(visibleProducts: number, maxProductsPerPage: number) {
    this.updateComponent({
      productsRequestInProgress: true,
    });

    const fedopsInteraction =
      this.loadMoreType() === LoadMoreType.BUTTON ? FedopsInteraction.LoadMore : FedopsInteraction.InfiniteScroll;
    this.fedopsLogger.interactionStarted(fedopsInteraction);
    this.siteStore.biLogger.clickLoadMoreInGallerySf({
      ...this.getBICollection(),
      type: this.loadMoreType() === LoadMoreType.BUTTON ? BiEventParam.LoadMore : BiEventParam.InfiniteScroll,
    });
    this.productsService.setProductsPerPage(maxProductsPerPage);
    this.currentPage++;
    this.queryParamsService.updatePageQueryParam(this.currentPage);

    const shouldSpecificCollectionQuery = this.filtersService.shouldSpecificCollectionQuery(this.mainCollectionId);
    const nextProducts = await this.productsService.loadMoreProducts(visibleProducts, shouldSpecificCollectionQuery);
    if (nextProducts === null) {
      this.updateComponent({
        hasMoreProductsToLoad: false,
        productsRequestInProgress: false,
      });
      return;
    }
    this.updateComponent({
      ...this.getComputedProps(nextProducts),
      focusedProductIndex: visibleProducts,
      linkForAllPages: this.getlinksForAllPages(),
      nextPrevLinks: this.nextPrevLinks(),
      hasMoreProductsToLoad: this.productsService.hasMoreProductsToLoad(),
      productsRequestInProgress: false,
    });

    this.fedopsLogger.interactionEnded(fedopsInteraction);
  }

  private readonly hasOptions = (product: IProduct) => !!product.options.length;

  private readonly getAddToCartAction = () => this.styleParams.numbers.gallery_addToCartAction;

  private readonly updateAddToCartStatus = (productId: string, status: ActionStatus) => {
    this.addedToCartStatus = {
      ...this.addedToCartStatus,
      [productId]: status,
    };

    this.updateComponent({addedToCartStatus: this.addedToCartStatus});
  };

  private handleAddToCart({productId, index, quantity}: {productId: string; index: number; quantity: number}) {
    this.productsService
      .addToCart({
        productId,
        index,
        compId: this.compId,
        externalId: this.config.externalId,
        quantity,
        addToCartAction: this.getAddToCartAction(),
      })
      .then(() => this.updateAddToCartStatus(productId, ActionStatus.SUCCESSFUL));
  }

  private handleOptionSelectionsChange(params: {
    productId: string;
    selectionIds: number[];
    optionType: ProductOptionType;
  }) {
    if (this.getIsOptionsRevealEnabled()) {
      this.productsService.clearSelections();
    }

    this.productsService.handleProductsOptionsChange(params);

    this.updateComponent({
      productsVariantInfoMap: this.productsVariantInfoMap,
      productsPriceRangeMap: this.productsService.productPriceRangeMap,
    });

    this.sendClickOnProductOptionBiEvent(params);
  }

  private readonly getSortFromQueryParam = (): ISortingOption => {
    return this.sortService.getSort(this.queryParamsService.getQueryParam('sort'));
  };

  private readonly getProductsLimitByPageFromQueryParam = (productPerPage: number): number => {
    return parseInt(this.queryParamsService.getQueryParam(DefaultQueryParamKeys.Page), 10) * productPerPage;
  };

  private readonly getFiltersFromQueryParams = (filterModels: FilterModel[]) => {
    const queryParamsFilters = this.queryParamsService.getFiltersQueryParams(filterModels);
    if (queryParamsFilters) {
      this.filtersService.updateActiveFilterOptionsByQueryParams(queryParamsFilters);
    }
    return this.filtersService.getFilterModels();
  };

  private async sortProducts(sorting: ISorting) {
    this.fedopsLogger.interactionStarted(FedopsInteraction.Sort);
    this.queryParamsService.updateSortQueryParams(sorting);

    const selectedSort = this.sortService.setSelectedSort(sorting.id);
    this.siteStore.biLogger.sortGallerySf({sortDir: sorting.direction, method: sorting.id.split('_')[0]});
    const shouldSpecificCollectionQuery = this.filtersService.shouldSpecificCollectionQuery(this.mainCollectionId);
    const newProducts = await this.productsService.sortProducts(
      sorting.field ? sorting : null,
      shouldSpecificCollectionQuery,
      this.siteStore.experiments.enabled(Experiments.IsSplitToBatchesEnabled)
    );

    this.currentPage = 1;

    this.updateComponent({
      ...this.getComputedProps(newProducts),
      hasMoreProductsToLoad: this.productsService.hasMoreProductsToLoad(),
      isFirstPage: false,
      selectedSort,
    });

    this.fedopsLogger.interactionEnded(FedopsInteraction.Sort);
  }

  private shouldShowSort() {
    const {
      galleryShowSort,
      gallerySortNewest,
      gallerySortPriceAsc,
      gallerySortPriceDes,
      gallerySortNameAsc,
      gallerySortNameDes,
    } = this.styleParams.booleans;
    return (
      galleryShowSort &&
      (gallerySortNewest || gallerySortPriceAsc || gallerySortPriceDes || gallerySortNameAsc || gallerySortNameDes) &&
      this.productsService.products.length > 0
    );
  }

  private openQuickView({
    productId,
    index,
    selectionIds,
    quantity,
  }: {
    productId: string;
    index: number;
    selectionIds?: number[];
    quantity?: number;
  }) {
    this.productsService.quickViewProduct(
      productId,
      index,
      this.compId,
      this.config.externalId,
      selectionIds,
      quantity
    );
  }

  private handleProductItemClick({
    biData: {productId, index},
  }: {
    biData: {
      productId: string;
      index: number;
    };
  }) {
    const product = this.productsService.getProduct(productId);

    this.productsService.storeNavigation(this.siteStore.siteApis.currentPage.id);

    this.siteStore.biLogger.clickOnProductBoxSf({
      productId,
      hasRibbon: !!product.ribbon,
      hasOptions: this.hasOptions(product),
      index,
      productType: product.productType,
    });
    this.productsService.sendClickTrackEvent(product, index);

    this.siteStore.navigate(
      {
        sectionId: PageMap.PRODUCT,
        state: product.urlPart,
        queryParams: undefined,
      },
      true
    );
  }

  private fetchFilters(): Promise<FilterModel[]> {
    return this.filtersService.fetchFilters();
  }

  private shouldShowFilters(): boolean {
    return this.styleParams.booleans.galleryShowFilters && this.filterConfigsService.shouldShowFilters();
  }

  private getSortingOptions(): ISortingOption[] {
    return sortOptions.filter((o) => this.styleParams.booleans[o.settingsShouldDisplayKey] !== false);
  }

  private sendSortClickBiEvent() {
    this.siteStore.biLogger.galleryClickSortBy({});
  }

  private sendClickOnProductOptionBiEvent(params: {productId: string; optionType: ProductOptionType}) {
    const {productId, optionType} = params;

    const optiontype = (
      {
        [ProductOptionType.DROP_DOWN]: BI_PRODUCT_OPTION_TYPE.LIST,
        [ProductOptionType.COLOR]: BI_PRODUCT_OPTION_TYPE.COLOR,
      } as const
    )[optionType];

    const {productType} = this.productsService.getProduct(productId);

    this.siteStore.biLogger.clickOnProductOptionSf({
      action: BI_PRODUCT_OPTION_ACTION.CHECKED,
      appName: BI_APP_NAME,
      optiontype,
      productId,
      productType,
      origin,
      viewMode: this.siteStore.biStorefrontViewMode,
    });
  }

  private updatePublicData(newPublicData: IGalleryControllerConfig['publicData']) {
    Object.keys(newPublicData.COMPONENT).forEach((key) => {
      this.publicData.COMPONENT[key] = newPublicData.COMPONENT[key];
    });
    this.config.publicData = newPublicData;
  }

  public async updateState(
    newStyleParams: IGalleryStyleParams,
    newPublicData: IGalleryControllerConfig['publicData'] & {appSettings?: any}
  ): Promise<void> {
    const nextStyleParams = getStyleParamsWithDefaults(newStyleParams, () =>
      getStyleParamsWithDefaultsFunc({
        style: {styleParams: newStyleParams},
        dimensions: undefined,
      })
    );

    const shouldUpdateWithOptions =
      this.styleParams.booleans.gallery_showProductOptionsButton !==
      nextStyleParams.booleans.gallery_showProductOptionsButton;
    const shouldFetchProducts =
      shouldUpdateWithOptions ||
      this.styleParams.numbers.gallery_productsCount !== nextStyleParams.numbers.gallery_productsCount;

    this.updatePublicData(newPublicData);
    this.styleParams = {...nextStyleParams};

    if (newPublicData.appSettings) {
      this.multilingualService.setWidgetSettings(newPublicData.appSettings);
      if (newPublicData.appSettings.FILTERS) {
        this.filterConfigsService.setFilterConfigDTOs(newPublicData.appSettings.FILTERS);
        this.filtersService.deleteFilterModels();
      }
    }

    if (!this.shouldShowFilters()) {
      this.filtersService.deleteFilterModels();
      this.updateComponent({filterModels: []});
    } else if (this.filtersService.getFilterModels().length === 0) {
      const filterModels = await this.filtersService.fetchFilters();
      this.updateComponent({filterModels});
    }

    const nextProps: Partial<IPropsInjectedByViewerScript> = {
      isAutoGrid: this.isAutoGrid(),
      loadMoreType: this.loadMoreType(),
      shouldShowAddToCartSuccessAnimation: this.getAddToCartAction() === AddToCartActionOption.NONE,
      shouldShowSort: this.shouldShowSort(),
      sortingOptions: this.getSortingOptions(),
      textsMap: this.getTextsMap(),
      shouldShowProductOptions: this.shouldShowProductOptions,
      isOptionsRevealEnabled: this.getIsOptionsRevealEnabled(),
    };

    if (shouldUpdateWithOptions) {
      this.updateWithOptions();
    }

    if (shouldFetchProducts) {
      const shouldSpecificCollectionQuery = this.filtersService.shouldSpecificCollectionQuery(this.mainCollectionId);
      nextProps.products = await this.productsService.loadProducts(
        0,
        this.productsService.getProductPerPage(),
        shouldSpecificCollectionQuery
      );
    }

    nextProps.productsVariantInfoMap = this.productsVariantInfoMap;
    nextProps.productsPriceRangeMap = this.productsService.productPriceRangeMap;
    this.updateComponent({...nextProps, ...this.getCommonPropsToUpdate()});
  }

  private updateWithOptions() {
    this.productsService.setWithOptions(this.shouldShowProductOptions);
  }

  private getBICollection() {
    const collectionId = this.productsService.getMainCollectionId();
    return collectionId === DEFAULT_COLLECTION_ID ? {} : {categoryId: collectionId};
  }

  private async loadProductsByPage(page: number) {
    const from = this.productsPerPage * (page - 1);
    const to = from + this.productsPerPage;
    const shouldSpecificCollectionQuery = this.filtersService.shouldSpecificCollectionQuery(this.mainCollectionId);
    return this.productsService.loadProducts(from, to, shouldSpecificCollectionQuery);
  }

  private async handlePagination(page: number) {
    this.fedopsLogger.interactionStarted(FedopsInteraction.Pagination);
    const products = await this.loadProductsByPage(page);
    this.currentPage = page;
    this.siteStore.biLogger.clickLoadMoreInGallerySf({...this.getBICollection(), type: BiEventParam.Pagination});
    this.queryParamsService.updatePageQueryParam(page);
    this.updateComponent(this.getComputedProps(products));
    this.fedopsLogger.interactionEnded(FedopsInteraction.Pagination);
  }

  private getComputedProps(products: IProduct[]) {
    return {
      currentPage: this.currentPage,
      isFirstPage: false,
      productsManifest: this.generateProductsManifest(products),
      products,
      productsVariantInfoMap: this.productsVariantInfoMap,
      productsPriceRangeMap: this.productsService.productPriceRangeMap,
    };
  }

  private readonly isEditorX = () => {
    return this.styleParams.booleans.responsive === true;
  };

  private readonly isAutoGrid = () => {
    if (this.isEditorX()) {
      return this.styleParams.numbers.gallery_gridType === GridType.AUTO;
    }

    if (this.siteStore.isMobile()) {
      return false;
    }

    return this.styleParams.numbers.gallery_gridType === GridType.AUTO;
  };

  private getPaginationMode(): PaginationTypeName {
    return this.siteStore.isMobile() || this.styleParams.numbers.gallery_paginationFormat === PaginationType.COMPACT
      ? 'compact'
      : 'pages';
  }

  private getIsOptionsRevealEnabled(): boolean {
    return (
      !this.siteStore.isMobile() &&
      this.styleParams.numbers.gallery_productOptionsShowOptions === ProductOptionsShowOptionsOption.REVEAL &&
      this.siteStore.experiments.enabled(Experiments.GalleryProductOptionsVisibilitySettings)
    );
  }
}
