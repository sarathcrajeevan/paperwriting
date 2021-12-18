import { ViewModelFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { MemoizedViewModalFactory } from '../viewModel';
import settingsParams from '../../settingsParams';
import {
  createTimePickerViewModel,
  memoizedTimePickerViewModel,
  TimePickerViewModel,
} from '../timePickerViewModel/timePickerViewModel';
import {
  createDatePickerViewModel,
  DatePickerViewModel,
  memoizedDatePickerViewModel,
} from '../datePickerViewModel/datePickerViewModel';

export type DailyLayoutViewModel = {
  bodyTitle: string;
  datePickerViewModel: DatePickerViewModel;
  timePickerViewModel: TimePickerViewModel;
};

export const memoizedDailyLayoutViewModel: MemoizedViewModalFactory<DailyLayoutViewModel> =
  {
    dependencies: {
      settings: ['dateAndTimeSectionHeader'],
      subDependencies: [
        memoizedTimePickerViewModel.dependencies,
        memoizedDatePickerViewModel.dependencies,
      ],
    },
    createViewModel: createDailyLayoutViewModel,
  };

export function createDailyLayoutViewModel({
  state,
  context,
}: ViewModelFactoryParams<
  CalendarState,
  CalendarContext
>): DailyLayoutViewModel {
  const { getContent } = context;

  return {
    bodyTitle: getContent({
      settingsParam: settingsParams.dateAndTimeSectionHeader,
      translationKey: 'app.settings.defaults.widget.date-and-time-header',
    }),
    datePickerViewModel: createDatePickerViewModel({ state, context }),
    timePickerViewModel: createTimePickerViewModel({ state, context }),
  };
}
