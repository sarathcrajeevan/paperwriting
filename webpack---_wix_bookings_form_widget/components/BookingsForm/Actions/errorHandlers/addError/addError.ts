import { FormContext } from '../../../../../utils/context/contextFactory';
import { ActionFactoryParams } from '../../../../../utils/ControlledComponent/ControlledComponent.types';
import { FormState } from '../../../../../utils/state/initialStateFactory';
import { FormErrors } from '../../../../../types/errors';

export type AddError = (error: FormErrors) => void;

export function createAddErrorAction({
  getControllerState,
}: ActionFactoryParams<FormState, FormContext>): AddError {
  return (error: FormErrors) => {
    const [state, setState] = getControllerState();

    const { errors: prevFormErrors } = state;

    const isErrorAlreadyExists = prevFormErrors.includes(error);
    if (!isErrorAlreadyExists) {
      setState({
        errors: [...prevFormErrors, error],
      });
    }
  };
}
