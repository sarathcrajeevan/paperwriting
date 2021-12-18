import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {BI_ORIGIN} from '../../components/thankYouPage/constants';
import {CheckoutApi} from '@wix/wixstores-client-storefront-sdk/dist/es/src/apis/CheckoutApi/CheckoutApi';

export class CheckoutService {
  private readonly checkoutApi: CheckoutApi;
  private readonly siteStore: SiteStore;

  constructor({siteStore}: {siteStore: SiteStore}) {
    this.checkoutApi = new CheckoutApi({siteStore, origin: BI_ORIGIN});
    this.siteStore = siteStore;
  }

  public async markCheckoutAsCompleted(checkoutId: string): Promise<void> {
    if (this.siteStore.isEditorMode() || this.siteStore.isPreviewMode() || !checkoutId) {
      return;
    }

    await this.checkoutApi.markCheckoutAsCompleted({id: checkoutId});
  }
}
