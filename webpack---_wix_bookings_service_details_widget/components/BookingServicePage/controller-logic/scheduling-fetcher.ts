import { fixFormattedDateToISOString } from '../../../utils/dateFormatter';
import { getSchedule } from '../../../api/schedule.api';
import { SchedulingSectionStatus } from '../../../service-page-view-model/scheduling-section-view-model/schedulingSectionViewModel';
import { WidgetConfig } from '../../../types/shared-types';
import { ServiceType } from '@wix/bookings-uou-types';
import { ScheduleStatus } from '@wix/ambassador-services-catalog-server/types';

export async function getServiceSchedulingData({
  config,
  settings,
  httpClient,
  instance,
  isOnlyCreatedSchedule,
  locationId,
}: {
  config: WidgetConfig;
  settings: any;
  httpClient: any;
  instance: string;
  isOnlyCreatedSchedule: boolean;
  locationId?: string;
}) {
  const serviceType = config.serviceDto!.type;
  const isCourse = serviceType === ServiceType.COURSE;
  const isIndividual = serviceType === ServiceType.INDIVIDUAL;

  if (!isIndividual) {
    const schedule = isOnlyCreatedSchedule
      ? config?.SEO?.serviceResponse?.schedules?.find(
          (serviceSchedule) =>
            serviceSchedule.status === ScheduleStatus.CREATED,
        )
      : config?.SEO?.serviceResponse?.schedules?.[0];
    const now = new Date();
    const from = isCourse
      ? fixFormattedDateToISOString(schedule?.firstSessionStart)
      : now.toISOString();
    const to = isCourse
      ? fixFormattedDateToISOString(schedule?.lastSessionEnd)
      : new Date(
          now.setDate(now.getDate() + settings.scheduleDays),
        ).toISOString();
    if (from && to) {
      const response = await httpClient.request(
        getSchedule([schedule?.id], from, to, locationId),
      );
      return response.data;
    }
  }
  return { status: SchedulingSectionStatus.EMPTY };
}
