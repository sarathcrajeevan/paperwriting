import {IWishlistStyleParams} from '../types/app-types';
import {
  HoverType,
  ImageRatioId,
  LoadMoreType,
  GridType,
  PaginationType,
} from '@wix/wixstores-client-gallery/dist/es/src/types/galleryTypes';
import {ImageModeId} from '@wix/wixstores-client-gallery/dist/src/types/galleryTypes';
import {AddToCartActionOption} from '@wix/wixstores-client-core/dist/es/src/constants';
import {GalleryViewMode} from '../constants';

export const DEFAULT_WISHLIST_PRODUCTS_COUNT = 12;
export const DEFAULT_WISHLIST_MANUAL_ROWS = 3;
export const DEFAULT_WISHLIST_MANUAL_COLS = 3;

export function getDefaultStyleParams(styleParams: Partial<IWishlistStyleParams>) {
  const defaults: IWishlistStyleParams = {
    booleans: {
      responsive: false,
      gallery_showAddToCartButton: true,
      gallery_showAddToCartQuantity: false,
      gallery_showDividers: false,
      gallery_showPrice: true,
      gallery_showProductName: true,
      gallery_showTitle: false,
      gallery_paginationFirstLastArrows: false,
      showQuickView: false,
    },
    fonts: {
      gallery_hoverType: {
        fontStyleParam: false,
        value: HoverType.None,
      },
    },
    numbers: {
      galleryColumns: DEFAULT_WISHLIST_MANUAL_COLS,
      galleryRows: DEFAULT_WISHLIST_MANUAL_ROWS,
      galleryImageRatio: ImageRatioId._1x1,
      gallery_addToCartAction: AddToCartActionOption.MINI_CART,
      gallery_gapSize: 10,
      gallery_imageMode: ImageModeId.Crop,
      gallery_loadMoreProductsType: LoadMoreType.PAGINATION,
      gallery_paginationFormat: PaginationType.PAGES,
      gallery_productSize: 200,
      gallery_productsCount: DEFAULT_WISHLIST_PRODUCTS_COUNT,
      gallery_gridType: GridType.MANUAL,
      gallery_editorViewMode: GalleryViewMode.EDITOR_EMPTY_STATE,
      galleryMargin: 10,
      'mobile:galleryMargin': 10,
      'mobile:galleryColumns': 1,
    },
    colors: {},
    googleFontsCssUrl: '',
  };
  return {
    defaults,
    overrides: styleParams,
  };
}
