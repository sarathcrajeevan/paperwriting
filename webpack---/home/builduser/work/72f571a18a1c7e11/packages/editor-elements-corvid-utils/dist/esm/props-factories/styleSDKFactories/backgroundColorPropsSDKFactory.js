import {
    withValidation
} from '../../validations';
import {
    createColorValidator
} from './validation';
import {
    cssVars
} from './constants';
import {
    getScopedVar,
    extractOpacity,
    applyOpacity,
    isHexaColor,
    isRGBAColor,
    convertColorToRGBAUnits,
    roundToTwoDecimals,
} from './styleUtils';
export var createBackgroundColorPropsSDKFactory = function(options) {
    if (options === void 0) {
        options = {
            supportOpacity: true
        };
    }
    var prefix = options.prefix,
        supportOpacity = options.supportOpacity,
        withoutDefaultValue = options.withoutDefaultValue;
    var cssRule = getScopedVar({
        name: cssVars.backgroundColor,
        prefix: prefix,
    });
    var validateColor = createColorValidator({
        propertyName: 'backgroundColor',
        cssProperty: supportOpacity ? 'rgbaColor' : 'rgbColor',
        supportAlpha: supportOpacity,
    });
    var _backgroundColorPropsSDKFactory = function(_a) {
        var _b;
        var setStyles = _a.setStyles,
            sdkData = _a.sdkData,
            createSdkState = _a.createSdkState;
        var editorInitialColor = (_b = sdkData === null || sdkData === void 0 ? void 0 : sdkData.initialSdkStyles) === null || _b === void 0 ? void 0 : _b.backgroundColor;
        var editorOpacity = extractOpacity(editorInitialColor);
        var _c = createSdkState({
                backgroundColor: withoutDefaultValue ? undefined : editorInitialColor,
            }, 'backgroundColor'),
            state = _c[0],
            setState = _c[1];
        return {
            set backgroundColor(value) {
                var _a;
                var backgroundColor = value;
                /**
                 * !Alert! This feature is intended.
                 * if mixin does not support opacity - cast it to RGB
                 */
                if (!supportOpacity && (isHexaColor(value) || isRGBAColor(value))) {
                    var _b = convertColorToRGBAUnits(value),
                        r = _b[0],
                        g = _b[1],
                        b = _b[2];
                    backgroundColor = "rgb(" + r + ", " + g + ", " + b + ")";
                }
                /**
                 * !Alert! This feature is intended.
                 *  Editor color alpha gets modified by the amount of user color alpha
                 */
                if (typeof editorOpacity === 'number' && editorOpacity !== 1) {
                    var userOpacity = extractOpacity(value);
                    var opacity = userOpacity ?
                        roundToTwoDecimals(editorOpacity * userOpacity) :
                        editorOpacity;
                    backgroundColor = applyOpacity(backgroundColor, opacity);
                }
                setState({
                    backgroundColor: backgroundColor
                });
                setStyles((_a = {}, _a[cssRule] = backgroundColor, _a));
            },
            get backgroundColor() {
                return state.backgroundColor;
            },
        };
    };
    return withValidation(_backgroundColorPropsSDKFactory, {
        type: ['object'],
        properties: {
            backgroundColor: {
                type: ['string', 'nil'],
            },
        },
    }, {
        backgroundColor: [validateColor],
    });
};
//# sourceMappingURL=backgroundColorPropsSDKFactory.js.map