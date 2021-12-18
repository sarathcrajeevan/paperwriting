import { CreateActionParams } from '../actions';
import { FormStatus } from '../../../../types/form-state';

export type PromptLogin = () => void;

export function createPromptLoginAction({
  getControllerState,
  context: { wixSdkAdapter, reportError },
}: CreateActionParams): PromptLogin {
  return async () => {
    const [, setState] = getControllerState();
    if (!wixSdkAdapter.isPreviewMode()) {
      try {
        setState({
          status: FormStatus.PROCESSING_USER_DETAILS,
        });
        await wixSdkAdapter.promptUserLogin();
      } catch (e) {
        setState({
          status: FormStatus.IDLE,
        });
        reportError(e);
      }
    }
  };
}
