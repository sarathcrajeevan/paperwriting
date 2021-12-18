import { BookingsAPI } from './api/bookingsAPI';
import { BiLogger } from '../adapters/reporting/bi-logger/bi-logger';
import { WixOOISDKAdapter } from '@wix/bookings-adapter-ooi-wix-sdk/dist/src/WixOOISDKAdapter';
import { IWidgetControllerConfig } from '@wix/native-components-infra/dist/es/src/types/types';
import { createDummyOfferingsDto } from '../domain/dummy-offering-dto';
import { FedopsAdapter } from '@wix/bookings-adapters-reporting/dist/src/fedops/fedops-adapter';
import { getRavenSessionIdForApp } from '@wix/bookings-adapters-reporting/dist/src/sentry/sentry-adapter';
import { appClient, Scope } from '@wix/app-settings-client';
import { AppSettingsClientAdapter } from '@wix/bookings-adapter-ooi-wix-sdk/dist/src/AppSettingsClientAdapter';
import {
  defaultSettingsDataMap,
  BOOKINGS_MAIN_PAGE_PRESET_ID,
  SINGLE_SERVICE_PRESET_ID,
  BOOKINGS_MAIN_PAGE_EDITOR_X_PRESET_ID,
  SINGLE_SERVICE_EDITOR_X_PRESET_ID,
} from '../../Shared/appKeys/DefaultSettings';
import { BiLoggerDriver } from '../adapters/reporting/bi-logger/bi-logger-driver';
import { NavigationDriver } from './navigation/navigation-driver';
import { Navigation } from './navigation/navigation';
import {
  BookingValidations,
  getNotifyPricingPlanRequest,
} from './validation/booking-validations';
import { WidgetData } from '../../Server/domain/widget';
import { filterResources } from '../../Server/client-kit/shared-utils';
import { logToGoogleAnalytics } from '../adapters/reporting/analytics-adapter/analytics-adapter';
import { IBookingsAdditionalConfiguration } from './bookingsConfiguration/create-controller-additional-configuration';
import { MainPageAdditionalConfiguration } from './bookingsConfiguration/main-page-additional-configuration';
import { OfferingListWidgetAdditionalConfiguration } from './bookingsConfiguration/offering-list-widget-additional-configuration';
import { createDummyCategoriesDto } from '../domain/dummy-category-dto';
import { cleanNulls, getCurrentStyles, getPresetId } from '../../Shared/utils';
import { BookingsErrorReporter } from '@wix/bookings-adapters-reporting/dist/src/error-reporter/error-adapter';
import UrlQueryParamsBuilder from '../../Shared/urlQueryParams/url-query-params-builder';
import {
  REQUESTED_CATEGORIES_URL_PARAM_NAME,
  REQUESTED_STAFF_DEEP_LINK_ORIGIN,
  REQUESTED_STAFF_URL_PARAM_NAME,
} from '../../Shared/constant';
import { CatalogServiceDto } from '@wix/bookings-uou-types';
import { OfferingIntent } from './navigation/navigation.const';
import {
  getTrackingInfoForBookButtonClick,
  getTrackingInfoForNavigateToServicePageClick,
} from '@wix/bookings-analytics-adapter';

export function getMockedProps() {
  return {
    getBusinessId: () => '',
  };
}

async function shouldShowDummyModeInPreviewMode(wixSdkAdapter) {
  return (
    wixSdkAdapter.isPreviewMode() && wixSdkAdapter.isBookCheckoutInstalled()
  );
}

async function shouldShowDummyMode(
  offerings: any[],
  wixSdkAdapter: WixOOISDKAdapter,
) {
  const hasOfferings = offerings && offerings.length > 0;
  return (
    !hasOfferings &&
    (wixSdkAdapter.isEditorMode() ||
      shouldShowDummyModeInPreviewMode(wixSdkAdapter))
  );
}

