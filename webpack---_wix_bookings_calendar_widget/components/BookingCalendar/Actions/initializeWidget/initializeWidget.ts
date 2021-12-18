import { TimezoneType } from '@wix/bookings-uou-types';
import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import {
  getLocalTimezone,
  getStartOfMonthAsLocalDateTime,
  getTodayLocalDateTimeStartOfDay,
} from '../../../../utils/dateAndTime/dateAndTime';
import { BottomSectionStatus } from '../../ViewModel/widgetViewModel/widgetViewModel';
import { SetSelectedMonth } from '../setSelectedMonth/setSelectedMonth';
import { CalendarState } from '../../controller';
import { SetSelectedDate } from '../setSelectedDate/setSelectedDate';
import { LayoutOptions, TriggeredByOptions } from '../../../../types/types';
import { SetSelectedRange } from '../setSelectedRange/setSelectedRange';
import { getLocalDateTimeRangeForDay } from '../../../../utils/getLocalDateTimeRangeForDay/getLocalDateTimeRangeForDay';
import settingsParams from '../../settingsParams';
import { BookingsQueryParams } from '@wix/bookings-adapter-ooi-wix-sdk';

export type InitializeWidget = () => Promise<void>;

export function createInitializeWidgetAction(
  {
    getControllerState,
    context,
  }: ActionFactoryParams<CalendarState, CalendarContext>,
  setSelectedDate: SetSelectedDate,
  setSelectedMonth: SetSelectedMonth,
  setSelectedRange: SetSelectedRange,
): InitializeWidget {
  return async () => {
    const {
      wixSdkAdapter,
      biLogger,
      settings,
      experiments,
      businessInfo,
    } = context;

    const isAnonymousCancellationFlow =
      wixSdkAdapter.getUrlQueryParamValue(BookingsQueryParams.REFERRAL) ===
      'batel';
    if (wixSdkAdapter.isSSR()) {
      return;
    }

    const [state, setState] = getControllerState();

    const selectedTimezone = getSelectedTimezone(context);
    setState({ selectedTimezone });

    const todayLocalDateTime = getTodayLocalDateTimeStartOfDay(
      selectedTimezone,
    );
    const initialLocalDate =
      (isAnonymousCancellationFlow && state.selectedDate) || todayLocalDateTime;

    const isUoUWeeklyCalendarOOILiveSiteEnabled = experiments.enabled(
      'specs.bookings.UoUWeeklyCalendarOOILiveSite',
    );
    if (isUoUWeeklyCalendarOOILiveSiteEnabled) {
      const isWeeklyLayout =
        settings.get(settingsParams.calendarLayout) === LayoutOptions.WEEKLY;
      if (isWeeklyLayout) {
        const range = getLocalDateTimeRangeForDay(
          businessInfo!.dateRegionalSettingsLocale!,
          initialLocalDate,
        );
        await setSelectedRange(range, TriggeredByOptions.INITIALIZE_WIDGET);
      } else {
        const startOfMonthAsLocalDateTime = getStartOfMonthAsLocalDateTime(
          initialLocalDate,
        );
        await Promise.all([
          setSelectedDate(
            initialLocalDate,
            TriggeredByOptions.INITIALIZE_WIDGET,
          ),
          setSelectedMonth(
            startOfMonthAsLocalDateTime,
            TriggeredByOptions.INITIALIZE_WIDGET,
          ),
        ]);
      }
    } else {
      const startOfMonthAsLocalDateTime = getStartOfMonthAsLocalDateTime(
        todayLocalDateTime,
      );

      await Promise.all([
        setSelectedDate(
          todayLocalDateTime,
          TriggeredByOptions.INITIALIZE_WIDGET,
        ),
        setSelectedMonth(
          startOfMonthAsLocalDateTime,
          TriggeredByOptions.INITIALIZE_WIDGET,
        ),
      ]);
    }

    setState({ bottomSectionStatus: BottomSectionStatus.LOADED });

    biLogger.bookingsCalendarPageLoaded({});
    biLogger.bookingsCalendarBookingDetailsLoad({
      triggeredBy: TriggeredByOptions.INITIALIZE_WIDGET,
    });
    biLogger.bookingsCalendarFiltersLoad({
      triggeredBy: TriggeredByOptions.INITIALIZE_WIDGET,
      selectedFilters: JSON.stringify(state.filterOptions),
    });
  };
}

function getSelectedTimezone({ businessInfo, wixSdkAdapter }: CalendarContext) {
  const localTimezone = getLocalTimezone();
  const preSelectedTimezone = wixSdkAdapter.getUrlQueryParams().timezone;

  const isPreselectedTimezoneValid = [
    businessInfo!.timeZone,
    localTimezone,
  ].includes(preSelectedTimezone);

  const defaultTimezone =
    businessInfo!.timezoneProperties?.defaultTimezone === TimezoneType.CLIENT
      ? localTimezone
      : businessInfo!.timeZone!;

  return isPreselectedTimezoneValid ? preSelectedTimezone : defaultTimezone;
}
