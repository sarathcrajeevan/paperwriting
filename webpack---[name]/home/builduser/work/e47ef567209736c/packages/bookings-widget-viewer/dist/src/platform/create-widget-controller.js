"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createWidgetController = exports.doNavigationFailureCallback = exports.manageNavigation = exports.getMockedProps = void 0;
var tslib_1 = require("tslib");
var offering_display_options_1 = require("../business-logic/offering-display-options");
var bookingsAPI_1 = require("./bookingsAPI");
var booking_validations_1 = require("./booking-validations");
var analytics_adapter_1 = require("../adapters/reporting/analytics-adapter");
var bi_logger_1 = require("../adapters/reporting/bi-logger/bi-logger");
var navigation_1 = require("./navigation");
var WixOOISDKAdapter_1 = require("@wix/bookings-adapter-ooi-wix-sdk/dist/src/WixOOISDKAdapter");
var offering_domain_1 = require("../domain/offering-domain");
var fedops_adapter_1 = require("@wix/bookings-adapters-reporting/dist/src/fedops/fedops-adapter");
var sentry_adapter_1 = require("@wix/bookings-adapters-reporting/dist/src/sentry/sentry-adapter");
var bookings_uou_domain_1 = require("@wix/bookings-uou-domain");

function getMockedProps() {
    return {
        getBusinessId: function() {
            return '';
        },
    };
}
exports.getMockedProps = getMockedProps;
var manageNavigation = function(navigation, offering, intent, businessInfoName, trackEventCallback, isEditorMode, biLogger, biReferral) {
    return tslib_1.__awaiter(void 0, void 0, void 0, function() {
        return tslib_1.__generator(this, function(_a) {
            switch (_a.label) {
                case 0:
                    analytics_adapter_1.logToGoogleAnalytics(intent, businessInfoName, offering, isEditorMode, trackEventCallback);
                    biLogger.sendCardClick(offering.id, offering.type, biReferral);
                    return [4 /*yield*/ , navigation.navigateToApp(intent)];
                case 1:
                    _a.sent();
                    return [2 /*return*/ ];
            }
        });
    });
};
exports.manageNavigation = manageNavigation;

function doNavigationFailureCallback(biLogger, offering, biReferral, bookingPossible, httpAdapter, bookingsValidations) {
    biLogger.sendCardClick(offering.id, offering.type, biReferral);
    bookingsValidations.notifyingNonPricingPlanEnrollmentAttempt(offering, bookingPossible.reason, httpAdapter.notifyOwnerNonPricingPlanEnrollmentAttempt);
}
exports.doNavigationFailureCallback = doNavigationFailureCallback;

function initiateOffering(widgetData, wixSdkAdapter) {
    var offering = widgetData.injectedSelectedOffering;
    if (!offering || offering === 'null') {
        var dummyOfferingContext = wixSdkAdapter.isEditorMode() ?
            offering_domain_1.DummyOfferingContext.EDITOR_MODE :
            offering_domain_1.DummyOfferingContext.VIEWER_MODE;
        offering = offering_domain_1.createDummyOfferingDto(dummyOfferingContext);
    }
    return offering;
}

function getNavigationSuccessCallback(navigation, offering, businessInfo, wixSdkAdapter, biLogger) {
    return tslib_1.__awaiter(this, void 0, void 0, function() {
        var _this = this;
        return tslib_1.__generator(this, function(_a) {
            return [2 /*return*/ , function(intent, biReferral) {
                return tslib_1.__awaiter(_this, void 0, void 0, function() {
                    return tslib_1.__generator(this, function(_a) {
                        switch (_a.label) {
                            case 0:
                                return [4 /*yield*/ , exports.manageNavigation(navigation, offering, intent, businessInfo.name, function(trackEvid, payload) {
                                    return wixSdkAdapter.trackEvent(trackEvid, payload);
                                }, wixSdkAdapter.isEditorMode(), biLogger, biReferral)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/ ];
                        }
                    });
                });
            }];
        });
    });
}

function getNavigationFailureCallback(biLogger, offering, bookingPossible, httpAdapter, bookingsValidations) {
    return function(biReferral) {
        doNavigationFailureCallback(biLogger, offering, biReferral, bookingPossible, httpAdapter, bookingsValidations);
    };
}

