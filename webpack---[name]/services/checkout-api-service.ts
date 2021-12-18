import {CheckoutLegacyMutationsCreateCartArgs, VolatileCartResponse} from '@wix/wixstores-graphql-schema-node';
import {GRAPHQL_SOURCE, graphqlOperation} from '../constants';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {query as createCartQuery} from '../graphql/mutations/createCart.graphql';
import {GRAPHQL_NODE_ENDPOINT} from '@wix/wixstores-client-core/dist/es/src/dashboard/topology';

export function gqlNodeQuery(siteStore: SiteStore, query: string, variables: {}, operationName: string) {
  return siteStore.httpClient.post(siteStore.resolveAbsoluteUrl(`${GRAPHQL_NODE_ENDPOINT}`), {
    query,
    variables,
    source: GRAPHQL_SOURCE,
    operationName,
  });
}

export class CheckoutApiService {
  constructor(private readonly siteStore: SiteStore) {}

  public async createCart(createCartParams: CheckoutLegacyMutationsCreateCartArgs): Promise<VolatileCartResponse> {
    const query = createCartQuery;
    return ((await gqlNodeQuery(this.siteStore, query, createCartParams, graphqlOperation.CreateCart)) as any).data
      .checkout.createCart;
  }
}
