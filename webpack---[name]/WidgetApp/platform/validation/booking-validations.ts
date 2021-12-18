import { WixOOISDKAdapter } from '@wix/bookings-adapter-ooi-wix-sdk/dist/src/WixOOISDKAdapter';
import { IOfferingViewModel } from '../../domain/offering-view-model-factory';
import { OfferingType } from '@wix/bookings-uou-domain';
import { OfferingIntent } from '../navigation/navigation.const';
import { isFeatureEnabled } from '@wix/bookings-config/dist/src/active-features/feature-enabler';

export const enum OfferedAsType {
  ONE_TIME = 'ONE_TIME',
  PRICING_PLAN = 'PRICING_PLAN',
}

export const enum pricingPlanConst {
  PAGE_NOT_INSTALLED = 'PageNotInstalled',
  NO_PLANS_ASSIGNED_TO_OFFERING = 'NoPlansAssignedToOffering',
}

export interface ShouldNavigateResponse {
  canBook: boolean;
  reason?: ShouldNavigateReason;
}

export interface ShouldNavigateReason {
  premiumError: boolean;
  pricingPlanError: boolean;
  isOfferingConnectedToPricingPlans: boolean;
  isPricingPlanInstalled: boolean;
}

export class BookingValidations {
  constructor(private readonly wixSdkAdapter: WixOOISDKAdapter) {}

  async shouldNavigate(
    offering,
    activeFeatures,
    intent,
  ): Promise<ShouldNavigateResponse> {
    if (
      intent === OfferingIntent.SHOW_DETAILS ||
      this.wixSdkAdapter.isPreviewMode() ||
      this.wixSdkAdapter.isDemoMode() ||
      this.wixSdkAdapter.isTemplateMode()
    ) {
      return { canBook: true };
    }
    return this.canBook(offering, activeFeatures);
  }

  canBook(offering, activeFeatures) {
    return this.wixSdkAdapter
      .isPricingPlanInstalled()
      .then((isPricingPlanInstalled) => {
        const couldBePremium = this.couldBePremiumNavigate(
          offering,
          activeFeatures,
        );
        const couldBePricingPlan = couldBePricingPlanNavigate(
          offering,
          isPricingPlanInstalled,
        );
        return {
          canBook: couldBePremium && couldBePricingPlan.canBook,
          reason: {
            premiumError: !couldBePremium,
            pricingPlanError: !couldBePricingPlan.canBook,
            isOfferingConnectedToPricingPlans:
              couldBePricingPlan.isOfferingConnectedToPricingPlans,
            isPricingPlanInstalled,
          },
        };
      });
  }

  private couldBePremiumNavigate(offering, activeFeatures): boolean {
    return (
      offering.type === OfferingType.COURSE ||
      isFeatureEnabled(activeFeatures, offering.type)
    );
  }
}

function couldBePricingPlanNavigate(
  offering,
  isPricingPlanInstalled,
): {
  canBook: boolean;
  isOfferingConnectedToPricingPlans: boolean;
} {
  const isOfferingConnectedToPricingPlans = isOfferingConnectedToPricingPlan(
    offering,
  );

  const offeringOfferedAsPricingPlan = isOfferingOfferedAsPricingPlan(
    offering,
    isPricingPlanInstalled,
  );
  return {
    canBook:
      !offeringOfferedAsPricingPlan ||
      (isOfferingConnectedToPricingPlans && isPricingPlanInstalled),
    isOfferingConnectedToPricingPlans,
  };
}

const isOfferingConnectedToPricingPlan = (offering) =>
  !!(
    offering.pricingPlanInfo &&
    offering.pricingPlanInfo.pricingPlans &&
    offering.pricingPlanInfo.pricingPlans.length
  );

const isOfferingOfferedAsPricingPlan = (
  offeringViewModel: IOfferingViewModel,
  isPricingPlanInstalled,
) =>
  getOfferedAs(offeringViewModel, isPricingPlanInstalled).indexOf(
    OfferedAsType.PRICING_PLAN,
  ) > -1;

const getOfferedAs = (offering, isPricingPlanInstalled) => {
  if (
    offering.offeredAs.indexOf(OfferedAsType.ONE_TIME) >= 0 &&
    offering.offeredAs.indexOf(OfferedAsType.PRICING_PLAN) >= 0
  ) {
    if (offering.pricingPlanInfo.pricingPlans.length === 0) {
      return [OfferedAsType.ONE_TIME];
    }
    if (!isPricingPlanInstalled) {
      return [OfferedAsType.ONE_TIME];
    }
  }
  return offering.offeredAs;
};

export const getNotifyPricingPlanRequest = (
  offering,
  reason: ShouldNavigateReason,
) => {
  const reasons = [];
  if (!reason.isPricingPlanInstalled) {
    reasons.push(pricingPlanConst.PAGE_NOT_INSTALLED);
  }
  if (!reason.isOfferingConnectedToPricingPlans) {
    reasons.push(pricingPlanConst.NO_PLANS_ASSIGNED_TO_OFFERING);
  }
  const offeringId = offering.id;
  return { reasons, offeringId };
};
