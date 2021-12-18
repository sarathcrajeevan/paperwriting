import { memoizedLoginViewModel } from './../loginViewModel/loginViewModel';
import { ViewModelFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { MemoizedViewModalFactory } from '../viewModel';
import {
  BookingDetailsViewModel,
  createBookingDetailsViewModel,
  memoizedBookingDetailsViewModel,
} from '../bookingDetailsViewModel/bookingDetailsViewModel';
import settingsParams from '../../settingsParams';
import { createLoginViewModel, LoginViewModel } from '../loginViewModel/loginViewModel';

export type SidebarViewModel = {
  sidebarTitle: string;
  bookingDetailsViewModel: BookingDetailsViewModel;
  loginViewModel?: LoginViewModel;
};

export const memoizedSidebarViewModel: MemoizedViewModalFactory<SidebarViewModel> =
  {
    dependencies: {
      settings: ['bookingDetailsSectionHeader'],
      subDependencies: [memoizedBookingDetailsViewModel.dependencies, memoizedLoginViewModel.dependencies],
    },
    createViewModel: createSidebarViewModel,
  };

export function createSidebarViewModel({
  state,
  context,
}: ViewModelFactoryParams<CalendarState, CalendarContext>): SidebarViewModel {
  const { getContent } = context;

  return {
    sidebarTitle: getContent({
      settingsParam: settingsParams.bookingDetailsSectionHeader,
      translationKey: 'app.settings.defaults.widget.booking-details-header',
    }),
    bookingDetailsViewModel: createBookingDetailsViewModel({ state, context }),
    loginViewModel: createLoginViewModel({ state, context })
  };
}
