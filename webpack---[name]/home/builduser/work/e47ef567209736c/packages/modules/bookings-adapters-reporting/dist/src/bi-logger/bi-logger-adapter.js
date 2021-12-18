"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BiLoggerAdapterBuilder = void 0;
var WebLogger_1 = require("./web-logger/WebLogger");
var bi_logger_const_1 = require("./bi-logger.const");
var BiLoggerAdapterBuilder = /** @class */ (function() {
    function BiLoggerAdapterBuilder() {}
    BiLoggerAdapterBuilder.prototype.withWebLogger = function(_a) {
        var _b = _a.biLoggerDefaults,
            biLoggerDefaults = _b === void 0 ? null : _b,
            _c = _a.Wix,
            Wix = _c === void 0 ? window.Wix : _c,
            _d = _a.biLoggerEndPoint,
            biLoggerEndPoint = _d === void 0 ? bi_logger_const_1.BI_BOOKINGS_USER_OF_USER_END_POINT : _d,
            _e = _a.additionalBiProps,
            additionalBiProps = _e === void 0 ? {} : _e;
        this.logger = new WebLogger_1.WebLogger({
            biLoggerDefaults: biLoggerDefaults,
            biLoggerEndPoint: biLoggerEndPoint,
            Wix: Wix,
            additionalBiProps: additionalBiProps,
        });
        return this;
    };
    BiLoggerAdapterBuilder.prototype.build = function() {
        return this.logger;
    };
    return BiLoggerAdapterBuilder;
}());
exports.BiLoggerAdapterBuilder = BiLoggerAdapterBuilder;
//# sourceMappingURL=bi-logger-adapter.js.map