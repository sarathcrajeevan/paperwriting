/* eslint-disable import/no-cycle */
import {FilterTypeForFetch} from '../types/galleryTypes';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {GetFiltersQuery} from '../graphql/queries-schema';
import {Topology} from '@wix/wixstores-client-core/dist/es/src/constants';
import {query as getFiltersQueryString} from '../graphql/getFilters.graphql';

export class FiltersApi {
  constructor(private readonly siteStore: SiteStore) {}

  public async getFilters(
    filterTypeDTOs: FilterTypeForFetch[],
    mainCollectionId: string
  ): Promise<{
    data: GetFiltersQuery;
  }> {
    const query = {
      query: getFiltersQueryString,
      variables: {enabledFilters: filterTypeDTOs, mainCategory: mainCollectionId},
      source: 'WixStoresWebClient',
      operationName: 'getFilters',
    };

    return this.siteStore.tryGetGqlAndFallbackToPost(
      this.siteStore.resolveAbsoluteUrl(`/${Topology.STOREFRONT_GRAPHQL_URL}`),
      query
    ) as Promise<{
      data: GetFiltersQuery;
    }>;
  }
}
