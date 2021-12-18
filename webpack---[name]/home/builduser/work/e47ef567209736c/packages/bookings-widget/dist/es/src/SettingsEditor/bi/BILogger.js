"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getSettingsBiLogger = exports.BILogger = exports.widgetSettingEditorReferralInfo = exports.widgetReferralInfo = exports.serviceListReferralInfo = exports.WIDGET_SETTINGS_BI_REFFERAL = exports.BIEvent = void 0;
var tslib_1 = require("tslib");
var bi_logger_adapter_1 = require("@wix/bookings-adapters-reporting/dist/src/bi-logger/bi-logger-adapter");
var SettingsKeys_1 = require("../../Shared/appKeys/SettingsKeys");
var BIEvent;
(function(BIEvent) {
    BIEvent[BIEvent["TAB_NAVIGATION"] = 112] = "TAB_NAVIGATION";
    BIEvent[BIEvent["OPEN_SETTINGS"] = 160] = "OPEN_SETTINGS";
    BIEvent[BIEvent["DISPLAY_CHANGED"] = 202] = "DISPLAY_CHANGED";
    BIEvent[BIEvent["ADD_SERVICE"] = 142] = "ADD_SERVICE";
    BIEvent[BIEvent["MANAGE_OFFERINGS"] = 275] = "MANAGE_OFFERINGS";
    BIEvent[BIEvent["CUSTOMIZE_WIDGET"] = 322] = "CUSTOMIZE_WIDGET";
    BIEvent[BIEvent["IMAGE_SELECTION"] = 126] = "IMAGE_SELECTION";
    BIEvent[BIEvent["ELEMENT_CHANGED"] = 330] = "ELEMENT_CHANGED";
    BIEvent[BIEvent["RESOURCE_SELECTED"] = 195] = "RESOURCE_SELECTED";
    BIEvent[BIEvent["OPEN_PACKAGE_PICKER"] = 156] = "OPEN_PACKAGE_PICKER";
    BIEvent[BIEvent["FILTER_CHANGED"] = 449] = "FILTER_CHANGED";
})(BIEvent = exports.BIEvent || (exports.BIEvent = {}));
exports.WIDGET_SETTINGS_BI_REFFERAL = {
    WIDGET_SETTINGS_SERVICES: 'service-widget/services',
};
exports.serviceListReferralInfo = 'service_list_widget';
exports.widgetReferralInfo = 'widget';
exports.widgetSettingEditorReferralInfo = 'widget_settings';
var BILogger = /** @class */ (function() {
    function BILogger(Wix, additionalBiProps) {
        if (additionalBiProps === void 0) {
            additionalBiProps = {};
        }
        this.logger = new bi_logger_adapter_1.BiLoggerAdapterBuilder()
            .withWebLogger({
                Wix: Wix,
                biLoggerEndPoint: 'wixboost-users',
                additionalBiProps: additionalBiProps,
            })
            .build();
    }
    BILogger.prototype.logNavigateFrom = function(tabName, _a) {
        var _b = _a === void 0 ? {} : _a,
            _c = _b.isEmptyState,
            isEmptyState = _c === void 0 ? false : _c,
            _d = _b.referralInfo,
            referralInfo = _d === void 0 ? exports.widgetReferralInfo : _d;
        return this.logger.log({
            selection: tabName,
            isEmptyState: isEmptyState,
            referralInfo: referralInfo,
            evid: BIEvent.TAB_NAVIGATION,
        });
    };
    BILogger.prototype.logOpenSettingsWith = function(_a) {
        var isEmptyState = _a.isEmptyState;
        return this.logger.log({
            referralInfo: exports.widgetReferralInfo,
            isEmptyState: isEmptyState,
            evid: BIEvent.OPEN_SETTINGS,
        });
    };
    BILogger.prototype.logAddFirstServiceFrom = function(pageName) {
        return this.logger.log({
            referral_info: exports.widgetSettingEditorReferralInfo,
            pageName: pageName,
            evid: BIEvent.ADD_SERVICE,
        });
    };
    BILogger.prototype.logManageOfferings = function(_a) {
        var _b = _a === void 0 ? {} : _a,
            _c = _b.referral,
            referral = _c === void 0 ? 'service-widget' : _c;
        return this.logger.log({
            evid: BIEvent.MANAGE_OFFERINGS,
            referral: referral,
        });
    };
    BILogger.prototype.logCustomiseWidget = function() {
        return this.logger.log({
            evid: BIEvent.CUSTOMIZE_WIDGET,
        });
    };
    BILogger.prototype.logDisplayChange = function(fieldName, status) {
        return this.logger.log({
            evid: BIEvent.DISPLAY_CHANGED,
            info: 'displayService' + fieldName,
            isShow: status,
        });
    };
    BILogger.prototype.logServicesFilterChange = function(filterBy) {
        var filterByText = filterBy === SettingsKeys_1.FilterByOptions.BY_SERVICES ? 'service_name' : 'location';
        return this.logger.log({
            evid: BIEvent.FILTER_CHANGED,
            filterBy: filterByText,
        });
    };
    BILogger.prototype.logFullStretchChange = function(isFull) {
        return this.logger.log({
            evid: BIEvent.IMAGE_SELECTION,
            selection: isFull ? 'stretch_full' : 'no_stretch',
            page_name: exports.widgetReferralInfo,
            type: 'single_service',
            element: 'width',
        });
    };
    BILogger.prototype.logSelectResource = function(_a) {
        var view_type = _a.view_type,
            offeringType = _a.offeringType,
            filterByOption = _a.filterByOption,
            checkedLocation = _a.checkedLocation;
        var filterInfo = filterByOption ?
            filterByOption === SettingsKeys_1.FilterByOptions.BY_SERVICES ?
            {
                filterBy: 'service_name'
            } :
            {
                filterBy: 'location',
                checkedLocation: checkedLocation
            } :
            {};
        var type = offeringType ? {
            type: offeringType
        } : {};
        return this.logger.log(tslib_1.__assign(tslib_1.__assign({
            evid: BIEvent.RESOURCE_SELECTED,
            view_type: view_type,
            pageName: exports.widgetReferralInfo
        }, filterInfo), type));
    };
    BILogger.prototype.logOpenPackagePicker = function() {
        return this.logger.log({
            evid: BIEvent.OPEN_PACKAGE_PICKER,
            referral_info: exports.widgetSettingEditorReferralInfo,
        });
    };
    BILogger.prototype.logElementChanged = function(_a) {
        var tabName = _a.tabName,
            element = _a.element,
            selection = _a.selection;
        return this.logger.log({
            tabName: tabName,
            element: element,
            selection: selection,
            platformName: 'editor',
            appName: exports.widgetSettingEditorReferralInfo,
            evid: BIEvent.ELEMENT_CHANGED,
        });
    };
    return BILogger;
}());
exports.BILogger = BILogger;

function getSettingsBiLogger(Wix, biProps) {
    var additionalBiProps = {
        bookingsPlatform: biProps.isNewBookingsPlatform ?
            'new_bookings_server' :
            null,
    };
    return new BILogger(Wix, additionalBiProps);
}
exports.getSettingsBiLogger = getSettingsBiLogger;
//# sourceMappingURL=BILogger.js.map