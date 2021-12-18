import { IUser } from '@wix/native-components-infra/dist/src/types/types';
import { GenericErrorType } from '../../../../types/errors';
import { CreateActionParams } from '../actions';
import { bookingsLoginClick } from '@wix/bi-logger-wixboost-ugc/v2';
import { BookingsQueryParams } from '@wix/bookings-adapter-ooi-wix-sdk';
import { getDefaultPaymentOptionId } from '../../../../utils/payment/payment';
import { FormStatus } from '../../../../types/form-state';

export type OnLogin = (user?: IUser) => Promise<void>;

export function createOnLoginAction({
  getControllerState,
  context,
  internalActions,
}: CreateActionParams): OnLogin {
  return async (user) => {
    const [state, setState] = getControllerState();
    const { slotAvailability, isPricingPlanInstalled } = state;
    const { serviceId, startDate } = slotAvailability.slot!;
    const { formApi, settings, wixSdkAdapter, biLogger, reportError } = context;
    const { errorHandlers } = internalActions;

    biLogger?.report(bookingsLoginClick({}));

    wixSdkAdapter.removeFromSessionStorage(BookingsQueryParams.FILLED_FIELDS);

    if (user) {
      try {
        const [memberDetails, pricingPlanDetails] = await Promise.all([
          formApi.getMemberDetails(user.id),
          formApi.getPricingPlanDetails({
            serviceId: serviceId!,
            startTime: startDate!,
          }),
        ]);

        const selectedPaymentOptionId = getDefaultPaymentOptionId({
          settings,
          servicePayment: state.service.payment,
          pricingPlanDetails,
          isPricingPlanInstalled,
        });

        setState({
          memberDetails,
          pricingPlanDetails,
          selectedPaymentOptionId,
          status: FormStatus.IDLE,
          overrideDefaultFieldsValues: true,
        });
      } catch (error) {
        errorHandlers.addError(error);
        setState({ status: FormStatus.IDLE });
        reportError(error);
      }
    } else {
      errorHandlers.addError(GenericErrorType.GENERIC_MEMBER_DETAILS_ERROR);
      reportError(GenericErrorType.GENERIC_MEMBER_DETAILS_ERROR);
    }
  };
}
