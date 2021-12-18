import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import getToastType, { ToastType } from '../../../../utils/state/getToastType';
import { RemoveError } from '../removeError/removeError';
import { CalendarErrors } from '../../../../types/types';

export type OnToastClose = () => void;

export function createOnToastCloseAction(
  { getControllerState }: ActionFactoryParams<CalendarState, CalendarContext>,
  removeError: RemoveError,
): OnToastClose {
  return () => {
    const [state] = getControllerState();
    const toastType = getToastType(state);

    switch (toastType) {
      case ToastType.RescheduleError:
        removeError(CalendarErrors.RESCHEDULE_SERVER_ERROR);
        break;
      case ToastType.AvailableSlotsError:
        removeError(CalendarErrors.AVAILABLE_SLOTS_SERVER_ERROR);
        break;
      case ToastType.NextAvailableSlotError:
        removeError(CalendarErrors.NEXT_AVAILABLE_DATE_SERVER_ERROR);
        break;
      default:
        break;
    }
  };
}
