import { CreateActionParams } from '../actions';

export type SetEmail = (email?: string) => void;

export function createSetEmailAction({
  getControllerState,
}: CreateActionParams): SetEmail {
  return async (email?: string) => {
    const [state, setState] = getControllerState();
    const { formInputs } = state;
    setState({
      formInputs: {
        ...formInputs,
        email,
      },
    });
  };
}
