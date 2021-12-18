import {StoreSettingsApi} from '../apis/StoreSettingsApi';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {IStoreSettings} from '@wix/wixstores-graphql-schema';

export class StoreSettingsService {
  private readonly storeSettingsApi: StoreSettingsApi;
  private storeSettings: IStoreSettings;

  constructor({siteStore}: {siteStore: SiteStore}) {
    this.storeSettingsApi = new StoreSettingsApi({siteStore});
  }

  public async fetch() {
    this.storeSettings = await this.storeSettingsApi.getStoreSettings();
    return this.storeSettings;
  }

  public getFetchedData() {
    return this.storeSettings;
  }
}
