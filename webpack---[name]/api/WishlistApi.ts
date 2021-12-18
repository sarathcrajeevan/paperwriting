import {query as getWishlist} from '../graphql/getWishlist.graphql';
import {query as getAppSettings} from '../graphql/getAppSettings.graphql';
import {GQLOperations} from '../constants';
import {Topology} from '@wix/wixstores-client-core/dist/es/src/constants';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {
  GetWishlistQueryVariables,
  GetWishlistQuery,
  GetAppSettingsQuery,
  GetAppSettingsQueryVariables,
} from '../graphql/queries-schema';
import {IHttpResponse} from '@wix/wixstores-client-core/dist/es/src/http/http';
import {IAppSettings, IProduct} from '../types/app-types';

export class WishlistApi {
  constructor(private readonly siteStore: SiteStore) {}

  public async fetchProducts(limit: number, offset: number): Promise<{totalCount: number; products: IProduct[]}> {
    const variables: GetWishlistQueryVariables = {
      limit,
      offset,
    };

    const data = {
      query: getWishlist,
      source: 'WixStoresWebClient',
      variables,
      operationName: GQLOperations.GetWishlist,
    };

    const response: IHttpResponse = await this.siteStore.httpClient.post(
      this.siteStore.resolveAbsoluteUrl(`/${Topology.READ_WRITE_GRAPHQL_URL}`),
      data
    );
    const responseData: GetWishlistQuery = response.data;

    return {
      products: responseData.wishlist.items.map((item) => item.product),
      totalCount: responseData.wishlist.totalCount,
    };
  }

  public async fetchAppSettings(externalId: string): Promise<IAppSettings> {
    externalId = externalId || '';
    const variables: GetAppSettingsQueryVariables = {
      externalId,
    };

    const data = {
      query: getAppSettings,
      source: 'WixStoresWebClient',
      variables,
      operationName: GQLOperations.GetAppSettings,
    };

    const response: IHttpResponse = await this.siteStore.httpClient.post(
      this.siteStore.resolveAbsoluteUrl(`/${Topology.STOREFRONT_GRAPHQL_URL}`),
      data
    );
    const responseData: GetAppSettingsQuery = response.data;

    return responseData.appSettings;
  }
}
