import { ViewModelFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState, TFunction } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { formatLocalDateTimeToDateView } from '../../../../utils/dateAndTime/dateAndTime';
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
  getNumberOfAvailableTimeSlots,
  getTimeSlotsAvailabilityStatuses,
  TimeSlotAvailabilityStatus,
} from '../../../../utils/timeSlots/timeSlots';
import { MemoizedViewModalFactory } from '../viewModel';
import {
  createTimezoneSelectionViewModel,
  memoizedTimezoneSelectionViewModel,
  TimezoneSelectionViewModel,
} from '../timezoneSelectionViewModel/timezoneSelectionViewModel';
import { SlotsStatus } from '../../../../types/types';

export type TimePickerViewModel = {
  formattedSelectedDate?: string;
  status: SlotsStatus;
  timezoneSelectionViewModel?: TimezoneSelectionViewModel;
  noAvailableSlotsViewModel: NoAvailableSlotsViewModel;
  slotsSelectionViewModel: SlotsSelectionViewModel;
  slotsNotificationViewModel?: SlotsNotificationViewModel;
  accessibility: {
    onTimePickerLoadedAnnouncement: string;
  };
};

export const memoizedTimePickerViewModel: MemoizedViewModalFactory<TimePickerViewModel> = {
  dependencies: {
    state: ['selectedDate', 'slotsStatus', 'availableSlots'],
    subDependencies: [
      memoizedNoAvailableSlotsViewModel.dependencies,
      memoizedSlotsSelectionViewModel.dependencies,
      memoizedSlotsNotificationViewModel.dependencies,
      memoizedTimezoneSelectionViewModel.dependencies,
    ],
  },
  createViewModel: createTimePickerViewModel,
};

export function createTimePickerViewModel({
  state,
  context,
}: ViewModelFactoryParams<
  CalendarState,
  CalendarContext
>): TimePickerViewModel {
  // extract dependencies from inner view models
  const { selectedDate, slotsStatus, availableSlots } = state;
  const { businessInfo, t } = context;

  const dateRegionalSettingsLocale = businessInfo!.dateRegionalSettingsLocale;
  const formattedSelectedDate =
    selectedDate &&
    formatLocalDateTimeToDateView(selectedDate, dateRegionalSettingsLocale);

  const timezoneSelectionViewModel = createTimezoneSelectionViewModel({
    state,
    context,
  });

  const noAvailableSlotsViewModel: NoAvailableSlotsViewModel = createNoAvailableSlotsViewModel(
    {
      state,
      context,
    },
  );

  const timeSlotsAvailabilityStatuses: Map<
    string,
    TimeSlotAvailabilityStatus
  > = getTimeSlotsAvailabilityStatuses(availableSlots);

  const slotsSelectionViewModel = createSlotsSelectionViewModel({
    timeSlotsAvailabilityStatuses,
    shouldHighlightedSlotDetailsOnRender: true,
    state,
    context,
  });

  const slotsNotificationViewModel = createSlotsNotificationViewModel({
    timeSlotsAvailabilityStatuses,
    state,
    context,
  });

  const accessibility = {
    onTimePickerLoadedAnnouncement: getAccessibleAnnouncement({
      timeSlotsAvailabilityStatuses,
      t,
    }),
  };

  return {
    status: slotsStatus,
    formattedSelectedDate,
    timezoneSelectionViewModel,
    noAvailableSlotsViewModel,
    slotsSelectionViewModel,
    slotsNotificationViewModel,
    accessibility,
  };
}

const getAccessibleAnnouncement = ({
  timeSlotsAvailabilityStatuses,
  t,
}: {
  timeSlotsAvailabilityStatuses: Map<string, TimeSlotAvailabilityStatus>;
  t: TFunction;
}): string => {
  const numberOfAvailableSlots = getNumberOfAvailableTimeSlots(
    timeSlotsAvailabilityStatuses,
  );
  return numberOfAvailableSlots
    ? t('app.time-picker.accessibility.announcement.available-time-slots', {
        timeSlotsCount: numberOfAvailableSlots,
      })
    : t('app.time-picker.accessibility.announcement.no-available-time-slots');
};
