import {
  ServiceInfoDto,
  ServiceLocationType,
} from '@wix/bookings-uou-types/dist/src';
import { LocationMapper } from '../../mappers/location.mapper';

export interface SchedulingLocationViewModel {
  currentLocation?: string;
  locationOptions?: LocationDropdownOption[];
}

export interface LocationDropdownOption {
  id: string;
  value: string;
}

export const All_LOCATIONS_ID = '';

export const schedulingLocationViewModelFactory = ({
  serviceInfoDto,
  selectedLocation,
  isUoUMultiLocationAllLocationsEnabled,
  t,
}: {
  serviceInfoDto: ServiceInfoDto;
  selectedLocation?: string;
  isUoUMultiLocationAllLocationsEnabled: boolean;
  t: (key: string) => string;
}): SchedulingLocationViewModel => {
  let locationOptions: LocationDropdownOption[] = [];
  if (serviceInfoDto.locations && serviceInfoDto.locations.length > 1) {
    const locationMapper = new LocationMapper('');
    locationOptions = serviceInfoDto.locations
      .filter(
        (serviceLocation) =>
          serviceLocation.type === ServiceLocationType.OWNER_BUSINESS,
      )
      .map((serviceLocation) => ({
        id: serviceLocation?.businessLocation?.id || '',
        value: locationMapper.text({
          serviceLocation,
          useBusinessName: true,
        }),
      }));
  }

  let currentLocation;
  if (selectedLocation) {
    currentLocation = selectedLocation;
  } else {
    const defaultLocationId = serviceInfoDto.locations?.find(
      (location) => location.businessLocation?.default,
    )?.businessLocation?.id;

    currentLocation =
      defaultLocationId || serviceInfoDto.locations?.[0].businessLocation?.id;
    if (isUoUMultiLocationAllLocationsEnabled) {
      currentLocation = '';
    }
  }
  if (isUoUMultiLocationAllLocationsEnabled) {
    if (locationOptions.length < 2) {
      currentLocation = undefined;
    } else {
      locationOptions.splice(0, 0, {
        id: All_LOCATIONS_ID,
        value: t('All Locations'),
      });
    }
  }

  return {
    currentLocation,
    locationOptions,
  };
};
