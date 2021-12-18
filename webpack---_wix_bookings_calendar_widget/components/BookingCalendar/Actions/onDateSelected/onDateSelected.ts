import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { WidgetComponents, WidgetElements } from '../../../../utils/bi/consts';
import { SetSelectedDate } from '../setSelectedDate/setSelectedDate';
import { FlowElements } from '../../Hooks/useFlow';
import { SetFocusedElement } from '../setFocusedElement/setFocusedElement';
import { TriggeredByOptions } from '../../../../types/types';

export type OnDateSelected = (
  localDateTime: string,
  triggeredBy: TriggeredByOptions,
) => Promise<void>;

export function createOnDateSelectedAction(
  {
    getControllerState,
    context: { biLogger },
  }: ActionFactoryParams<CalendarState, CalendarContext>,
  setSelectedDate: SetSelectedDate,
  setFocusedElement: SetFocusedElement,
): OnDateSelected {
  return async (localDateTime: string, triggeredBy: TriggeredByOptions) => {
    void biLogger.bookingsCalendarClick({
      component: WidgetComponents.DATE_PICKER,
      element: WidgetElements.DATE_IN_MONTH,
    });
    await setSelectedDate(localDateTime, triggeredBy);
    setFocusedElement(FlowElements.TIME_PICKER);
  };
}
