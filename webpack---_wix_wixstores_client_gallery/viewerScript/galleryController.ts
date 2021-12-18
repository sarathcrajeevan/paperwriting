import {IGalleryControllerConfig} from '../types/galleryTypes';
import {GalleryStore} from './GalleryStore';
import {getStyleParamsWithDefaults} from '@wix/wixstores-client-common-components/dist/src/outOfIframes/defaultStyleParams/getStyleParamsWithDefaults';
import {I$W, IWidgetController} from '@wix/native-components-infra/dist/es/src/types/types';
import {IControllerFactoryConfig} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/createViewerScript';
import {withErrorReporting} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/errorReporter';
import {getStyleParamsWithDefaultsFunc} from '../getStyleParamsWithDefaultsFunc';

export function galleryController(controllerFactoryConfig: IControllerFactoryConfig): IWidgetController {
  let galleryStore: GalleryStore;
  const {compId, config, setProps, context: factoryContext, type, reportError} = controllerFactoryConfig;
  const {
    style: {styleParams},
  } = config;

  let mainCollectionId = null;

  return {
    pageReady: () => {
      const styleParamsWithDefaults = getStyleParamsWithDefaults(styleParams, () =>
        getStyleParamsWithDefaultsFunc({style: {styleParams}, dimensions: undefined})
      );

      galleryStore = new GalleryStore(
        styleParamsWithDefaults,
        config,
        setProps,
        factoryContext.siteStore,
        compId,
        type,
        mainCollectionId,
        reportError
      );
      return galleryStore.setInitialState().catch(reportError);
    },
    updateConfig: async (
      _$w: I$W,
      {style: {styleParams: newStyleParams}, publicData: newPublicData}: IGalleryControllerConfig
    ) => {
      await galleryStore.updateState(newStyleParams, newPublicData);
    },
    exports: () =>
      withErrorReporting(reportError)({
        setCollection: (collectionId: string) => {
          mainCollectionId = collectionId;
          /* istanbul ignore else: Tested on E2E (Sled) */
          if (galleryStore) {
            galleryStore.setMainCollection(collectionId);
            return galleryStore.setInitialState().then(() => Promise.resolve);
          } else {
            return Promise.resolve();
          }
        },
      }),
  };
}
