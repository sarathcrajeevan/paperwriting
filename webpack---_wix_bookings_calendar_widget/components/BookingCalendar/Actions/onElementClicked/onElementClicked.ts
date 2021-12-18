import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { WidgetComponents, WidgetElements } from '../../../../utils/bi/consts';

export type OnElementClicked = (
  component: WidgetComponents,
  element: WidgetElements,
  rawProperties?: any,
) => void;

export function createOnElementClicked({
  context: { biLogger },
}: ActionFactoryParams<CalendarState, CalendarContext>): OnElementClicked {
  return (component, element, rawProperties) => {
    let properties;
    if (rawProperties) {
      if (typeof rawProperties === 'object') {
        properties = JSON.stringify(rawProperties);
      } else {
        properties = rawProperties.toString();
      }
    }
    biLogger.bookingsCalendarClick({
      component,
      element,
      properties,
    });
  };
}
