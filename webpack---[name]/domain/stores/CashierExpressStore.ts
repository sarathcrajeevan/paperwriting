import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {APP_DEFINITION_ID, PageMap, ServerTransactionStatus} from '@wix/wixstores-client-core/dist/es/src/constants';
import {WithResultObservation} from '../../hooks/useFunctionResultObservation.worker';
import {
  OnPaymentAuthorizedResult,
  OnShippingContactSelected,
  PaymentAuthorizedArgs,
} from '@wix/cashier-express-checkout-widget/src/types/ExternalContract';
import {CartService} from '../services/CartService';
import {cashierExpressAddressToEcomAddress} from '@wix/wixstores-client-storefront-sdk/dist/es/src/utils/cart/cashierExpressAddressToEcomAddress/cashierExpressAddressToEcomAddress';
import {
  CashierCheckoutDataApi,
  ICashierCheckoutDataApi,
} from '@wix/wixstores-client-storefront-sdk/dist/es/src/apis/CashierCheckoutDataApi/CashierCheckoutDataApi';
import {ShippingError} from '@wix/cashier-express-checkout-widget/dist/src/types/Shipping';
import {BreakdownTypes, PaymentBreakdown} from '@wix/cashier-express-checkout-widget/dist/src/types/PaymentBreakdown';
import {CheckoutNavigationService} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/CheckoutNavigationService/CheckoutNavigationService';
import {StoreMetaDataService} from '../services/StoreMetaDataService';
import {OriginTypes} from '../../components/cart/constants';
import {ButtonStyle, Shape, Theme} from '@wix/cashier-express-checkout-widget/dist/src/types/Styles';
import {StyleSettingsService} from '../services/StyleSettingsService';
import {BIService} from '../services/BIService';
import {OrderService} from '../services/OrderService';
import {ButtonSkins, ICart} from '../../types/app.types';
import {NavigationService} from '../services/NavigationService';
import {ModalManagerService} from '../services/ModalManagerService';
import {SPECS} from '../specs';
import {CheckoutInfo} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/CheckoutNavigationService/appTypes';
import _ from 'lodash';
import {QueryParamsService} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/QueryParamsService/QueryParamsService';
import {ElementOf} from 'ts-essentials';
import {hasFreeText} from '../utils/itemUtils';
import {PlaceOrderResponse} from '@wix/wixstores-client-storefront-sdk/dist/es/src/apis/CartApi/types';
import {
  DynamicPaymentMethodsShape,
  DynamicPaymentMethodsTheme,
} from '@wix/wixstores-client-storefront-sdk/dist/es/src/enums/productPageSettings.enums';
import {MinimumOrderAmountService} from '../services/MinimumOrderAmountService';

export class CashierExpressStore {
  private readonly cartService: CartService;
  private readonly navigationService: NavigationService;
  private readonly checkoutNavigationService: CheckoutNavigationService;
  private readonly storeMetaDataService: StoreMetaDataService;
  private readonly biService: BIService;
  private readonly orderService: OrderService;
  private readonly modalManagerService: ModalManagerService;
  private readonly minimumOrderAmountService: MinimumOrderAmountService;
  private countryCodes: ICashierCheckoutDataApi['countries'];
  private isTermsAndConditionsEnabled: boolean;
  private isCustomFieldRequired: boolean;

  constructor(
    private readonly siteStore: SiteStore,
    {
      cartService,
      checkoutNavigationService,
      storeMetaDataService,
      biService,
      orderService,
      navigationService,
      modalManagerService,
      minimumOrderAmountService,
    }: {
      cartService: CartService;
      checkoutNavigationService: CheckoutNavigationService;
      storeMetaDataService: StoreMetaDataService;
      biService: BIService;
      orderService: OrderService;
      navigationService: NavigationService;
      modalManagerService: ModalManagerService;
      minimumOrderAmountService: MinimumOrderAmountService;
    },
    private readonly styleSettingsService: StyleSettingsService,
    private readonly withResultObservation: WithResultObservation
  ) {
    this.cartService = cartService;
    this.checkoutNavigationService = checkoutNavigationService;
    this.navigationService = navigationService;
    this.storeMetaDataService = storeMetaDataService;
    this.orderService = orderService;
    this.biService = biService;
    this.modalManagerService = modalManagerService;
    this.minimumOrderAmountService = minimumOrderAmountService;
  }

  private get cashierExpressEnabled() {
    return this.cartService.areAllItemsInStock;
  }

