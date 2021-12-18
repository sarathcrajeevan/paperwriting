import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {PageMap, Topology} from '@wix/wixstores-client-core/dist/es/src/constants';
import {productWithVariantsMapper} from '@wix/wixstores-platform-common/dist/src/products/product.mapper';
import {IControllerErrorReporter} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/createViewerScript';
import {query as getFirstProductQuery} from '../graphql/getFirstProduct.graphql';
import {query as getProductBySlugQuery} from '../graphql/getProductBySlug.graphql';
import {query as storeMetaDataQuery} from '../graphql/getStoreMetaData.graphql';
import {graphqlOperation, GRAPHQL_SOURCE} from '../constants';
import {parseUrl} from '@wix/native-components-infra/dist/src/urlUtils';
import {GetFirstProductQueryVariables, GetProductBySlugQueryVariables} from '../graphql/queries-schema';
import * as _ from 'lodash';

export function gqlStoreFrontQuery(siteStore: SiteStore, query: string, variables: {}, operationName: string) {
  return siteStore.tryGetGqlAndFallbackToPost(siteStore.resolveAbsoluteUrl(`/${Topology.STOREFRONT_GRAPHQL_URL}`), {
    query,
    variables,
    source: GRAPHQL_SOURCE,
    operationName,
  });
}

export function gqlQuery(siteStore: SiteStore, query: string, variables: {}, operationName: string) {
  return siteStore.httpClient.post(siteStore.resolveAbsoluteUrl(`/${Topology.READ_WRITE_GRAPHQL_URL}`), {
    query,
    variables,
    source: GRAPHQL_SOURCE,
    operationName,
  });
}

export function getProductBySlug(siteStore: SiteStore, slug: string, externalId: string, withPriceRange: boolean) {
  const productsQueryVariables: GetProductBySlugQueryVariables = {
    slug,
    externalId,
    withPriceRange,
  };

  const query = getProductBySlugQuery;
  return gqlStoreFrontQuery(siteStore, query, productsQueryVariables, graphqlOperation.GetProductBySlug);
}

export function getDefaultProduct(siteStore: SiteStore, externalId: string, withPriceRange: boolean) {
  const productsQueryVariables: GetFirstProductQueryVariables = {
    limit: 1,
    sort: {sortField: 'CreationDate', direction: 'Descending'},
    filters: null,
    externalId,
    withPriceRange,
  };

  const query = getFirstProductQuery;
  return gqlStoreFrontQuery(siteStore, query, productsQueryVariables, graphqlOperation.GetDefaultProduct);
}

export function getStoreMetaData(siteStore: SiteStore) {
  return gqlQuery(siteStore, storeMetaDataQuery, {}, graphqlOperation.GetStoreMetaData);
}

async function fetchProduct({siteStore, fetchDefaultProduct}: {siteStore: SiteStore; fetchDefaultProduct: boolean}) {
  const encodedProductName = siteStore.location.path[siteStore.location.path.length - 1];
  const productName = decodeURIComponent(encodedProductName);
  let query: any = {
    filter: JSON.stringify({slug: productName}),
  };
  if (fetchDefaultProduct) {
    query = {
      sort: JSON.stringify([{numericId: 'desc'}]),
      paging: {limit: 1, offset: 0},
    };
  }
  const data = {query, includeVariants: true};
  const catalogServerUrl = `catalog-reader-server`;
  const absoluteUrl = siteStore.resolveAbsoluteUrl(`/_api/${catalogServerUrl}/api/v1/products/query`);
  return siteStore.httpClient
    .post(absoluteUrl, data)
    .then((response) => response.data.products[0])
    .catch(() => {
      throw new Error('error in fetchProduct');
    });
}

export function getUrlWithoutParams(url: string): string {
  const parsedUrl = parseUrl(url);
  return `${parsedUrl.protocol}://${parsedUrl.host}${parsedUrl.path}`;
}

export async function wixCodeGetProduct(
  siteStore: SiteStore,
  reportError: IControllerErrorReporter,
  onSuccess: Function
) {
  const currentUrl = getUrlWithoutParams(siteStore.location.url);
  const sectionUrl = (await siteStore.getSectionUrl(PageMap.PRODUCT)).url;
  let useSlug =
    (siteStore.isPreviewMode() && siteStore.location.path.length > 1) ||
    (siteStore.isSiteMode() && currentUrl !== sectionUrl);

  const urlOverrideSegments = await siteStore.siteApis.getCustomizedUrlSegments(currentUrl);
  if (urlOverrideSegments) {
    useSlug = !_.isEmpty(urlOverrideSegments);
  }

  const product = await fetchProduct({siteStore, fetchDefaultProduct: !useSlug}).catch(reportError);
  if (!product) {
    throw new Error('product not found');
  }
  onSuccess();
  return productWithVariantsMapper(product);
}
