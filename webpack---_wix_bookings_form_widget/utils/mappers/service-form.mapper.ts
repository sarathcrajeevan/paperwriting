import { FormField } from '@wix/ambassador-services-catalog-server/types';
import { CatalogData } from '../../api/types';
import {
  DisplayPropertiesFieldOption,
  Operation,
  V2Rule,
} from '@wix/ambassador-wix-form-builder-web/types';
import {
  SlotAvailability,
  LocationType,
} from '@wix/ambassador-availability-calendar/types';
import {
  createAddressField,
  createFormField,
  getFieldType,
} from './service-form-field.mapper';
import {
  FormFieldViewInfoFieldType,
  FormView,
  Submission as FormSubmission,
  SubmissionValue,
} from '@wix/forms-ui/types';
import { BookingRequestKeyMappings } from './form-submission.mapper';
import { FieldLayout, TFunction } from '../../types/types';
import { PaidPlans } from '@wix/ambassador-checkout-server/types';

export enum ReservedFieldIds {
  SMS_REMINDER = 'sms-reminder-id',
}

export const createFormView = ({
  catalogData,
  availability,
  preFilledValues,
  pricingPlanDetails,
  t,
  isNameFieldDeprecationEnabled,
}: {
  catalogData: CatalogData;
  t: TFunction;
  availability?: SlotAvailability;
  pricingPlanDetails?: PaidPlans;
  preFilledValues?: FormSubmission;
  isNameFieldDeprecationEnabled?: boolean;
}): FormView => {
  const form = catalogData.service.form!;
  const { customFields = [] } = form;

  const { isSMSReminderEnabled, countryCode } = catalogData.businessInfo;
  const phoneFieldType = isSMSReminderEnabled
    ? FormFieldViewInfoFieldType.PHONE_COUNTRY_CODE
    : FormFieldViewInfoFieldType.PHONE;

  const maxParticipantsPerBooking =
    catalogData?.service?.service?.policy?.maxParticipantsPerBooking ?? 0;

  const availableSpots = availability?.openSpots ?? 0;
  const maxNumberOfParticipants = getMaxNumberOfParticipants({
    availableSpots,
    maxParticipantsPerBooking,
    pricingPlanDetails,
  });
  const numberOfParticipantsDefaultValue = 1;

  const nameField = isNameFieldDeprecationEnabled ? form.firstName : form.name;

  const fields = [
    createFormField({
      field: nameField,
      bookingsKeyMapping: {
        key: BookingRequestKeyMappings.FIRST_NAME,
      },
      fieldType: FormFieldViewInfoFieldType.TEXT,
      layout: FieldLayout.SHORT,
      displayProperties: {
        defaultValue: getDefaultValue(preFilledValues, nameField!.fieldId!),
      },
    }),
    ...(isNameFieldDeprecationEnabled && form.lastName
      ? [
          createFormField({
            field: form.lastName,
            bookingsKeyMapping: {
              key: BookingRequestKeyMappings.LAST_NAME,
            },
            fieldType: FormFieldViewInfoFieldType.TEXT,
            layout: FieldLayout.SHORT,
            displayProperties: {
              defaultValue: getDefaultValue(
                preFilledValues,
                form.lastName?.fieldId!,
              ),
            },
          }),
        ]
      : []),
    createFormField({
      field: form.email!,
      bookingsKeyMapping: {
        key: BookingRequestKeyMappings.EMAIL,
      },
      fieldType: FormFieldViewInfoFieldType.EMAIL,
      layout: FieldLayout.SHORT,
      displayProperties: {
        defaultValue: getDefaultValue(preFilledValues, form.email?.fieldId!),
      },
    }),
    createFormField({
      field: form.phone!,
      bookingsKeyMapping: {
        key: BookingRequestKeyMappings.PHONE,
      },
      fieldType: phoneFieldType,
      layout: isSMSReminderEnabled ? FieldLayout.LONG : FieldLayout.SHORT,
      displayProperties: {
        defaultValue: isSMSReminderEnabled
          ? {
              countryCode,
              phone: '',
            }
          : getDefaultValue(preFilledValues, form.phone?.fieldId!),
      },
    }),
    ...(isSMSReminderEnabled
      ? [
          createFormField({
            field: {
              label: t('app.booking-form.fields.sms-reminder.label'),
              fieldId: ReservedFieldIds.SMS_REMINDER,
            },
            bookingsKeyMapping: {
              key: BookingRequestKeyMappings.SMS_REMINDER,
            },
            fieldType: FormFieldViewInfoFieldType.CHECKBOX,
            displayProperties: {
              defaultValue: getDefaultValue(
                preFilledValues,
                ReservedFieldIds.SMS_REMINDER,
              ),
            },
          }),
        ]
      : []),
    ...(maxNumberOfParticipants > 1
      ? [
          createFormField({
            field: form.numberOfParticipants!,
            fieldType: FormFieldViewInfoFieldType.DROP_DOWN,
            bookingsKeyMapping: {
              key: BookingRequestKeyMappings.NO_OF_PARTICIPANTS,
            },
            displayProperties: {
              options: getNumberOfParticipantsOptions(maxNumberOfParticipants),
              defaultValue: String(
                Math.min(
                  Number(
                    getDefaultValue(
                      preFilledValues,
                      form.numberOfParticipants!.fieldId!,
                    ),
                  ) || numberOfParticipantsDefaultValue,
                  maxNumberOfParticipants,
                ),
              ),
            },
          }),
        ]
      : []),
    ...(shouldShowAddressField(availability) && form.address
      ? [createAddressField(form.address!, preFilledValues)]
      : []),
    ...customFields.map((field: FormField) => {
      const fieldType = getFieldType(field.valueType!);
      const layout =
        fieldType === FormFieldViewInfoFieldType.TEXT
          ? FieldLayout.SHORT
          : FieldLayout.LONG;
      return createFormField({
        field,
        fieldType,
        layout,
        displayProperties: {
          defaultValue: getDefaultValue(preFilledValues, field.fieldId!),
        },
      });
    }),
  ];

  const rule: V2Rule[] = [
    {
      enabled: isSMSReminderEnabled,
      condition: {
        eq: { fieldKey: ReservedFieldIds.SMS_REMINDER, value: true },
      },
      actions: [
        { fieldKeys: [form.phone!.fieldId!], operation: Operation.REQUIRED },
      ],
    },
  ];

  return {
    formId: form.id,
    fields,
    formViewInfo: {
      rule,
    },
  };
};

