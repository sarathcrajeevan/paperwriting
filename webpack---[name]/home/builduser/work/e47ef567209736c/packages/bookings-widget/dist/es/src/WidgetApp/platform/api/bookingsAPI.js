"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BookingsAPI = void 0;
var tslib_1 = require("tslib");
var bookings_adapter_http_api_1 = require("@wix/bookings-adapter-http-api");
var url_query_params_builder_1 = require("../../../Shared/urlQueryParams/url-query-params-builder");
var BookingsAPI = /** @class */ (function() {
    function BookingsAPI(instance, staticsBaseUrl, serverBaseUrl, siteRevision, csrfToken, viewMode) {
        var _this = this;
        if (siteRevision === void 0) {
            siteRevision = null;
        }
        if (csrfToken === void 0) {
            csrfToken = null;
        }
        this.staticsBaseUrl = staticsBaseUrl;
        this.serverBaseUrl = serverBaseUrl;
        this.siteRevision = siteRevision;
        this.csrfToken = csrfToken;
        this.viewMode = viewMode;
        this.notifyOwnerNonPricingPlanEnrollmentAttempt = function(data) {
            return tslib_1.__awaiter(_this, void 0, void 0, function() {
                var base;
                return tslib_1.__generator(this, function(_a) {
                    switch (_a.label) {
                        case 0:
                            return [4 /*yield*/ , this.getBookingsPrefixUrl()];
                        case 1:
                            base = _a.sent();
                            return [2 /*return*/ , this.httpAdapter.post(base + "/pricing-plans/invalidSetup", data)];
                    }
                });
            });
        };
        this.notifyOwnerNonPremiumEnrollmentAttempt = function() {
            return tslib_1.__awaiter(_this, void 0, void 0, function() {
                var base;
                return tslib_1.__generator(this, function(_a) {
                    switch (_a.label) {
                        case 0:
                            return [4 /*yield*/ , this.getBookingsPrefixUrl()];
                        case 1:
                            base = _a.sent();
                            return [2 /*return*/ , this.httpAdapter.post(base + "/classes/nonPremium", '')];
                    }
                });
            });
        };
        this.httpAdapter = bookings_adapter_http_api_1.default(instance, siteRevision, csrfToken);
    }
    BookingsAPI.prototype.getTranslations = function(locale) {
        return tslib_1.__awaiter(this, void 0, void 0, function() {
            return tslib_1.__generator(this, function(_a) {
                return [2 /*return*/ , this.httpAdapter.get(this.staticsBaseUrl + "assets/locales/WidgetApp/messages_" + locale + ".json", null)];
            });
        });
    };
    BookingsAPI.prototype.getWidgetData = function(externalId, allowInjection, metaSiteId, configParams) {
        if (allowInjection === void 0) {
            allowInjection = true;
        }
        if (configParams === void 0) {
            configParams = '';
        }
        return tslib_1.__awaiter(this, void 0, void 0, function() {
            var widgetQueryParam;
            return tslib_1.__generator(this, function(_a) {
                widgetQueryParam = new url_query_params_builder_1.default(configParams)
                    .add('cacheId', metaSiteId)
                    .add('externalId', externalId)
                    .add('viewMode', this.viewMode)
                    .build();
                return [2 /*return*/ , this.canUseInjectedData(allowInjection) ?
                    this.getWidgetDataFromWindow() :
                    this.httpAdapter.get(this.serverBaseUrl + "_api/bookings-widget/config" + widgetQueryParam)
                ];
            });
        });
    };
    BookingsAPI.prototype.getBookingsPrefixUrl = function() {
        return tslib_1.__awaiter(this, void 0, void 0, function() {
            return tslib_1.__generator(this, function(_a) {
                return [2 /*return*/ , "/_api/bookings-viewer/visitor"];
            });
        });
    };
    BookingsAPI.prototype.canUseInjectedData = function(allowInjection) {
        return (allowInjection &&
            typeof window !== 'undefined' &&
            window.__OFFERINGS__ &&
            window.__CATEGORIES__ &&
            window.__ACTIVE_FEATURES__ &&
            window.__BUSINESS_INFO__ &&
            window.__EXPERIMENTS__ &&
            window.__LOCALE__ &&
            window.__REGIONAL_SETTINGS__ &&
            window.__BI_PROPS__);
    };
    BookingsAPI.prototype.getWidgetDataFromWindow = function() {
        return tslib_1.__awaiter(this, void 0, void 0, function() {
            return tslib_1.__generator(this, function(_a) {
                return [2 /*return*/ , {
                    offerings: JSON.parse(window.__OFFERINGS__),
                    categories: JSON.parse(window.__CATEGORIES__),
                    locations: JSON.parse(window.__LOCATIONS__),
                    config: {
                        resourcesFiltered: false,
                        businessInfo: JSON.parse(window.__BUSINESS_INFO__),
                        activeFeatures: window.__ACTIVE_FEATURES__,
                        experiments: JSON.parse(window.__EXPERIMENTS__),
                        locale: window.__LOCALE__,
                        regionalSettings: window.__REGIONAL_SETTINGS__,
                        biProps: JSON.parse(window.__BI_PROPS__),
                    },
                }];
            });
        });
    };
    return BookingsAPI;
}());
exports.BookingsAPI = BookingsAPI;
//# sourceMappingURL=bookingsAPI.js.map