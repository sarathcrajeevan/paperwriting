import {graphqlOperation, ProductType} from '../constants';
import {DynamicPaymentMethodsShape} from '@wix/wixstores-client-storefront-sdk/dist/es/src/enums/productPageSettings.enums';
import {APP_DEFINITION_ID, PageMap, ServerTransactionStatus} from '@wix/wixstores-client-core/dist/es/src/constants';
import {IProductDTO, IProductPageStyleParams, UserInput} from '../types/app-types';
import {WidgetProps} from '@wix/cashier-express-checkout-widget/dist/src/types/WidgetProps';
import {BreakdownTypes, PaymentBreakdown} from '@wix/cashier-express-checkout-widget/dist/src/types/PaymentBreakdown';
import {IOptionSelectionVariant} from '@wix/wixstores-client-core/dist/es/src/types/product';
import {PaymentAuthorizedArgs} from '@wix/cashier-express-checkout-widget/dist/src/types/ExternalContract';
import {cashierExpressAddressToEcomAddress} from '@wix/wixstores-client-storefront-sdk/dist/src/utils/cart/cashierExpressAddressToEcomAddress/cashierExpressAddressToEcomAddress';
import {CheckoutApi} from '@wix/wixstores-client-storefront-sdk/dist/es/src/apis/CheckoutApi/CheckoutApi';
import {VolatileCartService} from './VolatileCartService';
import {CheckoutType, DirectPurchaseService} from './DirectPurchaseService';
import {ShippingMethod} from '@wix/cashier-express-checkout-widget/src/types/Shipping';
import {OrderItem} from '@wix/cashier-express-checkout-widget/dist/src/types/OrderItem';
import {translate} from '@wix/wixstores-client-core/dist/src/utils/Translate';
import {
  ShippingContactRestricted,
  ShippingContactSelectedUpdate,
  ShippingError,
} from '@wix/cashier-express-checkout-widget/dist/src/types/Shipping';
import {gqlQuery, gqlStoreFrontQuery} from './getProduct';
import {query as getCountryCodes} from '../graphql/getCountryCodes.graphql';
import {query as getCheckoutSettings} from '../graphql/getCheckoutSettings.graphql';
import {GetCheckoutSettingsQuery, GetCountryCodesQuery} from '../graphql/queries-schema';
import {IPlaceOrderParams} from '@wix/wixstores-client-storefront-sdk/dist/es/src/apis/types/executor.types';
import {PlaceOrderResponse} from '@wix/wixstores-client-storefront-sdk/dist/es/src/apis/CartApi/types';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {ProductService} from './ProductService';
import _ from 'lodash';
import {SPECS} from '../specs';

export class CashierExpressService {
  private cashierExpressPaymentOrderId: string;
  private cashierExpressWidgetShippingRuleId: string;
  private countryCodes: GetCountryCodesQuery['localeData']['countries'];
  private checkoutSettings: GetCheckoutSettingsQuery['checkoutSettings'];
  private canSelectShippingMethod: boolean;

  constructor(
    private readonly siteStore: SiteStore,
    private readonly checkoutApi: CheckoutApi,
    private readonly volatileCartService: VolatileCartService
  ) {
    //
  }

  public getInitialProps(
    product: IProductDTO,
    styleParams: IProductPageStyleParams
  ): Pick<WidgetProps, 'meta' | 'requestShipping' | 'currency' | 'locale' | 'buttonStyle' | 'domain' | 'demoMode'> {
    return {
      requestShipping: product.productType !== ProductType.DIGITAL,
      buttonStyle: {
        shape:
          styleParams.numbers.productPage_dynamicPaymentMethodsButtonShape === DynamicPaymentMethodsShape.pill
            ? 'pill'
            : 'rect',
        height: 42,
      },
      domain: this.siteStore.location.baseUrl,
      meta: {
        appDefId: APP_DEFINITION_ID,
        appInstanceId: this.siteStore.storeId,
        siteId: this.siteStore.msid,
        visitorId: this.siteStore.uuid as string,
        productId: product.id,
        appInstance: this.siteStore.instanceManager.getInstance(),
      },
      currency: this.siteStore.currency,
      locale: this.siteStore.locale,
      demoMode: this.siteStore.isEditorMode(),
    };
  }