const initEventListeners = (
  settings,
  setProps,
  originalWidgetData: WidgetData,
  wixSdkAdapter,
) => {
  settings.onChange(async (settingsUserData) => {
    settingsUserData = cleanNulls(settingsUserData);
    const newProps: any = { settingsUserData };
    if (originalWidgetData.offerings && originalWidgetData.offerings.length) {
      const isMultiLocationEnabled =
        originalWidgetData.config.experiments[
          'specs.bookings.UoUMultiLocationV1'
        ] === 'true';
      const { offerings, categories, locations } = filterResources(
        originalWidgetData.offerings,
        originalWidgetData.categories,
        originalWidgetData.locations,
        settingsUserData,
        isMultiLocationEnabled,
      );
      newProps.offerings = offerings;
      newProps.categories = categories;
      newProps.locations = locations;
    }
    setProps({
      ...newProps,
      scale: await wixSdkAdapter.getScale(),
    });
  });

  window.Wix.addEventListener('STYLE_PARAMS_CHANGE', async (data) => {
    const presetData = await getPresetId();
    if (!(presetData && presetData.presetId)) {
      return;
    }

    const currentSettingsDefaultData = defaultSettingsDataMap.get(
      presetData.presetId,
    );
    const [siteColors, siteTextPresets] = await getCurrentStyles();
    setProps({
      style: {
        siteTextPresets,
        siteColors,
        styleParams: data,
      },
      settingsDefaultData: currentSettingsDefaultData,
    });
  });
};

const createSettings = ({
  setProps,
  appDefId,
  externalId,
  originalWidgetData,
  wixSdkAdapter,
}) => {
  let settings;
  if (
    wixSdkAdapter.isEditorMode() &&
    originalWidgetData.config.experiments['specs.bookings.EditorOOI'] !== 'true'
  ) {
    settings = appClient({ scope: Scope.COMPONENT });
    initEventListeners(settings, setProps, originalWidgetData, wixSdkAdapter);
  } else {
    settings = appClient({
      scope: Scope.COMPONENT,
      adapter: new AppSettingsClientAdapter({
        appDefId,
        instanceId: wixSdkAdapter.getInstanceId(),
        externalId,
      }),
    });
  }
  return settings;
};

function initiateUserMessages(setProps: (props: { [p: string]: any }) => void) {
  const userMessage: any = {
    shouldDisplayMessage: false,
    closeMessage: () => {
      hideMessage();
    },
  };

  const showMessage = () => {
    userMessage.shouldDisplayMessage = true;
    setProps({
      userMessage,
    });
  };

  const hideMessage = () => {
    userMessage.shouldDisplayMessage = false;
    setProps({
      userMessage,
    });
  };
  return { userMessage, showMessage };
}

