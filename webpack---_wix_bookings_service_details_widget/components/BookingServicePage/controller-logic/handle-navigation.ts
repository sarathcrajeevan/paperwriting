import { WixOOISDKAdapter } from '@wix/bookings-adapter-ooi-wix-sdk/dist/src/WixOOISDKAdapter';
import {
  BOOKINGS_APP_DEF_ID,
  BOOKINGS_CHECKOUT_SECTION_ID,
} from '@wix/bookings-adapter-ooi-wix-sdk/dist/src/bookings.const';
import { FailReasons } from '../constants';
import { WidgetConfig } from '../../../types/shared-types';
import { biDefaults } from '../bi/consts';
import {
  isServiceConnectedToPricingPlan,
  isServiceOfferedAsPricingPlan,
} from '@wix/bookings-uou-mappers';
import { ServiceType } from '@wix/bookings-uou-types';
import { getTrackingInfoForBookButtonClick } from '@wix/bookings-analytics-adapter';

export const handleNavigation = async ({
  config,
  isPreview,
  wixSdkAdapter,
  onNavigationFailed,
  locationId,
  timezone,
  isFormOOINavigationEnabled,
  isAnalyticsOOIEnabled,
}: {
  config: WidgetConfig;
  wixSdkAdapter: WixOOISDKAdapter;
  isPreview: boolean;
  onNavigationFailed: ({ failReasons }: { failReasons: FailReasons[] }) => void;
  locationId?: string;
  timezone?: string;
  isFormOOINavigationEnabled: boolean;
  isAnalyticsOOIEnabled: boolean;
}) => {
  if (
    isPreview ||
    wixSdkAdapter.isDemoMode() ||
    wixSdkAdapter.isTemplateMode() ||
    (config.isFeatureEnabled &&
      (await isPricingPlanNavigateEnabled(wixSdkAdapter, config.serviceDto)))
  ) {
    const referral = biDefaults.service_page_referral_info;
    const serviceSlug = config.serviceDto!.urlName;
    const isCourse = config.serviceDto!.type === ServiceType.COURSE;

    if (isAnalyticsOOIEnabled && config.serviceDto) {
      const trackingInfo = getTrackingInfoForBookButtonClick({
        service: config.serviceDto,
        businessName: config.businessInfo.name || '',
      });
      wixSdkAdapter.trackAnalytics(trackingInfo);
    }

    if (isFormOOINavigationEnabled) {
      const serviceId = config.serviceDto!.id;
      if (isCourse) {
        wixSdkAdapter.navigateToBookingsFormPage({
          serviceId,
          serviceSlug,
          referral,
          timezone,
        });
      } else {
        wixSdkAdapter.navigateToBookingsCalendarPage(serviceSlug, {
          referral,
          location: locationId,
          timezone,
        });
      }
    } else {
      const optionalParams = {
        referral,
        location: locationId,
        timezone,
      };
      return wixSdkAdapter.navigateToBookingsBookAction(
        !isCourse,
        serviceSlug,
        optionalParams,
      );
    }
  } else {
    if (!config.isFeatureEnabled) {
      onNavigationFailed({ failReasons: [FailReasons.Premium] });
    } else {
      const failReasons: FailReasons[] = [];
      if (!(await wixSdkAdapter.isPricingPlanInstalled())) {
        failReasons.push(FailReasons.PricingPlanNotInstalled);
      }
      if (!isServiceConnectedToPricingPlan(config.serviceDto)) {
        failReasons.push(FailReasons.NoPlansAssignedToService);
      }
      onNavigationFailed({ failReasons });
    }
  }
};

const isPricingPlanNavigateEnabled = async (wixSdkAdapter, serviceDto) => {
  const isPricingPlanInstalled = await wixSdkAdapter.isPricingPlanInstalled();
  return (
    !isServiceOfferedAsPricingPlan(serviceDto, isPricingPlanInstalled) ||
    (isServiceConnectedToPricingPlan(serviceDto) && isPricingPlanInstalled)
  );
};

const getBookingsRelativeUrl = async (config, wixCodeApi): Promise<string> => {
  const serviceSlug = config.serviceDto.urlName;
  const fullBookingsUrl =
    (
      await wixCodeApi.site.getSectionUrl({
        sectionId: BOOKINGS_CHECKOUT_SECTION_ID,
        appDefinitionId: BOOKINGS_APP_DEF_ID,
      })
    ).url + `/${serviceSlug}`;
  const baseUrl = wixCodeApi.location.baseUrl;
  if (baseUrl) {
    const urlParts = fullBookingsUrl.split(baseUrl);
    return urlParts.length > 1 ? urlParts[1] : fullBookingsUrl;
  }
  return fullBookingsUrl;
};
