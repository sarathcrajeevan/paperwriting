/* istanbul ignore file */
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {Topology} from '@wix/wixstores-client-core/dist/es/src/constants';

export abstract class ApiBase {
  protected readonly siteStore: SiteStore;

  constructor({siteStore}: {siteStore: SiteStore}) {
    this.siteStore = siteStore;
  }

  protected get /* istanbul ignore next */ endpoint() {
    /* istanbul ignore next */
    return this.siteStore.resolveAbsoluteUrl(`/${Topology.READ_WRITE_GRAPHQL_URL}`);
  }
}
