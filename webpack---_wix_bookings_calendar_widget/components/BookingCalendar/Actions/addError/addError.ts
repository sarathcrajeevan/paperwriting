import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { CalendarErrors } from '../../../../types/types';

export type AddError = (errorType: CalendarErrors) => void;

export function createAddErrorAction({
  getControllerState,
}: ActionFactoryParams<CalendarState, CalendarContext>): AddError {
  return (errorType: CalendarErrors) => {
    const [state, setState] = getControllerState();

    const { calendarErrors: prevCalendarErrors } = state;
    const calendarErrors = prevCalendarErrors;

    const isErrorAlreadyExists = prevCalendarErrors.includes(errorType);
    if (!isErrorAlreadyExists) {
      setState({
        calendarErrors: [...calendarErrors, errorType],
      });
    }
  };
}
