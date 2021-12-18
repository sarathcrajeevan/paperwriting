import { AddError } from '../addError/addError';
import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { isSlotWithOpenWaitingList } from '../../../../utils/timeSlots/timeSlots';
import { checkForPricingPlanError } from '../../../../utils/pricingPlans/pricingPlans';

export type SetSelectedTime = (selectedTime: string | undefined) => void;

export function createSetSelectedTimeAction(
  {
    getControllerState,
    context,
  }: ActionFactoryParams<CalendarState, CalendarContext>,
  addError: AddError,
): SetSelectedTime {
  return (selectedTime: string | undefined) => {
    const [state, setState] = getControllerState();
    const {
      availableSlots,
      purchasedPricingPlans,
      rescheduleBookingDetails,
    } = state;
    const { experiments } = context;
    setState({
      calendarErrors: [],
    });
    let selectableSlots;
    if (selectedTime) {
      selectableSlots = availableSlots?.availabilityEntries?.filter(
        (availableSlot) => {
          return (
            availableSlot.slot?.startDate === selectedTime &&
            (availableSlot.bookable || isSlotWithOpenWaitingList(availableSlot))
          );
        },
      );

      const isShowPricingPlanEndDateIndicationEnabled = experiments.enabled(
        'specs.bookings.ShowPricingPlanEndDateIndication',
      );
      if (isShowPricingPlanEndDateIndicationEnabled) {
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
    }

    setState({
      selectedBookingPreferences: [],
      selectableSlotsAtSelectedTime: selectableSlots ?? [],
      selectedTime,
    });
  };
}
