"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PlatformBiLoggerAdapter = void 0;
var bi_logger_const_1 = require("../bi-logger.const");
var platform_bookings_bi_defaults_1 = require("./platform-bookings-bi-defaults");
var PlatformBiLoggerAdapter = /** @class */ (function() {
    function PlatformBiLoggerAdapter(_a) {
        var wixSdkAdapter = _a.wixSdkAdapter,
            widgetName = _a.widgetName;
        this.shouldLogBi = true;
        var platformAPIs = wixSdkAdapter.getPlatformAPIs();
        var biLoggerDefaultConfigurations = platform_bookings_bi_defaults_1.getPlatformBiLoggerDefaultsConfig(wixSdkAdapter, widgetName);
        if (wixSdkAdapter.isSSR()) {
            this.shouldLogBi = false;
        } else if (wixSdkAdapter.isRunningInIframe()) {
            this.logger = platformAPIs
                .biLoggerFactory()
                // @ts-ignore
                .factory()
                .updateDefaults(biLoggerDefaultConfigurations)
                .logger({
                    endpoint: bi_logger_const_1.BI_BOOKINGS_USER_OF_USER_END_POINT
                });
        } else {
            this.logger = platformAPIs
                .biLoggerFactory()
                .updateDefaults(biLoggerDefaultConfigurations)
                .logger({
                    endpoint: bi_logger_const_1.BI_BOOKINGS_USER_OF_USER_END_POINT
                });
        }
    }
    PlatformBiLoggerAdapter.prototype.log = function(logData) {
        if (this.shouldLogBi) {
            this.logger.log(logData);
        }
    };
    return PlatformBiLoggerAdapter;
}());
exports.PlatformBiLoggerAdapter = PlatformBiLoggerAdapter;
//# sourceMappingURL=platform-bi-logger-adapter.js.map