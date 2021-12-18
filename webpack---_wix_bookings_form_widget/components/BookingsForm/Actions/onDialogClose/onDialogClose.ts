import { CreateActionParams } from '../actions';

export type OnDialogClose = () => void;

export function createOnDialogCloseAction({
  getControllerState,
}: CreateActionParams): OnDialogClose {
  return () => {
    const [, setState] = getControllerState();

    setState({
      dialog: undefined,
    });
  };
}
