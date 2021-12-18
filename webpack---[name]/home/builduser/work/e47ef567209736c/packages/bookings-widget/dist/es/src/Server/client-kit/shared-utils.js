"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.filterResources = exports.getAssignedBusinessLocations = exports.filterRelevantLocations = exports.filterOutEmptyCategories = exports.filterSelectedCatalogOfferings = exports.filterServicesBySelectedServicesAndCategories = exports.getSelectedResources = void 0;
var bookings_uou_types_1 = require("@wix/bookings-uou-types");
var widget_1 = require("../domain/widget");

function getSelectedResources(settingsResponse) {
    return ((settingsResponse && settingsResponse.SELECTED_RESOURCES) || {
        filter: widget_1.FilterType.ALL,
    });
}
exports.getSelectedResources = getSelectedResources;

function filterServicesBySelectedLocations(catalogServices, selectedLocations) {
    if ((selectedLocations === null || selectedLocations === void 0 ? void 0 : selectedLocations.length) > 0) {
        return catalogServices.filter(function(service) {
            return service.info.locations.some(function(location) {
                var _a;
                if (location.type === bookings_uou_types_1.ServiceLocationType.OWNER_BUSINESS) {
                    return selectedLocations.includes((_a = location.businessLocation) === null || _a === void 0 ? void 0 : _a.id);
                }
                return selectedLocations.includes(bookings_uou_types_1.ReservedLocationIds.OTHER_LOCATIONS);
            });
        });
    }
    return catalogServices;
}

function filterServicesBySelectedServicesAndCategories(catalogServices, selectedResources) {
    if (selectedResources && catalogServices.length > 0) {
        switch (selectedResources.filter) {
            case widget_1.FilterType.SPECIFIC:
                return catalogServices.filter(function(catalogOffering) {
                    return selectedResources.offerings.includes(catalogOffering.id) ||
                        selectedResources.categories.includes(catalogOffering.categoryId);
                });
            case widget_1.FilterType.FIRST:
                return [catalogServices[0]];
            default:
                return catalogServices;
        }
    }
    return catalogServices;
}
exports.filterServicesBySelectedServicesAndCategories = filterServicesBySelectedServicesAndCategories;

function filterSelectedCatalogOfferings(catalogServices, filterBy, selectedResources, selectedLocations, isMultiLocationEnabled) {
    if (isMultiLocationEnabled === void 0) {
        isMultiLocationEnabled = false;
    }
    if (isMultiLocationEnabled && filterBy === widget_1.FilterByOptions.BY_LOCATIONS) {
        return filterServicesBySelectedLocations(catalogServices, selectedLocations);
    }
    return filterServicesBySelectedServicesAndCategories(catalogServices, selectedResources);
}
exports.filterSelectedCatalogOfferings = filterSelectedCatalogOfferings;

function filterOutEmptyCategories(catalogCategories, selectedCatalogOfferings) {
    var relevantCategoryIds = new Set(selectedCatalogOfferings.map(function(offering) {
        return offering.categoryId;
    }));
    return catalogCategories.filter(function(category) {
        return relevantCategoryIds.has(category.id);
    });
}
exports.filterOutEmptyCategories = filterOutEmptyCategories;

function isLocationSelected(selectedLocations, location) {
    return (selectedLocations.length === 0 ||
        selectedLocations.includes(location.businessLocation.id));
}

function filterRelevantLocations(locations, selectedServices, settingsData) {
    var selectedLocations = (settingsData === null || settingsData === void 0 ? void 0 : settingsData.SELECTED_LOCATIONS) || [];
    var shouldFilterByLocations = (settingsData === null || settingsData === void 0 ? void 0 : settingsData.FILTER_BY) === widget_1.FilterByOptions.BY_LOCATIONS;
    var assignedLocationsIds = getAssignedBusinessLocations(selectedServices).map(function(location) {
        return location.businessLocation.id;
    });
    return locations.filter(function(location) {
        return assignedLocationsIds.includes(location.businessLocation.id) &&
            (!shouldFilterByLocations ||
                isLocationSelected(selectedLocations, location));
    });
}
exports.filterRelevantLocations = filterRelevantLocations;

function getAssignedBusinessLocations(selectedServices) {
    var serviceLocations = selectedServices.flatMap(function(service) {
        return service.info.locations;
    });
    var businessServiceLocations = serviceLocations.filter(function(location) {
        return (location.type === bookings_uou_types_1.ServiceLocationType.OWNER_BUSINESS &&
            location.businessLocation);
    });
    var uniqueServiceLocations = [];
    businessServiceLocations.forEach(function(businessServiceLocation) {
        if (!uniqueServiceLocations.find(function(location) {
                return location.businessLocation.id ===
                    businessServiceLocation.businessLocation.id;
            })) {
            uniqueServiceLocations.push(businessServiceLocation);
        }
    });
    return uniqueServiceLocations;
}
exports.getAssignedBusinessLocations = getAssignedBusinessLocations;

function filterResources(offerings, categories, locations, settingsData, isMultiLocationEnabled) {
    if (isMultiLocationEnabled === void 0) {
        isMultiLocationEnabled = false;
    }
    var selectedResources = getSelectedResources(settingsData);
    var filterBy = isMultiLocationEnabled && settingsData ?
        settingsData.FILTER_BY :
        widget_1.FilterByOptions.BY_SERVICES;
    var selectedLocations = isMultiLocationEnabled && settingsData ?
        settingsData.SELECTED_LOCATIONS :
        [];
    var selectedOfferings = filterSelectedCatalogOfferings(offerings, filterBy, selectedResources, selectedLocations, isMultiLocationEnabled);
    var selectedCategories = filterOutEmptyCategories(categories, selectedOfferings);
    var selectedServiceLocations;
    if (isMultiLocationEnabled) {
        selectedServiceLocations = filterRelevantLocations(locations, selectedOfferings, settingsData);
    } else {
        selectedServiceLocations = [];
    }
    return {
        offerings: selectedOfferings,
        categories: selectedCategories,
        locations: selectedServiceLocations,
    };
}
exports.filterResources = filterResources;
//# sourceMappingURL=shared-utils.js.map