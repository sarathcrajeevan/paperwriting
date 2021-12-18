"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createMainPageController = exports.createOfferingListWidgetController = exports.createControllerFactory = exports.getMockedProps = void 0;
var tslib_1 = require("tslib");
var bookingsAPI_1 = require("./api/bookingsAPI");
var bi_logger_1 = require("../adapters/reporting/bi-logger/bi-logger");
var WixOOISDKAdapter_1 = require("@wix/bookings-adapter-ooi-wix-sdk/dist/src/WixOOISDKAdapter");
var dummy_offering_dto_1 = require("../domain/dummy-offering-dto");
var fedops_adapter_1 = require("@wix/bookings-adapters-reporting/dist/src/fedops/fedops-adapter");
var sentry_adapter_1 = require("@wix/bookings-adapters-reporting/dist/src/sentry/sentry-adapter");
var app_settings_client_1 = require("@wix/app-settings-client");
var AppSettingsClientAdapter_1 = require("@wix/bookings-adapter-ooi-wix-sdk/dist/src/AppSettingsClientAdapter");
var DefaultSettings_1 = require("../../Shared/appKeys/DefaultSettings");
var navigation_1 = require("./navigation/navigation");
var booking_validations_1 = require("./validation/booking-validations");
var shared_utils_1 = require("../../Server/client-kit/shared-utils");
var analytics_adapter_1 = require("../adapters/reporting/analytics-adapter/analytics-adapter");
var main_page_additional_configuration_1 = require("./bookingsConfiguration/main-page-additional-configuration");
var offering_list_widget_additional_configuration_1 = require("./bookingsConfiguration/offering-list-widget-additional-configuration");
var dummy_category_dto_1 = require("../domain/dummy-category-dto");
var utils_1 = require("../../Shared/utils");
var url_query_params_builder_1 = require("../../Shared/urlQueryParams/url-query-params-builder");
var constant_1 = require("../../Shared/constant");
var navigation_const_1 = require("./navigation/navigation.const");
var bookings_analytics_adapter_1 = require("@wix/bookings-analytics-adapter");

function getMockedProps() {
    return {
        getBusinessId: function() {
            return '';
        },
    };
}
exports.getMockedProps = getMockedProps;

function shouldShowDummyModeInPreviewMode(wixSdkAdapter) {
    return tslib_1.__awaiter(this, void 0, void 0, function() {
        return tslib_1.__generator(this, function(_a) {
            return [2 /*return*/ , (wixSdkAdapter.isPreviewMode() && wixSdkAdapter.isBookCheckoutInstalled())];
        });
    });
}

