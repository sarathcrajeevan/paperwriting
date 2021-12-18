/* eslint-disable import/no-cycle */
import {
  HoverType,
  IGalleryStyleParams,
  ImageModeId,
  ImageRatioId,
  PaginationType,
  LoadMoreType,
  ContentJustification,
  GridType,
} from '../types/galleryTypes';
import {MAX_ROWS, DEFAULT_AUTO_GRID_PRODUCTS_COUNT, DEFAULT_PRODUCT_IMAGE_SIZE} from '../constants';
import {AddToCartActionOption} from '@wix/wixstores-client-core/dist/es/src/constants';

function getDefaultColumnsNumber(dimensions) {
  if (!dimensions) {
    return;
  }

  if (typeof dimensions.width !== 'number') {
    return 4;
  }
  const componentWidth: number = dimensions.width;
  const PRODUCT_ITEM_MIN_WIDTH: number = 250;
  const defaultColumns = Math.round(componentWidth / PRODUCT_ITEM_MIN_WIDTH);
  return Math.min(defaultColumns, 4);
}

function getDefaultRowsNumber(columnsNumber: number): number {
  if (!columnsNumber) {
    return;
  }
  const LEGACY_MAX_ITEM_PER_PAGE = 20;
  return Math.min(Math.floor(LEGACY_MAX_ITEM_PER_PAGE / columnsNumber), MAX_ROWS / 2);
}

export const getDefaultStyleParams = ({
  showAlternativeImage,
  galleryColumns,
  dimensions,
  isEditorX,
}): Partial<IGalleryStyleParams> => {
  const nextGalleryColumns = getDefaultColumnsNumber(dimensions);
  const nextGalleryRows = getDefaultRowsNumber(galleryColumns || nextGalleryColumns);

  return {
    booleans: {
      full_width: false,
      galleryFiltersCategories: true,
      galleryFiltersPrice: true,
      galleryFiltersProductOptions: true,
      galleryShowFilters: false,
      galleryShowSort: false,
      gallerySortNameAsc: true,
      gallerySortNameDes: true,
      gallerySortNewest: true,
      gallerySortPriceAsc: true,
      gallerySortPriceDes: true,
      gallery_showAddToCartButton: false,
      gallery_addToCartButtonShowOnHover: false,
      gallery_showAddToCartQuantity: false,
      gallery_showDividers: false,
      gallery_showPrice: true,
      gallery_showProductName: true,
      gallery_showTitle: undefined,
      gallery_paginationFirstLastArrows: false,
      gallery_showProductOptionsButton: false,
      showQuickView: true,
      responsive: false,
    },
    numbers: {
      galleryColumns: nextGalleryColumns,
      galleryRows: nextGalleryRows,
      galleryMargin: 10,
      gallery_imageMode: ImageModeId.Crop,
      galleryImageRatio: ImageRatioId._1x1,
      'mobile:galleryMargin': 10,
      'mobile:galleryColumns': 1,
      gallery_addToCartAction: AddToCartActionOption.MINI_CART,
      gallery_productSize: DEFAULT_PRODUCT_IMAGE_SIZE,
      gallery_productsCount: DEFAULT_AUTO_GRID_PRODUCTS_COUNT,
      gallery_gapSize: 20,
      gallery_gridType: isEditorX ? GridType.AUTO : GridType.MANUAL,
      gallery_loadMoreProductsType: LoadMoreType.BUTTON,
      gallery_paginationFormat: PaginationType.PAGES,
    },
    fonts: {
      gallery_hoverType: {
        fontStyleParam: false,
        value: showAlternativeImage ? HoverType.Alternate : HoverType.None,
      },
      gallery_paginationAlignment: {fontStyleParam: false, value: ContentJustification.CENTER},
    },
  };
};
