import _ from 'lodash';
import {cartIconTranslationPath, EMPTY_CART_GUID, FedopsInteraction, specs} from '../constants';
import {ProductType} from '@wix/wixstores-client-core/dist/es/src/types/product';
import {CartType} from '@wix/wixstores-client-core/dist/es/src/types/cart';
import {ICartItem, IDataResponse} from '../types/cart';
import {getTranslations, isWorker} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/utils';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {newCartToOldCartStructure} from '@wix/wixstores-client-core/dist/es/src/common/cart-services/cart-services';
import {ICartIconControllerConfig, ICtrlProps} from '../types/app-types';
import {ICart} from '@wix/wixstores-graphql-schema';
import {
  StoresWidgetID,
  APP_DEFINITION_ID,
  Topology,
  PageMap,
  BiButtonActionType,
} from '@wix/wixstores-client-core/dist/es/src/constants';
import {query} from '../graphql/getData.graphql';
import {query as queryNode} from '../graphql/getDataNode.graphql';
import {query as getAppSettingsData} from '../graphql/getAppSettingsData.graphql';
import {getLocaleNamespace} from '@wix/wixstores-client-core/dist/es/src/getLocaleNamespace';
import {ITrackEventParams} from '@wix/native-components-infra/dist/es/src/types/wix-sdk';
import {translate} from '@wix/wixstores-client-core/dist/es/src/utils/Translate';
import {IFedOpsLogger} from '@wix/native-components-infra/dist/es/src/types/types';
import {CartActions} from '@wix/wixstores-client-storefront-sdk/dist/es/src/actions/CartActions/CartActions';
import {PubSubManager} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/PubSubManager/PubSubManager';

export class CartIconStore {
  private appSettingsPromise: Promise<any>;
  private cart;
  private cartPromise: Promise<any>;
  private translations = {};
  private readonly cartActions: CartActions;
  private readonly fedopsLogger: IFedOpsLogger;
  private readonly isStartReported: boolean = false;
  private readonly pubSubManager: PubSubManager;

  constructor(
    private readonly siteStore: SiteStore,
    private readonly config: ICartIconControllerConfig,
    private readonly setProps: Function,
    private readonly reportError: (e) => any
  ) {
    const fedopsLoggerFactory = this.siteStore.platformServices.fedOpsLoggerFactory;
    this.fedopsLogger = fedopsLoggerFactory.getLoggerForWidget({
      appId: APP_DEFINITION_ID,
      widgetId: StoresWidgetID.CART_ICON,
    });
    if (isWorker()) {
      this.fedopsLogger.appLoadStarted();
    }
    this.isStartReported = true;
    this.pubSubManager = new PubSubManager(this.siteStore.pubSub);
    this.cartActions = new CartActions({siteStore: this.siteStore, origin: 'cart-icon'});

    if (this.siteStore.isSiteMode() || this.siteStore.isPreviewMode()) {
      this.registerEvents();
    }

    this.handleCurrencyChange();

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.siteStore.siteApis.onInstanceChanged(() => this.refreshData(), APP_DEFINITION_ID);
  }

  private handleCurrencyChange() {
    let currency = this.siteStore.location.query.currency;

    this.siteStore.location.onChange(() => {
      if (currency !== this.siteStore.location.query.currency) {
        currency = this.siteStore.location.query.currency;

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.refreshData();
      }
    });
  }

  public async refreshData(): Promise<void> {
    this.cartPromise = this.loadCartFromServer();
    const cart = await this.cartPromise;
    this.pubSubManager.publish('Minicart.OnInitialData', cart.cartSummary);
    this.updateCart(cart.cartSummary);
  }

  public updateCart(cart: ICart): void {
    this.cart = cart;
    const count = this.getTotalQuantity(this.cart.items);
    this.setProps({
      ...this.getCountRelatedProps(count),
    });
  }

  public registerEvents(): void {
    this.pubSubManager.subscribe('Cart.Cleared', (res) => {
      if (res.data.cartId === this.cart.cartId) {
        this.updateCart({items: []});
      }
    });

    this.pubSubManager.subscribe('Cart.Changed', (res) => {
      this.updateCart(res.data);
    });

    if (!this.siteStore.isMobile()) {
      setTimeout(this.initPopup, 0);
    }
  }

