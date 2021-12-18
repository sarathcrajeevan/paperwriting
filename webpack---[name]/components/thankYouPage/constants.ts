import {IMedialDimensions} from '../../types/app.types';

export const THUMBNAIL_DIMENSIONS: IMedialDimensions = {
  width: 100,
  height: 100,
};

export enum StyleParam {}

export const BI_APP_NAME = 'Stores';

export const BI_ORIGIN = 'thank you page';

export enum FedopsInteractions {
  GET_ORDER = 'wix-code-get-order',
}

export enum ProductType {
  Physical = 'physical',
  Digital = 'digital',
}

export enum DeliveryType {
  SHIPPING = 'SHIPPING',
  PICKUP = 'PICKUP',
}

export const ORDER_FETCH_ATTEMPTS = 4;

export enum Specs {
  EnableNewTyp = 'specs.stores.EnableNewTyp',
}