function shouldShowDummyMode(offerings, wixSdkAdapter) {
    return tslib_1.__awaiter(this, void 0, void 0, function() {
        var hasOfferings;
        return tslib_1.__generator(this, function(_a) {
            hasOfferings = offerings && offerings.length > 0;
            return [2 /*return*/ , (!hasOfferings &&
                (wixSdkAdapter.isEditorMode() ||
                    shouldShowDummyModeInPreviewMode(wixSdkAdapter)))];
        });
    });
}
var initEventListeners = function(settings, setProps, originalWidgetData, wixSdkAdapter) {
    settings.onChange(function(settingsUserData) {
        return tslib_1.__awaiter(void 0, void 0, void 0, function() {
            var newProps, isMultiLocationEnabled, _a, offerings, categories, locations, _b, _c;
            var _d;
            return tslib_1.__generator(this, function(_e) {
                switch (_e.label) {
                    case 0:
                        settingsUserData = utils_1.cleanNulls(settingsUserData);
                        newProps = {
                            settingsUserData: settingsUserData
                        };
                        if (originalWidgetData.offerings && originalWidgetData.offerings.length) {
                            isMultiLocationEnabled = originalWidgetData.config.experiments['specs.bookings.UoUMultiLocationV1'] === 'true';
                            _a = shared_utils_1.filterResources(originalWidgetData.offerings, originalWidgetData.categories, originalWidgetData.locations, settingsUserData, isMultiLocationEnabled), offerings = _a.offerings, categories = _a.categories, locations = _a.locations;
                            newProps.offerings = offerings;
                            newProps.categories = categories;
                            newProps.locations = locations;
                        }
                        _b = setProps;
                        _c = [tslib_1.__assign({}, newProps)];
                        _d = {};
                        return [4 /*yield*/ , wixSdkAdapter.getScale()];
                    case 1:
                        _b.apply(void 0, [tslib_1.__assign.apply(void 0, _c.concat([(_d.scale = _e.sent(), _d)]))]);
                        return [2 /*return*/ ];
                }
            });
        });
    });
    window.Wix.addEventListener('STYLE_PARAMS_CHANGE', function(data) {
        return tslib_1.__awaiter(void 0, void 0, void 0, function() {
            var presetData, currentSettingsDefaultData, _a, siteColors, siteTextPresets;
            return tslib_1.__generator(this, function(_b) {
                switch (_b.label) {
                    case 0:
                        return [4 /*yield*/ , utils_1.getPresetId()];
                    case 1:
                        presetData = _b.sent();
                        if (!(presetData && presetData.presetId)) {
                            return [2 /*return*/ ];
                        }
                        currentSettingsDefaultData = DefaultSettings_1.defaultSettingsDataMap.get(presetData.presetId);
                        return [4 /*yield*/ , utils_1.getCurrentStyles()];
                    case 2:
                        _a = _b.sent(), siteColors = _a[0], siteTextPresets = _a[1];
                        setProps({
                            style: {
                                siteTextPresets: siteTextPresets,
                                siteColors: siteColors,
                                styleParams: data,
                            },
                            settingsDefaultData: currentSettingsDefaultData,
                        });
                        return [2 /*return*/ ];
                }
            });
        });
    });
};
var createSettings = function(_a) {
    var setProps = _a.setProps,
        appDefId = _a.appDefId,
        externalId = _a.externalId,
        originalWidgetData = _a.originalWidgetData,
        wixSdkAdapter = _a.wixSdkAdapter;
    var settings;
    if (wixSdkAdapter.isEditorMode() &&
        originalWidgetData.config.experiments['specs.bookings.EditorOOI'] !== 'true') {
        settings = app_settings_client_1.appClient({
            scope: app_settings_client_1.Scope.COMPONENT
        });
        initEventListeners(settings, setProps, originalWidgetData, wixSdkAdapter);
    } else {
        settings = app_settings_client_1.appClient({
            scope: app_settings_client_1.Scope.COMPONENT,
            adapter: new AppSettingsClientAdapter_1.AppSettingsClientAdapter({
                appDefId: appDefId,
                instanceId: wixSdkAdapter.getInstanceId(),
                externalId: externalId,
            }),
        });
    }
    return settings;
};