  private readonly fetchCashierCheckoutDataIfNeeded = async () => {
    if (this.countryCodes) {
      return;
    }
    const response = await new CashierCheckoutDataApi({siteStore: this.siteStore, origin: ''}).getCashierCheckoutData();
    this.countryCodes = response.countries;
    this.isTermsAndConditionsEnabled = response.termsAndConditions?.enabled;
    this.isCustomFieldRequired = response.checkoutCustomField?.show && response.checkoutCustomField.mandatory;
  };

  private readonly handlePaymentMethodError = () => {
    const queryParamsService = new QueryParamsService(this.siteStore);
    const pmName = queryParamsService.getQueryParam('pmName');
    const pmUrl = queryParamsService.getQueryParam('pmUrl') ?? '';

    if (pmName !== undefined && pmName !== '') {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.modalManagerService.modalManger.openErrorWithPaymentMethod({
        pmName: pmName.replace(/\//g, ''),
        pmUrl: pmUrl.replace(/\//g, ''),
      });
    }
  };

  private readonly onClick = async () => {
    this.navigationService.isNavigationToCheckoutInProcess = true;

    await this.fetchCashierCheckoutDataIfNeeded();

    const paymentMethods = (await this.storeMetaDataService.get()).activePaymentMethods;
    this.biService.clickOnCheckoutWithEWalletSf(this.cartService.cart, this.cartService.cartType, paymentMethods);

    const {hasCreatedPaymentMethods, canStoreShip, isPremium} = await this.storeMetaDataService.get();
    const {canCheckout, modalType} = this.checkoutNavigationService.checkIsAllowedToCheckout({
      areAllItemsDigital: this.cartService.isDigitalCart,
      isPremium,
      canStoreShip,
      hasCreatedPaymentMethods,
      canShipToDestination: true,
    });

    if (!canCheckout) {
      /* eslint-disable @typescript-eslint/no-floating-promises */
      this.checkoutNavigationService.openModalByType(
        modalType,
        this.styleSettingsService.isEditorX,
        this.cartService.cart
      );
      this.navigationService.isNavigationToCheckoutInProcess = false;
      return Promise.resolve({canceled: true});
    }
    await this.cartService.createCheckout();
    setTimeout(() => (this.navigationService.isNavigationToCheckoutInProcess = false), 5_000);
    return Promise.resolve({canceled: false});
  };

  private readonly onShippingContactSelected: OnShippingContactSelected = async (shippingContact) => {
    const {country, subdivision, zipCode} = cashierExpressAddressToEcomAddress(shippingContact, {}, this.countryCodes);
    const cartId = this.cartService.cart.cartId;
    await this.cartService.setShippingAddressesForFastFlow({cartId, country, subdivision, zipCode});
    const cart = await this.cartService.fetchCartWithTaxAndShippingIncluded();
    const notEnoughInfoAboutSubdivision = cart.destinationCompleteness.includes('SUBDIVISION');

    const totals = cart.totals;

    const initialPaymentBreakdown: PaymentBreakdown = {
      [BreakdownTypes.Shipping]: totals.shipping.toString(),
      //todo(EE-30329): we can't test this right now, waiting for PAY-7283
      [BreakdownTypes.Tax]: this.orderService.taxOnProduct ? '0' : totals.tax.toString(),
      [BreakdownTypes.Discount]: totals.discount.toString(),
      [BreakdownTypes.ItemsTotal]: totals.itemsTotal.toString(),
    };

    const hasShippingRules = this.orderService.hasShippingRules;

    if (cart.shippingRuleInfo.canShipToDestination || notEnoughInfoAboutSubdivision || hasShippingRules) {
      return {
        paymentAmount: cart.totals.total.toString(),
        paymentBreakdown: initialPaymentBreakdown,
      };
    } else {
      return {error: ShippingError.SHIPPING_ADDRESS_UNSERVICEABLE};
    }
  };

  private readonly onPaymentAuthorized = async (
    paymentInfo: PaymentAuthorizedArgs,
    accessibilityEnabled: boolean
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ): Promise<OnPaymentAuthorizedResult> => {
    /* istanbul ignore if - can't test with current cashier testKit */
    if (paymentInfo.error) {
      throw paymentInfo.error;
    }

    const paymentMethods = (await this.storeMetaDataService.get()).activePaymentMethods;

    this.biService.clickContinueEWalletModalSf(this.cartService.cart, this.cartService.cartType, paymentMethods);
    this.cartService.trackInitiateCheckout();

    const shouldRequestShipping = this.shouldRequestShipping();

    if (this.siteStore.experiments.enabled(SPECS.PaypalUpdateShippingAndBilling)) {
      const setShipping = shouldRequestShipping
        ? this.cartService.setCartShippingAddressAndDestination(
            this.cartService.cart.cartId,
            cashierExpressAddressToEcomAddress(
              paymentInfo.shippingContact,
              paymentInfo.billingContact,
              this.countryCodes
            )
          )
        : Promise.resolve();

      await setShipping;
      await this.cartService.setCartBillingAddress(
        this.cartService.cart.cartId,
        cashierExpressAddressToEcomAddress({}, paymentInfo.billingContact, this.countryCodes)
      );
    } else {
      // eslint-disable-next-line no-lonely-if
      if (shouldRequestShipping) {
        await this.cartService.setCartAddress({
          cartId: this.cartService.cart.cartId,
          address: cashierExpressAddressToEcomAddress(
            paymentInfo.shippingContact,
            paymentInfo.billingContact,
            this.countryCodes
          ),
        });
      } else {
        await this.cartService.setCartBillingAddress(
          this.cartService.cart.cartId,
          cashierExpressAddressToEcomAddress({}, paymentInfo.billingContact, this.countryCodes)
        );
      }
    }

    await this.cartService.fetchCart();
    const cart = this.cartService.cart;
    const notEnoughInfoAboutSubdivision = this.cartService.cart.destinationCompleteness.includes('SUBDIVISION');
    const onlyOneShippingMethod = this.siteStore.experiments.enabled(
      SPECS.CashierExpressNavigateToThankYouPageWhen1ShippingMethod
    )
      ? _.get(this.cartService.cart, 'shippingRuleInfo.shippingRule.options', []).length === 1
      : false;
    const missingShippingData = shouldRequestShipping && !onlyOneShippingMethod;
    const isCustomFieldRequiredWithExperiment =
      this.siteStore.experiments.enabled(SPECS.FastFlowCustomField) && this.isCustomFieldRequired;
    const canPayWithoutNavigatingToCheckout =
      !missingShippingData &&
      !this.isTermsAndConditionsEnabled &&
      !notEnoughInfoAboutSubdivision &&
      !isCustomFieldRequiredWithExperiment;

    if (canPayWithoutNavigatingToCheckout) {
      const placeOrderResponse = await this.cartService.placeOrder({
        cartId: cart.cartId,
        paymentId: paymentInfo.detailsId,
        shouldRedirect: true,
        isPickupFlow: false,
        inUserDomain: true,
        forceLocale: this.siteStore.locale,
        deviceType: this.siteStore.isMobile() ? 'mobile' : 'desktop',
        ...(this.cartService.checkoutId ? {checkoutId: this.cartService.checkoutId} : {}),
      });
      const wasPlaceOrderSuccessful = placeOrderResponse.cartStatus.success;
      const isFailedTransaction = this.isNotValidTransaction(placeOrderResponse);

      if (!wasPlaceOrderSuccessful || isFailedTransaction) {
        //log errors
        return {result: 'error'};
      }

      // eslint-disable-next-line @typescript-eslint/no-floating-promises - awating navigation will prevent the function from returning a value
      this.siteStore.navigate(
        {
          sectionId: PageMap.THANKYOU,
          queryParams: this.siteStore.experiments.enabled(SPECS.EXPRESS_CASHIER_BI_FIX)
            ? {objectType: 'order', origin: 'cashier-express-directly-to-typ'}
            : {objectType: 'order', origin: 'cart-cashier'},
          state: placeOrderResponse.orderId,
        },
        true
      );
    } else {
      const navigationArgs: CheckoutInfo = {
        a11y: accessibilityEnabled,
        cartId: cart.cartId,
        cashierPaymentId: paymentInfo.detailsId,
        deviceType: this.siteStore.isMobile() ? 'mobile' : 'desktop',
        isFastFlow: false,
        isPickupOnly: !this.shouldRequestShipping(),
        locale: this.siteStore.locale,
        originType: OriginTypes.Paypal,
        siteBaseUrl: this.siteStore.location.baseUrl,
        ...(this.cartService.checkoutId ? {checkoutId: this.cartService.checkoutId} : {}),
      };

      await this.checkoutNavigationService.navigateToCheckout(navigationArgs);
    }

    return {result: 'success'};
  };

  private isNotValidTransaction(placeOrderResponse: PlaceOrderResponse): boolean {
    const isFailedStatus = placeOrderResponse.paymentResponse.transactionStatus === ServerTransactionStatus.Failed;
    const isDeclinedStatus = placeOrderResponse.paymentResponse.transactionStatus === ServerTransactionStatus.Declined;
    return isFailedStatus || isDeclinedStatus;
  }

  private shouldRequestShipping(): boolean {
    const isDigitalCart = this.cartService.isDigitalCart;
    const isPickup = this.orderService.isPickup;
    return !(isDigitalCart || isPickup);
  }

  private getButtonStyleOld(): ButtonStyle {
    if (!this.styleSettingsService.cornerRadius) {
      return {shape: 'rect' as Shape, height: 42};
    }
    if (
      this.styleSettingsService.cornerRadius.value === '0px' ||
      this.styleSettingsService.cornerRadius.value === '5px'
    ) {
      return {shape: 'rect' as Shape, height: 42};
    }
    return {shape: 'pill' as Shape, height: 42};
  }
  private getButtonStyle(): ButtonStyle {
    return {
      shape: this.styleSettingsService.dynamicPaymentMethodsShape === DynamicPaymentMethodsShape.pill ? 'pill' : 'rect',
      height: 42,
    };
  }

  private getButtonThemeOld(): Theme {
    if (!this.styleSettingsService.selectedSkin) {
      return 'dark';
    }
    if (
      this.styleSettingsService.selectedSkin.value === ButtonSkins.BUTTON_SKIN_1 ||
      this.styleSettingsService.selectedSkin.value === ButtonSkins.BUTTON_SKIN_2 ||
      this.styleSettingsService.selectedSkin.value === ButtonSkins.BUTTON_SKIN_3
    ) {
      return 'dark';
    }
    return 'light';
  }

  private getButtonTheme(): Theme {
    return this.styleSettingsService.dynamicPaymentMethodsTheme === DynamicPaymentMethodsTheme.light ? 'light' : 'dark';
  }

  private getProps() {
    return {
      handlePaymentMethodError: this.handlePaymentMethodError,
      shouldShowDynamicPaymentOptions: !this.minimumOrderAmountService.shouldDisableCheckout,
      ...this.withResultObservation({
        onClick: this.onClick,
        onShippingContactSelected: this.onShippingContactSelected,
        onPaymentAuthorized: this.onPaymentAuthorized,
      }),
      dynamicPaymentOptionsProps: {
        currency: this.siteStore.currency,
        meta: {
          appDefId: APP_DEFINITION_ID,
          appInstanceId: this.siteStore.storeId,
          appInstance: this.siteStore.instanceManager.getInstance(),
          siteId: this.siteStore.msid,
          visitorId: this.siteStore.uuid as string,
        },
        demoMode: this.siteStore.isEditorMode(),
        locale: this.siteStore.locale,
        domain: this.siteStore.location.baseUrl,
        orderItems: this.getOrderItems(),
        buttonStyle: this.siteStore.experiments.enabled(SPECS.SeparatePaymentsStyleCart)
          ? this.getButtonStyle()
          : this.getButtonStyleOld(),
        getButtonTheme: this.siteStore.experiments.enabled(SPECS.SeparatePaymentsStyleCart)
          ? this.getButtonTheme()
          : this.getButtonThemeOld(),
        shouldRequestShipping: this.shouldRequestShipping(),
      },
    };
  }

  private getProductNameWithOptions(item: ElementOf<ICart['items']>) {
    const getTitleAndValueString = (option: {title: string; value: string}) => `${option.title}: ${option.value}`;
    const hasOptions = item.optionsSelectionsValues.length > 0;

    return `${item.product.name}${hasOptions ? ', ' : ''}${item.optionsSelectionsValues
      .map(getTitleAndValueString)
      .join(', ')}${hasFreeText(item) ? ', ' : ''}${
      hasFreeText(item) ? item.freeText.map(getTitleAndValueString).join(', ') : ''
    }`;
  }

  private getOrderItems() {
    return this.cartService.cart.items.map((item) => ({
      id: item.cartItemId.toString(),
      name: this.getProductNameWithOptions(item),
      price: item.product.price.toString(),
      quantity: item.quantity,
      category: item.product.productType as 'physical' | 'digital',
    }));
  }

  public toProps(): Partial<ReturnType<CashierExpressStore['getProps']>> {
    if (this.cashierExpressEnabled) {
      return this.getProps();
    }

    return {
      shouldShowDynamicPaymentOptions: false,
      handlePaymentMethodError: this.handlePaymentMethodError,
    };
  }
}
