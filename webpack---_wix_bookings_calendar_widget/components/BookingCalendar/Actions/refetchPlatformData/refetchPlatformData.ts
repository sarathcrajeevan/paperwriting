import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { SetSelectedMonth } from '../setSelectedMonth/setSelectedMonth';
import { SetSelectedDate } from '../setSelectedDate/setSelectedDate';
import { SetSelectedRange } from '../setSelectedRange/setSelectedRange';
import {
  LayoutOptions,
  LocalDateTimeRange,
  TriggeredByOptions,
} from '../../../../types/types';
import settingsParams from '../../settingsParams';

export type RefetchPlatformData = (
  triggeredBy: TriggeredByOptions,
) => Promise<void>;

export function createRefetchPlatformDataAction(
  {
    getControllerState,
    context,
  }: ActionFactoryParams<CalendarState, CalendarContext>,
  setSelectedDate: SetSelectedDate,
  setSelectedMonth: SetSelectedMonth,
  setSelectedRange: SetSelectedRange,
): RefetchPlatformData {
  return async (triggeredBy) => {
    const [state] = getControllerState();
    const { selectedRange, selectedDate } = state;
    const { settings, experiments } = context;

    const isUoUWeeklyCalendarOOILiveSiteEnabled = experiments.enabled(
      'specs.bookings.UoUWeeklyCalendarOOILiveSite',
    );
    if (isUoUWeeklyCalendarOOILiveSiteEnabled) {
      const isWeeklyLayout =
        settings.get(settingsParams.calendarLayout) === LayoutOptions.WEEKLY;
      if (isWeeklyLayout) {
        const range: LocalDateTimeRange = {
          fromAsLocalDateTime: selectedRange!.from,
          toAsLocalDateTime: selectedRange!.to,
        };
        await setSelectedRange(range, triggeredBy);
      } else {
        await Promise.all([
          setSelectedDate(selectedDate!, triggeredBy),
          setSelectedMonth(selectedRange!.from, triggeredBy),
        ]);
      }
    } else {
      await Promise.all([
        setSelectedDate(selectedDate!, triggeredBy),
        setSelectedMonth(selectedRange!.from, triggeredBy),
      ]);
    }
  };
}
