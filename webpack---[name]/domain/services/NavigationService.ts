import {ControllerFlowAPI} from 'yoshi-flow-editor-runtime/build/cjs/flow-api/ViewerScript';
import settingsParams from '../../components/thankYouPage/settingsParams';
import {ILinkType} from '@wix/wixstores-client-core/dist/es/src/types/wix-sdk';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {BIService} from './BIService';
import {OrderService} from './OrderService';
import {ILink} from '@wix/wixstores-client-core/dist/es/src/types';

export type ShippingServiceConfig = {
  flowAPI: ControllerFlowAPI;
  siteStore: SiteStore;
  biService: BIService;
  orderService: OrderService;
};

export class NavigationService {
  private readonly siteStore: SiteStore;
  private readonly flowAPI: ControllerFlowAPI;
  private readonly biService: BIService;
  private readonly orderService: OrderService;

  constructor({flowAPI, siteStore, biService, orderService}: ShippingServiceConfig) {
    this.flowAPI = flowAPI;
    this.siteStore = siteStore;
    this.biService = biService;
    this.orderService = orderService;
  }

  public async getContinueShoppingLinkHref(): Promise<string> {
    return (await this.getLink()).url;
  }

  public readonly onContinueShoppingClick = async (): Promise<void> => {
    this.biService.thankYouPageContinueShoppingClickedSf(this.orderService.orderGuid);

    this.siteStore.navigateToLink(await this.getLink());
  };

  private getLink(): Promise<ILink> {
    const link = this.flowAPI.settings.get(settingsParams.THANK_YOU_PAGE_CONTINUE_SHOPPING_LINK_OBJECT);

    return link ? this.siteStore.getLink(link as ILinkType) : this.siteStore.getHomepageLink();
  }
}
