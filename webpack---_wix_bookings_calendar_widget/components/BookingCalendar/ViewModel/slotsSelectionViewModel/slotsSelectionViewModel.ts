import { ViewModelFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState, TFunction } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { formatRfcTimeStringToTimeSlotView } from '../../../../utils/dateAndTime/dateAndTime';
import { TimeSlotAvailabilityStatus } from '../../../../utils/timeSlots/timeSlots';
import settingsParams from '../../settingsParams';
import { MemoizedViewModalFactory } from '../viewModel';
import { LayoutOptions, TriggeredByOptions } from '../../../../types/types';

export interface TimeSlotStatus extends TimeSlotAvailabilityStatus {
  selected: boolean;
}

export interface TimeSlot {
  formattedStartTime: string;
  rfcStartTime: string;
  status: TimeSlotStatus;
  ariaLabel: string;
}

export type SlotsSelectionViewModel = {
  timeSlots: TimeSlot[];
  shouldLimitNumberOfTimeSlotsDisplayed: boolean;
  maxNumberOfTimeSlotsToDisplay: number;
  showAllButtonText: string;
  waitlistText: string;
  highlightedSlotDetails: {
    shouldFocusOnRender: boolean;
    slotIndex?: number;
  };
};

type SlotsSelectionViewModelParams = ViewModelFactoryParams<
  CalendarState,
  CalendarContext
> & {
  timeSlotsAvailabilityStatuses: Map<string, TimeSlotAvailabilityStatus>;
  shouldHighlightedSlotDetailsOnRender: boolean;
};

export const memoizedSlotsSelectionViewModel: MemoizedViewModalFactory<SlotsSelectionViewModel> = {
  dependencies: {
    state: ['selectedTime', 'selectedDateTrigger'],
    settings: [
      'waitlistIndication',
      'limitTimeSlotsDisplay',
      'maxTimeSlotsDisplayedPerDay',
      'loadMoreTimeSlots',
      'calendarLayout',
    ],
  },
};

export function createSlotsSelectionViewModel({
  timeSlotsAvailabilityStatuses,
  shouldHighlightedSlotDetailsOnRender,
  state,
  context,
}: SlotsSelectionViewModelParams): SlotsSelectionViewModel {
  const { selectedTime } = state;
  const { businessInfo, t, settings, getContent, experiments } = context;
  const locale = businessInfo!.dateRegionalSettingsLocale;

  const waitlistText = getContent({
    settingsParam: settingsParams.waitlistIndication,
    translationKey: 'app.settings.defaults.waitlist',
  });
  const timeSlots: TimeSlot[] = [];
  timeSlotsAvailabilityStatuses.forEach(
    (timeSlotStatus: TimeSlotAvailabilityStatus, rfcStartTime: string) => {
      const formattedStartTime = rfcStartTime
        ? formatRfcTimeStringToTimeSlotView(rfcStartTime, locale)
        : '';
      const isTimeSelected = rfcStartTime === selectedTime;
      const ariaLabel = getTimeSlotAriaLabel(
        timeSlotStatus,
        formattedStartTime,
        t,
        waitlistText,
      );

      timeSlots.push({
        rfcStartTime,
        formattedStartTime,
        status: { ...timeSlotStatus, selected: isTimeSelected },
        ariaLabel,
      });
    },
  );

  const highlightedSlotDetails =
    shouldHighlightedSlotDetailsOnRender &&
    state.selectedDateTrigger ===
      TriggeredByOptions.GO_TO_NEXT_AVAILABLE_DATE_LINK
      ? {
          shouldFocusOnRender: true,
          focusIndex: 0,
        }
      : {
          shouldFocusOnRender: false,
        };

  let showAllButtonText = '';
  const isUoUWeeklyCalendarOOILiveSiteEnabled = experiments.enabled(
    'specs.bookings.UoUWeeklyCalendarOOILiveSite',
  );
  if (isUoUWeeklyCalendarOOILiveSiteEnabled) {
    const isWeeklyLayout =
      settings.get(settingsParams.calendarLayout) === LayoutOptions.WEEKLY;
    if (isWeeklyLayout) {
      showAllButtonText = getContent({
        settingsParam: settingsParams.loadMoreTimeSlots,
        translationKey: 'app.settings.defaults.week-availability.show-all',
      });
    } else {
      showAllButtonText = getContent({
        settingsParam: settingsParams.loadMoreTimeSlots,
        translationKey: 'app.settings.defaults.time-picker.show-all',
      });
    }
  } else {
    showAllButtonText = getContent({
      settingsParam: settingsParams.loadMoreTimeSlots,
      translationKey: 'app.settings.defaults.time-picker.show-all',
    });
  }

  return {
    highlightedSlotDetails,
    timeSlots,
    shouldLimitNumberOfTimeSlotsDisplayed: settings.get(
      settingsParams.limitTimeSlotsDisplay,
    ),
    maxNumberOfTimeSlotsToDisplay: settings.get(
      settingsParams.maxTimeSlotsDisplayedPerDay,
    ),
    showAllButtonText,
    waitlistText,
  };
}

const getTimeSlotAriaLabel = (
  timeSlotStatus: TimeSlotAvailabilityStatus,
  formattedStartTime: string,
  t: TFunction,
  waitlistText: string,
): string => {
  if (timeSlotStatus.withWaitingList) {
    return t('app.time-picker.accessibility.time-slot-with-waitlist', {
      time: formattedStartTime,
      waitlist: waitlistText,
    });
  }
  if (timeSlotStatus.tooLateToBookAllSlots || timeSlotStatus.allSlotsAreFull) {
    return t(
      'app.time-picker.accessibility.time-slot-closed-for-registration',
      { time: formattedStartTime },
    );
  }
  if (timeSlotStatus.tooEarlyToBookAllSlots) {
    return t(
      'app.time-picker.accessibility.time-slot-not-open-yet-for-registration',
      { time: formattedStartTime },
    );
  }
  return formattedStartTime;
};
