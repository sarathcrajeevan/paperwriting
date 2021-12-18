/* eslint-disable import/no-default-export */
import {CartController} from './CartController';
import {controllerFactory} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/controller-factory/controllerFactory';

export default controllerFactory(CartController);
