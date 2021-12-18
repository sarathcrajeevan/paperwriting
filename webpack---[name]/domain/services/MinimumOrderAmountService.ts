import {OrderService} from './OrderService';
import {StyleSettingsService} from './StyleSettingsService';

export class MinimumOrderAmountService {
  private readonly orderService: OrderService;
  private readonly styleSettingsService: StyleSettingsService;

  constructor({
    orderService,
    styleSettingsService,
  }: {
    orderService: OrderService;
    styleSettingsService: StyleSettingsService;
  }) {
    this.orderService = orderService;
    this.styleSettingsService = styleSettingsService;
  }

  private get isViolated() {
    return this.orderService.minimumOrderAmount?.reached === false;
  }

  public get shouldDisplayNotification() {
    return (
      this.styleSettingsService.shouldShowShipping &&
      this.orderService.hasShippingDestination &&
      !this.orderService.isPickup &&
      this.isViolated
    );
  }

  public get shouldDisableCheckout() {
    return this.shouldDisplayNotification && !this.orderService.hasPickupOption;
  }
}
