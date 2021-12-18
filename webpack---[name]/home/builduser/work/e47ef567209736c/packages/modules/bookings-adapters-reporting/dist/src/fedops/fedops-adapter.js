"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FedopsAdapter = exports.BOOKINGS_APP_DEF_ID = void 0;
exports.BOOKINGS_APP_DEF_ID = '13d21c63-b5ec-5912-8397-c3a5ddb27a97';
var FedopsAdapter = /** @class */ (function() {
    function FedopsAdapter(wixSdkAdapter, widgetId) {
        this.wixSdkAdapter = wixSdkAdapter;
        var platformAPIs = wixSdkAdapter.getPlatformAPIs();
        this.fedopsLogger = platformAPIs.fedOpsLoggerFactory.getLoggerForWidget({
            appId: exports.BOOKINGS_APP_DEF_ID,
            widgetId: widgetId,
        });
        if (!wixSdkAdapter.isRunningInIframe()) {
            this.logAppLoadedStarted();
        }
    }
    FedopsAdapter.prototype.logAppLoadedStarted = function() {
        this.fedopsLogger.appLoadStarted();
    };
    FedopsAdapter.prototype.logAppLoaded = function() {
        this.fedopsLogger.appLoaded();
    };
    FedopsAdapter.prototype.logInteractionStarted = function(interactionName) {
        this.fedopsLogger.interactionStarted(interactionName);
    };
    FedopsAdapter.prototype.logInteractionEnded = function(interactionName) {
        this.fedopsLogger.interactionEnded(interactionName);
    };
    return FedopsAdapter;
}());
exports.FedopsAdapter = FedopsAdapter;
//# sourceMappingURL=fedops-adapter.js.map