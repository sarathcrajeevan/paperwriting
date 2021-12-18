import { FormContext } from '../../../../utils/context/contextFactory';
import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { FormState } from '../../../../utils/state/initialStateFactory';
import { AddError, createAddErrorAction } from './addError/addError';
import {
  ClearErrorByTypes,
  createClearErrorByTypeAction,
} from './clearErrorByTypes/clearErrorByTypes';
import {
  RemoveError,
  createRemoveErrorAction,
} from './removeError/removeError';

export type ErrorHandlers = {
  addError: AddError;
  removeError: RemoveError;
  clearErrorByTypes: ClearErrorByTypes;
};
export const createFormErrorHandlers = (
  actionFactoryParams: ActionFactoryParams<FormState, FormContext>,
): ErrorHandlers => {
  return {
    addError: createAddErrorAction(actionFactoryParams),
    removeError: createRemoveErrorAction(actionFactoryParams),
    clearErrorByTypes: createClearErrorByTypeAction(actionFactoryParams),
  };
};
