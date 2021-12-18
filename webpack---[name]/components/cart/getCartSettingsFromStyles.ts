import {
  DynamicPaymentMethodsShape,
  DynamicPaymentMethodsTheme,
} from '@wix/wixstores-client-storefront-sdk/dist/es/src/enums/productPageSettings.enums';
import _ from 'lodash';
import {ICartStyleSettings} from '../../types/app.types';
import {StyleParam} from './constants';

export function getCartSettingsFromStyles(rawStyles: ICartStyleSettings): ICartStyleSettings {
  const defaultStyles: ICartStyleSettings = {
    booleans: {
      [StyleParam.ShowContinueShopping]: false,
      [StyleParam.ShowCoupon]: true,
      [StyleParam.ShowBuyerNote]: true,
      [StyleParam.ShowTax]: false,
      [StyleParam.ShowShipping]: true,
      [StyleParam.Responsive]: false,
    },
    fonts: {
      [StyleParam.CornerRadius]: undefined,
      [StyleParam.SelectedSkin]: undefined,
    },
    numbers: {
      [StyleParam.dynamicPaymentMethodsShape]: DynamicPaymentMethodsShape.rect,
      [StyleParam.dynamicPaymentMethodsTheme]: DynamicPaymentMethodsTheme.dark,
    },
  };

  return _.merge({}, defaultStyles, rawStyles);
}
