import {
    registerCorvidEvent
} from '../corvidEvents';
export var changePropsSDKFactory = function(api) {
    return ({
        onChange: function(handler) {
            return registerCorvidEvent('onChange', api, handler);
        },
    });
};
//# sourceMappingURL=changePropsSDKFactory.js.map