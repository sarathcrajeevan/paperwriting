import {ShippingService} from '../services/ShippingService';
import {OrderService} from '../services/OrderService';
import {BIService} from '../services/BIService';
import {DeliveryType, ProductType, Specs} from '../../components/thankYouPage/constants';
import {PaymentsService} from '../services/PaymentsService';
import {PaymentStatus} from '../../types/app.types';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';

export type IThankYouPageStoreConfig = {
  biService: BIService;
  shippingService: ShippingService;
  orderService: OrderService;
  paymentsService: PaymentsService;
  siteStore: SiteStore;
};

export class ThankYouPageStore {
  private readonly biService: BIService;
  private readonly shippingService: ShippingService;
  private readonly orderService: OrderService;
  private readonly paymentsService: PaymentsService;
  private readonly siteStore: SiteStore;

  constructor({biService, shippingService, orderService, paymentsService, siteStore}: IThankYouPageStoreConfig) {
    this.biService = biService;
    this.shippingService = shippingService;
    this.orderService = orderService;
    this.paymentsService = paymentsService;
    this.siteStore = siteStore;
  }

  private get shouldShowDigitalLinksError() {
    return (
      this.orderService.hasProductsWithType(ProductType.Digital) &&
      this.orderService.hasMissingDigitalLinks() &&
      this.orderService.paymentStatus === PaymentStatus.Paid
    );
  }

  private readonly shouldEnableNewTyp = () => {
    return this.siteStore.experiments.enabled(Specs.EnableNewTyp);
  };

  private get digitalItems() {
    return this.orderService.getProductsWithType(ProductType.Digital);
  }

  private readonly reportDigitalItemDownloadClickBi = () => {
    return this.biService.thankYouPageDownloadFileClickedSf(this.orderService.orderGuid);
  };

  private readonly getOfflineInstruction = async () => {
    return this.orderService.isOfflinePayment ? await this.paymentsService.fetchOfflineInstruction() : null;
  };

  private readonly shouldShowDigitalItems = () => {
    return (
      this.orderService.paymentStatus === PaymentStatus.Paid &&
      this.orderService.hasProductsWithType(ProductType.Digital) &&
      !this.orderService.isOfflinePayment &&
      !this.orderService.hasMissingDigitalLinks()
    );
  };

  public async toProps() {
    return {
      buyerName: this.orderService.buyerName,
      digitalItems: this.digitalItems,
      shouldEnableNewTyp: this.shouldEnableNewTyp(),
      formattedTotalPrice: this.orderService.formattedTotalPrice,
      shouldShowDigitalItems: this.shouldShowDigitalItems(),
      isSubscription: this.orderService.isSubscription,
      isValidOrder: this.orderService.isValidOrder,
      items: this.orderService.items,
      address: this.orderService.shippingAddress,
      billingAddress: this.orderService.billingAddress,
      offlineInstruction: await this.getOfflineInstruction(),
      orderId: this.orderService.orderId,
      reportDigitalItemDownloadClickBi: this.reportDigitalItemDownloadClickBi,
      shippingAddress: this.shippingService.getShippingAddress(),
      shouldShowDigitalLinksError: this.shouldShowDigitalLinksError,
      shouldShowOfflinePayments: this.orderService.isValidOrder && this.orderService.isOfflinePayment,
      shouldShowShipping: this.orderService.isValidOrder && this.shippingService.shouldShowShipping(),
      shouldShowStorePickup: this.orderService.storePickup && this.orderService.deliveryType === DeliveryType.PICKUP,
      storePickup: this.orderService.storePickup,
      subscriptionDuration: this.orderService.subscriptionDuration,
      subscriptionFrequency: this.orderService.subscriptionFrequency,
      subscriptionName: this.orderService.subscriptionName,
    };
  }
}
