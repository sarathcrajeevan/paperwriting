import { composeSDKFactories } from '@wix/editor-elements-corvid-utils';
import {
  createElementPropsSDKFactory,
  changePropsSDKFactory,
} from '../props-factories';
import { menuPropsSDKFactory } from './menuItemsPropsSDKFactory';
import { IMenuSDK, MenuProps } from './Menu.types';

const elementPropsSDKFactory = createElementPropsSDKFactory();

export const sdk = composeSDKFactories<MenuProps, IMenuSDK>(
  elementPropsSDKFactory,
  changePropsSDKFactory,
  menuPropsSDKFactory,
);
