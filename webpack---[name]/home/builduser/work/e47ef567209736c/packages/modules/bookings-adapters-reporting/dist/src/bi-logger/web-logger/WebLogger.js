"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.WebLogger = void 0;
var web_bi_logger_1 = require("@wix/web-bi-logger");
var bookings_bi_defaults_1 = require("./bookings-bi-defaults");
var bookings_adapter_wix_sdk_1 = require("@wix/bookings-adapter-wix-sdk");
var WebLogger = /** @class */ (function() {
    function WebLogger(_a) {
        var _b = _a.biLoggerDefaults,
            biLoggerDefaults = _b === void 0 ? null : _b,
            biLoggerEndPoint = _a.biLoggerEndPoint,
            _c = _a.Wix,
            Wix = _c === void 0 ? null : _c,
            _d = _a.additionalBiProps,
            additionalBiProps = _d === void 0 ? {} : _d;
        if (!biLoggerDefaults && !Wix) {
            throw new Error('must provide biLoggerDefaults or Wix');
        }
        var biLoggerDefaultConfigurations = biLoggerDefaults ||
            new bookings_bi_defaults_1.BookingsBIDefaults(new bookings_adapter_wix_sdk_1.WixSDKAdapter(Wix), Wix, additionalBiProps).getDefaults();
        this.logger = web_bi_logger_1.default
            .factory({
                endpoint: biLoggerEndPoint
            })
            .updateDefaults(biLoggerDefaultConfigurations)
            .logger();
    }
    WebLogger.prototype.log = function(data) {
        return this.logger.log(data);
    };
    return WebLogger;
}());
exports.WebLogger = WebLogger;
//# sourceMappingURL=WebLogger.js.map