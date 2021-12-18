import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { WidgetComponents, WidgetElements } from '../../../../utils/bi/consts';
import { submitErrors } from '../onSubmit/onSubmit';
import { CalendarErrors, TriggeredByOptions } from '../../../../types/types';

export type OnClearBookingDetailSelectedOptions = () => Promise<void>;

export function createOnClearBookingDetailSelectedOptionsAction({
  getControllerState,
  context,
}: ActionFactoryParams<
  CalendarState,
  CalendarContext
>): OnClearBookingDetailSelectedOptions {
  return async () => {
    const [state, setState] = getControllerState();
    const { biLogger } = context;
    const { selectedTime, calendarErrors } = state;

    const calendarErrorsFilteredSubmitErrors = calendarErrors.filter(
      (calendarError) => {
        return !submitErrors.includes(calendarError);
      },
    );

    setState({
      selectedBookingPreferences: [],
      calendarErrors: calendarErrorsFilteredSubmitErrors,
    });

    void biLogger.bookingsCalendarClick({
      component: WidgetComponents.BOOKING_DETAILS,
      element: WidgetElements.CLEAR_BUTTON,
    });

    void biLogger.bookingsCalendarBookingDetailsLoad({
      triggeredBy: TriggeredByOptions.BOOKING_DETAILS_CLEAR_BUTTON,
      selectedSlot: selectedTime,
    });
  };
}
