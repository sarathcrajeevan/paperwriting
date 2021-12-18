import {PageMap} from '@wix/wixstores-client-core/dist/es/src/constants';
import {CustomUrlApi} from '@wix/wixstores-client-storefront-sdk/dist/es/src/utils/CustomUrl/CustomUrlApi';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {ICart, ICartProductsManifest} from '../../types/app.types';

export class ProductsService {
  private readonly siteStore: SiteStore;
  private readonly customUrlApi: CustomUrlApi;

  constructor({siteStore}: {siteStore: SiteStore}) {
    this.siteStore = siteStore;
    this.customUrlApi = new CustomUrlApi(siteStore.location.buildCustomizedUrl);
  }

  private readonly getHref = (slug: string, useCustomUrl: boolean, sectionUrl: string) => {
    return useCustomUrl ? this.customUrlApi.buildProductPageUrl({slug}) : `${sectionUrl}/${slug}`;
  };

  public async manifest(cart: ICart): Promise<ICartProductsManifest> {
    const [useCustomUrl, section] = await Promise.all([
      this.customUrlApi.init(),
      this.siteStore.getSectionUrl(PageMap.PRODUCT),
    ]);

    return cart.items.reduce<ICartProductsManifest>(
      (acc, item) => ({
        ...acc,
        [item.product.id]: {href: this.getHref(item.product.urlPart, useCustomUrl, section.url)},
      }),
      {}
    );
  }
}
