import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {DestinationCompletionListService} from '../services/DestinationCompletionListService';
import {IDestinationCompletion} from '@wix/wixstores-graphql-schema';
import {SelectedShippingOption} from '@wix/wixstores-client-storefront-sdk/dist/es/src/apis/CartApi/types';
import {ShippingRuleStatus} from '@wix/wixstores-client-core/dist/es/src/types/shipping-rule-status';
import {BIService} from '../services/BIService';
import {StyleSettingsService} from '../services/StyleSettingsService';
import _ from 'lodash';
import {CartService} from '../services/CartService';
import {ICartControllerApi} from '../../types/app.types';
import {OrderService} from '../services/OrderService';
import {ModalManagerService} from '../services/ModalManagerService';

type OrderStoreConfig = {
  cartService: CartService;
  orderService: OrderService;
  biService: BIService;
  styleSettingsService: StyleSettingsService;
  modalManagerService: ModalManagerService;
};

export enum DestinationCompleteness {
  COUNTRY = 'COUNTRY',
  SUBDIVISION = 'SUBDIVISION',
  ZIPCODE = 'ZIPCODE',
}

export class OrderStore {
  private destinationCompletionList: IDestinationCompletion[];
  private readonly biService: BIService;
  private readonly cartService: CartService;
  private readonly controllerApi: ICartControllerApi;
  private readonly destinationCompletionListService: DestinationCompletionListService;
  private readonly modalManagerService: ModalManagerService;
  private readonly orderService: OrderService;
  private readonly siteStore: SiteStore;
  private readonly styleSettingsService: StyleSettingsService;
  private readonly taxName: string;

  constructor(
    controllerApi: ICartControllerApi,
    siteStore: SiteStore,
    {biService, styleSettingsService, cartService, orderService, modalManagerService}: OrderStoreConfig
  ) {
    this.controllerApi = controllerApi;
    this.siteStore = siteStore;
    this.destinationCompletionListService = new DestinationCompletionListService({siteStore});
    this.styleSettingsService = styleSettingsService;
    this.biService = biService;
    this.cartService = cartService;
    this.orderService = orderService;
    this.taxName = this.siteStore.taxName;
    this.modalManagerService = modalManagerService;

    //eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.fetchDestinationCompletionList();
  }

  private async fetchDestinationCompletionList() {
    const {shouldShowShipping, shouldShowTax} = this.styleSettingsService;

    this.destinationCompletionList = await this.destinationCompletionListService.fetch({
      forShipping: shouldShowShipping,
      forTax: shouldShowTax,
    });
  }

  private get hasTax(): boolean {
    return !!this.cartService.cart.totals.tax;
  }

  private shouldDisplaySubtotalForDigitalCart() {
    const {shouldShowTax} = this.styleSettingsService;

    return (
      shouldShowTax &&
      (!this.orderService.taxOnProduct || (this.orderService.taxOnProduct && this.cartService.cart.appliedCoupon)) &&
      this.orderService.isEstimatedDestinationIsShippable &&
      this.hasTax
    );
  }

  private shouldDisplaySubtotalForMixedCart() {
    const {shouldShowTax, shouldShowShipping} = this.styleSettingsService;

    return (shouldShowTax && !this.orderService.taxOnProduct) || shouldShowShipping;
  }

  private get shouldDisplaySubtotal() {
    // full logic https://p5r73x.axshare.com/#p=shipping_and_tax_show_hide
    if (this.cartService.isDigitalCart) {
      return this.shouldDisplaySubtotalForDigitalCart();
    }

    return this.shouldDisplaySubtotalForMixedCart();
  }

  private get shouldDisplaySubtotalTitle(): boolean {
    //full logic explained here: https://p5r73x.axshare.com/#p=shipping_and_tax_show_hide
    const {isDigitalCart} = this.cartService;
    const {shouldShowTax, shouldShowShipping} = this.styleSettingsService;

    const digitalWithDefinedTax =
      isDigitalCart && shouldShowTax && this.orderService.hasEstimatedDestination && this.hasTax;
    const mixedWithShippingOrTax =
      !isDigitalCart && (shouldShowShipping || (shouldShowTax && !this.orderService.taxOnProduct));

    return !(digitalWithDefinedTax || mixedWithShippingOrTax);
  }

  private get shouldDisplayEstimatedTaxShippingDestination() {
    const {shouldShowShipping} = this.styleSettingsService;

    return !shouldShowShipping && !this.cartService.isDigitalCart;
  }

  private get hasShippingDestination() {
    return this.orderService.hasShippingDestination;
  }

  public get shouldDisplayDelivery() {
    const {shouldShowShipping} = this.styleSettingsService;

    return shouldShowShipping && !this.cartService.isDigitalCart;
  }

