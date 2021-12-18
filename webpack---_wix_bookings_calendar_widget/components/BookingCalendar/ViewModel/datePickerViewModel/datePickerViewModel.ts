import { ViewModelFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import {
  convertRfcTimeToLocalDateTimeStartOfDay,
  getTodayLocalDateTimeStartOfDay,
} from '../../../../utils/dateAndTime/dateAndTime';
import {
  FirstDayOfWeek,
  getFirstDayOfTheWeek,
} from '../../../../utils/dateAndTime/weekStart';
import { Locale } from 'wix-ui-tpa/dist/src/components/DatePicker/DatePicker';
import { MemoizedViewModalFactory } from '../viewModel';
import { SlotAvailability } from '@wix/ambassador-availability-calendar/types';

export enum DateAvailabilityStatus {
  HAS_AVAILABLE_SLOTS = 'has_available_slots',
  HAS_UNAVAILABLE_SLOTS = 'has_slots',
}

export type DatePickerViewModel = {
  selectedDate: string;
  dateAvailabilityStatuses: Map<string, DateAvailabilityStatus>;
  firstDayOfTheWeek: FirstDayOfWeek;
  locale: Locale;
  todayLocalDateTime: string;
  nextMonthLabel: string;
  prevMonthLabel: string;
};

export const memoizedDatePickerViewModel: MemoizedViewModalFactory<DatePickerViewModel> =
  {
    dependencies: {
      state: ['selectedDate', 'availableSlotsPerDay', 'selectedTimezone'],
    },
    createViewModel: createDatePickerViewModel,
  };

export function createDatePickerViewModel({
  state,
  context: { businessInfo, t },
}: ViewModelFactoryParams<
  CalendarState,
  CalendarContext
>): DatePickerViewModel {
  const { selectedDate, availableSlotsPerDay, selectedTimezone } = state;
  const dateAvailabilityStatuses = new Map<string, DateAvailabilityStatus>();

  availableSlotsPerDay?.availabilityEntries?.forEach(
    (slotAvailability: SlotAvailability) => {
      const localDateTime = convertRfcTimeToLocalDateTimeStartOfDay(
        slotAvailability?.slot?.startDate!,
      );
      dateAvailabilityStatuses.set(
        localDateTime,
        slotAvailability.bookable
          ? DateAvailabilityStatus.HAS_AVAILABLE_SLOTS
          : DateAvailabilityStatus.HAS_UNAVAILABLE_SLOTS,
      );
    },
  );

  const firstDayOfTheWeek = getFirstDayOfTheWeek(
    businessInfo!.dateRegionalSettingsLocale!,
  );
  const todayLocalDateTime = getTodayLocalDateTimeStartOfDay(selectedTimezone!);
  return {
    selectedDate: selectedDate!,
    dateAvailabilityStatuses,
    firstDayOfTheWeek,
    todayLocalDateTime,
    locale: businessInfo!.language! as Locale,
    nextMonthLabel: t('app.date-picker.accessibility.next-month'),
    prevMonthLabel: t('app.date-picker.accessibility.prev-month'),
  };
}
