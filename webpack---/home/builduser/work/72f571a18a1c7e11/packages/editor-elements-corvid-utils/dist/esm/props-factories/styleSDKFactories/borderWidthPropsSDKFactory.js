import {
    withValidation
} from '../../validations';
import {
    createPixelValidator
} from './validation';
import {
    getScopedVar
} from './styleUtils';
import {
    cssVars
} from './constants';
export var createBorderWidthPropsSDKFactory = function(options) {
    if (options === void 0) {
        options = {};
    }
    var prefix = options.prefix,
        withoutDefaultValue = options.withoutDefaultValue;
    var cssRule = getScopedVar({
        name: cssVars.borderWidth,
        prefix: prefix,
    });
    var validatePixel = createPixelValidator({
        propertyName: 'borderWidth',
        cssProperty: 'width',
    });
    var _borderWidthPropsSDKFactory = function(_a) {
        var _b;
        var setStyles = _a.setStyles,
            sdkData = _a.sdkData,
            createSdkState = _a.createSdkState;
        var editorInitialWidth = (_b = sdkData === null || sdkData === void 0 ? void 0 : sdkData.initialSdkStyles) === null || _b === void 0 ? void 0 : _b.borderWidth;
        var _c = createSdkState({
                borderWidth: withoutDefaultValue ? undefined : editorInitialWidth,
            }, 'borderWidth'),
            state = _c[0],
            setState = _c[1];
        return {
            set borderWidth(borderWidth) {
                var _a;
                setState({
                    borderWidth: borderWidth
                });
                setStyles((_a = {}, _a[cssRule] = borderWidth, _a));
            },
            get borderWidth() {
                return state.borderWidth;
            },
        };
    };
    return withValidation(_borderWidthPropsSDKFactory, {
        type: ['object'],
        properties: {
            borderWidth: {
                type: ['string', 'nil'],
            },
        },
    }, {
        borderWidth: [validatePixel],
    });
};
//# sourceMappingURL=borderWidthPropsSDKFactory.js.map