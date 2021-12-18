import { BookingsQueryParams } from '@wix/bookings-adapter-ooi-wix-sdk';
import { FormState } from '../state/initialStateFactory';
import { widgetDefaults } from './consts';
import { VisitorLogger } from '@wix/yoshi-flow-editor';
import { Location as ServiceLocation } from '../mappers/service.mapper';

export interface FormBiLogger extends VisitorLogger {
  update: (state: FormState) => void;
}

export function createFormBiLogger({
  viewerBiLogger,
  formState,
  wixSdkAdapter,
}: {
  viewerBiLogger: VisitorLogger;
  formState: FormState;
  wixSdkAdapter: any;
}): FormBiLogger {
  const getSelectedLocation = (location: ServiceLocation) => {
    return location?.id || location?.name || location?.address;
  };
  const mapStateToDefaultBiParams = (state: FormState) => {
    const {
      selectedPaymentOptionId,
      service,
      formInputs: { numberOfParticipants },
      businessInfo,
      couponInfo,
      pricingPlanDetails,
      memberDetails,
      slotAvailability,
    } = state;

    const staffMemberIds = service.staffMembers
      .map((staffMember) => staffMember.id)
      .join(', ');

    const selectedPlan = pricingPlanDetails?.plans?.find(
      (plan) => plan?.paidPlan?.orderId === selectedPaymentOptionId,
    );

    const numberOfRequiredFields = service.formSchema.fields?.reduce(
      (requiredFieldSum, field) =>
        requiredFieldSum +
        (field.renderInfo?.validationProperties?.required ? 1 : 0),
      0,
    );

    return {
      pageName: widgetDefaults.pageName,
      sessionId: slotAvailability.slot?.sessionId,
      staffId: staffMemberIds,
      currency: service.payment.paymentDetails.currency,
      price: service.payment.paymentDetails.price,
      depositAmount: service.payment.paymentDetails.minCharge,
      servicePaymentOptions: JSON.stringify(service.paymentTypes),
      selectedLocation: getSelectedLocation(service.location),
      paymentDetails: selectedPlan
        ? selectedPlan?.planName
        : selectedPaymentOptionId,
      serviceId: service.id,
      numParticipants: numberOfParticipants,
      serviceType: service.type,
      formId: service.formSchema.formId! as any,
      language: businessInfo?.language,
      isCouponCode: !!couponInfo.appliedCoupon?.couponDiscount,
      smsCapability: businessInfo.isSMSReminderEnabled,
      isUoUloggedIn: !!memberDetails,
      numberOfRequiredFields,
    };
  };

  const updateDefaultBiParams = (state: FormState) => {
    viewerBiLogger.updateDefaults(mapStateToDefaultBiParams(state));
  };

  viewerBiLogger?.updateDefaults?.({
    ...widgetDefaults,
    referralInfo: wixSdkAdapter.getUrlQueryParamValue(
      BookingsQueryParams.REFERRAL,
    ),
    ...mapStateToDefaultBiParams(formState),
  });

  return Object.assign(viewerBiLogger, {
    update: updateDefaultBiParams,
  }) as FormBiLogger;
}
