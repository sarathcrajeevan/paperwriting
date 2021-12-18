import { CreateActionParams } from '../actions';
import { CouponsErrorType } from '../../../../types/errors';
import { bookingsDeletePromoCode } from '@wix/bi-logger-wixboost-ugc/v2';

export type RemoveCoupon = (clearErrors?: boolean) => void;

export function createRemoveCouponAction({
  getControllerState,
  context,
  internalActions,
}: CreateActionParams): RemoveCoupon {
  return async (clearErrors = true) => {
    const [state] = getControllerState();
    const { errorHandlers, calculatePaymentDetails } = internalActions;
    const { biLogger } = context;

    if (clearErrors) {
      errorHandlers.clearErrorByTypes([CouponsErrorType]);
    }

    await calculatePaymentDetails({});

    biLogger?.report(
      bookingsDeletePromoCode({
        couponId: state.couponInfo.appliedCoupon?.couponId,
        couponName: state.couponInfo.appliedCoupon?.couponName,
      }),
    );
  };
}
