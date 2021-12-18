import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarState } from '../../controller';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { WidgetComponents, WidgetElements } from '../../../../utils/bi/consts';
import { SetSelectedTime } from '../setSelectedTime/setSelectedTime';
import {
  isAllSlotsAreFull,
  isAtLeastOneSlotIsWithOpenWaitingList,
} from '../../../../utils/timeSlots/timeSlots';
import { FlowElements } from '../../Hooks/useFlow';
import { SetFocusedElement } from '../setFocusedElement/setFocusedElement';
import { QueryAvailabilityResponse } from '@wix/ambassador-availability-calendar/types';
import { Optional, TriggeredByOptions } from '../../../../types/types';
import { CalendarBiLogger } from '../../../../utils/bi/biLoggerFactory';

export type OnTimeSelected = (selectedTime: string) => void;

export function createOnTimeSelectedAction(
  {
    getControllerState,
    context,
  }: ActionFactoryParams<CalendarState, CalendarContext>,
  setSelectedTimeAction: SetSelectedTime,
  setFocusedElement: SetFocusedElement,
): OnTimeSelected {
  return async (selectedTime: string) => {
    const [state] = getControllerState();
    const { biLogger } = context;
    const { availableSlots } = state;

    setSelectedTimeAction(selectedTime);

    sendBiEvents(availableSlots, selectedTime, biLogger);

    setFocusedElement(FlowElements.SIDEBAR);
  };
}

const sendBiEvents = (
  availableSlots: Optional<QueryAvailabilityResponse>,
  selectedTime: string,
  biLogger: CalendarBiLogger,
) => {
  const isWaitingListFlow = isSelectedTimeSlotWithWaitingListIndication(
    availableSlots,
    selectedTime,
  );
  const waitListProperty = isWaitingListFlow ? { waitlist: true } : {};

  void biLogger.bookingsCalendarClick({
    element: WidgetElements.TIME_SLOT,
    component: WidgetComponents.TIME_PICKER,
    properties: JSON.stringify({
      selectedTime,
      ...waitListProperty,
    }),
  });

  void biLogger.bookingsCalendarBookingDetailsLoad({
    triggeredBy: TriggeredByOptions.TIME_SELECTED,
    selectedSlot: selectedTime,
    properties: JSON.stringify({
      ...waitListProperty,
    }),
  });
};

const isSelectedTimeSlotWithWaitingListIndication = (
  availableSlots: Optional<QueryAvailabilityResponse>,
  selectedTime: string,
) => {
  const slotsAtSelectedTime = availableSlots?.availabilityEntries!.filter(
    (slot) => slot.slot?.startDate === selectedTime,
  );
  return (
    isAllSlotsAreFull(slotsAtSelectedTime!) &&
    isAtLeastOneSlotIsWithOpenWaitingList(slotsAtSelectedTime!)
  );
};
