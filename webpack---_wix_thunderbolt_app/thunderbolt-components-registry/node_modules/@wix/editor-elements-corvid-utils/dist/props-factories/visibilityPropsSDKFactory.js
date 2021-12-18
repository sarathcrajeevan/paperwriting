var __spreadArray = (this && this.__spreadArray) || function(to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import {
    composeSDKFactories
} from '../composeSDKFactories';
import {
    createHiddenCollapsedSDKFactory
} from './hiddenCollapsedSDKFactory';
import {
    createViewportPropsSDKFactory,
} from './viewportPropsSDKFactory';
var visibilityPropsSDKFactory = function(api, hasPortal) {
    if (hasPortal === void 0) {
        hasPortal = false;
    }
    var _a = api.createSdkState({
            onViewportEnter: [],
            onViewportLeave: [],
        }, 'viewport'),
        state = _a[0],
        setState = _a[1];
    var registerCallback = function(type, callback) {
        var _a;
        setState((_a = {}, _a[type] = __spreadArray(__spreadArray([], state[type]), [callback]), _a));
    };
    var hiddenCollapsedSDKFactory = createHiddenCollapsedSDKFactory({
        viewportState: state,
        hasPortal: hasPortal,
    });
    var viewportPropsSDKFactory = createViewportPropsSDKFactory(registerCallback);
    return composeSDKFactories(hiddenCollapsedSDKFactory, viewportPropsSDKFactory)(api);
};
export var createVisibilityPropsSDKFactory = function(hasPortal) {
    return function(api) {
        return visibilityPropsSDKFactory(api, hasPortal);
    };
};
//# sourceMappingURL=visibilityPropsSDKFactory.js.map