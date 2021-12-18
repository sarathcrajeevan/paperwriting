"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getPlatformBiLoggerDefaultsConfig = void 0;
var bi_logger_const_1 = require("../bi-logger.const");

function getPlatformBiLoggerDefaultsConfig(wixSdkAdapter, widgetName) {
    var _a = prepareConfigParams(wixSdkAdapter),
        _b = _a.biToken,
        biToken = _b === void 0 ? '' : _b,
        _c = _a.businessId,
        businessId = _c === void 0 ? '' : _c,
        isOwner = _a.isOwner,
        isOverEditor = _a.isOverEditor,
        ownerId = _a.ownerId,
        _d = _a.uid,
        uid = _d === void 0 ? '' : _d;
    return {
        src: bi_logger_const_1.BI_BOOKINGS_SRC,
        widget_name: widgetName,
        businessId: businessId,
        biToken: biToken,
        is_owner: isOwner,
        is_over_editor: isOverEditor,
        ownerId: ownerId,
        visitor_id: uid,
        bookingsPlatform: 'new_bookings_server',
    };
}
exports.getPlatformBiLoggerDefaultsConfig = getPlatformBiLoggerDefaultsConfig;

function prepareConfigParams(wixSdkAdapter) {
    return {
        uid: wixSdkAdapter.getVisitorId(),
        biToken: wixSdkAdapter.getBiToken(),
        businessId: wixSdkAdapter.getInstanceId(),
        isOwner: wixSdkAdapter.isOwner(),
        ownerId: wixSdkAdapter.getOwnerId(),
        isOverEditor: wixSdkAdapter.isEditorMode() || wixSdkAdapter.isPreviewMode(),
    };
}
//# sourceMappingURL=platform-bookings-bi-defaults.js.map