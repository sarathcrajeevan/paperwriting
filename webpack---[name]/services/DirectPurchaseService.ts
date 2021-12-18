import {ErrorNames, productPageFedopsEvent} from '../constants';
import {BiButtonActionType} from '@wix/wixstores-client-core/dist/es/src/constants';
import {VolatileCartService} from './VolatileCartService';
import {CheckoutService} from './CheckoutService';
import {
  CheckoutStageWithCartParams,
  ICanCheckoutResponse,
  IProductDTO,
  IPropsInjectedByViewerScript,
  UserInput,
} from '../types/app-types';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {MultilingualService} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/MultilingualService/MultilingualService';
import {StoreMetaDataService} from './StoreMetaDataService';
import _ from 'lodash';

export enum CheckoutType {
  BuyNow = 'buyNow',
  Subscribe = 'subscriptionPlans',
  Cashier = 'cashier',
}

export class DirectPurchaseService {
  private readonly checkoutService: CheckoutService;
  private readonly volatileCartService: VolatileCartService;

  constructor(
    private readonly siteStore: SiteStore,
    private readonly reportError: (e) => any,
    private readonly reportButtonAction: (buttonType: BiButtonActionType) => void,
    private readonly nextProps: (additionalProps: Partial<IPropsInjectedByViewerScript>) => void,
    private readonly fedopsLogger: any,
    private readonly trackEvent: ({cartId}: {cartId: string}) => void,
    private readonly onSuccess: Function,
    private readonly isEditorX: boolean,
    private readonly multilingualService: MultilingualService,
    private readonly storeMetaDataService: StoreMetaDataService
  ) {
    this.volatileCartService = new VolatileCartService(
      this.siteStore.httpClient,
      this.siteStore,
      this.storeMetaDataService
    );
    this.checkoutService = new CheckoutService(
      this.siteStore,
      this.nextProps,
      this.isEditorX,
      this.multilingualService,
      this.storeMetaDataService
    );
  }

  private readonly getPathFromUrl = (url: string) => {
    return url.split(/[?#]/)[0];
  };

  public handleError = (): void => {
    this.nextProps({errors: {errorName: ErrorNames.StoreInfoError}});
  };

  public handleCashierOnClick = async (product: IProductDTO): Promise<boolean> => {
    const canCheckoutResponse: ICanCheckoutResponse = await this.checkoutService.checkIsAllowedToCheckout(product);

    if (!canCheckoutResponse.canCheckout) {
      //eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.checkoutService.openModalByType(canCheckoutResponse.modalType);
      return false;
    }

    return true;
  };

  public handleBuyNow = async (
    accessibilityEnabled: boolean,
    product: IProductDTO,
    userInputs: UserInput
  ): Promise<void> => {
    const canCheckoutResponse: ICanCheckoutResponse = await this.checkoutService
      .checkIsAllowedToCheckout(product)
      .catch((e) => {
        this.reportError(e);
        return {} as ICanCheckoutResponse;
      });

    if (_.isEmpty(canCheckoutResponse)) {
      this.handleError();
      return;
    }

    this.reportButtonAction(BiButtonActionType.BuyNow);

    if (!canCheckoutResponse.canCheckout) {
      //eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.fedopsLogger.interactionEnded(productPageFedopsEvent.BuyNow);
      //eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.checkoutService.openModalByType(canCheckoutResponse.modalType);
    } else {
      return this.handleCheckoutStage(accessibilityEnabled, product, userInputs, CheckoutType.BuyNow);
    }
  };

  public handleSubscribe = async (
    accessibilityEnabled: boolean,
    product: IProductDTO,
    userInputs: UserInput
  ): Promise<void> => {
    const canCheckoutResponse: ICanCheckoutResponse = await this.checkoutService
      .checkIsAllowedToCheckout(product, true)
      .catch((e) => {
        this.reportError(e);
        return {} as ICanCheckoutResponse;
      });

    if (_.isEmpty(canCheckoutResponse)) {
      this.handleError();
      return;
    }

    this.reportButtonAction(BiButtonActionType.Subscribe);

    if (!canCheckoutResponse.canCheckout) {
      //eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.fedopsLogger.interactionEnded(productPageFedopsEvent.Subscribe);
      //eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.checkoutService.openModalByType(canCheckoutResponse.modalType);
    } else {
      return this.handleCheckoutStage(accessibilityEnabled, product, userInputs, CheckoutType.Subscribe);
    }
  };

  public handleCheckoutStage = async (
    accessibilityEnabled: boolean,
    product: IProductDTO,
    userInputs: UserInput,
    checkoutType: CheckoutType
  ) => {
    const {cartId, checkoutId} = await this.volatileCartService
      .getStandaloneCheckoutIds(product, userInputs, checkoutType)
      .catch(this.reportError);

    this.trackEvent({cartId});

    await this.handleCheckoutStageWithExistingCart({accessibilityEnabled, cartId, checkoutType, checkoutId});
  };

  public handleCheckoutStageWithExistingCart = async ({
    accessibilityEnabled,
    cartId,
    checkoutType,
    cashierPaymentId,
    checkoutId,
  }: CheckoutStageWithCartParams) => {
    if (checkoutType) {
      this.fedopsLogger.interactionEnded(
        checkoutType === CheckoutType.Subscribe ? productPageFedopsEvent.Subscribe : productPageFedopsEvent.BuyNow
      );
    }

    const [thankYouPageSectionUrl, cartPageSectionUrl, checkoutUrl] = await Promise.all([
      this.siteStore.getSectionUrl(this.siteStore.pageMap.thankyou),
      this.siteStore.getSectionUrl(this.siteStore.pageMap.cart),
      this.siteStore.getSectionUrl(this.siteStore.pageMap.checkout),
    ]).catch(this.reportError);

    const checkoutRelativeUrl = checkoutUrl.relativeUrl;
    const thankYouPageUrl = this.getPathFromUrl(thankYouPageSectionUrl.url);
    const cartPageUrl = this.getPathFromUrl(cartPageSectionUrl.url);
    const deviceType = this.siteStore.isDesktop()
      ? /* istanbul ignore next: todo(ariel): test this */ 'desktop'
      : 'mobile';

    await this.checkoutService.navigateToCheckout({
      cartId,
      isFastFlow: false,
      checkoutRelativeUrl,
      siteBaseUrl: this.siteStore.location.baseUrl,
      thankYouPageUrl,
      cartUrl: cartPageUrl,
      paymentMethodName: undefined,
      locale: this.siteStore.locale,
      deviceType,
      a11y: accessibilityEnabled,
      originType: checkoutType,
      cashierPaymentId,
      checkoutId,
    });

    await this.onSuccess();
  };
}
