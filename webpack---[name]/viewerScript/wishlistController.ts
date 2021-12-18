import {IWidgetController} from '@wix/native-components-infra/dist/src/types/types';
import {IControllerFactoryConfig} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/createViewerScript';
import {WishlistStore} from './WishlistStore';
import {getDefaultStyleParams} from '../commons/getDefaultStyleParams';
import {getStyleParamsWithDefaults} from '@wix/wixstores-client-common-components/dist/src/outOfIframes/defaultStyleParams/getStyleParamsWithDefaults';
import {IWishlistStyleParams} from '../types/app-types';
import {I$W} from '@wix/native-components-infra/dist/es/src/types/types';

export function wishlistController({
  context,
  config,
  setProps,
  reportError,
  compId,
  type,
}: IControllerFactoryConfig): IWidgetController {
  let wishlist: WishlistStore;
  const {siteStore} = context;
  const {
    publicData,
    externalId,
    style: {styleParams},
  } = config;

  return {
    pageReady: () => {
      const styleParamsWithDefaults: IWishlistStyleParams = getStyleParamsWithDefaults(styleParams, () =>
        getDefaultStyleParams(styleParams)
      );

      wishlist = new WishlistStore(
        publicData,
        setProps,
        siteStore,
        externalId,
        compId,
        type,
        styleParamsWithDefaults,
        reportError
      );

      return wishlist.setInitialState().catch(reportError);
    },
    updateConfig: async (_$w: I$W, {style: {styleParams: newStyleParams}, publicData: newPublicData}) => {
      await wishlist.updateState(newStyleParams, newPublicData);
    },
  };
}
