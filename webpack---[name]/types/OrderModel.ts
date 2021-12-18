import {IOrderModel, Item, PickupAddress, ShippingAddress, StorePickup} from './app.types';
import {IOrder, OrdersApi} from '@wix/wixstores-client-storefront-sdk/dist/es/src/apis/OrdersApi/OrdersApi';

import {GetOrderQuery, SubscriptionFrequency} from '@wix/wixstores-client-storefront-sdk/dist/es/src/graphql/queries-schema';
import {ILocaleDisplayNames} from '@wix/wixstores-client-storefront-sdk/dist/es/src/apis/LocaleApi/LocaleApi';
import {AddressTranslationService} from '../domain/services/AddressTranslationService';
import {prepareSubdivision} from '../components/thankYouPage/order.helper';

type OrderModelArgs = {
  orderId: string;
  ordersApi: OrdersApi;
  addressTranslationService: AddressTranslationService;
};

export class OrderModel implements IOrderModel {
  private readonly order: IOrder;
  private readonly shippingTranslations: ILocaleDisplayNames;
  private readonly storePickupTranslations: ILocaleDisplayNames;

  public static async createModel({
    orderId,
    ordersApi,
    addressTranslationService,
  }: OrderModelArgs): Promise<OrderModel> {
    const gqlOrder = await ordersApi.fetchOrder({orderId});
    if (gqlOrder.shippingInfo.address.country) {
      const shippingTranslations = await addressTranslationService.translate(
        gqlOrder.shippingInfo.address.country,
        prepareSubdivision(gqlOrder.shippingInfo.address.subdivision)
      );
      return new OrderModel({gqlOrder, shippingTranslations});
    }

    if (gqlOrder.deliveryInfo?.pickupInfo?.address) {
      const storePickupTranslations = await addressTranslationService.translate(
        gqlOrder.deliveryInfo.pickupInfo.address.country,
        prepareSubdivision(gqlOrder.deliveryInfo.pickupInfo.address.subdivision)
      );
      return new OrderModel({gqlOrder, storePickupTranslations});
    }

    return new OrderModel({gqlOrder});
  }

  private constructor({
    gqlOrder,
    shippingTranslations,
    storePickupTranslations,
  }: {
    gqlOrder: IOrder;
    shippingTranslations?: ILocaleDisplayNames;
    storePickupTranslations?: ILocaleDisplayNames;
  }) {
    this.order = gqlOrder;
    this.shippingTranslations = shippingTranslations;
    this.storePickupTranslations = storePickupTranslations;
  }

  public get buyerName(): string {
    return this.order.userInfo.name;
  }

  public get buyerMail(): string {
    return this.order.userInfo.email;
  }

  public get buyerId(): string {
    return this.order.contactId;
  }

  public get orderId(): number {
    return this.order.incrementId;
  }

  public get orderGuid(): string {
    return this.order.id;
  }

  public get totalPrice(): number {
    return this.order.totals.total;
  }

  public get formattedTotalPrice(): string {
    return this.order.formattedTotals.formattedTotal;
  }

  public get shippingPrice(): number {
    return this.order.totals.shipping;
  }

  public get taxPrice(): number {
    return this.order.totals.tax;
  }

  public get paymentMethod(): string {
    return this.order.billingInfo.method;
  }

  public get paymentStatus(): string {
    return this.order.billingInfo.status;
  }

  public get billingAddress(): GetOrderQuery['order']['billingInfo']['address'] {
    return this.order.billingInfo.address;
  }

  public get shippingAddress(): ShippingAddress {
    const {countryName, regionName} = this.shippingTranslations || {};
    const {
      company,
      city,
      addressLine,
      addressLine2,
      zipCode,
      phoneNumber: phone,
      fullName,
    } = this.order.shippingInfo.address;

    return {
      company,
      country: countryName,
      subdivision: regionName || '',
      city,
      addressLine,
      addressLine2,
      zipCode,
      phone,
      fullName,
    };
  }

  public get deliveryType(): string {
    return this.order.deliveryInfo?.deliveryType;
  }

  public get storePickup(): StorePickup {
    const title = this.order.deliveryInfo?.title;
    const time = this.order.deliveryInfo?.deliveryTime?.trim();
    const instructions = this.order.deliveryInfo?.pickupInfo?.instructions;
    const address = this.storePickupAddress;
    return {title, time, instructions, address};
  }

  public get couponCode(): string {
    return this.order.totals.discount.code;
  }

  public get items(): Item[] {
    return this.order.items;
  }

  public get createdDate(): number {
    return this.order.createdDate;
  }

  public get cartId(): string {
    return this.order.cartId;
  }

  public get checkoutId(): string {
    return this.order.checkoutId;
  }

  public get isValid(): boolean {
    return this.orderId !== 0;
  }

  public get subscriptionFrequency(): SubscriptionFrequency {
    return null;
  }

  public get subscriptionDuration(): number {
    return 0;
  }

  public get subscriptionName(): string {
    return '';
  }

  public hasShippingCountryNameTranslation(): boolean {
    return !!this.shippingTranslations?.countryName;
  }

  private get storePickupAddress(): PickupAddress {
    if (!this.order.deliveryInfo?.pickupInfo?.address) {
      return null;
    }

    const {countryName, regionName} = this.storePickupTranslations;

    const {addressLine, city, zipCode} = this.order.deliveryInfo.pickupInfo.address;
    return {
      addressLine,
      city,
      zipCode,
      country: countryName,
      state: regionName || '',
    };
  }
}
