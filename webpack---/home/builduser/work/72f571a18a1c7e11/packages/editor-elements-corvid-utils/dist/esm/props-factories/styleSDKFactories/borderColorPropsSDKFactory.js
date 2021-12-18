import {
    withValidation
} from '../../validations';
import {
    createColorValidator
} from './validation';
import {
    getScopedVar,
    convertColorToRGBAUnits,
    extractOpacity,
    applyOpacity,
    isHexaColor,
    isRGBAColor,
    roundToTwoDecimals,
} from './styleUtils';
import {
    cssVars
} from './constants';
export var createBorderColorPropsSDKFactory = function(options) {
    if (options === void 0) {
        options = {
            supportOpacity: true
        };
    }
    var prefix = options.prefix,
        supportOpacity = options.supportOpacity,
        withoutDefaultValue = options.withoutDefaultValue;
    var cssRule = getScopedVar({
        name: cssVars.borderColor,
        prefix: prefix,
    });
    var validateColor = createColorValidator({
        propertyName: 'borderColor',
        cssProperty: supportOpacity ? 'rgbaColor' : 'rgbColor',
        supportAlpha: supportOpacity,
    });
    var _borderColorPropsSDKFactory = function(_a) {
        var _b;
        var setStyles = _a.setStyles,
            sdkData = _a.sdkData,
            createSdkState = _a.createSdkState;
        var editorInitialColor = (_b = sdkData === null || sdkData === void 0 ? void 0 : sdkData.initialSdkStyles) === null || _b === void 0 ? void 0 : _b.borderColor;
        var editorOpacity = extractOpacity(editorInitialColor);
        var _c = createSdkState({
                borderColor: withoutDefaultValue ? undefined : editorInitialColor,
            }, 'borderColor'),
            state = _c[0],
            setState = _c[1];
        return {
            set borderColor(value) {
                var _a;
                var borderColor = value;
                /**
                 * !Alert! This feature is intended.
                 * if mixin does not support opacity - cast it to RGB
                 */
                if (!supportOpacity && (isHexaColor(value) || isRGBAColor(value))) {
                    var _b = convertColorToRGBAUnits(value),
                        r = _b[0],
                        g = _b[1],
                        b = _b[2];
                    borderColor = "rgb(" + r + ", " + g + ", " + b + ")";
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
                    borderColor = applyOpacity(borderColor, opacity);
                }
                setState({
                    borderColor: borderColor
                });
                setStyles((_a = {}, _a[cssRule] = borderColor, _a));
            },
            get borderColor() {
                return state.borderColor;
            },
        };
    };
    return withValidation(_borderColorPropsSDKFactory, {
        type: ['object'],
        properties: {
            borderColor: {
                type: ['string', 'nil'],
            },
        },
    }, {
        borderColor: [validateColor],
    });
};
//# sourceMappingURL=borderColorPropsSDKFactory.js.map