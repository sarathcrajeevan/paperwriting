import { ServiceInfoDto } from '@wix/bookings-uou-types';
import { ImageDto } from '@wix/bookings-uou-types/src/service-info.dto';

export interface GallerySectionViewModel {
  items: ImageDto[];
}

export const gallerySectionViewModelFactory = (
  serviceInfoDto: ServiceInfoDto,
): GallerySectionViewModel => {
  return {
    items: serviceInfoDto.media?.gallery || [],
  };
};
