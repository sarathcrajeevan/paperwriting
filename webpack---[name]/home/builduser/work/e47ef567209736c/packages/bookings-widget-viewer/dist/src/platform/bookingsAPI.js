"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BookingsAPI = void 0;
var tslib_1 = require("tslib");
var bookings_adapter_http_api_1 = require("@wix/bookings-adapter-http-api");
var BookingsAPI = /** @class */ (function() {
    function BookingsAPI(instance, staticsBaseUrl, serverBaseUrl, siteRevision, csrfToken) {
        var _this = this;
        this.staticsBaseUrl = staticsBaseUrl;
        this.serverBaseUrl = serverBaseUrl;
        this.siteRevision = siteRevision;
        this.csrfToken = csrfToken;
        this.notifyOwnerNonPricingPlanEnrollmentAttempt = function(data) {
            return tslib_1.__awaiter(_this, void 0, void 0, function() {
                return tslib_1.__generator(this, function(_a) {
                    return [2 /*return*/ , this.httpAdapter.post(this.serverBaseUrl + "_api/bookings-viewer/visitor/pricing-plans/invalidSetup", data)];
                });
            });
        };
        this.httpAdapter = bookings_adapter_http_api_1.default(instance, siteRevision, csrfToken);
    }
    BookingsAPI.prototype.getTranslations = function(locale) {
        return tslib_1.__awaiter(this, void 0, void 0, function() {
            return tslib_1.__generator(this, function(_a) {
                return [2 /*return*/ , this.httpAdapter.get(this.staticsBaseUrl + "assets/locales/messages_" + locale + ".json", null)];
            });
        });
    };
    BookingsAPI.prototype.getWidgetData = function(compId, locale) {
        return tslib_1.__awaiter(this, void 0, void 0, function() {
            return tslib_1.__generator(this, function(_a) {
                return [2 /*return*/ , this.canUseInjectedData() ?
                    this.getWidgetDataFromWindow() :
                    this.httpAdapter.get(this.serverBaseUrl + "_api/bookings-viewer/widget/config?compId=" + compId + "&locale=" + locale)
                ];
            });
        });
    };
    BookingsAPI.prototype.canUseInjectedData = function() {
        return (typeof window !== 'undefined' &&
            window.__OFFERING__ &&
            window.__LOCALE__ &&
            window.__ACTIVE_FEATURES__ &&
            window.__EXPERIMENTS__ &&
            window.__BUSINESS_INFO__);
    };
    BookingsAPI.prototype.getWidgetDataFromWindow = function() {
        return tslib_1.__awaiter(this, void 0, void 0, function() {
            return tslib_1.__generator(this, function(_a) {
                return [2 /*return*/ , {
                    injectedBusinessInfo: JSON.parse(window.__BUSINESS_INFO__),
                    locale: window.__LOCALE__,
                    activeFeatures: window.__ACTIVE_FEATURES__,
                    injectedSelectedOffering: JSON.parse(window.__OFFERING__),
                    experimentsMap: window.__EXPERIMENTS__,
                }];
            });
        });
    };
    return BookingsAPI;
}());
exports.BookingsAPI = BookingsAPI;
//# sourceMappingURL=bookingsAPI.js.map