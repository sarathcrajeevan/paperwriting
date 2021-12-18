import {ICartControllerApi, ICartItem} from '../../types/app.types';
import {CartService} from '../services/CartService';
import {ProductsService} from '../services/ProductsService';
import {BIService} from '../services/BIService';
import {StoreMetaDataService} from '../services/StoreMetaDataService';
import {FedopsInteractions} from '../../components/cart/constants';
import {StyleSettingsService} from '../services/StyleSettingsService';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {SPECS} from '../specs';
import {MinimumOrderAmountService} from '../services/MinimumOrderAmountService';

export class CartStore {
  private readonly biService: BIService;
  private readonly cartService: CartService;
  private readonly productsService: ProductsService;
  private readonly controllerApi: ICartControllerApi;
  private readonly storeMetaDataService: StoreMetaDataService;
  private readonly styleSettingsService: StyleSettingsService;
  private readonly minimumOrderAmountService: MinimumOrderAmountService;
  private screenReaderMessage: string;

  constructor(
    controllerApi: ICartControllerApi,
    private readonly siteStore: SiteStore,
    {
      biService,
      cartService,
      productsService,
      storeMetaDataService,
      styleSettingsService,
      minimumOrderAmountService,
    }: {
      biService: BIService;
      cartService: CartService;
      productsService: ProductsService;
      storeMetaDataService: StoreMetaDataService;
      styleSettingsService: StyleSettingsService;
      minimumOrderAmountService: MinimumOrderAmountService;
    }
  ) {
    this.controllerApi = controllerApi;
    this.biService = biService;
    this.cartService = cartService;
    this.productsService = productsService;
    this.storeMetaDataService = storeMetaDataService;
    this.styleSettingsService = styleSettingsService;
    this.minimumOrderAmountService = minimumOrderAmountService;
  }

  private readonly updateItemQuantity = async (cartItemId: number, quantity: number, productId: string) => {
    if (this.siteStore.experiments.enabled(SPECS.UseCommonProductLineItem)) {
      const cartItem = this.cart.items.find((item) => item.cartItemId === cartItemId);
      cartItem.quantity = quantity;
      await this.controllerApi.updateComponent();
    }

    return this.controllerApi.reportFedopsInteraction(FedopsInteractions.UpdateQuantityInCart, () =>
      this.cartService.updateItemQuantity(cartItemId, quantity, productId)
    );
  };

  private readonly removeItemFromCart = (item: ICartItem) => {
    this.screenReaderMessage = this.controllerApi.t('cart.sr_item_was_removed', {item_name: item.product.name});
    return this.controllerApi.reportFedopsInteraction(FedopsInteractions.RemoveItemFromCart, () =>
      this.cartService.removeItemFromCart(item)
    );
  };

  private readonly applyCoupon = async (code: string) => {
    this.cartService.clearCouponError();
    await this.controllerApi.updateComponent();

    await this.controllerApi.reportFedopsInteraction(FedopsInteractions.ApplyCouponInOrder, () =>
      this.cartService.applyCoupon(code).catch(() => this.controllerApi.updateComponent())
    );
  };

  private readonly removeCoupon = () => {
    return this.controllerApi.reportFedopsInteraction(FedopsInteractions.ApplyCouponInOrder, () =>
      this.cartService.removeCoupon()
    );
  };

  private readonly sendToggleCouponBi = () => {
    return this.biService.clickOnApplyPromotionalCodeSf(this.cart);
  };

  private readonly sendAddNoteBi = () => {
    return this.biService.clickOnAddNoteToSellerSf(this.cart);
  };

  private readonly sendMinimumOrderMessageShownBi = (buttonEnabled: boolean) => {
    return this.biService.minimumOrderMessageIsShownInCart(this.cart, buttonEnabled);
  };

  private readonly updateBuyerNote = (...args: Parameters<CartService['updateBuyerNote']>) => {
    return this.cartService.updateBuyerNote(...args);
  };

  private get cart() {
    return this.cartService.cart;
  }

  private readonly getProductsManifest = () => {
    return this.productsService.manifest(this.cartService.cart);
  };

  private async isCheckoutRegularFlowEnabled() {
    const [hasRegularFlowPaymentMethods, hasNoPaymentMethods] = await Promise.all([
      this.storeMetaDataService.hasRegularFlowPaymentMethods(),
      this.storeMetaDataService.hasAnyPaymentMethods().then((hasAnyPaymentMethods) => !hasAnyPaymentMethods),
    ]);

    return hasRegularFlowPaymentMethods || hasNoPaymentMethods || this.cartService.isZeroCart;
  }

  private get isCartValid(): boolean {
    return this.cartService.areAllItemsInStock;
  }

  public async toProps() {
    if (this.cartService.isEmpty) {
      return {
        shouldRenderEmptyState: true,
      };
    }

    return {
      cart: this.cart,
      isDigitalCart: this.cartService.isDigitalCart,
      isCheckoutRegularFlowEnabled: await this.isCheckoutRegularFlowEnabled(),
      manifest: await this.getProductsManifest(),
      applyCoupon: this.applyCoupon,
      removeCoupon: this.removeCoupon,
      couponError: this.cartService.couponError,
      sendToggleCouponBi: this.sendToggleCouponBi,
      removeItemFromCart: this.removeItemFromCart,
      sendAddNoteBi: this.sendAddNoteBi,
      sendMinimumOrderMessageShownBi: this.sendMinimumOrderMessageShownBi,
      updateBuyerNote: this.updateBuyerNote,
      updateItemQuantity: this.updateItemQuantity,
      screenReaderMessage: this.screenReaderMessage,
      isCartValid: this.isCartValid,
      shouldShowCoupon: this.siteStore.experiments.enabled('specs.stores.UseShowCouponStyleParam')
        ? this.styleSettingsService.shouldShowCoupon
        : true,
      shouldPresentTooltipWithoutNumber: this.siteStore.experiments.enabled(SPECS.CartTooltipWithoutNumber),
      shouldUseCommonProductLineItem: this.siteStore.experiments.enabled(SPECS.UseCommonProductLineItem),
      shouldShowBuyerNote: this.styleSettingsService.shouldShowBuyerNote,
      shouldShowMinimumOrderAmount: this.minimumOrderAmountService.shouldDisplayNotification,
    };
  }
}
