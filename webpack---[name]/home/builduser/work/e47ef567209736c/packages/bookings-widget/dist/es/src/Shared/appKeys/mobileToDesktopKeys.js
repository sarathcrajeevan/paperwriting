"use strict";
// define the mobile setting keys that should use the desktop if not defined
var _a, _b;
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mergeMobileSettingsIntoDesktop = exports.mergeMobileDefaultsIntoDesktop = exports.mergeDesktopDefaultsIntoMobile = exports.MAX_MOBILE_BORDER_WIDTH = exports.MAX_MOBILE_CARD_SPACING = void 0;
var tslib_1 = require("tslib");
var SettingsKeys_1 = require("./SettingsKeys");
exports.MAX_MOBILE_CARD_SPACING = 60;
exports.MAX_MOBILE_BORDER_WIDTH = 5;
var desktopSettingsDefaultsToMobileMap = (_a = {},
    _a[SettingsKeys_1.SettingsKeys.TEXT_ALIGNMENT] = SettingsKeys_1.MobileSettingsKeys.MOBILE_TEXT_ALIGNMENT,
    _a[SettingsKeys_1.SettingsKeys.DISPLAY_IMAGE] = SettingsKeys_1.MobileSettingsKeys.MOBILE_DISPLAY_IMAGE,
    _a[SettingsKeys_1.SettingsKeys.DISPLAY_TAG_LINE] = SettingsKeys_1.MobileSettingsKeys.MOBILE_DISPLAY_TAG_LINE,
    _a[SettingsKeys_1.SettingsKeys.DISPLAY_DIVIDER] = SettingsKeys_1.MobileSettingsKeys.MOBILE_DISPLAY_DIVIDER,
    _a[SettingsKeys_1.SettingsKeys.DISPLAY_PRICE] = SettingsKeys_1.MobileSettingsKeys.MOBILE_DISPLAY_PRICE,
    _a[SettingsKeys_1.SettingsKeys.DISPLAY_DURATION] = SettingsKeys_1.MobileSettingsKeys.MOBILE_DISPLAY_DURATION,
    _a[SettingsKeys_1.SettingsKeys.DIVIDER_WIDTH] = SettingsKeys_1.MobileSettingsKeys.MOBILE_DIVIDER_WIDTH,
    _a[SettingsKeys_1.SettingsKeys.BORDER_WIDTH] = SettingsKeys_1.MobileSettingsKeys.MOBILE_BORDER_WIDTH,
    _a[SettingsKeys_1.SettingsKeys.BUTTON_STYLE] = SettingsKeys_1.MobileSettingsKeys.MOBILE_BUTTON_STYLE,
    _a[SettingsKeys_1.SettingsKeys.DISPLAY_START_DATE] = SettingsKeys_1.MobileSettingsKeys.MOBILE_DISPLAY_START_DATE,
    _a[SettingsKeys_1.SettingsKeys.DISPLAY_DAYS_OFFERED] = SettingsKeys_1.MobileSettingsKeys.MOBILE_DISPLAY_DAYS_OFFERED,
    _a[SettingsKeys_1.SettingsKeys.DISPLAY_BUTTON] = SettingsKeys_1.MobileSettingsKeys.MOBILE_DISPLAY_BUTTON,
    _a[SettingsKeys_1.SettingsKeys.DISPLAY_MORE_INFO_LABEL] = SettingsKeys_1.MobileSettingsKeys.MOBILE_DISPLAY_MORE_INFO_LABEL,
    _a[SettingsKeys_1.SettingsKeys.CATEGORY_BACKGROUND_COLOR] = SettingsKeys_1.MobileSettingsKeys.MOBILE_CATEGORY_BACKGROUND_COLOR,
    _a[SettingsKeys_1.SettingsKeys.DISPLAY_ONLINE_INDICATION] = SettingsKeys_1.MobileSettingsKeys.MOBILE_DISPLAY_ONLINE_INDICATION,
    _a);
