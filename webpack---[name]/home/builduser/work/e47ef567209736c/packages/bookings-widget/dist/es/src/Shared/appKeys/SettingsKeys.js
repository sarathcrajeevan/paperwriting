"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FilterByOptions = exports.CategoriesType = exports.OfferingListLayoutOptions = exports.DockLocationOptions = exports.ButtonStyleOptions = exports.ImageAndTextRatioOptions = exports.OfferingLayoutOptions = exports.ImagePositionOptions = exports.ImageShapeOptions = exports.ImageResizeOptions = exports.UnitOptions = exports.CategoryLayoutOptions = exports.AlignmentOptions = exports.AllFontsInTheApp = exports.MobileSettingsKeys = exports.SettingsKeys = void 0;
var SettingsKeys;
(function(SettingsKeys) {
    SettingsKeys["BOOK_FLOW_ACTION_TEXT"] = "BOOK_FLOW_ACTION_TEXT";
    SettingsKeys["NO_BOOK_FLOW_ACTION_TEXT"] = "NO_BOOK_FLOW_ACTION_TEXT";
    SettingsKeys["PENDING_APPROVAL_FLOW_ACTION_TEXT"] = "PENDING_APPROVAL_FLOW_ACTION_TEXT";
    SettingsKeys["MORE_INFO_LABEL_TEXT"] = "MORE_INFO_LABEL_TEXT";
    SettingsKeys["ONLINE_INDICATION_TEXT"] = "ONLINE_INDICATION_TEXT";
    SettingsKeys["DISPLAY_IMAGE"] = "DISPLAY_IMAGE";
    SettingsKeys["DISPLAY_TAG_LINE"] = "DISPLAY_TAG_LINE";
    SettingsKeys["DISPLAY_DIVIDER"] = "DISPLAY_DIVIDER";
    SettingsKeys["DISPLAY_PRICE"] = "DISPLAY_PRICE";
    SettingsKeys["DISPLAY_DURATION"] = "DISPLAY_DURATION";
    SettingsKeys["DISPLAY_START_DATE"] = "DISPLAY_START_DATE";
    SettingsKeys["DISPLAY_DAYS_OFFERED"] = "DISPLAY_DAYS_OFFERED";
    SettingsKeys["DISPLAY_BUTTON"] = "DISPLAY_BUTTON";
    SettingsKeys["DISPLAY_MORE_INFO_LABEL"] = "DISPLAY_MORE_INFO_LABEL";
    SettingsKeys["DISPLAY_MULTI_OFFERINGS_TITLE"] = "DISPLAY_MULTI_OFFERINGS_TITLE";
    SettingsKeys["DISPLAY_CATEGORIES"] = "DISPLAY_CATEGORIES";
    SettingsKeys["DISPLAY_ONLINE_INDICATION"] = "DISPLAY_ONLINE_INDICATION";
    SettingsKeys["CATEGORIES_TYPE"] = "CATEGORIES_TYPE";
    SettingsKeys["FILTER_BY"] = "FILTER_BY";
    SettingsKeys["SELECTED_LOCATIONS"] = "SELECTED_LOCATIONS";
    SettingsKeys["DISPLAY_SERVICE_DIVIDER"] = "DISPLAY_SERVICE_DIVIDER";
    SettingsKeys["TEXT_ALIGNMENT"] = "TEXT_ALIGNMENT";
    SettingsKeys["IMAGE_RESIZE_OPTION"] = "IMAGE_RESIZE_OPTION";
    SettingsKeys["IMAGE_POSITION_OPTION"] = "IMAGE_POSITION_OPTION";
    SettingsKeys["IMAGE_SHAPE_OPTION"] = "IMAGE_SHAPE_OPTION";
    SettingsKeys["PIN_LOCATION"] = "PIN_LOCATION";
    SettingsKeys["IMAGE_AND_TEXT_POSITION"] = "IMAGE_AND_TEXT_POSITION";
    SettingsKeys["IMAGE_AND_TEXT_RATIO"] = "IMAGE_AND_TEXT_RATIO";
    SettingsKeys["IMAGE_AND_TEXT_RATIO_IS_FLIPED"] = "IMAGE_AND_TEXT_RATIO_IS_FLIPED";
    SettingsKeys["SELECTED_RESOURCES"] = "SELECTED_RESOURCES";
    SettingsKeys["OFFERING_NAME_FONT"] = "OFFERING_NAME_FONT";
    SettingsKeys["OFFERING_NAME_COLOR"] = "OFFERING_NAME_COLOR";
    SettingsKeys["OFFERING_TAGLINE_FONT"] = "OFFERING_TAGLINE_FONT";
    SettingsKeys["OFFERING_TAGLINE_COLOR"] = "OFFERING_TAGLINE_COLOR";
    SettingsKeys["OFFERING_MORE_INFO_LABEL_FONT"] = "OFFERING_MORE_INFO_LABEL_FONT";
    SettingsKeys["OFFERING_MORE_INFO_LABEL_COLOR"] = "OFFERING_MORE_INFO_LABEL_COLOR";
    SettingsKeys["OFFERING_DETAILS_FONT"] = "OFFERING_DETAILS_FONT";
    SettingsKeys["OFFERING_DETAILS_COLOR"] = "OFFERING_DETAILS_COLOR";
    SettingsKeys["BACKGROUND_COLOR"] = "BACKGROUND_COLOR";
    SettingsKeys["BORDER_COLOR"] = "BORDER_COLOR";
    SettingsKeys["IMAGE_BACKGROUND_COLOR"] = "IMAGE_BACKGROUND_COLOR";
    SettingsKeys["DIVIDER_COLOR"] = "DIVIDER_COLOR";
    SettingsKeys["SERVICE_DIVIDER_COLOR"] = "SERVICE_DIVIDER_COLOR";
    SettingsKeys["BORDER_WIDTH"] = "BORDER_WIDTH";
    SettingsKeys["STRIP_BORDER_WIDTH"] = "STRIP_BORDER_WIDTH";
    SettingsKeys["DIVIDER_WIDTH"] = "DIVIDER_WIDTH";
    SettingsKeys["SERVICE_DIVIDER_WIDTH"] = "SERVICE_DIVIDER_WIDTH";
    SettingsKeys["BUTTON_STYLE"] = "BUTTON_STYLE";
    SettingsKeys["BUTTON_TEXT_FONT"] = "BUTTON_TEXT_FONT";
    SettingsKeys["BUTTON_TEXT_COLOR_FILL"] = "BUTTON_TEXT_COLOR_FILL";
    SettingsKeys["BUTTON_TEXT_COLOR_HOLE"] = "BUTTON_TEXT_COLOR_HOLE";
    SettingsKeys["BUTTON_BORDER_COLOR"] = "BUTTON_BORDER_COLOR";
    SettingsKeys["BUTTON_BACKGROUND_COLOR"] = "BUTTON_BACKGROUND_COLOR";
    SettingsKeys["BUTTON_CORNER_RADIUS"] = "BUTTON_CORNER_RADIUS";
    SettingsKeys["BUTTON_BORDER_WIDTH"] = "BUTTON_BORDER_WIDTH";
    SettingsKeys["MULTI_OFFERINGS_TITLE_TEXT"] = "MULTI_OFFERINGS_TITLE_TEXT";
    SettingsKeys["OFFERING_LIST_LAYOUT"] = "OFFERINGS_LIST_LAYOUT";
    SettingsKeys["CATEGORY_NAME_FONT"] = "CATEGORY_NAME_FONT";
    SettingsKeys["CATEGORY_NAME_COLOR"] = "CATEGORY_NAME_COLOR";
    SettingsKeys["CATEGORY_DIVIDER_COLOR"] = "CATEGORY_DIVIDER_COLOR";
    SettingsKeys["CATEGORY_ALL_SERVICES_SHOW"] = "CATEGORY_ALL_SERVICES_SHOW";
    SettingsKeys["CATEGORY_ALL_SERVICES_TEXT"] = "CATEGORY_ALL_SERVICES_TEXT";
    SettingsKeys["CATEGORY_SELECTED_UNDERLINE_COLOR"] = "CATEGORY_SELECTED_UNDERLINE_COLOR";
    SettingsKeys["CATEGORY_ALIGNMENT"] = "CATEGORY_ALIGNMENT";
    SettingsKeys["MULTI_OFFERINGS_TITLE_ALIGNMENT"] = "MULTI_OFFERINGS_TITLE_ALIGNMENT";
    SettingsKeys["MULTI_OFFERINGS_TITLE_COLOR"] = "MULTI_OFFERINGS_TITLE_COLOR";
    SettingsKeys["MULTI_OFFERINGS_TITLE_FONT"] = "MULTI_OFFERINGS_TITLE_FONT";
    SettingsKeys["FIT_CATEGORY_WIDTH"] = "FIT_CATEGORY_WIDTH";
    SettingsKeys["MULTI_OFFERINGS_BACKGROUND_COLOR"] = "MULTI_OFFERINGS_BACKGROUND_COLOR";
    SettingsKeys["SPACE_BETWEEN_OFFERINGS"] = "SPACE_BETWEEN_OFFERINGS";
    SettingsKeys["STRIP_SPACE_BETWEEN_OFFERINGS"] = "STRIP_SPACE_BETWEEN_OFFERINGS";
    SettingsKeys["LAYOUT_CARDS_PER_ROW"] = "LAYOUT_CARDS_PER_ROW";
    SettingsKeys["CARDS_SPACING"] = "CARDS_SPACING";
    SettingsKeys["STRIP_SIDE_PADDING"] = "LAYOUT_SIDE_PADDING";
    SettingsKeys["GRID_SIDE_PADDING"] = "INFO_SIDE_PADDING";
    SettingsKeys["CLASSIC_SIDE_PADDING"] = "CLASSIC_SIDE_PADDING";
    SettingsKeys["OVERLAPPING_SIDE_PADDING"] = "OVERLAPPING_SIDE_PADDING";
    SettingsKeys["STRIP_VERTICAL_PADDING"] = "LAYOUT_VERTICAL_PADDING";
    SettingsKeys["GRID_VERTICAL_PADDING"] = "INFO_VERTICAL_PADDING";
    SettingsKeys["CLASSIC_VERTICAL_PADDING"] = "CLASSIC_VERTICAL_PADDING";
    SettingsKeys["OVERLAPPING_VERTICAL_PADDING"] = "OVERLAPPING_VERTICAL_PADDING";
    SettingsKeys["STRIP_SIDE_PADDING_UNIT"] = "LAYOUT_SIDE_PADDING_UNIT";
    SettingsKeys["GRID_SIDE_PADDING_UNIT"] = "INFO_SIDE_PADDING_UNIT";
    SettingsKeys["CLASSIC_SIDE_PADDING_UNIT"] = "CLASSIC_SIDE_PADDING_UNIT";
    SettingsKeys["OVERLAPPING_SIDE_PADDING_UNIT"] = "OVERLAPPING_SIDE_PADDING_UNIT";
    SettingsKeys["STRIP_VERTICAL_PADDING_UNIT"] = "LAYOUT_VERTICAL_PADDING_UNIT";
    SettingsKeys["GRID_VERTICAL_PADDING_UNIT"] = "INFO_VERTICAL_PADDING_UNIT";
    SettingsKeys["CLASSIC_VERTICAL_PADDING_UNIT"] = "CLASSIC_VERTICAL_PADDING_UNIT";
    SettingsKeys["OVERLAPPING_VERTICAL_PADDING_UNIT"] = "OVERLAPPING_VERTICAL_PADDING_UNIT";
    SettingsKeys["CATEGORY_LAYOUT_OPTION"] = "CATEGORY_LAYOUT_OPTION";
    SettingsKeys["CATEGORY_BORDER_WIDTH"] = "CATEGORY_BORDER_WIDTH";
    SettingsKeys["CATEGORY_BORDER_RADIUS"] = "CATEGORY_BORDER_RADIUS";
    SettingsKeys["CATEGORY_BACKGROUND_COLOR"] = "CATEGORY_BACKGROUND_COLOR";
    SettingsKeys["CATEGORY_SPACING"] = "CATEGORY_SPACING";
    SettingsKeys["CATEGORY_SELECTED_TEXT_COLOR"] = "CATEGORY_SELECTED_TEXT_COLOR";
    SettingsKeys["CATEGORY_SELECTED_BORDER_COLOR"] = "CATEGORY_SELECTED_BORDER_COLOR";
    SettingsKeys["CATEGORY_HOVER_BACKGROUND_COLOR"] = "CATEGORY_HOVER_BACKGROUND_COLOR";
    SettingsKeys["CATEGORY_HOVER_TEXT_COLOR"] = "CATEGORY_HOVER_TEXT_COLOR";
    SettingsKeys["CATEGORY_HOVER_BORDER_COLOR"] = "CATEGORY_HOVER_BORDER_COLOR";
    SettingsKeys["PRESERVE_OLD_STYLES"] = "PRESERVE_OLD_STYLES";
})(SettingsKeys = exports.SettingsKeys || (exports.SettingsKeys = {}));
var MobileSettingsKeys;
(function(MobileSettingsKeys) {
    MobileSettingsKeys["MOBILE_CARDS_SPACING"] = "MOBILE_CARDS_SPACING";
    MobileSettingsKeys["MOBILE_IMAGE_RESIZE_OPTION"] = "MOBILE_IMAGE_RESIZE_OPTION";
    MobileSettingsKeys["MOBILE_IMAGE_SHAPE_OPTION"] = "MOBILE_IMAGE_SHAPE_OPTION";
    MobileSettingsKeys["MOBILE_TEXT_ALIGNMENT"] = "MOBILE_TEXT_ALIGNMENT";
    MobileSettingsKeys["MOBILE_DISPLAY_IMAGE"] = "MOBILE_DISPLAY_IMAGE";
    MobileSettingsKeys["MOBILE_DISPLAY_TAG_LINE"] = "MOBILE_DISPLAY_TAG_LINE";
    MobileSettingsKeys["MOBILE_DISPLAY_DIVIDER"] = "MOBILE_DISPLAY_DIVIDER";
    MobileSettingsKeys["MOBILE_DISPLAY_PRICE"] = "MOBILE_DISPLAY_PRICE";
    MobileSettingsKeys["MOBILE_DISPLAY_DURATION"] = "MOBILE_DISPLAY_DURATION";
    MobileSettingsKeys["MOBILE_DISPLAY_START_DATE"] = "MOBILE_DISPLAY_START_DATE";
    MobileSettingsKeys["MOBILE_DISPLAY_DAYS_OFFERED"] = "MOBILE_DISPLAY_DAYS_OFFERED";
    MobileSettingsKeys["MOBILE_DISPLAY_BUTTON"] = "MOBILE_DISPLAY_BUTTON";
    MobileSettingsKeys["MOBILE_DISPLAY_MORE_INFO_LABEL"] = "MOBILE_DISPLAY_MORE_INFO_LABEL";
    MobileSettingsKeys["MOBILE_DIVIDER_WIDTH"] = "MOBILE_DIVIDER_WIDTH";
    MobileSettingsKeys["MOBILE_BORDER_WIDTH"] = "MOBILE_BORDER_WIDTH";
    MobileSettingsKeys["MOBILE_MULTI_OFFERINGS_TITLE_FONT_SIZE"] = "MOBILE_MULTI_OFFERINGS_TITLE_FONT_SIZE";
    MobileSettingsKeys["MOBILE_CATEGORY_NAME_FONT_SIZE"] = "MOBILE_CATEGORY_NAME_FONT_SIZE";
    MobileSettingsKeys["MOBILE_OFFERING_NAME_FONT_SIZE"] = "MOBILE_OFFERING_NAME_FONT_SIZE";
    MobileSettingsKeys["MOBILE_OFFERING_TAGLINE_FONT_SIZE"] = "MOBILE_OFFERING_TAGLINE_FONT_SIZE";
    MobileSettingsKeys["MOBILE_MORE_INFO_LABEL_FONT_SIZE"] = "MOBILE_MORE_INFO_LABEL_FONT_SIZE";
    MobileSettingsKeys["MOBILE_OFFERING_DETAILS_FONT_SIZE"] = "MOBILE_OFFERING_DETAILS_FONT_SIZE";
    MobileSettingsKeys["MOBILE_BUTTON_TEXT_FONT_SIZE"] = "MOBILE_BUTTON_TEXT_FONT_SIZE";
    MobileSettingsKeys["MOBILE_BUTTON_STYLE"] = "MOBILE_BUTTON_STYLE";
    MobileSettingsKeys["MOBILE_PIN_LOCATION"] = "MOBILE_PIN_LOCATION";
    MobileSettingsKeys["MOBILE_SIDE_PADDING"] = "MOBILE_SIDE_PADDING";
    MobileSettingsKeys["MOBILE_VERTICAL_PADDING"] = "MOBILE_VERTICAL_PADDING";
    MobileSettingsKeys["MOBILE_SIDE_PADDING_UNIT"] = "MOBILE_SIDE_PADDING_UNIT";
    MobileSettingsKeys["MOBILE_VERTICAL_PADDING_UNIT"] = "MOBILE_VERTICAL_PADDING_UNIT";
    MobileSettingsKeys["MOBILE_CATEGORY_LAYOUT_OPTION"] = "MOBILE_CATEGORY_LAYOUT_OPTION";
    MobileSettingsKeys["MOBILE_CATEGORY_BORDER_WIDTH"] = "MOBILE_CATEGORY_BORDER_WIDTH";
    MobileSettingsKeys["MOBILE_CATEGORY_NAME_COLOR"] = "MOBILE_CATEGORY_NAME_COLOR";
    MobileSettingsKeys["MOBILE_CATEGORY_BACKGROUND_COLOR"] = "MOBILE_CATEGORY_BACKGROUND_COLOR";
    MobileSettingsKeys["MOBILE_CATEGORY_BORDER_COLOR"] = "MOBILE_CATEGORY_BORDER_COLOR";
    MobileSettingsKeys["MOBILE_CATEGORY_NAME_FONT"] = "MOBILE_CATEGORY_NAME_FONT";
    MobileSettingsKeys["MOBILE_DISPLAY_ONLINE_INDICATION"] = "MOBILE_DISPLAY_ONLINE_INDICATION";
})(MobileSettingsKeys = exports.MobileSettingsKeys || (exports.MobileSettingsKeys = {}));
/*
important please add all the font keys into this list fix for #SCHED-9559
*/
exports.AllFontsInTheApp = [
    SettingsKeys.OFFERING_NAME_FONT,
    SettingsKeys.OFFERING_TAGLINE_FONT,
    SettingsKeys.OFFERING_MORE_INFO_LABEL_FONT,
    SettingsKeys.OFFERING_DETAILS_FONT,
    SettingsKeys.BUTTON_TEXT_FONT,
    SettingsKeys.CATEGORY_NAME_FONT,
    SettingsKeys.MULTI_OFFERINGS_TITLE_FONT,
    MobileSettingsKeys.MOBILE_CATEGORY_NAME_FONT,
];
var AlignmentOptions;
(function(AlignmentOptions) {
    AlignmentOptions["LEFT"] = "left";
    AlignmentOptions["RIGHT"] = "right";
    AlignmentOptions["CENTER"] = "center";
})(AlignmentOptions = exports.AlignmentOptions || (exports.AlignmentOptions = {}));
var CategoryLayoutOptions;
(function(CategoryLayoutOptions) {
    CategoryLayoutOptions["TABS"] = "tabs";
    CategoryLayoutOptions["TAGS"] = "tags";
    CategoryLayoutOptions["DROPDOWN"] = "dropdown";
})(CategoryLayoutOptions = exports.CategoryLayoutOptions || (exports.CategoryLayoutOptions = {}));
var UnitOptions;
(function(UnitOptions) {
    UnitOptions["PIXEL"] = "px";
    UnitOptions["PERCENT"] = "%";
})(UnitOptions = exports.UnitOptions || (exports.UnitOptions = {}));
var ImageResizeOptions;
(function(ImageResizeOptions) {
    ImageResizeOptions["CROP"] = "crop";
    ImageResizeOptions["FIT"] = "fit";
})(ImageResizeOptions = exports.ImageResizeOptions || (exports.ImageResizeOptions = {}));
var ImageShapeOptions;
(function(ImageShapeOptions) {
    ImageShapeOptions["SQUARE"] = "square";
    ImageShapeOptions["ROUND"] = "round";
    ImageShapeOptions["RECTANGLE"] = "rectangle";
})(ImageShapeOptions = exports.ImageShapeOptions || (exports.ImageShapeOptions = {}));
var ImagePositionOptions;
(function(ImagePositionOptions) {
    ImagePositionOptions["LEFT"] = "left";
    ImagePositionOptions["RIGHT"] = "right";
})(ImagePositionOptions = exports.ImagePositionOptions || (exports.ImagePositionOptions = {}));
var OfferingLayoutOptions;
(function(OfferingLayoutOptions) {
    OfferingLayoutOptions["SIDE_BY_SIDE"] = "SIDE_BY_SIDE";
    OfferingLayoutOptions["OVERLAPPING"] = "OVERLAPPING";
})(OfferingLayoutOptions = exports.OfferingLayoutOptions || (exports.OfferingLayoutOptions = {}));
var ImageAndTextRatioOptions;
(function(ImageAndTextRatioOptions) {
    ImageAndTextRatioOptions["RATIO_50_50"] = "50";
    ImageAndTextRatioOptions["RATIO_40_60"] = "40";
    ImageAndTextRatioOptions["RATIO_30_70"] = "30";
})(ImageAndTextRatioOptions = exports.ImageAndTextRatioOptions || (exports.ImageAndTextRatioOptions = {}));
var ButtonStyleOptions;
(function(ButtonStyleOptions) {
    ButtonStyleOptions["SQUARE_HOLE"] = "SQUARE_HOLE";
    ButtonStyleOptions["SQUARE_FILL"] = "SQUARE_FILL";
    ButtonStyleOptions["CIRCLE_HOLE"] = "CIRCLE_HOLE";
    ButtonStyleOptions["CIRCLE_FILL"] = "CIRCLE_FILL";
})(ButtonStyleOptions = exports.ButtonStyleOptions || (exports.ButtonStyleOptions = {}));
var DockLocationOptions;
(function(DockLocationOptions) {
    DockLocationOptions["MIDDLE"] = "MIDDLE";
    DockLocationOptions["RIGHT"] = "RIGHT";
    DockLocationOptions["LEFT"] = "LEFT";
    DockLocationOptions["BOTTOM"] = "BOTTOM";
    DockLocationOptions["BOTTOM_RIGHT"] = "BOTTOM_RIGHT";
    DockLocationOptions["BOTTOM_LEFT"] = "BOTTOM_LEFT";
    DockLocationOptions["TOP_RIGHT"] = "TOP_RIGHT";
    DockLocationOptions["TOP_LEFT"] = "TOP_LEFT";
    DockLocationOptions["TOP"] = "TOP";
})(DockLocationOptions = exports.DockLocationOptions || (exports.DockLocationOptions = {}));
var OfferingListLayoutOptions;
(function(OfferingListLayoutOptions) {
    OfferingListLayoutOptions["CLASSIC"] = "CLASSIC";
    OfferingListLayoutOptions["OVERLAPPING"] = "OVERLAPPING";
    OfferingListLayoutOptions["STRIP"] = "STRIP";
    OfferingListLayoutOptions["GRID"] = "GRID";
    OfferingListLayoutOptions["MOBILE"] = "MOBILE";
})(OfferingListLayoutOptions = exports.OfferingListLayoutOptions || (exports.OfferingListLayoutOptions = {}));
var CategoriesType;
(function(CategoriesType) {
    CategoriesType["SERVICE_CATEGORIES"] = "SERVICE_CATEGORIES";
    CategoriesType["SERVICE_LOCATIONS"] = "SERVICE_LOCATIONS";
})(CategoriesType = exports.CategoriesType || (exports.CategoriesType = {}));
var FilterByOptions;
(function(FilterByOptions) {
    FilterByOptions["BY_SERVICES"] = "BY_SERVICES";
    FilterByOptions["BY_LOCATIONS"] = "BY_LOCATIONS";
})(FilterByOptions = exports.FilterByOptions || (exports.FilterByOptions = {}));
//# sourceMappingURL=SettingsKeys.js.map