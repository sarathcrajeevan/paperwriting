import { CreateActionParams } from '../actions';
import { getFirstAvailablePaymentOptionId } from '../../../../utils/payment/payment';

export type SetNumberOfParticipants = (numberOfParticipants: number) => void;

export function createSetNumberOfParticipantsAction({
  getControllerState,
  context,
  internalActions,
}: CreateActionParams): SetNumberOfParticipants {
  return async (numberOfParticipants: number) => {
    const [state, setState] = getControllerState();
    const { calculatePaymentDetails, setPaymentOption } = internalActions;
    const {
      isPricingPlanInstalled,
      selectedPaymentOptionId,
      service,
      pricingPlanDetails,
      businessInfo,
      formInputs,
      couponInfo,
    } = state;
    const { t, settings } = context;
    setState({
      formInputs: {
        ...formInputs,
        numberOfParticipants,
      },
    });

    await calculatePaymentDetails({
      couponCode: couponInfo.appliedCoupon?.couponCode,
    });

    const firstAvailableOptionId = getFirstAvailablePaymentOptionId({
      service,
      pricingPlanDetails: pricingPlanDetails!,
      isPricingPlanInstalled,
      businessInfo,
      numberOfParticipants,
      selectedPaymentOptionId,
      t,
      settings,
    });
    if (firstAvailableOptionId) {
      setPaymentOption(firstAvailableOptionId);
    }
  };
}
