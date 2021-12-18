import _ from 'lodash';
import {ImageModeValues} from '@wix/wixstores-client-core/dist/es/src/media/constants';
import {
  DEFAULT_ONE_TIME_PURCHASE_OPTION_LOCATION,
  GalleryNavigationLocation,
  GalleryNavigationPosition,
  GalleryNavigationType,
  InfoSectionLayoutId,
  LayoutId,
  PaymentOptionsBreakdownTheme,
  TabsDirection,
} from '../constants';
import {IWixStyleParams} from '@wix/wixstores-client-core/dist/src/types/wix-sdk';
import {IProductPageSettings, ProductPageAppProps, IProductPageStyleParams} from '../types/app-types';

const fontStyleParam = false;

export const DEFAULT_STYLE_PARAMS: Partial<IWixStyleParams> = {
  booleans: {
    full_width: false,
    productPage_buyNowButtonEnabled: false,
    productPage_galleryZoom: true,
    productPage_infoSectionShowDeviders: true,
    productPage_navigation: true,
    productPage_openMinicart: true,
    productPage_paymentOptionsBreakdown: true,
    productPage_productAction: true,
    productPage_productInfoSection: true,
    productPage_stockIndicator: false,
    productPage_productPrice: true,
    productPage_productQuantity: true,
    productPage_productSku: true,
    productPage_socialNetworkwhatsapp: true,
    productPage_socialNetworkfacebook: true,
    productPage_socialNetworkpinterest: true,
    productPage_socialNetworks: true,
    productPage_socialNetworktwitter: true,
    productPage_wishlistEnabled: false,
    responsive: false,
  },
  numbers: {
    productPage_descriptionVisibleLineNumbers: 0,
    productPage_galleryImageRatio: -1,
    productPage_galleryImageMode: ImageModeValues.CROP,
    productPage_layoutId: LayoutId.Classic,
    productPage_infoSectionTypeId: InfoSectionLayoutId.Collapse,
    productPage_infoSectionColumnNumber: 1,
    productPage_subscriptionPlansOneTimePurchase: DEFAULT_ONE_TIME_PURCHASE_OPTION_LOCATION,
    productPage_paymentOptionsBreakdownTheme: PaymentOptionsBreakdownTheme.LIGHT,
  },
  fonts: {
    productPage_galleryNavigationLocation: {value: GalleryNavigationLocation.OUTSIDE, fontStyleParam},
    productPage_galleryNavigationPosition: {value: GalleryNavigationPosition.BOTTOM, fontStyleParam},
    productPage_galleryNavigationType: {value: GalleryNavigationType.THUMBNAILS, fontStyleParam},
    productPage_infoSectionAlignment: {value: TabsDirection.start, fontStyleParam},
  },
};

export const MOBILE_STYLE_PARAMS_OVERRIDES: Partial<IWixStyleParams> = {
  numbers: {
    productPage_infoSectionTypeId: InfoSectionLayoutId.Collapse,
    productPage_infoSectionColumnNumber: 3,
    productPage_galleryImageRatio: -1,
  },
  fonts: {
    productPage_galleryNavigationType: {value: GalleryNavigationType.DOTS, fontStyleParam: false},
    productPage_galleryNavigationPosition: {value: GalleryNavigationPosition.BOTTOM, fontStyleParam: false},
    productPage_galleryNavigationLocation: {value: GalleryNavigationLocation.OUTSIDE, fontStyleParam: false},
  },
};

export const RESPONSIVE_STYLE_PARAMS_DEFAULTS: Partial<IWixStyleParams> = {
  booleans: {
    productPage_navigation: false,
  },
};

export const RESPONSIVE_STYLE_PARAMS_OVERRIDES: Partial<IWixStyleParams> = {
  numbers: {
    productPage_layoutId: LayoutId.Responsive,
  },
};

/* istanbul ignore next: todo: test */
export function getLayoutIdFromProps(props: ProductPageAppProps): LayoutId {
  return props.globals.style.styleParams.numbers.productPage_layoutId;
}

export function getProductPageSettingsFromProps(props: ProductPageAppProps): IProductPageSettings {
  const {
    globals: {
      style: {
        styleParams: {
          fonts: {
            productPage_galleryNavigationPosition: {value: navigationPositionString},
            productPage_galleryNavigationType: {value: navigationTypeString},
            productPage_galleryNavigationLocation: {value: navigationLocationString},
          },
          numbers: {
            productPage_galleryImageMode: imageMode,
            productPage_galleryImageRatio: imageRatioId,
            productPage_infoSectionTypeId: infoSectionTypeId,
            productPage_infoSectionColumnNumber: infoSectionColumnNumber,
          },
          booleans: {
            productPage_galleryZoom: shouldShowZoom,
            productPage_infoSectionShowDeviders: shouldShowDivider,
            productPage_productPrice: shouldShowPrice,
            productPage_productSku: shouldShowSku,
            productPage_productQuantity: shouldShowQuantity,
            productPage_stockIndicator: shouldShowStockIndicator,
            productPage_navigation: shouldShowNavigation,
            productPage_productInfoSection: shouldShowInfoSection,
            productPage_socialNetworks: shouldShowSocialNetwork,
            full_width: isFullWidth,
          },
        },
      },
    },
  } = props;
  const navigationPosition = navigationPositionString as GalleryNavigationPosition;
  const navigationType = navigationTypeString as GalleryNavigationType;
  const navigationLocation = navigationLocationString as GalleryNavigationLocation;
  const shouldShowProductPaymentBreakdown = props.globals.shouldShowProductPaymentBreakdown;

  return {
    navigationPosition,
    navigationType,
    navigationLocation,
    imageMode,
    imageRatioId,
    infoSectionTypeId,
    infoSectionColumnNumber,
    shouldShowDivider,
    shouldShowZoom,
    shouldShowPrice,
    shouldShowSku,
    shouldShowQuantity,
    shouldShowStockIndicator,
    shouldShowNavigation,
    shouldShowInfoSection,
    shouldShowProductPaymentBreakdown,
    shouldShowSocialNetwork,
    isFullWidth,
  };
}

export function getRuntimeStyleOverrides({isMobile, isResponsive}): Partial<IProductPageStyleParams> {
  return _.merge(
    {},
    {...(isMobile && MOBILE_STYLE_PARAMS_OVERRIDES)},
    {...(isResponsive && RESPONSIVE_STYLE_PARAMS_OVERRIDES)}
  );
}

export function getRuntimeStyleParams(customStyles: Partial<IWixStyleParams>, {isResponsive, isMobile}) {
  const defaults = {...DEFAULT_STYLE_PARAMS};
  const conditionalDefaults = _.merge({}, {...(isResponsive && RESPONSIVE_STYLE_PARAMS_DEFAULTS)});
  return _.merge(
    {},
    defaults,
    conditionalDefaults,
    customStyles,
    getRuntimeStyleOverrides({isMobile, isResponsive})
  ) as IProductPageStyleParams;
}
