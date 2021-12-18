import { BOOKINGS_LIST_PAGE_ID } from '@wix/bookings-uou-domain';
import { WixOOISDKAdapter } from '@wix/bookings-adapter-ooi-wix-sdk/dist/src';
import { IBookingsAdditionalConfiguration } from './create-controller-additional-configuration';
import { FEDOPS_MAIN_PAGE_WIDGET_EDITOR } from '../../constants/bookings.const';
import { IWixAPI } from '@wix/native-components-infra/dist/src/types/types';

export class MainPageAdditionalConfiguration
  implements IBookingsAdditionalConfiguration {
  getWidgetId = () => BOOKINGS_LIST_PAGE_ID;

  getWidgetName = () => FEDOPS_MAIN_PAGE_WIDGET_EDITOR;

  prePageReady = async (wixOOISDKAdapter: WixOOISDKAdapter) => {
    if (!wixOOISDKAdapter.isRunningInIframe()) {
      const suffix = await wixOOISDKAdapter.getBookingsUrlSuffix();
      if (await shouldNavigateToBookCheckout(wixOOISDKAdapter, suffix)) {
        await wixOOISDKAdapter.navigateToBookingsWithSuffix(suffix);
      }
    }
  };

  onLocationChange = (wixCodeApi: IWixAPI, callback) => {
    const path = wixCodeApi.location.path;
    wixCodeApi.location.onChange((data: { path: string[] }) => {
      if (data.path[0] === path[0]) {
        callback();
      }
    });
  };
}

async function shouldNavigateToBookCheckout(wixOOISDKAdapter, suffix) {
  const bookCheckoutInstalled = await wixOOISDKAdapter.isBookCheckoutInstalled();
  return bookCheckoutInstalled && !!suffix;
}
