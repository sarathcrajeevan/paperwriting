import {GraphQL} from '../../graphql';
import {ApiBase} from './ApiBase';
import {IStoreSettings} from '@wix/wixstores-graphql-schema';

export class StoreSettingsApi extends ApiBase {
  /* istanbul ignore next */
  public async getStoreSettings(): Promise<IStoreSettings> {
    const response = await this.siteStore.tryGetGqlAndFallbackToPost(this.endpoint, {
      ...GraphQL.getStoreSettings(),
      operationName: 'getStoreSettings',
      source: 'WixStoresWebClient',
    });

    return response.data.settings;
  }
}
