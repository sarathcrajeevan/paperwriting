import { ViewModelFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import {
  createFilterViewModels,
  FilterViewModel,
  memoizedFiltersViewModel,
} from '../filterViewModel/filterViewModel';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { CalendarState } from '../../controller';
import { SourceOptions } from '../../../../types/types';
import settingsParams from '../../settingsParams';
import { MemoizedViewModalFactory } from '../viewModel';

export type HeaderViewModel = {
  title: string;
  subtitle: string;
  isSubtitleVisible: boolean;
  isFiltersVisible: boolean;
  filters: FilterViewModel[];
};

export const memoizedHeaderViewModel: MemoizedViewModalFactory<HeaderViewModel> =
  {
    dependencies: {
      state: ['selectedService'],
      settings: [
        'headerSubtitleVisibility',
        'headerSubtitleSource',
        'headerSubtitle',
        'headerFiltersVisibility',
      ],
      subDependencies: [memoizedFiltersViewModel.dependencies],
    },
    createViewModel: createHeaderViewModel,
  };

export function createHeaderViewModel({
  state,
  context,
}: ViewModelFactoryParams<CalendarState, CalendarContext>): HeaderViewModel {
  const { settings, getContent } = context;
  const { selectedService } = state;
  const title = selectedService!.info.name;
  const filters = createFilterViewModels({ state, context });
  const isSubtitleVisible = settings.get(
    settingsParams.headerSubtitleVisibility,
  );
  const isFiltersVisible = settings.get(settingsParams.headerFiltersVisibility);
  const subtitle =
    settings.get(settingsParams.headerSubtitleSource) === SourceOptions.SERVICE
      ? selectedService!.info.tagline
      : getContent({
          settingsParam: settingsParams.headerSubtitle,
          translationKey: 'app.settings.defaults.header-subtitle',
        });

  return {
    title,
    subtitle,
    isSubtitleVisible,
    isFiltersVisible,
    filters,
  };
}
