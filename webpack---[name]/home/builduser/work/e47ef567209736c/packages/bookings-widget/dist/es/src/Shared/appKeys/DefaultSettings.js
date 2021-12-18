"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.defaultSettingsDataMap = exports.SINGLE_SERVICE_EDITOR_X_PRESET_ID = exports.BOOKINGS_MAIN_PAGE_EDITOR_X_PRESET_ID = exports.GRID_EDITOR_X_PRESET_ID = exports.STRIP_EDITOR_X_PRESET_ID = exports.OVERLAPPING_EDITOR_X_PRESET_ID = exports.CLASSIC_EDITOR_X_PRESET_ID = exports.SINGLE_SERVICE_PRESET_ID = exports.BOOKINGS_MAIN_PAGE_PRESET_ID = exports.GRID_PRESET_ID = exports.STRIP_PRESET_ID = exports.OVERLAPPING_PRESET_ID = exports.CLASSIC_PRESET_ID = exports.defaultSettingsData = void 0;
var tslib_1 = require("tslib");
var SettingsKeys_1 = require("./SettingsKeys");
var mobileToDesktopKeys_1 = require("./mobileToDesktopKeys");
var selected_resources_1 = require("../../SettingsEditor/domain/selected-resources");
var fontHeading2 = function(size, htmlTag) {
    return ({
        size: size,
        editorKey: 'font_2',
        htmlTag: htmlTag,
    });
};
var fontParagraph2 = function(size, htmlTag) {
    if (size === void 0) {
        size = 16;
    }
    if (htmlTag === void 0) {
        htmlTag = '';
    }
    return ({
        size: size,
        editorKey: 'font_8',
        htmlTag: htmlTag,
    });
};
var color = function(themeName) {
    return ({
        themeName: themeName
    });
};
var colorWithOpacity = function(themeName, opacity) {
    return ({
        themeName: themeName,
        opacity: opacity,
    });
};
var defaultSettingsDataAll = (_a = {},
    _a[SettingsKeys_1.SettingsKeys.OFFERING_LIST_LAYOUT] = SettingsKeys_1.OfferingListLayoutOptions.CLASSIC,
    _a[SettingsKeys_1.SettingsKeys.TEXT_ALIGNMENT] = SettingsKeys_1.AlignmentOptions.LEFT,
    _a[SettingsKeys_1.SettingsKeys.DISPLAY_IMAGE] = true,
    _a[SettingsKeys_1.SettingsKeys.DISPLAY_TAG_LINE] = true,
    _a[SettingsKeys_1.SettingsKeys.DISPLAY_DIVIDER] = true,
    _a[SettingsKeys_1.SettingsKeys.DISPLAY_PRICE] = true,
    _a[SettingsKeys_1.SettingsKeys.DISPLAY_DURATION] = true,
    _a[SettingsKeys_1.SettingsKeys.DISPLAY_START_DATE] = true,
    _a[SettingsKeys_1.SettingsKeys.DISPLAY_DAYS_OFFERED] = true,
    _a[SettingsKeys_1.SettingsKeys.DISPLAY_BUTTON] = true,
    _a[SettingsKeys_1.SettingsKeys.DISPLAY_MORE_INFO_LABEL] = false,
    _a[SettingsKeys_1.SettingsKeys.DISPLAY_MULTI_OFFERINGS_TITLE] = true,
    _a[SettingsKeys_1.SettingsKeys.DISPLAY_ONLINE_INDICATION] = false,
    _a[SettingsKeys_1.SettingsKeys.CATEGORIES_TYPE] = SettingsKeys_1.CategoriesType.SERVICE_CATEGORIES,
    _a[SettingsKeys_1.SettingsKeys.FILTER_BY] = SettingsKeys_1.FilterByOptions.BY_SERVICES,
    _a[SettingsKeys_1.SettingsKeys.SELECTED_LOCATIONS] = [],
    _a[SettingsKeys_1.SettingsKeys.DISPLAY_CATEGORIES] = true,
    _a[SettingsKeys_1.SettingsKeys.DISPLAY_SERVICE_DIVIDER] = true,
    _a[SettingsKeys_1.SettingsKeys.IMAGE_RESIZE_OPTION] = SettingsKeys_1.ImageResizeOptions.CROP,
    _a[SettingsKeys_1.SettingsKeys.IMAGE_SHAPE_OPTION] = SettingsKeys_1.ImageShapeOptions.SQUARE,
    _a[SettingsKeys_1.SettingsKeys.IMAGE_POSITION_OPTION] = SettingsKeys_1.ImagePositionOptions.LEFT,
    _a[SettingsKeys_1.SettingsKeys.PIN_LOCATION] = SettingsKeys_1.DockLocationOptions.MIDDLE,
    _a[SettingsKeys_1.SettingsKeys.IMAGE_AND_TEXT_POSITION] = SettingsKeys_1.OfferingLayoutOptions.SIDE_BY_SIDE,
    _a[SettingsKeys_1.SettingsKeys.IMAGE_AND_TEXT_RATIO] = SettingsKeys_1.ImageAndTextRatioOptions.RATIO_50_50,
    _a[SettingsKeys_1.SettingsKeys.IMAGE_AND_TEXT_RATIO_IS_FLIPED] = false,
    _a[SettingsKeys_1.SettingsKeys.BORDER_WIDTH] = 1,
    _a[SettingsKeys_1.SettingsKeys.STRIP_BORDER_WIDTH] = 0,
    _a[SettingsKeys_1.SettingsKeys.DIVIDER_WIDTH] = 1,
    _a[SettingsKeys_1.SettingsKeys.SERVICE_DIVIDER_WIDTH] = 1,
    _a[SettingsKeys_1.SettingsKeys.BUTTON_STYLE] = SettingsKeys_1.ButtonStyleOptions.SQUARE_FILL,
    _a[SettingsKeys_1.SettingsKeys.BUTTON_CORNER_RADIUS] = 100,
    _a[SettingsKeys_1.SettingsKeys.BUTTON_BORDER_WIDTH] = 1,
    _a[SettingsKeys_1.SettingsKeys.OFFERING_NAME_COLOR] = color('color-5'),
    _a[SettingsKeys_1.SettingsKeys.OFFERING_TAGLINE_COLOR] = color('color-5'),
    _a[SettingsKeys_1.SettingsKeys.OFFERING_MORE_INFO_LABEL_COLOR] = color('color-5'),
    _a[SettingsKeys_1.SettingsKeys.OFFERING_DETAILS_COLOR] = color('color-5'),
    _a[SettingsKeys_1.SettingsKeys.BACKGROUND_COLOR] = color('color-1'),
    _a[SettingsKeys_1.SettingsKeys.BORDER_COLOR] = colorWithOpacity('color-5', 20),
    _a[SettingsKeys_1.SettingsKeys.IMAGE_BACKGROUND_COLOR] = colorWithOpacity('color-5', 20),
    _a[SettingsKeys_1.SettingsKeys.DIVIDER_COLOR] = colorWithOpacity('color-5', 20),
    _a[SettingsKeys_1.SettingsKeys.SERVICE_DIVIDER_COLOR] = colorWithOpacity('color-5', 20),
    _a[SettingsKeys_1.SettingsKeys.BUTTON_TEXT_COLOR_FILL] = color('color-1'),
    _a[SettingsKeys_1.SettingsKeys.BUTTON_TEXT_COLOR_HOLE] = color('color-8'),
    _a[SettingsKeys_1.SettingsKeys.BUTTON_BORDER_COLOR] = color('color-8'),
    _a[SettingsKeys_1.SettingsKeys.BUTTON_BACKGROUND_COLOR] = color('color-8'),
    _a[SettingsKeys_1.SettingsKeys.MULTI_OFFERINGS_TITLE_COLOR] = color('color-5'),
    _a[SettingsKeys_1.SettingsKeys.CATEGORY_SELECTED_UNDERLINE_COLOR] = color('color-8'),
    _a[SettingsKeys_1.SettingsKeys.CATEGORY_DIVIDER_COLOR] = colorWithOpacity('color-5', 20),
    _a[SettingsKeys_1.SettingsKeys.CATEGORY_NAME_COLOR] = color('color-5'),
    _a[SettingsKeys_1.SettingsKeys.MULTI_OFFERINGS_BACKGROUND_COLOR] = color('color-1'),
    _a[SettingsKeys_1.SettingsKeys.OFFERING_TAGLINE_FONT] = fontParagraph2(16, 'p'),
    _a[SettingsKeys_1.SettingsKeys.OFFERING_MORE_INFO_LABEL_FONT] = fontParagraph2(),
    _a[SettingsKeys_1.SettingsKeys.OFFERING_DETAILS_FONT] = fontParagraph2(16, 'p'),
    _a[SettingsKeys_1.SettingsKeys.MULTI_OFFERINGS_TITLE_FONT] = fontHeading2(32, 'h1'),
    _a[SettingsKeys_1.SettingsKeys.BUTTON_TEXT_FONT] = fontParagraph2(),
    _a[SettingsKeys_1.SettingsKeys.OFFERING_NAME_FONT] = fontHeading2(24, 'h2'),
    _a[SettingsKeys_1.SettingsKeys.CATEGORY_NAME_FONT] = fontParagraph2(),
    _a[SettingsKeys_1.SettingsKeys.SPACE_BETWEEN_OFFERINGS] = 60,
    _a[SettingsKeys_1.SettingsKeys.STRIP_SPACE_BETWEEN_OFFERINGS] = 0,
    _a[SettingsKeys_1.SettingsKeys.STRIP_SIDE_PADDING] = 0,
    _a[SettingsKeys_1.SettingsKeys.GRID_SIDE_PADDING] = 32,
    _a[SettingsKeys_1.SettingsKeys.CLASSIC_SIDE_PADDING] = 60,
    _a[SettingsKeys_1.SettingsKeys.OVERLAPPING_SIDE_PADDING] = 60,
    _a[SettingsKeys_1.SettingsKeys.STRIP_VERTICAL_PADDING] = 32,
    _a[SettingsKeys_1.SettingsKeys.GRID_VERTICAL_PADDING] = 32,
    _a[SettingsKeys_1.SettingsKeys.CLASSIC_VERTICAL_PADDING] = 60,
    _a[SettingsKeys_1.SettingsKeys.OVERLAPPING_VERTICAL_PADDING] = 60,
    _a[SettingsKeys_1.SettingsKeys.STRIP_SIDE_PADDING_UNIT] = SettingsKeys_1.UnitOptions.PIXEL,
    _a[SettingsKeys_1.SettingsKeys.GRID_SIDE_PADDING_UNIT] = SettingsKeys_1.UnitOptions.PIXEL,
    _a[SettingsKeys_1.SettingsKeys.CLASSIC_SIDE_PADDING_UNIT] = SettingsKeys_1.UnitOptions.PIXEL,
    _a[SettingsKeys_1.SettingsKeys.OVERLAPPING_SIDE_PADDING_UNIT] = SettingsKeys_1.UnitOptions.PIXEL,
    _a[SettingsKeys_1.SettingsKeys.STRIP_VERTICAL_PADDING_UNIT] = SettingsKeys_1.UnitOptions.PIXEL,
    _a[SettingsKeys_1.SettingsKeys.GRID_VERTICAL_PADDING_UNIT] = SettingsKeys_1.UnitOptions.PIXEL,
    _a[SettingsKeys_1.SettingsKeys.CLASSIC_VERTICAL_PADDING_UNIT] = SettingsKeys_1.UnitOptions.PIXEL,
    _a[SettingsKeys_1.SettingsKeys.OVERLAPPING_VERTICAL_PADDING_UNIT] = SettingsKeys_1.UnitOptions.PIXEL,
    _a[SettingsKeys_1.SettingsKeys.CATEGORY_ALIGNMENT] = SettingsKeys_1.AlignmentOptions.CENTER,
    _a[SettingsKeys_1.SettingsKeys.MULTI_OFFERINGS_TITLE_ALIGNMENT] = SettingsKeys_1.AlignmentOptions.CENTER,
    _a[SettingsKeys_1.SettingsKeys.FIT_CATEGORY_WIDTH] = false,
    _a[SettingsKeys_1.SettingsKeys.CATEGORY_ALL_SERVICES_SHOW] = false,
    _a[SettingsKeys_1.SettingsKeys.CATEGORY_ALL_SERVICES_TEXT] = '',
    _a[SettingsKeys_1.SettingsKeys.BOOK_FLOW_ACTION_TEXT] = '',
    _a[SettingsKeys_1.SettingsKeys.NO_BOOK_FLOW_ACTION_TEXT] = '',
    _a[SettingsKeys_1.SettingsKeys.PENDING_APPROVAL_FLOW_ACTION_TEXT] = '',
    _a[SettingsKeys_1.SettingsKeys.MULTI_OFFERINGS_TITLE_TEXT] = '',
    _a[SettingsKeys_1.SettingsKeys.SELECTED_RESOURCES] = [],
    _a[SettingsKeys_1.SettingsKeys.LAYOUT_CARDS_PER_ROW] = 3,
    _a[SettingsKeys_1.SettingsKeys.CARDS_SPACING] = 32,
    _a[SettingsKeys_1.SettingsKeys.CATEGORY_BACKGROUND_COLOR] = color('color-1'),
    _a[SettingsKeys_1.SettingsKeys.CATEGORY_LAYOUT_OPTION] = SettingsKeys_1.CategoryLayoutOptions.TABS,
    _a[SettingsKeys_1.SettingsKeys.CATEGORY_BORDER_WIDTH] = 1,
    _a[SettingsKeys_1.SettingsKeys.CATEGORY_BORDER_RADIUS] = 0,
    _a[SettingsKeys_1.SettingsKeys.CATEGORY_SPACING] = 8,
    _a[SettingsKeys_1.SettingsKeys.CATEGORY_SELECTED_TEXT_COLOR] = color('color-1'),
    _a[SettingsKeys_1.SettingsKeys.CATEGORY_SELECTED_BORDER_COLOR] = color('color-8'),
    _a[SettingsKeys_1.SettingsKeys.CATEGORY_HOVER_BACKGROUND_COLOR] = color('color-1'),
    _a[SettingsKeys_1.SettingsKeys.CATEGORY_HOVER_TEXT_COLOR] = color('color-5'),
    _a[SettingsKeys_1.SettingsKeys.CATEGORY_HOVER_BORDER_COLOR] = colorWithOpacity('color-5', 60),
    _a);
