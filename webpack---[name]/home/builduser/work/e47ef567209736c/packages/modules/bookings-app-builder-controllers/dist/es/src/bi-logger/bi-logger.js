import {
    __assign
} from "tslib";
import {
    WidgetActionName,
    WidgetReferralInfo,
    WidgetViewerEvents,
} from './bi.const';
import {
    PlatformBiLoggerAdapter
} from '@wix/bookings-adapters-reporting/dist/src/bi-logger/platform-logger/platform-bi-logger-adapter';
var BiLogger = /** @class */ (function() {
    function BiLogger(wixSdkAdapter, widgetName) {
        this.wixSdkAdapter = wixSdkAdapter;
        this.biLoggerAdapter = new PlatformBiLoggerAdapter({
            wixSdkAdapter: wixSdkAdapter,
            widgetName: widgetName,
        });
    }
    BiLogger.prototype.sendTimetableNavigationEvent = function(data) {
        return this.biLoggerAdapter.log(__assign(__assign({}, data), {
            evid: WidgetViewerEvents.TIMETABLE_NAVIGATION
        }));
    };
    BiLogger.prototype.sendTimetableLoadedEvent = function(data) {
        return this.biLoggerAdapter.log(__assign(__assign({}, data), {
            evid: WidgetViewerEvents.TIMETABLE_OPENED
        }));
    };
    BiLogger.prototype.sendBookButtonClickEvent = function(data) {
        return this.biLoggerAdapter.log(__assign(__assign({}, data), {
            referralInfo: WidgetReferralInfo.BOOK_BUTTON,
            evid: WidgetViewerEvents.BOOK_BUTTON_CLICK
        }));
    };
    BiLogger.prototype.sendTimeTableClickEvent = function(data) {
        return this.biLoggerAdapter.log({
            actionName: data.action,
            accept_online_bookings: !data.isNoBookFlow,
            service_id: data.serviceId,
            type: data.type,
            is_over_editor: data.isOverEditor,
            isPreview: data.isPreviewMode,
            referralInfo: WidgetReferralInfo.TIME_TABLE,
            evid: WidgetViewerEvents.BOOK_BUTTON_CLICK,
        });
    };
    BiLogger.prototype.sendTimetablePremiumPrevention = function() {
        return this.biLoggerAdapter.log({
            referralInfo: WidgetReferralInfo.TIME_TABLE,
            evid: WidgetViewerEvents.PREMIUM_PREVENTION,
        });
    };
    BiLogger.prototype.sendStaffWidgetLoaded = function() {
        return this.biLoggerAdapter.log({
            widget_name: WidgetReferralInfo.STAFF_LIST,
            evid: WidgetViewerEvents.STAFF_LIST_LOADED,
        });
    };
    BiLogger.prototype.sendStaffClicked = function(shouldNavigateToSpecificSitePage) {
        return this.biLoggerAdapter.log({
            referralInfo: WidgetReferralInfo.STAFF_LIST,
            widget_name: WidgetReferralInfo.STAFF_LIST,
            evid: WidgetViewerEvents.STAFF_CLICKED,
            actionName: shouldNavigateToSpecificSitePage ?
                WidgetActionName.NAVIGATE_TO_SPECIFIC_PAGE :
                WidgetActionName.NAVIGATE_TO_SERVICES_LIST,
        });
    };
    return BiLogger;
}());
export {
    BiLogger
};
//# sourceMappingURL=bi-logger.js.map