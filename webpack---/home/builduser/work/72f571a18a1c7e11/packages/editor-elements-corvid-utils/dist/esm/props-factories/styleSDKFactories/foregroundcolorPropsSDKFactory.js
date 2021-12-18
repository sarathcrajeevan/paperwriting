import {
    withValidation
} from '../../validations';
import {
    getScopedVar
} from './styleUtils';
import {
    createColorValidator
} from './validation';
import {
    cssVars
} from './constants';
export var createForegroundColorPropsSDKFactory = function(options) {
    if (options === void 0) {
        options = {};
    }
    var prefix = options.prefix,
        withoutDefaultValue = options.withoutDefaultValue;
    var cssRule = getScopedVar({
        name: cssVars.foregroundColor,
        prefix: prefix,
    });
    var validateColor = createColorValidator({
        propertyName: 'foregroundColor',
        cssProperty: 'rgbaColor',
        supportAlpha: true,
    });
    var _foregroundColorPropsSDKFactory = function(_a) {
        var _b;
        var setStyles = _a.setStyles,
            sdkData = _a.sdkData,
            createSdkState = _a.createSdkState;
        var _c = createSdkState({
                foregroundColor: withoutDefaultValue ?
                    undefined :
                    (_b = sdkData === null || sdkData === void 0 ? void 0 : sdkData.initialSdkStyles) === null || _b === void 0 ? void 0 : _b.foregroundColor,
            }, 'foregroundColor'),
            state = _c[0],
            setState = _c[1];
        return {
            set foregroundColor(foregroundColor) {
                var _a;
                setState({
                    foregroundColor: foregroundColor
                });
                setStyles((_a = {}, _a[cssRule] = foregroundColor, _a));
            },
            get foregroundColor() {
                return state.foregroundColor;
            },
        };
    };
    return withValidation(_foregroundColorPropsSDKFactory, {
        type: ['object'],
        properties: {
            foregroundColor: {
                type: ['string', 'nil'],
            },
        },
    }, {
        foregroundColor: [validateColor],
    });
};
//# sourceMappingURL=foregroundcolorPropsSDKFactory.js.map