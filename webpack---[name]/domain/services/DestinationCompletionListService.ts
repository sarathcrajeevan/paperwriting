import {DestinationCompletionListApi} from '../apis/DestinationCompletionListApi';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';

export class DestinationCompletionListService {
  private readonly destinationCompletionListApi: DestinationCompletionListApi;

  constructor({siteStore}: {siteStore: SiteStore}) {
    this.destinationCompletionListApi = new DestinationCompletionListApi({siteStore});
  }

  public async fetch({forShipping, forTax}: {forShipping: boolean; forTax: boolean}) {
    return this.destinationCompletionListApi.getList({forShipping, forTax});
  }
}
