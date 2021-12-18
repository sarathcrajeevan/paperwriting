import {
  FormFieldViewInfoFieldType,
  FormView,
  FormViewField,
  MultiLineAddressOptions,
  Submission,
  SubmissionResponse,
  SubmissionValue,
} from '@wix/forms-ui/types';
import { FormInfo } from '@wix/ambassador-bookings-server/types';
import { ContactDetails, CustomFormField } from '@wix/ambassador-gateway/types';
import { Service } from './service.mapper';
import { BookingsKeyMapping } from './service-form-field.mapper';
import { Member } from '@wix/ambassador-members-ng-api/types';
import { BusinessInfo } from '../../types/types';
import { isFixedPrice } from '../payment/payment';

export type OnSubmit = (submission: SubmissionResponse) => void;

export enum BookingRequestKeyMappings {
  ADDRESS = 'address',
  CONTACT_ID = 'contactId',
  COUNTRY_CODE = 'countryCode',
  EMAIL = 'email',
  FIRST_NAME = 'firstName',
  FULL_ADDRESS = 'fullAddress',
  LAST_NAME = 'lastName',
  PHONE = 'phone',
  TIMEZONE = 'timeZone',
  NO_OF_PARTICIPANTS = 'noOfParticipants',
  SMS_REMINDER = 'smsReminder',
}

function getFieldIdByBookingKeyMap(
  formSchema: FormView,
): {
  [key: string]: string | undefined;
} {
  return (
    formSchema?.fields?.reduce<{
      [key: string]: string | undefined;
    }>((keyMap, field) => {
      const bookingsKeyMapping: BookingRequestKeyMappings =
        field?.renderInfo?.metadata?.bookingsKeyMapping?.key;
      const id = field.externalId;
      return {
        ...keyMap,
        [bookingsKeyMapping]: id,
      };
    }, {}) ?? {}
  );
}

function getPhoneFieldValue(member: Member, formSchema: FormView) {
  const phoneField = getFieldFromSchema(
    formSchema,
    BookingRequestKeyMappings.PHONE,
  );
  const phoneNumber = member.contact?.phones?.[0];
  const isPhoneWithCountryCodeField =
    phoneField?.renderInfo?.type ===
    FormFieldViewInfoFieldType.PHONE_COUNTRY_CODE;
  if (!isPhoneWithCountryCodeField) {
    return phoneNumber;
  }
  return undefined;
}

function getMemberDetailsByBookingKeyMap(
  member: Member,
  formSchema: FormView,
): {
  [key: string]: any;
} {
  const memberAddress = member?.contact?.addresses?.[0];

  const mappedAddress = memberAddress
    ? {
        state: memberAddress.subdivision,
        city: memberAddress.city,
        streetLine1: memberAddress.addressLine,
        streetLine2: memberAddress.addressLine2,
      }
    : undefined;

  return {
    [BookingRequestKeyMappings.EMAIL]: member.contact?.emails?.[0],
    [BookingRequestKeyMappings.PHONE]: getPhoneFieldValue(member, formSchema),
    [BookingRequestKeyMappings.FIRST_NAME]: member.contact?.firstName,
    [BookingRequestKeyMappings.LAST_NAME]: member.contact?.lastName,
    [BookingRequestKeyMappings.FULL_ADDRESS]: mappedAddress,
  };
}

type DisplayProperties = {
  [externalId: string]: {
    value?: SubmissionValue;
    disabled?: boolean;
  };
};

export function mapMemberDetailsToDisplayPropertiesValues(
  bookingKeys: BookingRequestKeyMappings[],
  formSchema: FormView,
  member: Member,
  overrideDefaultFieldsValues = false,
) {
  const bookingsKeyToFieldId = getFieldIdByBookingKeyMap(formSchema);
  const bookingsKeyToMemberDetails = getMemberDetailsByBookingKeyMap(
    member,
    formSchema,
  );
  return bookingKeys.reduce<DisplayProperties>(
    (displayProperties: DisplayProperties, bookingKey) => {
      const fieldId = bookingsKeyToFieldId[bookingKey];
      const memberDetail = bookingsKeyToMemberDetails[bookingKey] || '';
      const isPhoneWithCountryCodeField =
        getFieldFromSchema(formSchema, bookingKey)?.renderInfo?.type ===
        FormFieldViewInfoFieldType.PHONE_COUNTRY_CODE;
      const isEmailField = bookingKey === BookingRequestKeyMappings.EMAIL;

      const shouldOverrideDefaultValue =
        overrideDefaultFieldsValues ||
        isEmailField ||
        !fieldHasDefaultValue(formSchema, bookingKey);
      const shouldApplyMemberDetail =
        fieldId && shouldOverrideDefaultValue && !isPhoneWithCountryCodeField;
      return {
        ...displayProperties,
        ...(shouldApplyMemberDetail
          ? {
              [fieldId!]: {
                value: memberDetail,
                ...(isEmailField ? { readonly: true } : {}),
              },
            }
          : {}),
      };
    },
    {},
  );
}

function getSubmissionValue(
  submission: {
    [k: string]: SubmissionValue;
  },
  field: FormViewField,
) {
  if (
    typeof submission[field.externalId!] === 'boolean' &&
    !isSmsReminderField(field)
  ) {
    return submission[field.externalId!]!.toString();
  }
  return submission[field.externalId!];
}

