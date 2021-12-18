import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';

export type NavigateToMembersArea = () => void;

export function createNavigateToMembersAreaAction({
  context,
}: ActionFactoryParams<CalendarState, CalendarContext>): NavigateToMembersArea {
  return async () => {
    context.wixSdkAdapter.navigateToMembersArea();
  };
}
