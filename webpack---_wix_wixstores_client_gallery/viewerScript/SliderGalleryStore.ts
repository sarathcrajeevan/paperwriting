/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
import {IProduct, GALLERY_TYPE, IGalleryControllerConfig, ProductsManifest} from '../types/galleryTypes';
import {
  translationPath,
  GALLERY_PUBLIC_DATA_PRESET_ID,
  DEFAULT_COLLECTION_ID,
  Experiments,
  FORCE_RELATED_GALLERY_RENDER_TIMEOUT,
} from '../constants';
import {IGalleryStyleParams, ITextsMap, IPropsInjectedByViewerScript} from '../types/sliderGalleryTypes';
import {ProductsService} from '../services/ProductsService';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {getTranslations, isWorker} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/utils';
import {getStyleParamsWithDefaults} from '@wix/wixstores-client-common-components/dist/src/outOfIframes/defaultStyleParams/getStyleParamsWithDefaults';
import {
  APP_DEFINITION_ID,
  PageMap,
  PubSubEvents,
  ActionStatus,
  AddToCartActionOption,
} from '@wix/wixstores-client-core/dist/es/src/constants';
import {getStyleParamsWithDefaultsFunc} from '../getStyleParamsWithDefaultsFunc';
import {MultilingualService} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/MultilingualService/MultilingualService';
import {IWidgetControllerConfig} from '@wix/native-components-infra/dist/es/src/types/types';

import {AddToCartService} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/AddToCartService/AddToCartService';
import {actualPrice} from '@wix/wixstores-client-core/dist/es/src/productOptions/productUtils';
import {CustomUrlApi} from '@wix/wixstores-client-storefront-sdk/dist/es/src/utils/CustomUrl/CustomUrlApi';
import {BaseGalleryStore} from './BaseGalleryStore';
import {ProductPriceRange} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/ProductPriceRange/ProductPriceRange';
import {unitsTranslations} from '../common/components/ProductItem/ProductPrice/unitsTranslations';
import {ProductPriceBreakdown} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/ProductPriceBreakdown/ProductPriceBreakdown';
import _ from 'lodash';

export class SliderGalleryStore extends BaseGalleryStore {
  private readonly fedopsLogger;
  private mainCollectionId: string;
  private multilingualService: MultilingualService;
  private productPageSectionUrl: string;
  private translations: any = {};
  private isFedopsReport: boolean = true;
  private productsManifest: ProductsManifest;
  private relatedProductIds: string[] = [];
  private addedToCartStatus: {[p: string]: ActionStatus} = {};
  private readonly productsService: ProductsService;
  private readonly addToCartService: AddToCartService;
  private readonly customUrlApi: CustomUrlApi;
  private isUrlWithOverrides: boolean = false;

  constructor(
    public styleParams: IGalleryStyleParams,
    config: IWidgetControllerConfig['config'],
    private readonly updateComponent: (props: Partial<IPropsInjectedByViewerScript>) => void,
    siteStore: SiteStore,
    private readonly compId: string,
    private readonly reportError: (e) => any,
    private readonly type: string
  ) {
    super({config}, siteStore);
    const fedopsLoggerFactory = this.siteStore.platformServices.fedOpsLoggerFactory;
    this.fedopsLogger = fedopsLoggerFactory.getLoggerForWidget({
      appId: APP_DEFINITION_ID,
      widgetId: this.type,
    });
    if (isWorker()) {
      this.fedopsLogger.appLoadStarted();
    }
    const numOfColumns = styleParams.numbers.galleryColumns || 4;
    const initialProductsCount = numOfColumns * 4;
    this.addToCartService = new AddToCartService(this.siteStore, this.config.publicData);
    this.productsService = new ProductsService(
      this.siteStore,
      initialProductsCount,
      'Slider Gallery',
      false,
      this.shouldRenderPriceRange,
      this.fedopsLogger,
      false
    );
    this.customUrlApi = new CustomUrlApi(this.siteStore.location.buildCustomizedUrl);
    this.subscribe();
    this.handleUrlChange();
  }

