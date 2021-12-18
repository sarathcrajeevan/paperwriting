import {IGalleryControllerConfig} from '../types/galleryTypes';
import {SliderGalleryStore} from './SliderGalleryStore';
import {getStyleParamsWithDefaults} from '@wix/wixstores-client-common-components/dist/src/outOfIframes/defaultStyleParams/getStyleParamsWithDefaults';
import {I$W, IWidgetController} from '@wix/native-components-infra/dist/es/src/types/types';
import {IControllerFactoryConfig} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/createViewerScript';
import {getStyleParamsWithDefaultsFunc} from '../getStyleParamsWithDefaultsFunc';

export function sliderGalleryController(controllerFactoryConfig: IControllerFactoryConfig): IWidgetController {
  let sliderGalleryStore: SliderGalleryStore;
  const {compId, config, setProps, context: factoryContext, type, reportError} = controllerFactoryConfig;
  const {
    style: {styleParams},
  } = config;

  return {
    pageReady: () => {
      const styleParamsWithDefaults = getStyleParamsWithDefaults(styleParams, () =>
        getStyleParamsWithDefaultsFunc({style: {styleParams}, dimensions: undefined})
      );

      sliderGalleryStore = new SliderGalleryStore(
        styleParamsWithDefaults,
        config,
        setProps,
        factoryContext.siteStore,
        compId,
        reportError,
        type
      );
      return sliderGalleryStore.setInitialState().catch(reportError);
    },
    updateConfig: (
      _$w: I$W,
      {style: {styleParams: newStyleParams}, publicData: newPublicData}: IGalleryControllerConfig
    ) => {
      sliderGalleryStore.updateState(newStyleParams, newPublicData);
    },
  };
}
