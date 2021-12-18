import { createDummyBookingDetailsViewModel } from './bookingDetailsViewModel/bookingDetailsViewModel';
import { CalendarState } from '../controller';
import { ViewModelFactoryParams } from '../../../utils/ControlledComponent/ControlledComponent.types';
import {
  HeaderViewModel,
  memoizedHeaderViewModel,
} from './headerViewModel/headerViewModel';
import { CalendarContext } from '../../../utils/context/contextFactory';
import {
  createWidgetViewModel,
  memoizedWidgetViewModel,
  WidgetViewModel,
} from './widgetViewModel/widgetViewModel';
import {
  memoizedRescheduleDetailsViewModel,
  RescheduleDetailsViewModel,
} from './rescheduleDetailsViewModel/rescheduleDetailsViewModel';
import {
  DialogViewModel,
  memoizedDialogViewModel,
} from './dialogViewModel/dialogViewModel';
import {
  memoizedToastViewModel,
  ToastViewModel,
} from './toastViewModel/toastViewModel';
import settingsParams, { ISettingsParams } from '../settingsParams';
import isEqual from 'fast-deep-equal';
import {
  BodyViewModel,
  memoizedBodyViewModelViewModel,
} from './bodyViewModel/bodyViewModel';
import {
  memoizedSidebarViewModel,
  SidebarViewModel,
} from './sidebarViewModel/sidebarViewModel';

export type CalendarViewModel = {
  widgetViewModel: WidgetViewModel;
  headerViewModel?: HeaderViewModel;
  rescheduleDetailsViewModel?: RescheduleDetailsViewModel;
  bodyViewModel?: BodyViewModel;
  sidebarViewModel?: SidebarViewModel;
  dialogViewModel?: DialogViewModel;
  toastViewModel?: ToastViewModel;
};

const memo = (
  func: () => any,
  dependencies: any[],
  memoizationTable: MemoizationTable,
  key: string,
) => {
  if (
    !memoizationTable[key] ||
    !isEqual(memoizationTable[key]?.prevDeps, dependencies)
  ) {
    memoizationTable[key] = {
      prevDeps: dependencies,
    };
    return func();
  }
};

export type CalendarViewModelFactoryParams = ViewModelFactoryParams<
  CalendarState,
  CalendarContext
>;

export interface ViewModelDependencies {
  state?: (keyof CalendarState)[];
  settings?: (keyof ISettingsParams)[];
  subDependencies?: ViewModelDependencies[];
}

export interface MemoizedViewModalFactory<ViewModelType> {
  createViewModel?: (
    factoryParams: CalendarViewModelFactoryParams,
  ) => ViewModelType | Promise<ViewModelType>;
  dependencies: ViewModelDependencies;
}

const selectFromState = (
  { state }: CalendarViewModelFactoryParams,
  stateProperties?: (keyof CalendarState)[],
) => {
  return stateProperties ? stateProperties.map((key) => state[key]) : [];
};

const selectFromSettings = (
  { context: { settings } }: CalendarViewModelFactoryParams,
  settingProperties?: (keyof ISettingsParams)[],
) => {
  return settingProperties
    ? settingProperties.map((key) => settings.get(settingsParams[key]))
    : [];
};

export const extractDependencies = (
  viewModelFactoryParams: CalendarViewModelFactoryParams,
  dependencies: ViewModelDependencies,
): any[] => {
  return [
    ...selectFromState(viewModelFactoryParams, dependencies.state),
    ...selectFromSettings(viewModelFactoryParams, dependencies.settings),
    ...(dependencies.subDependencies
      ? dependencies.subDependencies.map((subDep) =>
          extractDependencies(viewModelFactoryParams, subDep),
        )
      : []),
  ];
};

type MemoizationTable = {
  [key: string]: {
    prevDeps: any[];
  };
};

type ViewModelNames = keyof CalendarViewModel;

const createMemoizedViewModel = (
  viewModelFactories: {
    [key: string]: MemoizedViewModalFactory<ViewModelNames>;
  },
  viewModelFactoryParams: CalendarViewModelFactoryParams,
  memoizationTable: MemoizationTable,
) => {
  const partialViewModel: CalendarViewModel = {} as CalendarViewModel;
  for (const [key, viewModelFactory] of Object.entries(viewModelFactories)) {
    const viewModelName = key as keyof CalendarViewModel;
    const viewModelChunk = memo(
      () => viewModelFactory?.createViewModel?.(viewModelFactoryParams),
      extractDependencies(
        viewModelFactoryParams,
        viewModelFactory.dependencies,
      ),
      memoizationTable,
      viewModelName,
    );
    if (viewModelChunk) {
      partialViewModel[viewModelName] = viewModelChunk;
    }
  }

  return partialViewModel;
};

export function createMemoizedCalendarViewModelFactory(isDummy = false) {
  const memoizationTable: MemoizationTable = {};

  return (viewModelFactoryParams: CalendarViewModelFactoryParams) => {
    return isDummy
      ? createDummyCalendarViewModel(viewModelFactoryParams, memoizationTable)
      : createCalendarViewModel(viewModelFactoryParams, memoizationTable);
  };
}

export const memoizedViewModelFactories: {
  [key: string]: MemoizedViewModalFactory<any>;
} = {
  widgetViewModel: memoizedWidgetViewModel,
  headerViewModel: memoizedHeaderViewModel,
  rescheduleDetailsViewModel: memoizedRescheduleDetailsViewModel,
  bodyViewModel: memoizedBodyViewModelViewModel,
  sidebarViewModel: memoizedSidebarViewModel,
  dialogViewModel: memoizedDialogViewModel,
  toastViewModel: memoizedToastViewModel,
};

export function createCalendarViewModel(
  viewModelFactoryParams: CalendarViewModelFactoryParams,
  memoizationTable: MemoizationTable = {},
): CalendarViewModel {
  return viewModelFactoryParams.state.initialErrors.length > 0
    ? { widgetViewModel: createWidgetViewModel(viewModelFactoryParams) }
    : createMemoizedViewModel(
        memoizedViewModelFactories,
        viewModelFactoryParams,
        memoizationTable,
      );
}

export function createDummyCalendarViewModel(
  viewModelFactoryParams: ViewModelFactoryParams<
    CalendarState,
    CalendarContext
  >,
  memoizationTable: MemoizationTable = {},
): CalendarViewModel {
  const calendarViewModel = createCalendarViewModel(
    viewModelFactoryParams,
    memoizationTable,
  );
  if (calendarViewModel.sidebarViewModel) {
    calendarViewModel.sidebarViewModel.bookingDetailsViewModel =
      createDummyBookingDetailsViewModel(viewModelFactoryParams);
  }
  return calendarViewModel;
}
