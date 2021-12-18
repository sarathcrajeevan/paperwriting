import {
  AllServicesCategoryExposureInfo,
  BI_OFFERING_TYPE,
  WIDGET_BI_REFERRAL,
  WIDGET_NAME_PHASE_1,
  WidgetViewerEvents,
} from './bi.const';
import { WixOOISDKAdapter } from '@wix/bookings-adapter-ooi-wix-sdk/dist/src/WixOOISDKAdapter';
import { PlatformBiLoggerAdapter } from '@wix/bookings-adapters-reporting/dist/src/bi-logger/platform-logger/platform-bi-logger-adapter';

export interface AdditionalBiProps {
  isNewBookingsPlatform?: boolean;
}
export class BiLogger {
  private readonly biLoggerAdapter;

  constructor(private readonly wixSdkAdapter: WixOOISDKAdapter) {
    this.biLoggerAdapter = new PlatformBiLoggerAdapter({
      wixSdkAdapter,
      widgetName: WIDGET_NAME_PHASE_1,
    });
  }

  public async sendWidgetClick(
    service_id: string,
    type: string,
    isPendingApproval: boolean,
    referralInfo: string,
    actionName?: string,
  ): Promise<void> {
    const data: any = {
      ...WidgetViewerEvents.WIDGET_VIEWER_CLICK,
      referralInfo,
      service_id,
      isPendingApproval,
      type: BI_OFFERING_TYPE[type] || type,
      ...(actionName ? { actionName } : {}),
    };
    return this.biLoggerAdapter.log(data);
  }

  public async sendViewerOpened(numOfServices: number, origin?): Promise<void> {
    if (!this.wixSdkAdapter.isEditorMode()) {
      const data: any = {
        origin,
        numOfServices,
        ...WidgetViewerEvents.WIDGET_VIEWER_PAGE_LOADED,
      };
      return this.biLoggerAdapter.log(data);
    }
  }

  public async sendCantBookGroup(): Promise<void> {
    const data: any = {
      ...WidgetViewerEvents.WIDGET_CANT_BOOK_GROUPS,
      referralInfo: WIDGET_BI_REFERRAL.WIDGET,
    };
    return this.biLoggerAdapter.log(data);
  }

  public async sendAllServicesCategoryExposure({
    isMobile,
    isExposedToTest,
    allServicesCategorySettingsValue,
    allServicesCategoryShown,
  }: AllServicesCategoryExposureInfo) {
    return this.biLoggerAdapter.log({
      ...WidgetViewerEvents.WIDGET_ALL_SERVICES_CATEGORY_EXPOSURE,
      isMobile,
      experimentValue: isExposedToTest ? 'B' : 'A',
      categoryExists: allServicesCategoryShown,
      categoryToggle: allServicesCategorySettingsValue,
    });
  }
}
