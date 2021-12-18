import { ViewModelFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import getToastType, { ToastType } from '../../../../utils/state/getToastType';
import { CalendarState } from '../../controller';
import { MemoizedViewModalFactory } from '../viewModel';

export type ToastViewModel = {
  show: boolean;
  text: string;
};

const TOAST_TYPE_TO_TRANSLATION_MAP = {
  [ToastType.RescheduleError]: 'app.toast.reschedule-error',
  [ToastType.AvailableSlotsError]: 'app.toast.available-slots-error',
  [ToastType.NextAvailableSlotError]: 'app.toast.next-available-slot-error',
};

export const memoizedToastViewModel: MemoizedViewModalFactory<ToastViewModel> =
  {
    dependencies: { state: ['calendarErrors'] },
    createViewModel: createToastViewModel,
  };

export function createToastViewModel({
  state,
  context: { t },
}: ViewModelFactoryParams<CalendarState, CalendarContext>): ToastViewModel {
  const toastType = getToastType(state);

  return {
    show: !!toastType,
    text: toastType ? t(TOAST_TYPE_TO_TRANSLATION_MAP[toastType]) : '',
  };
}
