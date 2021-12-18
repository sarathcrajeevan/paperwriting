import { FormContext } from '../../../../../utils/context/contextFactory';
import { ActionFactoryParams } from '../../../../../utils/ControlledComponent/ControlledComponent.types';
import { FormState } from '../../../../../utils/state/initialStateFactory';
import { FormErrors } from '../../../../../types/errors';

export type ClearErrorByTypes = <ErrorType>(errorTypes: ErrorType[]) => void;

export function createClearErrorByTypeAction({
  getControllerState,
}: ActionFactoryParams<FormState, FormContext>): ClearErrorByTypes {
  return (errorTypes) => {
    const [state, setState] = getControllerState();
    const { errors: prevFormErrors } = state;

    const errors = prevFormErrors.filter(
      (error: FormErrors) => !Object.values(errorTypes[0]).includes(error),
    );

    setState({
      errors,
    });
  };
}
