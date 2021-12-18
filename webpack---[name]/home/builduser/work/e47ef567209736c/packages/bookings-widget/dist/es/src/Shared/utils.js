"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getDefaultTimezone = exports.cleanNulls = exports.isMobileFromFormFactor = exports.getCurrentStyles = exports.getStyleParams = exports.getSiteColors = exports.getSiteTextPresets = exports.getPresetId = void 0;
var environment_const_1 = require("../WidgetApp/constants/environment.const");
var _ = require("lodash");
var bookings_uou_types_1 = require("@wix/bookings-uou-types");
var getPresetId = function() {
    return new Promise(function(resolve) {
        window.Wix.Data.Public.get('presetId', {
            scope: 'COMPONENT'
        }, function(data) {
            return resolve(data);
        }, function() {
            return resolve(undefined);
        });
    });
};
exports.getPresetId = getPresetId;
var getSiteTextPresets = function() {
    return new Promise(function(resolve) {
        window.Wix.Styles.getSiteTextPresets(resolve, resolve);
    });
};
exports.getSiteTextPresets = getSiteTextPresets;
var getSiteColors = function() {
    return new Promise(function(resolve) {
        window.Wix.Styles.getSiteColors(resolve, resolve);
    });
};
exports.getSiteColors = getSiteColors;
var getStyleParams = function() {
    return new Promise(function(resolve) {
        window.Wix.Styles.getStyleParams(resolve, resolve);
    });
};
exports.getStyleParams = getStyleParams;
var getCurrentStyles = function() {
    return Promise.all([exports.getSiteColors(), exports.getSiteTextPresets(), exports.getStyleParams()]);
};
exports.getCurrentStyles = getCurrentStyles;
var isMobileFromFormFactor = function(props) {
    return _.get(props, 'host.formFactor', environment_const_1.FormFactor.DESKTOP) === environment_const_1.FormFactor.MOBILE;
};
exports.isMobileFromFormFactor = isMobileFromFormFactor;

function cleanNulls(object) {
    object &&
        Object.keys(object).forEach(
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            function(key) {
                return object[key] === null && delete object[key];
            });
    return object;
}
exports.cleanNulls = cleanNulls;
var getDefaultTimezone = function(businessInfo) {
    var _a;
    var localTimezone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
    var businessTimezone = businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.timeZone;
    var defaultTimezoneType = (_a = businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.timezoneProperties) === null || _a === void 0 ? void 0 : _a.defaultTimezone;
    return defaultTimezoneType === bookings_uou_types_1.TimezoneType.CLIENT ?
        localTimezone :
        businessTimezone;
};
exports.getDefaultTimezone = getDefaultTimezone;
//# sourceMappingURL=utils.js.map