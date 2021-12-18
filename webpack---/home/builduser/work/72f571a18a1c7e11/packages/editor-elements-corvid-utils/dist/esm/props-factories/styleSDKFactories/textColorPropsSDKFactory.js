import {
    withValidation
} from '../../validations';
import {
    getScopedVar,
    isHexaColor,
    isRGBAColor,
    convertColorToRGBAUnits,
} from './styleUtils';
import {
    createColorValidator
} from './validation';
import {
    cssVars
} from './constants';
export var createTextColorPropsSDKFactory = function(options) {
    if (options === void 0) {
        options = {};
    }
    var prefix = options.prefix,
        withoutDefaultValue = options.withoutDefaultValue;
    var cssRule = getScopedVar({
        name: cssVars.textColor,
        prefix: prefix,
    });
    var validateColor = createColorValidator({
        propertyName: 'color',
        cssProperty: 'rgbColor',
        supportAlpha: false,
    });
    var _textColorPropsSDKFactory = function(_a) {
        var _b;
        var setStyles = _a.setStyles,
            sdkData = _a.sdkData,
            createSdkState = _a.createSdkState;
        var editorInitialColor = (_b = sdkData === null || sdkData === void 0 ? void 0 : sdkData.initialSdkStyles) === null || _b === void 0 ? void 0 : _b.color;
        var _c = createSdkState({
                textColor: withoutDefaultValue ? undefined : editorInitialColor,
            }, 'textColor'),
            state = _c[0],
            setState = _c[1];
        return {
            set color(value) {
                var _a;
                var textColor = value;
                // RGBA values are casted to RGB by default
                if (isHexaColor(value) || isRGBAColor(value)) {
                    var _b = convertColorToRGBAUnits(value),
                        r = _b[0],
                        g = _b[1],
                        b = _b[2];
                    textColor = "rgb(" + r + ", " + g + ", " + b + ")";
                }
                setState({
                    textColor: textColor
                });
                setStyles((_a = {}, _a[cssRule] = textColor, _a));
            },
            get color() {
                return state.textColor;
            },
        };
    };
    return withValidation(_textColorPropsSDKFactory, {
        type: ['object'],
        properties: {
            color: {
                type: ['string', 'nil'],
            },
        },
    }, {
        color: [validateColor],
    });
};
//# sourceMappingURL=textColorPropsSDKFactory.js.map