const shouldShowAddressField = (availability?: SlotAvailability) => {
  return availability?.slot?.location?.locationType === LocationType.CUSTOM;
};

const getNumberOfParticipantsOptions = (
  maxOption: number,
): DisplayPropertiesFieldOption[] => {
  return Array.from({ length: maxOption }, (_, key) => ({
    value: `${key + 1}`,
    label: `${key + 1}`,
  }));
};

const getMaxNumberOfParticipants = ({
  availableSpots,
  maxParticipantsPerBooking,
  pricingPlanDetails,
}: {
  maxParticipantsPerBooking: number;
  availableSpots: number;
  pricingPlanDetails?: PaidPlans;
}) => {
  const plansCreditRemains: Maybe<number[]> = pricingPlanDetails?.plans
    ?.filter((plan) => plan.creditRemain)
    .map((plan) => plan.creditRemain!);

  const plansMaxCredit = plansCreditRemains?.length
    ? Math.max(...plansCreditRemains!)
    : maxParticipantsPerBooking;

  return Math.min(maxParticipantsPerBooking, availableSpots, plansMaxCredit);
};

export const getDefaultValue = (
  preFilledValues: Maybe<FormSubmission>,
  fieldId: string,
): SubmissionValue => {
  return preFilledValues?.[fieldId];
};
