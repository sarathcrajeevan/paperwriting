/* eslint-disable @typescript-eslint/no-floating-promises */
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {CartType} from '@wix/wixstores-client-core/dist/es/src/types/cart';

export class BIService {
  private readonly siteStore: SiteStore;

  constructor({siteStore}: {siteStore: SiteStore}) {
    this.siteStore = siteStore;
  }

  public thankYouPageContinueShoppingClickedSf(orderId: string): void {
    this.siteStore.biLogger.thankYouPageContinueShoppingClickedSf({orderId});
  }

  public thankYouPageDownloadFileClickedSf(orderId: string): void {
    this.siteStore.biLogger.thankYouPageDownloadFileClickedSf({orderId});
  }

  public thankYouPageLoadSf({
    orderId,
    cartId,
    shippingMethodType,
    paymentMethodType,
    cartType,
    paymentStatus,
    paymentProvider,
  }: {
    orderId: string;
    cartId: string;
    shippingMethodType: string;
    paymentMethodType: string;
    cartType: CartType;
    paymentStatus: string;
    paymentProvider: string;
  }): void {
    let originForBI;
    const appSectionParams = this.siteStore.location.query.appSectionParams;
    if (appSectionParams) {
      originForBI =
        JSON.parse(appSectionParams).origin === 'cart-cashier' ? 'cart directly to paypal fast flow' : undefined;

      // istanbul ignore if: this will be merged soon
      if (this.siteStore.experiments.enabled('specs.stores.ExpressCashierBiFix')) {
        originForBI = JSON.parse(appSectionParams).origin;
      }
    }

    this.siteStore.biLogger.thankYouPageLoadSf({
      orderId,
      cartId,
      shippingMethodType,
      paymentMethodType,
      cartType,
      paymentProvider,
      payment_status: paymentStatus,
      viewMode: this.siteStore.viewMode,
      origin: originForBI,
    });
  }
}
