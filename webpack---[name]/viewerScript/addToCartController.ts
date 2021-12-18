import {I$W, IControllerConfig, IWidgetController} from '@wix/native-components-infra/dist/src/types/types';
import {IControllerFactoryConfig} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/createViewerScript';
import {AddToCartStore} from './AddToCartStore';

export function addToCartController({
  context,
  config,
  setProps,
  reportError,
  compId,
  type,
}: IControllerFactoryConfig): IWidgetController {
  let addToCartStore: AddToCartStore;
  const {siteStore} = context;
  const {publicData, externalId = ''} = config;

  return {
    pageReady: () => {
      addToCartStore = new AddToCartStore(publicData, setProps, siteStore, externalId, reportError, compId, type);

      return addToCartStore.setInitialState().catch(reportError);
    },
    updateConfig: (_$w: I$W, {publicData: newPublicData}: IControllerConfig) => {
      addToCartStore.updateState(newPublicData);
    },
  };
}
