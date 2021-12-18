import {
  GetBusinessResponse,
  NotificationType,
} from '@wix/ambassador-services-catalog-server/http';
import { mapResponseToBusinessInfo } from '@wix/bookings-uou-mappers';
import { BusinessInfo } from '../../types/types';

export const mapBusinessResponseToBusinessInfo = (
  businessResponse: GetBusinessResponse,
): BusinessInfo => {
  const businessInfoBase = mapResponseToBusinessInfo(businessResponse);
  return {
    ...businessInfoBase,
    isSMSReminderEnabled: isSMSReminderEnabled(businessResponse),
  };
};

const isSMSReminderEnabled = (
  businessResponse: GetBusinessResponse,
): boolean => {
  const applicableForSmsReminders = !!businessResponse.activeFeatures
    ?.applicableForSmsReminders;
  const isUserEnabledSMSReminder = !!businessResponse?.notificationsSetup?.notifications?.find(
    (notification) =>
      notification.isEnabled &&
      notification.type === NotificationType.REMINDER_SMS &&
      notification.requireParticipantConsent,
  );
  return applicableForSmsReminders && isUserEnabledSMSReminder;
};
