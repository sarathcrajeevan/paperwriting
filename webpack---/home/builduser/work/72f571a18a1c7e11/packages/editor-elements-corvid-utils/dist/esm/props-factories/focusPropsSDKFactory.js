import {
    registerCorvidEvent
} from '../corvidEvents';
export var focusPropsSDKFactory = function(api) {
    return {
        focus: function() {
            return api.compRef.focus();
        },
        blur: function() {
            return api.compRef.blur();
        },
        onFocus: function(handler) {
            return registerCorvidEvent('onFocus', api, handler);
        },
        onBlur: function(handler) {
            return registerCorvidEvent('onBlur', api, handler);
        },
    };
};
//# sourceMappingURL=focusPropsSDKFactory.js.map