function initiateUserMessages(setProps) {
    var userMessage = {
        shouldDisplayMessage: false,
        closeMessage: function() {
            hideMessage();
        },
    };
    var showMessage = function() {
        userMessage.shouldDisplayMessage = true;
        setProps({
            userMessage: userMessage,
        });
    };
    var hideMessage = function() {
        userMessage.shouldDisplayMessage = false;
        setProps({
            userMessage: userMessage,
        });
    };
    return {
        userMessage: userMessage,
        showMessage: showMessage
    };
}
var createControllerFactory = function(bookingsAdditionalConfiguration, deepLinkEnabled) {
    if (deepLinkEnabled === void 0) {
        deepLinkEnabled = false;
    }
    return function(_a, errorReporter) {
        var compId = _a.compId,
            type = _a.type,
            config = _a.config,
            $w = _a.$w,
            warmupData = _a.warmupData,
            setProps = _a.setProps,
            appParams = _a.appParams,
            platformAPIs = _a.platformAPIs,
            wixCodeApi = _a.wixCodeApi;
        if (errorReporter === void 0) {
            errorReporter = function(e) {
                throw e;
            };
        }
        var userData;
        var isEditorX = config.style.styleParams.booleans.responsive;
        var pageReady = function() {
            return tslib_1.__awaiter(void 0, void 0, void 0, function() {
                var wixSdkAdapter, e_1, fedopsAdapter, isLiveSiteNoSSR, serverBaseUrl, staticsBaseUrl, httpAdapter, locale, failedTranslationFetch, bookingsValidations, metaSiteId, configParams, deepLinkOrigin, preSelectedStaff, urlQueryParams, urlQueryParamsBuilder, _a, widgetData, translations, e_2, settings, presetId, settingsDefaultData, getAllSettings, settingsUserData, _b, biLogger, isMultiLocationEnabled, filteredResources, offerings, categories, locations, selectedCategories, isServicePageInstalled, _i, offerings_1, offering, checkoutPageName, servicePageSlug, selectedCategoryQueryValue, isDummyMode, isNewAddPanelEnabled, navigation, biLoggerDriver, _c, userMessage, showMessage, businessInfo, handleNavigation, navigationDriver, appLoadedCallback, setPropsInPreviewOOI, onCategoryChanged, setContainerHeight, setContainerWidth, setContainerDimensions, platformContext, componentProps, _d, e_3;
                var _e;
                return tslib_1.__generator(this, function(_f) {
                    switch (_f.label) {
                        case 0:
                            wixSdkAdapter = new WixOOISDKAdapter_1.WixOOISDKAdapter(wixCodeApi, platformAPIs, appParams, compId);
                            _f.label = 1;
                        case 1:
                            _f.trys.push([1, 3, , 4]);
                            return [4 /*yield*/ , bookingsAdditionalConfiguration.prePageReady(wixSdkAdapter)];
                        case 2:
                            _f.sent();
                            return [3 /*break*/ , 4];
                        case 3:
                            e_1 = _f.sent();
                            errorReporter(e_1);
                            return [3 /*break*/ , 4];
                        case 4:
                            fedopsAdapter = new fedops_adapter_1.FedopsAdapter(wixSdkAdapter, bookingsAdditionalConfiguration.getWidgetId());
                            isLiveSiteNoSSR = wixSdkAdapter.isSiteMode() && !wixSdkAdapter.isSSR();
                            serverBaseUrl = isLiveSiteNoSSR ?
                                wixCodeApi.location.baseUrl + "/" :
                                wixSdkAdapter.getServerBaseUrl();
                            staticsBaseUrl = wixSdkAdapter.getServiceListStaticsBaseUrl();
                            httpAdapter = new bookingsAPI_1.BookingsAPI(appParams.instance, staticsBaseUrl, serverBaseUrl, wixSdkAdapter.getSiteRevision(), wixSdkAdapter.getCsrfToken(), wixSdkAdapter.getViewMode());
                            locale = wixSdkAdapter.getCurrentLanguage();
                            failedTranslationFetch = false;
                            bookingsValidations = new booking_validations_1.BookingValidations(wixSdkAdapter);
                            if (!wixSdkAdapter.isEditorMode() && !wixSdkAdapter.isPreviewMode()) {
                                fedopsAdapter.logInteractionStarted('get-widget-data');
                            }
                            metaSiteId = isLiveSiteNoSSR ? wixSdkAdapter.getMetaSiteId() : '';
                            if (deepLinkEnabled) {
                                urlQueryParams = wixSdkAdapter.getUrlQueryParams();
                                urlQueryParamsBuilder = new url_query_params_builder_1.default();
                                if (urlQueryParams[constant_1.REQUESTED_STAFF_URL_PARAM_NAME]) {
                                    deepLinkOrigin = constant_1.REQUESTED_STAFF_DEEP_LINK_ORIGIN;
                                    preSelectedStaff = urlQueryParams[constant_1.REQUESTED_STAFF_URL_PARAM_NAME];
                                    urlQueryParamsBuilder.add(constant_1.REQUESTED_STAFF_URL_PARAM_NAME, preSelectedStaff);
                                }
                                configParams = urlQueryParamsBuilder.build();
                            }
                            return [4 /*yield*/ , Promise.all([
                                httpAdapter.getWidgetData(config.externalId, true, metaSiteId, configParams),
                                httpAdapter
                                .getTranslations(locale)
                                .catch(function() {
                                    return (failedTranslationFetch = true);
                                }),
                            ]).catch(errorReporter)];
                        case 5:
                            _a = _f.sent(), widgetData = _a[0], translations = _a[1];
                            userData = widgetData;
                            if (!wixSdkAdapter.isEditorMode() && !wixSdkAdapter.isPreviewMode()) {
                                fedopsAdapter.logInteractionEnded('get-widget-data');
                            }
                            if (!(failedTranslationFetch || locale !== widgetData.config.locale)) return [3 /*break*/ , 9];
                            locale = widgetData.config.locale;
                            wixSdkAdapter.setCurrentLanguage(locale);
                            _f.label = 6;
                        case 6:
                            _f.trys.push([6, 8, , 9]);
                            return [4 /*yield*/ , httpAdapter.getTranslations(locale)];
                        case 7:
                            translations = _f.sent();
                            return [3 /*break*/ , 9];
                        case 8:
                            e_2 = _f.sent();
                            errorReporter(new Error("Failed to get translations for new locale - " + locale + ": " + e_2.message));
                            return [3 /*break*/ , 9];
                        case 9:
                            settings = createSettings({
                                setProps: setProps,
                                appDefId: appParams.appDefinitionId,
                                externalId: config.externalId,
                                originalWidgetData: widgetData,
                                wixSdkAdapter: wixSdkAdapter,
                            });
                            if (config.publicData.COMPONENT && config.publicData.COMPONENT.presetId) {
                                presetId = config.publicData.COMPONENT.presetId;
                            } else {
                                presetId =
                                    widgetData.config.experiments['specs.bookings.EditorXContent'] ===
                                    'true' && isEditorX ?
                                    DefaultSettings_1.BOOKINGS_MAIN_PAGE_EDITOR_X_PRESET_ID :
                                    DefaultSettings_1.BOOKINGS_MAIN_PAGE_PRESET_ID;
                            }
                            settingsDefaultData = DefaultSettings_1.defaultSettingsDataMap.get(presetId);
                            getAllSettings = function() {
                                return tslib_1.__awaiter(void 0, void 0, void 0, function() {
                                    var e_4;
                                    return tslib_1.__generator(this, function(_a) {
                                        switch (_a.label) {
                                            case 0:
                                                _a.trys.push([0, 2, , 3]);
                                                return [4 /*yield*/ , settings.getAll()];
                                            case 1:
                                                return [2 /*return*/ , _a.sent()];
                                            case 2:
                                                e_4 = _a.sent();
                                                try {
                                                    errorReporter(e_4);
                                                } catch (_b) {}
                                                return [2 /*return*/ , null];
                                            case 3:
                                                return [2 /*return*/ ];
                                        }
                                    });
                                });
                            };
                            _b = widgetData.config.settings;
                            if (_b) return [3 /*break*/ , 11];
                            return [4 /*yield*/ , getAllSettings()];
                        case 10:
                            _b = (_f.sent());
                            _f.label = 11;
                        case 11:
                            settingsUserData = _b;
                            settingsUserData = utils_1.cleanNulls(settingsUserData);
                            if (settingsUserData &&
                                (presetId === DefaultSettings_1.SINGLE_SERVICE_PRESET_ID ||
                                    presetId === DefaultSettings_1.SINGLE_SERVICE_EDITOR_X_PRESET_ID) &&
                                !settingsUserData.SELECTED_RESOURCES) {
                                settingsUserData.SELECTED_RESOURCES =
                                    settingsDefaultData.SELECTED_RESOURCES;
                            }
                            biLogger = new bi_logger_1.BiLogger(wixSdkAdapter);
                            isMultiLocationEnabled = widgetData.config.experiments['specs.bookings.UoUMultiLocationV1'] ===
                                'true';
                            filteredResources = widgetData.config.resourcesFiltered && widgetData.config.settings ?
                                {
                                    offerings: widgetData.offerings,
                                    categories: widgetData.categories,
                                    locations: widgetData.locations,
                                } :
                                shared_utils_1.filterResources(widgetData.offerings, widgetData.categories, widgetData.locations, settingsUserData, isMultiLocationEnabled);
                            offerings = filteredResources.offerings;
                            categories = filteredResources.categories;
                            locations = filteredResources.locations;
                            selectedCategories = [];
                            return [4 /*yield*/ , wixSdkAdapter.isServicePageInstalled()];
                        case 12:
                            isServicePageInstalled = _f.sent();
                            if (!(widgetData.config.experiments['specs.bookings.ServicePageUpdateHref'] ===
                                    'true' &&
                                    isServicePageInstalled)) return [3 /*break*/ , 16];
                            _i = 0, offerings_1 = offerings;
                            _f.label = 13;
                        case 13:
                            if (!(_i < offerings_1.length)) return [3 /*break*/ , 16];
                            offering = offerings_1[_i];
                            checkoutPageName = '/bookings-checkout';
                            return [4 /*yield*/ , wixSdkAdapter.getServicePageRelativeUrl()];
                        case 14:
                            servicePageSlug = _f.sent();
                            offering.fullUrl = offering.fullUrl.replace(checkoutPageName, servicePageSlug);
                            _f.label = 15;
                        case 15:
                            _i++;
                            return [3 /*break*/ , 13];
                        case 16:
                            if (deepLinkEnabled) {
                                selectedCategoryQueryValue = wixSdkAdapter.getUrlQueryParams()[constant_1.REQUESTED_CATEGORIES_URL_PARAM_NAME];
                                selectedCategories = selectedCategoryQueryValue ?
                                    [selectedCategoryQueryValue] :
                                    selectedCategories;
                            }
                            return [4 /*yield*/ , shouldShowDummyMode(offerings, wixSdkAdapter)];
                        case 17:
                            isDummyMode = _f.sent();
                            categories = isDummyMode ? dummy_category_dto_1.createDummyCategoriesDto(presetId) : categories;
                            isNewAddPanelEnabled = widgetData.config.experiments.se_wixBookings_newAddPanel === 'new' &&
                                widgetData.config.experiments.apd_presetsRedesign === 'new';
                            offerings = isDummyMode ?
                                dummy_offering_dto_1.createDummyOfferingsDto(presetId, isNewAddPanelEnabled) :
                                offerings;
                            navigation = new navigation_1.Navigation(wixSdkAdapter, compId);
                            biLoggerDriver = {
                                sendAllServicesCategoryExposure: function(data) {
                                    return biLogger.sendAllServicesCategoryExposure(data);
                                },
                                sendViewerOpened: function(serviceId) {
                                    return biLogger.sendViewerOpened(serviceId, deepLinkOrigin);
                                },
                                sendWidgetClick: function(serviceId, offeringType, isPendingApproval, referralInfo, actionName) {
                                    return biLogger.sendWidgetClick(serviceId, offeringType, isPendingApproval, referralInfo, actionName);
                                },
                            };
                            _c = initiateUserMessages(setProps), userMessage = _c.userMessage, showMessage = _c.showMessage;
                            businessInfo = widgetData.config.businessInfo;
                            handleNavigation = function(offering, intent, locationId) {
                                var activeFeatures = JSON.parse(widgetData.config.activeFeatures);
                                bookingsValidations
                                    .shouldNavigate(offering, activeFeatures, intent)
                                    .then(function(_a) {
                                        var canBook = _a.canBook,
                                            reason = _a.reason;
                                        if (canBook) {
                                            var useAnalyticsAdapter = widgetData.config.experiments['specs.bookings.analyticsOOI'] ===
                                                'true';
                                            if (useAnalyticsAdapter) {
                                                var data = {
                                                    service: offering,
                                                    businessName: businessInfo.name,
                                                };
                                                var trackingInfo = intent === navigation_const_1.OfferingIntent.BOOK_OFFERING ?
                                                    bookings_analytics_adapter_1.getTrackingInfoForBookButtonClick(data) :
                                                    bookings_analytics_adapter_1.getTrackingInfoForNavigateToServicePageClick(data);
                                                wixSdkAdapter.trackAnalytics(trackingInfo);
                                            } else {
                                                analytics_adapter_1.logToGoogleAnalytics(intent, businessInfo.name, offering, wixSdkAdapter.isEditorMode(), function(trackEvid, payload) {
                                                    return wixSdkAdapter.trackEvent(trackEvid, payload);
                                                });
                                            }
                                            var isStaffPreselectionEnabled = widgetData.config.experiments['specs.bookings.StaffQueryParamInCalendar'] === 'true';
                                            if (isStaffPreselectionEnabled) {
                                                navigation
                                                    .navigateToApp({
                                                        offering: offering,
                                                        intent: intent,
                                                        staff: preSelectedStaff,
                                                        location: locationId,
                                                        isStaffPreselectionEnabled: isStaffPreselectionEnabled,
                                                    })
                                                    .catch(console.log);
                                            } else {
                                                navigation
                                                    .navigateToApp({
                                                        offering: offering,
                                                        intent: intent,
                                                        location: locationId
                                                    })
                                                    .catch(console.log);
                                            }
                                        } else {
                                            if (reason) {
                                                if (reason.premiumError) {
                                                    httpAdapter
                                                        .notifyOwnerNonPremiumEnrollmentAttempt()
                                                        .then(function() {
                                                            return null;
                                                        })
                                                        .catch(console.error);
                                                } else if (reason.pricingPlanError) {
                                                    httpAdapter
                                                        .notifyOwnerNonPricingPlanEnrollmentAttempt(booking_validations_1.getNotifyPricingPlanRequest(offering, reason))
                                                        .then(function() {
                                                            return null;
                                                        })
                                                        .catch(console.error);
                                                }
                                            }
                                            biLogger.sendCantBookGroup().catch(console.log);
                                            showMessage();
                                        }
                                    })
                                    .catch(console.log);
                            };
                            navigationDriver = {
                                navigateToApp: function(offering, intent, locationId) {
                                    handleNavigation(offering, intent, locationId);
                                },
                            };
                            appLoadedCallback = function() {
                                fedopsAdapter.logAppLoaded();
                            };
                            setPropsInPreviewOOI = function() {
                                if (wixSdkAdapter.isPreviewMode() && !wixSdkAdapter.isRunningInIframe()) {
                                    setProps({});
                                }
                            };
                            onCategoryChanged = function(selectedCategorySlug) {
                                if (deepLinkEnabled) {
                                    wixSdkAdapter.setUrlQueryParam(constant_1.REQUESTED_CATEGORIES_URL_PARAM_NAME, selectedCategorySlug);
                                }
                            };
                            setContainerHeight = function(newHeight) {
                                if (widgetData.config.experiments['specs.bookings.WidgetRemoveWindowUses'] !== 'true') {
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
                            setContainerWidth = function(width) {
                                if (widgetData.config.experiments['specs.bookings.WidgetRemoveWindowUses'] !== 'true') {
                                    if (wixSdkAdapter.isEditorMode()) {
                                        window.Wix.resizeComponent({
                                            width: width,
                                        });
                                    }
                                }
                            };
                            setContainerDimensions = function(newWidth, newHeight) {
                                if (widgetData.config.experiments['specs.bookings.WidgetRemoveWindowUses'] !== 'true') {
                                    if (wixSdkAdapter.isEditorMode()) {
                                        wixSdkAdapter.setContainerDimensions(newWidth, newHeight);
                                    }
                                }
                            };
                            platformContext = {
                                isDummyMode: isDummyMode,
                                isRTL: wixSdkAdapter.isViewDirectionRtl(),
                                isEditorMode: wixSdkAdapter.isEditorMode(),
                                isSSR: wixSdkAdapter.isSSR(),
                                isPreviewMode: wixSdkAdapter.isPreviewMode(),
                                isSEO: wixSdkAdapter.isSEO(),
                            };
                            if (deepLinkEnabled) {
                                bookingsAdditionalConfiguration.onLocationChange(wixCodeApi, function() {
                                    return pageReady();
                                });
                            }
                            _f.label = 18;
                        case 18:
                            _f.trys.push([18, 21, , 22]);
                            _d = [tslib_1.__assign({}, getMockedProps())];
                            _e = {
                                locale: locale,
                                regionalSettings: widgetData.config.regionalSettings,
                                offerings: offerings,
                                businessInfo: businessInfo,
                                categories: categories,
                                locations: locations,
                                selectedCategories: selectedCategories,
                                settingsDefaultData: settingsDefaultData,
                                settingsUserData: settingsUserData,
                                cssBaseUrl: staticsBaseUrl,
                                translations: translations,
                                biLoggerDriver: biLoggerDriver,
                                navigationDriver: navigationDriver,
                                onCategoryChanged: onCategoryChanged,
                                setContainerHeight: setContainerHeight,
                                setPropsInPreviewOOI: setPropsInPreviewOOI,
                                setContainerWidth: setContainerWidth,
                                setContainerDimensions: setContainerDimensions,
                                appLoadedCallback: appLoadedCallback,
                                ravenUserContextOverrides: {
                                    id: sentry_adapter_1.getRavenSessionIdForApp(appParams),
                                },
                                canReportLoading: !wixSdkAdapter.isSSR(),
                                userMessage: userMessage,
                                platformContext: platformContext,
                                isRTL: platformContext.isRTL,
                                experiments: widgetData.config.experiments
                            };
                            return [4 /*yield*/ , wixSdkAdapter.getScale()];
                        case 19:
                            _e.scale = _f.sent();
                            return [4 /*yield*/ , wixSdkAdapter.isBookingCalendarInstalled()];
                        case 20:
                            componentProps = tslib_1.__assign.apply(void 0, _d.concat([(_e.isCalendarPageInstalled = _f.sent(), _e)]));
                            return [3 /*break*/ , 22];
                        case 21:
                            e_3 = _f.sent();
                            errorReporter(e_3);
                            return [3 /*break*/ , 22];
                        case 22:
                            setProps(componentProps);
                            // some important notes about these props I learned the hard way:
                            // - every prop must be serializable, it means no 'complex' objects (simple ones are supported).
                            // - you can initiate these objects here and pass arrow functions to their methods.
                            // - the offering will have to be fetched from the server and set as prop. There is no other way so don't try.
                            if (wixSdkAdapter.isSSR()) {
                                fedopsAdapter.logAppLoaded();
                            }
                            return [2 /*return*/ ];
                    }
                });
            });
        };
        return {
            pageReady: pageReady,
            updateConfig: function(_$w, data) {
                var _a;
                if (userData.config.experiments['specs.bookings.EditorOOI'] === 'true') {
                    var presetId = (_a = data.publicData.COMPONENT) === null || _a === void 0 ? void 0 : _a.presetId;
                    if (!presetId) {
                        return;
                    }
                    var currentSettingsDefaultData = DefaultSettings_1.defaultSettingsDataMap.get(presetId);
                    setProps({
                        style: {
                            styleParams: data,
                        },
                        settingsDefaultData: currentSettingsDefaultData,
                    });
                }
            },
            updateAppSettings: function(event, _a) {
                var scope = _a.scope,
                    payload = _a.payload,
                    source = _a.source;
                if (userData.config.experiments['specs.bookings.EditorOOI'] === 'true') {
                    payload = utils_1.cleanNulls(payload);
                    var newProps = {
                        settingsUserData: payload
                    };
                    if (userData.offerings && userData.offerings.length) {
                        var isMultiLocationEnabled = userData.config.experiments['specs.bookings.UoUMultiLocationV1'] ===
                            'true';
                        var _b = shared_utils_1.filterResources(userData.offerings, userData.categories, userData.locations, payload, isMultiLocationEnabled),
                            offerings = _b.offerings,
                            categories = _b.categories,
                            locations = _b.locations;
                        newProps.offerings = offerings;
                        newProps.categories = categories;
                        newProps.locations = locations;
                    }
                    setProps(tslib_1.__assign({}, newProps));
                }
            },
        };
    };
};
exports.createControllerFactory = createControllerFactory;
exports.createOfferingListWidgetController = exports.createControllerFactory(new offering_list_widget_additional_configuration_1.OfferingListWidgetAdditionalConfiguration());
exports.createMainPageController = exports.createControllerFactory(new main_page_additional_configuration_1.MainPageAdditionalConfiguration(), true);
//# sourceMappingURL=offering-list-widget-controller.js.map