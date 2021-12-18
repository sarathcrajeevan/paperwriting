import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { CalendarState } from '../../controller';

export type CloseDialogAction = () => void;

export function createCloseDialogAction({
  getControllerState,
}: ActionFactoryParams<CalendarState, CalendarContext>): CloseDialogAction {
  return () => {
    const [, setState] = getControllerState();

    setState({
      dialog: undefined,
    });
  };
}
