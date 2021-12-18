/* eslint-disable import/no-cycle */
import {
  DEFAULT_ROWS,
  DEFAULT_COLS,
  DEFAULT_MOBILE_PRODUCTS_COUNT,
  DEFAULT_AUTO_GRID_PRODUCTS_COUNT,
  MAX_ROWS,
  MAX_COLS,
} from '../constants';

export function getInitialProductsCountToFetch(
  isMobile: boolean,
  isEditor: boolean,
  isAutoGrid: boolean,
  rows: number = DEFAULT_ROWS,
  cols: number = DEFAULT_COLS,
  autoGridProductsCount: number
) {
  if (isEditor) {
    return isAutoGrid ? DEFAULT_AUTO_GRID_PRODUCTS_COUNT : MAX_ROWS * MAX_COLS;
  }
  if (isMobile) {
    return DEFAULT_MOBILE_PRODUCTS_COUNT;
  }
  if (isAutoGrid) {
    return autoGridProductsCount;
  }
  return rows * cols;
}
