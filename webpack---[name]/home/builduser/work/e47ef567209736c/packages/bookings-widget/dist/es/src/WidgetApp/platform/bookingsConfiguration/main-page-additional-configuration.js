"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MainPageAdditionalConfiguration = void 0;
var tslib_1 = require("tslib");
var bookings_uou_domain_1 = require("@wix/bookings-uou-domain");
var bookings_const_1 = require("../../constants/bookings.const");
var MainPageAdditionalConfiguration = /** @class */ (function() {
    function MainPageAdditionalConfiguration() {
        var _this = this;
        this.getWidgetId = function() {
            return bookings_uou_domain_1.BOOKINGS_LIST_PAGE_ID;
        };
        this.getWidgetName = function() {
            return bookings_const_1.FEDOPS_MAIN_PAGE_WIDGET_EDITOR;
        };
        this.prePageReady = function(wixOOISDKAdapter) {
            return tslib_1.__awaiter(_this, void 0, void 0, function() {
                var suffix;
                return tslib_1.__generator(this, function(_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!wixOOISDKAdapter.isRunningInIframe()) return [3 /*break*/ , 4];
                            return [4 /*yield*/ , wixOOISDKAdapter.getBookingsUrlSuffix()];
                        case 1:
                            suffix = _a.sent();
                            return [4 /*yield*/ , shouldNavigateToBookCheckout(wixOOISDKAdapter, suffix)];
                        case 2:
                            if (!_a.sent()) return [3 /*break*/ , 4];
                            return [4 /*yield*/ , wixOOISDKAdapter.navigateToBookingsWithSuffix(suffix)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            return [2 /*return*/ ];
                    }
                });
            });
        };
        this.onLocationChange = function(wixCodeApi, callback) {
            var path = wixCodeApi.location.path;
            wixCodeApi.location.onChange(function(data) {
                if (data.path[0] === path[0]) {
                    callback();
                }
            });
        };
    }
    return MainPageAdditionalConfiguration;
}());
exports.MainPageAdditionalConfiguration = MainPageAdditionalConfiguration;

function shouldNavigateToBookCheckout(wixOOISDKAdapter, suffix) {
    return tslib_1.__awaiter(this, void 0, void 0, function() {
        var bookCheckoutInstalled;
        return tslib_1.__generator(this, function(_a) {
            switch (_a.label) {
                case 0:
                    return [4 /*yield*/ , wixOOISDKAdapter.isBookCheckoutInstalled()];
                case 1:
                    bookCheckoutInstalled = _a.sent();
                    return [2 /*return*/ , bookCheckoutInstalled && !!suffix];
            }
        });
    });
}
//# sourceMappingURL=main-page-additional-configuration.js.map