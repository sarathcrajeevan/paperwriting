import {
  CatalogServiceDto,
  ConferencePlatform,
} from '@wix/bookings-uou-types/dist/src';

export interface TitleAndTaglineViewModel {
  title: string;
  tagline?: string;
  onlineProvider?: ConferencePlatform;
}

export const titleAndTaglineViewModelFactory = (
  serviceDto: CatalogServiceDto,
): TitleAndTaglineViewModel => {
  return {
    title: serviceDto.info?.name,
    tagline: serviceDto.info?.tagLine,
    onlineProvider: serviceDto.schedulePolicy?.conferenceProvider?.platform,
  };
};
