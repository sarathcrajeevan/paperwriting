import { CreateActionParams } from '../actions';
import { bookingsBookingsFormLoad } from '@wix/bi-logger-wixboost-ugc/v2';
import { FormStatus } from '../../../../types/form-state';

export type InitializeWidget = () => void;

export function createInitializeWidgetAction({
  getControllerState,
  context: { biLogger },
}: CreateActionParams): InitializeWidget {
  return () => {
    const [state, setState] = getControllerState();
    biLogger?.report(
      bookingsBookingsFormLoad({
        formId: state.service.formSchema.formId,
      }),
    );
    setState({
      status: FormStatus.IDLE,
    });
  };
}
