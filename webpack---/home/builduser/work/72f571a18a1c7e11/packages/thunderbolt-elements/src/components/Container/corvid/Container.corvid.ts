import { composeSDKFactories } from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations';
import {
  IContainerSDK,
  IContainerProps,
  IContainerSDKFactory,
} from '../Container.types';
import {
  createStylePropsSDKFactory,
  childrenPropsSDKFactory,
  clickPropsSDKFactoryWithUpdatePlatformHandler,
  createElementPropsSDKFactory,
  toJSONBase,
} from '../../../core/corvid/props-factories';

const containerSDKFactory: IContainerSDKFactory = ({ metaData }) => ({
  get type() {
    return '$w.Box';
  },
  toJSON() {
    return {
      ...toJSONBase(metaData),
      type: '$w.Box',
    };
  },
});

const stylePropsSDKFactory = createStylePropsSDKFactory(
  {
    BackgroundColor: true,
    BorderColor: true,
    BorderWidth: true,
  },
  {
    cssVarPrefix: 'container',
  },
);

const elementPropsSDKFactory = createElementPropsSDKFactory();

export const sdk = composeSDKFactories<IContainerProps, IContainerSDK, any>(
  elementPropsSDKFactory,
  stylePropsSDKFactory,
  childrenPropsSDKFactory,
  clickPropsSDKFactoryWithUpdatePlatformHandler,
  containerSDKFactory,
);

export default createComponentSDKModel(sdk);
