import { CatalogServiceDto, ImageDto } from '@wix/bookings-uou-types/dist/src';

export interface HeaderViewModel {
  title: string;
  image?: ImageDto;
  isBookable: boolean;
  isSEO?: boolean;
}

export const headerViewModelFactory = (
  serviceDto: CatalogServiceDto,
  isBookable: boolean,
  isBookingsClientGalleryEnabled: boolean,
  isSEO?: boolean,
): HeaderViewModel => {
  return {
    title: serviceDto.info.name,
    image:
      isBookingsClientGalleryEnabled && serviceDto.info.media
        ? serviceDto.info.media.coverMedia
        : serviceDto.info.images[0],
    isBookable,
    isSEO,
  };
};
