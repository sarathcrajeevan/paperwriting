import {BIService} from '../../domain/services/BIService';
import {CartStore} from '../../domain/stores/CartStore';
import {CashierExpressStore} from '../../domain/stores/CashierExpressStore';
import {ORIGIN} from './constants';
import {ICartControllerApi, ICartStyleSettings, IControllerProps} from '../../types/app.types';
import {NavigationStore} from '../../domain/stores/NavigationStore';
import {OrderStore} from '../../domain/stores/OrderStore';
import {ControllerParams} from 'yoshi-flow-editor-runtime';
import {NavigationService} from '../../domain/services/NavigationService';
import {StyleSettingsService} from '../../domain/services/StyleSettingsService';
import {CartService} from '../../domain/services/CartService';
import {ProductsService} from '../../domain/services/ProductsService';
import {OrderService} from '../../domain/services/OrderService';
import {CheckoutNavigationService} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/CheckoutNavigationService/CheckoutNavigationService';
import {MultilingualService} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/MultilingualService/MultilingualService';
import {StoreMetaDataService} from '../../domain/services/StoreMetaDataService';
import {withResultObservation} from '../../hooks/useFunctionResultObservation.worker';
import {getCartSettingsFromStyles} from './getCartSettingsFromStyles';
import {BaseController} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/controller-factory/BaseController';
import {getFreeTextKeys} from './settingsParams';
import {StoreSettingsService} from '../../domain/services/StoreSettingsService';
import {wixcodePublicApi} from './WixCode/wixcodePublicApi';
import {ModalManagerService} from '../../domain/services/ModalManagerService';
import {MinimumOrderAmountService} from '../../domain/services/MinimumOrderAmountService';

export class CartController extends BaseController {
  private readonly services = {} as {
    biService: BIService;
    storeSettingsService: StoreSettingsService;
    cartService: CartService;
    navigationService: NavigationService;
    modalManagerService: ModalManagerService;
    orderService: OrderService;
    productsService: ProductsService;
    styleSettingsService: StyleSettingsService;
    checkoutNavigationService: CheckoutNavigationService;
    multilingualService: MultilingualService;
    storeMetaDataService: StoreMetaDataService;
    minimumOrderAmountService: MinimumOrderAmountService;
  };
  private stores = {} as {
    navigation: NavigationStore;
    cart: CartStore;
    order: OrderStore;
    cashierExpress: CashierExpressStore;
  };

  constructor(controllerParams: ControllerParams) {
    super(controllerParams);

    const styleWithDefaults = getCartSettingsFromStyles(
      controllerParams.controllerConfig.config.style.styleParams as unknown as ICartStyleSettings
    );

    this.subscribeToChanges();
    this.setServices(styleWithDefaults, controllerParams);
    this.setStores();
  }

  private readonly updateComponent = async () => {
    this.setProps({
      cartStore: await this.stores.cart.toProps(),
      cashierExpressStore: this.stores.cashierExpress.toProps(),
      navigationStore: await this.stores.navigation.toProps(),
      orderStore: this.stores.order.toProps(),
      isLoading: false,
      isResponsive: this.services.styleSettingsService.isEditorX,
    } as IControllerProps);
  };

  private get controllerApi(): ICartControllerApi {
    return {
      load: this.load,
      executeWithLoader: this.executeWithLoader,
      updateComponent: this.updateComponent,
      reportFedopsInteraction: this.reportFedopsInteraction,
      t: this.t,
    };
  }

  public readonly load = async (): Promise<void> => {
    this.setProps({isLoading: true});

    await this.services.cartService.fetchCart().then(this.updateComponent);
  };

  private readonly warmup = async () => {
    await Promise.all([this.services.cartService.fetchCart(), this.services.storeSettingsService.fetch()]);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.sendCartLoadedBi();
    await this.updateComponent();
  };

  public readonly init = async (): Promise<void> => {
    return this.warmup();
  };

  public getFreeTexts(): string[] {
    return getFreeTextKeys();
  }

