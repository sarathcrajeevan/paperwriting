import {
  DisplayProperties,
  FormFieldViewInfoFieldType,
  FormViewField,
  SubmissionValue,
  ValidationProperties,
} from '@wix/forms-ui/types';
import { getDefaultValue } from './service-form.mapper';
import {
  AddressFields,
  FormField,
  ValueType,
} from '@wix/ambassador-services-catalog-server/http';
import { BookingRequestKeyMappings } from './form-submission.mapper';
import { FieldLayout } from '../../types/types';

export type BookingsKeyMapping = {
  key: BookingRequestKeyMappings;
};

export const createFormField = ({
  fieldType,
  field,
  layout,
  bookingsKeyMapping,
  displayProperties,
}: {
  fieldType: FormFieldViewInfoFieldType;
  layout?: FieldLayout;
  field?: FormField;
  bookingsKeyMapping?: BookingsKeyMapping;
  validations?: ValidationProperties;
  displayProperties?: DisplayProperties;
}): FormViewField => {
  return {
    externalId: field?.fieldId,
    renderInfo: {
      type: fieldType,
      displayProperties: {
        ...getCheckboxDisplayProps({ field, fieldType }),
        label: field?.label?.trim(),
        ...displayProperties,
      },
      metadata: {
        ...(bookingsKeyMapping ? { bookingsKeyMapping } : {}),
        ...(layout
          ? {
              layout: { appearance: layout },
            }
          : {}),
      },
      validationProperties: {
        required: field?.userConstraints?.required,
      },
    },
  };
};

export const createAddressField = (
  addressField: AddressFields,
  preFilledValues?: {
    [k: string]: SubmissionValue;
  },
) => {
  return createFormField({
    fieldType: FormFieldViewInfoFieldType.MULTI_LINE_ADDRESS,
    field: { fieldId: BookingRequestKeyMappings.FULL_ADDRESS },
    bookingsKeyMapping: {
      key: BookingRequestKeyMappings.FULL_ADDRESS,
    },
    displayProperties: {
      multiLineAddressOptions: {
        state: createFormField({
          fieldType: FormFieldViewInfoFieldType.TEXT,
          field: addressField.state,
          displayProperties: {
            defaultValue: getDefaultValue(
              preFilledValues,
              addressField.state?.fieldId!,
            ),
          },
        }).renderInfo,
        city: createFormField({
          fieldType: FormFieldViewInfoFieldType.TEXT,
          field: addressField.city,
          displayProperties: {
            defaultValue: getDefaultValue(
              preFilledValues,
              addressField.city?.fieldId!,
            ),
          },
        }).renderInfo,
        streetLine1: createFormField({
          fieldType: FormFieldViewInfoFieldType.TEXT,
          field: addressField.street,
          displayProperties: {
            defaultValue: getDefaultValue(
              preFilledValues,
              addressField.street?.fieldId!,
            ),
          },
        }).renderInfo,
        streetLine2: createFormField({
          fieldType: FormFieldViewInfoFieldType.TEXT,
          field: addressField.floorNumber,
          displayProperties: {
            defaultValue: getDefaultValue(
              preFilledValues,
              addressField.floorNumber?.fieldId!,
            ),
          },
        }).renderInfo,
      },
      defaultValue: getDefaultValue(
        preFilledValues,
        BookingRequestKeyMappings.FULL_ADDRESS,
      ),
    },
  });
};

export const getFieldType = (valueType: ValueType) => {
  switch (valueType) {
    case ValueType.CHECK_BOX:
      return FormFieldViewInfoFieldType.CHECKBOX;
    case ValueType.LONG_TEXT:
      return FormFieldViewInfoFieldType.PARAGRAPH;
    case ValueType.SHORT_TEXT:
      return FormFieldViewInfoFieldType.TEXT;
    default:
      return FormFieldViewInfoFieldType.TEXT;
  }
};

const getCheckboxDisplayProps = ({
  field,
  fieldType,
}: {
  field?: FormField;
  fieldType: FormFieldViewInfoFieldType;
}) => {
  return fieldType === FormFieldViewInfoFieldType.CHECKBOX
    ? {
        checkboxOptions: {
          link: { url: field?.additionalLabels?.[0]?.linkLabel?.url },
          text: field?.additionalLabels?.[0]?.linkLabel?.label,
        },
      }
    : {};
};
