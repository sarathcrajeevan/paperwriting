/* eslint-disable max-lines,todo(eran): will refactor at https://jira.wixpress.com/browse/EE-25400 */
import {
  BILoggerEvents,
  CheckoutStageWithCartParams,
  CurrentPrice,
  HandleCashierPaymentSubmitResult,
  IBreakdownParams,
  IMediaItem,
  InfoSectionEvent,
  IProductDTO,
  IProductPageControllerConfig,
  IProductPageStyleParams,
  IPropsInjectedByViewerScript,
  PagePath,
  ProductPagePagination,
  ProdudctQunatityRange,
  SocialSharingEvent,
  StockIndicatorCount,
  TranslationDictionary,
  UserInput,
  UserInputData,
  UserInputErrors,
} from '../types/app-types';
import {Logger as BiLoggerPlatformSite} from '@wix/bi-logger-ec-site';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {getTranslations, isWorker} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/utils';
import {
  BI_APP_NAME,
  BiInventoryStatus,
  COMPONENTS_ADD_TO_CART_TEXT_KEYS,
  COMPONENTS_OUT_OF_STOCK_TEXT_KEYS,
  ErrorTooltipPlacement,
  InfoSectionLayoutId,
  Layout,
  LayoutId,
  LayoutNames,
  ModalState,
  MULTILINGUAL_TO_TRANSLATIONS_MAP,
  Origin,
  PaymentOptionsBreakdownTheme,
  PaymentOptionsBreakdownThemeValue,
  PRODUCT_PAGE_APP_NAME,
  ProductOptionType,
  productPageFedopsEvent,
  ProductType,
  QUICK_VIEW_APP_NAME,
  SocialVendor,
  translationPath,
  UserInputType,
  COMPONENTS_BACK_IN_STOCK_TEXT_KEYS,
} from '../constants';
import {ProductService} from '../services/ProductService';
import {QuantityCalculator} from '@wix/wixstores-client-core/dist/es/src/quantity-calculator/quantityCalculator';
import {
  actualPrice,
  actualSku,
  hasSubscriptionPlans,
  inStock,
  userInputsFactory,
} from '@wix/wixstores-client-core/dist/es/src/productOptions/productUtils';
import * as _ from 'lodash';
import {
  ActionStatus,
  AddToCartActionOption,
  APP_DEFINITION_ID,
  BiButtonActionType,
  PageMap,
  PubSubEvents,
  STORAGE_PAGINATION_KEY,
  StoresWidgetID,
} from '@wix/wixstores-client-core/dist/es/src/constants';
import {all, capitalizeFirstLetters, delay} from '../commons/utils';
import {MultilingualService} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/MultilingualService/MultilingualService';
import {IAppSettings, IProductOptionSelection} from '@wix/wixstores-graphql-schema/dist/es/src/graphql-schema';
import {StructurePage} from '@wix/native-components-infra/dist/src/types/types';
import {parseUrl} from '@wix/native-components-infra/dist/src/urlUtils';
import {IStoreFrontNavigationContext} from '@wix/wixstores-client-core/dist/src/types/site-map';
import {clickOnProductDetailsSfParams, socialButtonsParams, viewProductPageSfParams} from '@wix/bi-logger-ec-sf';
import {updateWixCounters} from '../services/countersApi';
import {
  ProductPageItemData,
  SeoProductBuilder,
} from '@wix/wixstores-client-core/dist/es/src/builders/SeoItemData.builder';
import {SPECS} from '../specs';
import {WishlistActions} from '@wix/wixstores-client-storefront-sdk/dist/es/src/actions/WishlistActions/WishlistActions';
import {DirectPurchaseService} from '../services/DirectPurchaseService';
import {TrackEventName} from '@wix/wixstores-client-core/dist/es/src/types/track-event';
import {ResultProp, withChangeListener} from '../providers/withChangeListener';
import {GetFirstProductQuery, GetProductBySlugQuery} from '../graphql/queries-schema';
import {ShippingContactRestricted} from '@wix/cashier-express-checkout-widget/dist/src/types/Shipping';
import {PaymentAuthorizedArgs} from '@wix/cashier-express-checkout-widget/dist/src/types/ExternalContract';
import {AddToCartService} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/AddToCartService/AddToCartService';
import {AddToCartState} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/AddToCartService/constants';
import {IFedOpsLogger} from '@wix/native-components-infra/dist/es/src/types/types';
import {ProductPriceService} from '../services/ProductPriceService';
import {DynamicPaymentMethodsTheme} from '@wix/wixstores-client-storefront-sdk/dist/es/src/enums/productPageSettings.enums';
import {Theme} from '@wix/cashier-express-checkout-widget/dist/src/types/Styles';
import {NavigationService} from '../services/NavigationService';
import {CustomUrlApi} from '@wix/wixstores-client-storefront-sdk/dist/es/src/utils/CustomUrl/CustomUrlApi';
import {
  IOptionSelectionVariant,
  IProductOptionSelectionItem,
} from '@wix/wixstores-client-core/dist/es/src/types/product';
import {
  BI_PRODUCT_OPTION_ACTION,
  BI_PRODUCT_OPTION_TYPE,
} from '@wix/wixstores-client-storefront-sdk/dist/es/src/constants';
import {calcSelectionsAvailability} from '@wix/wixstores-client-core/dist/es/src/productVariantCalculator/ProductVariantCalculator';
import {
  ShippingContactSelectedUpdate,
  ShippingMethod,
  ShippingMethodSelectedUpdate,
} from '@wix/cashier-express-checkout-widget/src/types/Shipping';
import {ISentryErrorBoundaryPropsInjectedByViewerScript} from '@wix/native-components-infra/dist/es/src/HOC/sentryErrorBoundary/sentryErrorBoundary';
import {getReleaseFromBaseUrl} from '@wix/native-components-infra/dist/es/src/sentryUtils/getReleaseFromBaseUrl';
import {HeadingTags} from '@wix/wixstores-client-core/dist/es/src/types/heading-tags';
import {CashierExpressService} from '../services/CashierExpressService';
import {ProductPriceBreakdown} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/ProductPriceBreakdown/ProductPriceBreakdown';
import {ProductPriceRange} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/ProductPriceRange/ProductPriceRange';
import {BackInStockStore} from './stores/BackInStockStore';
import {IProduct} from '@wix/wixstores-graphql-schema';
import {VolatileCartService} from '../services/VolatileCartService';
import {CheckoutApi} from '@wix/wixstores-client-storefront-sdk/dist/es/src/apis/CheckoutApi/CheckoutApi';
import {createLazyValue, LazyValue} from '../commons/lazy';
import {createOOIPlatformSiteBILogger} from '@wix/wixstores-client-core/dist/es/src/bi/configure-ooi-platform-site-bi-logger';
import {StoreMetaDataService} from '../services/StoreMetaDataService';
import {SubscriptionService} from '@wix/wixstores-client-storefront-sdk/dist/src/services/ProductSubscriptionService/SubscriptionService';

const MY_ACCOUNT_APP_DEF_ID = '14cffd81-5215-0a7f-22f8-074b0e2401fb';
const MEMBERS_INFO_SECTION_ID = 'member_info';

