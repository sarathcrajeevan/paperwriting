import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { getEndOfMonthAsLocalDateTime } from '../../../../utils/dateAndTime/dateAndTime';
import { TriggeredByOptions } from '../../../../types/types';
import { sendDatePickerLoadedBiEvent } from '../../../../utils/bi/events/events';

export type SetSelectedMonth = (
  localDateTime: string,
  triggeredBy: TriggeredByOptions,
) => Promise<void>;

export function createSetSelectedMonthAction({
  getControllerState,
  context: { calendarApi, biLogger, settings },
}: ActionFactoryParams<CalendarState, CalendarContext>): SetSelectedMonth {
  return async (localDateTime: string, triggeredBy: TriggeredByOptions) => {
    const [state, setState] = getControllerState();
    const endOfMonthAsLocalDateTime = getEndOfMonthAsLocalDateTime(
      localDateTime,
      1,
    );
    const selectedRange = {
      from: localDateTime,
      to: endOfMonthAsLocalDateTime,
    };
    setState({
      selectedRange,
    });

    const availableSlotsPerDay = await calendarApi.getDateAvailability(
      {
        fromAsLocalDateTime: localDateTime,
        toAsLocalDateTime: endOfMonthAsLocalDateTime,
      },
      { state, settings },
    );

    setState({
      availableSlotsPerDay,
    });

    sendDatePickerLoadedBiEvent({
      biLogger,
      availableSlotsPerDay,
      triggeredBy,
    });
  };
}
