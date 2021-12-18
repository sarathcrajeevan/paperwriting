"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BookingValidations = void 0;
var offering_domain_1 = require("../domain/offering-domain");
var feature_enabler_1 = require("@wix/bookings-config/dist/src/active-features/feature-enabler");
var BookingValidations = /** @class */ (function() {
    function BookingValidations(wixSdkAdapter) {
        this.wixSdkAdapter = wixSdkAdapter;
    }
    BookingValidations.prototype.canBook = function(offering, activeFeatures) {
        var _this = this;
        return this.wixSdkAdapter
            .isPricingPlanInstalled()
            .then(function(isPricingPlanInstalled) {
                var couldBePremium = _this.couldBePremiumNavigate(offering, activeFeatures);
                var couldBePricingPlan = couldBePricingPlanNavigate(offering, isPricingPlanInstalled);
                return {
                    canBook: couldBePremium && couldBePricingPlan,
                    reason: {
                        premiumError: !couldBePremium,
                        pricingPlanError: !couldBePricingPlan,
                    },
                };
            });
    };
    BookingValidations.prototype.notifyingNonPricingPlanEnrollmentAttempt = function(offering, failureReasons, httpCall) {
        if (!failureReasons.premiumError && failureReasons.pricingPlanError) {
            var isOfferingConnectedToPricingPlans_1 = isOfferingConnectedToPricingPlan(offering);
            this.wixSdkAdapter
                .isPricingPlanInstalled()
                .then(function(isPricingPlanInstalled) {
                    return notifyingOwnerNonPricingPlanEnrollmentAttempt({
                        offeringId: offering.id,
                        isPricingPlanNotInstalled: !isPricingPlanInstalled,
                        isOfferingNotConnectedToPricingPlan: !isOfferingConnectedToPricingPlans_1,
                    }, httpCall);
                })
                .catch(function(e) {
                    return console.log(e);
                });
        }
    };
    BookingValidations.prototype.couldBePremiumNavigate = function(offering, activeFeatures) {
        return (offering.type === offering_domain_1.OfferingType.COURSE ||
            feature_enabler_1.isFeatureEnabled(activeFeatures, offering.type) ||
            this.wixSdkAdapter.isPreviewMode() ||
            this.wixSdkAdapter.isDemoMode());
    };
    return BookingValidations;
}());
exports.BookingValidations = BookingValidations;

function couldBePricingPlanNavigate(offering, isPricingPlanInstalled) {
    var isOfferingConnectedToPricingPlans = isOfferingConnectedToPricingPlan(offering);
    return (!isOfferingOfferedAsPricingPlan(offering, isPricingPlanInstalled) ||
        (isOfferingConnectedToPricingPlans && isPricingPlanInstalled));
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
var notifyingOwnerNonPricingPlanEnrollmentAttempt = function(reasonsToBuild, httpCall) {
    var reasons = [];
    if (reasonsToBuild.isPricingPlanNotInstalled) {
        reasons.push("PageNotInstalled" /* PAGE_NOT_INSTALLED */ );
    }
    if (reasonsToBuild.isOfferingNotConnectedToPricingPlan) {
        reasons.push("NoPlansAssignedToOffering" /* NO_PLANS_ASSIGNED_TO_OFFERING */ );
    }
    var offeringId = reasonsToBuild.offeringId;
    httpCall({
        reasons: reasons,
        offeringId: offeringId
    });
};
//# sourceMappingURL=booking-validations.js.map