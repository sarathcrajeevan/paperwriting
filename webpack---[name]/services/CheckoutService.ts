import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {APP_DEFINITION_ID, PageMap} from '@wix/wixstores-client-core/dist/es/src/constants';
import {StoreMetaDataService} from './StoreMetaDataService';
import {
  ICanCheckoutResponse,
  ICheckoutQueryParams,
  IProductDTO,
  IPropsInjectedByViewerScript,
  IStoreMetaData,
} from '../types/app-types';
import {ModalManager} from '@wix/wixstores-client-core/dist/es/src/modalManager/modalManager';
import {baseModalUrl, ModalState, ModalTheme, ModalType, Origin} from '../constants';
import {IStoreInfo} from '@wix/wixstores-graphql-schema';
import {LostBusinessNotifier} from './LostBusinessNotifier';
import _ from 'lodash';
import {isWorker} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/utils';
import {MultilingualService} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/MultilingualService/MultilingualService';
import {getCheckoutOutOfViewerUrl} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/CheckoutNavigationService/getCheckoutOutOfViewerUrl';

export interface CheckoutInfo {
  cartId: string;
  isFastFlow: boolean;
  checkoutRelativeUrl: string;
  siteBaseUrl: string;
  thankYouPageUrl: string;
  cartUrl: string;
  paymentMethodName: string;
  locale: string;
  deviceType: string;
  a11y: boolean;
  originType: string;
  cashierPaymentId?: string;
  checkoutId?: string;
}

export class CheckoutService {
  private readonly siteStore: SiteStore;
  private readonly modalManger: ModalManager;
  private readonly lostBusinessNotifier: LostBusinessNotifier;
  private storeMetaData: IStoreMetaData;

  constructor(
    siteStore: SiteStore,
    private readonly nextProps: (additionalProps: Partial<IPropsInjectedByViewerScript>) => void,
    private readonly isEditorX: boolean,
    private readonly multilingualService: MultilingualService,
    private readonly storeMetaDataService: StoreMetaDataService
  ) {
    this.siteStore = siteStore;
    const openModal = async (url, width, height) => {
      return this.siteStore.windowApis.openModal(url, {width, height, theme: ModalTheme.BARE});
    };
    this.modalManger = new ModalManager({openModal}, baseModalUrl, this.siteStore.instanceManager.getInstance());
    this.lostBusinessNotifier = new LostBusinessNotifier(this.siteStore.httpClient);
  }

  private readonly navigateToCheckoutOutViewer = (checkoutInfo: CheckoutInfo) => {
    const checkoutUrl = getCheckoutOutOfViewerUrl({
      cashierPaymentId: checkoutInfo.cashierPaymentId,
      isA11y: checkoutInfo.a11y,
      instance: this.siteStore.instanceManager.getInstance(),
      isFastFlow: checkoutInfo.isFastFlow,
      locale: checkoutInfo.locale,
      payment: checkoutInfo.paymentMethodName,
      storeId: this.siteStore.storeId,
      isPickUpFlow: this.storeMetaData.shipping.isPickupOnly,
      cartId: checkoutInfo.cartId,
      deviceType: checkoutInfo.deviceType,
      isPrimaryLanguage: this.multilingualService.isPrimaryLanguage,
      lang: this.multilingualService.lang,
      country: this.multilingualService.locale,
      origin: 'productPage',
      originType: checkoutInfo.originType,
      consentPolicy: this.siteStore.usersApi.getCurrentConsentPolicy(),
      consentPolicyHeader: this.siteStore.usersApi._getConsentPolicyHeader(),
      checkoutId: checkoutInfo.checkoutId,
    });

    if (isWorker()) {
      this.siteStore.location.to(checkoutUrl);
    } else {
      window.open(checkoutUrl, '_top');
    }
  };

  private readonly isEligibleForCheckoutInViewer = async (): Promise<boolean> => {
    const isCheckoutInstalled = await this.siteStore.siteApis.isAppSectionInstalled({
      appDefinitionId: APP_DEFINITION_ID,
      sectionId: PageMap.CHECKOUT,
    });

    const url = this.siteStore.location.url;
    const isSslSecured = _.startsWith(url, 'https');
    return isCheckoutInstalled && isSslSecured;
  };

  private readonly sendLostBusinessEmail = (storeInfo: IStoreInfo) => {
    storeInfo.isPremium && this.lostBusinessNotifier.notify();
  };

  public openModalByType = async (modalType: ModalType): Promise<void> => {
    const biParams = {origin: Origin.PRODUCT_PAGEֹֹ_CHECKOUT, mode: 'editor', isMerchant: true};

    switch (modalType) {
      case ModalType.SetShipping: {
        //eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.siteStore.biLogger.showShippingPopupSf({
          type: 'merchant pop-up',
          ...biParams,
        });
        return this.modalManger.openSetShippingMethod();
      }

