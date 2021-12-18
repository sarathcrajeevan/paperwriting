import {
    composeSDKFactories
} from '../composeSDKFactories';
import {
    withValidation
} from '../validations';
import {
    createBackgroundColorPropsSDKFactory,
    createBorderColorPropsSDKFactory,
    createBorderRadiusPropsSDKFactory,
    createBorderWidthPropsSDKFactory,
    createForegroundColorPropsSDKFactory,
    createTextColorPropsSDKFactory,
} from './styleSDKFactories';
var _stylePropsSDKFactory = function(supportedSDKFactories) {
    return function(api) {
        var styleSDKs = supportedSDKFactories(api);
        return {
            get style() {
                return styleSDKs;
            },
        };
    };
};
var styleFactories = {
    BackgroundColor: createBackgroundColorPropsSDKFactory,
    BorderColor: createBorderColorPropsSDKFactory,
    BorderWidth: createBorderWidthPropsSDKFactory,
    ForegroundColor: createForegroundColorPropsSDKFactory,
    BorderRadius: createBorderRadiusPropsSDKFactory,
    TextColor: createTextColorPropsSDKFactory,
};
var styleFactoriesDefaultOptions = {
    BackgroundColor: {
        supportOpacity: true,
    },
    BorderColor: {
        supportOpacity: true,
    },
    BorderWidth: {},
    ForegroundColor: {
        supportOpacity: true,
    },
    BorderRadius: {},
    TextColor: {},
};
export var createStylePropsSDKFactory = function(list, styleSDKOptions) {
    var supported = Object.keys(list).filter(function(value) {
        return list[value];
    });
    var supportedSDKFactories = supported.map(function(value) {
        var stylePropertyOptions = typeof list[value] !== 'boolean' ?
            list[value] :
            styleFactoriesDefaultOptions[value];
        return styleFactories[value]({
            prefix: styleSDKOptions === null || styleSDKOptions === void 0 ? void 0 : styleSDKOptions.cssVarPrefix,
            withoutDefaultValue: stylePropertyOptions.withoutDefaultValue,
            supportOpacity: stylePropertyOptions.supportOpacity,
        });
    });
    return withValidation(_stylePropsSDKFactory(composeSDKFactories.apply(void 0, supportedSDKFactories)), {
        type: ['object'],
        properties: {
            style: {
                type: ['object'],
            },
        },
    });
};
//# sourceMappingURL=stylePropsSDKFactory.js.map