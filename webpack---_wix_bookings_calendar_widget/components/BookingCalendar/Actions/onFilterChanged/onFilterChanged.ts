import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { RefetchPlatformData } from '../refetchPlatformData/refetchPlatformData';
import { FilterTypes } from '../../ViewModel/filterViewModel/filterViewModel';
import { TriggeredByOptions } from '../../../../types/types';

export type OnFilterChanged = (
  filterTypes: FilterTypes,
  selectedValues: string[],
) => Promise<void>;

export function createOnFilterChanged(
  {
    getControllerState,
    context: { biLogger },
  }: ActionFactoryParams<CalendarState, CalendarContext>,
  refetchPlatformData: RefetchPlatformData,
): OnFilterChanged {
  return (filterTypes: FilterTypes, selectedValues: string[]) => {
    const [state, setState] = getControllerState();

    biLogger.bookingsCalendarFiltersLoad({
      triggeredBy: `${TriggeredByOptions.FILTER_CHANGED}-${filterTypes}`,
      selectedFilters: JSON.stringify(selectedValues),
    });

    setState({
      filterOptions: {
        ...state.filterOptions,
        [filterTypes]: selectedValues,
      },
    });

    return refetchPlatformData(TriggeredByOptions.FILTER_CHANGED);
  };
}
