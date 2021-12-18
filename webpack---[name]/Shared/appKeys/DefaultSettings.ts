import {
  AlignmentOptions,
  ButtonStyleOptions,
  DockLocationOptions,
  OfferingLayoutOptions,
  ImageAndTextRatioOptions,
  ImagePositionOptions,
  ImageResizeOptions,
  OfferingListLayoutOptions,
  SettingsKeys,
  ImageShapeOptions,
  MobileSettingsKeys,
  UnitOptions,
  CategoryLayoutOptions,
  CategoriesType,
  FilterByOptions,
} from './SettingsKeys';
import { mergeDesktopDefaultsIntoMobile } from './mobileToDesktopKeys';
import { SelectedOfferingsFilterType } from '../../SettingsEditor/domain/selected-resources';
import { FontProperties } from '../types';

const fontHeading2 = (size: number, htmlTag: string): FontProperties => ({
  size,
  editorKey: 'font_2',
  htmlTag,
});

const fontParagraph2 = (
  size: number = 16,
  htmlTag: string = '',
): FontProperties => ({
  size,
  editorKey: 'font_8',
  htmlTag,
});

const color = (themeName) => ({ themeName });

const colorWithOpacity = (themeName, opacity) => ({
  themeName,
  opacity,
});

const defaultSettingsDataAll = {
  [SettingsKeys.OFFERING_LIST_LAYOUT]: OfferingListLayoutOptions.CLASSIC,
  [SettingsKeys.TEXT_ALIGNMENT]: AlignmentOptions.LEFT,
  [SettingsKeys.DISPLAY_IMAGE]: true,
  [SettingsKeys.DISPLAY_TAG_LINE]: true,
  [SettingsKeys.DISPLAY_DIVIDER]: true,
  [SettingsKeys.DISPLAY_PRICE]: true,
  [SettingsKeys.DISPLAY_DURATION]: true,
  [SettingsKeys.DISPLAY_START_DATE]: true,
  [SettingsKeys.DISPLAY_DAYS_OFFERED]: true,
  [SettingsKeys.DISPLAY_BUTTON]: true,
  [SettingsKeys.DISPLAY_MORE_INFO_LABEL]: false,
  [SettingsKeys.DISPLAY_MULTI_OFFERINGS_TITLE]: true,
  [SettingsKeys.DISPLAY_ONLINE_INDICATION]: false,
  [SettingsKeys.CATEGORIES_TYPE]: CategoriesType.SERVICE_CATEGORIES,
  [SettingsKeys.FILTER_BY]: FilterByOptions.BY_SERVICES,
  [SettingsKeys.SELECTED_LOCATIONS]: [],
  [SettingsKeys.DISPLAY_CATEGORIES]: true,
  [SettingsKeys.DISPLAY_SERVICE_DIVIDER]: true,
  [SettingsKeys.IMAGE_RESIZE_OPTION]: ImageResizeOptions.CROP,
  [SettingsKeys.IMAGE_SHAPE_OPTION]: ImageShapeOptions.SQUARE,
  [SettingsKeys.IMAGE_POSITION_OPTION]: ImagePositionOptions.LEFT,
  [SettingsKeys.PIN_LOCATION]: DockLocationOptions.MIDDLE,
  [SettingsKeys.IMAGE_AND_TEXT_POSITION]: OfferingLayoutOptions.SIDE_BY_SIDE,
  [SettingsKeys.IMAGE_AND_TEXT_RATIO]: ImageAndTextRatioOptions.RATIO_50_50,
  [SettingsKeys.IMAGE_AND_TEXT_RATIO_IS_FLIPED]: false,
  [SettingsKeys.BORDER_WIDTH]: 1,
  [SettingsKeys.STRIP_BORDER_WIDTH]: 0,
  [SettingsKeys.DIVIDER_WIDTH]: 1,
  [SettingsKeys.SERVICE_DIVIDER_WIDTH]: 1,
  [SettingsKeys.BUTTON_STYLE]: ButtonStyleOptions.SQUARE_FILL,
  [SettingsKeys.BUTTON_CORNER_RADIUS]: 100,
  [SettingsKeys.BUTTON_BORDER_WIDTH]: 1,
  [SettingsKeys.OFFERING_NAME_COLOR]: color('color-5'),
  [SettingsKeys.OFFERING_TAGLINE_COLOR]: color('color-5'),
  [SettingsKeys.OFFERING_MORE_INFO_LABEL_COLOR]: color('color-5'),
  [SettingsKeys.OFFERING_DETAILS_COLOR]: color('color-5'),
  [SettingsKeys.BACKGROUND_COLOR]: color('color-1'),
  [SettingsKeys.BORDER_COLOR]: colorWithOpacity('color-5', 20),
  [SettingsKeys.IMAGE_BACKGROUND_COLOR]: colorWithOpacity('color-5', 20),
  [SettingsKeys.DIVIDER_COLOR]: colorWithOpacity('color-5', 20),
  [SettingsKeys.SERVICE_DIVIDER_COLOR]: colorWithOpacity('color-5', 20),
  [SettingsKeys.BUTTON_TEXT_COLOR_FILL]: color('color-1'),
  [SettingsKeys.BUTTON_TEXT_COLOR_HOLE]: color('color-8'),
  [SettingsKeys.BUTTON_BORDER_COLOR]: color('color-8'),
  [SettingsKeys.BUTTON_BACKGROUND_COLOR]: color('color-8'),
  [SettingsKeys.MULTI_OFFERINGS_TITLE_COLOR]: color('color-5'),
  [SettingsKeys.CATEGORY_SELECTED_UNDERLINE_COLOR]: color('color-8'),
  [SettingsKeys.CATEGORY_DIVIDER_COLOR]: colorWithOpacity('color-5', 20),
  [SettingsKeys.CATEGORY_NAME_COLOR]: color('color-5'),
  [SettingsKeys.MULTI_OFFERINGS_BACKGROUND_COLOR]: color('color-1'),
  [SettingsKeys.OFFERING_TAGLINE_FONT]: fontParagraph2(16, 'p'),
  [SettingsKeys.OFFERING_MORE_INFO_LABEL_FONT]: fontParagraph2(),
  [SettingsKeys.OFFERING_DETAILS_FONT]: fontParagraph2(16, 'p'),
  [SettingsKeys.MULTI_OFFERINGS_TITLE_FONT]: fontHeading2(32, 'h1'),
  [SettingsKeys.BUTTON_TEXT_FONT]: fontParagraph2(),
  [SettingsKeys.OFFERING_NAME_FONT]: fontHeading2(24, 'h2'),
  [SettingsKeys.CATEGORY_NAME_FONT]: fontParagraph2(),
  [SettingsKeys.SPACE_BETWEEN_OFFERINGS]: 60,
  [SettingsKeys.STRIP_SPACE_BETWEEN_OFFERINGS]: 0,
  [SettingsKeys.STRIP_SIDE_PADDING]: 0,
  [SettingsKeys.GRID_SIDE_PADDING]: 32,
  [SettingsKeys.CLASSIC_SIDE_PADDING]: 60,
  [SettingsKeys.OVERLAPPING_SIDE_PADDING]: 60,
  [SettingsKeys.STRIP_VERTICAL_PADDING]: 32,
  [SettingsKeys.GRID_VERTICAL_PADDING]: 32,
  [SettingsKeys.CLASSIC_VERTICAL_PADDING]: 60,
  [SettingsKeys.OVERLAPPING_VERTICAL_PADDING]: 60,
  [SettingsKeys.STRIP_SIDE_PADDING_UNIT]: UnitOptions.PIXEL,
  [SettingsKeys.GRID_SIDE_PADDING_UNIT]: UnitOptions.PIXEL,
  [SettingsKeys.CLASSIC_SIDE_PADDING_UNIT]: UnitOptions.PIXEL,
  [SettingsKeys.OVERLAPPING_SIDE_PADDING_UNIT]: UnitOptions.PIXEL,
  [SettingsKeys.STRIP_VERTICAL_PADDING_UNIT]: UnitOptions.PIXEL,
  [SettingsKeys.GRID_VERTICAL_PADDING_UNIT]: UnitOptions.PIXEL,
  [SettingsKeys.CLASSIC_VERTICAL_PADDING_UNIT]: UnitOptions.PIXEL,
  [SettingsKeys.OVERLAPPING_VERTICAL_PADDING_UNIT]: UnitOptions.PIXEL,
  [SettingsKeys.CATEGORY_ALIGNMENT]: AlignmentOptions.CENTER,
  [SettingsKeys.MULTI_OFFERINGS_TITLE_ALIGNMENT]: AlignmentOptions.CENTER,
  [SettingsKeys.FIT_CATEGORY_WIDTH]: false,
  [SettingsKeys.CATEGORY_ALL_SERVICES_SHOW]: false,
  [SettingsKeys.CATEGORY_ALL_SERVICES_TEXT]: '',
  [SettingsKeys.BOOK_FLOW_ACTION_TEXT]: '',
  [SettingsKeys.NO_BOOK_FLOW_ACTION_TEXT]: '',
  [SettingsKeys.PENDING_APPROVAL_FLOW_ACTION_TEXT]: '',
  [SettingsKeys.MULTI_OFFERINGS_TITLE_TEXT]: '',
  [SettingsKeys.SELECTED_RESOURCES]: [],
  [SettingsKeys.LAYOUT_CARDS_PER_ROW]: 3,
  [SettingsKeys.CARDS_SPACING]: 32,
  [SettingsKeys.CATEGORY_BACKGROUND_COLOR]: color('color-1'),
  [SettingsKeys.CATEGORY_LAYOUT_OPTION]: CategoryLayoutOptions.TABS,
  [SettingsKeys.CATEGORY_BORDER_WIDTH]: 1,
  [SettingsKeys.CATEGORY_BORDER_RADIUS]: 0,
  [SettingsKeys.CATEGORY_SPACING]: 8,
  [SettingsKeys.CATEGORY_SELECTED_TEXT_COLOR]: color('color-1'),
  [SettingsKeys.CATEGORY_SELECTED_BORDER_COLOR]: color('color-8'),
  [SettingsKeys.CATEGORY_HOVER_BACKGROUND_COLOR]: color('color-1'),
  [SettingsKeys.CATEGORY_HOVER_TEXT_COLOR]: color('color-5'),
  [SettingsKeys.CATEGORY_HOVER_BORDER_COLOR]: colorWithOpacity('color-5', 60),
};

