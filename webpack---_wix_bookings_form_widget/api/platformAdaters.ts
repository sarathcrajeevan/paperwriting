import {
  SlotAvailability,
  LocationType,
} from '@wix/ambassador-availability-calendar/types';
import { Session } from '@wix/ambassador-bookings-server/types';

export function createSessionFromSlotAvailability(
  slotAvailability: SlotAvailability,
): Session {
  const slot = slotAvailability.slot!;
  const affectedSchedules = [
    {
      scheduleId: slotAvailability.slot!.resource!.scheduleId,
    },
  ];
  const { scheduleId, startDate, endDate, location } = slot;
  return {
    affectedSchedules,
    scheduleId,
    start: {
      timestamp: startDate,
    },
    end: {
      timestamp: endDate,
    },
    location: {
      locationType: location?.locationType as any,
      ...(location?.id
        ? {
            businessLocation: { id: location?.id },
          }
        : {}),
    },
  };
}
