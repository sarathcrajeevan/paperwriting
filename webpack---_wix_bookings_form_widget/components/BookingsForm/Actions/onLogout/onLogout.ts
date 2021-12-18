import { BookingsQueryParams } from '@wix/bookings-adapter-ooi-wix-sdk';
import { CreateActionParams } from '../actions';

export type OnLogout = () => void;

export function createOnLogoutAction({
  context: { wixSdkAdapter },
  getControllerState,
}: CreateActionParams): OnLogout {
  return async () => {
    const [, setState] = getControllerState();
    wixSdkAdapter.removeFromSessionStorage(BookingsQueryParams.FILLED_FIELDS);
    setState({
      overrideDefaultFieldsValues: true,
    });
  };
}
