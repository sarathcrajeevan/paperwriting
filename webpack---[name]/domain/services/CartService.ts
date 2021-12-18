import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {BI_ORIGIN} from '../../components/thankYouPage/constants';
import {CartApi} from '@wix/wixstores-client-storefront-sdk/dist/es/src/apis/CartApi/CartApi';

export class CartService {
  private readonly cartApi: CartApi;
  private readonly siteStore: SiteStore;

  constructor({siteStore}: {siteStore: SiteStore}) {
    this.cartApi = new CartApi({siteStore, origin: BI_ORIGIN});
    this.siteStore = siteStore;
  }

  public async removeCart(cartId: string): Promise<void> {
    if (this.siteStore.isEditorMode() || this.siteStore.isPreviewMode() || !cartId) {
      return;
    }

    await this.cartApi.deleteCart({cartId});
  }
}