  private getProductNameWithUserInputs(product: IProductDTO, userInputs: UserInput) {
    const options = userInputs.selection
      .map((selection, index) => `${product.options[index].title}: ${selection?.value}`)
      .join(', ');
    const freeTexts = userInputs.text
      .map((text, index) => `${product.customTextFields[index].title}: ${text}`)
      .join(', ');
    return `${product.name}${options ? ', ' : ''}${options}${freeTexts ? ', ' : ''}${freeTexts}`;
  }

  private readonly getCashierCartItems = (
    product: IProductDTO,
    paymentBreakdown: Pick<WidgetProps, 'paymentBreakdown'>,
    userInputs: UserInput
  ): OrderItem[] => {
    const quantity = userInputs.quantity[0];
    const price = _.round(Number(paymentBreakdown[BreakdownTypes.ItemsTotal]) / quantity, 2);
    return [
      {id: product.id, name: this.getProductNameWithUserInputs(product, userInputs), price: price.toString(), quantity},
    ];
  };

  public getPaymentBreakdown(
    product: IProductDTO,
    selectedVariant: IOptionSelectionVariant,
    userInputs: UserInput
  ): Pick<WidgetProps, 'paymentAmount' | 'paymentBreakdown' | 'orderItems'> {
    const quantity = ProductService.getQuantity(userInputs);
    const actualProduct = selectedVariant || product;
    const calculatedPrice = _.round((actualProduct.comparePrice || actualProduct.price) * quantity, 2);
    const {totals} = this.volatileCartService;
    const paymentBreakdown = {
      itemsTotal: (totals ? totals.subtotal || 0 : calculatedPrice).toString(),
      [BreakdownTypes.Shipping]: (totals?.shipping || 0).toString(),
      [BreakdownTypes.Tax]: (totals?.tax || 0).toString(),
      [BreakdownTypes.Discount]: (totals?.discount || 0).toString(),
    };

    const orderItems = this.getCashierCartItems(
      product,
      paymentBreakdown as unknown as Pick<WidgetProps, 'paymentBreakdown'>,
      userInputs
    );

    return {
      paymentAmount: (totals ? totals.total || 0 : calculatedPrice).toString(),
      paymentBreakdown,
      orderItems,
    };
  }

  public async handleCashierPaymentSubmit(
    paymentInfo: PaymentAuthorizedArgs,
    accessibilityEnabled: boolean,
    product: IProductDTO
  ): Promise<'success' | 'fail' | 'shouldNavigateToCheckout'> {
    const shouldRequestShipping = product.productType !== ProductType.DIGITAL;
    if (shouldRequestShipping) {
      await this.setCartShippingAddressAndDestination(paymentInfo);
    }
    await this.setCartBillingAddress(paymentInfo);

    const customFieldMandatory =
      this.siteStore.experiments.enabled(SPECS.FAST_FLOW_CUSTOM_FIELD) && this.isCustomFieldMandatory();
    const termsAndConditionsDisabled = !this.checkoutSettings.termsAndConditions.enabled;

    const cart = await this.volatileCartService.getCart();
    const notEnoughInfoAboutSubdivision = cart.cartService.cart.destinationCompleteness.includes('SUBDIVISION');
    const onlyOneShippingMethod = cart.cartService.cart.shippingRuleInfo?.shippingRule?.options.length === 1;
    const noMissingShippingData =
      !notEnoughInfoAboutSubdivision &&
      ((cart.cartService.cart.shippingRuleInfo?.canShipToDestination &&
        (this.canSelectShippingMethod || onlyOneShippingMethod)) ||
        !shouldRequestShipping);

    const canPayWithoutNavigatingToCheckout =
      termsAndConditionsDisabled && noMissingShippingData && !customFieldMandatory;
    if (canPayWithoutNavigatingToCheckout) {
      const placeOrderResponse = await this.placeOrder(paymentInfo);
      const wasPlaceOrderSuccessful = placeOrderResponse.cartStatus.success;
      const isFailedTransaction =
        placeOrderResponse.paymentResponse.transactionStatus === ServerTransactionStatus.Failed;

      if (!wasPlaceOrderSuccessful || isFailedTransaction) {
        return 'fail';
      }

      this.cashierExpressPaymentOrderId = placeOrderResponse.orderId;

      return 'success';
    } else {
      return 'shouldNavigateToCheckout';
    }
  }

