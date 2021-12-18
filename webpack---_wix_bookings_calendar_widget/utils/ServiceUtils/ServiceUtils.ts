import { Service, ServiceType } from '@wix/bookings-uou-types';

export const isServiceAClass = (service: Service) =>
  service.info.type === ServiceType.GROUP;

export const isCalendarFlow = (service: Service) =>
  service?.info.type !== ServiceType.COURSE &&
  service?.policy.isBookOnlineAllowed;
