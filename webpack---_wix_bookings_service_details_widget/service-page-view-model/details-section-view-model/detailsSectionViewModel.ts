import {
  CatalogServiceDto,
  BusinessInfo,
} from '@wix/bookings-uou-types/dist/src';
import {
  DurationMapper,
  DurationMapperOptions,
  PaymentDtoMapper,
} from '@wix/bookings-uou-mappers';
import { LocationMapper } from '../../mappers/location.mapper';

export interface DetailsSectionViewModel {
  duration?: string;
  durationAria?: string;
  price?: string;
  location?: string;
  locations?: string[];
  isBookable: boolean;
  ariaPrice?: string;
}

export const detailsSectionViewModelFactory = ({
  t,
  businessInfo,
  serviceDto,
  isBookable,
  viewTimezone,
  isFormatTimezoneDateByBOConfigurationOnClientSide,
  isShowSingleLocationInDetailsSectionEnabled,
}: {
  t: Function;
  businessInfo: BusinessInfo;
  serviceDto: CatalogServiceDto;
  isBookable: boolean;
  viewTimezone?: string;
  isFormatTimezoneDateByBOConfigurationOnClientSide?: boolean;
  isShowSingleLocationInDetailsSectionEnabled: boolean;
}): DetailsSectionViewModel => {
  const regionalSettingsLocale =
    businessInfo?.regionalSettingsLocale ?? 'en-US';
  const dateRegionalSettingsLocale =
    businessInfo?.dateRegionalSettingsLocale ?? 'en-US';
  const serviceType = serviceDto?.type;
  const isDurationVaries = serviceDto?.scheduleHeader?.isDurationVaries;
  const startDateAsUTC = serviceDto?.scheduleHeader?.startDateAsUTC;
  const durationInMinutes = serviceDto?.scheduleHeader?.durationInMinutes;
  const durationOptions: DurationMapperOptions = {
    hourUnit: 'duration.units.hours',
    hourAriaUnit: 'duration.units.aria-hours',
    minuteUnit: 'duration.units.minutes',
    minuteAriaUnit: 'duration.units.aria-minutes',
    durationVaries: 'duration.varies',
    coursePassedText: 'service.course.schedule.start-date-passed',
    courseInFutureText: 'service.course.schedule.start-date-in-future',
  };
  const durationMapper = new DurationMapper(
    dateRegionalSettingsLocale,
    durationOptions,
    t,
  );
  const duration = durationMapper.durationText({
    serviceType,
    isDurationVaries,
    startDateAsUTC,
    durationInMinutes,
    viewTimezone,
    isFormatTimezoneDateByBOConfigurationOnClientSide,
  });

  const durationAria = durationMapper.durationText({
    serviceType,
    isDurationVaries,
    startDateAsUTC,
    durationInMinutes,
    durationAria: true,
    viewTimezone,
    isFormatTimezoneDateByBOConfigurationOnClientSide,
  });

  const paymentDtoMapper = new PaymentDtoMapper(regionalSettingsLocale);
  const price = paymentDtoMapper.priceText(serviceDto?.payment);
  const ariaPrice = paymentDtoMapper.priceText(serviceDto?.payment, 'name');

  const clientLocationText = t('service.location.customer-place');
  const locationMapper = new LocationMapper(clientLocationText);
  const location = locationMapper.text({
    serviceLocation: serviceDto.info?.location,
  });

  const serviceDtoLocations = serviceDto.info?.locations;
  const useBusinessName = isShowSingleLocationInDetailsSectionEnabled
    ? !!serviceDtoLocations?.length
    : serviceDtoLocations?.length !== 1;
  const locations = serviceDtoLocations
    ?.map((serviceLocation) =>
      locationMapper.text({
        serviceLocation,
        useBusinessName,
      }),
    )
    .filter((serviceLocation) => !!serviceLocation);

  return {
    duration,
    durationAria,
    price,
    location,
    locations,
    isBookable,
    ariaPrice,
  };
};