  public async onCashierExpressPaymentSuccess() {
    await this.siteStore.navigate(
      {
        sectionId: PageMap.THANKYOU,
        queryParams: this.siteStore.experiments.enabled(SPECS.EXPRESS_CASHIER_BI_FIX)
          ? {objectType: 'order', origin: 'cashier-express-directly-to-typ'}
          : {objectType: 'order'},
        state: this.cashierExpressPaymentOrderId,
      },
      true
    );
  }

  private isCustomFieldMandatory() {
    return (
      this.checkoutSettings &&
      this.checkoutSettings.checkoutCustomField &&
      this.checkoutSettings.checkoutCustomField.mandatory &&
      this.checkoutSettings.checkoutCustomField.show
    );
  }

  private fetchCountryCodes() {
    return gqlStoreFrontQuery(this.siteStore, getCountryCodes, {}, graphqlOperation.GetCountryCodes);
  }

  private fetchCheckoutSettings() {
    return gqlQuery(this.siteStore, getCheckoutSettings, {}, graphqlOperation.GetCheckoutSettings);
  }

  public async fetchInitialData(product: IProductDTO, userInputs: UserInput) {
    const [checkoutSettings, countryCodes] = await Promise.all([
      this.fetchCheckoutSettings(),
      this.fetchCountryCodes(),
      this.volatileCartService.getStandaloneCheckoutIds(product, userInputs, CheckoutType.Cashier),
    ]);

    this.countryCodes = countryCodes.data.localeData.countries;
    this.checkoutSettings = checkoutSettings.data.checkoutSettings;
  }

  public async handleCashierOnClick(
    product: IProductDTO,
    directPurchaseService: DirectPurchaseService,
    userInputs: UserInput
  ): Promise<boolean> {
    this.canSelectShippingMethod = false;
    const canCheckout = await directPurchaseService.handleCashierOnClick(product);
    if (canCheckout) {
      await this.fetchInitialData(product, userInputs);
      await this.siteStore.biLogger.clickOnCheckoutWithEWalletSf({
        origin: 'product page',
        type: 'payPal',
        productsList: product.id,
        cartId: this.volatileCartService.cartId,
      });
    }

    return canCheckout;
  }

  public async onShippingMethodSelected(
    shippingMethod: ShippingMethod
  ): Promise<Pick<WidgetProps, 'paymentAmount' | 'paymentBreakdown'>> {
    await this.setShippingOption(shippingMethod);
    this.canSelectShippingMethod = true;

    const cart = await this.volatileCartService.getCart();
    const paymentAmount = cart.cartService.cart.totals.total.toString();
    const totals = cart.cartService.cart.totals;

    const paymentBreakdown: PaymentBreakdown = {
      shipping: totals.shipping.toString(),
      tax: totals.tax.toString(),
      discount: totals.discount.toString(),
      itemsTotal: totals.itemsTotal.toString(),
    };

    return {paymentAmount, paymentBreakdown};
  }

