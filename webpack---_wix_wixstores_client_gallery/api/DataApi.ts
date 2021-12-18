/* eslint-disable import/no-cycle, @typescript-eslint/tslint/config */
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {
  GetCategoryProductsQuery,
  GetCategoryProductsQueryVariables,
  GetDataQuery,
  GetFilteredProductsQuery,
  GetFilteredProductsQueryVariables,
  ProductFilters,
  GetRelatedItemsQuery,
} from '../graphql/queries-schema';
import {Topology} from '@wix/wixstores-client-core/dist/es/src/constants';
import {IGetInitialData, IOldGetInitialData, ISorting} from '../types/galleryTypes';
import {query as oldGetDataQueryString} from '../graphql/oldGetData.graphql';
import {query as getDataQueryString} from '../graphql/getData.graphql';
import {query as getCategoryProductsQueryString} from '../graphql/getCategoryProducts.graphql';
import {query as getFilteredProductsQueryString} from '../graphql/getFilteredProducts.graphql';
import {query as GetRelatedItemsQueryString} from '../graphql/getRelatedItems.graphql';
import {query as getDataNewQueryString} from '../graphql/getDataNew.graphql';
import _ from 'lodash';
import {ProductSortField, SortDirection} from '@wix/wixstores-graphql-schema';
import {MAX_PRODUCTS, Experiments} from '../constants';

export interface GetProductsResponse {
  list: GetFilteredProductsQuery['catalog']['category']['productsWithMetaData']['list'];
  totalCount: number;
}

export interface GetProductsRequest {
  collectionId: string;
  offset: number;
  limit: number;
  withOptions: boolean;
  withPriceRange: boolean;
  filters?: ProductFilters;
  sorting?: ISorting;
}

export class DataApi {
  constructor(private readonly siteStore: SiteStore) {
    //
  }

  public oldGetInitialData({externalId, compId, limit, withPriceRange}: IOldGetInitialData): Promise<{
    data: GetDataQuery;
  }> {
    const data: any = {
      query: oldGetDataQueryString,
      source: 'WixStoresWebClient',
      operationName: 'oldGetData',
      variables: {externalId: externalId || '', compId, limit, withPriceRange},
    };

    return this.sendRequest(data) as Promise<{
      data: GetDataQuery;
    }>;
  }

  public getInitialData({
    externalId,
    compId,
    limit,
    sort,
    filters,
    offset,
    withOptions,
    withPriceRange,
    mainCollectionId,
  }: IGetInitialData): Promise<{
    data: GetDataQuery;
  }> {
    const maxLimit = Math.min(limit, MAX_PRODUCTS);
    let data: any;
    if (this.siteStore.experiments.enabled(Experiments.SetGalleryCollectionVelo)) {
      data = {
        query: getDataNewQueryString,
        source: 'WixStoresWebClient',
        operationName: 'getDataNew',
        variables: {
          externalId: externalId || '',
          compId: mainCollectionId ? undefined : compId,
          limit: maxLimit,
          sort,
          filters,
          offset,
          withOptions,
          withPriceRange,
          mainCollectionId,
        },
      };
    } else {
      data = {
        query: getDataQueryString,
        source: 'WixStoresWebClient',
        operationName: 'getData',
        variables: {
          externalId: externalId || '',
          compId,
          limit: maxLimit,
          sort,
          filters,
          offset,
          withOptions,
          withPriceRange,
        },
      };
    }

    return this.sendRequest(data) as Promise<{
      data: GetDataQuery;
    }>;
  }

  public getRelatedItems({
    externalId = '',
    productIds,
    withPriceRange,
  }: {
    externalId: string;
    productIds: string[];
    withPriceRange: boolean;
  }): Promise<{data: GetRelatedItemsQuery}> {
    const data: any = {
      query: GetRelatedItemsQueryString,
      source: 'WixStoresWebClient',
      operationName: 'getRelatedItems',
      variables: {externalId, productIds, withPriceRange},
    };

    return this.sendRequest(data) as Promise<{data: GetRelatedItemsQuery}>;
  }

  private sendRequest(data: any): Promise<any> {
    return this.siteStore.tryGetGqlAndFallbackToPost(
      this.siteStore.resolveAbsoluteUrl(`/${Topology.STOREFRONT_GRAPHQL_URL}`),
      data
    );
  }

  public async getCategoryProducts(
    variables: GetCategoryProductsQueryVariables
  ): Promise<{data: GetCategoryProductsQuery}> {
    const data: any = {
      query: getCategoryProductsQueryString,
      source: 'WixStoresWebClient',
      operationName: 'getCategoryProducts',
      variables,
    };

    return this.sendRequest(data);
  }

  public async getProductsByOffset(request: GetProductsRequest) {
    const {collectionId, offset, limit, filters, withOptions, withPriceRange, sorting} = request;
    const response = await this.getProductsByGraphQL(
      collectionId,
      offset,
      limit,
      filters,
      withOptions,
      withPriceRange,
      sorting
    );
    const {list, totalCount} = response.data.catalog.category.productsWithMetaData;
    return {list: _.compact(list), totalCount};
  }

  public async getProducts({
    collectionId,
    filters,
    fromIndex,
    sorting,
    toIndex,
    withOptions,
    withPriceRange,
  }: {
    collectionId: string;
    fromIndex: number;
    toIndex: number;
    withOptions: boolean;
    withPriceRange: boolean;
    filters?: ProductFilters;
    sorting?: ISorting;
  }): Promise<GetProductsResponse> {
    const offset = fromIndex;
    const limit = toIndex - fromIndex;
    return this.getProductsByOffset({
      collectionId,
      filters,
      sorting,
      withOptions,
      withPriceRange,
      offset,
      limit,
    });
  }

  public async getProductsByGraphQL(
    mainCollectionId: string,
    offset: number,
    limit: number,
    filters: ProductFilters | null,
    withOptions: boolean,
    withPriceRange: boolean,
    sorting?: ISorting
  ): Promise<{data: GetFilteredProductsQuery}> {
    const sort = sorting
      ? {
          direction: sorting.direction === 'ASC' ? SortDirection.Ascending : SortDirection.Descending,
          sortField: sorting.field as ProductSortField,
        }
      : null;

    const variables: GetFilteredProductsQueryVariables = {
      mainCollectionId,
      offset,
      limit,
      sort,
      filters,
      withOptions,
      withPriceRange,
    };

    const data = {
      variables,
      query: getFilteredProductsQueryString,
      source: 'WixStoresWebClient',
      operationName: 'getFilteredProducts',
    };

    return this.sendRequest(data);
  }
}