const defaultSettingsDataMobile = {
  ...mergeDesktopDefaultsIntoMobile(defaultSettingsDataAll),
  [MobileSettingsKeys.MOBILE_IMAGE_SHAPE_OPTION]: ImageShapeOptions.RECTANGLE,
  [MobileSettingsKeys.MOBILE_PIN_LOCATION]: DockLocationOptions.MIDDLE,
  [MobileSettingsKeys.MOBILE_IMAGE_RESIZE_OPTION]: ImageResizeOptions.CROP,
  [MobileSettingsKeys.MOBILE_CARDS_SPACING]: 20,
  [MobileSettingsKeys.MOBILE_MULTI_OFFERINGS_TITLE_FONT_SIZE]: 24,
  [MobileSettingsKeys.MOBILE_CATEGORY_NAME_FONT_SIZE]: 14,
  [MobileSettingsKeys.MOBILE_BUTTON_TEXT_FONT_SIZE]: 14,
  [MobileSettingsKeys.MOBILE_OFFERING_NAME_FONT_SIZE]: 20,
  [MobileSettingsKeys.MOBILE_OFFERING_TAGLINE_FONT_SIZE]: 14,
  [MobileSettingsKeys.MOBILE_MORE_INFO_LABEL_FONT_SIZE]: 14,
  [MobileSettingsKeys.MOBILE_OFFERING_DETAILS_FONT_SIZE]: 14,
  [MobileSettingsKeys.MOBILE_SIDE_PADDING]: 20,
  [MobileSettingsKeys.MOBILE_SIDE_PADDING_UNIT]: 'px',
  [MobileSettingsKeys.MOBILE_VERTICAL_PADDING]: 20,
  [MobileSettingsKeys.MOBILE_VERTICAL_PADDING_UNIT]: 'px',
  [MobileSettingsKeys.MOBILE_CATEGORY_LAYOUT_OPTION]:
    CategoryLayoutOptions.DROPDOWN,
  [MobileSettingsKeys.MOBILE_CATEGORY_BORDER_WIDTH]: 1,
  [MobileSettingsKeys.MOBILE_CATEGORY_BACKGROUND_COLOR]: colorWithOpacity(
    'color-1',
    100,
  ),
  [MobileSettingsKeys.MOBILE_CATEGORY_BORDER_COLOR]: colorWithOpacity(
    'color-5',
    40,
  ),
  [MobileSettingsKeys.MOBILE_CATEGORY_NAME_COLOR]: color('color-5'),
  [MobileSettingsKeys.MOBILE_CATEGORY_NAME_FONT]: fontParagraph2(14),
};