  private get shouldRenderPriceRange(): boolean {
    return new ProductPriceRange(this.siteStore).shouldShowPriceRange();
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

  public async getCateogryProducts({limit, offset}: {limit: number; offset?: number}): Promise<void> {
    await this.productsService.getCategoryProducts({compId: this.compId, limit, offset});
    this.productsManifest = this.generateProductsManifest(this.productsService.products);
    this.updateComponent({
      products: this.productsService.products,
      productsManifest: this.productsManifest,
    });
  }

  private padProductListWithPlaceholders() {
    if (this.productsService.products.length < this.productsService.totalCount) {
      const realLength = this.productsService.products.length;
      this.productsService.products[this.productsService.totalCount - 1] = undefined;
      this.productsService.products.fill({isFake: true} as any, realLength, this.productsService.totalCount);
    }
  }

  public async setInitialState(forceRender: boolean = false): Promise<void> {
    if (!forceRender && !this.shouldComponentRender()) {
      return this.updateComponent({
        isLoaded: false,
      });
    }

    const numOfColumns = this.config.style.styleParams.numbers.galleryColumns || 4;
    const numOfSets = 2;

    const fetcher = this.getDataFetcher();
    const [translations, response, {url}] = await Promise.all([
      getTranslations(translationPath(this.siteStore.baseUrls.galleryBaseUrl, this.siteStore.locale)),
      fetcher(),
      this.siteStore.getSectionUrl(PageMap.PRODUCT),
    ]).catch(this.reportError);

    this.isUrlWithOverrides = await this.customUrlApi.init();

    if (
      this.galleryType !== GALLERY_TYPE.RELATED_PRODUCTS &&
      this.productsService.totalCount > numOfSets * numOfColumns
    ) {
      this.padProductListWithPlaceholders();
      await this.productsService.getCategoryProducts({
        compId: this.compId,
        limit: numOfColumns * numOfSets,
        offset: this.productsService.totalCount - numOfColumns * numOfSets,
      });
    }

    const {products} = this.productsService;
    this.translations = translations;

    this.productPriceBreakdown = new ProductPriceBreakdown(this.siteStore, this.translations, {
      excludedPattern: 'gallery.price.tax.excludedParam.label',
      includedKey: 'gallery.price.tax.included.label',
      includedPattern: 'gallery.price.tax.includedParam.label',
      excludedKey: 'gallery.price.tax.excluded.label',
    });

    this.productPageSectionUrl = url;
    this.mainCollectionId = this.productsService.getMainCollectionId();
    this.productsManifest = this.generateProductsManifest(products);
    this.multilingualService = new MultilingualService(
      this.siteStore,
      this.config.publicData.COMPONENT,
      response.appSettings.widgetSettings
    );
    this.updateComponent(this.getPropsToInject(products));

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

      this.siteStore.biLogger.viewGallerySf({
        isMobileFriendly: this.siteStore.isMobileFriendly,
        addToCart: this.styleParams.booleans.gallery_showAddToCartButton,
        hasPrice: this.styleParams.booleans.gallery_showPrice,
        hasQuantity: this.styleParams.booleans.gallery_showAddToCartQuantity,
        hasQuickView: this.styleParams.booleans.showQuickView,
        hoverType: this.styleParams.fonts.gallery_hoverType.value,
        priceBreakdown: this.productPriceBreakdown.priceBreakdownBIParam,
        navigationClick: this.getNavigationClick(),
        productsLogic:
          // eslint-disable-next-line no-nested-ternary
          this.galleryType === GALLERY_TYPE.RELATED_PRODUCTS
            ? 'related products'
            : this.mainCollectionId !== DEFAULT_COLLECTION_ID
            ? 'collection'
            : 'All products',
        type: 'slider-gallery',
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

  private getPropsToInject(products: IProduct[]): IPropsInjectedByViewerScript {
    return {
      ...this.getCommonPropsToInject(),
      allowFreeProducts: this.addToCartService.allowFreeProducts,
      addedToCartStatus: this.addedToCartStatus,
      cssBaseUrl: this.siteStore.baseUrls.galleryBaseUrl,
      getCategoryProducts: this.getCateogryProducts.bind(this),
      handleProductItemClick: this.handleProductItemClick.bind(this),
      isFirstPage: true,
      isInteractive: this.siteStore.isInteractive(),
      isLiveSiteMode: this.siteStore.isSiteMode(),
      isLoaded: true,
      showShowLightEmptyState: this.productsService.hideGallery,
      hideGallery: this.productsService.hideGallery,
      isMobile: this.siteStore.isMobile(),
      isRTL: this.siteStore.isRTL(),
      mainCollectionId: this.mainCollectionId,
      onAppLoaded: this.onAppLoaded.bind(this),
      openQuickView: this.openQuickView.bind(this),
      productsManifest: this.productsManifest,
      products,
      showTitle: this.shouldShowTitle,
      ravenUserContextOverrides: {id: this.siteStore.storeId, uuid: this.siteStore.uuid},
      textsMap: this.getTextsMap(),
      totalProducts: this.productsService.totalCount,
      shouldShowAddToCartSuccessAnimation: this.getAddToCartAction() === AddToCartActionOption.NONE,
      handleAddToCart: this.handleAddToCart.bind(this),
      updateAddToCartStatus: this.updateAddToCartStatus.bind(this),
      productsPriceRangeMap: this.productsService.productPriceRangeMap,
      experiments: {
        isArrowlessMobileSliderEnabled: this.siteStore.experiments.enabled(
          Experiments.ClientGalleryArrowlessMobileSlider
        ),
      },
    };
  }

  private getTextsMap(): ITextsMap {
    return {
      addToCartContactSeller: this.translations['gallery.contactSeller.button'],
      addToCartOutOfStock:
        this.multilingualService.get('gallery_oosButtonText') || this.translations['gallery.outOfStock.button'],
      addToCartSuccessSR: this.translations['gallery.sr.addToCartSuccess'],
      digitalProductBadgeAriaLabelText: this.translations['sr.digitalProduct'],
      galleryAddToCartButtonText:
        this.multilingualService.get('gallery_addToCartText') || this.translations['gallery.addToCart.button'],
      noProductsMessageText: this.translations.NO_PRODUCTS_MESSAGE_MAIN,
      productOutOfStockText:
        this.multilingualService.get('gallery_oosButtonText') || this.translations.OUT_OF_STOCK_LABEL,
      productPriceAfterDiscountSR: this.translations['sr.PRODUCT_PRICE_AFTER_DISCOUNT'],
      productPriceBeforeDiscountSR: this.translations['sr.PRODUCT_PRICE_BEFORE_DISCOUNT'],
      productPriceWhenThereIsNoDiscountSR: this.translations['sr.PRODUCT_PRICE_WHEN_THERE_IS_NO_DISCOUNT'],
      quantityAddSR: this.translations['gallery.sr.addQty'],
      quantityChooseAmountSR: this.translations['gallery.sr.chooseQty'],
      quantityInputSR: this.translations['gallery.sr.quantity'],
      quantityMaximumAmountSR: this.translations['gallery.exceedsQuantity.error'],
      quantityMinimumAmountSR: this.translations['gallery.minimumQuantity.error'],
      quantityRemoveSR: this.translations['gallery.sr.removeQty'],
      quantityTotalSR: this.translations['gallery.sr.totalQty'],
      quickViewButtonText: this.translations.QUICK_VIEW,
      sliderGalleryNextProduct: this.translations['sr.sliderGallery.nextProduct'],
      sliderGalleryNoProductsMessageText: this.translations.NO_PRODUCTS_MESSAGE_MINI_GALLERY_MAIN,
      sliderGalleryPreviousProduct: this.translations['sr.sliderGallery.previousProduct'],
      sliderGalleryTitle: this.title,
      priceRangeText: this.translations['gallery.price.from.label'],
      pricePerUnitSR: this.translations['gallery.sr.units.basePrice.label'],
      measurementUnits: this.getMeasurementUnitsTranslation(),
    };
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
    return products
      .filter(({urlPart}) => Boolean(urlPart))
      .reduce((acc, product) => {
        acc[product.id] = {
          url: this.getProductPageUrl(product.urlPart),
          addToCartState: this.addToCartService.getButtonState({
            price: actualPrice(product),
            inStock: product.isInStock,
          }),
        };
        return acc;
      }, {});
  }

  private getProductPageUrl(slug) {
    return this.isUrlWithOverrides
      ? this.customUrlApi.buildProductPageUrl({slug})
      : `${this.productPageSectionUrl}/${slug}`;
  }

  private async handleAddToCart({productId, index, quantity}: {productId: string; index: number; quantity: number}) {
    await this.productsService.addToCart({
      productId,
      quantity,
      index,
      compId: this.compId,
      externalId: this.config.externalId,
      addToCartAction: this.getAddToCartAction(),
    });

    this.updateAddToCartStatus(productId, ActionStatus.SUCCESSFUL);
  }

  private readonly getAddToCartAction = () => this.styleParams.numbers.gallery_addToCartAction;

  private readonly updateAddToCartStatus = (productId: string, status: ActionStatus) => {
    this.addedToCartStatus = {
      ...this.addedToCartStatus,
      [productId]: status,
    };

    this.updateComponent({addedToCartStatus: this.addedToCartStatus});
  };

  private openQuickView({productId, index}: {productId: string; index: number}) {
    return this.productsService.quickViewProduct(productId, index, this.compId, this.config.externalId);
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
      hasOptions: !!product.options.length,
      index,
      productType: product.productType,
    });

    this.siteStore.navigate(
      {
        sectionId: PageMap.PRODUCT,
        state: product.urlPart,
        queryParams: undefined,
      },
      true
    );
    this.productsService.sendClickTrackEvent(product, index);
  }

  public updateState(
    newStyleParams: IGalleryStyleParams,
    newPublicData: IGalleryControllerConfig['publicData'] & {appSettings?: any}
  ): void {
    this.config.publicData = newPublicData;
    this.multilingualService.setPublicData(newPublicData.COMPONENT);
    this.styleParams = getStyleParamsWithDefaults(newStyleParams, () =>
      getStyleParamsWithDefaultsFunc({style: {styleParams: newStyleParams}, dimensions: undefined})
    );

    if (newPublicData.appSettings) {
      this.multilingualService.setWidgetSettings(newPublicData.appSettings);
    }

    this.updateComponent({
      ...this.getCommonPropsToUpdate(),
      showTitle: this.shouldShowTitle,
      textsMap: this.getTextsMap(),
      productsPriceRangeMap: this.productsService.productPriceRangeMap,
    });
  }

  private get galleryType() {
    if (this.config.publicData.COMPONENT.presetId === GALLERY_PUBLIC_DATA_PRESET_ID.RELATED_PRODUCTS) {
      return GALLERY_TYPE.RELATED_PRODUCTS;
    }

    return GALLERY_TYPE.COLLECTION;
  }

  private getDataFetcher() {
    return {
      [GALLERY_TYPE.COLLECTION]: () =>
        this.productsService.oldGetInitialData({
          externalId: this.config.externalId,
          compId: this.compId,
        }),
      [GALLERY_TYPE.RELATED_PRODUCTS]: () =>
        this.productsService.getRelatedItems({
          externalId: this.config.externalId,
          productIds: this.relatedProductIds,
        }),
    }[this.galleryType];
  }

  private subscribe() {
    const forceRenderWhenEmpty = () => this.relatedProductIds.length === 0 && this.renderRelatedProducts();

    if (this.galleryType === GALLERY_TYPE.RELATED_PRODUCTS) {
      setTimeout(forceRenderWhenEmpty, FORCE_RELATED_GALLERY_RENDER_TIMEOUT);
      this.siteStore.pubSub.subscribe(
        PubSubEvents.RELATED_PRODUCTS,
        (response) => this.renderRelatedProducts(response.data),
        true
      );
    }
  }

  private renderRelatedProducts(productIds: string[] = []) {
    this.relatedProductIds = [...productIds];
    this.setInitialState(true);
  }

  private shouldComponentRender() {
    if (!this.siteStore.isInteractive()) {
      return true;
    }
    if (this.galleryType === GALLERY_TYPE.RELATED_PRODUCTS && this.relatedProductIds.length === 0) {
      return false;
    }
    return true;
  }

  private get title(): string {
    if (this.galleryType === GALLERY_TYPE.COLLECTION) {
      const collectionName =
        this.productsService.getMainCollectionId() === DEFAULT_COLLECTION_ID
          ? this.translations['gallery.collection.allProducts']
          : this.productsService.collectionName;

      return this.multilingualService.get('SLIDER_GALLERY_TITLE_COLLECTION') || collectionName;
    }

    return (
      this.multilingualService.get('SLIDER_GALLERY_TITLE_RELATED_PRODUCTS') ||
      this.translations['gallery.relatedProducts.default.title']
    );
  }

  private get shouldShowTitle() {
    if (this.styleParams.booleans.gallery_showTitle !== undefined) {
      return this.styleParams.booleans.gallery_showTitle;
    }
    return this.galleryType === GALLERY_TYPE.RELATED_PRODUCTS;
  }
}
