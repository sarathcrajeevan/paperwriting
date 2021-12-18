import {
  withValidation,
  composeSDKFactories,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations';
import {
  ITextAreaInputOwnSDKFactory,
  ITextAreaInputProps,
  ITextAreaInputSDK,
  ITextAreaInputImperativeActions,
} from '../TextAreaInput.types';
import {
  composeSanitizers,
  numberToString,
  emptyStringIfNotString,
  forceMaxLength,
  InputValidator,
  createInputValidator,
  validateRequired,
  composeValidators,
} from '../../../core/corvid/inputUtils';
import {
  createValuePropsSdkFactory,
  createRequiredPropsSDKFactory,
  readOnlyPropsSDKFactory,
  focusPropsSDKFactory,
  textInputPropsSDKFactory,
  createValidationPropsSDKFactory,
  disablePropsSDKFactory,
  clickPropsSDKFactory,
  createElementPropsSDKFactory,
  toJSONBase,
  createStylePropsSDKFactory,
} from '../../../core/corvid/props-factories';

const textAreaInputValidator: InputValidator<
  ITextAreaInputProps,
  ITextAreaInputImperativeActions
> = createInputValidator(
  composeValidators<ITextAreaInputProps>([validateRequired]),
);

const requiredPropsSDKFactory = createRequiredPropsSDKFactory<
  ITextAreaInputProps,
  ITextAreaInputImperativeActions
>(textAreaInputValidator);

const validationPropsSDKFactory = createValidationPropsSDKFactory<
  ITextAreaInputProps,
  ITextAreaInputImperativeActions
>(textAreaInputValidator);

interface ITextAreaInputSDKState {
  wrap: 'soft' | 'hard';
}

const _ownSDKFactory: ITextAreaInputOwnSDKFactory = ({
  props,
  metaData,
  createSdkState,
}) => {
  const [state, setState] = createSdkState<ITextAreaInputSDKState>({
    wrap: 'soft',
  });

  return {
    get wrap() {
      return state.wrap;
    },
    set wrap(wrap) {
      setState({ wrap });
    },
    get type() {
      return '$w.TextBox';
    },
    toJSON() {
      const { readOnly, required, value } = props;
      return {
        ...toJSONBase(metaData),
        readOnly,
        required,
        value,
        wrap: state.wrap,
        type: '$w.TextBox',
      };
    },
  };
};

const ownSDKFactory = withValidation(_ownSDKFactory, {
  type: ['object'],
  properties: {
    wrap: {
      type: ['string'],
      enum: ['soft', 'hard'],
    },
  },
});

const valueSanitizer = ({ maxLength }: ITextAreaInputProps) =>
  composeSanitizers([
    numberToString,
    emptyStringIfNotString,
    forceMaxLength(maxLength),
  ]);

const valuePropsSDKFactory = createValuePropsSdkFactory<
  ITextAreaInputProps,
  ITextAreaInputImperativeActions
>(
  (value, api) => valueSanitizer(api.props)(value),
  { type: ['string'] },
  textAreaInputValidator,
);

const stylePropsSDKFactory = createStylePropsSDKFactory({
  BackgroundColor: true,
  BorderColor: true,
  BorderWidth: true,
  BorderRadius: true,
  TextColor: true,
});

const elementPropsSDKFactory = createElementPropsSDKFactory();

export const sdk = composeSDKFactories<
  ITextAreaInputProps,
  ITextAreaInputSDK,
  any
>(
  elementPropsSDKFactory,
  requiredPropsSDKFactory,
  validationPropsSDKFactory,
  readOnlyPropsSDKFactory,
  textInputPropsSDKFactory,
  focusPropsSDKFactory,
  valuePropsSDKFactory,
  disablePropsSDKFactory,
  clickPropsSDKFactory,
  stylePropsSDKFactory,
  ownSDKFactory,
);

export default createComponentSDKModel(sdk);
