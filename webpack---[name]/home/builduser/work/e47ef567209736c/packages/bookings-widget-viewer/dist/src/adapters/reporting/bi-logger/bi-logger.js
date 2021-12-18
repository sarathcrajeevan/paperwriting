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
            widgetName: bi_const_1.WIDGET_NAME_PHASE_0,
        });
    }
    BiLogger.prototype.sendCardClick = function(service_id, type, referralInfo) {
        var internalToLogType = {
            INDIVIDUAL: 'ind',
            GROUP: 'class'
        };
        var data = tslib_1.__assign(tslib_1.__assign({}, bi_const_1.WidgetViewerEvents.WIDGET_VIEWER_CARD_CLICK), {
            referralInfo: referralInfo,
            service_id: service_id,
            type: internalToLogType[type] || type
        });
        return this.biLoggerAdapter.log(data);
    };
    BiLogger.prototype.sendViewerOpened = function(serviceId) {
        if (!this.wixSdkAdapter.isEditorMode()) {
            var data = tslib_1.__assign({
                serviceId: serviceId
            }, bi_const_1.WidgetViewerEvents.WIDGET_VIEWER_PAGE_LOADED);
            return this.biLoggerAdapter.log(data);
        }
    };
    BiLogger.prototype.sendExposureTest = function() {
        var data = tslib_1.__assign(tslib_1.__assign({}, bi_const_1.WidgetViewerEvents.WIDGET_VIEWER_EXPOSURE_TEST), {
            is_eligible: true,
            testName: 'Fully opened - specs.BookingsWidgetPhase0Spec',
            triggerName: bi_const_1.BI_EXPOSURE_TRIGGER_NAME,
            postreg_category: 'NA'
        });
        return this.biLoggerAdapter.log(data);
    };
    return BiLogger;
}());
exports.BiLogger = BiLogger;
//# sourceMappingURL=bi-logger.js.map