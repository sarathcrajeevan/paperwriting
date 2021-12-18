import {
    registerCorvidEvent
} from '../corvidEvents';
import {
    createCompSchemaValidator
} from '../validations';
export var createViewportPropsSDKFactory = function(registerCallback) {
    return function(api) {
        var metaData = api.metaData,
            getSdkInstance = api.getSdkInstance,
            create$w = api.create$w,
            createEvent = api.createEvent;
        var functionValidator = function(value, setterName) {
            return createCompSchemaValidator(metaData.role)(value, {
                type: ['function'],
            }, setterName);
        };
        return {
            onViewportEnter: function(cb) {
                if (!functionValidator(cb, 'onViewportEnter')) {
                    return getSdkInstance();
                }
                registerCallback === null || registerCallback === void 0 ? void 0 : registerCallback('onViewportEnter', function() {
                    var corvidEvent = createEvent({
                        type: 'viewportEnter'
                    });
                    var $w = create$w();
                    cb(corvidEvent, $w);
                });
                return registerCorvidEvent('onViewportEnter', api, cb);
            },
            onViewportLeave: function(cb) {
                if (!functionValidator(cb, 'onViewportLeave')) {
                    return getSdkInstance();
                }
                registerCallback === null || registerCallback === void 0 ? void 0 : registerCallback('onViewportLeave', function() {
                    var corvidEvent = createEvent({
                        type: 'viewportLeave'
                    });
                    var $w = create$w();
                    cb(corvidEvent, $w);
                });
                return registerCorvidEvent('onViewportLeave', api, cb);
            },
        };
    };
};
//# sourceMappingURL=viewportPropsSDKFactory.js.map