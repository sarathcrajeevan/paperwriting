"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FirstDay = exports.SettingsEditorRoute = exports.defaultDailyTimetableConfig = exports.DailyTimetableSettingsKeys = void 0;
var DailyTimetableSettingsKeys;
(function(DailyTimetableSettingsKeys) {
    DailyTimetableSettingsKeys["TIMETABLE_HEADING_TEXT"] = "timetable-heading-text";
    DailyTimetableSettingsKeys["EMPTY_STATE_TEXT"] = "empty-state-text";
    DailyTimetableSettingsKeys["BUTTON_ENABLED_TEXT_BOOK_NOW"] = "button-enabled-text-book-now";
    DailyTimetableSettingsKeys["BUTTON_ENABLED_TEXT_MORE_INFO"] = "button-enabled-text-more-info";
    DailyTimetableSettingsKeys["BUTTON_ENABLED_TEXT_WAITING_LIST"] = "button-enabled-text-waiting-list";
    DailyTimetableSettingsKeys["BUTTON_DISABLED_TEXT_FULL"] = "button-disabled-text-full";
    DailyTimetableSettingsKeys["BUTTON_DISABLED_TEXT_CLOSED"] = "button-disabled-text-closed";
    DailyTimetableSettingsKeys["BUTTON_DISABLED_TEXT_BOOKED"] = "button-disabled-text-booked";
    DailyTimetableSettingsKeys["SELECTED_SERVICES"] = "selected-services";
})(DailyTimetableSettingsKeys = exports.DailyTimetableSettingsKeys || (exports.DailyTimetableSettingsKeys = {}));
exports.defaultDailyTimetableConfig = {};
var SettingsEditorRoute;
(function(SettingsEditorRoute) {
    SettingsEditorRoute["SERVICES"] = "/services";
    SettingsEditorRoute["TEXT"] = "/text";
    SettingsEditorRoute["DISPLAY"] = "/display";
})(SettingsEditorRoute = exports.SettingsEditorRoute || (exports.SettingsEditorRoute = {}));
var FirstDay;
(function(FirstDay) {
    FirstDay["SUNDAY"] = "SUNDAY";
    FirstDay["MONDAY"] = "MONDAY";
    FirstDay["NONE"] = "NONE";
})(FirstDay = exports.FirstDay || (exports.FirstDay = {}));
//# sourceMappingURL=Settings.const.js.map