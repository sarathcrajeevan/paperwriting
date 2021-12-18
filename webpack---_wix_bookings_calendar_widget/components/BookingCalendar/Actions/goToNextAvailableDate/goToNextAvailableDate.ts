import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { WidgetComponents, WidgetElements } from '../../../../utils/bi/consts';
import { SetSelectedDate } from '../setSelectedDate/setSelectedDate';
import { SetSelectedRange } from '../setSelectedRange/setSelectedRange';
import { SetSelectedMonth } from '../setSelectedMonth/setSelectedMonth';
import { AddError } from '../addError/addError';
import {
  getEndOfMonthAsLocalDateTime,
  isMonthDifferent,
} from '../../../../utils/dateAndTime/dateAndTime';
import {
  CalendarErrors,
  LayoutOptions,
  SlotsStatus,
  TriggeredByOptions,
} from '../../../../types/types';
import { getLocalDateTimeRangeForDay } from '../../../../utils/getLocalDateTimeRangeForDay/getLocalDateTimeRangeForDay';
import settingsParams from '../../settingsParams';

export type GoToNextAvailableDate = () => void;

export function createGoToNextAvailableDateAction(
  {
    getControllerState,
    context: { biLogger, calendarApi, settings, businessInfo, experiments },
  }: ActionFactoryParams<CalendarState, CalendarContext>,
  setSelectedDate: SetSelectedDate,
  setSelectedMonth: SetSelectedMonth,
  setSelectedRange: SetSelectedRange,
  addError: AddError,
): GoToNextAvailableDate {
  return async () => {
    const [state, setState] = getControllerState();
    const { selectedDate } = state;

    setState({
      slotsStatus: SlotsStatus.LOADING,
    });

    const threeMonthsFromSelectedDate = getEndOfMonthAsLocalDateTime(
      selectedDate!,
      4,
    );
    const nextAvailableLocalDateTime = await calendarApi.getNextAvailableDate(
      {
        fromAsLocalDateTime: selectedDate!,
        toAsLocalDateTime: threeMonthsFromSelectedDate,
      },
      { state, settings, onError: addError },
    );

    if (nextAvailableLocalDateTime) {
      const isUoUWeeklyCalendarOOILiveSiteEnabled = experiments.enabled(
        'specs.bookings.UoUWeeklyCalendarOOILiveSite',
      );
      if (isUoUWeeklyCalendarOOILiveSiteEnabled) {
        const isWeeklyLayout =
          settings.get(settingsParams.calendarLayout) === LayoutOptions.WEEKLY;
        if (isWeeklyLayout) {
          const range = getLocalDateTimeRangeForDay(
            businessInfo!.dateRegionalSettingsLocale!,
            nextAvailableLocalDateTime,
          );
          await setSelectedRange(
            range,
            TriggeredByOptions.GO_TO_NEXT_AVAILABLE_DATE_LINK,
          );
        } else {
          const shouldFetchDateAvailability = isMonthDifferent(
            selectedDate!,
            nextAvailableLocalDateTime,
          );

          await Promise.all([
            setSelectedDate(
              nextAvailableLocalDateTime,
              TriggeredByOptions.GO_TO_NEXT_AVAILABLE_DATE_LINK,
            ),
            shouldFetchDateAvailability
              ? setSelectedMonth(
                  nextAvailableLocalDateTime,
                  TriggeredByOptions.GO_TO_NEXT_AVAILABLE_DATE_LINK,
                )
              : Promise.resolve(),
          ]);
        }
      } else {
        const shouldFetchDateAvailability = isMonthDifferent(
          selectedDate!,
          nextAvailableLocalDateTime,
        );

        await Promise.all([
          setSelectedDate(
            nextAvailableLocalDateTime,
            TriggeredByOptions.GO_TO_NEXT_AVAILABLE_DATE_LINK,
          ),
          shouldFetchDateAvailability
            ? setSelectedMonth(
                nextAvailableLocalDateTime,
                TriggeredByOptions.GO_TO_NEXT_AVAILABLE_DATE_LINK,
              )
            : Promise.resolve(),
        ]);
      }

      void biLogger.bookingsCalendarClick({
        component: WidgetComponents.TIME_PICKER,
        element: WidgetElements.GO_TO_NEXT_AVAILABLE_DATE_LINK,
        properties: JSON.stringify({
          selectedDate,
          nextAvailableDate: nextAvailableLocalDateTime,
        }),
      });
    } else {
      setState({
        slotsStatus: SlotsStatus.NO_AVAILABLE_SLOTS,
      });
      void biLogger.bookingsCalendarErrorMessages({
        errorMessage: CalendarErrors.NO_NEXT_AVAILABLE_DATE_WARNING,
      });
    }
  };
}