  public async fetchPaymentBreakdownForCashierAddress(
    shippingAddress: ShippingContactRestricted,
    translations
  ): Promise<ShippingContactSelectedUpdate> {
    const {country, subdivision, zipCode} = cashierExpressAddressToEcomAddress(shippingAddress, {}, this.countryCodes);

    await this.setShippingOptionForFastFlow(country, subdivision, zipCode);

    const cart = await this.volatileCartService.getCart();

    this.cashierExpressWidgetShippingRuleId = cart.cartService.cart.shippingRuleInfo.shippingRule?.id;
    const shippingMethods: ShippingMethod[] = cart.cartService.cart.shippingRuleInfo.shippingRule?.options.map(
      (shippingMethod) => {
        return {
          label: shippingMethod.title,
          amount: shippingMethod.rate.toString(),
          identifier: shippingMethod.id,
          detail:
            (shippingMethod.pickupInfo
              ? translate(translations['productPage.shippingOption.pickup.addressFormatSubdivision'], {
                  addressLine: shippingMethod.pickupInfo.address.addressLine,
                  city: shippingMethod.pickupInfo.address.city,
                  subdivision: shippingMethod.pickupInfo.address.subdivisionName,
                  country: shippingMethod.pickupInfo.address.countryName,
                  zipCode: shippingMethod.pickupInfo.address.zipCode,
                })
              : shippingMethod.deliveryTime) || '',
        };
      }
    );

    const notEnoughInfoAboutSubdivision = cart.cartService.cart.destinationCompleteness.includes('SUBDIVISION');

    const totals = cart.cartService.cart.totals;
    const initialPaymentBreakdown: PaymentBreakdown = {
      shipping: totals.shipping.toString(),
      tax: this.checkoutSettings.taxOnProduct ? '0' : totals.tax.toString(),
      discount: totals.discount.toString(),
      itemsTotal: totals.itemsTotal.toString(),
    };

    /* istanbul ignore else: todo(eran): test else */
    if (cart.cartService.cart.shippingRuleInfo.canShipToDestination || notEnoughInfoAboutSubdivision) {
      return {
        paymentAmount: cart.cartService.cart.totals.total.toString(),
        paymentBreakdown: initialPaymentBreakdown,
        shippingMethods,
      };
    } else {
      return {error: ShippingError.SHIPPING_ADDRESS_UNSERVICEABLE};
    }
  }

  private async setShippingOptionForFastFlow(country: string, subdivision: string, zipCode: string): Promise<void> {
    const {cartId, checkoutId} = this.volatileCartService;
    const address = {
      country,
      subdivision,
      zipCode,
    };

    await this.checkoutApi.setCartShippingAddressesForFastFlowEstimation(cartId, address, checkoutId);
  }

  private placeOrder(paymentInfo: PaymentAuthorizedArgs): Promise<PlaceOrderResponse> {
    const params: IPlaceOrderParams = {
      cartId: this.volatileCartService.cartId,
      paymentId: paymentInfo.detailsId,
      shouldRedirect: true,
      isPickupFlow: false,
      inUserDomain: true,
      forceLocale: this.siteStore.locale,
      deviceType: this.siteStore.isMobile() ? 'mobile' : 'desktop',
    };

    // todo(erans@wix.com,titk@wix.com): coverage broken after apply of the test fix
    // https://github.com/wix-private/ecom/commit/daa77c51e97c079f8cac55b2adb1ae4106ae5dc1
    // istanbul ignore if
    if (this.volatileCartService.checkoutId) {
      params.checkoutId = this.volatileCartService.checkoutId;
    }

    return this.checkoutApi.placeOrder(params);
  }

  private async setCartBillingAddress(paymentInfo: PaymentAuthorizedArgs): Promise<void> {
    const billingAddress = cashierExpressAddressToEcomAddress({}, paymentInfo.billingContact, this.countryCodes);
    const {cartId, checkoutId} = this.volatileCartService;

    await this.checkoutApi.setCartBillingAddress(cartId, billingAddress, checkoutId);
  }

  private async setCartShippingAddressAndDestination(paymentInfo: PaymentAuthorizedArgs): Promise<void> {
    const {cartId, checkoutId} = this.volatileCartService;
    const address = cashierExpressAddressToEcomAddress(
      paymentInfo.shippingContact,
      paymentInfo.billingContact,
      this.countryCodes
    );

    await this.checkoutApi.setCartShippingAddressAndDestination(cartId, address, checkoutId);
  }

  private async setShippingOption(shippingMethod: ShippingMethod): Promise<void> {
    const {cartId, checkoutId} = this.volatileCartService;
    const selectedShippingOption = {
      shippingRuleId: this.cashierExpressWidgetShippingRuleId,
      optionId: shippingMethod.identifier,
    };

    await this.checkoutApi.setShippingOption({cartId, selectedShippingOption, checkoutId});
  }
}
