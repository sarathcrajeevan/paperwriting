import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {ProductApi} from '../services/ProductApi';
import {IProductDTO, IPropsInjectedByViewerScript} from '../types/app-types';
import {ADD_TO_CART_FEDOPS_INTERACTION, originPage, PUBLIC_DATA_KEYS, translationPath} from '../constants';
import {getTranslations, isWorker} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/utils';
import {IControllerConfig} from '@wix/native-components-infra/dist/es/src/types/types';
import {MultilingualService} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/MultilingualService/MultilingualService';
import {APP_DEFINITION_ID, BiButtonActionType} from '@wix/wixstores-client-core/dist/es/src/constants';
import {AddToCartActionOption} from '@wix/wixstores-client-core/dist/src/constants';
import {
  actualPrice,
  actualSku,
  hasSubscriptionPlans,
} from '@wix/wixstores-client-core/dist/es/src/productOptions/productUtils';
import {AddToCartService} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/AddToCartService/AddToCartService';
import {AddToCartState} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/AddToCartService/constants';
import {QuickViewActions} from '@wix/wixstores-client-storefront-sdk/dist/es/src/actions/QuickViewActions/QuickViewActions';
import {CartActions} from '@wix/wixstores-client-storefront-sdk/dist/es/src/actions/CartActions/CartActions';

export class AddToCartStore {
  private readonly productApi: ProductApi;
  private product: IProductDTO;
  private translations;
  private multilingualService: MultilingualService;
  private shouldReportFedops: boolean = true;
  private readonly cartActions: CartActions;
  private readonly quickviewActions: QuickViewActions;
  private readonly fedopsLogger;
  private readonly addToCartService: AddToCartService;

  constructor(
    private readonly publicData: IControllerConfig['publicData'],
    private readonly setProps: Function,
    private readonly siteStore: SiteStore,
    private readonly externalId: string,
    private readonly reportError: (e) => any,
    private readonly compId: string,
    private readonly type: string
  ) {
    const fedopsLoggerFactory = this.siteStore.platformServices.fedOpsLoggerFactory;
    this.fedopsLogger = fedopsLoggerFactory.getLoggerForWidget({
      appId: APP_DEFINITION_ID,
      widgetId: this.type,
    });

    if (isWorker()) {
      this.fedopsLogger.appLoadStarted();
    }

    this.cartActions = new CartActions({siteStore: this.siteStore, origin: originPage});
    this.quickviewActions = new QuickViewActions(this.siteStore);
    this.productApi = new ProductApi(this.siteStore);
    this.addToCartService = new AddToCartService(this.siteStore, publicData);
  }

  public async setInitialState(): Promise<void> {
    const productId = this.publicData.COMPONENT && this.publicData.COMPONENT[PUBLIC_DATA_KEYS.PRODUCT_ID];
    const isDefaultProduct: boolean = !productId;
    const productQueryPromise: any = () =>
      isDefaultProduct
        ? this.productApi.getDefaultProduct(this.externalId)
        : this.productApi.getProductById(this.externalId, productId);

    const [translations, {data}] = await Promise.all([
      getTranslations(translationPath(this.siteStore.baseUrls.addToCartBaseUrl, this.siteStore.locale)),
      productQueryPromise(),
    ]).catch(this.reportError);

    this.translations = translations;

    /* istanbul ignore next: hard to test it */
    this.multilingualService = new MultilingualService(
      this.siteStore,
      this.publicData.COMPONENT,
      data.appSettings.widgetSettings
    );

    this.product = isDefaultProduct ? data.catalog.products.list[0] : (this.product = data.catalog.product);
    const propsToInject = this.product ? this.getPropsToInject() : this.getEmptyStatePropsToInject();
    this.setProps(propsToInject);

    if (this.siteStore.isSSR()) {
      this.fedopsLogger.appLoaded();
    }
  }

  public updateState(newPublicData: IControllerConfig['publicData'] & {appSettings?: any}): void {
    this.updatePublicData(newPublicData);
    this.multilingualService.setPublicData(this.publicData.COMPONENT);
    this.multilingualService.setWidgetSettings(newPublicData.appSettings);

    const propsToInject = this.product ? this.getPropsToInject() : this.getEmptyStatePropsToInject();
    this.setProps({
      ...propsToInject,
    });
  }

  private getInjectedFunctions() {
    return {
      handleAddToCart: this.handleAddToCart.bind(this),
      onAppLoaded: this.onAppLoaded.bind(this),
    };
  }

