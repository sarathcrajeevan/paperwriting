"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CACHE_MAX_AGE_IN_MILLIS = exports.CACHE_MAX_AGE_IN_SECONDS = exports.FilterByOptions = exports.FilterType = void 0;
var FilterType;
(function(FilterType) {
    FilterType["SPECIFIC"] = "SPECIFIC";
    FilterType["ALL"] = "ALL";
    FilterType["FIRST"] = "FIRST";
})(FilterType = exports.FilterType || (exports.FilterType = {}));
var FilterByOptions;
(function(FilterByOptions) {
    FilterByOptions["BY_SERVICES"] = "BY_SERVICES";
    FilterByOptions["BY_LOCATIONS"] = "BY_LOCATIONS";
})(FilterByOptions = exports.FilterByOptions || (exports.FilterByOptions = {}));
exports.CACHE_MAX_AGE_IN_SECONDS = 7 * 24 * 60 * 60; // 7 days
exports.CACHE_MAX_AGE_IN_MILLIS = exports.CACHE_MAX_AGE_IN_SECONDS * 1000;
//# sourceMappingURL=widget.js.map