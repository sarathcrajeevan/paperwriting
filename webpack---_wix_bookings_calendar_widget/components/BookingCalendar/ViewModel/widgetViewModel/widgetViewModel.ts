import { ViewModelFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState, TFunction } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { FlowElements } from '../../Hooks/useFlow';
import { MemoizedViewModalFactory } from '../viewModel';
import {
  createEmptyStateViewModel,
  EmptyStateViewModel,
} from '../emptyStateViewModel/emptyStateViewModel';
import { CalendarErrors } from '../../../../types/types';
import { Plan } from '@wix/ambassador-checkout-server/types';
import { getFurthestValidUntilPlan } from '../../../../utils/pricingPlans/pricingPlans';

export enum BottomSectionStatus {
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export type WidgetViewModel = {
  status: BottomSectionStatus;
  errorNotificationText: string;
  focusedElement?: FlowElements;
  emptyStateViewModel?: EmptyStateViewModel;
};

export const memoizedWidgetViewModel: MemoizedViewModalFactory<WidgetViewModel> = {
  dependencies: {
    state: ['calendarErrors', 'focusedElement', 'bottomSectionStatus'],
  },
  createViewModel: createWidgetViewModel,
};

export function createWidgetViewModel({
  state,
  context: { t, experiments },
}: ViewModelFactoryParams<CalendarState, CalendarContext>): WidgetViewModel {
  const {
    calendarErrors,
    focusedElement,
    bottomSectionStatus,
    initialErrors,
    purchasedPricingPlans,
  } = state;

  let emptyStateViewModel;
  if (initialErrors.length > 0) {
    emptyStateViewModel = createEmptyStateViewModel({
      t,
      type: initialErrors[0],
    });
  }

  const isShowPricingPlanEndDateIndicationEnabled = experiments.enabled(
    'specs.bookings.ShowPricingPlanEndDateIndication',
  );

  let errorNotificationText = '';
  errorNotificationText = getErrorNotificationText(
    calendarErrors,
    t,
    isShowPricingPlanEndDateIndicationEnabled,
    purchasedPricingPlans,
  );

  return {
    status: bottomSectionStatus,
    errorNotificationText,
    focusedElement,
    emptyStateViewModel,
  };
}

const getErrorNotificationText = (
  calendarErrors: CalendarErrors[],
  t: TFunction,
  isShowPricingPlanEndDateIndicationEnabled: boolean,
  purchasedPricingPlans?: Plan[],
) => {
  if (calendarErrors.includes(CalendarErrors.NO_TIME_SELECTED_ERROR)) {
    return t('app.notification.no-time-selected-error.text');
  }

  if (
    isShowPricingPlanEndDateIndicationEnabled &&
    calendarErrors.includes(
      CalendarErrors.NO_VALID_PRICING_PLAN_IN_RESCHEDULE_FLOW_ERROR,
    )
  ) {
    const furthestValidUntilPlan = getFurthestValidUntilPlan(
      purchasedPricingPlans,
    );
    return t('app.toast.pricing-plan-not-valid-error', {
      planName: furthestValidUntilPlan?.planName,
      planDate: new Date(furthestValidUntilPlan?.validUntil!),
    });
  }
  return '';
};
