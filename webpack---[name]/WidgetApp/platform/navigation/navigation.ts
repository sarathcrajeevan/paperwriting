import { DataCapsule, FrameStorageStrategy } from 'data-capsule';
import { WixOOISDKAdapter } from '@wix/bookings-adapter-ooi-wix-sdk/dist/src/WixOOISDKAdapter';
import { OfferingIntent } from './navigation.const';
import {
  BOOKINGS_CHECKOUT_SECTION_ID,
  BOOKINGS_SCHEDULER_SECTION_ID,
  CatalogOfferingDto,
  OfferingType,
} from '@wix/bookings-uou-domain';
import { BOOKINGS_SERVICE_PAGE_SECTION_ID } from '@wix/bookings-adapter-ooi-wix-sdk/dist/src/bookings.const';
import { serviceListReferralInfo } from '../../../SettingsEditor/bi/BILogger';

export enum WidgetDeepLinkConst {
  REFRESH_APP = 'widgetRefreshApp',
}

export enum StorageConst {
  DEEP_LINK = 'deepLink',
}

export enum ClientConst {
  BOOKINGS_PAGE_ID = 'bookingsPageId',
}

export class Navigation {
  constructor(
    private readonly wixSdkAdapter: WixOOISDKAdapter,
    private readonly compId: string,
  ) {}

  async navigateToApp({
    offering,
    intent,
    isStaffPreselectionEnabled = false,
    staff,
    location,
  }: {
    offering: CatalogOfferingDto;
    intent: OfferingIntent;
    isStaffPreselectionEnabled?: boolean;
    staff?: string;
    location?: string;
  }): Promise<void> {
    if (this.wixSdkAdapter.isRunningInIframe()) {
      return this.legacyNavigateToApp(offering, intent);
    }
    return this.ooiNavigateToApp(offering, intent, isStaffPreselectionEnabled, {
      staff,
      location,
    });
  }

  private async ooiNavigateToApp(
    offering: CatalogOfferingDto,
    intent: OfferingIntent,
    isStaffPreselectionEnabled: boolean,
    { staff, location }: { staff?: string; location?: string },
  ) {
    const optionalParams = {
      referral: serviceListReferralInfo,
      ...(isStaffPreselectionEnabled && staff ? { staff } : {}),
      ...(location ? { location } : {}),
    };
    if (this.shouldNavigateToCalendar(offering, intent)) {
      return this.wixSdkAdapter.navigateToBookingsCalendarPage(
        offering.urlName,
        optionalParams,
      );
    }
    if (
      !isStaffPreselectionEnabled &&
      offering.dummy &&
      intent !== OfferingIntent.SHOW_DETAILS
    ) {
      return this.wixSdkAdapter.navigateToBookingsWithSuffix('');
    }
    return this.wixSdkAdapter.navigateToBookingsServicePage(
      offering.dummy ? '' : offering.urlName,
      optionalParams,
    );
  }

  private shouldNavigateToCalendar(
    offering: CatalogOfferingDto,
    intent: OfferingIntent,
  ) {
    return (
      intent === OfferingIntent.BOOK_OFFERING &&
      !offering.dummy &&
      offering.type !== OfferingType.COURSE
    );
  }

  private async legacyNavigateToApp(
    offering: CatalogOfferingDto,
    intent: OfferingIntent,
  ) {
    const isServicePageInstalled = await this.wixSdkAdapter.isServicePageInstalled();
    const isBookCheckoutInstalled = await this.wixSdkAdapter.isBookCheckoutInstalled();
    const capsule = await this.legacyStoreDataCapsule(offering, intent);
    let sectionId = BOOKINGS_SCHEDULER_SECTION_ID;
    if (isServicePageInstalled && intent === OfferingIntent.SHOW_DETAILS) {
      sectionId = BOOKINGS_SERVICE_PAGE_SECTION_ID;
    } else if (isBookCheckoutInstalled) {
      sectionId = BOOKINGS_CHECKOUT_SECTION_ID;
    }
    const onNavigationBySectionIdFailed = () => {
      window.Wix.Utils.navigateToSection({});
    };
    window.Wix.Utils.navigateToSection(
      {
        sectionId,
      },
      onNavigationBySectionIdFailed,
    );

    return this.shouldRefreshBookings(capsule).then((shouldRefresh) => {
      if (shouldRefresh) {
        window.Wix.PubSub.publish(WidgetDeepLinkConst.REFRESH_APP);
      }
    });
  }

  async legacyStoreDataCapsule(
    offering: CatalogOfferingDto,
    intent: OfferingIntent,
  ) {
    const capsule = new DataCapsule({
      strategy: new FrameStorageStrategy(window.top, '*', this.compId, {}),
      namespace: 'wix',
    });
    if (!offering.dummy) {
      const data = {
        serviceId: offering.id,
        intent,
        timestamp: new Date().getTime(),
      };
      await capsule.setItem(StorageConst.DEEP_LINK, data);
    }
    return capsule;
  }

  private shouldRefreshBookings(capsule) {
    return new Promise((resolve) => {
      capsule
        .getItem(ClientConst.BOOKINGS_PAGE_ID)
        .then((bookingsPageId) => {
          window.Wix.getCurrentPageId((currPageId) =>
            resolve(bookingsPageId === currPageId),
          );
        })
        .catch(() => resolve(false));
    });
  }
}
