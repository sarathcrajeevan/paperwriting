import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {IProduct, IPropsInjectedByViewerScript, IWishlistStyleParams} from '../types/app-types';
import {IControllerConfig} from '@wix/native-components-infra/dist/es/src/types/types';
import {MultilingualService} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/MultilingualService/MultilingualService';
import {
  ActionStatus,
  APP_DEFINITION_ID,
  BiButtonActionType,
  PageMap,
} from '@wix/wixstores-client-core/dist/es/src/constants';
import {WishlistService} from '../services/WishlistService';
import {getTranslations, isWorker} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/utils';
import {QuickViewActions} from '@wix/wixstores-client-storefront-sdk/dist/es/src/actions/QuickViewActions/QuickViewActions';
import {
  FedopsEvent,
  GalleryViewMode,
  ORIGIN,
  PublicDataKeys,
  translationPath,
  WISHLIST_BI_APP_NAME,
} from '../constants';
import {getStyleParamsWithDefaults} from '@wix/wixstores-client-common-components/dist/src/outOfIframes/defaultStyleParams/getStyleParamsWithDefaults';
import {getDefaultStyleParams} from '../commons/getDefaultStyleParams';
import * as _ from 'lodash';
import {productsPerPage} from './utils';
import {
  PaginationType,
  PaginationTypeName,
  ProductsManifest,
} from '@wix/wixstores-client-gallery/dist/es/src/types/galleryTypes';
import {ILink} from '@wix/wixstores-client-core/dist/es/src/types/site-map';
import {AddToCartActionOption} from '@wix/wixstores-client-core/dist/src/constants';
import {AddToCartService} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/AddToCartService/AddToCartService';
import {actualPrice, actualSku} from '@wix/wixstores-client-core/dist/es/src/productOptions/productUtils';
import {CustomUrlApi} from '@wix/wixstores-client-storefront-sdk/dist/es/src/utils/CustomUrl/CustomUrlApi';
import {HeadingTags} from '@wix/wixstores-client-core/dist/es/src/types/heading-tags';
import {CartActions} from '@wix/wixstores-client-storefront-sdk/dist/es/src/actions/CartActions/CartActions';

export class WishlistStore {
  private currentPage: number = 1;
  private multilingualService: MultilingualService;
  private products: IProduct[];
  private productsPerPage: number;
  private readonly fedopsLogger;
  private readonly quickviewActions: QuickViewActions;
  private readonly wishlistService: WishlistService;
  private sectionUrl: string;
  private shouldReportFedops: boolean = true;
  private translations;
  private homepageLink: ILink;
  private addedToCartStatus: {[p: string]: ActionStatus} = {};
  private isUrlWithOverrides: boolean = false;
  private readonly addToCartService: AddToCartService;
  private readonly customUrlApi: CustomUrlApi;
  private readonly cartActions: CartActions;

  constructor(
    private publicData: IControllerConfig['publicData'],
    private readonly setProps: Function,
    private readonly siteStore: SiteStore,
    private readonly externalId: string,
    private readonly compId: string,
    private readonly type: string,
    private styleParams: IWishlistStyleParams,
    private readonly reportError: (e) => any
  ) {
    const fedopsLoggerFactory = this.siteStore.platformServices.fedOpsLoggerFactory;
    this.fedopsLogger = fedopsLoggerFactory.getLoggerForWidget({
      appId: APP_DEFINITION_ID,
      widgetId: this.type,
    });
    if (isWorker()) {
      this.fedopsLogger.appLoadStarted();
    }

    if (this.publicData.COMPONENT === null || this.publicData.COMPONENT === undefined) {
      this.publicData.COMPONENT = {};
    }

    this.cartActions = new CartActions({siteStore: this.siteStore, origin: ORIGIN});
    this.wishlistService = new WishlistService(this.siteStore, this.externalId);
    this.quickviewActions = new QuickViewActions(this.siteStore);
    this.addToCartService = new AddToCartService(this.siteStore, publicData);
    this.productsPerPage = productsPerPage(this.styleParams);

    this.customUrlApi = new CustomUrlApi(this.siteStore.location.buildCustomizedUrl);

    this.handleCurrencyChange();
  }

