import { SlotsNotificationType } from '../../ViewModel/slotsNotificationViewModel/slotsNotificationViewModel';
import { GoToNextAvailableDate } from '../goToNextAvailableDate/goToNextAvailableDate';

export type OnSlotsNotificationCtaClick = (
  notificationType: SlotsNotificationType,
) => void;

export function createOnSlotsNotificationCtaClick(
  goToNextAvailableDate: GoToNextAvailableDate,
): OnSlotsNotificationCtaClick {
  return (notificationType: SlotsNotificationType) => {
    if (notificationType === SlotsNotificationType.ALL_SESSIONS_ARE_FULL) {
      return goToNextAvailableDate();
    }
  };
}
