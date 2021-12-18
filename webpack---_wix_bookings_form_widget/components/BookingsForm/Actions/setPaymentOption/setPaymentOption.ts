import { FormContext } from '../../../../utils/context/contextFactory';
import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { FormState } from '../../../../utils/state/initialStateFactory';

export type SetPaymentOption = (selectedPaymentOptionId: string) => void;

export function createSetPaymentOptionAction({
  getControllerState,
}: ActionFactoryParams<FormState, FormContext>): SetPaymentOption {
  return async (selectedPaymentOptionId: string) => {
    const [, setState] = getControllerState();

    setState({ selectedPaymentOptionId });
  };
}
