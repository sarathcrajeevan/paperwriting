"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OfferingListWidgetAdditionalConfiguration = void 0;
var bookings_uou_domain_1 = require("@wix/bookings-uou-domain");
var bookings_const_1 = require("../../constants/bookings.const");
var OfferingListWidgetAdditionalConfiguration = /** @class */ (function() {
    function OfferingListWidgetAdditionalConfiguration() {
        this.getWidgetId = function() {
            return bookings_uou_domain_1.BOOKINGS_OFFERING_LIST_WIDGET_ID;
        };
        this.getWidgetName = function() {
            return bookings_const_1.FEDOPS_SERVICES_LIST_WIDGET_EDITOR;
        };
        this.prePageReady = function() {
            return Promise.resolve();
        };
        this.onLocationChange = function() {};
    }
    return OfferingListWidgetAdditionalConfiguration;
}());
exports.OfferingListWidgetAdditionalConfiguration = OfferingListWidgetAdditionalConfiguration;
//# sourceMappingURL=offering-list-widget-additional-configuration.js.map