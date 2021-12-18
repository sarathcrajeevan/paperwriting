import { FormContext } from '../../../../../utils/context/contextFactory';
import { ActionFactoryParams } from '../../../../../utils/ControlledComponent/ControlledComponent.types';
import { FormState } from '../../../../../utils/state/initialStateFactory';
import { FormErrors } from '../../../../../types/errors';

export type RemoveError = (error: FormErrors) => void;

export function createRemoveErrorAction({
  getControllerState,
}: ActionFactoryParams<FormState, FormContext>): RemoveError {
  return (error: FormErrors) => {
    const [state, setState] = getControllerState();
    const { errors: prevFormErrors } = state;

    const isErrorExists = prevFormErrors.includes(error);
    if (isErrorExists) {
      const errors: FormErrors[] = prevFormErrors.filter(
        (formError) => formError !== error,
      );
      setState({
        errors,
      });
    }
  };
}
