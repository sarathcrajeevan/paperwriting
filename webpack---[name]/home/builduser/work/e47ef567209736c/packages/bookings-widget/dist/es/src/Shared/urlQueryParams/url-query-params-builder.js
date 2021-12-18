"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var UrlQueryParamsBuilder = /** @class */ (function() {
    function UrlQueryParamsBuilder(startParams) {
        if (startParams === void 0) {
            startParams = '';
        }
        this.startParams = startParams;
        this.queryParams = [];
    }
    UrlQueryParamsBuilder.prototype.add = function(key, value) {
        var _this = this;
        if (value) {
            if (Array.isArray(value)) {
                value.forEach(function(internalValue) {
                    return _this.add(key, internalValue);
                });
            } else {
                this.queryParams.push({
                    key: key,
                    value: value
                });
            }
        }
        return this;
    };
    UrlQueryParamsBuilder.prototype.build = function() {
        if (this.queryParams.length) {
            var jointParams = this.queryParams
                .map(function(_a) {
                    var key = _a.key,
                        value = _a.value;
                    return key + "=" + value;
                })
                .join('&');
            return "" + (this.startParams ? this.startParams + "&" : '?') + jointParams;
        }
        return this.startParams;
    };
    return UrlQueryParamsBuilder;
}());
exports.default = UrlQueryParamsBuilder;
//# sourceMappingURL=url-query-params-builder.js.map