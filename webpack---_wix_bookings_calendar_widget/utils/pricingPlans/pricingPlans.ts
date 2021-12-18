import { PricingPlan } from '@wix/ambassador-services-catalog-server/http';
import { Balance } from '@wix/ambassador-pricing-plan-benefits-server/types';
import { Plan } from '@wix/ambassador-checkout-server/types';
import { CalendarErrors, Optional } from '../../types/types';
import { getDateTimeFromLocalDateTime } from '../dateAndTime/dateAndTime';

export const getValidPurchasedPricingPlansForService = ({
  servicePricingPlans,
  allPurchasedPricingPlans,
}: {
  servicePricingPlans: PricingPlan[];
  allPurchasedPricingPlans: Balance[];
}) => {
  const allPurchasedPricingPlansForService: Balance[] = filterPurchasedPricingPlans(
    allPurchasedPricingPlans,
    servicePricingPlans,
  );
  const allValidPurchasedPricingPlansForService: Balance[] = filterValidUserPricingPlans(
    allPurchasedPricingPlansForService,
  );
  return allValidPurchasedPricingPlansForService.map((plan: Balance) => {
    return {
      validFrom: plan.orderInfo?.validFrom,
      validUntil: plan.orderInfo?.validUntil,
      planName: plan.planInfo?.name,
      paidPlan: {
        orderId: plan.planInfo?.id,
      },
    };
  });
};

const filterPurchasedPricingPlans = (
  purchasedPricingPlans: Balance[],
  servicePricingPlans: PricingPlan[],
): Balance[] => {
  return purchasedPricingPlans?.filter((userPlan: Balance) => {
    return servicePricingPlans?.find(
      (servicePlan) => servicePlan.id === userPlan.planInfo?.id,
    );
  });
};

const filterValidUserPricingPlans = (
  allPurchasedPricingPlansForService: Balance[],
): Balance[] => {
  const now = new Date();
  return (
    allPurchasedPricingPlansForService?.filter((plan: Balance) => {
      const planWithRemainCredits = plan.benefit?.remainingCredits !== 0;
      const planValidUntil = plan.orderInfo?.validUntil;
      const planValidUntilDate =
        !planValidUntil ||
        (planValidUntil && new Date(planValidUntil).getTime() >= now.getTime());
      return planWithRemainCredits && planValidUntilDate;
    }) || []
  );
};

export const getFurthestValidUntilPlan = (
  purchasedPricingPlans: Plan[] = [],
) => {
  return purchasedPricingPlans?.sort((planA: Plan, planB: Plan) => {
    return (
      new Date(planB.validUntil!).getTime() -
      new Date(planA.validUntil!).getTime()
    );
  })?.[0];
};

export const checkForPricingPlanError = ({
  purchasedPricingPlans,
  isRescheduleFlow,
  selectedTime,
}: {
  purchasedPricingPlans?: Plan[];
  isRescheduleFlow: boolean;
  selectedTime: string;
}): Optional<CalendarErrors> => {
  const hasPlanWithoutValidUntil = isPurchasedPlansHasAPlanWithoutValidUntil(
    purchasedPricingPlans,
  );
  if (!hasPlanWithoutValidUntil) {
    const isSelectedTimeFurtherThanAllPricingPlan = isSelectedTimeFurtherThanAllPricingPlanValidUntilTimes(
      purchasedPricingPlans,
      selectedTime,
    );
    if (
      isSelectedTimeFurtherThanAllPricingPlan &&
      purchasedPricingPlans?.length
    ) {
      if (isRescheduleFlow) {
        return CalendarErrors.NO_VALID_PRICING_PLAN_IN_RESCHEDULE_FLOW_ERROR;
      } else {
        return CalendarErrors.NO_VALID_PRICING_PLAN_WARNING;
      }
    }
  }
};

const isPurchasedPlansHasAPlanWithoutValidUntil = (
  purchasedPricingPlans: Plan[] = [],
) => {
  return purchasedPricingPlans?.some(
    (pricingPlan: Plan) => !pricingPlan.validUntil,
  );
};

const isSelectedTimeFurtherThanAllPricingPlanValidUntilTimes = (
  purchasedPricingPlans: Plan[] = [],
  selectedTime: string,
) => {
  return purchasedPricingPlans?.every(
    (pricingPlan: Plan) =>
      pricingPlan.validUntil &&
      getDateTimeFromLocalDateTime(selectedTime).getTime() >
        getDateTimeFromLocalDateTime(pricingPlan.validUntil).getTime(),
  );
};
