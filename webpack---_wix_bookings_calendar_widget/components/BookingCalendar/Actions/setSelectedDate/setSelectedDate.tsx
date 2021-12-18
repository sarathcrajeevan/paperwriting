import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import {
  CalendarErrors,
  SlotsStatus,
  TriggeredByOptions,
} from '../../../../types/types';
import { AddError } from '../addError/addError';
import { RemoveError } from '../removeError/removeError';
import { SetSelectedTime } from '../setSelectedTime/setSelectedTime';
import { getEndOfDayFromLocalDateTime } from '../../../../utils/dateAndTime/dateAndTime';
import { sendTimePickerLoadedBiEvent } from '../../../../utils/bi/events/events';

export type SetSelectedDate = (
  localDateTime: string,
  triggeredBy: TriggeredByOptions,
) => Promise<void>;

export function createSetSelectedDateAction(
  {
    getControllerState,
    context,
  }: ActionFactoryParams<CalendarState, CalendarContext>,
  addError: AddError,
  removeError: RemoveError,
  setSelectedTime: SetSelectedTime,
): SetSelectedDate {
  return async (localDateTime: string, triggeredBy: TriggeredByOptions) => {
    const { calendarApi, settings, biLogger } = context;
    const [state, setState] = getControllerState();
    const selectedDate = localDateTime;
    setState({
      selectedDate,
      slotsStatus: SlotsStatus.LOADING,
      selectedDateTrigger: triggeredBy,
    });
    setSelectedTime(undefined);

    const endOfSelectedDateAsLocalDateTime = getEndOfDayFromLocalDateTime(
      selectedDate,
    );
    const availableSlots = await calendarApi.getSlotsInRange(
      {
        fromAsLocalDateTime: selectedDate,
        toAsLocalDateTime: endOfSelectedDateAsLocalDateTime,
      },
      {
        state,
        settings,
        onError: addError,
      },
    );

    if (selectedDate === getControllerState()[0].selectedDate) {
      setState({ availableSlots });

      if (availableSlots?.availabilityEntries?.length) {
        setState({ slotsStatus: SlotsStatus.AVAILABLE_SLOTS });
      } else {
        setState({
          slotsStatus: SlotsStatus.NO_AVAILABLE_SLOTS,
        });
      }

      sendTimePickerLoadedBiEvent({
        availableSlots,
        triggeredBy,
        selectedDate,
        biLogger,
      });
    }
  };
}
