import { CalendarContext } from '../../../../utils/context/contextFactory';
import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { IUser } from '@wix/native-components-infra/dist/src/types/types';
import {
  checkForPricingPlanError,
  getValidPurchasedPricingPlansForService,
} from '../../../../utils/pricingPlans/pricingPlans';
import { AddError } from '../addError/addError';

export type OnUserLoggedIn = (user?: IUser) => void;

export function createOnUserLoggedInAction(
  {
    getControllerState,
    context: { calendarApi },
  }: ActionFactoryParams<CalendarState, CalendarContext>,
  addError: AddError,
): OnUserLoggedIn {
  return async (user) => {
    const [
      { selectedService, selectedTime, rescheduleBookingDetails },
      setState,
    ] = getControllerState();
    if (user) {
      setState({
        isUserLoggedIn: true,
      });
      const servicePricingPlans = selectedService?.payment.pricingPlanInfo
        ?.pricingPlans!;
      const allPurchasedPricingPlans = user.loggedIn
        ? await calendarApi.getPurchasedPricingPlans({ contactId: user.id })
        : [];
      const purchasedPricingPlans = getValidPurchasedPricingPlansForService({
        allPurchasedPricingPlans,
        servicePricingPlans,
      });

      if (selectedTime) {
        const isRescheduleFlow = !!rescheduleBookingDetails;
        const pricingPlanError = checkForPricingPlanError({
          purchasedPricingPlans,
          isRescheduleFlow,
          selectedTime,
        });
        if (pricingPlanError) {
          addError(pricingPlanError);
        }
      }
      setState({
        purchasedPricingPlans,
      });
    }
  };
}
