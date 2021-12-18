import { CalendarContext } from '../../../../utils/context/contextFactory';
import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';

export type OnLoginClick = () => void;

export function createOnLoginClickAction({
  context: { wixSdkAdapter },
}: ActionFactoryParams<CalendarState, CalendarContext>): OnLoginClick {
  return () => {
    if (!wixSdkAdapter.isPreviewMode()) {
      wixSdkAdapter.promptUserLogin();
    }
  };
}
