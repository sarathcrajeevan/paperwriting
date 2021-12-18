import { OfferingCategoryDto } from '@wix/bookings-uou-domain';
import {
  CatalogServiceDto,
  ReservedLocationIds,
  ServiceLocation,
  ServiceLocationType,
} from '@wix/bookings-uou-types';
import {
  FilterByOptions,
  FilterType,
  SelectedResources,
} from '../domain/widget';

import { ServiceListSettings } from '../../Shared/appKeys/SettingsKeys';

export function getSelectedResources(settingsResponse: ServiceListSettings) {
  return (
    (settingsResponse && settingsResponse.SELECTED_RESOURCES) || {
      filter: FilterType.ALL,
    }
  );
}

function filterServicesBySelectedLocations(
  catalogServices: CatalogServiceDto[],
  selectedLocations: string[],
) {
  if (selectedLocations?.length > 0) {
    return catalogServices.filter((service) =>
      service.info.locations.some((location) => {
        if (location.type === ServiceLocationType.OWNER_BUSINESS) {
          return selectedLocations.includes(location.businessLocation?.id);
        }
        return selectedLocations.includes(ReservedLocationIds.OTHER_LOCATIONS);
      }),
    );
  }
  return catalogServices;
}

export function filterServicesBySelectedServicesAndCategories(
  catalogServices: CatalogServiceDto[],
  selectedResources: SelectedResources,
) {
  if (selectedResources && catalogServices.length > 0) {
    switch (selectedResources.filter) {
      case FilterType.SPECIFIC:
        return catalogServices.filter(
          (catalogOffering) =>
            selectedResources.offerings.includes(catalogOffering.id) ||
            selectedResources.categories.includes(catalogOffering.categoryId),
        );
      case FilterType.FIRST:
        return [catalogServices[0]];
      default:
        return catalogServices;
    }
  }
  return catalogServices;
}

export function filterSelectedCatalogOfferings(
  catalogServices: CatalogServiceDto[],
  filterBy: FilterByOptions,
  selectedResources: SelectedResources,
  selectedLocations: string[],
  isMultiLocationEnabled = false,
) {
  if (isMultiLocationEnabled && filterBy === FilterByOptions.BY_LOCATIONS) {
    return filterServicesBySelectedLocations(
      catalogServices,
      selectedLocations,
    );
  }
  return filterServicesBySelectedServicesAndCategories(
    catalogServices,
    selectedResources,
  );
}

export function filterOutEmptyCategories(
  catalogCategories: OfferingCategoryDto[],
  selectedCatalogOfferings: CatalogServiceDto[],
) {
  const relevantCategoryIds: Set<string> = new Set(
    selectedCatalogOfferings.map((offering) => offering.categoryId),
  );
  return catalogCategories.filter((category) =>
    relevantCategoryIds.has(category.id),
  );
}

function isLocationSelected(
  selectedLocations: string[],
  location: ServiceLocation,
): boolean {
  return (
    selectedLocations.length === 0 ||
    selectedLocations.includes(location.businessLocation.id)
  );
}

export function filterRelevantLocations(
  locations: ServiceLocation[],
  selectedServices: CatalogServiceDto[],
  settingsData: ServiceListSettings,
) {
  const selectedLocations = settingsData?.SELECTED_LOCATIONS || [];
  const shouldFilterByLocations =
    settingsData?.FILTER_BY === FilterByOptions.BY_LOCATIONS;
  const assignedLocationsIds = getAssignedBusinessLocations(
    selectedServices,
  ).map((location) => location.businessLocation.id);
  return locations.filter(
    (location) =>
      assignedLocationsIds.includes(location.businessLocation.id) &&
      (!shouldFilterByLocations ||
        isLocationSelected(selectedLocations, location)),
  );
}

export function getAssignedBusinessLocations(
  selectedServices: CatalogServiceDto[],
): ServiceLocation[] {
  const serviceLocations = selectedServices.flatMap(
    (service) => service.info.locations,
  );
  const businessServiceLocations: ServiceLocation[] = serviceLocations.filter(
    (location) => {
      return (
        location.type === ServiceLocationType.OWNER_BUSINESS &&
        location.businessLocation
      );
    },
  );
  const uniqueServiceLocations: ServiceLocation[] = [];
  businessServiceLocations.forEach((businessServiceLocation) => {
    if (
      !uniqueServiceLocations.find(
        (location) =>
          location.businessLocation.id ===
          businessServiceLocation.businessLocation.id,
      )
    ) {
      uniqueServiceLocations.push(businessServiceLocation);
    }
  });
  return uniqueServiceLocations;
}

export function filterResources(
  offerings: CatalogServiceDto[],
  categories: OfferingCategoryDto[],
  locations: ServiceLocation[],
  settingsData: ServiceListSettings,
  isMultiLocationEnabled = false,
): {
  offerings: CatalogServiceDto[];
  categories: OfferingCategoryDto[];
  locations: ServiceLocation[];
} {
  const selectedResources: SelectedResources = getSelectedResources(
    settingsData,
  );
  const filterBy =
    isMultiLocationEnabled && settingsData
      ? settingsData.FILTER_BY
      : FilterByOptions.BY_SERVICES;
  const selectedLocations =
    isMultiLocationEnabled && settingsData
      ? settingsData.SELECTED_LOCATIONS
      : [];
  const selectedOfferings: CatalogServiceDto[] = filterSelectedCatalogOfferings(
    offerings,
    filterBy,
    selectedResources,
    selectedLocations,
    isMultiLocationEnabled,
  );
  const selectedCategories: OfferingCategoryDto[] = filterOutEmptyCategories(
    categories,
    selectedOfferings,
  );
  let selectedServiceLocations: ServiceLocation[];
  if (isMultiLocationEnabled) {
    selectedServiceLocations = filterRelevantLocations(
      locations,
      selectedOfferings,
      settingsData,
    );
  } else {
    selectedServiceLocations = [];
  }

  return {
    offerings: selectedOfferings,
    categories: selectedCategories,
    locations: selectedServiceLocations,
  };
}
