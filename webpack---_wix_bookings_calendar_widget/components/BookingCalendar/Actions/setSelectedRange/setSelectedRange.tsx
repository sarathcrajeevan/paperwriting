import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import {
  LocalDateTimeRange,
  SlotsStatus,
  TriggeredByOptions,
} from '../../../../types/types';
import { AddError } from '../addError/addError';
import { SetSelectedTime } from '../setSelectedTime/setSelectedTime';
import { BottomSectionStatus } from '../../ViewModel/widgetViewModel/widgetViewModel';
import {
  sendDatePickerLoadedBiEvent,
  sendTimePickerLoadedBiEvent,
} from '../../../../utils/bi/events/events';

export type SetSelectedRange = (
  range: LocalDateTimeRange,
  triggeredBy: TriggeredByOptions,
) => Promise<void>;

export function createSetSelectedRangeAction(
  {
    getControllerState,
    context,
  }: ActionFactoryParams<CalendarState, CalendarContext>,
  addError: AddError,
  setSelectedTime: SetSelectedTime,
): SetSelectedRange {
  return async (range: LocalDateTimeRange, triggeredBy: TriggeredByOptions) => {
    const [state, setState] = getControllerState();
    const { calendarApi, settings, biLogger } = context;
    const { fromAsLocalDateTime, toAsLocalDateTime } = range;
    const selectedRange = {
      from: fromAsLocalDateTime,
      to: toAsLocalDateTime,
    };
    setState({
      selectedRange,
      selectedDate: selectedRange.from,
      bottomSectionStatus: BottomSectionStatus.LOADED,
      slotsStatus: SlotsStatus.LOADING,
      selectedDateTrigger: triggeredBy,
    });
    setSelectedTime(undefined);

    const availableSlots = await calendarApi.getSlotsInRange(range, {
      state,
      settings,
      onError: addError,
    });

    if (fromAsLocalDateTime === getControllerState()[0].selectedRange?.from) {
      setState({ availableSlots });

      if (availableSlots?.availabilityEntries?.length) {
        setState({ slotsStatus: SlotsStatus.AVAILABLE_SLOTS });
      } else {
        setState({
          slotsStatus: SlotsStatus.NO_AVAILABLE_SLOTS,
        });
      }

      sendDatePickerLoadedBiEvent({
        biLogger,
        triggeredBy,
      });

      sendTimePickerLoadedBiEvent({
        availableSlots,
        triggeredBy,
        biLogger,
      });
    }
  };
}
