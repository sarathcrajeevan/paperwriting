import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {OrderService} from './OrderService';
import {TrackEventName} from '@wix/wixstores-client-core/dist/es/src/types/track-event';
import {TrackPurchaseParams} from '../../types/app.types';

export class TrackEventService {
  private readonly siteStore: SiteStore;
  private readonly orderService: OrderService;
  private trackPurchaseReported = false;

  constructor({siteStore, orderService}: {siteStore: SiteStore; orderService: OrderService}) {
    this.siteStore = siteStore;
    this.orderService = orderService;
  }

  public trackPurchase(trackPurchaseParams: TrackPurchaseParams): void {
    if (this.trackPurchaseReported || this.isOldOrder) {
      return;
    }

    this.trackPurchaseReported = true;

    this.siteStore.trackEvent(TrackEventName.PURCHASE, trackPurchaseParams);
  }

  private get isOldOrder(): boolean {
    return Date.now() - (this.orderService.createdDate || 0) >= 180_000;
  }
}
