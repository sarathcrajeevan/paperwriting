"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initRaven = exports.getRavenSessionIdForApp = exports.isRunningInIframe = void 0;
var sentry_const_1 = require("./sentry.const");
var isRunningInIframe = function() {
    return !(typeof WorkerGlobalScope !== 'undefined' &&
        self instanceof WorkerGlobalScope);
};
exports.isRunningInIframe = isRunningInIframe;
var getRavenSessionIdForApp = function(initParams) {
    return initParams.instanceId;
};
exports.getRavenSessionIdForApp = getRavenSessionIdForApp;
var initRaven = function(platformServices, initParams) {
    if (!exports.isRunningInIframe()) {
        var viewerScriptRaven_1 = platformServices.monitoring.createMonitor(sentry_const_1.SENTRY_BOOKINGS_VIEWER_SCRIPT_DNS, function(data) {
            data.environment = sentry_const_1.SENTRY_BOOKINGS_RUNNING_ENVIRONMENT;
            return data;
        });
        viewerScriptRaven_1.setUserContext({
            id: exports.getRavenSessionIdForApp(initParams),
        });
        return function(ex, options) {
            viewerScriptRaven_1.captureException(ex, options);
            throw ex;
        };
    }
    return function(ex, options) {
        throw ex;
    };
};
exports.initRaven = initRaven;
//# sourceMappingURL=sentry-adapter.js.map