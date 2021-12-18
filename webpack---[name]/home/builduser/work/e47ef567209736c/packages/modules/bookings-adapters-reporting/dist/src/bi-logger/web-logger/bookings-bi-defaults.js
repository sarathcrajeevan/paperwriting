"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BookingsBIDefaults = void 0;
var tslib_1 = require("tslib");
var iframe_app_bi_context_1 = require("@wix/iframe-app-bi-context");
var BookingsBIDefaults = /** @class */ (function() {
    function BookingsBIDefaults(wixSKDBookingsAdapter, Wix, additionalDefaultProps) {
        if (additionalDefaultProps === void 0) {
            additionalDefaultProps = {};
        }
        this.wixSKDBookingsAdapter = wixSKDBookingsAdapter;
        this.biContext = iframe_app_bi_context_1.getBiContext(Wix);
        this.additionalDefaultProps = additionalDefaultProps;
    }
    BookingsBIDefaults.prototype.getDefaults = function() {
        return tslib_1.__assign(tslib_1.__assign({
            src: 16,
            businessId: this.wixSKDBookingsAdapter.instanceId,
            is_over_editor: this.wixSKDBookingsAdapter.isOverEditor,
            is_owner: this.wixSKDBookingsAdapter.isOwner,
            biToken: this.wixSKDBookingsAdapter.biToken,
            contactId: this.wixSKDBookingsAdapter.contactId
        }, this.biContext), this.additionalDefaultProps);
    };
    return BookingsBIDefaults;
}());
exports.BookingsBIDefaults = BookingsBIDefaults;
//# sourceMappingURL=bookings-bi-defaults.js.map