export function mapSubmissionToPartialBookRequest(
  submission: {
    [k: string]: SubmissionValue;
  },
  service: Service,
  businessInfo: BusinessInfo,
): { formInfo: FormInfo; sendSmsReminder: boolean } {
  const { formSchema } = service;
  const formInfo: FormInfo = createBaseFormInfo(service);
  let sendSmsReminder = false;
  formSchema!.fields!.forEach((field) => {
    const value = getSubmissionValue(submission, field);
    if (value) {
      if (isNoOfParticipants(field)) {
        setNoOfParticipants(formInfo, Number(value));
      } else if (isSmsReminderField(field)) {
        sendSmsReminder = Boolean(value);
      } else if (isContactInfoField(field)) {
        appendContactInfoField(
          formInfo.contactDetails!,
          businessInfo,
          field,
          value,
        );
      } else {
        appendCustomField(formInfo.customFormFields!, field, value);
      }
    }
  });
  return { formInfo, sendSmsReminder };
}

export function mapFormSubmission(
  submission: Submission,
  service: Service,
  businessInfo: BusinessInfo,
): {
  contactDetails: ContactDetails;
  additionalFields: CustomFormField[];
  sendSmsReminder: boolean;
  numberOfParticipants: number;
} {
  const { formSchema } = service;
  const additionalFields: CustomFormField[] = [];
  const contactDetails: ContactDetails = {};
  let sendSmsReminder = false;
  let numberOfParticipants = 1;
  formSchema!.fields!.forEach((field) => {
    const value = getSubmissionValue(submission, field);
    if (value) {
      if (isNoOfParticipants(field)) {
        numberOfParticipants = Number(value);
      } else if (isSmsReminderField(field)) {
        sendSmsReminder = Boolean(value);
      } else if (isContactInfoField(field)) {
        appendContactInfoField(contactDetails, businessInfo, field, value);
      } else {
        appendAdditionalField(additionalFields, field, value);
      }
    }
  });

  return {
    contactDetails,
    additionalFields,
    sendSmsReminder,
    numberOfParticipants,
  };
}

export enum RateLabels {
  GENERAL = 'general',
}

function createBaseFormInfo(service: Service): FormInfo {
  return {
    customFormFields: {},
    contactDetails: {},
    paymentSelection: [
      {
        numberOfParticipants: 1,
        ...(isFixedPrice(service.payment)
          ? { rateLabel: RateLabels.GENERAL }
          : {}),
      },
    ],
  };
}

function isContactInfoField(field: FormViewField) {
  return !!field?.renderInfo?.metadata?.bookingsKeyMapping;
}

function appendContactInfoField(
  contactDetails: ContactDetails,
  businessInfo: BusinessInfo,
  field: FormViewField,
  value: any,
) {
  const bookingsKeyMapping: BookingsKeyMapping =
    field?.renderInfo?.metadata?.bookingsKeyMapping;
  contactDetails[bookingsKeyMapping.key as keyof ContactDetails] =
    mapFormValueToContactInfoProperty?.[bookingsKeyMapping.key]?.(
      value,
      businessInfo,
    ) ?? value;
}

function appendAdditionalField(
  additionalFields: CustomFormField[],
  field: FormViewField,
  value: any,
) {
  additionalFields.push({
    id: field.externalId,
    value: String(value),
  });
}

function isNoOfParticipants(field: FormViewField) {
  const bookingsKeyMapping: BookingsKeyMapping =
    field?.renderInfo?.metadata?.bookingsKeyMapping;
  return (
    bookingsKeyMapping?.key === BookingRequestKeyMappings.NO_OF_PARTICIPANTS
  );
}

function isSmsReminderField(field: FormViewField) {
  const bookingsKeyMapping: BookingsKeyMapping =
    field?.renderInfo?.metadata?.bookingsKeyMapping;
  return bookingsKeyMapping?.key === BookingRequestKeyMappings.SMS_REMINDER;
}

function setNoOfParticipants(formInfo: FormInfo, noOfParticipants: number) {
  formInfo!.paymentSelection!.find(
    (payment) => payment.numberOfParticipants,
  )!.numberOfParticipants = noOfParticipants;
}

function appendCustomField(
  customFormFields: { [key: string]: string },
  field: FormViewField,
  value: any,
) {
  customFormFields[field.externalId!] = value;
}

const filterUndefined = (value: any) => !!value;

export const trimPhoneValue = (phone: string) =>
  phone.replace(/[\s\+\-\(\)\.+]/g, '');

export const mapFormValueToContactInfoProperty: {
  [key in BookingRequestKeyMappings]?: (
    value: any,
    businessInfo: BusinessInfo,
  ) => any;
} = {
  phone: (
    value: string | { countryCode: string; prefix: string; phone: string },
  ) => {
    if (typeof value === 'object') {
      const { prefix, phone } = value;
      return `${prefix}${trimPhoneValue(phone)}`;
    }
    return trimPhoneValue(value);
  },
  fullAddress: (
    value: { [key in keyof MultiLineAddressOptions]: string },
    businessInfo,
  ) => {
    const { state, city, streetLine1, streetLine2 } = value;
    const isInJapanese = businessInfo.language === 'ja';
    const formattedAddress = isInJapanese
      ? `${[state, city, streetLine1].filter(filterUndefined).join('')}${
          streetLine2 ? ` ${streetLine2}` : ''
        }`
      : [streetLine1, streetLine2, city, state]
          .filter(filterUndefined)
          .join(', ');

    return {
      subdivision: state,
      city,
      addressLine: streetLine1,
      addressLine2: streetLine2,
      formattedAddress,
    };
  },
};

export function getFieldFromSchema(
  formSchema: FormView,
  bookingKey: BookingRequestKeyMappings,
) {
  return formSchema.fields?.find(
    (field) =>
      field.renderInfo?.metadata?.bookingsKeyMapping?.key === bookingKey,
  );
}

function fieldHasDefaultValue(
  formSchema: FormView,
  bookingKey: BookingRequestKeyMappings,
) {
  const defaultValue = getFieldFromSchema(formSchema, bookingKey)?.renderInfo
    ?.displayProperties?.defaultValue;
  return defaultValue !== undefined;
}
