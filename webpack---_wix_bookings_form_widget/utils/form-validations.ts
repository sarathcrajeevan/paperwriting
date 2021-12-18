import {
  FormFieldViewInfoFieldType,
  FormView,
  MessageType,
  SubmissionValue,
} from '@wix/forms-ui/types';
import { phoneRegex, emailRegex } from '@wix/wix-js-validations';

const doesFieldHasValue = (value: string) => value && value.length > 0;

export const isComplexPhoneField = (externalId: string, formSchema: FormView) =>
  formSchema?.fields?.find((field) => field.externalId === externalId)
    ?.renderInfo?.type === FormFieldViewInfoFieldType.PHONE_COUNTRY_CODE;

export const validateComplexPhone = (prefix: string, phone: string) => {
  if (
    doesFieldHasValue(prefix) &&
    doesFieldHasValue(phone) &&
    !phoneRegex.test(prefix + phone)
  ) {
    return MessageType.INVALID_PATTERN;
  }
  return true;
};

export const validateEmail = (email: SubmissionValue) => {
  if (isValidEmail(email)) {
    return true;
  }
  return MessageType.INVALID_PATTERN;
};

export const isValidEmail = (email: SubmissionValue) => {
  return doesFieldHasValue(email as string) && emailRegex.test(email as string);
};