  private handleCurrencyChange() {
    let currency = this.siteStore.location.query.currency;
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.siteStore.location.onChange(async () => {
      if (currency !== this.siteStore.location.query.currency) {
        currency = this.siteStore.location.query.currency;
        await this.updateComponent();
      }
    });
  }

  public async setInitialState(): Promise<void> {
    const [section, translations, appSettings, homepageLink] = await Promise.all([
      this.siteStore.getSectionUrl(PageMap.PRODUCT),
      getTranslations(translationPath(this.siteStore.baseUrls.wishlistBaseUrl, this.siteStore.locale)),
      this.wishlistService.getAppSettings(),
      this.siteStore.getHomepageLink(),
    ]);

    this.isUrlWithOverrides = await this.customUrlApi.init();

    this.sectionUrl = section.url;
    this.translations = translations;
    this.homepageLink = homepageLink;

    this.multilingualService = new MultilingualService(
      this.siteStore,
      this.publicData.COMPONENT,
      appSettings.widgetSettings
    );

    await this.updateComponent();

    if (this.siteStore.isSSR()) {
      this.fedopsLogger.appLoaded();
    }
  }

  private async updateComponent() {
    const propsToInject = await this.getComputedProps();

    this.setProps(propsToInject);
  }

  private async getComputedProps(): Promise<IPropsInjectedByViewerScript> {
    const offset = (this.currentPage - 1) * this.productsPerPage;
    const limit = this.productsPerPage;
    const products = (this.products = await this.getProducts(limit, offset));
    const totalProducts = this.wishlistService.getTotalProducts();
    const hasMoreProducts = totalProducts - limit + offset > 0;

    return {
      ...this.getProductItemProps(),
      allowFreeProducts: this.addToCartService.allowFreeProducts,
      currentPage: this.currentPage,
      handlePagination: this.handlePagination.bind(this),
      handleLoadMore: this.handleLoadMore.apply(this),
      handleClickOnEmptyState: this.handleClickOnEmptyState.bind(this),
      gridType: this.styleParams.numbers.gallery_gridType,
      hasMoreProducts,
      htmlTags: this.getHtmlTags(),
      isAutoGrid: true,
      isLiveSiteMode: true,
      isLoaded: this.wishlistService.isLoaded(),
      isMobile: this.siteStore.isMobile(),
      isRTL: this.siteStore.isRTL(),
      loadMoreType: this.styleParams.numbers.gallery_loadMoreProductsType,
      onAppLoaded: this.onAppLoaded.bind(this),
      productSize: this.styleParams.numbers.gallery_productSize,
      products,
      removeProduct: this.removeProduct.bind(this),
      signature: this.wishlistService.signature(),
      styleParams: this.styleParams,
      textsMap: this.getTextsMap(),
      totalProducts,
      homePageUrl: this.homepageLink.url,
      isEmptyState: totalProducts <= 0,
      paginationMode: this.getPaginationMode(),
      productsPerPage: this.productsPerPage,
      priceBreakdown: {
        shouldRenderTaxDisclaimer: false,
        shouldRenderShippingDisclaimer: false,
      },
    };
  }

  private async getProducts(limit: number, offset: number) {
    const viewMode =
      this.siteStore.isSiteMode() || this.siteStore.isPreviewMode()
        ? GalleryViewMode.LIVE_SITE
        : this.styleParams.numbers.gallery_editorViewMode;
    const products = await this.wishlistService.getProducts({
      limit,
      offset,
      viewMode,
      productsPerPage: this.productsPerPage,
    });
    if (viewMode === GalleryViewMode.EDITOR_DEMO_STATE) {
      products.forEach((p) => (p.name = this.translations['wishlist.demoProduct.title']));
    }
    return products;
  }

