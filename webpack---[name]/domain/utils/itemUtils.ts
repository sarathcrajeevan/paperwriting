import {UseControllerPropsResult} from '../../components/cart/Widget/ControllerContext';
import {ICartItem} from '../../types/app.types';

export const getIsQuantityErrorNeeded = (item: ICartItem, quantity: number) => {
  return item.inventoryQuantity !== 0 && quantity > getMaxItemQuantity(item);
};

export const getIsOutOfStock = (item: ICartItem) => {
  return item.inventoryQuantity === 0;
};

export const getMaxItemQuantity = (item: ICartItem) => {
  return item.inventoryQuantity || 99_999;
};

export const getHref = (cartStore: UseControllerPropsResult['cartStore'], item: ICartItem) => {
  return cartStore.manifest[item.product.id].href;
};

export const hasOptions = (item: ICartItem) => {
  return item.optionsSelectionsValues.length > 0;
};

export const hasFreeText = (item: ICartItem) => {
  return Boolean(item.freeText?.filter((freeText) => freeText.value.trim()).length > 0);
};