var defaultSettingsDataMobile = tslib_1.__assign(tslib_1.__assign({}, mobileToDesktopKeys_1.mergeDesktopDefaultsIntoMobile(defaultSettingsDataAll)), (_b = {}, _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_IMAGE_SHAPE_OPTION] = SettingsKeys_1.ImageShapeOptions.RECTANGLE, _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_PIN_LOCATION] = SettingsKeys_1.DockLocationOptions.MIDDLE, _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_IMAGE_RESIZE_OPTION] = SettingsKeys_1.ImageResizeOptions.CROP, _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_CARDS_SPACING] = 20, _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_MULTI_OFFERINGS_TITLE_FONT_SIZE] = 24, _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_CATEGORY_NAME_FONT_SIZE] = 14, _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_BUTTON_TEXT_FONT_SIZE] = 14, _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_OFFERING_NAME_FONT_SIZE] = 20, _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_OFFERING_TAGLINE_FONT_SIZE] = 14, _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_MORE_INFO_LABEL_FONT_SIZE] = 14, _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_OFFERING_DETAILS_FONT_SIZE] = 14, _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_SIDE_PADDING] = 20, _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_SIDE_PADDING_UNIT] = 'px', _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_VERTICAL_PADDING] = 20, _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_VERTICAL_PADDING_UNIT] = 'px', _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_CATEGORY_LAYOUT_OPTION] = SettingsKeys_1.CategoryLayoutOptions.DROPDOWN, _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_CATEGORY_BORDER_WIDTH] = 1, _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_CATEGORY_BACKGROUND_COLOR] = colorWithOpacity('color-1', 100), _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_CATEGORY_BORDER_COLOR] = colorWithOpacity('color-5', 40), _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_CATEGORY_NAME_COLOR] = color('color-5'), _b[SettingsKeys_1.MobileSettingsKeys.MOBILE_CATEGORY_NAME_FONT] = fontParagraph2(14), _b));
exports.defaultSettingsData = tslib_1.__assign(tslib_1.__assign({}, defaultSettingsDataAll), defaultSettingsDataMobile);
exports.CLASSIC_PRESET_ID = 'Wix_Bookings_Offering_List_Widget_Classic';
exports.OVERLAPPING_PRESET_ID = 'Wix_Bookings_Offering_List_Widget_Overlapping';
exports.STRIP_PRESET_ID = 'Wix_Bookings_Offering_List_Widget_Strip';
exports.GRID_PRESET_ID = 'Wix_Bookings_Offering_List_Widget_Grid';
exports.BOOKINGS_MAIN_PAGE_PRESET_ID = 'Wix_Bookings_Offering_List_Main_Page';
exports.SINGLE_SERVICE_PRESET_ID = 'Wix_Bookings_Single_Service_Widget';
exports.CLASSIC_EDITOR_X_PRESET_ID = 'Wix_Bookings_Offering_List_Widget_Classic_Editor_X';
exports.OVERLAPPING_EDITOR_X_PRESET_ID = 'Wix_Bookings_Offering_List_Widget_Overlapping_Editor_X';
exports.STRIP_EDITOR_X_PRESET_ID = 'Wix_Bookings_Offering_List_Widget_Strip_Editor_X';
exports.GRID_EDITOR_X_PRESET_ID = 'Wix_Bookings_Offering_List_Widget_Grid_Editor_X';
exports.BOOKINGS_MAIN_PAGE_EDITOR_X_PRESET_ID = 'Wix_Bookings_Offering_List_Main_Page_Editor_X';
exports.SINGLE_SERVICE_EDITOR_X_PRESET_ID = 'Wix_Bookings_Single_Service_Widget_Editor_X';
var CLASSIC_DEFAULT_SETTINGS = tslib_1.__assign(tslib_1.__assign({}, exports.defaultSettingsData), (_c = {}, _c[SettingsKeys_1.SettingsKeys.IMAGE_AND_TEXT_RATIO] = SettingsKeys_1.ImageAndTextRatioOptions.RATIO_40_60, _c[SettingsKeys_1.SettingsKeys.IMAGE_AND_TEXT_RATIO_IS_FLIPED] = true, _c[SettingsKeys_1.SettingsKeys.DISPLAY_DURATION] = false, _c[SettingsKeys_1.SettingsKeys.DISPLAY_CATEGORIES] = false, _c[SettingsKeys_1.SettingsKeys.DISPLAY_MULTI_OFFERINGS_TITLE] = false, _c));
var OVERLAPPING_DEFAULT_SETTINGS = tslib_1.__assign(tslib_1.__assign({}, exports.defaultSettingsData), (_d = {}, _d[SettingsKeys_1.SettingsKeys.OFFERING_LIST_LAYOUT] = SettingsKeys_1.OfferingListLayoutOptions.OVERLAPPING, _d[SettingsKeys_1.SettingsKeys.DISPLAY_CATEGORIES] = false, _d[SettingsKeys_1.SettingsKeys.DISPLAY_MULTI_OFFERINGS_TITLE] = false, _d));
var STRIP_DEFAULT_SETTINGS = tslib_1.__assign(tslib_1.__assign({}, exports.defaultSettingsData), (_e = {}, _e[SettingsKeys_1.SettingsKeys.OFFERING_LIST_LAYOUT] = SettingsKeys_1.OfferingListLayoutOptions.STRIP, _e[SettingsKeys_1.SettingsKeys.IMAGE_SHAPE_OPTION] = SettingsKeys_1.ImageShapeOptions.ROUND, _e[SettingsKeys_1.SettingsKeys.STRIP_SIDE_PADDING] = 0, _e[SettingsKeys_1.SettingsKeys.BACKGROUND_COLOR] = colorWithOpacity('color-1', 0), _e[SettingsKeys_1.SettingsKeys.DISPLAY_IMAGE] = false, _e[SettingsKeys_1.SettingsKeys.DISPLAY_TAG_LINE] = false, _e[SettingsKeys_1.SettingsKeys.DISPLAY_DURATION] = false, _e[SettingsKeys_1.SettingsKeys.DISPLAY_START_DATE] = false, _e[SettingsKeys_1.SettingsKeys.DISPLAY_DAYS_OFFERED] = false, _e[SettingsKeys_1.SettingsKeys.DISPLAY_MULTI_OFFERINGS_TITLE] = false, _e[SettingsKeys_1.SettingsKeys.DISPLAY_CATEGORIES] = false, _e));
var GRID_DEFAULT_SETTINGS = tslib_1.__assign(tslib_1.__assign({}, exports.defaultSettingsData), (_f = {}, _f[SettingsKeys_1.SettingsKeys.OFFERING_LIST_LAYOUT] = SettingsKeys_1.OfferingListLayoutOptions.GRID, _f[SettingsKeys_1.SettingsKeys.LAYOUT_CARDS_PER_ROW] = 3, _f[SettingsKeys_1.SettingsKeys.IMAGE_SHAPE_OPTION] = SettingsKeys_1.ImageShapeOptions.SQUARE, _f[SettingsKeys_1.SettingsKeys.DISPLAY_CATEGORIES] = false, _f[SettingsKeys_1.SettingsKeys.DISPLAY_MULTI_OFFERINGS_TITLE] = false, _f[SettingsKeys_1.SettingsKeys.DISPLAY_TAG_LINE] = false, _f[SettingsKeys_1.SettingsKeys.DISPLAY_MULTI_OFFERINGS_TITLE] = false, _f[SettingsKeys_1.SettingsKeys.DISPLAY_CATEGORIES] = false, _f));
var BOOKINGS_MAIN_PAGE_SETTINGS = tslib_1.__assign(tslib_1.__assign({}, exports.defaultSettingsData), (_g = {}, _g[SettingsKeys_1.SettingsKeys.OFFERING_LIST_LAYOUT] = SettingsKeys_1.OfferingListLayoutOptions.GRID, _g[SettingsKeys_1.SettingsKeys.LAYOUT_CARDS_PER_ROW] = 3, _g[SettingsKeys_1.SettingsKeys.IMAGE_SHAPE_OPTION] = SettingsKeys_1.ImageShapeOptions.RECTANGLE, _g[SettingsKeys_1.SettingsKeys.DISPLAY_TAG_LINE] = false, _g));
var SINGLE_SERVICE_DEFAULT_SETTINGS = tslib_1.__assign(tslib_1.__assign({}, exports.defaultSettingsData), (_h = {}, _h[SettingsKeys_1.SettingsKeys.IMAGE_AND_TEXT_RATIO] = SettingsKeys_1.ImageAndTextRatioOptions.RATIO_50_50, _h[SettingsKeys_1.SettingsKeys.IMAGE_AND_TEXT_RATIO_IS_FLIPED] = true, _h[SettingsKeys_1.SettingsKeys.DISPLAY_DIVIDER] = false, _h[SettingsKeys_1.SettingsKeys.DISPLAY_TAG_LINE] = false, _h[SettingsKeys_1.SettingsKeys.DISPLAY_CATEGORIES] = false, _h[SettingsKeys_1.SettingsKeys.DISPLAY_MULTI_OFFERINGS_TITLE] = false, _h[SettingsKeys_1.SettingsKeys.TEXT_ALIGNMENT] = SettingsKeys_1.AlignmentOptions.CENTER, _h[SettingsKeys_1.SettingsKeys.SELECTED_RESOURCES] = {
    filter: selected_resources_1.SelectedOfferingsFilterType.FIRST,
}, _h[SettingsKeys_1.MobileSettingsKeys.MOBILE_DISPLAY_DIVIDER] = false, _h[SettingsKeys_1.MobileSettingsKeys.MOBILE_DISPLAY_TAG_LINE] = false, _h[SettingsKeys_1.MobileSettingsKeys.MOBILE_TEXT_ALIGNMENT] = SettingsKeys_1.AlignmentOptions.CENTER, _h));
exports.defaultSettingsDataMap = new Map();
exports.defaultSettingsDataMap.set(exports.CLASSIC_PRESET_ID, CLASSIC_DEFAULT_SETTINGS);
exports.defaultSettingsDataMap.set(exports.OVERLAPPING_PRESET_ID, OVERLAPPING_DEFAULT_SETTINGS);
exports.defaultSettingsDataMap.set(exports.STRIP_PRESET_ID, STRIP_DEFAULT_SETTINGS);
exports.defaultSettingsDataMap.set(exports.GRID_PRESET_ID, GRID_DEFAULT_SETTINGS);
exports.defaultSettingsDataMap.set(exports.BOOKINGS_MAIN_PAGE_PRESET_ID, BOOKINGS_MAIN_PAGE_SETTINGS);
exports.defaultSettingsDataMap.set(exports.SINGLE_SERVICE_PRESET_ID, SINGLE_SERVICE_DEFAULT_SETTINGS);
exports.defaultSettingsDataMap.set(exports.CLASSIC_EDITOR_X_PRESET_ID, CLASSIC_DEFAULT_SETTINGS);
exports.defaultSettingsDataMap.set(exports.OVERLAPPING_EDITOR_X_PRESET_ID, OVERLAPPING_DEFAULT_SETTINGS);
exports.defaultSettingsDataMap.set(exports.STRIP_EDITOR_X_PRESET_ID, STRIP_DEFAULT_SETTINGS);
exports.defaultSettingsDataMap.set(exports.GRID_EDITOR_X_PRESET_ID, GRID_DEFAULT_SETTINGS);
exports.defaultSettingsDataMap.set(exports.BOOKINGS_MAIN_PAGE_EDITOR_X_PRESET_ID, BOOKINGS_MAIN_PAGE_SETTINGS);
exports.defaultSettingsDataMap.set(exports.SINGLE_SERVICE_EDITOR_X_PRESET_ID, SINGLE_SERVICE_DEFAULT_SETTINGS);
//# sourceMappingURL=DefaultSettings.js.map