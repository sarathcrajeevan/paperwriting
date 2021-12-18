import { ViewModelFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import settingsParams from '../../settingsParams';
import {
  CalendarErrors,
  FilterOptions,
  Optional,
} from '../../../../types/types';
import * as _ from 'lodash';
import { MemoizedViewModalFactory } from '../viewModel';

export type NoAvailableSlotsViewModel = {
  noSessionsOfferedText: string;
  goToNextAvailableLinkText?: string;
  noUpcomingTimeSlotsText?: string;
};

export const memoizedNoAvailableSlotsViewModel: MemoizedViewModalFactory<NoAvailableSlotsViewModel> = {
  dependencies: {
    state: ['calendarErrors', 'filterOptions'],
    settings: [
      'noSessionsOffered',
      'goToNextAvailableDate',
      'noUpcomingTimeSlots',
    ],
  },
  createViewModel: createNoAvailableSlotsViewModel,
};

export function createNoAvailableSlotsViewModel({
  state,
  context,
}: ViewModelFactoryParams<
  CalendarState,
  CalendarContext
>): NoAvailableSlotsViewModel {
  const { getContent } = context;
  const { calendarErrors, filterOptions } = state;

  const noSessionsOfferedText = getContent({
    settingsParam: settingsParams.noSessionsOffered,
    translationKey: 'app.settings.defaults.time-picker.no-slots-message',
  });

  const isNoNextAvailableDate = calendarErrors.some(
    (error) => error === CalendarErrors.NO_NEXT_AVAILABLE_DATE_WARNING,
  );
  const isNextAvailableDateServerError = calendarErrors.some(
    (error) => error === CalendarErrors.NEXT_AVAILABLE_DATE_SERVER_ERROR,
  );

  const showNextAvailableLink =
    !isNoNextAvailableDate && !isNextAvailableDateServerError;
  const goToNextAvailableLinkText = showNextAvailableLink
    ? getContent({
        settingsParam: settingsParams.goToNextAvailableDate,
        translationKey:
          'app.settings.defaults.time-picker.go-to-next-available-day',
      })
    : undefined;

  const noUpcomingTimeSlotsText = getNoUpcomingTimeSlotsText({
    isNoNextAvailableDate,
    filterOptions,
    context,
  });

  return {
    noSessionsOfferedText,
    goToNextAvailableLinkText,
    noUpcomingTimeSlotsText,
  };
}

function getNoUpcomingTimeSlotsText({
  isNoNextAvailableDate,
  filterOptions,
  context,
}: {
  isNoNextAvailableDate: boolean;
  filterOptions: FilterOptions;
  context: CalendarContext;
}): Optional<string> {
  const { getContent, t } = context;
  if (isNoNextAvailableDate) {
    const areFilterExists = _.every(filterOptions, 'length');
    return areFilterExists
      ? t(
          'app.time-picker.notifications.no-next-available-date-matching-filters',
        )
      : getContent({
          settingsParam: settingsParams.noUpcomingTimeSlots,
          translationKey:
            'app.time-picker.notifications.no-upcoming-time-slots',
        });
  }
}
