import { BookingPolicyDto } from '../../types/shared-types';
import { CatalogServiceDto } from '@wix/bookings-uou-types/dist/src';

export interface BodyViewModel {
  messageType?: AVAILABILITY_MESSAGE_TYPE;
  isBookable: boolean;
  timeUntilServiceIsOpen: string;
  serviceName: string;
}

// https://stackoverflow.com/questions/63961803/eslint-says-all-enums-in-typescript-app-are-already-declared-in-the-upper-scope
// eslint-disable-next-line no-shadow
export enum AVAILABILITY_MESSAGE_TYPE {
  FULLY_BOOKED = 'FULLY_BOOKED',
  TOO_EARLY = 'TOO_EARLY',
  TOO_LATE = 'TOO_LATE',
  STARTED_AND_BOOKABLE = 'STARTED_AND_BOOKABLE',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
}

export const bodyViewModelFactory = ({
  bookingPolicyDto,
  serviceDto,
  couseStartedAndBookableExperiment,
}: {
  bookingPolicyDto: BookingPolicyDto;
  serviceDto: CatalogServiceDto;
  couseStartedAndBookableExperiment?: boolean;
}): BodyViewModel => {
  const messageType = getAvailabilityMessageType(
    bookingPolicyDto,
    couseStartedAndBookableExperiment,
  );
  const isAvailableService =
    !messageType ||
    (!!couseStartedAndBookableExperiment &&
      bookingPolicyDto.isServiceStartedAndBookable);
  return {
    messageType,
    isBookable: bookingPolicyDto.isBookable && isAvailableService,
    timeUntilServiceIsOpen: bookingPolicyDto.timeUntilServiceIsOpen,
    serviceName: serviceDto.info.name,
  };
};

const getAvailabilityMessageType = (
  bookingPolicyDto: BookingPolicyDto,
  couseStartedAndBookableExperiment,
): AVAILABILITY_MESSAGE_TYPE | undefined => {
  if (bookingPolicyDto.isBookable) {
    if (bookingPolicyDto.isFullyBooked) {
      return AVAILABILITY_MESSAGE_TYPE.FULLY_BOOKED;
    } else if (bookingPolicyDto.isTooEarlyToBook) {
      return AVAILABILITY_MESSAGE_TYPE.TOO_EARLY;
    } else if (bookingPolicyDto.isTooLateToBook) {
      return AVAILABILITY_MESSAGE_TYPE.TOO_LATE;
    } else if (!bookingPolicyDto.isServiceAvailable) {
      return AVAILABILITY_MESSAGE_TYPE.NOT_AVAILABLE;
    } else if (
      couseStartedAndBookableExperiment &&
      bookingPolicyDto.isServiceStartedAndBookable
    ) {
      return AVAILABILITY_MESSAGE_TYPE.STARTED_AND_BOOKABLE;
    }
  }
};
