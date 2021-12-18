import { CatalogServiceDto } from '@wix/bookings-uou-types/dist/src';

export interface BookButtonViewModel {
  isPendingApprovalFlow?: boolean;
}
export const bookButtonViewModelFactory = (
  serviceDto: CatalogServiceDto,
): BookButtonViewModel => {
  return {
    isPendingApprovalFlow: serviceDto?.schedulePolicy?.isPendingApprovalFlow,
  };
};
