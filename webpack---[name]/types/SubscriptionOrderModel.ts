import {IOrderModel, Item, ShippingAddress, StorePickup} from './app.types';
import {
  ISubscription,
  SubscriptionApi,
} from '@wix/wixstores-client-storefront-sdk/dist/es/src/apis/SubscriptionApi/SubscriptionApi';
import {ProductType} from '../components/thankYouPage/constants';
import {SubscriptionFrequency} from '@wix/wixstores-client-storefront-sdk/dist/es/src/graphql/queries-schema';
import {ILocaleDisplayNames} from '@wix/wixstores-client-storefront-sdk/dist/es/src/apis/LocaleApi/LocaleApi';
import {AddressTranslationService} from '../domain/services/AddressTranslationService';
import {prepareSubdivision} from '../components/thankYouPage/order.helper';

type SubscriptionOrderModelArgs = {
  subscriptionId: string;
  subscriptionApi: SubscriptionApi;
  addressTranslationService: AddressTranslationService;
};

export class SubscriptionOrderModel implements IOrderModel {
  private readonly subscription: ISubscription;
  private readonly shippingTranslations: ILocaleDisplayNames;

  public static async createModel({
    subscriptionId,
    subscriptionApi,
    addressTranslationService,
  }: SubscriptionOrderModelArgs): Promise<SubscriptionOrderModel> {
    const gqlSubscription = await subscriptionApi.fetchSubscription({subscriptionId});

    const shippingTranslations = await addressTranslationService.translate(
      gqlSubscription.deliveryInfo.deliveryAddress.country,
      prepareSubdivision(gqlSubscription.deliveryInfo.deliveryAddress.subdivision)
    );

    return new SubscriptionOrderModel(gqlSubscription, shippingTranslations);
  }

  private constructor(gqlSubscription: ISubscription, shippingTranslations: ILocaleDisplayNames) {
    this.subscription = gqlSubscription;
    this.shippingTranslations = shippingTranslations;
  }

  public get buyerName(): string {
    return this.subscription.buyerInfo.buyerName;
  }

  public get buyerMail(): string {
    return this.subscription.buyerInfo.buyerEmail;
  }

  public get buyerId(): string {
    return this.subscription.buyerInfo.buyerId;
  }

  public get orderId(): number {
    return 0;
  }

  public get orderGuid(): string {
    return this.subscription.id;
  }

  public get totalPrice(): number {
    return this.subscription.totals.total;
  }

  public get formattedTotalPrice(): string {
    return this.subscription.totals.formattedTotal;
  }

  public get shippingPrice(): number {
    return this.subscription.totals.shipping;
  }

  public get taxPrice(): number {
    return this.subscription.totals.tax;
  }

  public get paymentMethod(): string {
    return this.subscription.paymentInfo?.paymentMethod;
  }

  public get paymentStatus(): string {
    return this.subscription.paymentInfo?.paymentStatus;
  }

  public get shippingAddress(): ShippingAddress {
    const {company, city, addressLine, addressLine2, zipCode, phone, fullName} =
      this.subscription.deliveryInfo.deliveryAddress;
    return {
      company,
      country: this.shippingTranslations.countryName,
      subdivision: this.shippingTranslations.regionName,
      city,
      addressLine,
      addressLine2,
      zipCode,
      phone,
      fullName,
    };
  }

  public get deliveryType(): string {
    return this.subscription.deliveryInfo.deliveryType;
  }

  public get storePickup(): StorePickup {
    return null;
  }

  public get couponCode(): string {
    return this.subscription.appliedCoupon?.code;
  }

  public get items(): Item[] {
    return this.subscription.lineItems.map((x) => ({
      name: x.productDetails.name,
      price: x.chargeDetails.price,
      sku: x.productDetails.sku,
      productId: x.productDetails.productId,
      quantity: x.quantity,
      productType: ProductType.Physical,
    }));
  }

  public get createdDate(): number {
    return this.subscription.createdAt;
  }

  public get cartId(): string {
    return this.subscription.cartId;
  }

  public get checkoutId(): string {
    return this.subscription.checkoutId;
  }

  public get isValid(): boolean {
    return !!this.subscription.id;
  }

  public get subscriptionFrequency(): SubscriptionFrequency {
    return this.subscription.frequency;
  }

  public get subscriptionDuration(): number {
    return this.subscription.duration;
  }

  public get subscriptionName(): string {
    return this.subscription.name;
  }

  public hasShippingCountryNameTranslation(): boolean {
    return !!this.shippingTranslations.countryName;
  }
}
