"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.logToGoogleAnalytics = exports.trackOfferingBookingClick = exports.trackOfferingClickFromWidget = exports.EVENT_ORIGIN_BOOKINGS = exports.TrackingConst = void 0;
var tslib_1 = require("tslib");
var offering_domain_1 = require("../../domain/offering-domain");
var constants_1 = require("../../constants");
var bookings_uou_domain_1 = require("@wix/bookings-uou-domain");
var TrackingConst;
(function(TrackingConst) {
    TrackingConst["CLICK_PRODUCT"] = "ClickProduct";
    TrackingConst["INITIATE_CHECKOUT"] = "InitiateCheckout";
})(TrackingConst = exports.TrackingConst || (exports.TrackingConst = {}));
exports.EVENT_ORIGIN_BOOKINGS = 'Bookings';
var track = function(eventId, payload, isEditorMode, trackEventFunc) {
    if (!isEditorMode) {
        trackEventFunc(eventId, tslib_1.__assign({
            origin: exports.EVENT_ORIGIN_BOOKINGS,
            appDefId: bookings_uou_domain_1.BOOKINGS_APP_DEF_ID
        }, payload));
    }
};
var trackOfferingClickFromWidget = function(offering, position, isEditorMode, businessName, trackEventFunc) {
    trackOfferingClick(offering, position, 'Service Widget', isEditorMode, businessName, trackEventFunc);
};
exports.trackOfferingClickFromWidget = trackOfferingClickFromWidget;
var trackOfferingBookingClick = function(offering, businessName, isEditorMode, trackEventFunc) {
    track(TrackingConst.INITIATE_CHECKOUT, {
        contents: [getTrackingEventOfferingFromOffering(offering, businessName)],
    }, isEditorMode, trackEventFunc);
};
exports.trackOfferingBookingClick = trackOfferingBookingClick;
var getVariant = function(offeringType) {
    return offeringType === offering_domain_1.OfferingType.INDIVIDUAL ?
        'PRIVATE' :
        offeringType === offering_domain_1.OfferingType.GROUP ?
        'GROUP' :
        'COURSE';
};
var getTrackingEventOfferingFromOffering = function(offering, businessName) {
    return ({
        id: offering.id,
        name: offering.name,
        brand: businessName,
        category: '',
        variant: getVariant(offering.type),
        price: offering.price,
        currency: offering.currency,
    });
};
var trackOfferingClick = function(offering, position, viewSource, isEditorMode, businessName, trackEventFunc) {
    track(TrackingConst.CLICK_PRODUCT, {
        name: offering.name,
        id: offering.id,
        list: viewSource,
        brand: businessName,
        category: '',
        variant: getVariant(offering.type),
        position: position,
        price: offering.price,
        currency: offering.currency,
    }, isEditorMode, trackEventFunc);
};
var logToGoogleAnalytics = function(intent, businessName, offering, isEditorMode, trackEventFunc) {
    if (intent === constants_1.OfferingIntent.BOOK_OFFERING) {
        exports.trackOfferingBookingClick(offering, businessName, isEditorMode, trackEventFunc);
    } else {
        exports.trackOfferingClickFromWidget(offering, 0, isEditorMode, businessName, trackEventFunc);
    }
};
exports.logToGoogleAnalytics = logToGoogleAnalytics;
//# sourceMappingURL=analytics-adapter.js.map