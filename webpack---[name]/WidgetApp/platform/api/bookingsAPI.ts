import { WidgetData } from '../../../Server/domain/widget';
import httpAdapterFactory, {
  IHttpAdapter,
} from '@wix/bookings-adapter-http-api';
import UrlQueryParamsBuilder from '../../../Shared/urlQueryParams/url-query-params-builder';

export class BookingsAPI {
  private readonly httpAdapter: IHttpAdapter;

  constructor(
    instance,
    private readonly staticsBaseUrl,
    private readonly serverBaseUrl,
    readonly siteRevision = null,
    readonly csrfToken = null,
    private readonly viewMode,
  ) {
    this.httpAdapter = httpAdapterFactory(instance, siteRevision, csrfToken);
  }

  public async getTranslations(locale) {
    return this.httpAdapter.get(
      `${this.staticsBaseUrl}assets/locales/WidgetApp/messages_${locale}.json`,
      null,
    );
  }

  public async getWidgetData(
    externalId,
    allowInjection = true,
    metaSiteId?,
    configParams = '',
  ): Promise<WidgetData> {
    const widgetQueryParam = new UrlQueryParamsBuilder(configParams)
      .add('cacheId', metaSiteId)
      .add('externalId', externalId)
      .add('viewMode', this.viewMode)
      .build();

    return this.canUseInjectedData(allowInjection)
      ? this.getWidgetDataFromWindow()
      : this.httpAdapter.get(
          `${this.serverBaseUrl}_api/bookings-widget/config${widgetQueryParam}`,
        );
  }

  public notifyOwnerNonPricingPlanEnrollmentAttempt = async (data) => {
    const base = await this.getBookingsPrefixUrl();
    return this.httpAdapter.post(`${base}/pricing-plans/invalidSetup`, data);
  };

  public notifyOwnerNonPremiumEnrollmentAttempt = async () => {
    const base = await this.getBookingsPrefixUrl();
    return this.httpAdapter.post(`${base}/classes/nonPremium`, '');
  };

  private async getBookingsPrefixUrl() {
    return `/_api/bookings-viewer/visitor`;
  }

  private canUseInjectedData(allowInjection: boolean) {
    return (
      allowInjection &&
      typeof window !== 'undefined' &&
      (window as any).__OFFERINGS__ &&
      (window as any).__CATEGORIES__ &&
      (window as any).__ACTIVE_FEATURES__ &&
      (window as any).__BUSINESS_INFO__ &&
      (window as any).__EXPERIMENTS__ &&
      (window as Window).__LOCALE__ &&
      (window as Window).__REGIONAL_SETTINGS__ &&
      (window as any).__BI_PROPS__
    );
  }

  private async getWidgetDataFromWindow(): Promise<WidgetData> {
    return {
      offerings: JSON.parse((window as any).__OFFERINGS__),
      categories: JSON.parse((window as any).__CATEGORIES__),
      locations: JSON.parse((window as any).__LOCATIONS__),
      config: {
        resourcesFiltered: false,
        businessInfo: JSON.parse((window as any).__BUSINESS_INFO__),
        activeFeatures: (window as any).__ACTIVE_FEATURES__,
        experiments: JSON.parse((window as any).__EXPERIMENTS__),
        locale: (window as Window).__LOCALE__,
        regionalSettings: (window as Window).__REGIONAL_SETTINGS__,
        biProps: JSON.parse((window as any).__BI_PROPS__),
      },
    };
  }
}