  private async removeProduct(productId: string) {
    const index = this.products.findIndex((p) => p.id === productId);
    const biEventData = this.createProductItemBiEventData(productId, index);
    this.fedopsLogger.interactionStarted(FedopsEvent.RemoveFromWishlist);
    this.reportToBI('clickRemoveFromWishlistSf', biEventData);

    this.products = this.products.filter((p) => p.id !== productId);
    await this.updatePartialComponent({products: this.products});
    await this.wishlistService
      .removeProduct(productId)
      .then(() => {
        this.fedopsLogger.interactionEnded(FedopsEvent.RemoveFromWishlist);
        this.reportToBI('productRemovedFromWishlistSf', biEventData);
      })
      .catch(this.reportError);
    await this.updateComponent();
  }

  private reportToBI(eventName, eventData): void {
    (this.siteStore.biLogger as {})[eventName](eventData);
  }

  private createProductItemBiEventData(productId: string, index: number) {
    const {ribbon, options, id, productType} = this.pickProduct(productId);

    return {
      hasOptions: options.length > 0,
      hasRibbon: !!ribbon,
      index,
      productId: id,
      productType,
      origin: ORIGIN,
    };
  }

  private updatePartialComponent(props: Partial<IPropsInjectedByViewerScript>): Promise<void> {
    this.setProps(props);
    return Promise.resolve();
  }

  public async updateState(
    newStyleParams: IWishlistStyleParams,
    newPublicData: IControllerConfig['publicData'] & {appSettings?: any}
  ): Promise<void> {
    const nextStyleParams = getStyleParamsWithDefaults(newStyleParams, () => {
      return getDefaultStyleParams(newStyleParams);
    });
    this.updatePublicData(newPublicData);
    this.multilingualService.setPublicData(this.publicData.COMPONENT);
    this.multilingualService.setWidgetSettings(newPublicData.appSettings);
    this.styleParams = {...nextStyleParams};
    this.productsPerPage = productsPerPage(this.styleParams);
    this.setProps(await this.getComputedProps());
  }

  private updatePublicData(newPublicData: IControllerConfig['publicData']) {
    /* istanbul ignore next: hard to test it */
    this.publicData = _.merge(this.publicData, newPublicData);
  }

  private getProductItemProps() {
    return {
      addedToCartStatus: this.addedToCartStatus,
      experiments: {},
      handleAddToCart: this.handleAddToCart.bind(this),
      handleProductItemClick: this.handleProductItemClick.bind(this),
      openQuickView: this.handleOpenQuickView.bind(this),
      productsManifest: this.productsManifest,
      shouldShowAddToCartSuccessAnimation: true,
      updateAddToCartStatus: this.updateAddToCartStatus.bind(this),
    };
  }

  private readonly updateAddToCartStatus = (productId: string, status: ActionStatus) => {
    this.addedToCartStatus = {
      ...this.addedToCartStatus,
      [productId]: status,
    };

    return this.updatePartialComponent({addedToCartStatus: this.addedToCartStatus});
  };