export const defaultSettingsData = {
  ...defaultSettingsDataAll,
  ...defaultSettingsDataMobile,
};

export const CLASSIC_PRESET_ID = 'Wix_Bookings_Offering_List_Widget_Classic';
export const OVERLAPPING_PRESET_ID =
  'Wix_Bookings_Offering_List_Widget_Overlapping';
export const STRIP_PRESET_ID = 'Wix_Bookings_Offering_List_Widget_Strip';
export const GRID_PRESET_ID = 'Wix_Bookings_Offering_List_Widget_Grid';
export const BOOKINGS_MAIN_PAGE_PRESET_ID =
  'Wix_Bookings_Offering_List_Main_Page';
export const SINGLE_SERVICE_PRESET_ID = 'Wix_Bookings_Single_Service_Widget';

export const CLASSIC_EDITOR_X_PRESET_ID =
  'Wix_Bookings_Offering_List_Widget_Classic_Editor_X';
export const OVERLAPPING_EDITOR_X_PRESET_ID =
  'Wix_Bookings_Offering_List_Widget_Overlapping_Editor_X';
export const STRIP_EDITOR_X_PRESET_ID =
  'Wix_Bookings_Offering_List_Widget_Strip_Editor_X';
export const GRID_EDITOR_X_PRESET_ID =
  'Wix_Bookings_Offering_List_Widget_Grid_Editor_X';