  private getPropsToInject(): IPropsInjectedByViewerScript {
    return {
      shouldDisableButton: this.isButtonDisabled(),
      buttonText: this.getButtonText(),
      ...this.getInjectedFunctions(),
    };
  }

  private getEmptyStatePropsToInject(): IPropsInjectedByViewerScript {
    const shouldDisableButton = !this.siteStore.isEditorMode();
    return {
      shouldDisableButton,
      buttonText:
        this.multilingualService.get(PUBLIC_DATA_KEYS.BUTTON_TEXT) || this.translations['addPanel.addToCart.button'],
      ...this.getInjectedFunctions(),
    };
  }

  private async handleAddToCart(): Promise<void> {
    this.fedopsLogger.interactionStarted(ADD_TO_CART_FEDOPS_INTERACTION);

    if (this.product.hasOptions || this.hasSubscriptions(this.product) || this.product.customTextFields.length) {
      return this.openQuickView();
    }

    await this.cartActions.addToCart(
      {
        productId: this.product.id,
        quantity: 1,
        optionsSelectionsIds: [],
        addToCartAction: AddToCartActionOption.MINI_CART,
        onSuccess: () => this.fedopsLogger.interactionEnded(ADD_TO_CART_FEDOPS_INTERACTION),
      },
      {
        id: this.product.id,
        name: this.product.name,
        sku: actualSku(this.product),
        type: this.product.productType,
        price: actualPrice(this.product),
        buttonType: BiButtonActionType.AddToCart,
        appName: 'addToCartApp',
        productType: this.product.productType as any,
        isNavigateCart: this.cartActions.shouldNavigateToCart(),
        navigationClick: !this.cartActions.shouldNavigateToCart() ? 'mini-cart' : 'cart',
      }
    );
  }

  private hasSubscriptions(product: IProductDTO) {
    return hasSubscriptionPlans(product);
  }

  private openQuickView() {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.siteStore.biLogger.clickAddToCartWithOptionsSf({
      appName: 'addToCartApp',
      origin: originPage,
      hasOptions: true,
      productId: this.product.id,
      productType: this.product.productType,
      navigationClick: this.siteStore.isMobile() ? 'product-page' : 'quick-view',
    });

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.quickviewActions
      .quickViewProduct({
        origin: originPage,
        urlPart: this.product.urlPart,
        compId: this.compId,
        externalId: this.externalId,
      })
      .then(() => this.fedopsLogger.interactionEnded(ADD_TO_CART_FEDOPS_INTERACTION));
  }

  private updatePublicData(newPublicData: IControllerConfig['publicData']) {
    Object.keys(newPublicData.COMPONENT).forEach((key) => {
      this.publicData.COMPONENT[key] = newPublicData.COMPONENT[key];
    });
  }

  private isButtonDisabled(): boolean {
    return !this.siteStore.isEditorMode() && (this.isOutOfStock || this.showContactSeller);
  }

  private get showContactSeller() {
    return (
      this.addToCartService.getButtonState({
        price: actualPrice(this.product),
        inStock: this.product.isInStock,
      }) === AddToCartState.DISABLED
    );
  }

  private get isOutOfStock() {
    return !this.product.isInStock;
  }

  private getButtonText(): string {
    const buttonText =
      this.multilingualService.get(PUBLIC_DATA_KEYS.BUTTON_TEXT) || this.translations['addPanel.addToCart.button'];
    if (this.siteStore.isEditorMode()) {
      return buttonText;
    }
    if (this.showContactSeller) {
      return this.translations['addPanel.contactSeller.button'];
    }
    if (this.isOutOfStock) {
      return this.translations['addPanel.outOfStock.button'];
    }
    return buttonText;
  }

  public onAppLoaded(): void {
    /* istanbul ignore next: hard to test it */
    if (this.shouldReportFedops) {
      this.fedopsLogger.appLoaded();
      this.shouldReportFedops = false;
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.siteStore.biLogger.addToCartButtonLoadedSf(
        this.product
          ? {
              isMobileFriendly: this.siteStore.isMobileFriendly,
              navigationClick: !this.cartActions.shouldNavigateToCart() ? 'mini-cart' : 'cart',
              hasOptions: this.product.hasOptions,
              productId: this.product.id,
              hasPlans: this.hasSubscriptions(this.product),
              productType: this.product.productType,
            }
          : {productId: ''}
      );
    }
  }
}