  public async setInitialState(): Promise<void> {
    this.fedopsLogger.appLoadingPhaseStart('startFetching');
    return Promise.all([
      this.siteStore.isSSR() ? this.getAppSettingsData() : this.getData(),
      getTranslations(cartIconTranslationPath(this.siteStore.baseUrls.cartIconBaseUrl, this.siteStore.locale)),
      this.siteStore.getSectionUrl(PageMap.CART),
    ])
      .then(([serverResponse, translationsResponse, cartLink]) => {
        this.fedopsLogger.appLoadingPhaseStart('processData');
        this.cart = serverResponse.cartSummary || {};
        this.translations = translationsResponse;
        const count = this.cart.items ? this.getTotalQuantity(this.cart.items) : 0;

        const props = {
          ...this.getCountRelatedProps(count),
          cartLink: _.get(cartLink, 'url', ''),
          isInteractive: this.siteStore.isInteractive(),
          isLoaded: true,
          displayText: this.getDisplayText(serverResponse.widgetSettings),
          triggerFocus: false,
          onFocusTriggered: this.onFocusTriggered,
          isNavigate: !this.isOpenPopup(),
          onIconClick: this.onIconClick,
          onAppLoaded: this.onAppLoaded,
          cssBaseUrl: this.siteStore.baseUrls.cartIconBaseUrl,
          ravenUserContextOverrides: {
            id: this.siteStore.storeId,
            uuid: this.siteStore.uuid,
          },
        } as ICtrlProps;
        this.fedopsLogger.appLoadingPhaseStart('setProps');
        this.setProps(props);
      })
      .then(() => {
        if (this.siteStore.isSSR() && this.isStartReported) {
          this.fedopsLogger.appLoaded();
        }
      })
      .catch(this.reportError);
  }

  public onFocusTriggered = (): void => {
    this.setProps({
      triggerFocus: false,
    });
  };

  public onAppLoaded = (): void => {
    if (!isWorker() || this.siteStore.isInteractive()) {
      this.isStartReported && this.fedopsLogger.appLoaded();
      const shouldReport = this.siteStore.storage.memory.getItem('cartIconLoaded');
      if (!shouldReport) {
        this.siteStore.storage.memory.setItem('cartIconLoaded', 'true');
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.siteStore.biLogger.cartIconLoadedSf({
          isMobileFriendly: this.siteStore.isMobileFriendly,
          navigationClick: this.shouldOpenMinicartFromSettings() ? 'mini cart' : 'cart',
        });
      }
    }
  };

  public getDisplayText(widgetSettings: {[key: string]: string}): string {
    const defaultValue = this.translations[`CART_ICON_${this.config.style.styleParams.numbers.cartWidgetIcon}`];
    let widgetSettingsForLocale = {};
    if (
      this.siteStore.getMultiLangFields() &&
      !this.siteStore.getMultiLangFields().isPrimaryLanguage &&
      widgetSettings
    ) {
      widgetSettingsForLocale = widgetSettings[getLocaleNamespace(this.siteStore.getMultiLangFields().lang)];
      return _.get(widgetSettingsForLocale, 'CART_ICON_TEXT', '') || defaultValue;
    }
    return _.get(this.config, 'publicData.APP.CART_ICON_TEXT', '') || defaultValue;
  }

  public async getData(): Promise<IDataResponse> {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (this.cartPromise) {
      return this.cartPromise;
    }

    this.cartPromise = this.loadCartFromServer();

    return this.cartPromise;
  }

  private loadCartFromServer() {
    const isQueryNode = this.siteStore.experiments.enabled(specs.stores.QUERY_NODE);
    const postData = {
      query: isQueryNode ? queryNode : query,
      source: 'WixStoresWebClient',
      operationName: 'getCartService',
      variables: {externalId: this.config.externalId || ''},
    };

    return this.siteStore.httpClient
      .post(
        this.siteStore.resolveAbsoluteUrl(
          `/${isQueryNode ? Topology.NODE_GRAPHQL_URL : Topology.READ_WRITE_GRAPHQL_URL}`
        ),
        postData
      )
      .then(({data}) => {
        return {
          cartSummary: newCartToOldCartStructure(isQueryNode ? data.cart : data.cartService.cart),
          widgetSettings: _.get(data, 'appSettings.widgetSettings', {}),
        };
      });
  }

  public async getAppSettingsData(): Promise<IDataResponse> {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (this.appSettingsPromise) {
      return this.appSettingsPromise;
    }

    const postData = {
      query: getAppSettingsData,
      source: 'WixStoresWebClient',
      operationName: 'getAppSettings',
      variables: {externalId: this.config.externalId || ''},
    };

    this.appSettingsPromise = this.siteStore
      .tryGetGqlAndFallbackToPost(this.siteStore.resolveAbsoluteUrl(`/${Topology.STOREFRONT_GRAPHQL_URL}`), postData)
      .then(({data}) => {
        return {
          widgetSettings: _.get(data, 'appSettings.widgetSettings', {}),
        };
      });

    return this.appSettingsPromise;
  }