  private readonly handleChangeRegion = async () => {
    if (this.siteStore.isEditorMode()) {
      return;
    }

    const cart = this.cartService.cart;
    const modalData: any = {
      country: cart.destination?.country,
      subdivision: cart.destination?.subdivision,
      zipCode: cart.destination?.zipCode,
    };
    modalData.destinationCompletionList = this.destinationCompletionList
      ? this.destinationCompletionList.map(
          /* istanbul ignore next */ (destination) =>
            /* istanbul ignore next */
            _.pick(destination, ['country', 'subregions', 'subdivisions'])
        )
      : /* istanbul ignore next */
        [];

    this.biService.clickOnShippingDestinationInCartPageSf(this.cartService.cart, this.cartService.cartType);

    /* istanbul ignore next */
    const data = ((await this.modalManagerService.modalManger.openChangeRegion(modalData)) as any)?.message;

    if (data?.country) {
      this.biService.updateClickedInSelectYourShippingDestinationPopupSf(
        this.cartService.cart,
        this.cartService.cartType,
        data
      );

      this.orderService.destinationWasChanged = true;

      await this.controllerApi.executeWithLoader(() =>
        this.cartService.setDestinationForEstimation(data, this.cartService.cart.cartId)
      );

      if (!this.orderService.canShipToDestination) {
        this.biService.errorInCheckoutSf(cart);
      }
    } else {
      this.biService.cancelClickedInSelectYourShippingDestinationPopupSf(cart, this.cartService.cartType);
    }
  };

  private get isFullAddressRequired() {
    return this.cartService.isFullAddressRequired;
  }

  private get shouldDisplayDeliveryError() {
    return (
      (this.shouldDisplayDelivery || this.orderService.shouldDisplayTax) &&
      !this.orderService.canShip &&
      this.orderService.destinationWasChanged &&
      !this.cartService.isEmpty &&
      !this.orderService.hasShippingRules &&
      this.cartService.cart.destination &&
      !!this.cartService.cart.destination.country
    );
  }

  private get shouldDisplayDeliveryMethodSelection() {
    const shippingRuleInfo = this.cartService.cart.shippingRuleInfo;

    if (!shippingRuleInfo?.shippingRule) {
      return false;
    }

    const shippingRuleOptions = this.orderService.shippingRuleOptions;
    const isMoreThanOneShippingRuleOption = shippingRuleOptions.length > 1;
    const hasPickupOption = this.orderService.hasPickupOption;

    return this.shouldDisplayDelivery && (isMoreThanOneShippingRuleOption || hasPickupOption);
  }

  private readonly selectShippingOption = (selectedShippingOptionId: string): Promise<void> => {
    const setShippingOptionData: SelectedShippingOption = {
      shippingRuleId: this.cartService.cart.shippingRuleInfo?.shippingRule.id,
      optionId: selectedShippingOptionId,
    };
    const fn = () => this.cartService.setShippingOption(this.cartService.cart.cartId, setShippingOptionData);
    return this.controllerApi.executeWithLoader(fn);
  };

  private get isZipCodeValid(): boolean {
    return this.cartService.cart.shippingRuleInfo?.status !== ShippingRuleStatus.MissingZipCode;
  }

  private get isMainCurrency(): boolean {
    const {convertedCurrencyFormat, currencyFormat} = this.cartService.cart;

    return !convertedCurrencyFormat.code || currencyFormat.code === convertedCurrencyFormat.code;
  }

  private get isPickup(): boolean {
    return this.orderService.isPickup;
  }

  public toProps() {
    if (this.cartService.isEmpty) {
      return;
    }

    return {
      isPickup: this.isPickup,
      handleChangeRegion: this.handleChangeRegion,
      hasShippingDestination: this.hasShippingDestination,
      isEstimatedDestinationIsShippable: this.orderService.isEstimatedDestinationIsShippable,
      isZipCodeValid: this.isZipCodeValid,
      selectShippingOption: this.selectShippingOption,
      shippingRuleOptions: this.orderService.shippingRuleOptions,
      shouldDisplayDelivery: this.shouldDisplayDelivery,
      shouldDisplayDeliveryError: this.shouldDisplayDeliveryError,
      shouldDisplayDeliveryMethodSelection: this.shouldDisplayDeliveryMethodSelection,
      shouldDisplayEstimatedTaxShippingDestination: this.shouldDisplayEstimatedTaxShippingDestination,
      shouldDisplaySubtotal: this.shouldDisplaySubtotal,
      shouldDisplaySubtotalTitle: this.shouldDisplaySubtotalTitle,
      shouldDisplayTax: this.orderService.shouldDisplayTax,
      shouldShowTax: this.styleSettingsService.shouldShowTax,
      shouldShowShipping: this.styleSettingsService.shouldShowShipping,
      taxName: this.taxName,
      taxOnProduct: this.orderService.taxOnProduct,
      isMainCurrency: this.isMainCurrency,
      isFullAddressRequired: this.isFullAddressRequired,
    };
  }
}