  private getTextsMap(): IPropsInjectedByViewerScript['textsMap'] {
    return {
      addToCartContactSeller: this.translations['wishlist.contactSeller.button'],
      addToCartOutOfStock:
        this.multilingualService.get(PublicDataKeys.OUT_OF_STOCK) || this.translations['wishlist.outOfStock.button'],
      addToCartSuccessSR: this.translations['sr.addToCartSuccess'],
      digitalProductBadgeAriaLabelText: this.translations['sr.digitalProduct'],
      emptyStateText:
        this.multilingualService.get(PublicDataKeys.NO_PRODUCTS_MESSAGE) || this.translations['wishlist.emptyState'],
      emptyStateLinkText:
        this.multilingualService.get(PublicDataKeys.EMPTY_STATE_LINK) || this.translations['wishlist.CTA'],
      galleryAddToCartButtonText:
        this.multilingualService.get(PublicDataKeys.ADD_TO_CART) || this.translations['wishlist.addToCart.button'],
      loadMoreButton:
        this.multilingualService.get(PublicDataKeys.LOAD_MORE_BUTTON) || this.translations['wishlist.loadMore.button'],
      productOutOfStockText:
        this.multilingualService.get(PublicDataKeys.OUT_OF_STOCK) || this.translations['wishlist.outOfStock.label'],
      productPriceAfterDiscountSR: this.translations['sr.PRODUCT_PRICE_AFTER_DISCOUNT'],
      productPriceBeforeDiscountSR: this.translations['sr.PRODUCT_PRICE_BEFORE_DISCOUNT'],
      productPriceWhenThereIsNoDiscountSR: this.translations['sr.PRODUCT_PRICE_WHEN_THERE_IS_NO_DISCOUNT'],
      quantityInputSR: this.translations['sr.quantity'],
      quantityAddSR: this.translations['sr.addQty'],
      quantityChooseAmountSR: this.translations['sr.chooseQty'],
      quantityRemoveSR: this.translations['sr.removeQty'],
      quantityMaximumAmountSR: this.translations['wishlist.exceedsQuantity.error'],
      quantityMinimumAmountSR: this.translations['wishlist.minimumQuantity.error'],
      quantityTotalSR: this.translations['sr.totalQty'],
      quickViewButtonText: this.translations['wishlist.quickView.button'],
      wishlistHeaderTitle:
        this.multilingualService.get(PublicDataKeys.TITLE_TEXT) || this.translations['wishlist.title'],
      wishlistHeaderSubtitle:
        this.multilingualService.get(PublicDataKeys.SUBTITLE_TEXT) || this.translations['wishlist.description'],
      priceRangeText: '{{formattedAmount}}', // This feature is not yet supported by Wishlist. See https://jira.wixpress.com/browse/EE-27340 for more details
    };
  }

  private get productsManifest(): ProductsManifest {
    return this.products.reduce((acc, product) => {
      acc[product.id] = {
        url: this.getProductPageUrl(product.urlPart),
        addToCartState: this.addToCartService.getButtonState({price: actualPrice(product), inStock: product.isInStock}),
      };
      return acc;
    }, {});
  }

  private getProductPageUrl(slug) {
    return this.isUrlWithOverrides ? this.customUrlApi.buildProductPageUrl({slug}) : `${this.sectionUrl}/${slug}`;
  }

  private async handleProductItemClick({biData: {index, productId}}) {
    const product = this.pickProduct(productId);
    const eventData = this.createProductItemBiEventData(productId, index);
    this.reportToBI('clickOnProductBoxSf', eventData);
    this.sendProductClickTrackEvent(product, index);
    await this.siteStore.navigate(
      {
        sectionId: PageMap.PRODUCT,
        state: this.pickProduct(productId).urlPart,
        queryParams: undefined,
      },
      true
    );
  }

  private async handlePagination(page: number) {
    this.reportToBI('clickLoadMoreInGallerySf', {appName: WISHLIST_BI_APP_NAME, type: 'pagination'});
    this.currentPage = page;
    await this.updateComponent();
  }

  private handleLoadMore() {
    this.reportToBI('clickLoadMoreInGallerySf', {appName: WISHLIST_BI_APP_NAME, type: 'button'});

    const batchSize = this.productsPerPage;

    return async () => {
      this.productsPerPage += batchSize;
      await this.updateComponent();
    };
  }

  private getAddToCartActionBi(addToCartAction: AddToCartActionOption, shouldNavigateToCart: boolean) {
    if (!shouldNavigateToCart && addToCartAction === AddToCartActionOption.TINY_CART) {
      return 'tiny-cart';
    } else if (!shouldNavigateToCart && addToCartAction === AddToCartActionOption.MINI_CART) {
      return 'mini-cart';
    } else if (
      addToCartAction === AddToCartActionOption.CART ||
      (shouldNavigateToCart && addToCartAction !== AddToCartActionOption.NONE)
    ) {
      return 'cart';
    } else {
      return 'none';
    }
  }

