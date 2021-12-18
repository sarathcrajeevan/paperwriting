import { FormContext } from '../../../../utils/context/contextFactory';
import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { FormState } from '../../../../utils/state/initialStateFactory';
import { ErrorHandlers } from '../errorHandlers/errorHandlers';
import { isValidEmail } from '../../../../utils/form-validations';
import { AppliedDiscount } from '@wix/ambassador-totals-calculator/http';
import { FormStatus } from '../../../../types/form-state';

export type CalculatePaymentDetails = ({
  couponCode,
}: {
  couponCode?: string;
}) => Promise<void>;

export function createCalculatePaymentDetailsAction({
  actionFactoryParams,
  errorHandlers,
}: {
  actionFactoryParams: ActionFactoryParams<FormState, FormContext>;
  errorHandlers: ErrorHandlers;
}): CalculatePaymentDetails {
  return async ({ couponCode }) => {
    const [state, setState] = actionFactoryParams.getControllerState();
    const { formApi, reportError, wixSdkAdapter } = actionFactoryParams.context;
    const {
      formInputs: { numberOfParticipants, email },
      slotAvailability,
      service,
      selectedPaymentType,
    } = state;
    const { id: serviceId, rate } = service;
    const slot = slotAvailability?.slot!;

    setState({
      status: FormStatus.PROCESSING_PAYMENT_DETAILS,
    });

    const isBookingsOnEcom = await wixSdkAdapter.isBookingsOnEcom();

    try {
      if (isBookingsOnEcom) {
        const {
          priceSummary,
          appliedDiscounts,
          payNow,
        } = await formApi.calculateTotalPrice({
          price: service.payment.paymentDetails.price,
          numberOfParticipants,
          couponCode,
          email: isValidEmail(email) ? email : undefined,
          selectedPaymentType,
        });

        const [couponDiscount] = appliedDiscounts!;
        setState({
          couponInfo: {
            ...state.couponInfo,
            appliedCoupon: mapCouponDiscountToAppliedCoupon(couponDiscount),
          },
          paymentDetails: {
            ...state.paymentDetails,
            totalPrice: priceSummary?.total?.amount
              ? Number(priceSummary?.total?.amount)
              : state.paymentDetails.price,
            payNow: Number(payNow?.total?.amount),
          },
          status: FormStatus.IDLE,
        });
      } else {
        const paymentsDetails = await formApi.getPaymentsDetails({
          slot,
          numberOfParticipants,
          rate,
          serviceId,
          couponCode,
          email,
        });
        const appliedCoupon = paymentsDetails?.couponDetails;
        const finalPrice = paymentsDetails?.finalPrice;

        setState({
          couponInfo: {
            ...state.couponInfo,
            appliedCoupon,
          },
          paymentDetails: {
            ...state.paymentDetails,
            minCharge: finalPrice?.downPayAmount
              ? Number(finalPrice.downPayAmount)
              : state.paymentDetails.minCharge,
            totalPrice: finalPrice?.amount
              ? Number(finalPrice?.amount)
              : state.paymentDetails.price,
          },
          status: FormStatus.IDLE,
        });
      }
    } catch (error) {
      errorHandlers.addError(error);
      setState({ status: FormStatus.IDLE });
      reportError(error);
    }
  };
}

function mapCouponDiscountToAppliedCoupon(couponDiscount?: AppliedDiscount) {
  const coupon = couponDiscount?.coupon;
  return coupon
    ? {
        couponCode: coupon?.code,
        couponDiscount: coupon?.amount?.amount,
        couponId: coupon?.id,
        couponName: coupon?.name,
      }
    : undefined;
}
