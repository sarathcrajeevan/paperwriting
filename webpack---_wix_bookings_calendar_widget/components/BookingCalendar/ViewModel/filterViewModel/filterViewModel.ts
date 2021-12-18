import { ViewModelFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { ServiceLocationType } from '@wix/bookings-uou-types';
import settingsParams from '../../settingsParams';
import { MemoizedViewModalFactory } from '../viewModel';

export enum FilterTypes {
  LOCATION = 'LOCATION',
  STAFF_MEMBER = 'STAFF_MEMBER',
}

export type FilterOption = {
  label: string;
  value: string;
  selected: boolean;
};

export type FilterViewModel = {
  id: FilterTypes;
  label: string;
  options: FilterOption[];
  note?: string;
};

export const memoizedFiltersViewModel: MemoizedViewModalFactory<FilterViewModel> =
  {
    dependencies: {
      state: ['selectedService', 'filterOptions'],
      settings: ['locationLabel', 'staffMemberLabel'],
    },
  };

export function createFilterViewModels({
  state,
  context,
}: ViewModelFactoryParams<CalendarState, CalendarContext>): FilterViewModel[] {
  const { getContent, reportError } = context;
  const { selectedService, filterOptions } = state;
  const availableLocations = selectedService!.locations;
  const availableStaffMembers = selectedService!.staffMembers;
  const filterViewModels: FilterViewModel[] = [];

  try {
    if (availableLocations.length > 1) {
      const selectedLocationsOptions = filterOptions.LOCATION;
      filterViewModels.push({
        label: getContent({
          settingsParam: settingsParams.locationLabel,
          translationKey: 'app.settings.defaults.location-label',
        }),
        options: availableLocations
          .filter(({ type }) => type === ServiceLocationType.OWNER_BUSINESS)
          .map(({ businessLocation }) => ({
            selected: selectedLocationsOptions.some(
              (selectedLocationsOption) =>
                selectedLocationsOption === businessLocation?.id,
            ),
            label: businessLocation?.name || '',
            value: businessLocation?.id || '',
          })),
        id: FilterTypes.LOCATION,
      });
    }
  } catch (e) {
    reportError(e);
  }

  try {
    if (availableStaffMembers.length > 1) {
      const selectedStaffMembersOptions = filterOptions.STAFF_MEMBER;
      filterViewModels.push({
        label: getContent({
          settingsParam: settingsParams.staffMemberLabel,
          translationKey: 'app.settings.defaults.staff-member-label',
        }),
        options: availableStaffMembers.map(({ id, name }) => ({
          selected: selectedStaffMembersOptions.some(
            (selectedStaffMembersOption) => selectedStaffMembersOption === id,
          ),
          label: name,
          value: id,
        })),
        id: FilterTypes.STAFF_MEMBER,
      });
    }
  } catch (e) {
    reportError(e);
  }

  return filterViewModels;
}