export const createControllerFactory = (
  bookingsAdditionalConfiguration: IBookingsAdditionalConfiguration,
  deepLinkEnabled = false,
) => (
  {
    compId,
    type,
    config,
    $w,
    warmupData,
    setProps,
    appParams,
    platformAPIs,
    wixCodeApi,
  }: IWidgetControllerConfig,
  errorReporter: BookingsErrorReporter = (e) => {
    throw e;
  },
) => {
  let userData;
  const isEditorX = config.style.styleParams.booleans.responsive;
  const pageReady = async () => {
    const wixSdkAdapter: WixOOISDKAdapter = new WixOOISDKAdapter(
      wixCodeApi,
      platformAPIs,
      appParams,
      compId,
    );
    try {
      await bookingsAdditionalConfiguration.prePageReady(wixSdkAdapter);
    } catch (e) {
      errorReporter(e);
    }

    const fedopsAdapter = new FedopsAdapter(
      wixSdkAdapter,
      bookingsAdditionalConfiguration.getWidgetId(),
    );

    const isLiveSiteNoSSR =
      wixSdkAdapter.isSiteMode() && !wixSdkAdapter.isSSR();

    const serverBaseUrl = isLiveSiteNoSSR
      ? `${wixCodeApi.location.baseUrl}/`
      : wixSdkAdapter.getServerBaseUrl();

    const staticsBaseUrl = wixSdkAdapter.getServiceListStaticsBaseUrl();

    const httpAdapter = new BookingsAPI(
      appParams.instance,
      staticsBaseUrl,
      serverBaseUrl,
      wixSdkAdapter.getSiteRevision(),
      wixSdkAdapter.getCsrfToken(),
      wixSdkAdapter.getViewMode(),
    );

    let locale = wixSdkAdapter.getCurrentLanguage();
    let failedTranslationFetch = false;
    const bookingsValidations = new BookingValidations(wixSdkAdapter);
    if (!wixSdkAdapter.isEditorMode() && !wixSdkAdapter.isPreviewMode()) {
      fedopsAdapter.logInteractionStarted('get-widget-data');
    }

    const metaSiteId = isLiveSiteNoSSR ? wixSdkAdapter.getMetaSiteId() : '';
    let configParams;

    let deepLinkOrigin, preSelectedStaff;
    if (deepLinkEnabled) {
      const urlQueryParams = wixSdkAdapter.getUrlQueryParams();
      const urlQueryParamsBuilder = new UrlQueryParamsBuilder();
      if (urlQueryParams[REQUESTED_STAFF_URL_PARAM_NAME]) {
        deepLinkOrigin = REQUESTED_STAFF_DEEP_LINK_ORIGIN;
        preSelectedStaff = urlQueryParams[REQUESTED_STAFF_URL_PARAM_NAME];
        urlQueryParamsBuilder.add(
          REQUESTED_STAFF_URL_PARAM_NAME,
          preSelectedStaff,
        );
      }
      configParams = urlQueryParamsBuilder.build();
    }

    // baseUrls are defined from dev center json or window (when in iframe), in case you wonder.
    // eslint-disable-next-line prefer-const
    let [widgetData, translations] = await Promise.all([
      httpAdapter.getWidgetData(
        config.externalId,
        true,
        metaSiteId,
        configParams,
      ),
      httpAdapter
        .getTranslations(locale)
        .catch(() => (failedTranslationFetch = true)),
    ]).catch(errorReporter);
    userData = widgetData;

    if (!wixSdkAdapter.isEditorMode() && !wixSdkAdapter.isPreviewMode()) {
      fedopsAdapter.logInteractionEnded('get-widget-data');
    }

    if (failedTranslationFetch || locale !== widgetData.config.locale) {
      locale = widgetData.config.locale;
      wixSdkAdapter.setCurrentLanguage(locale);
      try {
        translations = await httpAdapter.getTranslations(locale);
      } catch (e) {
        errorReporter(
          new Error(
            `Failed to get translations for new locale - ${locale}: ${e.message}`,
          ),
        );
      }
    }

    const settings = createSettings({
      setProps,
      appDefId: appParams.appDefinitionId,
      externalId: config.externalId,
      originalWidgetData: widgetData,
      wixSdkAdapter,
    });

    let presetId;
    if (config.publicData.COMPONENT && config.publicData.COMPONENT.presetId) {
      presetId = config.publicData.COMPONENT.presetId;
    } else {
      presetId =
        widgetData.config.experiments['specs.bookings.EditorXContent'] ===
          'true' && isEditorX
          ? BOOKINGS_MAIN_PAGE_EDITOR_X_PRESET_ID
          : BOOKINGS_MAIN_PAGE_PRESET_ID;
    }

    const settingsDefaultData = defaultSettingsDataMap.get(presetId);

    const getAllSettings = async () => {
      try {
        return await settings.getAll();
      } catch (e) {
        try {
          errorReporter(e);
        } catch {}
        return null;
      }
    };
    let settingsUserData =
      widgetData.config.settings || (await getAllSettings());
    settingsUserData = cleanNulls(settingsUserData);
    if (
      settingsUserData &&
      (presetId === SINGLE_SERVICE_PRESET_ID ||
        presetId === SINGLE_SERVICE_EDITOR_X_PRESET_ID) &&
      !settingsUserData.SELECTED_RESOURCES
    ) {
      settingsUserData.SELECTED_RESOURCES =
        settingsDefaultData.SELECTED_RESOURCES;
    }

    const biLogger = new BiLogger(wixSdkAdapter);
    const isMultiLocationEnabled =
      widgetData.config.experiments['specs.bookings.UoUMultiLocationV1'] ===
      'true';
    const filteredResources =
      widgetData.config.resourcesFiltered && widgetData.config.settings
        ? {
            offerings: widgetData.offerings,
            categories: widgetData.categories,
            locations: widgetData.locations,
          }
        : filterResources(
            widgetData.offerings,
            widgetData.categories,
            widgetData.locations,
            settingsUserData,
            isMultiLocationEnabled,
          );

    let offerings = filteredResources.offerings;
    let categories = filteredResources.categories;
    const locations = filteredResources.locations;
    let selectedCategories = [];

    const isServicePageInstalled = await wixSdkAdapter.isServicePageInstalled();

    if (
      widgetData.config.experiments['specs.bookings.ServicePageUpdateHref'] ===
        'true' &&
      isServicePageInstalled
    ) {
      for (const offering of offerings) {
        const checkoutPageName = '/bookings-checkout';
        const servicePageSlug = await wixSdkAdapter.getServicePageRelativeUrl();
        offering.fullUrl = offering.fullUrl.replace(
          checkoutPageName,
          servicePageSlug,
        );
      }
    }

    if (deepLinkEnabled) {
      const selectedCategoryQueryValue = wixSdkAdapter.getUrlQueryParams()[
        REQUESTED_CATEGORIES_URL_PARAM_NAME
      ];
      selectedCategories = selectedCategoryQueryValue
        ? [selectedCategoryQueryValue]
        : selectedCategories;
    }

    const isDummyMode = await shouldShowDummyMode(offerings, wixSdkAdapter);

    categories = isDummyMode ? createDummyCategoriesDto(presetId) : categories;

    const isNewAddPanelEnabled =
      widgetData.config.experiments.se_wixBookings_newAddPanel === 'new' &&
      widgetData.config.experiments.apd_presetsRedesign === 'new';
    offerings = isDummyMode
      ? createDummyOfferingsDto(presetId, isNewAddPanelEnabled)
      : offerings;

    const navigation: Navigation = new Navigation(wixSdkAdapter, compId);

    const biLoggerDriver: BiLoggerDriver = {
      sendAllServicesCategoryExposure: (data) =>
        biLogger.sendAllServicesCategoryExposure(data),
      sendViewerOpened: (serviceId) =>
        biLogger.sendViewerOpened(serviceId, deepLinkOrigin),
      sendWidgetClick: (
        serviceId,
        offeringType,
        isPendingApproval,
        referralInfo,
        actionName,
      ) =>
        biLogger.sendWidgetClick(
          serviceId,
          offeringType,
          isPendingApproval,
          referralInfo,
          actionName,
        ),
    };

    const { userMessage, showMessage } = initiateUserMessages(setProps);
    const businessInfo = widgetData.config.businessInfo;

    const handleNavigation = (offering, intent, locationId?) => {
      const activeFeatures = JSON.parse(widgetData.config.activeFeatures);
      bookingsValidations
        .shouldNavigate(offering, activeFeatures, intent)
        .then(({ canBook, reason }) => {
          if (canBook) {
            const useAnalyticsAdapter =
              widgetData.config.experiments['specs.bookings.analyticsOOI'] ===
              'true';
            if (useAnalyticsAdapter) {
              const data = {
                service: offering,
                businessName: businessInfo.name,
              };
              const trackingInfo =
                intent === OfferingIntent.BOOK_OFFERING
                  ? getTrackingInfoForBookButtonClick(data)
                  : getTrackingInfoForNavigateToServicePageClick(data);
              wixSdkAdapter.trackAnalytics(trackingInfo);
            } else {
              logToGoogleAnalytics(
                intent,
                businessInfo.name,
                offering,
                wixSdkAdapter.isEditorMode(),
                (trackEvid, payload) =>
                  wixSdkAdapter.trackEvent(trackEvid, payload),
              );
            }
            const isStaffPreselectionEnabled =
              widgetData.config.experiments[
                'specs.bookings.StaffQueryParamInCalendar'
              ] === 'true';
            if (isStaffPreselectionEnabled) {
              navigation
                .navigateToApp({
                  offering,
                  intent,
                  staff: preSelectedStaff,
                  location: locationId,
                  isStaffPreselectionEnabled,
                })
                .catch(console.log);
            } else {
              navigation
                .navigateToApp({ offering, intent, location: locationId })
                .catch(console.log);
            }
          } else {
            if (reason) {
              if (reason.premiumError) {
                httpAdapter
                  .notifyOwnerNonPremiumEnrollmentAttempt()
                  .then(() => null)
                  .catch(console.error);
              } else if (reason.pricingPlanError) {
                httpAdapter
                  .notifyOwnerNonPricingPlanEnrollmentAttempt(
                    getNotifyPricingPlanRequest(offering, reason),
                  )
                  .then(() => null)
                  .catch(console.error);
              }
            }
            biLogger.sendCantBookGroup().catch(console.log);
            showMessage();
          }
        })
        .catch(console.log);
    };

    const navigationDriver: NavigationDriver = {
      navigateToApp: (offering: CatalogServiceDto, intent, locationId) => {
        handleNavigation(offering, intent, locationId);
      },
    };

    const appLoadedCallback = () => {
      fedopsAdapter.logAppLoaded();
    };

    const setPropsInPreviewOOI = () => {
      if (wixSdkAdapter.isPreviewMode() && !wixSdkAdapter.isRunningInIframe()) {
        setProps({});
      }
    };

    const onCategoryChanged = (selectedCategorySlug) => {
      if (deepLinkEnabled) {
        wixSdkAdapter.setUrlQueryParam(
          REQUESTED_CATEGORIES_URL_PARAM_NAME,
          selectedCategorySlug,
        );
      }
    };

    const setContainerHeight = (newHeight) => {
      if (
        widgetData.config.experiments[
          'specs.bookings.WidgetRemoveWindowUses'
        ] !== 'true'
      ) {
        wixSdkAdapter.setContainerHeight(newHeight);
      }

      if (wixSdkAdapter.isPreviewMode() && !wixSdkAdapter.isRunningInIframe()) {
        setProps({
          dimensions: {
            height: newHeight,
          },
        });
      }
    };

    const setContainerWidth = (width) => {
      if (
        widgetData.config.experiments[
          'specs.bookings.WidgetRemoveWindowUses'
        ] !== 'true'
      ) {
        if (wixSdkAdapter.isEditorMode()) {
          window.Wix.resizeComponent({
            width,
          });
        }
      }
    };

    const setContainerDimensions = (newWidth, newHeight) => {
      if (
        widgetData.config.experiments[
          'specs.bookings.WidgetRemoveWindowUses'
        ] !== 'true'
      ) {
        if (wixSdkAdapter.isEditorMode()) {
          wixSdkAdapter.setContainerDimensions(newWidth, newHeight);
        }
      }
    };

    const platformContext = {
      isDummyMode,
      isRTL: wixSdkAdapter.isViewDirectionRtl(),
      isEditorMode: wixSdkAdapter.isEditorMode(),
      isSSR: wixSdkAdapter.isSSR(),
      isPreviewMode: wixSdkAdapter.isPreviewMode(),
      isSEO: wixSdkAdapter.isSEO(),
    };

    if (deepLinkEnabled) {
      bookingsAdditionalConfiguration.onLocationChange(wixCodeApi, () =>
        pageReady(),
      );
    }

    let componentProps;
    try {
      componentProps = {
        ...getMockedProps(),
        locale,
        regionalSettings: widgetData.config.regionalSettings,
        offerings,
        businessInfo,
        categories,
        locations,
        selectedCategories,
        settingsDefaultData,
        settingsUserData,
        cssBaseUrl: staticsBaseUrl,
        translations,
        biLoggerDriver,
        navigationDriver,
        onCategoryChanged,
        setContainerHeight,
        setPropsInPreviewOOI,
        setContainerWidth,
        setContainerDimensions,
        appLoadedCallback,
        ravenUserContextOverrides: {
          id: getRavenSessionIdForApp(appParams),
        },
        canReportLoading: !wixSdkAdapter.isSSR(),
        userMessage,
        platformContext,
        isRTL: platformContext.isRTL,
        experiments: widgetData.config.experiments,
        scale: await wixSdkAdapter.getScale(),
        isCalendarPageInstalled: await wixSdkAdapter.isBookingCalendarInstalled(),
      };
    } catch (e) {
      errorReporter(e);
    }
    setProps(componentProps);
    // some important notes about these props I learned the hard way:
    // - every prop must be serializable, it means no 'complex' objects (simple ones are supported).
    // - you can initiate these objects here and pass arrow functions to their methods.
    // - the offering will have to be fetched from the server and set as prop. There is no other way so don't try.

    if (wixSdkAdapter.isSSR()) {
      fedopsAdapter.logAppLoaded();
    }
  };

  return {
    pageReady,
    updateConfig(_$w, data) {
      if (userData.config.experiments['specs.bookings.EditorOOI'] === 'true') {
        const presetId = data.publicData.COMPONENT?.presetId;
        if (!presetId) {
          return;
        }

        const currentSettingsDefaultData = defaultSettingsDataMap.get(presetId);
        setProps({
          style: {
            styleParams: data,
          },
          settingsDefaultData: currentSettingsDefaultData,
        });
      }
    },
    updateAppSettings: (event, { scope, payload, source }) => {
      if (userData.config.experiments['specs.bookings.EditorOOI'] === 'true') {
        payload = cleanNulls(payload);

        const newProps: any = { settingsUserData: payload };

        if (userData.offerings && userData.offerings.length) {
          const isMultiLocationEnabled =
            userData.config.experiments['specs.bookings.UoUMultiLocationV1'] ===
            'true';
          const { offerings, categories, locations } = filterResources(
            userData.offerings,
            userData.categories,
            userData.locations,
            payload,
            isMultiLocationEnabled,
          );
          newProps.offerings = offerings;
          newProps.categories = categories;
          newProps.locations = locations;
        }
        setProps({
          ...newProps,
        });
      }
    },
  };
};

export const createOfferingListWidgetController = createControllerFactory(
  new OfferingListWidgetAdditionalConfiguration(),
);
export const createMainPageController = createControllerFactory(
  new MainPageAdditionalConfiguration(),
  true,
);
