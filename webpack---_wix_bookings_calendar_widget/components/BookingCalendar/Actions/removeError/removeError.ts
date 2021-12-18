import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { CalendarErrors } from '../../../../types/types';

export type RemoveError = (errorType: CalendarErrors) => void;

export function createRemoveErrorAction({
  getControllerState,
}: ActionFactoryParams<CalendarState, CalendarContext>): RemoveError {
  return (errorType: CalendarErrors) => {
    const [state, setState] = getControllerState();
    const { calendarErrors: prevCalendarErrors } = state;

    const isErrorExists = prevCalendarErrors.includes(errorType);
    if (isErrorExists) {
      const calendarErrors = prevCalendarErrors.filter(
        (error) => error !== errorType,
      );

      setState({
        calendarErrors,
      });
    }
  };
}
