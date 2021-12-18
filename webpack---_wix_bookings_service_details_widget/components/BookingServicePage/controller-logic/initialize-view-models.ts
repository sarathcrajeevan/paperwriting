import {
  SchedulingLocationViewModel,
  schedulingLocationViewModelFactory,
} from '../../../service-page-view-model/scheduling-location-view-model/schedulingLocationViewModel';
import {
  ServicePageViewModel,
  servicePageViewModelFactory,
} from '../../../service-page-view-model/servicePageViewModel';
import {
  SchedulingTimezoneViewModel,
  schedulingTimezoneViewModelFactory,
} from '../../../service-page-view-model/shceduling-timezone-view-model/schedulingTimezoneViewModel';

export const initializeViewModels = ({
  config,
  t,
  experiments,
  selectedLocation,
  isSEO,
  isBookingCalendarInstalled,
}): {
  viewModel: ServicePageViewModel;
  locationViewModel: SchedulingLocationViewModel;
  timezoneViewModel: SchedulingTimezoneViewModel;
} => {
  const isUoUMultiLocationAllLocationsEnabled = experiments.enabled(
    'specs.bookings.UoUMultiLocationAllLocations',
  );
  const locationViewModel: SchedulingLocationViewModel =
    schedulingLocationViewModelFactory({
      serviceInfoDto: config.serviceDto.info,
      selectedLocation,
      isUoUMultiLocationAllLocationsEnabled,
      t,
    });
  const timezoneViewModel: SchedulingTimezoneViewModel =
    schedulingTimezoneViewModelFactory({
      businessInfo: config.businessInfo,
      isBookingCalendarInstalled,
    });
  const viewModel: ServicePageViewModel = servicePageViewModelFactory({
    config,
    t,
    experiments,
    viewTimezone: timezoneViewModel.viewTimezone,
    isSEO,
  });
  return {
    viewModel,
    locationViewModel,
    timezoneViewModel,
  };
};
