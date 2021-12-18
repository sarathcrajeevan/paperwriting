import { ViewModelFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState, TFunction } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import {
  FirstDayOfWeek,
  getFirstDayOfTheWeek,
} from '../../../../utils/dateAndTime/weekStart';
import {
  formatLocalDateTimeToDay,
  formatMonth,
  getDateTimeFromLocalDateTime,
} from '../../../../utils/dateAndTime/dateAndTime';
import { MemoizedViewModalFactory } from '../viewModel';
import { LanguageType } from 'wix-ui-tpa/dist/src/components/WeeklyDateNavigation/WeeklyDateNavigation';
import { SlotsStatus } from '../../../../types/types';

export type WeekPickerViewModel = {
  selectedRange: {
    startOfWeek: Date;
    endOfWeek: Date;
  };
  firstDayOfTheWeek: FirstDayOfWeek;
  locale: LanguageType;
  accessibility: {
    nextWeekAriaLabel: string;
    prevWeekAriaLabel: string;
    onRangeSetSrOnlyAnnouncement?: string;
  };
};

export const memoizedWeekPickerViewModel: MemoizedViewModalFactory<WeekPickerViewModel> = {
  dependencies: {
    state: ['selectedRange', 'slotsStatus'],
  },
  createViewModel: createWeekPickerViewModel,
};

export function createWeekPickerViewModel({
  state,
  context: { businessInfo, t },
}: ViewModelFactoryParams<
  CalendarState,
  CalendarContext
>): WeekPickerViewModel {
  const { selectedRange, slotsStatus } = state;
  const { from, to } = selectedRange!;
  const locale = businessInfo!.dateRegionalSettingsLocale!;

  const onRangeSetSrOnlyAnnouncement = getOnRangeSetSrOnlyAnnouncement(
    t,
    locale,
    selectedRange!,
    slotsStatus,
  );

  return {
    selectedRange: {
      startOfWeek: getDateTimeFromLocalDateTime(from),
      endOfWeek: getDateTimeFromLocalDateTime(to),
    },
    firstDayOfTheWeek: getFirstDayOfTheWeek(locale),
    locale: businessInfo!.language! as LanguageType,
    accessibility: {
      nextWeekAriaLabel: t('app.week-picker.accessibility.next-week'),
      prevWeekAriaLabel: t('app.week-picker.accessibility.prev-week'),
      onRangeSetSrOnlyAnnouncement,
    },
  };
}

const getOnRangeSetSrOnlyAnnouncement = (
  t: TFunction,
  locale: string,
  selectedRange: { from: string; to: string },
  slotsStatus: SlotsStatus,
): string => {
  const { from, to } = selectedRange;
  const fromMonth = formatMonth(from, locale);
  const toMonth = formatMonth(to, locale);
  const fromDay = formatLocalDateTimeToDay(from, locale);
  const toDay = formatLocalDateTimeToDay(to, locale);

  const options = {
    fromMonth,
    fromDay,
    toMonth,
    toDay,
  };

  switch (slotsStatus) {
    case SlotsStatus.AVAILABLE_SLOTS:
      return t(
        'app.week-picker.accessibility.announcement.range-selected-with-slots',
        options,
      );
    case SlotsStatus.NO_AVAILABLE_SLOTS:
      return t(
        'app.week-picker.accessibility.announcement.range-selected-without-slots',
        options,
      );
    default:
      return '';
  }
};