export const BOOKINGS_MAIN_PAGE_EDITOR_X_PRESET_ID =
  'Wix_Bookings_Offering_List_Main_Page_Editor_X';
export const SINGLE_SERVICE_EDITOR_X_PRESET_ID =
  'Wix_Bookings_Single_Service_Widget_Editor_X';

const CLASSIC_DEFAULT_SETTINGS = {
  ...defaultSettingsData,
  [SettingsKeys.IMAGE_AND_TEXT_RATIO]: ImageAndTextRatioOptions.RATIO_40_60,
  [SettingsKeys.IMAGE_AND_TEXT_RATIO_IS_FLIPED]: true,
  [SettingsKeys.DISPLAY_DURATION]: false,
  [SettingsKeys.DISPLAY_CATEGORIES]: false,
  [SettingsKeys.DISPLAY_MULTI_OFFERINGS_TITLE]: false,
};

const OVERLAPPING_DEFAULT_SETTINGS = {
  ...defaultSettingsData,
  [SettingsKeys.OFFERING_LIST_LAYOUT]: OfferingListLayoutOptions.OVERLAPPING,
  [SettingsKeys.DISPLAY_CATEGORIES]: false,
  [SettingsKeys.DISPLAY_MULTI_OFFERINGS_TITLE]: false,
};

const STRIP_DEFAULT_SETTINGS = {
  ...defaultSettingsData,
  [SettingsKeys.OFFERING_LIST_LAYOUT]: OfferingListLayoutOptions.STRIP,
  [SettingsKeys.IMAGE_SHAPE_OPTION]: ImageShapeOptions.ROUND,
  [SettingsKeys.STRIP_SIDE_PADDING]: 0,
  [SettingsKeys.BACKGROUND_COLOR]: colorWithOpacity('color-1', 0),
  [SettingsKeys.DISPLAY_IMAGE]: false,
  [SettingsKeys.DISPLAY_TAG_LINE]: false,
  [SettingsKeys.DISPLAY_DURATION]: false,
  [SettingsKeys.DISPLAY_START_DATE]: false,
  [SettingsKeys.DISPLAY_DAYS_OFFERED]: false,
  [SettingsKeys.DISPLAY_MULTI_OFFERINGS_TITLE]: false,
  [SettingsKeys.DISPLAY_CATEGORIES]: false,
};

