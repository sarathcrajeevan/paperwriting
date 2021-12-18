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
export var createBorderRadiusPropsSDKFactory = function(options) {
    if (options === void 0) {
        options = {};
    }
    var prefix = options.prefix,
        withoutDefaultValue = options.withoutDefaultValue;
    var cssRule = getScopedVar({
        name: cssVars.borderRadius,
        prefix: prefix,
    });
    var validatePixel = createPixelValidator({
        propertyName: 'borderRadius',
        cssProperty: 'radius',
    });
    var _borderRadiusPropsSDKFactory = function(_a) {
        var _b;
        var setStyles = _a.setStyles,
            sdkData = _a.sdkData,
            createSdkState = _a.createSdkState;
        var editorInitialRadius = (_b = sdkData === null || sdkData === void 0 ? void 0 : sdkData.initialSdkStyles) === null || _b === void 0 ? void 0 : _b.borderRadius;
        var _c = createSdkState({
                borderRadius: withoutDefaultValue ? undefined : editorInitialRadius,
            }, 'borderRadius'),
            state = _c[0],
            setState = _c[1];
        return {
            set borderRadius(borderRadius) {
                var _a;
                setState({
                    borderRadius: borderRadius
                });
                setStyles((_a = {}, _a[cssRule] = borderRadius, _a));
            },
            get borderRadius() {
                return state.borderRadius;
            },
        };
    };
    return withValidation(_borderRadiusPropsSDKFactory, {
        type: ['object'],
        properties: {
            borderRadius: {
                type: ['string', 'nil'],
            },
        },
    }, {
        borderRadius: [validatePixel],
    });
};
//# sourceMappingURL=borderRadiusPropsSDKFactory.js.map