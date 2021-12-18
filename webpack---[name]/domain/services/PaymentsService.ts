import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {BI_ORIGIN} from '../../components/thankYouPage/constants';
import {PaymentsApi} from '@wix/wixstores-client-storefront-sdk/dist/es/src/apis/PaymentsApi/PaymentsApi';

export class PaymentsService {
  private readonly paymentsApi: PaymentsApi;

  constructor({siteStore}: {siteStore: SiteStore}) {
    this.paymentsApi = new PaymentsApi({siteStore, origin: BI_ORIGIN});
  }

  public async fetchOfflineInstruction(): Promise<string> {
    const payments = await this.paymentsApi.fetchPayments({paymentMethod: 'offline'});
    return payments.offlineInstruction?.offlineInstruction;
  }
}
