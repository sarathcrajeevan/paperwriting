var __assign = (this && this.__assign) || function() {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import {
    registerCorvidMouseEvent
} from '../corvidEvents';
export var clickPropsSDKFactoryWithUpdatePlatformHandler = function(api) {
    var clickPropsApi = clickPropsSDKFactory(api);
    var setProps = api.setProps,
        props = api.props;
    return __assign(__assign({}, clickPropsApi), {
        onClick: function(handler) {
            clickPropsApi.onClick(handler);
            if (!props.hasPlatformClickHandler) {
                setProps({
                    hasPlatformClickHandler: true,
                });
            }
        }
    });
};
export var clickPropsSDKFactory = function(api) {
    return ({
        onClick: function(handler) {
            return registerCorvidMouseEvent('onClick', api, handler);
        },
        onDblClick: function(handler) {
            return registerCorvidMouseEvent('onDblClick', api, handler);
        },
    });
};
//# sourceMappingURL=clickPropsSDKFactory.js.map