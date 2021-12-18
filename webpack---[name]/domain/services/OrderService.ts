import {OrdersApi} from '@wix/wixstores-client-storefront-sdk/dist/es/src/apis/OrdersApi/OrdersApi';
import {BI_ORIGIN, ORDER_FETCH_ATTEMPTS, ProductType} from '../../components/thankYouPage/constants';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {CartType} from '@wix/wixstores-client-core/dist/es/src/types/cart';
import {IOrderModel, Item, ShippingAddress, StorePickup, TrackPurchaseParams} from '../../types/app.types';
import {OrderModel} from '../../types/OrderModel';
import {SubscriptionApi} from '@wix/wixstores-client-storefront-sdk/dist/es/src/apis/SubscriptionApi/SubscriptionApi';
import {SubscriptionOrderModel} from '../../types/SubscriptionOrderModel';
import {SubscriptionFrequency} from '@wix/wixstores-client-storefront-sdk/dist/es/src/graphql/queries-schema';
import {AddressTranslationService} from './AddressTranslationService';

export type OrderServiceConfig = {
  siteStore: SiteStore;
  addressTranslationService: AddressTranslationService;
};

export class OrderService {
  private readonly ordersApi: OrdersApi;
  private readonly subscriptionApi: SubscriptionApi;
  private readonly siteStore: SiteStore;
  private readonly addressTranslationService: AddressTranslationService;
  private orderModel: IOrderModel;

  constructor({siteStore, addressTranslationService}: OrderServiceConfig) {
    this.addressTranslationService = addressTranslationService;
    this.ordersApi = new OrdersApi({siteStore, origin: BI_ORIGIN});
    this.subscriptionApi = new SubscriptionApi({siteStore, origin: BI_ORIGIN});
    this.siteStore = siteStore;
  }

  public async fetchOrder(): Promise<void> {
    const orderId = this.siteStore.isSiteMode() ? this.siteStore.location.path[1] || '' : '';

    this.orderModel = this.isSubscriptionOrder()
      ? await SubscriptionOrderModel.createModel({
          subscriptionId: orderId,
          subscriptionApi: this.subscriptionApi,
          addressTranslationService: this.addressTranslationService,
        })
      : await this.createOrderModel(orderId);
  }

  private async createOrderModel(orderId: string): Promise<OrderModel> {
    const retryIntervalMs = 1000;
    let orderModel;

    for (let i = 0; i < ORDER_FETCH_ATTEMPTS; i++) {
      orderModel = await OrderModel.createModel({
        orderId,
        ordersApi: this.ordersApi,
        addressTranslationService: this.addressTranslationService,
      });

      const hasMissingDigitalLinks = orderModel.items.some(
        (item) => item.productType === ProductType.Digital && !item.digitalFileLink
      );
      if (!hasMissingDigitalLinks || i === ORDER_FETCH_ATTEMPTS - 1) {
        return orderModel;
      }

      await new Promise((r) => setTimeout(r, retryIntervalMs));
    }
  }

  private isSubscriptionOrder(): boolean {
    const appSectionParams = this.siteStore.location.query.appSectionParams;
    if (!appSectionParams) {
      return false;
    }

    return JSON.parse(appSectionParams).objectType === 'subscription';
  }

  public get buyerName(): string {
    return this.orderModel.buyerName;
  }

  public get buyerMail(): string {
    return this.orderModel.buyerMail;
  }

  public get billingAddress() {
    return this.orderModel.billingAddress;
  }

  public get buyerId(): string {
    return this.orderModel.buyerId;
  }

  public get orderId(): number {
    return this.orderModel.orderId;
  }

  public get orderGuid(): string {
    return this.orderModel.orderGuid;
  }

  public get totalPrice(): number {
    return this.orderModel.totalPrice;
  }

  public get formattedTotalPrice(): string {
    return this.orderModel.formattedTotalPrice;
  }

  public get shippingPrice(): number {
    return this.orderModel.shippingPrice;
  }

  public get taxPrice(): number {
    return this.orderModel.taxPrice;
  }

  public get isValidOrder(): boolean {
    return this.orderModel.isValid;
  }

  public get paymentMethod(): string {
    return this.orderModel.paymentMethod;
  }

  public get isOfflinePayment(): boolean {
    return this.orderModel.paymentMethod === 'offline';
  }

  public get paymentStatus(): string {
    return this.orderModel.paymentStatus;
  }

  public get shippingAddress(): ShippingAddress {
    return this.orderModel.shippingAddress;
  }

  public get deliveryType(): string {
    return this.orderModel.deliveryType;
  }

  public get storePickup(): StorePickup {
    return this.orderModel.storePickup;
  }

  public get hasShippingCountryNameTranslation(): boolean {
    return this.orderModel.hasShippingCountryNameTranslation();
  }

  public get couponCode(): string {
    return this.orderModel.couponCode;
  }

  public get items(): Item[] {
    return this.orderModel.items;
  }

  public get createdDate(): number {
    return this.orderModel.createdDate;
  }

  public get cartId(): string {
    return this.orderModel.cartId;
  }

  public get checkoutId(): string {
    return this.orderModel.checkoutId;
  }

  public get cartType(): CartType {
    const hasDigital = this.hasProductsWithType(ProductType.Digital);
    const hasPhysical = this.hasProductsWithType(ProductType.Physical);

    if (hasDigital && hasPhysical) {
      return CartType.MIXED;
    }

    if (hasDigital) {
      return CartType.DIGITAL;
    }

    return CartType.PHYSICAL;
  }

  public get trackPurchaseParams(): TrackPurchaseParams {
    const contents = this.items.map((item) => ({
      id: item.productId,
      sku: item.sku,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      currency: this.siteStore.currency,
      category: 'All Products',
    }));

    return {
      origin: 'Stores',
      id: this.orderId,
      buyerId: this.buyerId,
      buyerMail: this.buyerMail,
      coupon: this.couponCode,
      currency: this.siteStore.currency,
      orderId: this.orderGuid,
      revenue: this.totalPrice,
      shipping: this.shippingPrice,
      tax: this.taxPrice,
      contents,
    };
  }

  public get isSubscription(): boolean {
    return this.orderModel instanceof SubscriptionOrderModel;
  }

  public get subscriptionFrequency(): SubscriptionFrequency {
    return this.orderModel.subscriptionFrequency;
  }

  public get subscriptionDuration(): number {
    return this.orderModel.subscriptionDuration;
  }

  public get subscriptionName(): string {
    return this.orderModel.subscriptionName;
  }

  public hasProductsWithType(productType: ProductType): boolean {
    return this.orderModel.items.some((item) => item.productType === productType);
  }

  public getProductsWithType(productType: ProductType): Item[] {
    return this.orderModel.items.filter((item) => item.productType === productType);
  }

  public hasMissingDigitalLinks(): boolean {
    const digitalProducts = this.getProductsWithType(ProductType.Digital);
    return digitalProducts.some((product) => !product.digitalFileLink);
  }
}