function getWidgetInformation(httpAdapter, compId, wixSdkAdapter) {
    return tslib_1.__awaiter(this, void 0, void 0, function() {
        var locale, _a, widgetData, translations;
        return tslib_1.__generator(this, function(_b) {
            switch (_b.label) {
                case 0:
                    locale = wixSdkAdapter.getCurrentLanguage();
                    return [4 /*yield*/ , Promise.all([
                        httpAdapter.getWidgetData(compId, locale),
                        httpAdapter.getTranslations(locale).catch(function() {
                            // Locale is not supported in bookings - will use the locale from our server
                            return {};
                        }),
                    ])];
                case 1:
                    _a = _b.sent(), widgetData = _a[0], translations = _a[1];
                    if (!(widgetData.locale && locale !== widgetData.locale)) return [3 /*break*/ , 3];
                    wixSdkAdapter.setCurrentLanguage(widgetData.locale);
                    locale = wixSdkAdapter.getCurrentLanguage();
                    return [4 /*yield*/ , httpAdapter.getTranslations(locale)];
                case 2:
                    translations = _b.sent();
                    _b.label = 3;
                case 3:
                    return [2 /*return*/ , {
                        widgetData: widgetData,
                        translations: translations,
                        locale: locale
                    }];
            }
        });
    });
}
var createWidgetController = function(_a) {
    var compId = _a.compId,
        type = _a.type,
        config = _a.config,
        $w = _a.$w,
        warmupData = _a.warmupData,
        setProps = _a.setProps,
        appParams = _a.appParams,
        platformAPIs = _a.platformAPIs,
        wixCodeApi = _a.wixCodeApi;
    return {
        pageReady: function() {
            return tslib_1.__awaiter(this, void 0, void 0, function() {
                var wixSdkAdapter, fedopsAdapter, staticsBaseUrl, httpAdapter, bookingsValidations, _a, widgetData, translations, locale, offering, navigation, businessInfo, activeFeatures, biLogger, bookingPossible, _b, navigationSuccessCallback, navigationFailureCallback, appLoadedCallback, controllerProps;
                return tslib_1.__generator(this, function(_c) {
                    switch (_c.label) {
                        case 0:
                            wixSdkAdapter = new WixOOISDKAdapter_1.WixOOISDKAdapter(wixCodeApi, platformAPIs, appParams, compId);
                            fedopsAdapter = new fedops_adapter_1.FedopsAdapter(wixSdkAdapter, bookings_uou_domain_1.BOOKINGS_WIDGET_ID);
                            staticsBaseUrl = wixSdkAdapter.getStaticsBaseUrl();
                            httpAdapter = new bookingsAPI_1.BookingsAPI(appParams.instance, staticsBaseUrl, wixSdkAdapter.getServerBaseUrl(), wixSdkAdapter.getSiteRevision(), wixSdkAdapter.getCsrfToken());
                            bookingsValidations = new booking_validations_1.BookingValidations(wixSdkAdapter);
                            if (!wixSdkAdapter.isEditorMode() && !wixSdkAdapter.isPreviewMode()) {
                                fedopsAdapter.logInteractionStarted('get-widget-data');
                            }
                            return [4 /*yield*/ , getWidgetInformation(httpAdapter, compId, wixSdkAdapter)];
                        case 1:
                            _a = _c.sent(), widgetData = _a.widgetData, translations = _a.translations, locale = _a.locale;
                            if (!wixSdkAdapter.isEditorMode() && !wixSdkAdapter.isPreviewMode()) {
                                fedopsAdapter.logInteractionEnded('get-widget-data');
                            }
                            offering = initiateOffering(widgetData, wixSdkAdapter);
                            navigation = new navigation_1.Navigation(wixSdkAdapter, compId, offering);
                            businessInfo = widgetData.injectedBusinessInfo;
                            activeFeatures = JSON.parse(widgetData.activeFeatures);
                            biLogger = new bi_logger_1.BiLogger(wixSdkAdapter);
                            biLogger.sendExposureTest();
                            if (!(offering && offering !== 'null' && !offering.dummy)) return [3 /*break*/ , 3];
                            return [4 /*yield*/ , bookingsValidations.canBook(offering, activeFeatures)];
                        case 2:
                            _b = _c.sent();
                            return [3 /*break*/ , 4];
                        case 3:
                            _b = {
                                canBook: false,
                                reason: {}
                            };
                            _c.label = 4;
                        case 4:
                            bookingPossible = _b;
                            return [4 /*yield*/ , getNavigationSuccessCallback(navigation, offering, businessInfo, wixSdkAdapter, biLogger)];
                        case 5:
                            navigationSuccessCallback = _c.sent();
                            navigationFailureCallback = getNavigationFailureCallback(biLogger, offering, bookingPossible, httpAdapter, bookingsValidations);
                            appLoadedCallback = function() {
                                biLogger.sendViewerOpened(offering.id);
                                fedopsAdapter.logAppLoaded();
                            };
                            controllerProps = tslib_1.__assign(tslib_1.__assign({}, getMockedProps()), {
                                locale: locale,
                                offering: offering,
                                offeringDisplayOptions: offering_display_options_1.getDisplayOptions(config.publicData.COMPONENT),
                                cssBaseUrl: staticsBaseUrl,
                                translations: translations,
                                bookingPossible: bookingPossible.canBook,
                                ravenUserContextOverrides: {
                                    id: sentry_adapter_1.getRavenSessionIdForApp(appParams),
                                },
                                sendViewerOpenedEventCallback: appLoadedCallback,
                                offeringActionCallback: navigationSuccessCallback,
                                bookItFailureCallback: navigationFailureCallback,
                                isRTL: wixSdkAdapter.isViewDirectionRtl(),
                                canReportLoading: !wixSdkAdapter.isSSR()
                            });
                            setProps(controllerProps);
                            // some important notes about these props I learned the hard way:
                            // - every prop must be serializable, it means NO FUNCTIONS, their activation will be undefined in the other side.
                            // - the offering will have to be fetched from the server and set as prop. There is no other way so don't try.
                            if (wixSdkAdapter.isSSR()) {
                                fedopsAdapter.logAppLoaded();
                            }
                            return [2 /*return*/ ];
                    }
                });
            });
        },
    };
};
exports.createWidgetController = createWidgetController;
//# sourceMappingURL=create-widget-controller.js.map