export class ProductPageStore {
  private readonly cashierExpressWidgetOnShippingMethodSelectedResult: ResultProp<ShippingMethodSelectedUpdate>;
  private directPurchaseService: DirectPurchaseService;
  private isMembersInstalled: boolean;
  private isStartReported: boolean = false;
  private media: IMediaItem[] = [];
  private readonly mergedPublicData: {[p: string]: any};
  private multilingualService: MultilingualService;
  private pagePath;
  private product: IProductDTO;
  private productAddedToWishlist: boolean;
  private readonly addToCartService: AddToCartService;
  private readonly customUrlApi: CustomUrlApi;
  private isUrlWithOverrides: boolean = false;
  private urlOverrideSegments?: {key: string; segments: {[key: string]: string}};
  private readonly currentPath: string[];
  private readonly fedopsLogger: IFedOpsLogger;
  private readonly handleCashierOnClickResult: ResultProp<boolean>;
  private handleCashierPaymentSubmitResult: HandleCashierPaymentSubmitResult;
  private readonly navigationContext: IStoreFrontNavigationContext;
  private readonly productService: ProductService;
  private sectionUrl: string;
  private subscriptionService: SubscriptionService;
  private translations: TranslationDictionary;
  private translationsPromise: Promise<any>;
  public userInputs = userInputsFactory() as UserInput;
  private cashierExpressService: CashierExpressService;
  private productPriceBreakdown: ProductPriceBreakdown;
  private dynamicPaymentsMethodsAmount: number;
  private fetchPaymentBreakdownForCashierAddressResult: ResultProp<ShippingContactSelectedUpdate>;
  private readonly backInStockStore: BackInStockStore;
  private readonly volatileCartService: VolatileCartService;
  private readonly checkoutApi: CheckoutApi;
  private readonly biLoggerSite: LazyValue<BiLoggerPlatformSite>;
  private readonly storeMetaDataService: StoreMetaDataService;

