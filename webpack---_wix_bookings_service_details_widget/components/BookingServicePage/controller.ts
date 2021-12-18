import { ControllerParams, CreateControllerFn } from '@wix/yoshi-flow-editor';
import { ITEM_TYPES } from '@wix/advanced-seo-utils/editor';
import settingsParams from './settingsParams';
import { getConfig } from '../../api/config.api';
import {
  dummyViewModelFactory,
  ServicePageViewModel,
  servicePageViewModelFactory,
} from '../../service-page-view-model/servicePageViewModel';
import { getSettingsValues } from '@wix/yoshi-flow-editor/tpa-settings';
import { Service } from '@wix/ambassador-services-catalog-server/types';
import { ACTION_NAMES, biDefaults, generateWidgetDefaults } from './bi/consts';
import {
  dummySchedulingViewModel,
  SchedulingSectionStatus,
  SchedulingSectionViewModel,
  schedulingSectionViewModelFactory,
} from '../../service-page-view-model/scheduling-section-view-model/schedulingSectionViewModel';
import { getServiceSchedulingData } from './controller-logic/scheduling-fetcher';
import { ServiceType, TimezoneType } from '@wix/bookings-uou-types';
import { initUserMessage } from './controller-logic/init-user-message';
import {
  WixOOISDKAdapter,
  BookingsQueryParams,
} from '@wix/bookings-adapter-ooi-wix-sdk';
import { handleNavigation } from './controller-logic/handle-navigation';
import { sendNotification } from '../../api/notification.api';
import { schedulingLocationViewModelFactory } from '../../service-page-view-model/scheduling-location-view-model/schedulingLocationViewModel';
import {
  SchedulingTimezoneViewModel,
  schedulingTimezoneViewModelFactory,
} from '../../service-page-view-model/shceduling-timezone-view-model/schedulingTimezoneViewModel';
import { initializeViewModels } from './controller-logic/initialize-view-models';
import { SERVICE_PAGE_NAME } from './constants';
import { getTrackingInfoForServicePageLoads } from '@wix/bookings-analytics-adapter';
import { WidgetConfig } from '../../types/shared-types';

// https://stackoverflow.com/questions/63961803/eslint-says-all-enums-in-typescript-app-are-already-declared-in-the-upper-scope
// eslint-disable-next-line no-shadow
enum ScheduleStatus {
  UNDEFINED = 'UNDEFINED',
  CREATED = 'CREATED',
  CANCELLED = 'CANCELLED',
}

export const WARMUP_DATA_KEY = 'ServicePageConfig';

