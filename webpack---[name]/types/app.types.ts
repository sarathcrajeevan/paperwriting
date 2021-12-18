import {ThankYouPageStore} from '../domain/stores/ThankYouPageStore';
import {NavigationStore} from '../domain/stores/NavigationStore';
import {GetOrderQuery, SubscriptionFrequency} from '@wix/wixstores-client-storefront-sdk/dist/es/src/graphql/queries-schema';
import {ISettingsParams} from '../components/thankYouPage/settingsParams';

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

export type IControllerProps = {
  thankYouPageStore: Awaited<ReturnType<ThankYouPageStore['toProps']>>;
  navigationStore: Awaited<ReturnType<NavigationStore['toProps']>>;
  ssrError: boolean;
};

export type IMedialDimensions = {
  width: number;
  height: number;
};

export type IThankYouPageSettings = {
  booleans: {};
};

export type PickupAddress = {
  addressLine: string;
  city: string;
  zipCode: string;
  state: string;
  country: string;
};

export type ShippingAddress = {
  fullName: string;
  addressLine: string;
  addressLine2: string;
  city: string;
  zipCode: string;
  phone: string;
  company: string;
  country: string;
  subdivision: string;
};

export type StorePickup = {
  title: string;
  time: string;
  instructions: string;
  address: PickupAddress;
};

export type TrackPurchaseParams = {
  origin: string;
  id: number;
  buyerId: string;
  buyerMail: string;
  coupon: string;
  currency: string;
  orderId: string;
  revenue: number;
  shipping: number;
  tax: number;
  contents: {
    id: string;
    sku: string;
    name: string;
    price: number;
    quantity: number;
    currency: string;
    category: string;
  }[];
};

export type Item = {
  productId: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  productType: string;
  digitalFileLink?: string;
};

export type IOrderModel = {
  buyerName: string;
  buyerMail: string;
  buyerId: string;
  orderId: number;
  orderGuid: string;
  totalPrice: number;
  formattedTotalPrice: string;
  shippingPrice: number;
  taxPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  billingAddress?: GetOrderQuery['order']['billingInfo']['address'];
  shippingAddress: ShippingAddress;
  hasShippingCountryNameTranslation(): boolean;
  deliveryType: string;
  storePickup: StorePickup;
  couponCode: string;
  items: Item[];
  createdDate: number;
  cartId: string;
  checkoutId: string;
  isValid: boolean;
  subscriptionFrequency: SubscriptionFrequency;
  subscriptionDuration: number;
  subscriptionName: string;
};

export enum PaymentStatus {
  Paid = 'paid',
  NotPaid = 'notPaid',
}

export type ICartPublicData = Partial<{[k in keyof ISettingsParams]: string | {}}>;
