"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BiLogger = void 0;
var tslib_1 = require("tslib");
var bi_const_1 = require("./bi.const");
var platform_bi_logger_adapter_1 = require("@wix/bookings-adapters-reporting/dist/src/bi-logger/platform-logger/platform-bi-logger-adapter");
var BiLogger = /** @class */ (function() {
    function BiLogger(wixSdkAdapter) {
        this.wixSdkAdapter = wixSdkAdapter;
        this.biLoggerAdapter = new platform_bi_logger_adapter_1.PlatformBiLoggerAdapter({
            wixSdkAdapter: wixSdkAdapter,
            widgetName: bi_const_1.WIDGET_NAME_PHASE_1,
        });
    }
    BiLogger.prototype.sendWidgetClick = function(service_id, type, isPendingApproval, referralInfo, actionName) {
        return tslib_1.__awaiter(this, void 0, void 0, function() {
            var data;
            return tslib_1.__generator(this, function(_a) {
                data = tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, bi_const_1.WidgetViewerEvents.WIDGET_VIEWER_CLICK), {
                    referralInfo: referralInfo,
                    service_id: service_id,
                    isPendingApproval: isPendingApproval,
                    type: bi_const_1.BI_OFFERING_TYPE[type] || type
                }), (actionName ? {
                    actionName: actionName
                } : {}));
                return [2 /*return*/ , this.biLoggerAdapter.log(data)];
            });
        });
    };
    BiLogger.prototype.sendViewerOpened = function(numOfServices, origin) {
        return tslib_1.__awaiter(this, void 0, void 0, function() {
            var data;
            return tslib_1.__generator(this, function(_a) {
                if (!this.wixSdkAdapter.isEditorMode()) {
                    data = tslib_1.__assign({
                        origin: origin,
                        numOfServices: numOfServices
                    }, bi_const_1.WidgetViewerEvents.WIDGET_VIEWER_PAGE_LOADED);
                    return [2 /*return*/ , this.biLoggerAdapter.log(data)];
                }
                return [2 /*return*/ ];
            });
        });
    };
    BiLogger.prototype.sendCantBookGroup = function() {
        return tslib_1.__awaiter(this, void 0, void 0, function() {
            var data;
            return tslib_1.__generator(this, function(_a) {
                data = tslib_1.__assign(tslib_1.__assign({}, bi_const_1.WidgetViewerEvents.WIDGET_CANT_BOOK_GROUPS), {
                    referralInfo: bi_const_1.WIDGET_BI_REFERRAL.WIDGET
                });
                return [2 /*return*/ , this.biLoggerAdapter.log(data)];
            });
        });
    };
    BiLogger.prototype.sendAllServicesCategoryExposure = function(_a) {
        var isMobile = _a.isMobile,
            isExposedToTest = _a.isExposedToTest,
            allServicesCategorySettingsValue = _a.allServicesCategorySettingsValue,
            allServicesCategoryShown = _a.allServicesCategoryShown;
        return tslib_1.__awaiter(this, void 0, void 0, function() {
            return tslib_1.__generator(this, function(_b) {
                return [2 /*return*/ , this.biLoggerAdapter.log(tslib_1.__assign(tslib_1.__assign({}, bi_const_1.WidgetViewerEvents.WIDGET_ALL_SERVICES_CATEGORY_EXPOSURE), {
                    isMobile: isMobile,
                    experimentValue: isExposedToTest ? 'B' : 'A',
                    categoryExists: allServicesCategoryShown,
                    categoryToggle: allServicesCategorySettingsValue
                }))];
            });
        });
    };
    return BiLogger;
}());
exports.BiLogger = BiLogger;
//# sourceMappingURL=bi-logger.js.map