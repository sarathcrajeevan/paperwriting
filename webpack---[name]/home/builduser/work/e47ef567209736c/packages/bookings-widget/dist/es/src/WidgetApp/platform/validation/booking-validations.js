"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getNotifyPricingPlanRequest = exports.BookingValidations = void 0;
var tslib_1 = require("tslib");
var bookings_uou_domain_1 = require("@wix/bookings-uou-domain");
var navigation_const_1 = require("../navigation/navigation.const");
var feature_enabler_1 = require("@wix/bookings-config/dist/src/active-features/feature-enabler");
var BookingValidations = /** @class */ (function() {
    function BookingValidations(wixSdkAdapter) {
        this.wixSdkAdapter = wixSdkAdapter;
    }
    BookingValidations.prototype.shouldNavigate = function(offering, activeFeatures, intent) {
        return tslib_1.__awaiter(this, void 0, void 0, function() {
            return tslib_1.__generator(this, function(_a) {
                if (intent === navigation_const_1.OfferingIntent.SHOW_DETAILS ||
                    this.wixSdkAdapter.isPreviewMode() ||
                    this.wixSdkAdapter.isDemoMode() ||
                    this.wixSdkAdapter.isTemplateMode()) {
                    return [2 /*return*/ , {
                        canBook: true
                    }];
                }
                return [2 /*return*/ , this.canBook(offering, activeFeatures)];
            });
        });
    };
    BookingValidations.prototype.canBook = function(offering, activeFeatures) {
        var _this = this;
        return this.wixSdkAdapter
            .isPricingPlanInstalled()
            .then(function(isPricingPlanInstalled) {
                var couldBePremium = _this.couldBePremiumNavigate(offering, activeFeatures);
                var couldBePricingPlan = couldBePricingPlanNavigate(offering, isPricingPlanInstalled);
                return {
                    canBook: couldBePremium && couldBePricingPlan.canBook,
                    reason: {
                        premiumError: !couldBePremium,
                        pricingPlanError: !couldBePricingPlan.canBook,
                        isOfferingConnectedToPricingPlans: couldBePricingPlan.isOfferingConnectedToPricingPlans,
                        isPricingPlanInstalled: isPricingPlanInstalled,
                    },
                };
            });
    };
    BookingValidations.prototype.couldBePremiumNavigate = function(offering, activeFeatures) {
        return (offering.type === bookings_uou_domain_1.OfferingType.COURSE ||
            feature_enabler_1.isFeatureEnabled(activeFeatures, offering.type));
    };
    return BookingValidations;
}());
exports.BookingValidations = BookingValidations;

function couldBePricingPlanNavigate(offering, isPricingPlanInstalled) {
    var isOfferingConnectedToPricingPlans = isOfferingConnectedToPricingPlan(offering);
    var offeringOfferedAsPricingPlan = isOfferingOfferedAsPricingPlan(offering, isPricingPlanInstalled);
    return {
        canBook: !offeringOfferedAsPricingPlan ||
            (isOfferingConnectedToPricingPlans && isPricingPlanInstalled),
        isOfferingConnectedToPricingPlans: isOfferingConnectedToPricingPlans,
    };
}
var isOfferingConnectedToPricingPlan = function(offering) {
    return !!(offering.pricingPlanInfo &&
        offering.pricingPlanInfo.pricingPlans &&
        offering.pricingPlanInfo.pricingPlans.length);
};
var isOfferingOfferedAsPricingPlan = function(offeringViewModel, isPricingPlanInstalled) {
    return getOfferedAs(offeringViewModel, isPricingPlanInstalled).indexOf("PRICING_PLAN" /* PRICING_PLAN */ ) > -1;
};
var getOfferedAs = function(offering, isPricingPlanInstalled) {
    if (offering.offeredAs.indexOf("ONE_TIME" /* ONE_TIME */ ) >= 0 &&
        offering.offeredAs.indexOf("PRICING_PLAN" /* PRICING_PLAN */ ) >= 0) {
        if (offering.pricingPlanInfo.pricingPlans.length === 0) {
            return ["ONE_TIME" /* ONE_TIME */ ];
        }
        if (!isPricingPlanInstalled) {
            return ["ONE_TIME" /* ONE_TIME */ ];
        }
    }
    return offering.offeredAs;
};
var getNotifyPricingPlanRequest = function(offering, reason) {
    var reasons = [];
    if (!reason.isPricingPlanInstalled) {
        reasons.push("PageNotInstalled" /* PAGE_NOT_INSTALLED */ );
    }
    if (!reason.isOfferingConnectedToPricingPlans) {
        reasons.push("NoPlansAssignedToOffering" /* NO_PLANS_ASSIGNED_TO_OFFERING */ );
    }
    var offeringId = offering.id;
    return {
        reasons: reasons,
        offeringId: offeringId
    };
};
exports.getNotifyPricingPlanRequest = getNotifyPricingPlanRequest;
//# sourceMappingURL=booking-validations.js.map