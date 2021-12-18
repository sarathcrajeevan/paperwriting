import {IControllerFactoryConfig} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/createViewerScript';
import {I$W, IWidgetController} from '@wix/native-components-infra/dist/es/src/types/types';
import {CartIconStore} from './CartIconStore';
import {ICartIconControllerConfigEditor} from '../types/app-types';
import {withErrorReporting} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/errorReporter';
import {IAddToCartOptions} from '../types/product';
import {IAddToCartItem} from '@wix/wixstores-client-core/dist/es/src/types/cart';
import {createWixcodeExports} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/wixcode/createWixcodeExports';
import {FedopsInteraction, origin} from '../constants';

export function cartWidgetController({
  config,
  setProps,
  context,
  reportError,
}: IControllerFactoryConfig): IWidgetController {
  const {
    cart: {addToCart, addProducts},
  } = createWixcodeExports({context, origin});
  let cartIconStore: CartIconStore;

  return {
    pageReady: () => {
      cartIconStore = new CartIconStore(context.siteStore, config, setProps, reportError);
      return cartIconStore.setInitialState();
    },
    updateConfig: (_$w: I$W, updatedConfig: ICartIconControllerConfigEditor) => {
      config.style = updatedConfig.style;
      config.publicData = updatedConfig.publicData;
      setProps({
        displayText: cartIconStore.getDisplayText(updatedConfig.publicData ? updatedConfig.publicData.appSettings : {}),
      });
    },
    onBeforeUnLoad: () => {
      cartIconStore.unSubscribeAll();
    },
    exports: () =>
      withErrorReporting(reportError)({
        addToCart: async (
          productId: string,
          quantity: number = 1,
          options: IAddToCartOptions = {}
        ): Promise<boolean> => {
          await cartIconStore.executeWithFedops(FedopsInteraction.ADD_TO_CART, () =>
            addToCart(productId, quantity, options)
          );
          return true;
        },
        addProductsToCart: async (cartItems: IAddToCartItem[]): Promise<boolean> => {
          await cartIconStore.executeWithFedops(FedopsInteraction.ADD_ITEMS_TO_CART, () => addProducts(cartItems));
          return true;
        },
      }),
  };
}
