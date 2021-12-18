import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {
  ILocaleDisplayNames,
  LocaleApi,
} from '@wix/wixstores-client-storefront-sdk/dist/es/src/apis/LocaleApi/LocaleApi';
import {BI_ORIGIN} from '../../components/thankYouPage/constants';

export class AddressTranslationService {
  private readonly siteStore: SiteStore;
  private readonly localeApi: LocaleApi;

  constructor({siteStore}: {siteStore: SiteStore}) {
    this.siteStore = siteStore;
    this.localeApi = new LocaleApi({siteStore, origin: BI_ORIGIN});
  }

  public async translate(countryKey: string, subdivisionKey: string): Promise<ILocaleDisplayNames> {
    try {
      return await this.localeApi.getDisplayNames({
        subdivisionKeys: [subdivisionKey],
        countryKeys: [countryKey],
        language: this.siteStore.locale,
      });
    } catch {
      return {countryName: countryKey, regionName: subdivisionKey};
    }
  }
}
