import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { WidgetElements } from '../../../../utils/bi/consts';
import { CalendarState } from '../../controller';
import { CloseDialogAction } from '../closeDialog/closeDialog';
import { mapDialogTypeToWidgetComponent } from '../../../../utils/bi/mappers';

export type OnDialogClose = () => void;

export function createOnDialogCloseAction(
  {
    getControllerState,
    context: { biLogger },
  }: ActionFactoryParams<CalendarState, CalendarContext>,
  closeDialog: CloseDialogAction,
): OnDialogClose {
  return () => {
    const [state] = getControllerState();
    const { dialog } = state;

    void biLogger.bookingsCalendarClick({
      component: mapDialogTypeToWidgetComponent(dialog?.type),
      element: WidgetElements.CLOSE_BUTTON,
    });

    closeDialog();
  };
}
