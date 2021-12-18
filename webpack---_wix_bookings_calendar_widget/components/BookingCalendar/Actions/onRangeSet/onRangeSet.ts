import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { WidgetComponents, WidgetElements } from '../../../../utils/bi/consts';
import {
  LocalDateTimeRange,
  TriggeredByOptions,
} from '../../../../types/types';
import { SetSelectedRange } from '../setSelectedRange/setSelectedRange';

export type OnRangeSet = (range: LocalDateTimeRange) => Promise<void>;

export function createOnRangeSetAction(
  {
    getControllerState,
    context: { biLogger },
  }: ActionFactoryParams<CalendarState, CalendarContext>,
  setSelectedRange: SetSelectedRange,
): OnRangeSet {
  return async (range: LocalDateTimeRange) => {
    await setSelectedRange(range, TriggeredByOptions.WEEK_SELECTED);
    void biLogger.bookingsCalendarClick({
      component: WidgetComponents.DATE_PICKER,
      element: WidgetElements.WEEK_ARROW,
    });
  };
}
