import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {
  GetProductByIdQuery,
  GetProductByIdQueryVariables,
  GetProductsQuery,
  GetProductsQueryVariables,
} from '../graphql/queries-schema';
import {Topology} from '@wix/wixstores-client-core/dist/es/src/constants';
import {query as getProductsByIdQuery} from '../graphql/getProductById.graphql';
import {query as getProductsQuery} from '../graphql/getProducts.graphql';
import {graphQlOperations} from '../constants';

export class ProductApi {
  constructor(private readonly siteStore: SiteStore) {}

  public async getProductById(
    externalId: string,
    productId: string
  ): Promise<{
    data: GetProductByIdQuery;
  }> {
    externalId = externalId || '';
    const productByIdQueryVariables: GetProductByIdQueryVariables = {
      externalId,
      productId,
    };
    const data: any = {
      query: getProductsByIdQuery,
      source: 'WixStoresWebClient',
      variables: productByIdQueryVariables,
      operationName: graphQlOperations.GetProductById,
    };

    return this.siteStore.tryGetGqlAndFallbackToPost(
      this.siteStore.resolveAbsoluteUrl(`/${Topology.STOREFRONT_GRAPHQL_URL}`),
      data
    );
  }

  public async getDefaultProduct(externalId: string): Promise<{
    data: GetProductsQuery;
  }> {
    externalId = externalId || '';
    const productsQueryVariables: GetProductsQueryVariables = {
      limit: 1,
      sort: {sortField: 'CreationDate', direction: 'Descending'},
      filters: null,
      externalId,
    };

    const data: any = {
      query: getProductsQuery,
      source: 'WixStoresWebClient',
      variables: productsQueryVariables,
      operationName: graphQlOperations.GetProducts,
    };

    return this.siteStore.tryGetGqlAndFallbackToPost(
      this.siteStore.resolveAbsoluteUrl(`/${Topology.STOREFRONT_GRAPHQL_URL}`),
      data
    );
  }
}
