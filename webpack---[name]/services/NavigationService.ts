import {IStoreFrontNavigationContext} from '@wix/wixstores-client-core/dist/es/src/types/site-map';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {IProduct} from '@wix/wixstores-graphql-schema/dist/es/src';
import {queryToString} from './urlUtils';
import {ProductPagePaginationItem} from '../types/app-types';
import {CustomUrlApi} from '@wix/wixstores-client-storefront-sdk/dist/es/src/utils/CustomUrl/CustomUrlApi';

export class NavigationService {
  constructor(
    private readonly siteStore: SiteStore,
    private readonly sectionUrl: string,
    private readonly navigationContext: IStoreFrontNavigationContext,
    private readonly product: IProduct,
    private readonly customUrlApi?: CustomUrlApi,
    private readonly isUrlWithOverrides?: boolean
  ) {
    //
  }

  private getUrl(slug: string) {
    if (this.isUrlWithOverrides) {
      return this.customUrlApi.buildProductPageUrl({slug});
    } else {
      const prefix = `${this.sectionUrl}/${slug}`;
      return (
        prefix +
        /* istanbul ignore next */ (Object.keys(this.siteStore.location.query).length
          ? /* istanbul ignore next */ `?${queryToString(this.siteStore.location.query)}`
          : '')
      );
    }
  }

  public getPrevNextProducts() {
    if (this.siteStore.isEditorMode()) {
      return {
        nextProduct: {partialUrl: '#', fullUrl: '#'},
        prevProduct: {partialUrl: '#', fullUrl: '#'},
      };
    }

    let prevProduct = {} as ProductPagePaginationItem;
    let nextProduct = {} as ProductPagePaginationItem;
    const paginationMap = this.navigationContext.paginationMap;
    paginationMap.forEach((slug: string, index: number) => {
      if (slug === this.product.urlPart) {
        if (paginationMap[index - 1]) {
          prevProduct = {
            partialUrl: paginationMap[index - 1],
            fullUrl: this.getUrl(paginationMap[index - 1]),
          };
        }
        if (paginationMap[index + 1]) {
          nextProduct = {
            partialUrl: paginationMap[index + 1],
            fullUrl: this.getUrl(paginationMap[index + 1]),
          };
        }
      }
    });

    return {
      nextProduct,
      prevProduct,
    };
  }
}
