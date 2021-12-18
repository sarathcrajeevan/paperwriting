import {IWidgetControllerConfig} from '@wix/native-components-infra/dist/es/src/types/types';
import {HeadingTags} from '@wix/wixstores-client-core/dist/es/src/types/heading-tags';
import {ProductPriceBreakdown} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/ProductPriceBreakdown/ProductPriceBreakdown';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';

export interface IGalleryConfig {
  config: IWidgetControllerConfig['config'];
}

export class BaseGalleryStore {
  protected readonly config: IWidgetControllerConfig['config'];
  protected productPriceBreakdown: ProductPriceBreakdown;

  constructor({config}: IGalleryConfig, protected readonly siteStore: SiteStore) {
    //todo: COMPONENT === null is not tested, be this check can be removed after bolt will stop sending nulls https://wix.slack.com/archives/CAKBA7TDH/p1555852184003900
    this.config = config;
    if (this.config.publicData.COMPONENT === null || this.config.publicData.COMPONENT === undefined) {
      this.config.publicData.COMPONENT = {};
    }
  }

  protected getCommonPropsToInject() {
    return {
      htmlTags: this.htmlTags,
      priceBreakdown: this.priceBreakdown,
      sendClickShippingInfoLinkSf: this.sendClickShippingInfoLinkSf.bind(this),
    };
  }

  protected sendClickShippingInfoLinkSf(productId: string) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.siteStore.biLogger.clickShippingInfoLinkSf({productId});
  }

  protected getCommonPropsToUpdate() {
    const htmlTags = this.htmlTags;
    return {htmlTags};
  }

  protected get priceBreakdown() {
    return {
      shouldRenderTaxDisclaimer: this.productPriceBreakdown.shouldShowTaxDisclaimer,
      shippingDisclaimer: this.productPriceBreakdown.shippingDisclaimer,
      taxDisclaimer: this.productPriceBreakdown.taxDisclaimer,
    };
  }

  protected get htmlTags() {
    return {
      productNameHtmlTag: this.config.publicData.COMPONENT.gallery_productNameHtmlTag || HeadingTags.H3,
      headerTextHtmlTag: this.config.publicData.COMPONENT.gallery_headerTextHtmlTag || HeadingTags.H2,
    };
  }
}