var mobileSettingsDefaultsToDesktopKeysMap = (_b = {},
    _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_CARDS_SPACING] = SettingsKeys_1.SettingsKeys.CARDS_SPACING,
    _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_IMAGE_SHAPE_OPTION] = SettingsKeys_1.SettingsKeys.IMAGE_SHAPE_OPTION,
    _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_TEXT_ALIGNMENT] = SettingsKeys_1.SettingsKeys.TEXT_ALIGNMENT,
    _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_DISPLAY_IMAGE] = SettingsKeys_1.SettingsKeys.DISPLAY_IMAGE,
    _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_DISPLAY_TAG_LINE] = SettingsKeys_1.SettingsKeys.DISPLAY_TAG_LINE,
    _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_DISPLAY_DIVIDER] = SettingsKeys_1.SettingsKeys.DISPLAY_DIVIDER,
    _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_DISPLAY_PRICE] = SettingsKeys_1.SettingsKeys.DISPLAY_PRICE,
    _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_BUTTON_STYLE] = SettingsKeys_1.SettingsKeys.BUTTON_STYLE,
    _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_DISPLAY_DURATION] = SettingsKeys_1.SettingsKeys.DISPLAY_DURATION,
    _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_DISPLAY_START_DATE] = SettingsKeys_1.SettingsKeys.DISPLAY_START_DATE,
    _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_DISPLAY_DAYS_OFFERED] = SettingsKeys_1.SettingsKeys.DISPLAY_DAYS_OFFERED,
    _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_DISPLAY_BUTTON] = SettingsKeys_1.SettingsKeys.DISPLAY_BUTTON,
    _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_DISPLAY_MORE_INFO_LABEL] = SettingsKeys_1.SettingsKeys.DISPLAY_MORE_INFO_LABEL,
    _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_DIVIDER_WIDTH] = SettingsKeys_1.SettingsKeys.DIVIDER_WIDTH,
    _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_BORDER_WIDTH] = SettingsKeys_1.SettingsKeys.BORDER_WIDTH,
    _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_DISPLAY_ONLINE_INDICATION] = SettingsKeys_1.SettingsKeys.DISPLAY_ONLINE_INDICATION,
    _b);
var mobileSettingsToDesktopKeysMap = tslib_1.__assign({}, mobileSettingsDefaultsToDesktopKeysMap);

function mergeSettingsKeys(data, keysMap, forceMerge) {
    if (forceMerge === void 0) {
        forceMerge = false;
    }
    var res = tslib_1.__assign({}, data);
    Object.keys(keysMap).forEach(function(sourceKey) {
        var targetKey = keysMap[sourceKey];
        var decoratedValue = decoratorMappings(sourceKey, targetKey, res[sourceKey]);
        if (typeof res[sourceKey] !== 'undefined' &&
            (forceMerge || typeof res[targetKey] === 'undefined')) {
            res[targetKey] = decoratedValue;
        } else if (res[targetKey]) {
            res[targetKey] = decoratorMappings(sourceKey, targetKey, res[targetKey]);
        }
    });
    return res;
}
var decoratorMappings = function(sourceKey, targetKey, value) {
    switch (sourceKey + " -> " + targetKey) {
        case SettingsKeys_1.SettingsKeys.DIVIDER_WIDTH + " -> " + SettingsKeys_1.MobileSettingsKeys.MOBILE_DIVIDER_WIDTH:
        case SettingsKeys_1.MobileSettingsKeys.MOBILE_DIVIDER_WIDTH + " -> " + SettingsKeys_1.SettingsKeys.DIVIDER_WIDTH:
        case SettingsKeys_1.SettingsKeys.BORDER_WIDTH + " -> " + SettingsKeys_1.MobileSettingsKeys.MOBILE_BORDER_WIDTH:
        case SettingsKeys_1.MobileSettingsKeys.MOBILE_BORDER_WIDTH + " -> " + SettingsKeys_1.SettingsKeys.BORDER_WIDTH:
            return value ? Math.min(value, exports.MAX_MOBILE_CARD_SPACING) : value;
        case SettingsKeys_1.SettingsKeys.CARDS_SPACING + " -> " + SettingsKeys_1.MobileSettingsKeys.MOBILE_CARDS_SPACING:
        case SettingsKeys_1.MobileSettingsKeys.MOBILE_CARDS_SPACING + " -> " + SettingsKeys_1.SettingsKeys.CARDS_SPACING:
            return value ? Math.min(value, exports.MAX_MOBILE_CARD_SPACING) : value;
        default:
            return value;
    }
};
var mergeDesktopDefaultsIntoMobile = function(settingsData) {
    return mergeSettingsKeys(settingsData, desktopSettingsDefaultsToMobileMap, false);
};
exports.mergeDesktopDefaultsIntoMobile = mergeDesktopDefaultsIntoMobile;
var mergeMobileDefaultsIntoDesktop = function(settingsData) {
    return mergeSettingsKeys(settingsData, mobileSettingsDefaultsToDesktopKeysMap, true);
};
exports.mergeMobileDefaultsIntoDesktop = mergeMobileDefaultsIntoDesktop;
var mergeMobileSettingsIntoDesktop = function(settingsData) {
    return mergeSettingsKeys(settingsData, mobileSettingsToDesktopKeysMap, true);
};
exports.mergeMobileSettingsIntoDesktop = mergeMobileSettingsIntoDesktop;
//# sourceMappingURL=mobileToDesktopKeys.js.map