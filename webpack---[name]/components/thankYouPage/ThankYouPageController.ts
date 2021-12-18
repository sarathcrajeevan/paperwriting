import {IWidgetControllerConfig} from '@wix/wixstores-client-storefront-sdk/dist/es/src/types/native-types';
import {ThankYouPageStore} from '../../domain/stores/ThankYouPageStore';
import {BaseController} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/controller-factory/BaseController';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {ControllerParams} from 'yoshi-flow-editor-runtime';
import {ShippingService} from '../../domain/services/ShippingService';
import {NavigationService} from '../../domain/services/NavigationService';
import {NavigationStore} from '../../domain/stores/NavigationStore';
import {BIService} from '../../domain/services/BIService';
import {OrderService} from '../../domain/services/OrderService';
import {wixcodePublicApi} from './WixCode/wixcodePublicApi';
import {TrackEventService} from '../../domain/services/TrackEventService';
import {AddressTranslationService} from '../../domain/services/AddressTranslationService';
import {PaymentsService} from '../../domain/services/PaymentsService';
import {CartService} from '../../domain/services/CartService';
import {CheckoutService} from '../../domain/services/CheckoutService';

export class ThankYouPageController extends BaseController {
  protected readonly setProps: IWidgetControllerConfig['setProps'];
  protected readonly thankYouPageStore: ThankYouPageStore;
  protected readonly navigationStore: NavigationStore;
  protected readonly orderService: OrderService;
  protected readonly cartService: CartService;
  protected readonly checkoutService: CheckoutService;
  protected readonly biService: BIService;
  protected readonly trackEventService: TrackEventService;
  protected readonly navigationService: NavigationService;

  constructor(controllerParams: ControllerParams) {
    super(controllerParams);
    const flowAPI = controllerParams.flowAPI;
    const siteStore: SiteStore = controllerParams.appData.context.siteStore;
    const addressTranslationService = new AddressTranslationService({siteStore});
    const paymentsService = new PaymentsService({siteStore});
    const orderService = new OrderService({siteStore, addressTranslationService});
    const shippingService = new ShippingService({flowAPI, orderService});
    const biService = new BIService({siteStore});
    const navigationService = new NavigationService({flowAPI, siteStore, biService, orderService});
    const trackEventService = new TrackEventService({siteStore, orderService});

    this.navigationStore = new NavigationStore({navigationService});
    this.thankYouPageStore = new ThankYouPageStore({
      biService,
      shippingService,
      orderService,
      paymentsService,
      siteStore,
    });

    this.orderService = orderService;
    this.biService = biService;
    this.trackEventService = trackEventService;
    this.cartService = new CartService({siteStore});
    this.checkoutService = new CheckoutService({siteStore});
    this.navigationService = navigationService;
  }

  public readonly load = async () => {
    try {
      await this.orderService.fetchOrder();
    } catch (e) {
      /* istanbul ignore else: todo: test */
      if (this.siteStore.isSSR() && e.message.includes('PERMISSION_DENIED')) {
        return this.setProps({ssrError: true});
      }
      throw e;
    }

    void this.checkoutService.markCheckoutAsCompleted(this.orderService.checkoutId);
    void this.cartService.removeCart(this.orderService.cartId);
    void this.reportOnLoad();

    this.setProps({
      thankYouPageStore: await this.thankYouPageStore.toProps(),
      navigationStore: await this.navigationStore.toProps(),
    });
  };

  public readonly init = () => this.load();

  public readonly onStyleUpdate = (styleParams: {}): void => {
    return void styleParams;
  };

  /* istanbul ignore next */
  public readonly exports = () => {
    return wixcodePublicApi({siteStore: this.siteStore});
  };

  public getFreeTexts = (): string[] => [];

  private reportOnLoad() {
    if (this.siteStore.isSSR()) {
      return;
    }

    this.trackEventService.trackPurchase(this.orderService.trackPurchaseParams);
    this.biService.thankYouPageLoadSf({
      orderId: this.orderService.orderGuid,
      cartId: this.orderService.cartId,
      shippingMethodType: this.orderService.deliveryType || '',
      paymentMethodType: this.orderService.isOfflinePayment ? 'offline' : 'online',
      cartType: this.orderService.cartType,
      paymentStatus: this.orderService.paymentStatus,
      paymentProvider: this.orderService.paymentMethod,
    });
  }
}
