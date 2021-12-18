import { ViewModelFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { MemoizedViewModalFactory } from '../viewModel';
import settingsParams from '../../settingsParams';
import { SlotsStatus } from '../../../../types/types';
import {
  createTimezoneSelectionViewModel,
  memoizedTimezoneSelectionViewModel,
  TimezoneSelectionViewModel,
} from '../timezoneSelectionViewModel/timezoneSelectionViewModel';
import {
  createNoAvailableSlotsViewModel,
  memoizedNoAvailableSlotsViewModel,
  NoAvailableSlotsViewModel,
} from '../noAvailableSlotsViewModel/noAvailableSlotsViewModel';
import {
  createSlotsSelectionViewModel,
  memoizedSlotsSelectionViewModel,
  SlotsSelectionViewModel,
} from '../slotsSelectionViewModel/slotsSelectionViewModel';
import {
  createSlotsNotificationViewModel,
  memoizedSlotsNotificationViewModel,
  SlotsNotificationViewModel,
} from '../slotsNotificationViewModel/slotsNotificationViewModel';
import {
  createWeekPickerViewModel,
  memoizedWeekPickerViewModel,
  WeekPickerViewModel,
} from '../weekPickerViewModel/weekPickerViewModel';
import {
  getTimeSlotsAvailabilityStatuses,
  filterTimeSlotsAvailabilityStatusesByDate,
  TimeSlotAvailabilityStatus,
} from '../../../../utils/timeSlots/timeSlots';
import {
  formatLocalDateTimeToDay,
  formatLocalDateTimeToShortWeekday,
  formatLocalDateTimeToWeekday,
  formatMonth,
  getDateTimeFromLocalDateTime,
  getStartOfNextDateLocalDateTime,
  getTodayLocalDateTimeStartOfDay,
} from '../../../../utils/dateAndTime/dateAndTime';

export interface SlotsPerDay {
  date: string;
  weekday: string;
  day: string;
  isToday: boolean;
  isPastDate: boolean;
  slotsSelectionViewModel: SlotsSelectionViewModel;
  accessibility: {
    dayWithoutSlotsSrOnlyText: string;
    dayWithSlotsSrOnlyText: string;
    dayDetailsAriaLabel: string;
  };
}

export type WeeklyLayoutViewModel = {
  bodyTitle: string;
  timezoneSelectionViewModel?: TimezoneSelectionViewModel;
  slotsStatus: SlotsStatus;
  weekPickerViewModel?: WeekPickerViewModel;
  slotsNotificationViewModel?: SlotsNotificationViewModel;
  noAvailableSlotsViewModel?: NoAvailableSlotsViewModel;
  slotsPerDays?: SlotsPerDay[];
};

export const memoizedWeeklyLayoutViewModel: MemoizedViewModalFactory<WeeklyLayoutViewModel> = {
  dependencies: {
    settings: ['dateAndTimeSectionHeader'],
    state: [
      'slotsStatus',
      'availableSlots',
      'selectedRange',
      'selectedTimezone',
      'selectedTime',
    ],
    subDependencies: [
      memoizedTimezoneSelectionViewModel.dependencies,
      memoizedSlotsNotificationViewModel.dependencies,
      memoizedWeekPickerViewModel.dependencies,
      memoizedNoAvailableSlotsViewModel.dependencies,
      memoizedSlotsSelectionViewModel.dependencies,
    ],
  },
  createViewModel: createWeeklyLayoutViewModel,
};

export function createWeeklyLayoutViewModel({
  state,
  context,
}: ViewModelFactoryParams<
  CalendarState,
  CalendarContext
>): WeeklyLayoutViewModel {
  const { getContent } = context;
  const { slotsStatus, availableSlots, selectedRange } = state;

  let slotsPerDays;
  let slotsNotificationViewModel;
  let weekPickerViewModel;
  let noAvailableSlotsViewModel;
  if (selectedRange) {
    const timeSlotsAvailabilityStatuses: Map<
      string,
      TimeSlotAvailabilityStatus
    > = getTimeSlotsAvailabilityStatuses(availableSlots);

    slotsPerDays = getSlotsPerDays({
      timeSlotsAvailabilityStatuses,
      state,
      context,
    });

    slotsNotificationViewModel = createSlotsNotificationViewModel({
      timeSlotsAvailabilityStatuses,
      state,
      context,
    });

    weekPickerViewModel = createWeekPickerViewModel({ state, context });

    noAvailableSlotsViewModel = createNoAvailableSlotsViewModel({
      state,
      context,
    });
  }

  return {
    bodyTitle: getContent({
      settingsParam: settingsParams.dateAndTimeSectionHeader,
      translationKey: 'app.settings.defaults.widget.date-and-time-header',
    }),
    slotsStatus,
    timezoneSelectionViewModel: createTimezoneSelectionViewModel({
      state,
      context,
    }),
    weekPickerViewModel,
    slotsNotificationViewModel,
    slotsPerDays,
    noAvailableSlotsViewModel,
  };
}

const getSlotsPerDays = ({
  timeSlotsAvailabilityStatuses,
  state,
  context,
}: {
  timeSlotsAvailabilityStatuses: Map<string, TimeSlotAvailabilityStatus>;
  state: CalendarState;
  context: CalendarContext;
}): SlotsPerDay[] => {
  const { selectedRange, selectedTimezone, selectedTime } = state;
  const { businessInfo, t } = context;
  const { from, to } = selectedRange!;
  const locale = businessInfo!.dateRegionalSettingsLocale!;
  const today = getToday(selectedTimezone!);

  const slotsDetailsPerDay = [];
  let dateAsLocalDate = from;
  let date = getDateTimeFromLocalDateTime(from);
  do {
    const filteredTimeSlotsAvailabilityStatuses = filterTimeSlotsAvailabilityStatusesByDate(
      timeSlotsAvailabilityStatuses,
      dateAsLocalDate,
    );

    const firstTimeSlot = timeSlotsAvailabilityStatuses.keys().next().value;
    const shouldHighlightedSlotDetailsOnRender =
      filteredTimeSlotsAvailabilityStatuses.has(firstTimeSlot) && !selectedTime;
    const slotsSelectionViewModel = createSlotsSelectionViewModel({
      timeSlotsAvailabilityStatuses: filteredTimeSlotsAvailabilityStatuses,
      shouldHighlightedSlotDetailsOnRender,
      state,
      context,
    });

    const day = formatLocalDateTimeToDay(dateAsLocalDate, locale);
    const month = formatMonth(dateAsLocalDate, locale);
    const dayWithoutSlotsSrOnlyText = t(
      'app.week-availability.accessibility.day-without-slots',
      { month, day },
    );
    const dayWithSlotsSrOnlyText = t(
      'app.week-availability.accessibility.day-with-slots',
      { month, day },
    );
    const dayDetailsAriaLabel = t('app.week-availability.accessibility.day', {
      weekday: formatLocalDateTimeToWeekday(dateAsLocalDate, locale),
      day,
    });

    slotsDetailsPerDay.push({
      date: dateAsLocalDate,
      slotsSelectionViewModel,
      weekday: formatLocalDateTimeToShortWeekday(dateAsLocalDate, locale),
      day,
      isToday: date.getTime() === today.getTime(),
      isPastDate: date < today,
      accessibility: {
        dayWithoutSlotsSrOnlyText,
        dayWithSlotsSrOnlyText,
        dayDetailsAriaLabel,
      },
    });

    dateAsLocalDate = getStartOfNextDateLocalDateTime(dateAsLocalDate);
    date = getDateTimeFromLocalDateTime(dateAsLocalDate);
  } while (date <= getDateTimeFromLocalDateTime(to));

  return slotsDetailsPerDay;
};

const getToday = (selectedTimezone: string) => {
  const today = getTodayLocalDateTimeStartOfDay(selectedTimezone);
  return getDateTimeFromLocalDateTime(today);
};
