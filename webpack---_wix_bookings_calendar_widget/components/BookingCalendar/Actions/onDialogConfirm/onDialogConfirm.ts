import { ActionFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import {
  DialogState,
  DialogType,
} from '../../ViewModel/dialogViewModel/dialogViewModel';
import { WidgetElements } from '../../../../utils/bi/consts';
import { CalendarState } from '../../controller';
import { CloseDialogAction } from '../closeDialog/closeDialog';
import { mapDialogTypeToWidgetComponent } from '../../../../utils/bi/mappers';
import { AddError } from '../addError/addError';
import { getSelectedSlots } from '../../../../utils/selectedSlots/selectedSlots';

export type OnDialogConfirm = () => void;

export function createOnDialogConfirmAction(
  {
    getControllerState,
    context: { biLogger, calendarApi, wixSdkAdapter, businessInfo, t },
  }: ActionFactoryParams<CalendarState, CalendarContext>,
  closeDialog: CloseDialogAction,
  addError: AddError,
): OnDialogConfirm {
  return async () => {
    const [state, setState] = getControllerState();
    const {
      selectedService,
      selectableSlotsAtSelectedTime,
      dialog,
      selectedBookingPreferences,
      rescheduleBookingDetails,
      selectedTimezone,
    } = state;

    void biLogger.bookingsCalendarClick({
      component: mapDialogTypeToWidgetComponent(dialog?.type),
      element: WidgetElements.CONFIRM_BUTTON,
    });

    if (dialog!.type === DialogType.RescheduleConfirm) {
      const selectedSlot = getSelectedSlots({
        selectableSlotsAtSelectedTime: selectableSlotsAtSelectedTime!,
        dateRegionalSettingsLocale: businessInfo!.dateRegionalSettingsLocale!,
        t,
        selectedBookingPreferences,
      })[0].slot!;
      const bookingId = rescheduleBookingDetails!.id!;
      setState({
        dialog: {
          type: DialogType.RescheduleConfirm,
          state: DialogState.LOADING,
        },
      });

      const rescheduleResponse = await calendarApi.rescheduleBooking({
        bookingId,
        slot: selectedSlot,
        service: selectedService!,
        timezone: selectedTimezone!,
        onError: addError,
      });

      if (rescheduleResponse) {
        void biLogger.bookingsLoginUserAccountAppointmentsRescheduleSuccess({
          bookingId,
        });
        await wixSdkAdapter.navigateToMembersArea();
      } else {
        closeDialog();
      }
    } else if (
      dialog!.type === DialogType.JoinWaitlist ||
      dialog!.type === DialogType.PremiumViewer
    ) {
      closeDialog();
    }
  };
}
