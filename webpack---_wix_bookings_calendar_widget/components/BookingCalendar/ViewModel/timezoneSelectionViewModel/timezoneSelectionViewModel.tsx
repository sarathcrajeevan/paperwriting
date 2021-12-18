import { ViewModelFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { getLocalTimezone } from '../../../../utils/dateAndTime/dateAndTime';
import { BusinessInfoBase } from '@wix/bookings-uou-types';
import { Optional } from '../../../../types/types';
import { MemoizedViewModalFactory } from '../viewModel';

export type TimezoneSelectionViewModel = {
  selectableTimezones: string[];
  selectedTimezone: string;
  timezoneLabel: string;
  timezoneLocale: string;
};

export const memoizedTimezoneSelectionViewModel: MemoizedViewModalFactory<
  Optional<TimezoneSelectionViewModel>
> = {
  dependencies: {
    state: ['selectedTimezone', 'selectedDate'],
  },
  createViewModel: createTimezoneSelectionViewModel,
};

export function createTimezoneSelectionViewModel({
  context,
  state,
}: ViewModelFactoryParams<
  CalendarState,
  CalendarContext
>): Optional<TimezoneSelectionViewModel> {
  const { selectedDate, selectedTimezone } = state;

  const shouldShowTimezoneSection = !!selectedDate;
  if (shouldShowTimezoneSection) {
    const { businessInfo, t, reportError } = context;
    const locale = businessInfo!.dateRegionalSettingsLocale!;

    try {
      const selectableTimezones = getSelectableTimezones(
        selectedDate!,
        businessInfo!,
      );

      return {
        selectableTimezones,
        selectedTimezone: selectedTimezone!,
        timezoneLabel: t('app.timezone-selection.timezone-label'),
        timezoneLocale: locale,
      };
    } catch (e) {
      reportError(e);
    }
  }
}

function getSelectableTimezones(
  selectedDate: string,
  businessInfo: BusinessInfoBase,
): string[] {
  if (businessInfo!.timezoneProperties?.clientCanChooseTimezone) {
    return [businessInfo!.timeZone!, getLocalTimezone()];
  }
  return [];
}
