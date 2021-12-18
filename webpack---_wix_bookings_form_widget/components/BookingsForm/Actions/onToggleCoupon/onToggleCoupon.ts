import { CreateActionParams } from '../actions';
import { bookingsClickOnEnterPromoCode } from '@wix/bi-logger-wixboost-ugc/v2';

export type OnToggleCoupon = () => void;

export function createOnToggleCouponAction({
  context,
  getControllerState,
}: CreateActionParams): OnToggleCoupon {
  return async () => {
    const [state, setState] = getControllerState();
    const { biLogger } = context;
    const {
      couponInfo: { isCouponInputDisplayed },
    } = state;
    if (!isCouponInputDisplayed) {
      biLogger?.report(bookingsClickOnEnterPromoCode({}));
    }
    setState({
      couponInfo: {
        ...state.couponInfo,
        isCouponInputDisplayed: !isCouponInputDisplayed,
      },
    });
  };
}
