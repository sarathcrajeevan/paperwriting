import {
    messageTemplates
} from '../../messages';
import {
    reportError,
    reportWarning
} from '../../reporters';
import {
    isValidColor,
    isHexaColor,
    isRGBAColor,
    validatePixel,
} from './styleUtils';
export var createColorValidator = function(_a) {
    var propertyName = _a.propertyName,
        cssProperty = _a.cssProperty,
        supportAlpha = _a.supportAlpha;
    return function(color, api) {
        if (!isValidColor(color)) {
            reportError(messageTemplates.error_invalid_css_value_multiple_expected_formats({
                propertyName: propertyName,
                cssProperty: cssProperty,
                infoLink: "https://www.wix.com/corvid/new-reference/$w/style/" + propertyName.toLowerCase(),
                compName: api.metaData.role,
                exampleFormats: supportAlpha ?
                    '"red", "#FF0000", "#FF000000", "rgb(225, 0, 0)" or "rgba(225, 0, 0, 0)"' :
                    '"red", "#FF0000", or "rgb(225, 0, 0)"',
            }));
            return false;
        }
        if (!supportAlpha) {
            reportRGBACastingWarning({
                propertyName: propertyName,
                color: color,
                api: api
            });
        }
        return true;
    };
};
export var createPixelValidator = function(_a) {
    var propertyName = _a.propertyName,
        cssProperty = _a.cssProperty;
    return function(unit, api) {
        if (!validatePixel(unit)) {
            reportError(messageTemplates.error_invalid_css_value({
                propertyName: propertyName,
                cssProperty: cssProperty,
                infoLink: "https://www.wix.com/corvid/new-reference/$w/style/" + propertyName.toLowerCase(),
                compName: api.metaData.role,
                exampleFormat: '1px',
            }));
            return false;
        }
        return true;
    };
};
export var reportRGBACastingWarning = function(_a) {
    var propertyName = _a.propertyName,
        color = _a.color,
        api = _a.api;
    if (isHexaColor(color) || isRGBAColor(color)) {
        reportWarning(messageTemplates.warning_color_casting_performed({
            propertyName: propertyName,
            compName: api.metaData.role,
            infoLink: "https://www.wix.com/corvid/new-reference/$w/style/" + propertyName.toLowerCase(),
        }));
    }
};
//# sourceMappingURL=validation.js.map