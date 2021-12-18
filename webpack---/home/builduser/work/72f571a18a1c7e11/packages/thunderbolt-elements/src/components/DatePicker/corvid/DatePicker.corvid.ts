import {
  withValidation,
  composeSDKFactories,
  reportError,
  messageTemplates,
  assert,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations';
import {
  IDatePickerProps,
  IDatePickerOwnSDKFactory,
  IDatePickerSDK,
  IDatePickerImperativeActions,
} from '../DatePicker.types';
import {
  readOnlyPropsSDKFactory,
  createValidationPropsSDKFactory,
  createRequiredPropsSDKFactory,
  focusPropsSDKFactory,
  disablePropsSDKFactory,
  clickPropsSDKFactory,
  changePropsSDKFactory,
  createElementPropsSDKFactory,
  toJSONBase,
} from '../../../core/corvid/props-factories';
import {
  createInputValidator,
  InputValidator,
  composeValidators,
  validateRequired,
  validateEnabledDate,
} from '../../../core/corvid/inputUtils';
import { DatePickerDate, TimeZone } from '../DatePickerDate';
import {
  convertDateRangesArray,
  DateRange,
} from '../../../core/commons/dateUtils';

const datePickerValidator: InputValidator<
  IDatePickerProps,
  IDatePickerImperativeActions
> = createInputValidator(
  composeValidators<IDatePickerProps>([validateRequired, validateEnabledDate]),
);

const validationPropsSDKFactory = createValidationPropsSDKFactory<
  IDatePickerProps,
  IDatePickerImperativeActions
>(datePickerValidator);

const requiredPropsSDKFactory = createRequiredPropsSDKFactory<
  IDatePickerProps,
  IDatePickerImperativeActions
>(datePickerValidator);

const _ownSDKFactory: IDatePickerOwnSDKFactory = api => {
  const { props, setProps, metaData } = api;

  const sdkProps = {
    get timeZone() {
      return props.timeZone;
    },
    set timeZone(timeZoneIANA) {
      if (timeZoneIANA === null || TimeZone.isTimeZoneValid(timeZoneIANA)) {
        setProps({
          timeZone: timeZoneIANA,
        });
      } else {
        reportError(
          messageTemplates.error_bad_iana_timezone({
            timeZoneIANA: timeZoneIANA || '',
          }),
        );
      }
    },
    get value() {
      const timeZone = props.timeZone;

      if (props.useTodayAsDefaultValue && !props.value) {
        return new DatePickerDate({
          type: 'Now',
          timeZone: timeZone || 'Local',
        }).getAsDate(timeZone || 'Local');
      }

      if (props.value && timeZone) {
        return new DatePickerDate({
          type: 'Date',
          date: props.value,
          timeZone: 'Local',
        }).getAsDate(timeZone);
      } else {
        return props.value || null;
      }
    },
    set value(value) {
      const timeZone = props.timeZone;

      if (value && timeZone) {
        value = new DatePickerDate({
          type: 'Date',
          date: new Date(value),
          timeZone,
        }).getAsDate('Local');
      }

      if (value) {
        setProps({
          value: new Date(value),
        });
      } else {
        // Don't render today's date if value was resetted by user
        setProps({
          value,
          useTodayAsDefaultValue: false,
        });
      }

      datePickerValidator.validate({
        viewerSdkAPI: api,
        showValidityIndication: true,
      });
    },
    get maxDate() {
      const timeZone = props.timeZone;
      let maxDate = props.maxDate ? new Date(props.maxDate) : null;

      if (maxDate && timeZone) {
        maxDate = new DatePickerDate({
          type: 'Date',
          date: maxDate,
          timeZone: 'Local',
        }).getAsDate(timeZone);
      }

      return maxDate;
    },
    set maxDate(maxDate) {
      const timeZone = props.timeZone;

      if (maxDate && timeZone) {
        maxDate = new DatePickerDate({
          type: 'Date',
          date: maxDate,
          timeZone,
        }).getAsDate('Local');
      }

      setProps({
        maxDate: maxDate?.toISOString(),
      });
    },
    get minDate() {
      const timeZone = props.timeZone;
      let minDate = props.minDate ? new Date(props.minDate) : null;

      if (minDate && timeZone) {
        minDate = new DatePickerDate({
          type: 'Date',
          date: minDate,
          timeZone: 'Local',
        }).getAsDate(timeZone);
      }

      return minDate;
    },
    set minDate(minDate) {
      const timeZone = props.timeZone;

      if (minDate && timeZone) {
        minDate = new DatePickerDate({
          type: 'Date',
          date: minDate,
          timeZone,
        }).getAsDate('Local');
      }

      setProps({
        minDate: minDate?.toISOString(),
      });
    },
    get disabledDates() {
      const timeZone = props.timeZone;
      let disabledDates = props.disabledDates.map(date => new Date(date));

      if (disabledDates && timeZone) {
        disabledDates = disabledDates.map(date =>
          new DatePickerDate({
            type: 'Date',
            date,
            timeZone: 'Local',
          }).getAsDate(timeZone),
        );
      }

      return disabledDates;
    },
    set disabledDates(disabledDates) {
      const timeZone = props.timeZone;

      if (disabledDates && timeZone) {
        disabledDates = disabledDates.map(date =>
          new DatePickerDate({
            type: 'Date',
            date,
            timeZone,
          }).getAsDate('Local'),
        );
      }

      setProps({
        disabledDates: (disabledDates || []).map(date => date.toISOString()),
      });
    },
    get enabledDateRanges() {
      const timeZone = props.timeZone;
      let enabledDateRanges = props.enabledDateRanges
        ? convertDateRangesArray(
            props.enabledDateRanges,
            date => new Date(date),
          )
        : null;

      if (enabledDateRanges && timeZone) {
        enabledDateRanges = convertDateRangesArray(enabledDateRanges, date =>
          new DatePickerDate({
            type: 'Date',
            date,
            timeZone: 'Local',
          }).getAsDate(timeZone),
        );
      }

      return enabledDateRanges;
    },
    set enabledDateRanges(enabledDateRanges) {
      const timeZone = props.timeZone;

      if (enabledDateRanges && timeZone) {
        enabledDateRanges = convertDateRangesArray(enabledDateRanges, date =>
          new DatePickerDate({
            type: 'Date',
            date,
            timeZone,
          }).getAsDate('Local'),
        );
      }

      setProps({
        enabledDateRanges: enabledDateRanges
          ? convertDateRangesArray(enabledDateRanges, date =>
              date.toISOString(),
            )
          : null,
      });
    },
    get disabledDateRanges() {
      const timeZone = props.timeZone;
      let disabledDateRanges = convertDateRangesArray(
        props.disabledDateRanges,
        date => new Date(date),
      );

      if (timeZone) {
        disabledDateRanges = convertDateRangesArray(disabledDateRanges, date =>
          new DatePickerDate({
            type: 'Date',
            date,
            timeZone: 'Local',
          }).getAsDate(timeZone),
        );
      }

      return disabledDateRanges;
    },
    set disabledDateRanges(disabledDateRanges) {
      const timeZone = props.timeZone;

      if (disabledDateRanges && timeZone) {
        disabledDateRanges = convertDateRangesArray(disabledDateRanges, date =>
          new DatePickerDate({
            type: 'Date',
            date,
            timeZone,
          }).getAsDate('Local'),
        );
      }

      setProps({
        disabledDateRanges: disabledDateRanges
          ? convertDateRangesArray(disabledDateRanges, date =>
              date.toISOString(),
            )
          : [],
      });
    },
    get disabledDaysOfWeek() {
      return props.disabledDaysOfWeek;
    },
    set disabledDaysOfWeek(disabledDaysOfWeek) {
      setProps({
        disabledDaysOfWeek: disabledDaysOfWeek || [],
      });
    },
    get dateFormat() {
      return props.dateFormat;
    },
    set dateFormat(dateFormat) {
      setProps({
        dateFormat,
      });
    },
    toJSON() {
      const { readOnly, required } = props;
      const {
        value,
        maxDate,
        minDate,
        disabledDates,
        disabledDaysOfWeek,
        timeZone,
        dateFormat,
        enabledDateRanges,
        disabledDateRanges,
      } = sdkProps;
      return {
        ...toJSONBase(metaData),
        readOnly,
        required,
        value,
        maxDate,
        minDate,
        disabledDates,
        enabledDateRanges,
        disabledDateRanges,
        disabledDaysOfWeek,
        timeZone,
        dateFormat,
      };
    },
  };

  return sdkProps;
};

const ownSDKFactory = withValidation(
  _ownSDKFactory,
  {
    type: ['object'],
    properties: {
      timeZone: {
        type: ['string', 'nil'],
      },
      value: {
        type: ['date', 'nil'],
      },
      maxDate: {
        type: ['date', 'nil'],
      },
      minDate: {
        type: ['date', 'nil'],
      },
      disabledDates: {
        type: ['array', 'nil'],
        items: {
          type: ['date', 'nil'],
          warnIfNil: true,
        },
      },
      enabledDateRanges: {
        type: ['array', 'nil'],
        items: {
          type: ['object'],
          properties: {
            startDate: { type: ['date'] },
            endDate: { type: ['date'] },
          },
          required: ['startDate', 'endDate'],
        },
      },
      disabledDateRanges: {
        type: ['array', 'nil'],
        items: {
          type: ['object'],
          properties: {
            startDate: { type: ['date'] },
            endDate: { type: ['date'] },
          },
          required: ['startDate', 'endDate'],
        },
        warnIfNil: true,
      },
      disabledDaysOfWeek: {
        type: ['array', 'nil'],
        items: {
          type: ['number', 'nil'],
          enum: [0, 1, 2, 3, 4, 5, 6],
          warnIfNil: true,
        },
      },
      dateFormat: {
        type: ['string'],
        enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY/MM/DD', 'YYYY/M/D'],
      },
    },
  },
  {
    enabledDateRanges: [
      (
        enabledDateRanges: Array<DateRange<Date>> | null | undefined,
      ): boolean => {
        if (assert.isNil(enabledDateRanges)) {
          return true;
        }

        return validateDateRangeArray({
          rangeArray: enabledDateRanges,
          propertyName: 'enabledDateRanges',
        });
      },
    ],
    disabledDateRanges: [
      (
        disabledDateRanges: Array<DateRange<Date>> | null | undefined,
      ): boolean => {
        if (assert.isNil(disabledDateRanges)) {
          return true;
        }

        return validateDateRangeArray({
          rangeArray: disabledDateRanges,
          propertyName: 'disabledDateRanges',
        });
      },
    ],
  },
);

const validateDateRangeArray = ({
  rangeArray,
  propertyName,
}: {
  rangeArray: Array<DateRange<Date>>;
  propertyName: string;
}) => {
  for (let index = 0; index < rangeArray.length; index++) {
    const range = rangeArray[index];

    if (!(range.startDate <= range.endDate)) {
      reportError(
        messageTemplates.error_object_bad_format_with_index({
          keyName: 'startDate',
          propertyName,
          index,
          functionName: `set ${propertyName}`,
          wrongValue: `"${range.startDate}"`,
          message: `Start date can not be greater than the end date which is "${range.endDate}"`,
        }),
      );

      return false;
    }
  }

  return true;
};

const useHiddenCollapsed = true;
const hasPortal = true;
const elementPropsSDKFactory = createElementPropsSDKFactory({
  useHiddenCollapsed,
  hasPortal,
});

export const sdk = composeSDKFactories<IDatePickerProps, IDatePickerSDK, any>(
  elementPropsSDKFactory,
  disablePropsSDKFactory,
  focusPropsSDKFactory,
  readOnlyPropsSDKFactory,
  clickPropsSDKFactory,
  requiredPropsSDKFactory,
  validationPropsSDKFactory,
  changePropsSDKFactory,
  ownSDKFactory,
);

export default createComponentSDKModel(sdk);
