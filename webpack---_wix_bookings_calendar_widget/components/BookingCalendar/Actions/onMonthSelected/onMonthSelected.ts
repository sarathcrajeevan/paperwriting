import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { SetSelectedMonth } from '../setSelectedMonth/setSelectedMonth';
import { WidgetComponents, WidgetElements } from '../../../../utils/bi/consts';
import { TriggeredByOptions } from '../../../../types/types';

export type OnMonthSelected = (localDateTime: string) => Promise<void>;

export function createOnMonthSelectedAction(
  {
    getControllerState,
    context: { biLogger },
  }: ActionFactoryParams<CalendarState, CalendarContext>,
  setSelectedMonth: SetSelectedMonth,
): OnMonthSelected {
  return async (localDateTime: string) => {
    await setSelectedMonth(localDateTime, TriggeredByOptions.MONTH_SELECTED);
    biLogger.bookingsCalendarClick({
      component: WidgetComponents.DATE_PICKER,
      element: WidgetElements.MONTH_ARROW,
    });
  };
}
