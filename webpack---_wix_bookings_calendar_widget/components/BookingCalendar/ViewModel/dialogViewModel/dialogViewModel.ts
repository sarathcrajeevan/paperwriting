import { ViewModelFactoryParams } from '../../../../utils/ControlledComponent/ControlledComponent.types';
import { CalendarContext } from '../../../../utils/context/contextFactory';
import { CalendarState } from '../../controller';
import {
  formatRfcTimeStringToTimeSlotView,
  formatShortDate,
} from '../../../../utils/dateAndTime/dateAndTime';
import { Optional } from '../../../../types/types';
import { MemoizedViewModalFactory } from '../viewModel';

export enum DialogState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
}

export type DialogViewModel = {
  isOpen: boolean;
  state: DialogState;
  titleText?: string;
  contentText: string;
  confirmButtonText: string;
  confirmButtonUrlLink?: string;
};

// eslint-disable-next-line no-shadow
export enum DialogType {
  RescheduleConfirm = 'reschedule-confirm',
  JoinWaitlist = 'join-waitlist',
  PremiumViewer = 'premium-viewer',
}

export const MOBILE_APP_INVITE_LENDING_PAGE_URL_PREFIX =
  'https://apps.wix.com/place-invites/join-lp/';

export const memoizedDialogViewModel: MemoizedViewModalFactory<DialogViewModel> =
  {
    dependencies: {
      state: ['dialog', 'selectedTime'],
    },
    createViewModel: createDialogViewModel,
  };

export function createDialogViewModel({
  state,
  context,
}: ViewModelFactoryParams<CalendarState, CalendarContext>): DialogViewModel {
  const { dialog } = state;
  const confirmButtonUrlLink = getUrl(dialog?.type, context);

  return {
    isOpen: !!dialog,
    state: dialog?.state || DialogState.IDLE,
    ...getTexts({ state, context }),
    ...(confirmButtonUrlLink ? { confirmButtonUrlLink } : {}),
  };
}

function getTexts({
  state,
  context,
}: ViewModelFactoryParams<CalendarState, CalendarContext>) {
  const { dialog, selectedTime } = state;
  const { t, businessInfo } = context;

  switch (dialog?.type) {
    case DialogType.RescheduleConfirm:
      return {
        titleText: t('app.rescheduled-booking.dialog.title'),
        contentText: t('app.rescheduled-booking.dialog.content', {
          date: formatShortDate(
            selectedTime!,
            businessInfo!.dateRegionalSettingsLocale,
          ),
          time: formatRfcTimeStringToTimeSlotView(
            selectedTime!,
            businessInfo!.dateRegionalSettingsLocale,
          ),
        }),
        confirmButtonText: t('app.rescheduled-booking.dialog.button'),
      };
    case DialogType.JoinWaitlist:
      return {
        titleText: t('app.dialog.join-waitlist.title'),
        contentText: t('app.dialog.join-waitlist.content'),
        confirmButtonText: t('app.dialog.join-waitlist.button'),
      };
    case DialogType.PremiumViewer:
      return {
        contentText: t('app.dialog.premium-viewer.content'),
        confirmButtonText: t('app.dialog.premium-viewer.button'),
      };
    default:
      return {
        titleText: '',
        contentText: '',
        confirmButtonText: '',
      };
  }
}

const getUrl = (dialogType: Optional<DialogType>, context: CalendarContext) => {
  const metaSiteId = context.wixSdkAdapter.getMetaSiteId();
  return dialogType === DialogType.JoinWaitlist
    ? MOBILE_APP_INVITE_LENDING_PAGE_URL_PREFIX + metaSiteId
    : '';
};

