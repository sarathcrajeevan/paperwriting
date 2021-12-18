import { Booking } from '@wix/ambassador-bookings-server/types';
import { ViewModelFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import {
  formatShortDate,
  formatShortTime,
} from '../../../../utils/dateAndTime/dateAndTime';
import { CalendarState } from '../../controller';
import { MemoizedViewModalFactory } from '../viewModel';
import { Optional } from '../../../../types/types';

const BASE_PARTICIPANTS_AMOUNT = 1;

export type RescheduleDetailsViewModel = {
  notificationContent: string;
  buttonText: string;
};

export const memoizedRescheduleDetailsViewModel: MemoizedViewModalFactory<
  Optional<RescheduleDetailsViewModel>
> = {
  dependencies: {
    state: ['rescheduleBookingDetails', 'selectedTimezone'],
  },
  createViewModel: createRescheduleDetailsViewModel,
};

export function createRescheduleDetailsViewModel({
  state,
  context,
}: ViewModelFactoryParams<
  CalendarState,
  CalendarContext
>): Optional<RescheduleDetailsViewModel> {
  if (!state.rescheduleBookingDetails) {
    return;
  }

  const { rescheduleBookingDetails, selectedTimezone } = state;
  const { t, businessInfo } = context;
  const participantsAmount = getParticipantsAmount(rescheduleBookingDetails);

  const notificationContent = t(
    participantsAmount === 1
      ? 'app.rescheduled-booking.content.single-participant'
      : 'app.rescheduled-booking.content.multi-participants',
    {
      participants_amount: participantsAmount,
      date: formatShortDate(
        rescheduleBookingDetails.bookedEntity?.singleSession?.start!,
        businessInfo!.dateRegionalSettingsLocale,
        selectedTimezone,
      ),
      time: formatShortTime(
        rescheduleBookingDetails.bookedEntity?.singleSession?.start!,
        businessInfo!.dateRegionalSettingsLocale,
        selectedTimezone,
      ),
    },
  );
  const buttonText = t('app.rescheduled-booking.back-button');

  return {
    notificationContent,
    buttonText,
  };
}

function getParticipantsAmount(booking: Booking) {
  const paymentSelection = booking.formInfo?.paymentSelection;

  return paymentSelection && paymentSelection[0].numberOfParticipants
    ? paymentSelection[0].numberOfParticipants
    : BASE_PARTICIPANTS_AMOUNT;
}