const GRID_DEFAULT_SETTINGS = {
  ...defaultSettingsData,
  [SettingsKeys.OFFERING_LIST_LAYOUT]: OfferingListLayoutOptions.GRID,
  [SettingsKeys.LAYOUT_CARDS_PER_ROW]: 3,
  [SettingsKeys.IMAGE_SHAPE_OPTION]: ImageShapeOptions.SQUARE,
  [SettingsKeys.DISPLAY_CATEGORIES]: false,
  [SettingsKeys.DISPLAY_MULTI_OFFERINGS_TITLE]: false,
  [SettingsKeys.DISPLAY_TAG_LINE]: false,
  [SettingsKeys.DISPLAY_MULTI_OFFERINGS_TITLE]: false,
  [SettingsKeys.DISPLAY_CATEGORIES]: false,
};

const BOOKINGS_MAIN_PAGE_SETTINGS = {
  ...defaultSettingsData,
  [SettingsKeys.OFFERING_LIST_LAYOUT]: OfferingListLayoutOptions.GRID,
  [SettingsKeys.LAYOUT_CARDS_PER_ROW]: 3,
  [SettingsKeys.IMAGE_SHAPE_OPTION]: ImageShapeOptions.RECTANGLE,
  [SettingsKeys.DISPLAY_TAG_LINE]: false,
};

const SINGLE_SERVICE_DEFAULT_SETTINGS = {
  ...defaultSettingsData,
  [SettingsKeys.IMAGE_AND_TEXT_RATIO]: ImageAndTextRatioOptions.RATIO_50_50,
  [SettingsKeys.IMAGE_AND_TEXT_RATIO_IS_FLIPED]: true,
  [SettingsKeys.DISPLAY_DIVIDER]: false,
  [SettingsKeys.DISPLAY_TAG_LINE]: false,
  [SettingsKeys.DISPLAY_CATEGORIES]: false,
  [SettingsKeys.DISPLAY_MULTI_OFFERINGS_TITLE]: false,
  [SettingsKeys.TEXT_ALIGNMENT]: AlignmentOptions.CENTER,
  [SettingsKeys.SELECTED_RESOURCES]: {
    filter: SelectedOfferingsFilterType.FIRST,
  },
  [MobileSettingsKeys.MOBILE_DISPLAY_DIVIDER]: false,
  [MobileSettingsKeys.MOBILE_DISPLAY_TAG_LINE]: false,
  [MobileSettingsKeys.MOBILE_TEXT_ALIGNMENT]: AlignmentOptions.CENTER,
};

export const defaultSettingsDataMap = new Map();
defaultSettingsDataMap.set(CLASSIC_PRESET_ID, CLASSIC_DEFAULT_SETTINGS);
defaultSettingsDataMap.set(OVERLAPPING_PRESET_ID, OVERLAPPING_DEFAULT_SETTINGS);
defaultSettingsDataMap.set(STRIP_PRESET_ID, STRIP_DEFAULT_SETTINGS);
defaultSettingsDataMap.set(GRID_PRESET_ID, GRID_DEFAULT_SETTINGS);
defaultSettingsDataMap.set(
  BOOKINGS_MAIN_PAGE_PRESET_ID,
  BOOKINGS_MAIN_PAGE_SETTINGS,
);
defaultSettingsDataMap.set(
  SINGLE_SERVICE_PRESET_ID,
  SINGLE_SERVICE_DEFAULT_SETTINGS,
);
defaultSettingsDataMap.set(
  CLASSIC_EDITOR_X_PRESET_ID,
  CLASSIC_DEFAULT_SETTINGS,
);
defaultSettingsDataMap.set(
  OVERLAPPING_EDITOR_X_PRESET_ID,
  OVERLAPPING_DEFAULT_SETTINGS,
);
defaultSettingsDataMap.set(STRIP_EDITOR_X_PRESET_ID, STRIP_DEFAULT_SETTINGS);
defaultSettingsDataMap.set(GRID_EDITOR_X_PRESET_ID, GRID_DEFAULT_SETTINGS);
defaultSettingsDataMap.set(
  BOOKINGS_MAIN_PAGE_EDITOR_X_PRESET_ID,
  BOOKINGS_MAIN_PAGE_SETTINGS,
);
defaultSettingsDataMap.set(
  SINGLE_SERVICE_EDITOR_X_PRESET_ID,
  SINGLE_SERVICE_DEFAULT_SETTINGS,
);
