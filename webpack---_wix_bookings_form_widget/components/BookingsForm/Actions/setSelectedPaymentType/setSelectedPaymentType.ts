import { SelectedPaymentOption } from '@wix/ambassador-gateway/types';
import { CreateActionParams } from '../actions';

export type setSelectedPaymentType = (
  selectedPaymentType: SelectedPaymentOption,
) => void;

export function createSetSelectedPaymentTypeAction({
  getControllerState,
  internalActions: { calculatePaymentDetails },
}: CreateActionParams): setSelectedPaymentType {
  return async (selectedPaymentType: SelectedPaymentOption) => {
    const [state, setState] = getControllerState();

    setState({ selectedPaymentType });
    await calculatePaymentDetails({
      couponCode: state.couponInfo.appliedCoupon?.couponCode,
    });
  };
}
