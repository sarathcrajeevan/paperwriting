import { ViewModelFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { MemoizedViewModalFactory } from '../viewModel';
import {
  createDailyLayoutViewModel,
  DailyLayoutViewModel,
  memoizedDailyLayoutViewModel,
} from '../dailyLayoutViewModel/dailyLayoutViewModel';
import {
  createWeeklyLayoutViewModel,
  memoizedWeeklyLayoutViewModel,
  WeeklyLayoutViewModel,
} from '../weeklyLayoutViewModel/weeklyLayoutViewModel';
import settingsParams from '../../settingsParams';
import { LayoutOptions } from '../../../../types/types';

export type BodyViewModel = {
  dailyLayoutViewModel?: DailyLayoutViewModel;
  weeklyLayoutViewModel?: WeeklyLayoutViewModel;
};

export const memoizedBodyViewModelViewModel: MemoizedViewModalFactory<BodyViewModel> =
  {
    dependencies: {
      settings: ['calendarLayout'],
      subDependencies: [
        memoizedDailyLayoutViewModel.dependencies,
        memoizedWeeklyLayoutViewModel.dependencies,
      ],
    },
    createViewModel: createBodyViewModel,
  };

export function createBodyViewModel({
  state,
  context,
}: ViewModelFactoryParams<CalendarState, CalendarContext>): BodyViewModel {
  const { settings, experiments } = context;
  const isUoUWeeklyCalendarOOILiveSiteEnabled = experiments.enabled(
    'specs.bookings.UoUWeeklyCalendarOOILiveSite',
  );

  if (isUoUWeeklyCalendarOOILiveSiteEnabled) {
    const isWeeklyLayout =
      settings.get(settingsParams.calendarLayout) === LayoutOptions.WEEKLY;
    if (isWeeklyLayout) {
      return {
        weeklyLayoutViewModel: createWeeklyLayoutViewModel({
          state,
          context,
        }),
      };
    }

    return {
      dailyLayoutViewModel: createDailyLayoutViewModel({
        state,
        context,
      }),
    };
  } else {
    return {
      dailyLayoutViewModel: createDailyLayoutViewModel({
        state,
        context,
      }),
    };
  }
}
