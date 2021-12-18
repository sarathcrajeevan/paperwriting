import { CouponsErrorType } from '../../../../types/errors';
import { CreateActionParams } from '../actions';
import { FormBiLogger } from '../../../../utils/bi/biLoggerFactory';
import { bookingsApplyPromoCode } from '@wix/bi-logger-wixboost-ugc/v2';
import { FormState } from '../../../../utils/state/initialStateFactory';
import { getErrorByType } from '../../../../utils/errors/errors';

export type SetCoupon = (couponCode?: string) => void;

export function createSetCouponAction({
  getControllerState,
  context,
  internalActions,
}: CreateActionParams): SetCoupon {
  return async (couponCode?: string) => {
    const { calculatePaymentDetails, errorHandlers } = internalActions;
    const { biLogger } = context;

    errorHandlers.clearErrorByTypes([CouponsErrorType]);

    if (couponCode) {
      await calculatePaymentDetails({ couponCode });

      const [state] = getControllerState();
      reportOnApplyCouponBIEvent({ biLogger, state });
    }
  };
}

const reportOnApplyCouponBIEvent = ({
  state,
  biLogger,
}: {
  state: FormState;
  biLogger?: FormBiLogger;
}) => {
  const couponId = state.couponInfo?.appliedCoupon?.couponId;
  const couponName = state.couponInfo?.appliedCoupon?.couponName;
  const errorMessage = getErrorByType({
    errorType: CouponsErrorType,
    errors: state.errors,
  });
  const valid_value = errorMessage ? 'invalid' : 'ok';

  biLogger?.report(
    bookingsApplyPromoCode({
      valid_value,
      couponId,
      couponName,
      errorMessage,
    }),
  );
};