  public shouldOpenMinicartFromSettings(): boolean {
    const {iconLink} = this.config.style.styleParams.numbers;
    return !iconLink || iconLink === 2;
  }

  public isOpenPopup(): boolean {
    const shouldRenderInDevice = !this.siteStore.isMobile();
    return this.shouldOpenMinicartFromSettings() && shouldRenderInDevice;
  }

  public onIconClick = async (): Promise<void> => {
    const cartId = this.cart.cartId === EMPTY_CART_GUID ? undefined : this.cart.cartId;
    const partialBi = {
      cartId,
      cartType: this.getCartType(),
      itemsCount: this.getTotalQuantity(this.cart.items),
      viewMode: this.siteStore.viewMode.toLowerCase(),
    };
    if (this.isOpenPopup()) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.siteStore.experiments.enabled(specs.stores.USE_LIGHTBOXES)
        ? this.siteStore.windowApis.openLightbox('Mini Cart', {
            miniCartLayout: true,
          })
        : this.pubSubManager.publish('Minicart.Toggle', null, false);
      const eventId = this.pubSubManager.subscribe('Minicart.DidClose', () => {
        this.setProps({
          triggerFocus: true,
        });
        this.pubSubManager.unsubscribe('Minicart.DidClose', eventId);
      });
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.siteStore.biLogger.clickOnCartIconToOpenMiniCartSf({
        ...partialBi,
        isNavigateCart: false,
      });
    } else {
      const origin = 'cart-icon';
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.siteStore.biLogger.clickToViewCartPageSf({
        ...partialBi,
        origin,
        isNavigateCart: true,
      });
      await this.cartActions.navigateToCart(origin);
    }
  };

  public listenLoadedMinicartPopupAndSendCart(): void {
    this.pubSubManager.subscribe(
      'Minicart.LoadedWithoutData',
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      () =>
        this.getData().then((cart) => {
          this.pubSubManager.publish('Minicart.OnInitialData', cart.cartSummary);
          this.cart = cart.cartSummary;
        }),
      true
    );
  }

  public initPopup = (): void => {
    this.listenLoadedMinicartPopupAndSendCart();
  };

  public sendAddToCartBi = (productId: string, hasOptions: boolean, quantity: number): Promise<any> => {
    const eventData = {
      buttonType: BiButtonActionType.AddToCart,
      appName: 'wixstores-cart-icon',
      hasOptions,
      productId,
      origin: 'corvid',
      isNavigateCart: false,
      navigationClick: this.cartActions.shouldNavigateToCart() ? 'cart' : 'mini-cart',
      quantity,
    };

    return this.siteStore.biLogger.clickOnAddToCartSf(eventData);
  };

  public trackEvent = (productId: string, quantity: number): Promise<void> => {
    const params: ITrackEventParams = {
      appDefId: APP_DEFINITION_ID,
      category: 'All Products',
      origin: 'Stores',
      id: productId,
      quantity,
    };

    this.siteStore.windowApis.trackEvent('AddToCart', params);

    return Promise.resolve();
  };

  public onAddToCart = async (productId: string, hasOptions: boolean, quantity: number): Promise<void> => {
    await Promise.all([this.sendAddToCartBi(productId, hasOptions, quantity), this.trackEvent(productId, quantity)]);
  };

  public unSubscribeAll(): void {
    return this.pubSubManager.unsubscribeAll();
  }

  private getCartType() {
    const hasDigital = this.cart.items.some((item) => item.productType === ProductType.DIGITAL);
    const hasPhysical = this.cart.items.some((item) => !item.productType || item.productType === ProductType.PHYSICAL);
    if (hasDigital && hasPhysical) {
      return CartType.MIXED;
    } else if (hasDigital) {
      return CartType.DIGITAL;
    } else {
      return CartType.PHYSICAL;
    }
  }

  private getTotalQuantity(cartItems: ICartItem[] = []): number {
    return cartItems.reduce((previousValue, currentValue) => {
      return previousValue + (currentValue.quantity || 0);
    }, 0);
  }

  private getCountRelatedProps(count: number) {
    return {
      count,
      ariaLabelLink: translate(_.get(this.translations, 'sr.CART_WIDGET_BUTTON_TEXT', ''), {
        itemsCount: `${count}`,
      }),
    };
  }

  public async executeWithFedops(action: FedopsInteraction, fn: () => Promise<any>): Promise<void> {
    this.fedopsLogger.interactionStarted(action);
    await fn();
    this.fedopsLogger.interactionEnded(action);
  }
}
