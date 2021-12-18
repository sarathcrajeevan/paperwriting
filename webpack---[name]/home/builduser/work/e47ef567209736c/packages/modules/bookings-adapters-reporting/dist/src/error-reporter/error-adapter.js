"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.withBookingsErrorReporter = exports.wrapTryCatch = void 0;
var tslib_1 = require("tslib");
var _ = require("lodash");
var wrapTryCatch = function(onCatch) {
    return function(fn) {
        // tslint:disable-next-line:only-arrow-functions
        return function() {
            try {
                return fn.apply(null, arguments);
            } catch (e) {
                onCatch && onCatch(e);
            }
        };
    };
};
exports.wrapTryCatch = wrapTryCatch;

function withBookingsErrorReporter(errorReporterFn) {
    return function(obj) {
        var wrapper = exports.wrapTryCatch(errorReporterFn);
        return _.reduce(obj, function(result, value, key) {
            var _a;
            return (tslib_1.__assign(tslib_1.__assign({}, result), (_a = {}, _a[key] = _.isFunction(value) ? wrapper(value) : value, _a)));
        }, {});
    };
}
exports.withBookingsErrorReporter = withBookingsErrorReporter;
//# sourceMappingURL=error-adapter.js.map