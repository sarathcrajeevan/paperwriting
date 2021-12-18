import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { WidgetComponents, WidgetElements } from '../../../../utils/bi/consts';
import { RefetchPlatformData } from '../refetchPlatformData/refetchPlatformData';
import { SetSelectedTime } from '../setSelectedTime/setSelectedTime';
import { TriggeredByOptions } from '../../../../types/types';

export type OnTimezoneSelected = (timezone: string) => Promise<void>;

export function createOnTimezoneSelectedAction(
  {
    getControllerState,
    context: { biLogger },
  }: ActionFactoryParams<CalendarState, CalendarContext>,
  refetchPlatformData: RefetchPlatformData,
  setSelectedTime: SetSelectedTime,
): OnTimezoneSelected {
  return async (timezone: string) => {
    const [state, setState] = getControllerState();

    void biLogger.bookingsCalendarClick({
      component: WidgetComponents.TIMEZONE_PICKER,
      element: WidgetElements.DROPDOWN,
      properties: JSON.stringify({
        currentTimezone: state.selectedTimezone,
        newTimezone: timezone,
      }),
    });

    setState({
      selectedTimezone: timezone,
    });

    setSelectedTime(undefined);

    await refetchPlatformData(TriggeredByOptions.TIMEZONE_CHANGED);
  };
}
