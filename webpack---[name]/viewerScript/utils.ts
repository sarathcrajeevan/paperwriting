import {IWishlistStyleParams} from '../types/app-types';
import {GridType} from '@wix/wixstores-client-gallery/dist/es/src/types/galleryTypes';

export function productsPerPage(styleParams: IWishlistStyleParams) {
  const {
    numbers: {gallery_productsCount, galleryRows, galleryColumns, gallery_gridType},
  } = styleParams;

  return {
    [GridType.MANUAL]: galleryRows * galleryColumns,
    [GridType.AUTO]: gallery_productsCount,
  }[gallery_gridType];
}
