"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getDisplayOptions = exports.defaultSettings = exports.SETTINGS_KEY = exports.BookItButtonStyle = exports.TextAlignmentType = exports.ImageDisplayType = void 0;
var ImageDisplayType;
(function(ImageDisplayType) {
    ImageDisplayType["SQUARE"] = "square";
    ImageDisplayType["ROUND"] = "round";
    ImageDisplayType["NONE"] = "none";
})(ImageDisplayType = exports.ImageDisplayType || (exports.ImageDisplayType = {}));
var TextAlignmentType;
(function(TextAlignmentType) {
    TextAlignmentType["LEFT"] = "left";
    TextAlignmentType["RIGHT"] = "right";
    TextAlignmentType["CENTER"] = "center";
})(TextAlignmentType = exports.TextAlignmentType || (exports.TextAlignmentType = {}));
var BookItButtonStyle;
(function(BookItButtonStyle) {
    BookItButtonStyle["FULL"] = "full";
    BookItButtonStyle["BORDER"] = "border";
    BookItButtonStyle["LINK"] = "link";
})(BookItButtonStyle = exports.BookItButtonStyle || (exports.BookItButtonStyle = {}));
var SETTINGS_KEY;
(function(SETTINGS_KEY) {
    SETTINGS_KEY["BUTTON_TEXT"] = "buttonText";
    SETTINGS_KEY["BUTTON_THEME"] = "buttonStyle";
    SETTINGS_KEY["IMAGE_THEME"] = "imageType";
    SETTINGS_KEY["TEXT_ALIGNMENT"] = "cardTextAlignment";
    SETTINGS_KEY["SHOW_TITLE"] = "displayServiceName";
    SETTINGS_KEY["SHOW_PRICE"] = "displayServicePrice";
    SETTINGS_KEY["SHOW_DURATION"] = "displayServiceDuration";
    SETTINGS_KEY["SHOW_DESCRIPTION"] = "displayServiceDescription";
    SETTINGS_KEY["SHOW_DAYS"] = "displayServiceDays";
    SETTINGS_KEY["WIDGET_LAYOUT"] = "layoutPreset";
})(SETTINGS_KEY = exports.SETTINGS_KEY || (exports.SETTINGS_KEY = {}));
exports.defaultSettings = {
    buttonText: null,
    buttonStyle: BookItButtonStyle.FULL,
    imageType: ImageDisplayType.SQUARE,
    cardTextAlignment: TextAlignmentType.CENTER,
    displayServiceName: true,
    displayServicePrice: true,
    displayServiceDuration: true,
    displayServiceDescription: true,
    displayServiceDays: true,
    layoutPreset: true,
};

function getDisplayOptions(layoutParams) {
    layoutParams = layoutParams || {};
    return {
        getDesign: {
            getButtonText: layoutParams.buttonText || exports.defaultSettings.buttonText,
        },
        getLayout: {
            isOfferingNameVisible: getRealBooleanValue(layoutParams, 'displayServiceName'),
            isPriceVisible: getRealBooleanValue(layoutParams, 'displayServicePrice'),
            isDescriptionVisible: getRealBooleanValue(layoutParams, 'displayServiceDescription'),
            isDurationVisible: getRealBooleanValue(layoutParams, 'displayServiceDuration'),
            isServiceDaysVisible: getRealBooleanValue(layoutParams, 'displayServiceDays'),
            imageType: layoutParams.imageType || exports.defaultSettings.imageType,
            textAlignment: layoutParams.cardTextAlignment || exports.defaultSettings.cardTextAlignment,
            buttonType: layoutParams.buttonStyle || exports.defaultSettings.buttonStyle,
        },
    };
}
exports.getDisplayOptions = getDisplayOptions;

function getRealBooleanValue(layoutParams, key) {
    return keyHasBeenDefinedBySettings(layoutParams[key]) ?
        layoutParams[key] :
        exports.defaultSettings[key];
}

function keyHasBeenDefinedBySettings(value) {
    return value === true || value === false;
}
//# sourceMappingURL=offering-display-options.js.map