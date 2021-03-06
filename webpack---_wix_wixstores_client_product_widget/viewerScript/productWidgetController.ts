import {I$W, IWidgetController} from '@wix/native-components-infra/dist/src/types/types';
import {IControllerFactoryConfig} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/createViewerScript';
import {ProductWidgetStore} from './ProductWidgetStore';
import {IProductWidgetControllerConfig} from '../types/app-types';
import {getRuntimeStyleParams} from '../commons/styleParamsService';

export function productWidgetController({
  context,
  config,
  compId,
  setProps,
  reportError,
}: IControllerFactoryConfig): IWidgetController {
  let productWidgetStore: ProductWidgetStore;
  const {siteStore} = context;
  const {
    style: {styleParams},
    publicData,
    externalId = '',
  } = config;

  const getStyleParams = (newStyleParams?) => {
    return getRuntimeStyleParams(newStyleParams || styleParams, {
      formFactor: siteStore.formFactor,
      widgetPreset: publicData.COMPONENT?.presetId,
    });
  };

  return {
    pageReady: () => {
      productWidgetStore = new ProductWidgetStore(
        getStyleParams(),
        publicData,
        setProps,
        siteStore,
        externalId,
        compId,
        reportError
      );
      return productWidgetStore.setInitialState().catch(reportError);
    },
    updateConfig: (
      _$w: I$W,
      {style: {styleParams: newStyleParams}, publicData: newPublicData}: IProductWidgetControllerConfig
    ) => {
      productWidgetStore.updateState(getStyleParams(newStyleParams), newPublicData);
    },
  };
}
