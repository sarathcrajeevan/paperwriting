import {I$W, IWidgetController} from '@wix/native-components-infra/dist/es/src/types/types';
import {IControllerFactoryConfig} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/createViewerScript';
import {withErrorReporting} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/errorReporter';
import {IProductPageControllerConfig} from '../types/app-types';
import {getRuntimeStyleParams} from '../commons/styleParamsService';
import {wixCodeGetProduct} from '../services/getProduct';
import {ProductPageStore} from './ProductPageStore';
import {APP_DEFINITION_ID, StoresWidgetID} from '@wix/wixstores-client-core/dist/es/src/constants';
import {PRODUCT_PAGE_WIXCODE_APP_NAME, productPageFedopsEvent} from '../constants';

export function productPageController({
  context,
  config,
  setProps,
  reportError,
  compId,
}: IControllerFactoryConfig): IWidgetController {
  let productPageStore: ProductPageStore;
  const {siteStore} = context;
  const isMobile = siteStore.isMobile();
  const isSSR = siteStore.isSSR();
  const fedopsLoggerFactory = siteStore.platformServices.fedOpsLoggerFactory;
  const fedopsLogger = fedopsLoggerFactory.getLoggerForWidget({
    appId: APP_DEFINITION_ID,
    widgetId: StoresWidgetID.PRODUCT_PAGE,
    appName: PRODUCT_PAGE_WIXCODE_APP_NAME,
  });
  /* istanbul ignore next: todo: test */
  const isResponsive = config.style.styleParams?.booleans?.responsive || isMobile;
  /* istanbul ignore next: todo: test */
  const {
    style: {styleParams},
    publicData,
    externalId = '',
  } = config;

  return {
    pageReady: () => {
      productPageStore = new ProductPageStore(
        getRuntimeStyleParams(styleParams, {isResponsive, isMobile}),
        publicData,
        setProps,
        siteStore,
        externalId,
        reportError,
        compId
      );
      return productPageStore.setInitialState().catch(reportError);
    },
    updateConfig: (
      _$w: I$W,
      {style: {styleParams: newStyleParams}, publicData: newPublicData}: IProductPageControllerConfig
    ) => {
      productPageStore.updateState(getRuntimeStyleParams(newStyleParams, {isResponsive, isMobile}), newPublicData);
    },
    exports: () =>
      withErrorReporting(reportError)({
        getProduct: () => {
          const fedopsInteraction = isSSR
            ? productPageFedopsEvent.WixCodeGetProductSSR
            : productPageFedopsEvent.WixCodeGetProduct;
          fedopsLogger.interactionStarted(fedopsInteraction);
          const onSuccess = () => fedopsLogger.interactionEnded(fedopsInteraction);
          return wixCodeGetProduct(siteStore, reportError, onSuccess);
        },
        getCustomTextFieldsValues: (): string[] => {
          const fedopsInteraction = isSSR
            ? productPageFedopsEvent.WixCodeGetCustomTextFieldValuesSSR
            : productPageFedopsEvent.WixCodeGetCustomTextFieldValues;
          fedopsLogger.interactionStarted(fedopsInteraction);
          const customTextFieldsValues = productPageStore.userInputs.text;
          fedopsLogger.interactionEnded(fedopsInteraction);
          return customTextFieldsValues;
        },
      }),
  };
}
