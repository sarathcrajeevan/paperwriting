import { TFunction } from '../../controller';
import { Optional } from '../../../../types/types';

export type EmptyStateViewModel = {
  title: string;
  subtitle: string;
};

export enum EmptyStateType {
  SERVICE_NOT_FOUND = 'SERVICE_NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  GET_BOOKING_DETAILS_ERROR = 'GET_BOOKING_DETAILS_ERROR',
  GET_BOOKING_DETAILS_ACCESS_DENIED = 'GET_BOOKING_DETAILS_ACCESS_DENIED',
}

export function createEmptyStateViewModel({
  t,
  type,
}: {
  t: TFunction;
  type: EmptyStateType;
}): Optional<EmptyStateViewModel> {
  switch (type) {
    case EmptyStateType.SERVICE_NOT_FOUND:
      return {
        title: t('app.empty-state.no-service.title'),
        subtitle: t('app.empty-state.no-service.subtitle'),
      };
    case EmptyStateType.SERVER_ERROR:
      return {
        title: t('app.empty-state.server-error.title'),
        subtitle: t('app.empty-state.server-error.subtitle'),
      };
    case EmptyStateType.GET_BOOKING_DETAILS_ERROR:
      return {
        title: t('app.empty-state.booking-details-error.title'),
        subtitle: t('app.empty-state.booking-details-error.subtitle'),
      };
    case EmptyStateType.GET_BOOKING_DETAILS_ACCESS_DENIED:
      return {
        title: t('app.empty-state.booking-details-access-denied.title'),
        subtitle: t('app.empty-state.booking-details-access-denied.subtitle'),
      };
  }
}
