"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RefreshAppContextContextBuilder = void 0;
var RefreshAppContextContextBuilder = /** @class */ (function() {
    function RefreshAppContextContextBuilder() {
        this.context = {
            shouldFetchServices: false,
            updatedSettings: {},
        };
    }
    RefreshAppContextContextBuilder.prototype.withSetting = function(key, value) {
        this.context.updatedSettings[key] = value;
        return this;
    };
    RefreshAppContextContextBuilder.prototype.shouldNotFetchServices = function() {
        this.context.shouldFetchServices = false;
        return this;
    };
    RefreshAppContextContextBuilder.prototype.shouldFetchServices = function() {
        this.context.shouldFetchServices = true;
        return this;
    };
    RefreshAppContextContextBuilder.prototype.build = function() {
        return this.context;
    };
    return RefreshAppContextContextBuilder;
}());
exports.RefreshAppContextContextBuilder = RefreshAppContextContextBuilder;
//# sourceMappingURL=refresh-app-context.js.map