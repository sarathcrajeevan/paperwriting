import {
  composeSDKFactories,
  focusPropsSDKFactory,
  withValidation,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations';
import {
  ISiteButtonOwnSdk,
  ISiteButtonProps,
  ISiteButtonSDK,
} from '../SiteButton.types';
import {
  disablePropsSDKFactory,
  labelPropsSDKFactory,
  linkPropsSDKFactory,
  createStylePropsSDKFactory,
  createElementPropsSDKFactory,
  createAccessibilityPropSDKFactory,
  clickPropsSDKFactoryWithUpdatePlatformHandler,
  toJSONBase,
} from '../../../core/corvid/props-factories';

const _siteButtonSDKFactory: ISiteButtonOwnSdk = api => {
  const { props, metaData } = api;
  return {
    get type() {
      return '$w.Button';
    },
    toJSON() {
      return {
        ...toJSONBase(metaData),
        type: '$w.Button',
        label: props.label || '',
      };
    },
  };
};

const siteButtonSDKFactory = withValidation(_siteButtonSDKFactory, {
  type: ['object'],
  properties: {
    onClick: {
      type: ['function'],
      args: [{ type: ['function'] }],
    },
  },
});

const stylePropsSDKFactory = createStylePropsSDKFactory({
  BackgroundColor: true,
  BorderColor: true,
  BorderWidth: true,
  BorderRadius: true,
  TextColor: true,
});

const elementPropsSDKFactory = createElementPropsSDKFactory();

export const accessibilityPropsSDKFactory = createAccessibilityPropSDKFactory({
  enableLegacyAriaLabel: true,
});

export const sdk = composeSDKFactories<ISiteButtonProps, ISiteButtonSDK>(
  elementPropsSDKFactory,
  labelPropsSDKFactory,
  disablePropsSDKFactory,
  linkPropsSDKFactory,
  stylePropsSDKFactory,
  clickPropsSDKFactoryWithUpdatePlatformHandler,
  focusPropsSDKFactory,
  accessibilityPropsSDKFactory,
  siteButtonSDKFactory,
);

export default createComponentSDKModel(sdk);