const createController: CreateControllerFn = async ({
  flowAPI,
}: ControllerParams) => {
  const setProps = flowAPI.controllerConfig.setProps;
  const t = flowAPI.translations.t;
  const { controllerConfig, httpClient, experiments, reportError } = flowAPI;
  const publicData = controllerConfig.config.publicData.COMPONENT || {};
  const settings = getSettingsValues(publicData, settingsParams);
  const wixSdkAdapter: WixOOISDKAdapter = new WixOOISDKAdapter(
    controllerConfig.wixCodeApi,
    controllerConfig.platformAPIs,
    controllerConfig.appParams,
    controllerConfig.compId,
  );
  let service: Service | undefined;
  return {
    async pageReady() {
      const { platformAPIs, appParams, wixCodeApi } = controllerConfig;
      const instance = appParams.instance as string;

      const isSEO = wixSdkAdapter.isSEO();
      const isBookingCalendarInstalled = await wixSdkAdapter.isBookingCalendarInstalled();
      const isBookingFormInstalled = await wixSdkAdapter.isBookingFormInstalled();
      const { isPreview, isSSR, isEditor, isViewer } = flowAPI.environment;

      let scheduleViewModel: SchedulingSectionViewModel = {
        status: SchedulingSectionStatus.LOADING,
        isBookable: false,
      };
      let locationViewModel, getServiceSchedulingDataByLocation;
      let timezoneViewModel: SchedulingTimezoneViewModel;
      let viewModel: ServicePageViewModel,
        navigateToCalendar = () => {};

      const validateWidgetConfigFromWarmupData = (
        serviceSlug: string,
        widgetConfig?: WidgetConfig,
      ): boolean => {
        return (
          !!(widgetConfig && widgetConfig.businessInfo) &&
          (!widgetConfig.SEO.serviceResponse ||
            widgetConfig.SEO.serviceResponse?.slugs!.some(
              ({ name }) => name === serviceSlug,
            ))
        );
      };

      const getWidgetConfigFromWarmupData = (
        serviceSlug,
      ): WidgetConfig | undefined => {
        try {
          const widgetConfigFromWarmupData = wixCodeApi.window.warmupData.get(
            WARMUP_DATA_KEY,
          ) as WidgetConfig;

          if (
            !validateWidgetConfigFromWarmupData(
              serviceSlug,
              widgetConfigFromWarmupData,
            )
          ) {
            throw new Error('Corrupted Bookings service page warmupData');
          }
          return widgetConfigFromWarmupData;
        } catch (e) {
          reportError(e);
        }
      };

      async function fetchWidgetConfigFromServer(serviceSlug) {
        return (await httpClient.request(getConfig(serviceSlug, isPreview)))
          .data;
      }

      const initWidget = async () => {
        const isAnalyticsOOIEnabled = experiments.enabled(
          'specs.bookings.analyticsOOI',
        );
        const isServicePageWarmupDataEnabled = experiments.enabled(
          'specs.bookings.ServicePageWarmupData',
        );
        if (isViewer || isPreview) {
          const serviceSlug = await wixSdkAdapter.getServiceSlug(
            SERVICE_PAGE_NAME,
          );
          const config: WidgetConfig =
            (isServicePageWarmupDataEnabled &&
              getWidgetConfigFromWarmupData(serviceSlug)) ||
            (await fetchWidgetConfigFromServer(serviceSlug));

          if (isServicePageWarmupDataEnabled && isSSR) {
            try {
              wixCodeApi.window.warmupData.set(WARMUP_DATA_KEY, config);
            } catch (e) {
              reportError(e);
            }
          }
          service = config.SEO.serviceResponse?.service;

          const referralInfo = wixSdkAdapter.getUrlQueryParamValue(
            BookingsQueryParams.REFERRAL,
          );
          flowAPI.bi &&
            flowAPI.bi.util &&
            flowAPI.bi.util.updateDefaults({
              ...biDefaults,
              ...generateWidgetDefaults(appParams, platformAPIs, isEditor),
              serviceId: config.serviceDto?.id,
              service_id: config.serviceDto?.id,
              type: config.serviceDto?.type,
              referralInfo,
            });

          if (!config.serviceDto) {
            setProps({});
            return;
          }

          if (config.SEO.serviceResponse) {
            await wixCodeApi.seo.renderSEOTags({
              itemType: ITEM_TYPES.BOOKINGS_SERVICE,
              itemData: {
                serviceResponse: config.SEO.serviceResponse,
                bookingsPolicyDto: config.bookingPolicyDto,
              },
              seoData: config.SEO.serviceResponse?.service?.advancedSeoData,
            });
          }
          const isOnlyCreatedSchedule = experiments.enabled(
            'specs.bookings.UseActiveScheduleOnly',
          );
          const isUoUMultiLocationAllLocationsEnabled = experiments.enabled(
            'specs.bookings.UoUMultiLocationAllLocations',
          );
          const isFormOOINavigationEnabled = experiments.enabled(
            'specs.bookings.ServicePageFormOOINavigation',
          );
          const isCourse = config.serviceDto?.type === ServiceType.COURSE;
          const serviceSchedule = isOnlyCreatedSchedule
            ? config.SEO.serviceResponse?.schedules?.find(
                (schedule) => schedule.status === ScheduleStatus.CREATED,
              )
            : config.SEO.serviceResponse?.schedules?.[0];
          const firstSessionStart = serviceSchedule?.firstSessionStart;
          const lastSessionEnd = serviceSchedule?.lastSessionEnd;
          const queryLocationId = wixCodeApi.location.query?.location;
          const selectedLocation = config.serviceDto?.info.locations?.find(
            (serviceLocation) =>
              serviceLocation.businessLocation?.id === queryLocationId,
          )
            ? queryLocationId
            : undefined;
          const initViewModels = initializeViewModels({
            config,
            t,
            experiments,
            selectedLocation,
            isSEO,
            isBookingCalendarInstalled,
          });
          viewModel = initViewModels.viewModel;
          locationViewModel = initViewModels.locationViewModel;
          timezoneViewModel = initViewModels.timezoneViewModel;

          const getActionName = async () => {
            if (isCourse) {
              return isBookingFormInstalled
                ? ACTION_NAMES.NAVIGATE_TO_BOOKING_FORM
                : ACTION_NAMES.NAVIGATE_TO_CONTACT_FORM;
            } else {
              return isBookingCalendarInstalled
                ? ACTION_NAMES.NAVIGATE_TO_CALENDAR
                : undefined;
            }
          };

          navigateToCalendar = async (initiatedBy?: string) => {
            flowAPI.bi &&
              flowAPI.bi.bookingsBookItClick({
                section: initiatedBy,
                actionName: await getActionName(),
              });

            return handleNavigation({
              config,
              isPreview,
              wixSdkAdapter,
              locationId: locationViewModel.currentLocation,
              timezone: timezoneViewModel.viewTimezone,
              onNavigationFailed: ({ failReasons }) => {
                httpClient.request(
                  sendNotification(failReasons, config.serviceDto?.id),
                );
                flowAPI.bi &&
                  flowAPI.bi.bookingsCantBookGroupsMessage({
                    widget_name: 'service_page',
                    referralInfo: 'service_page',
                    isPreview,
                    failReason: JSON.stringify(failReasons),
                  });
                showUserMessage();
              },
              isFormOOINavigationEnabled,
              isAnalyticsOOIEnabled,
            });
          };

          getServiceSchedulingDataByLocation = (locationId: string) => {
            locationViewModel = schedulingLocationViewModelFactory({
              serviceInfoDto: config.serviceDto!.info,
              selectedLocation: locationId,
              isUoUMultiLocationAllLocationsEnabled,
              t,
            });
            scheduleViewModel = {
              status: SchedulingSectionStatus.LOADING,
              isBookable: viewModel.body.isBookable,
            };
            setProps({
              locationViewModel,
              scheduleViewModel,
            });
            getServiceSchedulingData({
              config,
              settings,
              httpClient,
              instance,
              isOnlyCreatedSchedule,
              locationId,
            })
              .then((schedule) => {
                const changeTimezoneCallback = (timezoneType: TimezoneType) => {
                  timezoneViewModel = schedulingTimezoneViewModelFactory({
                    businessInfo: config.businessInfo,
                    selectedTimezoneType: timezoneType,
                    isBookingCalendarInstalled,
                  });
                  viewModel = servicePageViewModelFactory({
                    config,
                    t,
                    experiments,
                    viewTimezone: timezoneViewModel.viewTimezone,
                    isSEO,
                  });
                  scheduleViewModel = schedulingSectionViewModelFactory({
                    isBookable: viewModel.body.isBookable,
                    catalogSessionsDto: schedule?.sessions,
                    businessInfo: config?.businessInfo,
                    viewTimezone: timezoneViewModel.viewTimezone,
                    isCourse,
                    firstSessionStart,
                    lastSessionEnd,
                    t,
                  });
                  setProps({
                    viewModel,
                    timezoneViewModel,
                    scheduleViewModel,
                  });
                };
                scheduleViewModel = schedulingSectionViewModelFactory({
                  isBookable: viewModel.body.isBookable,
                  catalogSessionsDto: schedule?.sessions,
                  businessInfo: config?.businessInfo,
                  viewTimezone: timezoneViewModel.viewTimezone,
                  isCourse,
                  firstSessionStart,
                  lastSessionEnd,
                  t,
                });
                setProps({
                  locationViewModel,
                  scheduleViewModel,
                  timezoneViewModel,
                  changeTimezoneCallback,
                });
              })
              .catch((e) => {
                reportError(e);
                scheduleViewModel = {
                  status: SchedulingSectionStatus.FAILED,
                  isBookable: false,
                };
                setProps({
                  scheduleViewModel,
                });
              });
          };

          if (!isSSR) {
            getServiceSchedulingDataByLocation(
              locationViewModel.currentLocation,
            );
          }

          if (isAnalyticsOOIEnabled) {
            const trackingInfo = getTrackingInfoForServicePageLoads({
              service: config.serviceDto,
              businessName: config.businessInfo.name || '',
            });
            wixSdkAdapter.trackAnalytics(trackingInfo);
          }
        } else {
          const isEditorX =
            flowAPI.controllerConfig.config.style.styleParams.booleans
              .responsive;
          viewModel = dummyViewModelFactory({
            t,
            isEditorX,
          });
          const dummyBusinessInfo = {
            timeZone: 'UTC',
            regionalSettingsLocale: flowAPI.environment.language,
            dateRegionalSettingsLocale: flowAPI.environment.language,
          };
          scheduleViewModel = dummySchedulingViewModel({
            t,
            businessInfo: dummyBusinessInfo,
            scheduleDays: settings.scheduleDays,
          });

          flowAPI.bi &&
            flowAPI.bi.util &&
            flowAPI.bi.util.updateDefaults({
              ...biDefaults,
              ...generateWidgetDefaults(appParams, platformAPIs, isEditor),
            });
        }

        const { userMessage, showUserMessage } = initUserMessage(setProps);

        setProps({
          navigateToCalendar,
          scheduleViewModel,
          locationViewModel,
          changeLocationCallback: getServiceSchedulingDataByLocation,
          viewModel,
          userMessage,
        });
      };
      await initWidget();

      const isLocationChangeFired = experiments.enabled(
        'specs.bookings.LocationChangeFired',
      );

      if (isLocationChangeFired) {
        wixCodeApi.location.onChange(async () => {
          await initWidget();
        });
      }
    },
    exports() {
      return {
        onNextClicked(overrideCallback) {
          wixSdkAdapter.navigateToBookingsCalendarPage = () =>
            overrideCallback({ service });
          wixSdkAdapter.navigateToBookingsFormPage = () =>
            overrideCallback({ service });
          wixSdkAdapter.navigateToBookingsBookAction = () =>
            overrideCallback({ service });
        },
      };
    },
    updateConfig($w, newConfig) {
      const updatedPublicData = newConfig.publicData.COMPONENT || {};
      const updatedSettings = getSettingsValues(
        updatedPublicData,
        settingsParams,
      );
      if (settings.scheduleDays !== updatedSettings.scheduleDays) {
        const dummyBusinessInfo = {
          timeZone: 'UTC',
          regionalSettingsLocale: flowAPI.environment.language,
        };

        const scheduleViewModel = dummySchedulingViewModel({
          t,
          businessInfo: dummyBusinessInfo,
          scheduleDays: updatedSettings.scheduleDays,
        });

        setProps({
          scheduleViewModel,
        });
      }
    },
  };
};

export default createController;
