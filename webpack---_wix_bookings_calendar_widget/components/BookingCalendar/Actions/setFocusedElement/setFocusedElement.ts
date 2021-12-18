import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { FlowElements } from '../../Hooks/useFlow';
import { BASE_DELAY } from '../../../../constants/constants';

export type SetFocusedElement = (flowElement: FlowElements) => void;

export function createSetFocusedElementAction({
  getControllerState,
  context: { experiments },
}: ActionFactoryParams<CalendarState, CalendarContext>): SetFocusedElement {
  return (flowElement) => {
    const [, setState] = getControllerState();
    setState({
      focusedElement: flowElement,
    });

    setTimeout(
      () =>
        setState({
          focusedElement: undefined,
        }),
      BASE_DELAY,
    );
  };
}
