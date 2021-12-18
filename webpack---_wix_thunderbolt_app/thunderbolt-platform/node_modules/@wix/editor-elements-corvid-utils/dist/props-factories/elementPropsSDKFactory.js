import {
    registerCorvidMouseEvent
} from '../corvidEvents';
import {
    composeSDKFactories
} from '../composeSDKFactories';
import {
    basePropsSDKFactory
} from './basePropsSDKFactory';
import {
    createViewportPropsSDKFactory
} from './viewportPropsSDKFactory';
import {
    createVisibilityPropsSDKFactory
} from './visibilityPropsSDKFactory';
export var toJSONBase = function(_a) {
    var role = _a.role,
        compType = _a.compType,
        isGlobal = _a.isGlobal,
        isRendered = _a.isRendered;
    return ({
        id: role,
        type: "$w." + compType,
        global: isGlobal(),
        rendered: isRendered(),
    });
};
var _elementPropsSDKFactory = function(api) {
    return ({
        onMouseIn: function(handler) {
            return registerCorvidMouseEvent('onMouseEnter', api, handler);
        },
        onMouseOut: function(handler) {
            return registerCorvidMouseEvent('onMouseLeave', api, handler);
        },
        get rendered() {
            return api.metaData.isRendered();
        },
        toJSON: function() {
            return toJSONBase(api.metaData);
        },
    });
};
var viewportPropsSDKFactory = createViewportPropsSDKFactory();
export var elementPropsSDKFactory = composeSDKFactories(basePropsSDKFactory, viewportPropsSDKFactory, _elementPropsSDKFactory);
export var createElementPropsSDKFactory = function(_a) {
    var _b = _a === void 0 ? {} : _a,
        _c = _b.useHiddenCollapsed,
        useHiddenCollapsed = _c === void 0 ? true : _c,
        _d = _b.hasPortal,
        hasPortal = _d === void 0 ? false : _d;
    return composeSDKFactories(basePropsSDKFactory, _elementPropsSDKFactory, useHiddenCollapsed ?
        createVisibilityPropsSDKFactory(hasPortal) :
        viewportPropsSDKFactory);
};
//# sourceMappingURL=elementPropsSDKFactory.js.map