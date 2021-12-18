import { CalendarState, TFunction } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { ViewModelFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { PolicyFormatter } from '@wix/bookings-uou-mappers';
import { ServicePolicy } from '@wix/bookings-uou-types';
import { TimeSlotAvailabilityStatus } from '../../../../utils/timeSlots/timeSlots';
import { LayoutOptions, Optional } from '../../../../types/types';
import settingsParams from '../../settingsParams';
import { MemoizedViewModalFactory } from '../viewModel';

export enum SlotsNotificationType {
  ALL_SESSIONS_ARE_FULL = 'ALL_SESSIONS_ARE_FULL',
  ALL_SESSIONS_ARE_CLOSED = 'ALL_SESSIONS_ARE_CLOSED',
  ALL_SESSIONS_ARE_NOT_YET_OPEN = 'ALL_SESSIONS_ARE_NOT_YET_OPEN',
  SOME_SESSIONS_ARE_CLOSED = 'SOME_SESSIONS_ARE_CLOSED',
  SOME_SESSIONS_ARE_NOT_YET_OPEN = 'SOME_SESSIONS_ARE_NOT_YET_OPEN',
}

export type SlotsNotificationViewModel = {
  notificationType?: SlotsNotificationType;
  messageText?: string;
  ctaText?: string;
};

type SlotsNotificationViewModelParams = ViewModelFactoryParams<
  CalendarState,
  CalendarContext
> & {
  timeSlotsAvailabilityStatuses: Map<string, TimeSlotAvailabilityStatus>;
};

export const memoizedSlotsNotificationViewModel: MemoizedViewModalFactory<SlotsNotificationViewModel> = {
  dependencies: {
    state: ['selectedService'],
    settings: [
      'fullyBookedDateNotification',
      'goToNextAvailableDate',
      'calendarLayout',
    ],
  },
};

export function createSlotsNotificationViewModel({
  timeSlotsAvailabilityStatuses,
  state,
  context,
}: SlotsNotificationViewModelParams): Optional<SlotsNotificationViewModel> {
  const { selectedService } = state;
  const { getContent, t, experiments, settings } = context;
  const isUoUWeeklyCalendarOOILiveSiteEnabled = experiments.enabled(
    'specs.bookings.UoUWeeklyCalendarOOILiveSite',
  );
  const isWeeklyLayout =
    settings.get(settingsParams.calendarLayout) === LayoutOptions.WEEKLY;

  const {
    minutesBeforeSlotBookWindowStart,
    minutesBeforeSlotBookWindowEnd,
  } = getFormattedPolicyLimits(selectedService!.policy, t);
  const notificationOptions = getNotificationOptions(
    timeSlotsAvailabilityStatuses,
  );

  if (notificationOptions.allSessionsAreFull) {
    return {
      notificationType: SlotsNotificationType.ALL_SESSIONS_ARE_FULL,
      messageText: getContent({
        settingsParam: settingsParams.fullyBookedDateNotification,
        translationKey:
          'app.settings.defaults.time-picker.notifications.all-sessions-are-full',
      }),
      ctaText: getContent({
        settingsParam: settingsParams.goToNextAvailableDate,
        translationKey:
          'app.settings.defaults.time-picker.go-to-next-available-day',
      }),
    };
  } else if (notificationOptions.allSessionsAreClosed) {
    return {
      notificationType: SlotsNotificationType.ALL_SESSIONS_ARE_CLOSED,
      messageText: t('app.time-picker.notifications.all-sessions-are-closed', {
        duration: minutesBeforeSlotBookWindowEnd,
      }),
    };
  } else if (notificationOptions.allSessionsAreNotOpenYet) {
    return {
      notificationType: SlotsNotificationType.ALL_SESSIONS_ARE_NOT_YET_OPEN,
      messageText: t(
        'app.time-picker.notifications.all-sessions-are-not-open-yet',
        {
          duration: minutesBeforeSlotBookWindowStart,
        },
      ),
    };
  } else if (notificationOptions.someSessionsAreClosed) {
    if (isUoUWeeklyCalendarOOILiveSiteEnabled) {
      const translationKey = isWeeklyLayout
        ? 'app.time-picker.notifications.all-sessions-are-closed'
        : 'app.time-picker.notifications.some-sessions-are-closed';
      return {
        notificationType: SlotsNotificationType.SOME_SESSIONS_ARE_CLOSED,
        messageText: t(translationKey, {
          duration: minutesBeforeSlotBookWindowEnd,
        }),
      };
    } else {
      return {
        notificationType: SlotsNotificationType.SOME_SESSIONS_ARE_CLOSED,
        messageText: t(
          'app.time-picker.notifications.some-sessions-are-closed',
          {
            duration: minutesBeforeSlotBookWindowEnd,
          },
        ),
      };
    }
  } else if (notificationOptions.someSessionsAreNotOpenYet) {
    if (isUoUWeeklyCalendarOOILiveSiteEnabled) {
      const translationKey = isWeeklyLayout
        ? 'app.time-picker.notifications.all-sessions-are-not-open-yet'
        : 'app.time-picker.notifications.some-sessions-are-not-open-yet';
      return {
        notificationType: SlotsNotificationType.SOME_SESSIONS_ARE_NOT_YET_OPEN,
        messageText: t(translationKey, {
          duration: minutesBeforeSlotBookWindowStart,
        }),
      };
    } else {
      return {
        notificationType: SlotsNotificationType.SOME_SESSIONS_ARE_NOT_YET_OPEN,
        messageText: t(
          'app.time-picker.notifications.some-sessions-are-not-open-yet',
          {
            duration: minutesBeforeSlotBookWindowStart,
          },
        ),
      };
    }
  }
}

const getNotificationOptions = (
  timeSlotsAvailabilityStatuses: Map<string, TimeSlotAvailabilityStatus>,
) => {
  const initialNotificationOptions = {
    allSessionsAreFull: true,
    allSessionsAreClosed: true,
    allSessionsAreNotOpenYet: true,
    someSessionsAreClosed: false,
    someSessionsAreNotOpenYet: false,
  };
  return Array.from(timeSlotsAvailabilityStatuses).reduce(
    (notificationOptions, [, currentTimeSlotStatus]) => {
      const {
        allSlotsAreFull,
        tooEarlyToBookAllSlots,
        tooLateToBookAllSlots,
      } = currentTimeSlotStatus;
      const {
        allSessionsAreFull,
        allSessionsAreNotOpenYet,
        allSessionsAreClosed,
        someSessionsAreClosed,
        someSessionsAreNotOpenYet,
      } = notificationOptions;
      return {
        allSessionsAreFull: allSessionsAreFull && allSlotsAreFull,
        allSessionsAreClosed: allSessionsAreClosed && tooLateToBookAllSlots,
        allSessionsAreNotOpenYet:
          allSessionsAreNotOpenYet && tooEarlyToBookAllSlots,
        someSessionsAreClosed: someSessionsAreClosed || tooLateToBookAllSlots,
        someSessionsAreNotOpenYet:
          someSessionsAreNotOpenYet || tooEarlyToBookAllSlots,
      };
    },
    initialNotificationOptions,
  );
};

const getFormattedPolicyLimits = (policy: ServicePolicy, t: TFunction) => {
  const {
    minutesBeforeSlotBookWindowStart,
    minutesBeforeSlotBookWindowEnd,
  } = policy;

  const servicePolicyTranslations = {
    days: t('app.time-picker.notifications.policy.days'),
    day: t('app.time-picker.notifications.policy.day'),
    hours: t('app.time-picker.notifications.policy.hours'),
    hour: t('app.time-picker.notifications.policy.hour'),
    minutes: t('app.time-picker.notifications.policy.minutes'),
    minute: t('app.time-picker.notifications.policy.minute'),
    and: t('app.time-picker.notifications.policy.and'),
  };

  const policyFormatter = new PolicyFormatter(servicePolicyTranslations);

  return {
    minutesBeforeSlotBookWindowStart: policyFormatter.getPolicyLimit(
      minutesBeforeSlotBookWindowStart,
    ),
    minutesBeforeSlotBookWindowEnd: policyFormatter.getPolicyLimit(
      minutesBeforeSlotBookWindowEnd,
    ),
  };
};
