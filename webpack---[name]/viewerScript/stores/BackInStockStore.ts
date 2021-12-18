import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {IPropsInjectedByViewerScript} from '../../types/app-types';
import {SPECS} from '../../specs';
import {LazyValue} from '../../commons/lazy';
import {Logger as BiLoggerSite} from '@wix/bi-logger-ec-site';
import {Origin} from '../../constants';
import {BackInStockActions} from '@wix/wixstores-client-storefront-sdk/dist/es/src/actions/BackInStockActions/BackInStockActions';

export enum BackInStockCollectingStatus {
  Unknown = 'UNKNOWN',
  Pending = 'PENDING',
  Yes = 'YES',
  No = 'NO',
}

export interface BackInStockStoreProps {
  isBackInStockEnabled: boolean;
  isBackInStockLoading: boolean;
  handleNotifyWhenBackInStock: () => void;
}

export interface BackInStockStoreDependencies {
  siteStore: SiteStore;
  setProps: (props: Partial<IPropsInjectedByViewerScript>) => void;
  resolveProductId: () => string;
  resolveVariantId: () => string;
  canCreateBackInStockRequest: () => boolean;
  compId: string;
  biLoggerSite: LazyValue<BiLoggerSite>;
}

export class BackInStockStore {
  private readonly backInStockActions: BackInStockActions;

  private collectingStatus = BackInStockCollectingStatus.Unknown;

  private isInitialized = false;

  constructor(private readonly dependencies: BackInStockStoreDependencies) {
    this.backInStockActions = new BackInStockActions({
      siteStore: this.dependencies.siteStore,
      origin: Origin.PRODUCT_PAGE,
      compId: this.dependencies.compId,
    });
  }

  public async initialize() {
    if (this.isInitialized) {
      return;
    }

    this.isInitialized = true;

    await this.fetchIsCollectingRequests();
  }

  public get props(): BackInStockStoreProps {
    return {
      isBackInStockEnabled: this.isBackInStockEnabled,
      isBackInStockLoading: this.collectingStatus === BackInStockCollectingStatus.Pending,
      handleNotifyWhenBackInStock: this.handleNotifyWhenBackInStock.bind(this),
    };
  }

  public get isBackInStockEnabled(): boolean {
    return this.collectingStatus === BackInStockCollectingStatus.Yes;
  }

  private get isMultipleLanguagesExperimentEnabled() {
    return this.dependencies.siteStore.experiments.enabled(SPECS.BACK_IN_STOCK_MULTIPLE_LANGUAGES);
  }

  private updateProps() {
    this.dependencies.setProps(this.props);
  }

  private openBackInStockModal() {
    const productId = this.dependencies.resolveProductId();
    const variantId = this.dependencies.resolveVariantId();

    return this.backInStockActions.openBackInStockEmailModal({
      productId,
      variantId,
      language:
        /* istanbul ignore next: todo(titk@wix.com): add tests */
        this.isMultipleLanguagesExperimentEnabled ? this.dependencies.siteStore.storeLanguage : 'en',
    });
  }

  private async fetchIsCollectingRequests() {
    try {
      this.collectingStatus = BackInStockCollectingStatus.Pending;

      this.collectingStatus = (await this.backInStockActions.fetchIsBackInStockEnabled())
        ? BackInStockCollectingStatus.Yes
        : BackInStockCollectingStatus.No;
    } catch {
      /* istanbul ignore next */
      this.collectingStatus = BackInStockCollectingStatus.Unknown;
    } finally {
      this.updateProps();
    }
  }

  private handleNotifyWhenBackInStock() {
    const isValid = this.dependencies.canCreateBackInStockRequest();

    this.trackButtonClickBi(isValid);

    if (isValid) {
      //eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.openBackInStockModal();
      this.updateProps();
    }
  }

  private trackButtonClickBi(isValidClick: boolean) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.dependencies.biLoggerSite.value.bisClickOnNotifyMeButtonToOpenModal({
      eligible: isValidClick,
      option: isValidClick ? this.dependencies.resolveVariantId() : '',
      catalogItemId: this.dependencies.resolveProductId(),
    });
  }
}
