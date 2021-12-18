import React from 'react';
import styles from './LeadCaptureForm.scss';
import Input from '../Input/Input';
import { MessageEntry } from '@wix/chat-web';
import { EmailValidator } from 'commons-validator-js';
import { Constants } from '@wix/chat-sdk';
import { InjectedTranslateProps, translate } from 'react-i18next';
import classNames from 'classnames';
import _isEmpty from 'lodash/isEmpty';
import _first from 'lodash/first';
import { Services, withServices } from '../../hooks/services-registry';

interface FormProps extends InjectedTranslateProps, Services {
  groupPosition: 'start' | 'end' | 'middle' | 'single';
  fields: {
    type: string;
  }[];
  onSubmit(): any;
  buttonBackgroundColor: string;
  buttonTextColor: string;
  inputBackground: string;
  borderRadius: number;
  isActive: boolean;
  narrowStyle: boolean;
  inputTextColor: string;
}

interface FormState {
  fields: {
    type: string;
    value: string;
    valid: boolean;
    error?: string;
  }[];
  hasSubmitError: boolean;
  isSubmissionInProgress: boolean;
  isNetworkError: boolean;
}

class Form extends React.Component<FormProps, FormState> {
  emailValidator = new EmailValidator();
  inputRefs: Record<string, HTMLInputElement> = {};

  constructor(props: FormProps) {
    super(props);
    const fields = props.fields.map(({ type }) => ({
      type,
      value: '',
      valid: true,
    }));
    this.state = {
      fields,
      hasSubmitError: false,
      isSubmissionInProgress: false,
      isNetworkError: false,
    };
  }

  calculateMessageExistFlag = () => {
    const { fields } = this.state;
    const message = _first(
      fields.filter((f) => f.type === 'message').map((f) => f.value),
    );
    if (message === undefined) {
      return null;
    }
    return _isEmpty(message);
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { fields, isSubmissionInProgress } = this.state;
    if (isSubmissionInProgress) {
      return;
    }
    const fieldsAfterValidation = this.validateAllFields(fields);
    this.setState({ fields: fieldsAfterValidation });
    const invalidFields = fieldsAfterValidation.filter((field) => !field.valid);
    const areAllValid = invalidFields.length === 0;
    if (!areAllValid) {
      this.inputRefs[invalidFields[0].type]?.focus();
      return;
    }
    this.props.biLogger.lcfSubmission(this.calculateMessageExistFlag());

    try {
      const typeValueFields = fields
        .map(({ type, value }) => ({
          type,
          value: value.trim() || undefined,
        }))
        .filter(({ value }) => !!value);

      this.setState({ isSubmissionInProgress: true });
      if (this.props.isActive) {
        await this.props.serverApi.postLCF(typeValueFields);
      }
      this.setState({ isSubmissionInProgress: false });

      this.props.onSubmit();
    } catch (e) {
      const isNetworkError = e.message === 'Network Error';
      this.setState({
        isSubmissionInProgress: false,
        hasSubmitError: true,
        isNetworkError,
      });
    }
  };

  cleanSubmitError = () =>
    this.setState({ hasSubmitError: false, isNetworkError: false });

  validateAndUpdateState = (fieldType: string, value: string) => () => {
    const validatedField = this.validate(fieldType, value);
    this.updateField(validatedField);
  };

  isRequired = (fieldType: string) => {
    return fieldType !== 'message';
  };

  validate = (fieldType: string, value: string) => {
    const { t } = this.props;
    let valid = true;
    let error = '';
    if (this.isRequired(fieldType) && !value) {
      valid = false;
      error = t(`lcf.field-required-${fieldType}`);
    } else if (fieldType === 'email' && !this.emailValidator.isValid(value)) {
      valid = false;
      error = t('lcf.field-invalid-email');
    }
    return { type: fieldType, value, valid, error };
  };

  validateAllFields = (fields: FormState['fields']) => {
    return fields.map((field) => this.validate(field.type, field.value));
  };

  handleChange = (fieldType) => (event) => {
    this.cleanSubmitError();
    const updatedVlue = event.target.value;
    this.updateField({ type: fieldType, value: updatedVlue });
  };

  updateField = (fieldToUpdate) => {
    this.setState((prevState) => {
      const updatedFields = prevState.fields.map((existingField) => {
        if (existingField.type === fieldToUpdate.type) {
          const validate = this.validate(
            fieldToUpdate.type,
            fieldToUpdate.value,
          );
          return { ...existingField, ...fieldToUpdate, ...validate };
        }

        return existingField;
      });
      return { fields: updatedFields };
    });
  };

  render() {
    const { fields, hasSubmitError, isSubmissionInProgress, isNetworkError } =
      this.state;
    const {
      groupPosition,
      t,
      buttonBackgroundColor,
      isActive,
      buttonTextColor,
      inputBackground,
      inputTextColor,
      borderRadius,
      narrowStyle,
    } = this.props;

    return (
      <div>
        <div className={styles.entry}>
          <MessageEntry
            groupPosition={groupPosition}
            position={Constants.MessageDirections.Incoming}
          >
            <form
              onSubmit={this.handleSubmit}
              className={classNames({
                [styles.form]: true,
                [styles.hasSubmitError]: hasSubmitError,
                [styles.narrowStyle]: narrowStyle,
              })}
            >
              {fields.map((field, index) => {
                return (
                  <Input
                    type={field.type}
                    label={t(`lcf.field-${field.type}`)}
                    value={field.value}
                    valid={field.valid}
                    error={field.error}
                    onBlur={this.validateAndUpdateState(
                      field.type,
                      field.value,
                    )}
                    onChange={this.handleChange(field.type)}
                    key={field.type}
                    dataHook={`input-${field.type}`}
                    autoFocus={isActive && index === 0}
                    color={inputTextColor}
                    background={inputBackground}
                    inputRef={(el) => (this.inputRefs[field.type] = el)}
                  />
                );
              })}
              <button
                type="submit"
                style={{
                  backgroundColor: buttonBackgroundColor,
                  color: buttonTextColor,
                  borderRadius,
                }}
                className={styles.submit}
                data-hook="lcf-submit"
                data-x={1}
                disabled={isSubmissionInProgress}
              >
                {t('lcf.submit')}
              </button>
              {hasSubmitError && (
                <span
                  role="alert"
                  data-hook="lcf-submit-error"
                  className={styles.submitError}
                >
                  {isNetworkError
                    ? t('lcf.submit-error.network')
                    : t('lcf.submit-error')}
                </span>
              )}
            </form>
          </MessageEntry>
        </div>
      </div>
    );
  }
}

export default withServices(translate()(Form));
