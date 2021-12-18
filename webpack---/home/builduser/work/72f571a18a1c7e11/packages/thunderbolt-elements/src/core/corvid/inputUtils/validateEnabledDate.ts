import {
  convertDateRangesArray,
  DateRange,
  isDateDisabled,
} from '../../commons/dateUtils';
import { ValidationData } from './inputValidationTypes';
import { addErrorToValidationDataAndKeepHtmlMessage } from '.';

export const validateEnabledDate = (
  props: {
    value?: string | Date;
    timeZone?: string | null;
    enabledDateRanges?: Array<DateRange<string>> | null;
    disabledDateRanges?: Array<DateRange<string>>;
    disabledDates?: Array<string>;
    disabledDaysOfWeek?: Array<number>;
    minDate?: string;
    maxDate?: string;
    allowPastDates?: boolean;
    allowFutureDates?: boolean;
  },
  validationData: ValidationData,
): ValidationData => {
  const { timeZone, disabledDaysOfWeek, allowPastDates, allowFutureDates } =
    props;

  if (!props.value) {
    return validationData;
  }
  const value =
    typeof props.value === 'string' ? new Date(props.value) : props.value;
  const enabledDateRanges = props.enabledDateRanges
    ? convertDateRangesArray(props.enabledDateRanges, date => new Date(date))
    : null;
  const disabledDateRanges = props.disabledDateRanges
    ? convertDateRangesArray(props.disabledDateRanges, date => new Date(date))
    : null;
  const disabledDates = props.disabledDates
    ? props.disabledDates.map(date => new Date(date))
    : null;
  const minDate = props.minDate ? new Date(props.minDate) : null;
  const maxDate = props.maxDate ? new Date(props.maxDate) : null;

  if (
    isDateDisabled(value, {
      enabledDateRanges,
      disabledDateRanges,
      disabledDates,
      minDate,
      maxDate,
      disabledDaysOfWeek,
      allowPastDates,
      allowFutureDates,
      timeZone,
    })
  ) {
    return addErrorToValidationDataAndKeepHtmlMessage(
      validationData,
      'invalidTime',
      {
        key: 'DATE_PICKER_INVALID_DATE',
      },
    );
  }
  return validationData;
};