  constructor(
    public styleParams: IProductPageStyleParams,
    public origPublicData: IProductPageControllerConfig['publicData'],
    private readonly setProps: Function,
    private readonly siteStore: SiteStore,
    private readonly externalId: string,
    private readonly reportError: (e) => any,
    compId: string
  ) {
    const fedopsLoggerFactory = this.siteStore.platformServices.fedOpsLoggerFactory;
    this.fedopsLogger = fedopsLoggerFactory.getLoggerForWidget({
      appId: APP_DEFINITION_ID,
      widgetId: StoresWidgetID.PRODUCT_PAGE,
      fedopsAppName: this.isQuickView ? QUICK_VIEW_APP_NAME : PRODUCT_PAGE_APP_NAME,
    });
    if (isWorker()) {
      this.fedopsLogger.appLoadStarted();
      this.isStartReported = true;
    }
    this.productService = new ProductService({
      siteStore,
      withPriceRange: this.shouldRenderPriceRange,
      origin: this.biOrigin,
    });
    this.navigationContext = this.getNavigationContext();
    const publicData = _.cloneDeep(this.origPublicData);
    this.currentPath = this.siteStore.location.path;

    this.customUrlApi = new CustomUrlApi(this.siteStore.location.buildCustomizedUrl);

    this.addToCartService = new AddToCartService(siteStore, publicData);
    this.storeMetaDataService = new StoreMetaDataService(this.siteStore);
    this.volatileCartService = new VolatileCartService(
      this.siteStore.httpClient,
      this.siteStore,
      this.storeMetaDataService
    );
    this.checkoutApi = new CheckoutApi({siteStore: this.siteStore, origin: Origin.PRODUCT_PAGE});

    //eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.siteStore.location.onChange((data) => {
      if (data.path[0] === this.currentPath[0]) {
        return this.setInitialState()
          .then(() => this.reportBIOnAppLoaded())
          .catch(this.reportError);
      }
    });
    this.mergedPublicData = this.getMergedPublicData(publicData);
    this.biLoggerSite = createLazyValue(() => this.createSiteBiLogger());
    this.backInStockStore = new BackInStockStore({
      siteStore: this.siteStore,
      setProps: (props) => this.setProps(props),
      resolveProductId: /* istanbul ignore next todo(titk@wix.com): remove when modal is implemented */ () =>
        this.product.id,
      resolveVariantId: /* istanbul ignore next todo(titk@wix.com): remove when modal is implemented */ () =>
        this.product.isManageProductItems ? this.selectedVariant.id : this.product.productItems[0].id,
      compId,
      canCreateBackInStockRequest: /* istanbul ignore next todo(tymofiih@wix.com): enzyme rendering issue` */ () =>
        this.validateProductSubmission(),
      biLoggerSite: this.biLoggerSite,
    });
  }

  private get sentryErrorBoundaryProps(): ISentryErrorBoundaryPropsInjectedByViewerScript {
    return {
      ravenUserContextOverrides: {id: this.siteStore.storeId, uuid: this.siteStore.uuid as string},
      sentryRelease: getReleaseFromBaseUrl(this.siteStore.baseUrls.productPageBaseUrl, {
        artifactName: true,
      }),
    };
  }

  public async setInitialState(): Promise<void> {
    this.sectionUrl = (await this.siteStore.getSectionUrl(PageMap.PRODUCT)).url;

    this.fedopsLogger.appLoadingPhaseStart('startFetching');
    const isMembersInstalledPromise = this.siteStore.siteApis.isAppSectionInstalled({
      appDefinitionId: MY_ACCOUNT_APP_DEF_ID,
      sectionId: MEMBERS_INFO_SECTION_ID,
    });

    this.isUrlWithOverrides = await this.customUrlApi.init();
    if (this.isUrlWithOverrides) {
      this.urlOverrideSegments = await this.getCustomizedUrlSegments();
    }

    const [translations, {product, appSettings}, isMembersInstalled] = await all(
      this.getProductPageTranslations(),
      this.getInitialData(),
      isMembersInstalledPromise,
      this.backInStockStore.initialize()
    ).catch(this.reportError);

    this.fedopsLogger.appLoadingPhaseStart('processData');

    this.product = product;
    this.translations = translations;
    this.productPriceBreakdown = new ProductPriceBreakdown(this.siteStore, this.translations, {
      excludedPattern: 'productPage.price.tax.excludedParam.label',
      includedKey: 'productPage.price.tax.included.label',
      includedPattern: 'productPage.price.tax.includedParam.label',
      excludedKey: 'productPage.price.tax.excluded.label',
    });

    this.multilingualService = new MultilingualService(
      this.siteStore,
      this.mergedPublicData,
      appSettings.widgetSettings
    );
    this.pagePath = await this.getPagePath();

    if (!this.product) {
      return this.handleEmptyState();
    }

    this.productAddedToWishlist = false;
    this.isMembersInstalled = isMembersInstalled;
    this.media = product.media;
    this.productService.updateOptions(this.product);
    this.setInitialUserInputs();
    if (!this.isQuickView) {
      this.siteStore.pubSub.publish(PubSubEvents.RELATED_PRODUCTS, [this.product.id], true);
    }
    this.fedopsLogger.appLoadingPhaseStart('setProps');

    this.subscriptionService = new SubscriptionService(this.product.subscriptionPlans, {
      label: this.translations.PRODUCT_PAGE_ONE_TIME_PURCHASE_LABEL,
      place: this.styleParams.numbers.productPage_subscriptionPlansOneTimePurchase,
      price: this.product.formattedComparePrice || this.product.formattedPrice,
    });

    if (this.siteStore.experiments.enabled(SPECS.CASHIER_EXPRESS_IN_PRODUCT_PAGE)) {
      this.cashierExpressService = new CashierExpressService(
        this.siteStore,
        this.checkoutApi,
        this.volatileCartService
      );
    }

    this.setProps(this.initialProps);
    this.trackViewContent();
    this.setPageMetaData();
    if (this.siteStore.isSSR()) {
      this.fedopsLogger.appLoaded();
    }
  }

  private createSiteBiLogger() {
    const platform = this.siteStore.platformServices;
    return createOOIPlatformSiteBILogger(
      platform.bi.biToken,
      {
        isMerchant: false,
        appName: 'Stores',
        _msid: platform.bi.metaSiteId,
        origin: this.biOrigin,
        appId: APP_DEFINITION_ID,
      },
      platform.biLoggerFactory()
    );
  }

  private getMergedPublicData(publicData: IProductPageControllerConfig['publicData']) {
    if (this.isQuickView) {
      return {...publicData.APP, ...publicData.COMPONENT};
    }

    const componentKeys = ['productPage_infoSectionTitleHtmlTag'];
    const componentPublicData = _.pick(publicData.COMPONENT, componentKeys);
    return {...publicData.APP, ...componentPublicData};
  }

  private reportBIOnAppLoaded() {
    const params: viewProductPageSfParams = this.product
      ? {
          isMobileFriendly: this.siteStore.isMobileFriendly,
          addToCart: this.styleParams.booleans.productPage_buyNowButtonEnabled,
          buyNow: this.styleParams.booleans.productPage_buyNowButtonEnabled,
          hasDynamicPaymentMethods: this.styleParams.booleans.productPage_dynamicPaymentMethodsEnabled,
          hasPlans: hasSubscriptionPlans(this.product),
          hasWishlist: this.styleParams.booleans.productPage_wishlistEnabled,
          inventoryStatus: this.biProductInventoryStatus,
          navigationClick: this.getAddToCartActionText(),
          oneTimePurchase: hasSubscriptionPlans(this.product) && this.subscriptionService.hasOneTimePurchase(),
          options: JSON.stringify(this.product.options.map((o) => ({type: o.optionType, size: o.selections.length}))),
          priceBreakdown: this.productPriceBreakdown.priceBreakdownBIParam,
          productId: this.product.id,
          productType: this.product.productType,
          showUnitPrice: !!this.product.pricePerUnit,
          hasNotifyMe: this.backInStockStore.isBackInStockEnabled,
          socialButton: [SocialVendor.Facebook, SocialVendor.Pinterest, SocialVendor.Twitter, SocialVendor.WhatsApp]
            .filter((v) => this.styleParams.booleans[`productPage_socialNetwork${v}`])
            .join(', '),
          hasStockIndicator: this.siteStore.experiments.enabled(SPECS.SHOW_STOCK_INDICATOR)
            ? this.styleParams.booleans.productPage_stockIndicator
            : undefined,
          remainingItemCount:
            this.siteStore.experiments.enabled(SPECS.SHOW_STOCK_INDICATOR) && this.remainingItemCount > 0
              ? this.remainingItemCount
              : undefined,
        }
      : {productId: ''};
    if (this.isQuickView) {
      /* istanbul ignore next: can't test implicit field */
      (params as any)._viewMode = this.siteStore.isPreviewMode() ? 'preview' : 'site';
      //eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.siteStore.biLogger.viewQuickViewSf(params);
    } else {
      params.type = LayoutNames[this.layoutId] as Layout;
      //eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.siteStore.biLogger.viewProductPageSf(params);
    }
  }

  private reportToWiXCounters() {
    return updateWixCounters(this.siteStore, this.product.id, this.siteStore.uuid);
  }

  public onAppLoaded = () => {
    /* istanbul ignore else: todo: test */
    if (!isWorker() || (this.siteStore.isInteractive() && this.isStartReported)) {
      if (this.siteStore.isSiteMode()) {
        this.product && this.reportToWiXCounters();
      }
      this.reportBIOnAppLoaded();
      this.fedopsLogger.appLoaded();
      this.isStartReported = false;
    }
  };

  private getAddToCartActionText() {
    // eslint-disable-next-line no-nested-ternary
    return this.getAddToCartAction() === AddToCartActionOption.MINI_CART
      ? 'mini-cart'
      : this.getAddToCartAction() === AddToCartActionOption.CART
      ? 'cart'
      : 'none';
  }

  public updateState(
    newStyleParams: IProductPageStyleParams,
    newPublicData: IProductPageControllerConfig['publicData'] & {appSettings?: any}
  ): void {
    _.merge(this.mergedPublicData, this.getMergedPublicData(newPublicData));
    this.styleParams = newStyleParams;
    this.multilingualService.setWidgetSettings(newPublicData.appSettings);
    this.setProps({
      ...this.getChangeableSettingsProps(),
    });
  }

  private getTexts() {
    const componentAddToCartTextKey = Object.keys(this.multilingualService.getAll() || {}).find((key) =>
      COMPONENTS_ADD_TO_CART_TEXT_KEYS.includes(key)
    );

    if (componentAddToCartTextKey) {
      MULTILINGUAL_TO_TRANSLATIONS_MAP.ADD_TO_CART_BUTTON = componentAddToCartTextKey;
    }

    const componentOutOfStockTextKey = Object.keys(this.multilingualService.getAll() || {}).find((key) =>
      COMPONENTS_OUT_OF_STOCK_TEXT_KEYS.includes(key)
    );

    if (componentOutOfStockTextKey) {
      MULTILINGUAL_TO_TRANSLATIONS_MAP.PRODUCT_OUT_OF_STOCK_BUTTON = componentOutOfStockTextKey;
    }

    /* istanbul ignore next */
    const componentBackInStockTextKey = Object.keys(this.multilingualService.getAll() || {}).find((key) =>
      COMPONENTS_BACK_IN_STOCK_TEXT_KEYS.includes(key)
    );

    if (componentBackInStockTextKey) {
      MULTILINGUAL_TO_TRANSLATIONS_MAP['productPage.backInStock.notifyWhenAvailable.button'] =
        componentBackInStockTextKey;
    }

    return Object.keys(MULTILINGUAL_TO_TRANSLATIONS_MAP).reduce(
      (acc, translationKey) => {
        const multiligualKey = MULTILINGUAL_TO_TRANSLATIONS_MAP[translationKey];
        const override = this.multilingualService.get(multiligualKey);
        if (override) {
          acc[translationKey] = override;
        }
        return acc;
      },
      {...this.translations}
    );
  }

  private getChangeableSettingsProps(): Partial<IPropsInjectedByViewerScript> {
    this.subscriptionService.setOneTimePurchasePlace(
      this.styleParams.numbers.productPage_subscriptionPlansOneTimePurchase
    );

    return {
      layoutId: this.layoutId,
      shouldShowAddToCartButton: this.styleParams.booleans.productPage_productAction,
      shouldShowBuyNowButton: this.styleParams.booleans.productPage_buyNowButtonEnabled,
      shouldShowProductPaymentBreakdown: this.shouldShowProductPaymentBreakdown,
      priceBreakdown: {
        shouldRenderTaxDisclaimer: this.productPriceBreakdown.shouldShowTaxDisclaimer,
        taxDisclaimer: this.productPriceBreakdown.taxDisclaimer,
        shippingDisclaimer: this.productPriceBreakdown.shippingDisclaimer,
      },
      shouldShowWishlistButton: this.styleParams.booleans.productPage_wishlistEnabled && this.isMembersInstalled,
      dynamicPaymentMethodsTheme: this.getDynamicPaymentMethodsTheme(),
      dynamicPaymentMethodsEnabled: this.styleParams.booleans.productPage_dynamicPaymentMethodsEnabled,
      subscriptionPlans: this.subscriptionService.getSubscriptionPlans(),
      breakdownParams: this.breakdownParams,
      htmlTags: this.getHtmlTags(),
      texts: this.getTexts(),
      withModalGallery: this.withModalGallery,
    };
  }

  private get shouldRenderPriceRange(): boolean {
    return new ProductPriceRange(this.siteStore).shouldShowPriceRange();
  }

  private readonly shouldShowSubscribeButton = (): boolean => {
    return this.subscriptionService.shouldShowSubscribeButton(this.userInputs);
  };

  private getDynamicPaymentMethodsTheme(): Theme | undefined {
    if (this.styleParams.numbers.productPage_dynamicPaymentMethodsButtonTheme === DynamicPaymentMethodsTheme.light) {
      return 'light';
    } else if (
      this.styleParams.numbers.productPage_dynamicPaymentMethodsButtonTheme === DynamicPaymentMethodsTheme.dark
    ) {
      return 'dark';
    }
  }

  private readonly setDynamicPaymentsMethodsAmount = (amount: number) => {
    this.dynamicPaymentsMethodsAmount = amount;
    this.nextProps();
  };

  private get initialProps(): Partial<IPropsInjectedByViewerScript> {
    const cashierExpressCheckoutWidgetProps =
      this.siteStore.experiments.enabled(SPECS.CASHIER_EXPRESS_IN_PRODUCT_PAGE) &&
      this.cashierExpressService.getInitialProps(this.product, this.styleParams);
    return {
      ...this.defaultProps,
      ...this.getChangeableSettingsProps(),
      ...this.sentryErrorBoundaryProps,
      addedToCartStatus: ActionStatus.IDLE,
      addToCartState: this.addToCartState,
      biLogger: this.biLogger.bind(this),
      cashierExpressCheckoutWidgetProps,
      cashierExpressWidgetOnShippingMethodSelected: this.cashierExpressWidgetOnShippingMethodSelected,
      cashierExpressWidgetOnShippingMethodSelectedResult: this.cashierExpressWidgetOnShippingMethodSelectedResult,
      cashierExpressPaymentBreakdown: this.getCashierExpressPaymentBreakdown(),
      closeWixModal: this.closeWixModal.bind(this),
      currentPrice: this.currentPrice,
      dynamicPaymentsMethodsAmount: undefined,
      errorPlacement:
        this.siteStore.isMobile() || this.isQuickView ? ErrorTooltipPlacement.Bottom : ErrorTooltipPlacement.Left,
      errors: {},
      fetchPaymentBreakdownForCashierAddress: this.fetchPaymentBreakdownForCashierAddress,
      handleAddToCart: this.handleAddToCart,
      handleBuyNow: this.handleBuyNow,
      ...this.backInStockStore.props,
      handleCashierOnClick: this.handleCashierOnClick,
      handleCashierOnClickResult: this.handleCashierOnClickResult,
      handleCashierPaymentSubmit: this.handleCashierPaymentSubmit,
      handleCashierPaymentSubmitResult: this.handleCashierPaymentSubmitResult,
      handleOpenModal: this.siteStore.windowApis.openModal.bind(this.siteStore.windowApis),
      handleSubscribe: this.handleSubscribe,
      handleUserInput: this.handleUserInput,
      handleWishlistButtonClick: this.handleWishlistButtonClick,
      hasMultipleMedia: this.product.media.length > 1,
      hideNavigationUrls: !this.siteStore.isSiteMode(),
      infoSection: this.infoSection,
      isDesktop: this.siteStore.isDesktop(),
      isEditorMode: this.siteStore.isEditorMode(),
      isEditorX: this.isEditorX,
      isMobile: this.siteStore.isMobile(),
      isProductSubmitted: false,
      isQuickView: this.isQuickView,
      isRTL: this.siteStore.isRTL(),
      isResponsive: this.layoutId === LayoutId.Responsive,
      isSEO: this.siteStore.seo.isInSEO(),
      isSSR: this.siteStore.isSSR(),
      modalState: ModalState.CLOSE,
      navigate: this.navigate.bind(this),
      navigateToLink: /* istanbul ignore next */ (link) => this.siteStore.location.navigateTo(link.sdkLink),
      notifyProduct: this.notifyProductLoaded,
      pagination: this.getPrevNextProducts(),
      product: this.product,
      productUrl: this.productUrl,
      productWasAddedToWishlist: this.productAddedToWishlist,
      quantityRange: this.quantityRange,
      remainingItemCount: this.remainingItemCount,
      resetAddedToCartStatus: this.resetAddedToCartStatus,
      resetWishlistStatus: this.resetWishlistStatus,
      selectedVariant: this.selectedVariant,
      setDynamicPaymentsMethodsAmount: this.setDynamicPaymentsMethodsAmount,
      shouldFocusAddToCartButton: false,
      shouldShowAddToCartSuccessAnimation: this.getAddToCartAction() === AddToCartActionOption.NONE,
      shouldShowSubscribeButton: this.shouldShowSubscribeButton(),
      shouldShowSubscriptionPlans: this.subscriptionService.shouldShowSubscriptionPlans,
      shouldShorUserInputs: this.shouldShowUserInputs,
      siteUrl: this.siteStore.location.baseUrl,
      socialSharing: this.socialSharing,
      subscriptionPlans: this.subscriptionService.getSubscriptionPlans(),
      userInputErrors: userInputsFactory() as UserInputErrors,
      userInputs: this.userInputs,
      validate: this.validate,
      variantInfo: this.variantInfo,
      wishlistActionStatus: ActionStatus.IDLE,
    };
  }

  private get defaultProps() {
    return {
      onAppLoaded: this.onAppLoaded,
      experiments: {
        jpgExperiment: this.siteStore.experiments.enabled('specs.stores.SSRJpgImageForPng'),
        cashierExpressWidget: this.siteStore.experiments.enabled(SPECS.CASHIER_EXPRESS_IN_PRODUCT_PAGE),
        useDropdownTpaLabel: this.siteStore.experiments.enabled(SPECS.USE_DROPDOWN_TPA_LABEL),
        isSubscriptionPlanTpaRadioButton: this.siteStore.experiments.enabled(
          SPECS.SUBSCRIPTION_PLAN_USE_TPA_RADIO_BUTTON
        ),
        showStockIndicatorInProductPage: this.siteStore.experiments.enabled(SPECS.SHOW_STOCK_INDICATOR),
        CartTooltipWithoutNumber: this.siteStore.experiments.enabled(SPECS.CART_TOOLTIP_WITHOUT_NUMBER),
        showOutOfStockIndicatorWhenBISIsActive: this.siteStore.experiments.enabled(
          SPECS.SHOW_OUT_OF_STOCK_INDICATOR_WHEN_BACK_IN_STOCK_ACTIVE
        ),
      },
      isInteractive: this.siteStore.isInteractive(),
      cssBaseUrl: this.siteStore.baseUrls.productPageBaseUrl,
      pagePath: this.pagePath,
      htmlTags: this.getHtmlTags(),
      texts: this.getTexts(),
    } as Partial<IPropsInjectedByViewerScript>;
  }

  private get isEditorX(): boolean {
    return this.styleParams.booleans.responsive === true;
  }

  private get withModalGallery() {
    const hasMedia = this.product.media.length > 0;
    const isViewer = !this.siteStore.isPreviewMode() && !this.siteStore.isEditorMode();
    const applicable = this.styleParams.booleans.productPage_galleryZoom === true || this.siteStore.isMobile();
    const allowedInLayout = [LayoutId.Responsive, LayoutId.Classic].includes(this.layoutId);
    return applicable && hasMedia && isViewer && allowedInLayout;
  }

  private setInitialUserInputs() {
    const textFieldsLength = this.product.customTextFields ? this.product.customTextFields.length : 0;
    const quantity = this.passedQuantity;
    const selection = this.product.options.reduce((acc, option, i) => {
      if (this.passedSelections.length) {
        acc[i] = this.passedSelections.find(({id: selectionId}) => {
          return option.selections.find((item) => item.id === selectionId);
        });
      }

      if (!acc[i]) {
        const shouldPreselect = option.selections.length > 1;
        acc[i] = shouldPreselect ? null : option.selections[0];
      }

      return acc;
    }, []);

    this.userInputs = {
      selection,
      quantity: [quantity],
      text: Array(textFieldsLength).fill(null),
      subscriptionPlan: [],
    };

    this.updateSelections();
  }

  private readonly socialSharing = {
    onClick: (data: SocialSharingEvent) => {
      const socialSharingEventWithProduct: socialButtonsParams = {...data, productId: this.product.id};
      return this.siteStore.biLogger.socialButtons(socialSharingEventWithProduct);
    },
  };

  private readonly infoSection = {
    onActive: (BIEvent: InfoSectionEvent) => {
      const infoSectionEventWithProduct: clickOnProductDetailsSfParams = {...BIEvent, productId: this.product.id};
      return this.siteStore.biLogger.clickOnProductDetailsSf(infoSectionEventWithProduct);
    },
  };

  private getProductPageTranslations(): Promise<TranslationDictionary> {
    //eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (this.translationsPromise) {
      return this.translationsPromise;
    }
    this.translationsPromise = getTranslations(
      translationPath(this.siteStore.baseUrls.productPageBaseUrl, this.siteStore.locale)
    );
    return this.translationsPromise;
  }

  private readonly navigate = (productUrlPart: string, closeWixModal: boolean = false): void => {
    //eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.siteStore.navigate({
      sectionId: PageMap.PRODUCT,
      queryParams: undefined,
      state: productUrlPart,
    });

    if (closeWixModal) {
      //eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.siteStore.biLogger.clickOnProductBoxSf({
        productId: this.product.id,
        hasRibbon: !!this.product.ribbon,
        hasOptions: !!this.product.options.length,
        index: 0,
        productType: this.product.productType,
        origin: 'quick-view',
      });
      this.closeWixModal();
    }
  };

  private closeWixModal() {
    this.siteStore.windowApis.closeWindow();
  }

  private readonly handleUserInput = (inputType: UserInputType, data: UserInputData = null, index: number) => {
    const prevData = this.userInputs[inputType][index];

    this.userInputs[inputType][index] = data;
    this.updateSelections();
    this.nextProps();

    if (inputType === UserInputType.Selection) {
      this.sendClickOnProductOptionBiEvent(
        data as IProductOptionSelectionItem,
        prevData as IProductOptionSelectionItem
      );
    }
  };

  private readonly updateSelections = () => {
    this.productService.options.updateSelections(this.product, this.userInputs.selection);
    this.filterMedia();
  };

  private readonly nextProps = (additionalProps = {} as Partial<IPropsInjectedByViewerScript>) => {
    const nextProps: Partial<IPropsInjectedByViewerScript> = {
      addToCartState: this.addToCartState,
      breakdownParams: this.breakdownParams,
      currentPrice: this.currentPrice,
      cashierExpressPaymentBreakdown: this.getCashierExpressPaymentBreakdown(),
      dynamicPaymentsMethodsAmount: this.dynamicPaymentsMethodsAmount,
      handleCashierPaymentSubmitResult: this.handleCashierPaymentSubmitResult,
      fetchPaymentBreakdownForCashierAddressResult: this.fetchPaymentBreakdownForCashierAddressResult,
      product: this.product,
      quantityRange: this.quantityRange,
      remainingItemCount: this.remainingItemCount,
      selectedVariant: this.selectedVariant,
      shouldShowSubscribeButton: this.shouldShowSubscribeButton(),
      subscriptionPlans: this.subscriptionService.getSubscriptionPlans(),
      shouldShowProductPaymentBreakdown: this.shouldShowProductPaymentBreakdown,
      userInputs: this.userInputs,
      variantInfo: this.variantInfo,
      ...additionalProps,
    };

    this.setProps(nextProps);
  };

  private readonly getCashierExpressPaymentBreakdown = () => {
    if (this.siteStore.experiments.enabled(SPECS.CASHIER_EXPRESS_IN_PRODUCT_PAGE)) {
      return this.cashierExpressService.getPaymentBreakdown(this.product, this.selectedVariant, this.userInputs);
    }

    return undefined;
  };

  public readonly validate = (): void => {
    this.nextProps({
      userInputErrors: this.productService.validate(this.userInputs),
    });
  };

  private readonly createDirectPurchaseService = () => {
    this.directPurchaseService = new DirectPurchaseService(
      this.siteStore,
      this.reportError,
      //eslint-disable-next-line @typescript-eslint/no-misused-promises
      (buttonType: BiButtonActionType) => this.reportButtonAction(buttonType),
      this.nextProps,
      this.fedopsLogger,
      this.trackDirectPurchase,
      () => this.isQuickView && this.closeWixWindow(),
      this.isEditorX,
      this.multilingualService,
      this.storeMetaDataService
    );
  };

  private readonly trackDirectPurchase = ({cartId}: {cartId: string}) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {appDefId, origin, sku, type, brand, ...contents} = this.trackParams;
    this.siteStore.windowApis.trackEvent(TrackEventName.ADD_TO_CART, {...this.trackParams, cartId});
    return this.siteStore.windowApis.trackEvent(TrackEventName.INITIATE_CHECKOUT, {
      ...this.trackParams,
      cartId,
      contents: [contents],
    });
  };

  private readonly validateProductSubmission = (): boolean => {
    const validationObject = this.isInvalid(this.userInputs);

    if (validationObject.isInvalid) {
      this.nextProps({
        isProductSubmitted: true,
        userInputErrors: validationObject.validations,
      });
      return false;
    } else {
      return true;
    }
  };

  private readonly closeWixWindow = () => {
    return delay(100).then(() => this.siteStore.windowApis.closeWindow());
  };

  private readonly handleCashierOnClick = async () => {
    if (!this.directPurchaseService) {
      this.createDirectPurchaseService();
    }

    //eslint-disable-next-line @typescript-eslint/await-thenable
    const shouldProceed = await this.validateProductSubmission();
    /* istanbul ignore next: todo(eran): this await is an hack until I fix this: https://wix.slack.com/archives/C68TQQSNM/p1595256383021500*/
    if (!shouldProceed) {
      this.nextProps({handleCashierOnClickResult: withChangeListener(false)});
      return;
    }

    const canCheckout = await this.cashierExpressService.handleCashierOnClick(
      this.product,
      this.directPurchaseService,
      this.userInputs
    );

    this.nextProps({handleCashierOnClickResult: withChangeListener(canCheckout)});
  };

  private readonly handleCashierPaymentSubmit = async (
    paymentInfo: PaymentAuthorizedArgs,
    accessibilityEnabled: boolean
  ) => {
    const result = await this.cashierExpressService.handleCashierPaymentSubmit(
      paymentInfo,
      accessibilityEnabled,
      this.product
    );
    if (result === 'shouldNavigateToCheckout') {
      const to: CheckoutStageWithCartParams = {
        accessibilityEnabled,
        cartId: this.volatileCartService.cartId,
        cashierPaymentId: paymentInfo.detailsId,
      };

      if (this.volatileCartService.checkoutId) {
        to.checkoutId = this.volatileCartService.checkoutId;
      }

      await this.directPurchaseService.handleCheckoutStageWithExistingCart(to);
      this.handleCashierPaymentSubmitResult = withChangeListener({result: 'success'});
      this.nextProps();
    } else if (result === 'success') {
      this.handleCashierPaymentSubmitResult = withChangeListener({result: 'success'});
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.cashierExpressService.onCashierExpressPaymentSuccess();
      this.nextProps();
    } else {
      this.handleCashierPaymentSubmitResult = withChangeListener({result: 'error'});
      this.nextProps();
    }
  };

  private readonly cashierExpressWidgetOnShippingMethodSelected = async (shippingMethod: ShippingMethod) => {
    const {paymentAmount, paymentBreakdown} = await this.cashierExpressService.onShippingMethodSelected(shippingMethod);
    this.nextProps({
      cashierExpressWidgetOnShippingMethodSelectedResult: withChangeListener({paymentAmount, paymentBreakdown}),
    });
  };

  private readonly fetchPaymentBreakdownForCashierAddress = async (
    shippingAddress: ShippingContactRestricted
  ): Promise<void> => {
    const breakdown = await this.cashierExpressService.fetchPaymentBreakdownForCashierAddress(
      shippingAddress,
      this.translations
    );
    this.fetchPaymentBreakdownForCashierAddressResult = withChangeListener(breakdown);
    this.nextProps();
  };

  private readonly handleBuyNow = async (accessibilityEnabled: boolean): Promise<void> => {
    const shouldProceed = this.validateProductSubmission();
    if (!shouldProceed) {
      return;
    }

    this.fedopsLogger.interactionStarted(productPageFedopsEvent.BuyNow);

    /* istanbul ignore else: todo(ariel): test else */
    if (!this.directPurchaseService) {
      this.createDirectPurchaseService();
    }

    return this.directPurchaseService.handleBuyNow(accessibilityEnabled, this.product, this.userInputs);
  };

  private readonly handleSubscribe = async (accessibilityEnabled: boolean): Promise<void> => {
    const shouldProceed = this.validateProductSubmission();
    if (!shouldProceed) {
      return;
    }

    this.fedopsLogger.interactionStarted(productPageFedopsEvent.Subscribe);

    /* istanbul ignore else: todo(ariel): test else */
    if (!this.directPurchaseService) {
      this.createDirectPurchaseService();
    }
    return this.directPurchaseService.handleSubscribe(accessibilityEnabled, this.product, this.userInputs);
  };

  private readonly handleAddToCart = async (): Promise<any> => {
    const validationObject = this.isInvalid(this.userInputs);
    const isNavigateCart =
      !this.styleParams.booleans.productPage_openMinicart || this.productService.shouldNavigateToCart();

    if (validationObject.isInvalid) {
      this.nextProps({
        isProductSubmitted: true,
        userInputErrors: validationObject.validations,
      });
      return;
    }

    this.fedopsLogger.interactionStarted(productPageFedopsEvent.AddToCart);

    const eventId = this.siteStore.pubSubManager.subscribe(
      'Minicart.DidClose',
      () => {
        this.setProps({
          //random so it will never be the same value
          shouldFocusAddToCartButton: Math.random(),
        });

        this.siteStore.pubSubManager.unsubscribe('Minicart.DidClose', eventId);
      },
      true
    );
    this.setProps({addedToCartStatus: ActionStatus.SUCCESSFUL});

    return this.productService.addToCart(
      this.product,
      this.userInputs,
      this.getAddToCartAction(),
      this.onAddToCartSuccess,
      this.selectedVariant,
      {
        isNavigateCart,
        navigationClick: this.getAddToCartActionName(),
      }
    );
  };

  private readonly onAddToCartSuccess = (): void => {
    this.fedopsLogger.interactionEnded(productPageFedopsEvent.AddToCart);
    this.fedopsLogger.flush();

    if (this.isQuickView) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.closeWixWindow();
    }
  };

  private readonly resetAddedToCartStatus = () => {
    this.setProps({addedToCartStatus: ActionStatus.IDLE});
  };

  private getHeaders() {
    return {
      Authorization: (this.siteStore.httpClient.getBaseHeaders() as any).Authorization,
    };
  }

  private readonly handleWishlistButtonClick = async () => {
    if (!this.siteStore.usersApi.currentUser.loggedIn) {
      await this.siteStore.usersApi.promptLogin({});
    }

    const wishlistActionPromise = this.productAddedToWishlist
      ? new WishlistActions(this.getHeaders()).removeProducts([this.product.id])
      : new WishlistActions(this.getHeaders()).addProducts([this.product.id]);
    this.toggleWishlistState();
    this.reportWishlistFedops(true);
    //eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.reportWishlistBI();
    await wishlistActionPromise
      .then(() => {
        this.reportWishlistFedops(false);
        //eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.reportWishlistSuccessfulOperationBI();
      })
      .catch(() => {
        this.toggleWishlistState();
      });
  };

  private toggleWishlistState() {
    this.productAddedToWishlist = !this.productAddedToWishlist;
    this.setProps({
      productWasAddedToWishlist: this.productAddedToWishlist,
      wishlistActionStatus: ActionStatus.SUCCESSFUL,
    });
  }

  private readonly resetWishlistStatus = () => {
    this.setProps({
      wishlistActionStatus: ActionStatus.IDLE,
    });
  };

  private getAddToCartAction() {
    let addToCartAction = AddToCartActionOption.MINI_CART;
    if (this.styleParams.numbers.productPage_addToCartAction !== undefined) {
      addToCartAction = this.styleParams.numbers.productPage_addToCartAction;
    } else if (!this.styleParams.booleans.productPage_openMinicart) {
      addToCartAction = AddToCartActionOption.NONE;
    }
    return addToCartAction;
  }

  private readonly notifyProductLoaded = () => {
    return this.siteStore.windowApis.trackEvent(
      'productPageLoaded' as any,
      {
        productId: this.product.id,
        name: this.product.name,
        currency: this.siteStore.currency,
        price: this.product.price,
        sku: this.product.sku,
      } as any
    );
  };

  private getAddToCartActionName(): string {
    if (!this.productService.shouldNavigateToCart() && this.getAddToCartAction() === AddToCartActionOption.TINY_CART) {
      return 'tiny-cart';
    } else if (
      !this.productService.shouldNavigateToCart() &&
      this.getAddToCartAction() === AddToCartActionOption.MINI_CART
    ) {
      return 'mini-cart';
    } else if (
      this.getAddToCartAction() === AddToCartActionOption.CART ||
      (this.productService.shouldNavigateToCart() && this.getAddToCartAction() !== AddToCartActionOption.NONE)
    ) {
      return 'cart';
    } else {
      return 'none';
    }
  }

  private reportButtonAction(buttonType: BiButtonActionType) {
    const eventData = {
      buttonType,
      appName: BI_APP_NAME,
      hasOptions: this.userInputs.selection.length > 0,
      productId: this.product.id,
      productType: this.product.productType as ProductType,
      origin: this.biOrigin,
      isNavigateCart: !this.styleParams.booleans.productPage_openMinicart || this.productService.shouldNavigateToCart(),
      navigationClick:
        buttonType === BiButtonActionType.BuyNow || buttonType === BiButtonActionType.Subscribe
          ? 'checkout'
          : /* istanbul ignore next */
            this.getAddToCartActionName(),
      quantity: Math.round(this.selectedQuantity),
    };

    return this.siteStore.biLogger.clickOnAddToCartSf(eventData);
  }

  private reportWishlistBI() {
    const eventData = this.createWishlistBiEventData();

    return this.productAddedToWishlist
      ? this.siteStore.biLogger.clickAddToWishlistSf(eventData)
      : this.siteStore.biLogger.clickRemoveFromWishlistSf(eventData);
  }

  private reportWishlistSuccessfulOperationBI() {
    const eventData = this.createWishlistBiEventData();

    return this.productAddedToWishlist
      ? this.siteStore.biLogger.productAddedToWishlistSf(eventData)
      : this.siteStore.biLogger.productRemovedFromWishlistSf(eventData);
  }

  private createWishlistBiEventData() {
    return {
      appName: BI_APP_NAME,
      hasOptions: this.product.options.length > 0,
      productId: this.product.id,
      productType: this.product.productType as ProductType,
      origin: this.biOrigin,
    };
  }

  private reportWishlistFedops(isInteractionStarted: boolean) {
    const interactionName = this.productAddedToWishlist
      ? productPageFedopsEvent.AddToWishlist
      : productPageFedopsEvent.RemoveFromWishlist;
    return isInteractionStarted
      ? this.fedopsLogger.interactionStarted(interactionName)
      : this.fedopsLogger.interactionEnded(interactionName);
  }

  private get trackParams() {
    return {
      appDefId: APP_DEFINITION_ID,
      category: 'All Products',
      origin: 'Stores',
      id: this.product.id,
      name: this.product.name,
      price: actualPrice(this.product, this.selectedVariant),
      currency: this.siteStore.currency,
      quantity: this.selectedQuantity,
      sku: actualSku(this.product, this.selectedVariant),
      type: this.product.productType,
      brand: this.product.brand,
    };
  }

  private trackViewContent() {
    return this.siteStore.windowApis.trackEvent(TrackEventName.VIEW_CONTENT, {
      ...this.trackParams,
      dimension3: this.product.isInStock ? 'in stock' : 'out of stock',
      quantity: undefined,
    });
  }

  private readonly isInvalid = (userInputs: UserInput): {isInvalid: boolean; validations: UserInputErrors} => {
    const validations = this.productService.validate(userInputs);

    const isInvalid = Object.keys(validations).reduce((accValidation: boolean, currentKey: string) => {
      const flag = validations[currentKey].some((value) => value === true);
      return accValidation || flag;
    }, false);

    return {isInvalid, validations};
  };

  private filterMedia(): void {
    const filteredMedia = _.flatMap(this.userInputs.selection, (item) => item?.linkedMediaItems || []);
    this.product.media = filteredMedia.length ? (filteredMedia as any) : this.media;
  }

  private getUrlWithoutParams(url: string): string {
    const parsedUrl = parseUrl(url);
    return `${parsedUrl.protocol}://${parsedUrl.host}${parsedUrl.path}`;
  }

  private async getCustomizedUrlSegments(): Promise<{key: string; segments: {[key: string]: string}} | undefined> {
    const currentUrl = this.getUrlWithoutParams(this.siteStore.location.url);
    return this.siteStore.siteApis.getCustomizedUrlSegments(currentUrl);
  }

  private isDefaultProductPageUrl(currentUrl: string, defaultUrl: string): boolean {
    const currentUrlArr = currentUrl.split('/');
    currentUrlArr.pop();
    const currentUrlWithoutLatPart = currentUrlArr.join('/');
    return currentUrlWithoutLatPart === defaultUrl;
  }

  private shouldGetBySlug(): boolean {
    const currentUrl = this.getUrlWithoutParams(this.siteStore.location.url);
    if (
      ((this.siteStore.isEditorMode() || this.siteStore.isPreviewMode()) && this.currentPath.length > 1) ||
      this.siteStore.isSiteMode()
    ) {
      if (this.isUrlWithOverrides && !this.isQuickView) {
        return !_.isEmpty(this.urlOverrideSegments) || this.isDefaultProductPageUrl(currentUrl, this.sectionUrl);
      } else {
        return currentUrl !== this.sectionUrl;
      }
    } else {
      return false;
    }
  }

  private isDefaultInSEO(): boolean {
    const currentUrl = this.getUrlWithoutParams(this.siteStore.location.url);

    if (this.siteStore.isSiteMode() && this.siteStore.seo.isInSEO()) {
      if (this.isUrlWithOverrides && !this.isQuickView) {
        return _.isEmpty(this.urlOverrideSegments);
      } else {
        return currentUrl === this.sectionUrl;
      }
    } else {
      return false;
    }
  }

  private async getInitialData(): Promise<{
    product: IProductDTO;
    appSettings: IAppSettings;
  }> {
    const shouldGetBySlug = this.shouldGetBySlug();
    if (this.isDefaultInSEO()) {
      return {product: null, appSettings: {}};
    }

    let catalog: GetProductBySlugQuery['catalog'] | GetFirstProductQuery['catalog'],
      appSettings: GetProductBySlugQuery['appSettings'];
    const key = `productPage_${this.siteStore.getCurrentCurrency()}_${shouldGetBySlug ? this.slug : 'default'}`;
    if (this.siteStore.windowApis.warmupData.get(key)) {
      ({catalog, appSettings} = this.siteStore.windowApis.warmupData.get(key));
    } else {
      ({catalog, appSettings} = await (shouldGetBySlug
        ? this.productService.getProductBySlug(this.slug, this.externalId)
        : this.productService.getDefaultProduct(this.externalId)));
      this.siteStore.windowApis.warmupData.set(key, {catalog, appSettings});
    }

    return {
      appSettings,
      product: shouldGetBySlug ? (catalog as any).product : (catalog as any).products.list[0],
    };
  }

  private getPrevNextProducts(): ProductPagePagination {
    return new NavigationService(
      this.siteStore,
      this.sectionUrl,
      this.navigationContext,
      this.product,
      this.customUrlApi,
      this.isUrlWithOverrides
    ).getPrevNextProducts();
  }

  private get getDirtySlug(): string {
    const {path} = this.siteStore.location;
    if (path.length === 1) {
      throw new Error(`invalid slug path: "${path.toString()}"`);
    }
    const dirtySlug = decodeURIComponent(path[path.length - 1]);
    return dirtySlug.split('?')[0];
  }

  private get slug() {
    if (!this.isQuickView && this.isUrlWithOverrides && !this.siteStore.experiments.enabled(SPECS.USE_LIGHTBOXES)) {
      return _.get(this.urlOverrideSegments, 'segments.slug') || this.getDirtySlug;
    } else if (this.siteStore.windowApis.lightbox.getContext()?.productSlug) {
      /* istanbul ignore next: */ return this.siteStore.windowApis.lightbox.getContext().productSlug;
    }

    return this.getDirtySlug;
  }

  private get remainingItemCount(): StockIndicatorCount {
    const itemCount = this.quantityRange.max;
    const threshold = 10;

    if (itemCount > 0 && itemCount < threshold) {
      return itemCount;
    }

    const productInStock = inStock(this.product, this.selectedVariant);
    if (!productInStock && this.backInStockStore.isBackInStockEnabled) {
      return 0;
    }

    return null;
  }

  private get quantityRange(): ProdudctQunatityRange {
    const qunatities = QuantityCalculator.getQuantitiesRange(
      this.product,
      this.userInputs.selection as IProductOptionSelection[]
    );
    return {max: qunatities[qunatities.length - 1], min: qunatities[0]};
  }

  private get selectedQuantity(): number {
    return this.userInputs.quantity[0];
  }

  private readonly setPageMetaData = (): void => {
    if (!this.siteStore.isSiteMode()) {
      return;
    }

    let seoData;

    try {
      seoData = JSON.parse((this.product as any).seoJson);
    } catch {
      //
    }

    const productWithPageUrl = {...this.product, pageUrl: this.productUrl};
    const itemData: ProductPageItemData = {
      product: new SeoProductBuilder(productWithPageUrl, {
        productPageBaseUrl: this.getUrlWithoutParams(this.siteStore.location.url),
      }).get(),
      legacySeoData: {
        title: this.product.seoTitle,
        description: this.product.seoDescription,
      },
    };

    this.siteStore.seo.renderSEOTags({
      itemType: 'STORES_PRODUCT',
      itemData,
      seoData,
    });
  };

  private toPagePath(page: StructurePage, transformName: boolean): PagePath {
    return {
      name: transformName ? capitalizeFirstLetters(page.name) : page.name,
      url: page.url && `${this.siteStore.location.baseUrl}${page.url}`,
      sdkLink: {pageId: page.id, type: 'PageLink'},
    };
  }

  private readonly getPagePath = async (): Promise<PagePath[]> => {
    const path = [];
    const siteStructure = await this.siteStore.siteApis.getSiteStructure({includePageId: true});

    const homepage = siteStructure.pages.find((p) => p.isHomePage);
    if (homepage) {
      path.push(this.toPagePath(homepage, true));
    }

    if (this.siteStore.isSSR()) {
      return path;
    }

    const referringPageId = this.navigationContext.pageId;
    if (referringPageId) {
      const refferingPage = siteStructure.pages.find((p) => {
        const notHomepage = !p.isHomePage;
        const notSelf = p.id !== this.siteStore.siteApis.currentPage.id;
        const matchRef = p.id === referringPageId;
        return notHomepage && notSelf && matchRef;
      });
      if (refferingPage) {
        path.push(this.toPagePath(refferingPage, true));
      }
    }

    if (path.length === 0) {
      return [];
    }
    if (this.product) {
      path.push(this.toPagePath({name: this.product.name, url: null, isHomePage: false, id: null}, false));
    }
    path[0].name = this.translations.BREADCRUMBS_HOME;
    path[0].url = this.siteStore.location.baseUrl;
    return path;
  };

  private getNavigationContext(): IStoreFrontNavigationContext {
    let context: IStoreFrontNavigationContext;
    try {
      context = JSON.parse(this.siteStore.storage.local.getItem(STORAGE_PAGINATION_KEY));
    } catch {
      //
    }
    return context || {pageId: undefined, paginationMap: []};
  }

  private get productUrl(): string {
    return this.isUrlWithOverrides
      ? this.customUrlApi.buildProductPageUrl({slug: this.product.urlPart})
      : `${this.sectionUrl}/${this.product.urlPart}`;
  }

  private get isQuickView(): boolean {
    const byLayout = this.styleParams.numbers.productPage_layoutId === LayoutId.QuickView;
    const byQuery = this.getQueryParam('layout') === 'quickview';

    return byLayout || byQuery;
  }

  public getSelectionById(id: number) {
    let selection = null;
    //eslint-disable-next-line
    this.product.options.some((option) => {
      selection = option.selections.find((item) => item.id === id);
      return selection;
    });
    return selection;
  }

  public get passedSelections(): IProductOptionSelection[] {
    let selectionIds = [];
    const variantId = this.getQueryParam('variantId');
    const rawSelectionIds = this.getQueryParam('selectionIds');

    if (variantId) {
      const productItem = this.product.productItems.find(({id}) => id === variantId);
      selectionIds = productItem.optionsSelections;
    } else if (rawSelectionIds) {
      selectionIds = decodeURIComponent(rawSelectionIds)
        .split(',')
        .map((id) => parseInt(id, 10));
    }

    return selectionIds.map((id) => this.getSelectionById(id));
  }

  public get passedQuantity(): number {
    return parseInt(this.getQueryParam('quantity') || '1', 10);
  }

  private getQueryParam(key: string): string | undefined {
    /* istanbul ignore else  */
    if (typeof location !== 'undefined') {
      const valueFromLocation = new URLSearchParams(location.search).get(key);

      if (valueFromLocation) {
        return valueFromLocation;
      }
    }

    return this.siteStore.location.query[key];
  }

  /* istanbul ignore next */
  public biLogger(event: BILoggerEvents, params: Record<string, any> = {}): void {
    (this.siteStore.biLogger[event] as Function).call(this.siteStore.biLogger, params);
  }

  private get biOrigin(): string {
    return this.isQuickView ? Origin.QUICK_VIEW : Origin.PRODUCT_PAGE;
  }

  private get layoutId(): LayoutId {
    return this.isQuickView ? LayoutId.QuickView : this.styleParams.numbers.productPage_layoutId;
  }

  private get selectedVariant() {
    return this.productService.options.selectedVariant;
  }

  private get addToCartState(): AddToCartState {
    return this.addToCartService.getButtonState({
      price: actualPrice(this.product, this.selectedVariant),
      inStock: inStock(this.product, this.selectedVariant),
    });
  }

  private handleEmptyState() {
    if (this.siteStore.seo.isInSEO()) {
      this.siteStore.seo.setSeoStatusCode(404);
    }
    this.setProps({
      ...this.defaultProps,
      product: null,
      layoutId: LayoutId.EmptyState,
    });

    if (this.siteStore.isSSR()) {
      this.fedopsLogger.appLoaded();
    }
  }

  private get selectedPlan() {
    return this.userInputs.subscriptionPlan[0];
  }

  private get currentPrice(): CurrentPrice {
    return new ProductPriceService({
      product: this.product,
      selectedVariant: this.selectedVariant,
      selectedPlan: this.selectedPlan,
      shouldRenderPriceRange: this.shouldRenderPriceRange,
    }).getCurrentPricing(this.userInputs);
  }

  private sendClickOnProductOptionBiEvent(
    selectionItem: IProductOptionSelectionItem,
    prevSelectionItem: IProductOptionSelectionItem
  ) {
    const action = selectionItem ? BI_PRODUCT_OPTION_ACTION.CHECKED : BI_PRODUCT_OPTION_ACTION.UNCHECKED;

    const selectionId = selectionItem?.id ?? prevSelectionItem.id;

    const optionType = this.product.options.find(({selections}) =>
      selections.map(({id}) => id).includes(selectionId)
    ).optionType;

    const optiontype = (
      {
        [ProductOptionType.DROP_DOWN]: BI_PRODUCT_OPTION_TYPE.LIST,
        [ProductOptionType.COLOR]: BI_PRODUCT_OPTION_TYPE.COLOR,
      } as const
    )[optionType];

    const {productType} = this.product;

    const isVariantInStock = inStock(this.product, this.productService.options.selectedVariant);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.siteStore.biLogger.clickOnProductOptionSf({
      action,
      appName: BI_APP_NAME,
      productId: this.product.id,
      optiontype,
      productType,
      origin: this.biOrigin,
      viewMode: this.siteStore.biStorefrontViewMode,
      inStock: isVariantInStock,
      hasNotifyMe: this.backInStockStore.isBackInStockEnabled,
      hasStockIndicator: this.siteStore.experiments.enabled(SPECS.SHOW_STOCK_INDICATOR)
        ? this.styleParams.booleans.productPage_stockIndicator
        : undefined,
      remainingItemCount:
        this.siteStore.experiments.enabled(SPECS.SHOW_STOCK_INDICATOR) && this.remainingItemCount > 0
          ? this.remainingItemCount
          : undefined,
    });
  }

  private get shouldShowProductPaymentBreakdown() {
    return (
      !this.siteStore.location.baseUrl.includes('//localhost') &&
      this.subscriptionService.isBreakableToPaymentOptions(this.userInputs) &&
      this.styleParams.booleans.productPage_paymentOptionsBreakdown
    );
  }

  private get breakdownParams(): IBreakdownParams {
    const {productPage_paymentOptionsBreakdownTheme} = this.styleParams.numbers;
    /* istanbul ignore next */
    return {
      meta: {
        appDefId: APP_DEFINITION_ID,
        appInstanceId: this.siteStore.storeId,
        appInstance: this.siteStore.instanceManager.getInstance(),
        productId: this.product.id,
        msid: this.siteStore.storeId,
        host: this.siteStore.location.baseUrl,
        visitorId: this.siteStore.uuid as string,
      },
      amount: String(actualPrice(this.product, this.selectedVariant) * this.selectedQuantity),
      currency: this.siteStore.getCurrentCurrency(),
      demoMode: this.siteStore.isEditorMode() || this.siteStore.isPreviewMode(),
      deviceType: this.siteStore.isMobile() ? 'mobile' : 'desktop',
      isSSR: this.siteStore.isSSR(),
      locale: this.siteStore.locale,
      theme:
        productPage_paymentOptionsBreakdownTheme === PaymentOptionsBreakdownTheme.DARK
          ? PaymentOptionsBreakdownThemeValue.DARK
          : PaymentOptionsBreakdownThemeValue.LIGHT,
    };
  }

  private get variantInfo() {
    return {
      selectionsAvailability: calcSelectionsAvailability({
        product: this.product,
        variantSelectionIds: this.userInputs[UserInputType.Selection].filter(Boolean).map(({id}) => id),
      }),
    };
  }

  private getHtmlTags() {
    const defaultInfoSectionTitleHtmlTag =
      this.styleParams.numbers.productPage_infoSectionTypeId === InfoSectionLayoutId.Tabs
        ? HeadingTags.P
        : HeadingTags.H2;
    return {
      infoSectionTitleHtmlTag:
        this.mergedPublicData.productPage_infoSectionTitleHtmlTag || defaultInfoSectionTitleHtmlTag,
    };
  }

  private get shouldShowUserInputs(): boolean {
    return this.backInStockStore.isBackInStockEnabled || inStock(this.product);
  }

  private get biProductInventoryStatus(): BiInventoryStatus {
    const isInStock = inStock(this.product);

    const hasVariantOutOfStock = (this.product as IProduct).productItems.some(
      (item) => !inStock(this.product, item as IOptionSelectionVariant)
    );

    if (!isInStock) {
      return BiInventoryStatus.OUT_OF_STOCK;
    }

    return hasVariantOutOfStock ? BiInventoryStatus.PARTIALLY : BiInventoryStatus.IN_STOCK;
  }
}
