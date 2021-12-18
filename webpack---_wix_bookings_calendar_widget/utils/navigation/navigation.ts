import { CALENDAR_PAGE_URL_PATH_PARAM } from '../../api/CalendarApi';
import { WixOOISDKAdapter } from '@wix/bookings-adapter-ooi-wix-sdk';
import { Service } from '@wix/bookings-uou-types';
import { isCalendarFlow } from '../ServiceUtils/ServiceUtils';

export async function navigateToServicePageIfNeeded(
  service: Service,
  wixSdkAdapter: WixOOISDKAdapter,
) {
  if (!isCalendarFlow(service)) {
    const serviceSlug = await wixSdkAdapter.getServiceSlug(
      CALENDAR_PAGE_URL_PATH_PARAM,
    );
    await wixSdkAdapter.navigateToBookingsServicePage(serviceSlug);
    return;
  }
}