  private async handleAddToCart({productId, quantity}: {productId: string; quantity: number}) {
    const product = this.pickProduct(productId);
    if (product.options.length || product.customTextFields.length) {
      this.reportClickAddToCartWithOptionsBI(productId, product.productType);
      return this.quickviewActions.quickViewProduct({
        origin: ORIGIN,
        urlPart: product.urlPart,
        compId: this.compId,
        externalId: this.externalId,
      });
    }

    const shouldNavigateToCart = this.cartActions.shouldNavigateToCart();
    const trackData = {
      id: product.id,
      name: product.name,
      price: actualPrice(product),
      sku: actualSku(product),
      type: product.productType,
      buttonType: BiButtonActionType.AddToCart,
      appName: WISHLIST_BI_APP_NAME,
      productType: product.productType as any,
      isNavigateCart: shouldNavigateToCart,
      navigationClick: this.getAddToCartActionBi(this.addToCartAction, shouldNavigateToCart),
    };

    this.fedopsLogger.interactionStarted(FedopsEvent.AddToCart);

    await this.cartActions.addToCart(
      {
        productId,
        quantity,
        optionsSelectionsIds: [],
        addToCartAction: this.addToCartAction,
        onSuccess: () => this.fedopsLogger.interactionEnded(FedopsEvent.AddToCart),
      },
      trackData
    );

    return this.updateAddToCartStatus(productId, ActionStatus.SUCCESSFUL);
  }

  private handleOpenQuickView({productId, index}: {productId: string; index: number}) {
    const product = this.pickProduct(productId);
    const eventData = {
      productId,
      hasRibbon: !!product.ribbon,
      hasOptions: !!product.options.length,
      index,
    };
    this.reportToBI('clickedOnProductQuickViewSf', eventData);
    return this.quickviewActions.quickViewProduct({
      origin: ORIGIN,
      urlPart: product.urlPart,
      compId: this.compId,
      externalId: this.externalId,
    });
  }

  private pickProduct(productId: string): IProduct {
    return this.products.find((p) => p.id === productId);
  }

  private async handleClickOnEmptyState(): Promise<void> {
    await this.siteStore.biLogger.clickLinkInMembersWishlistSf({});
    this.siteStore.navigateToLink(this.homepageLink);
  }

  private getPaginationMode(): PaginationTypeName {
    return this.siteStore.isMobile() || this.styleParams.numbers.gallery_paginationFormat === PaginationType.COMPACT
      ? 'compact'
      : 'pages';
  }

  private reportClickAddToCartWithOptionsBI(productId: string, productType: string) {
    const data = {
      appName: WISHLIST_BI_APP_NAME,
      origin: ORIGIN,
      hasOptions: true,
      productId,
      productType,
      navigationClick: this.siteStore.isMobile() ? 'product-page' : 'quick-view',
    };
    this.reportToBI('clickAddToCartWithOptionsSf', data);
  }

  private sendProductClickTrackEvent(product: IProduct, index: number) {
    this.siteStore.windowApis.trackEvent('ClickProduct', {
      appDefId: APP_DEFINITION_ID,
      id: product.id,
      origin: 'Stores',
      name: product.name,
      list: 'Wishlist Gallery',
      category: 'All Products',
      position: index,
      price: product.comparePrice || product.price,
      currency: this.siteStore.currency,
      type: product.productType,
      sku: product.sku,
    });
  }

  private get addToCartAction(): AddToCartActionOption {
    return this.styleParams.numbers.gallery_addToCartAction;
  }

  /* istanbul ignore next: hard to test it */
  public onAppLoaded(): void {
    if (this.shouldReportFedops) {
      this.fedopsLogger.appLoaded();
      this.shouldReportFedops = false;
    }
  }

  private getHtmlTags() {
    return {
      productNameHtmlTag: this.publicData.COMPONENT[PublicDataKeys.PRODUCT_NAME_HTML_TAG] || HeadingTags.P,
    };
  }
}
