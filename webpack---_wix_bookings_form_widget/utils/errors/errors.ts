import {
  BookErrorType,
  BookingsErrorCodes,
  CouponsErrorType,
  CreateBookingErrorType,
  FormErrors,
  GenericErrorType,
} from '../../types/errors';
import { PlatformServerError } from '../../../__tests__/mocks/ambassador/mockPlatformError';

export const getErrorByType = <ErrorType>({
  errorType,
  errors,
}: {
  errorType: ErrorType;
  errors: FormErrors[];
}): ErrorType[keyof ErrorType] => {
  return Object.values(errorType).find((error) =>
    errors.includes(error as FormErrors),
  ) as ErrorType[keyof ErrorType];
};

const isErrorOfType = <ErrorType>(errorType: ErrorType, error: FormErrors) => {
  return Object.values(errorType).some(
    (expectedError) => error === expectedError,
  );
};

export const hasErrorOfType = <ErrorType>({
  errorType,
  errors,
}: {
  errorType: ErrorType;
  errors: FormErrors[];
}): boolean => {
  return errors.some((error) => isErrorOfType(errorType, error));
};

export function mapCouponServerError(
  couponServerError: string,
): CouponsErrorType {
  if (couponServerError.includes('id is not a valid GUID')) {
    return CouponsErrorType.NOT_VALID_FOR_SELECTED_SERVICE;
  } else if (couponServerError.includes('ERROR_COUPON_HAS_EXPIRED')) {
    return CouponsErrorType.COUPON_HAS_EXPIRED;
  } else if (couponServerError.includes('ERROR_COUPON_USAGE_EXCEEDED')) {
    return CouponsErrorType.COUPON_USAGE_EXCEEDED;
  } else if (couponServerError.includes('ERROR_COUPON_SERVICE_UNAVAILABLE')) {
    return CouponsErrorType.COUPON_SERVICE_UNAVAILABLE;
  } else if (couponServerError.includes('ERROR_COUPON_DOES_NOT_EXIST')) {
    return CouponsErrorType.COUPON_DOES_NOT_EXIST;
  } else if (
    couponServerError.includes('ERROR_COUPON_LIMIT_PER_CUSTOMER_EXCEEDED')
  ) {
    return CouponsErrorType.COUPON_LIMIT_PER_CUSTOMER_EXCEEDED;
  }
  return CouponsErrorType.GENERAL_SERVER_ERROR;
}

export type BookingsServerError = {
  details: {
    applicationError: {
      code: string;
    };
  };
};

export function mapBookingsServerError(error: BookingsServerError | any) {
  const serverErrorCode = error?.details?.applicationError?.code;
  const mappedErrorByType =
    mappedNotificationErrorCodesToErrorTypes[
      serverErrorCode as BookingsErrorCodes
    ];
  if (mappedErrorByType) {
    return mappedErrorByType;
  }
  return GenericErrorType.GENERIC_BOOK_ERROR;
}

export function mapCheckoutBookingError(error: PlatformServerError) {
  const errorCode = error?.details?.applicationError?.code;
  if (
    isErrorOfType(CouponsErrorType, errorCode as FormErrors) ||
    isErrorOfType(CreateBookingErrorType, errorCode as FormErrors)
  ) {
    return errorCode;
  }
  return GenericErrorType.GENERIC_BOOK_ERROR;
}

export const mappedNotificationErrorCodesToErrorTypes = {
  [BookingsErrorCodes.BOOKING_POLICY_VIOLATION]:
    BookErrorType.BOOKING_POLICY_VIOLATION,
  [BookingsErrorCodes.SLOT_NOT_AVAILABLE]: BookErrorType.SLOT_NOT_AVAILABLE,
  [BookingsErrorCodes.CANT_BOOK_CANCELED_SESSION]:
    BookErrorType.CANT_BOOK_CANCELED_SESSION,
  [BookingsErrorCodes.SESSION_TIME_MISMATCH]:
    BookErrorType.SESSION_TIME_MISMATCH,
  [BookingsErrorCodes.EXCEEDED_ALLOWED_MAX_NUMBER_OF_PARTICIPANTS]:
    GenericErrorType.EXCEEDED_ALLOWED_MAX_NUMBER_OF_PARTICIPANTS,
  [BookingsErrorCodes.SESSION_CAPACITY_EXCEEDED]:
    GenericErrorType.SESSION_CAPACITY_EXCEEDED,
  [BookingsErrorCodes.COUPON_LIMIT_PER_CUSTOMER_EXCEEDED]:
    CouponsErrorType.COUPON_LIMIT_PER_CUSTOMER_EXCEEDED,
};
