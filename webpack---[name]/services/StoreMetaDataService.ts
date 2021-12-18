import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {getStoreMetaData} from './getProduct';
import {GetStoreMetaDataQuery} from '../graphql/queries-schema';

export class StoreMetaDataService {
  private data: GetStoreMetaDataQuery;

  constructor(private readonly siteStore: SiteStore) {}

  public async fetchStoreInfo(): Promise<GetStoreMetaDataQuery> {
    if (this.data) {
      return this.data;
    }

    try {
      const {data} = await getStoreMetaData(this.siteStore);
      this.data = data;
      return data;
    } catch (e) {
      //eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw Error;
    }
  }
}
