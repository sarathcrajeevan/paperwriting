import { GenericErrorType } from '../../../../types/errors';
import { CreateActionParams } from '../actions';

export type OnToastClose = () => void;

export function createOnToastCloseAction({
  internalActions,
}: CreateActionParams): OnToastClose {
  return () => {
    const { errorHandlers } = internalActions;
    errorHandlers.clearErrorByTypes([GenericErrorType]);
  };
}
