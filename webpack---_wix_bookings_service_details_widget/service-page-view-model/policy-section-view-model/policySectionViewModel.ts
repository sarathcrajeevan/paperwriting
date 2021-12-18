import { BusinessInfo } from '@wix/bookings-uou-types/dist/src';

export interface PolicySectionViewModel {
  cancellationPolicy?: string;
}
export const policySectionViewModelFactory = (
  businessInfo: BusinessInfo,
): PolicySectionViewModel => {
  return {
    cancellationPolicy: businessInfo?.cancellationPolicy,
  };
};