  private async sendCartLoadedBi() {
    return this.services.biService.viewCartPageSf({
      cart: this.services.cartService.cart,
      cartType: this.services.cartService.cartType,
      isEligibleForCheckoutInViewer: await this.services.checkoutNavigationService.isEligibleForCheckoutInViewer(),
      paymentMethods: (await this.services.storeMetaDataService.get()).activePaymentMethods || [],
      numOfVisibleShippingOptions: Math.min(this.services.orderService.shippingRuleOptions.length, 2),
      shouldShowCoupon: this.siteStore.experiments.enabled('specs.stores.UseShowCouponStyleParam')
        ? this.services.styleSettingsService.shouldShowCoupon
        : true,
      shouldShowBuyerNote: this.services.styleSettingsService.shouldShowBuyerNote,
      shouldShowContinueShopping: this.services.styleSettingsService.shouldRenderContinueShopping,
      shouldShowShipping: this.services.styleSettingsService.shouldShowShipping,
      shouldShowTax: this.services.styleSettingsService.shouldShowTax,
      hasPickupOption: this.services.orderService.hasPickupOption,
    });
  }

  private readonly executeWithLoader = async (fn: Function) => {
    this.setProps({isLoading: true});
    try {
      await fn();
      await this.load();
    } finally {
      this.setProps({isLoading: false});
    }
  };

  public readonly onStyleUpdate = async (styleParams: {}): Promise<void> => {
    this.services.styleSettingsService.update(getCartSettingsFromStyles(styleParams as unknown as ICartStyleSettings));
    await this.updateComponent();
  };

  private subscribeToChanges() {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.platformAPIs.pubSub.subscribe('Cart.Changed', this.load, false);
  }

  private setServices(styleSettings: ICartStyleSettings, controllerParams: ControllerParams) {
    this.services.modalManagerService = new ModalManagerService({siteStore: this.siteStore}, controllerParams);
    this.services.styleSettingsService = new StyleSettingsService(styleSettings);
    this.services.biService = new BIService({siteStore: this.siteStore});
    this.services.storeSettingsService = new StoreSettingsService({siteStore: this.siteStore});
    this.services.cartService = new CartService({
      controllerApi: this.controllerApi,
      siteStore: this.siteStore,
      biService: this.services.biService,
      styleSettingsService: this.services.styleSettingsService,
    });
    this.services.productsService = new ProductsService({siteStore: this.siteStore});
    this.services.orderService = new OrderService({
      cartService: this.services.cartService,
      styleSettingsService: this.services.styleSettingsService,
      storeSettingsService: this.services.storeSettingsService,
    });
    this.services.minimumOrderAmountService = new MinimumOrderAmountService({
      orderService: this.services.orderService,
      styleSettingsService: this.services.styleSettingsService,
    });

    const mergedPublicData = {...this.publicData.APP, ...this.publicData.COMPONENT};
    this.services.multilingualService = new MultilingualService(
      this.siteStore,
      mergedPublicData,
      {} // todo: fetch appSettings and pass here
    );

    this.services.storeMetaDataService = new StoreMetaDataService({siteStore: this.siteStore});
    this.services.checkoutNavigationService = new CheckoutNavigationService({
      siteStore: this.siteStore,
      origin: ORIGIN,
    });
    this.services.navigationService = new NavigationService({
      siteStore: this.siteStore,
      biService: this.services.biService,
      cartService: this.services.cartService,
      publicData: this.publicData,
      controllerApi: this.controllerApi,
      modalManagerService: this.services.modalManagerService,
    });
  }

  private setStores() {
    this.stores.cart = new CartStore(this.controllerApi, this.siteStore, this.services);
    this.stores.order = new OrderStore(this.controllerApi, this.siteStore, this.services);
    this.stores.navigation = new NavigationStore(this.siteStore, this.services, withResultObservation(this.setProps));
    this.stores.cashierExpress = new CashierExpressStore(
      this.siteStore,
      this.services,
      this.services.styleSettingsService,
      withResultObservation(this.setProps)
    );
  }

  public exports() {
    return wixcodePublicApi();
  }
}
