import { ViewModelFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { CalendarState } from '../../controller';
import { MemoizedViewModalFactory } from '../viewModel';
import { Optional } from '../../../../types/types';

export type LoginViewModel = {
  content: string;
  cta: string;
};

export const memoizedLoginViewModel: MemoizedViewModalFactory<Optional<
  LoginViewModel
>> = {
  dependencies: {
    state: ['selectedService', 'isUserLoggedIn'],
  },
  createViewModel: createLoginViewModel,
};

export function createLoginViewModel({
  state,
  context,
}: ViewModelFactoryParams<CalendarState, CalendarContext>): Optional<
  LoginViewModel
> {
  const { t, experiments, isMemberAreaInstalled } = context;
  const { selectedService, isUserLoggedIn } = state;

  const isShowPricingPlanEndDateIndicationEnabled = experiments.enabled(
    'specs.bookings.ShowPricingPlanEndDateIndication',
  );

  if (isShowPricingPlanEndDateIndicationEnabled) {
    const isServiceHasPricingPlans = !!selectedService?.payment.pricingPlanInfo
      ?.pricingPlans?.length;
    const shouldShowLoginButton =
      !isUserLoggedIn && isServiceHasPricingPlans && isMemberAreaInstalled;
    if (shouldShowLoginButton) {
      return {
        content: t('app.already-a-member'),
        cta: t('app.login'),
      };
    }
  }
}
