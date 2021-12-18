"use strict";
var _a;
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.defaultBookButtonConfig = exports.BookButtonSettingsKeys = exports.SelectedServiceLinkDestinationOptions = exports.GeneralLinkDestinationOptions = void 0;
var GeneralLinkDestinationOptions;
(function(GeneralLinkDestinationOptions) {
    GeneralLinkDestinationOptions["SERVICE_LIST"] = "service-list";
    GeneralLinkDestinationOptions["SPECIFIC_SERVICE"] = "specific-service";
})(GeneralLinkDestinationOptions = exports.GeneralLinkDestinationOptions || (exports.GeneralLinkDestinationOptions = {}));
var SelectedServiceLinkDestinationOptions;
(function(SelectedServiceLinkDestinationOptions) {
    SelectedServiceLinkDestinationOptions["CALENDAR"] = "calendar";
    SelectedServiceLinkDestinationOptions["SERVICE_PAGE"] = "service-page";
})(SelectedServiceLinkDestinationOptions = exports.SelectedServiceLinkDestinationOptions || (exports.SelectedServiceLinkDestinationOptions = {}));
var BookButtonSettingsKeys;
(function(BookButtonSettingsKeys) {
    BookButtonSettingsKeys["LINK_DESTINATION"] = "link-destination";
    BookButtonSettingsKeys["SELECTED_SERVICE"] = "selected-service";
    BookButtonSettingsKeys["SELECTED_SERVICE_LINK_DESTINATION"] = "specific-service-link-destination";
})(BookButtonSettingsKeys = exports.BookButtonSettingsKeys || (exports.BookButtonSettingsKeys = {}));
exports.defaultBookButtonConfig = (_a = {},
    _a[BookButtonSettingsKeys.LINK_DESTINATION] = GeneralLinkDestinationOptions.SERVICE_LIST,
    _a[BookButtonSettingsKeys.SELECTED_SERVICE_LINK_DESTINATION] = SelectedServiceLinkDestinationOptions.CALENDAR,
    _a);
//# sourceMappingURL=Settings.const.js.map