      case ModalType.SetPayment: {
        //eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.siteStore.biLogger.showMerchantPaymentPopupSf(biParams);
        return this.modalManger.openSetPaymentMethod();
      }
      case ModalType.UpgradeToPremium: {
        //eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.siteStore.biLogger.showMerchantUpgradePopupSf(biParams);
        await this.modalManger.openUpgradeToPremium({isEditorX: this.isEditorX});
        break;
      }
      case ModalType.NotInLiveSite: {
        //eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.siteStore.biLogger.viewCheckoutInLiveSitePopupSf(biParams);
        return this.modalManger.openNotInLiveSite();
      }
      case ModalType.Subscriptions: {
        //eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.siteStore.biLogger.notAcceptPaymentsVisitorPopupSf({origin: Origin.PRODUCT_PAGEֹֹ_CHECKOUT});
        this.nextProps({modalState: ModalState.OPEN});
        return this.modalManger.openSubscriptions().then(() => {
          this.nextProps({modalState: ModalState.CLOSE});
        });
      }
      case ModalType.HighArpuSubscriptions: {
        //eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.siteStore.biLogger.subscriptionsAreComingSoonVisitorPopupSf({origin: Origin.PRODUCT_PAGEֹֹ_CHECKOUT});
        this.nextProps({modalState: ModalState.OPEN});
        return this.modalManger.openUpgradeSubscriptions({isEditorX: this.isEditorX}).then(() => {
          this.nextProps({modalState: ModalState.CLOSE});
        });
      }
      case ModalType.NoOnlinePayments: {
        //eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.siteStore.biLogger.notAcceptPaymentsVisitorPopupSf({origin: Origin.PRODUCT_PAGEֹֹ_CHECKOUT});
        this.nextProps({modalState: ModalState.OPEN});
        return this.modalManger.openNoOnlinePayments().then(() => {
          this.nextProps({modalState: ModalState.CLOSE});
        });
      }
    }
  };

  private readonly isSubscriptionsPremiumFeature = (): boolean => {
    return (
      _.findIndex(this.siteStore.premiumFeatures, (feature) => {
        return feature.name === 'stores_subscriptions';
      }) !== -1
    );
  };

  public checkIsAllowedToCheckout = async (
    product: IProductDTO,
    isSubscribe = false
  ): Promise<ICanCheckoutResponse> => {
    this.storeMetaData = await this.storeMetaDataService.fetchStoreInfo().catch((e) => {
      throw e;
    });

    const canStoreShip = product.productType === 'digital' || this.storeMetaData.storeInfo.canStoreShip;

    if (this.siteStore.isPreviewMode() || this.siteStore.isEditorMode()) {
      if (!canStoreShip) {
        return {modalType: ModalType.SetShipping, canCheckout: false};
      } else if (!this.storeMetaData.storeInfo.hasCreatedPaymentMethods) {
        return {modalType: ModalType.SetPayment, canCheckout: false};
      } else if (!this.storeMetaData.storeInfo.isPremium) {
        return {modalType: ModalType.UpgradeToPremium, canCheckout: false};
      } else if (isSubscribe && !this.isSubscriptionsPremiumFeature()) {
        return {modalType: ModalType.HighArpuSubscriptions, canCheckout: false};
      } else {
        return {modalType: ModalType.NotInLiveSite, canCheckout: false};
      }
    } else if (
      !this.storeMetaData.storeInfo.isPremium ||
      !this.storeMetaData.storeInfo.hasCreatedPaymentMethods ||
      !canStoreShip
    ) {
      this.sendLostBusinessEmail(this.storeMetaData.storeInfo);
      return {modalType: ModalType.NoOnlinePayments, canCheckout: false};
    } else if (isSubscribe && !this.isSubscriptionsPremiumFeature()) {
      return {modalType: ModalType.Subscriptions, canCheckout: false};
    }

    return {modalType: undefined, canCheckout: true};
  };

  public navigateToCheckout = async (checkoutInfo: CheckoutInfo): Promise<void> => {
    if (await this.isEligibleForCheckoutInViewer()) {
      const queryParams: ICheckoutQueryParams = {
        a11y: checkoutInfo.a11y,
        cartId: checkoutInfo.cartId,
        storeUrl: checkoutInfo.siteBaseUrl, //this param is not used in client or server but needed by cashier! dont remove it!
        isFastFlow: checkoutInfo.isFastFlow,
        isPickupFlow: this.storeMetaData.shipping.isPickupOnly,
        cashierPaymentId: checkoutInfo.cashierPaymentId || '',
        origin: 'productPage',
        originType: checkoutInfo.originType,
        ...(checkoutInfo.checkoutId && {checkoutId: checkoutInfo.checkoutId}),
      };

      //eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.siteStore.navigate(
        {
          sectionId: PageMap.CHECKOUT,
          queryParams,
        },
        true
      );
    } else {
      this.navigateToCheckoutOutViewer(checkoutInfo);
    }
  };
}
