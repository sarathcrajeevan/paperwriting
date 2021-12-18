import { CatalogServiceDto } from '@wix/bookings-uou-types/dist/src';

export interface DescriptionSectionViewModel {
  description: string;
  isBookable: boolean;
}
export const descriptionSectionViewModelFactory = (
  serviceDto: CatalogServiceDto,
  isBookable: boolean,
): DescriptionSectionViewModel => {
  return {
    description: serviceDto.info?.description,
    isBookable,
  };
};
