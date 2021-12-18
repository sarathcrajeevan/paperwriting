"use strict";
var _a;
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SettingsEditorRoute = exports.defaultStaffWidgetConfig = exports.FilterTypeOptions = exports.StaffWidgetSettingsKeys = void 0;
var StaffWidgetSettingsKeys;
(function(StaffWidgetSettingsKeys) {
    StaffWidgetSettingsKeys["DISPLAY_IMAGE"] = "display-image";
    StaffWidgetSettingsKeys["DISPLAY_DESCRIPTION"] = "display-description";
    StaffWidgetSettingsKeys["DISPLAY_DIVIDER"] = "display-divider";
    StaffWidgetSettingsKeys["DISPLAY_EMAIL"] = "display-email";
    StaffWidgetSettingsKeys["DISPLAY_PHONE"] = "display-phone";
    StaffWidgetSettingsKeys["DISPLAY_BUTTON"] = "display-button";
    StaffWidgetSettingsKeys["ORDERED_STAFF_OPTIONS"] = "ordered-staff-options";
    StaffWidgetSettingsKeys["FILTER_TYPE"] = "filter-type";
    StaffWidgetSettingsKeys["BOOK_BUTTON_TEXT"] = "book-button-text";
})(StaffWidgetSettingsKeys = exports.StaffWidgetSettingsKeys || (exports.StaffWidgetSettingsKeys = {}));
var FilterTypeOptions;
(function(FilterTypeOptions) {
    FilterTypeOptions["ALL"] = "all";
    FilterTypeOptions["SPECIFIC"] = "specific";
})(FilterTypeOptions = exports.FilterTypeOptions || (exports.FilterTypeOptions = {}));
exports.defaultStaffWidgetConfig = (_a = {},
    _a[StaffWidgetSettingsKeys.DISPLAY_IMAGE] = true,
    _a[StaffWidgetSettingsKeys.DISPLAY_DESCRIPTION] = true,
    _a[StaffWidgetSettingsKeys.DISPLAY_DIVIDER] = true,
    _a[StaffWidgetSettingsKeys.DISPLAY_EMAIL] = false,
    _a[StaffWidgetSettingsKeys.DISPLAY_PHONE] = true,
    _a[StaffWidgetSettingsKeys.DISPLAY_BUTTON] = true,
    _a[StaffWidgetSettingsKeys.FILTER_TYPE] = FilterTypeOptions.ALL,
    _a);
var SettingsEditorRoute;
(function(SettingsEditorRoute) {
    SettingsEditorRoute["MANAGE"] = "/manage";
    SettingsEditorRoute["STAFF"] = "/staff";
    SettingsEditorRoute["DISPLAY"] = "/display";
    SettingsEditorRoute["LAYOUT"] = "/layout";
    SettingsEditorRoute["TEXT"] = "/text";
})(SettingsEditorRoute = exports.SettingsEditorRoute || (exports.SettingsEditorRoute = {}));
//# sourceMappingURL=Settings.const.js.map