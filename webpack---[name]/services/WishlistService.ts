import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {WishlistApi} from '../api/WishlistApi';
import {IAppSettings, IProduct} from '../types/app-types';
import {WishlistActions} from '@wix/wixstores-client-storefront-sdk/dist/es/src/actions/WishlistActions/WishlistActions';
import md5 from 'md5';
import {GalleryViewMode} from '../constants';
import {aDemoProduct} from './aDemoProduct';

interface IGetProducts {
  limit: number;
  offset: number;
  productsPerPage: number;
  viewMode: GalleryViewMode;
}

export class WishlistService {
  private products?: IProduct[];
  private readonly api: WishlistApi;
  private fetches: number = 0;
  private totalProducts: number = 1;

  constructor(private readonly siteStore: SiteStore, private readonly externalId: string) {
    this.api = new WishlistApi(this.siteStore);
  }

  private getHeaders() {
    return {
      Authorization: (this.siteStore.httpClient.getBaseHeaders() as any).Authorization,
    };
  }

  public isLoaded(): boolean {
    return !!this.products;
  }

  public async getProducts({limit, offset, viewMode, productsPerPage}: IGetProducts): Promise<IProduct[]> {
    await this.fetchProducts({limit, offset, viewMode, productsPerPage});
    this.fetches++;
    return this.products;
  }

  public async removeProduct(productId: string): Promise<void> {
    await new WishlistActions(this.getHeaders()).removeProducts([productId]);
  }

  public async getAppSettings(): Promise<IAppSettings> {
    return this.api.fetchAppSettings(this.externalId);
  }

  public signature(): string {
    return md5(String(this.fetches) + JSON.stringify(this.products));
  }

  public getTotalProducts(): number {
    return this.totalProducts;
  }

  private async fetchProducts({limit, offset, viewMode, productsPerPage}: IGetProducts) {
    if (viewMode === GalleryViewMode.LIVE_SITE) {
      const {products, totalCount} = await this.api.fetchProducts(limit, offset);
      this.products = products;
      this.totalProducts = totalCount;
    } else {
      const demoProductsCount = viewMode === GalleryViewMode.EDITOR_DEMO_STATE ? productsPerPage : 0;
      this.products = [...Array(demoProductsCount)].map((_, i) => aDemoProduct(i));
      this.totalProducts = this.products.length;
    }
  }
}
