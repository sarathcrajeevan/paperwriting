import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {ORIGIN, PAYPAL_METHOD_NAME, PaymentMethodType} from '../../components/cart/constants';
import {IPaymentMethod} from '@wix/wixstores-graphql-schema';
import {StoreMetaDataApi} from '@wix/wixstores-client-storefront-sdk/dist/es/src/apis/StoreMetaDataApi/StoreMetaDataApi';

export class StoreMetaDataService {
  private readonly storeMetaDataApi: StoreMetaDataApi;
  private readonly _storeMetaDataPromise: ReturnType<StoreMetaDataApi['getStoreMetaData']>;

  constructor({siteStore}: {siteStore: SiteStore}) {
    this.storeMetaDataApi = new StoreMetaDataApi({siteStore, origin: ORIGIN});
    this._storeMetaDataPromise = this.storeMetaDataApi.getStoreMetaData();
  }

  public async get(): Promise<ReturnType<StoreMetaDataApi['getStoreMetaData']>> {
    return this._storeMetaDataPromise;
  }

  private async getActivePaymentMethods() {
    const {activePaymentMethods = []} = await this.get();
    return activePaymentMethods;
  }

  private async getRegularFlowPaymentMethods(): Promise<IPaymentMethod[]> {
    const activePaymentMethods = await this.getActivePaymentMethods();
    return activePaymentMethods.filter(({name}) => name !== PAYPAL_METHOD_NAME);
  }

  private async getEWalletPaymentMethods(): Promise<IPaymentMethod[]> {
    const activePaymentMethods = await this.getActivePaymentMethods();
    return activePaymentMethods.filter((paymentMethod) => paymentMethod.type === PaymentMethodType.eWallet);
  }

  private async getOfflinePaymentMethods(): Promise<IPaymentMethod[]> {
    const activePaymentMethods = await this.getActivePaymentMethods();
    return activePaymentMethods.filter((paymentMethod) => paymentMethod.type === PaymentMethodType.offline);
  }

  public async hasRegularFlowPaymentMethods() {
    return !!(await this.getRegularFlowPaymentMethods()).length;
  }

  public async hasAnyPaymentMethods() {
    return !!(await this.getActivePaymentMethods()).length;
  }

  public async hasEWalletPaymentMethods() {
    return !!(await this.getEWalletPaymentMethods()).length;
  }

  public async hasFastFlowPayPalPaymentMethods() {
    return (await this.getEWalletPaymentMethods()).some(({name}) => name === PAYPAL_METHOD_NAME);
  }

  public async hasOfflinePaymentMethods() {
    return !!(await this.getOfflinePaymentMethods()).length;
  }

  public async getPaymentMethodsNames() {
    const activePaymentMethods = await this.getActivePaymentMethods();
    return activePaymentMethods.map((method) => method.name);
  }
}
