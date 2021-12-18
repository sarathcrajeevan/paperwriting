import {
  ServiceLocation,
  ServiceLocationType,
} from '@wix/bookings-uou-types/dist/src';

export class LocationMapper {
  constructor(private clientLocationText: string) {}

  public text({
    serviceLocation,
    useBusinessName = false,
  }: {
    serviceLocation: ServiceLocation | undefined;
    useBusinessName?: boolean;
  }): string {
    switch (serviceLocation?.type) {
      case ServiceLocationType.OWNER_CUSTOM:
        return (
          serviceLocation?.address || (serviceLocation?.locationText as string)
        ); // TODO: remove address when clean specs.bookings.UoUMultiLocationV1
      case ServiceLocationType.CLIENT_PLACE:
        return this.clientLocationText;
      case ServiceLocationType.CUSTOM:
        return this.clientLocationText;
      case ServiceLocationType.OWNER_BUSINESS:
        return useBusinessName ? serviceLocation?.businessLocation?.name! : '';
      default:
        return '';
    }
  }
}
