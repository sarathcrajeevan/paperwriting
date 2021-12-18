import {
    withValidation
} from '../validations';
import {
    registerCorvidEvent
} from '../corvidEvents';
var _playablePropsSDKFactory = function(api) {
    return {
        get isPlaying() {
            return api.props.isPlaying;
        },
        play: function() {
            api.compRef.play();
            return api.getSdkInstance();
        },
        pause: function() {
            api.compRef.pause();
            return api.getSdkInstance();
        },
        onPlay: function(handler) {
            return registerCorvidEvent('onPlay', api, handler);
        },
        onPause: function(handler) {
            return registerCorvidEvent('onPause', api, handler);
        },
        next: function() {
            return new Promise(function(resolve, reject) {
                reject('sdk method not implemented');
            });
        },
        previous: function() {
            return new Promise(function(resolve, reject) {
                reject('sdk method not implemented');
            });
        },
    };
};
export var playablePropsSDKFactory = withValidation(_playablePropsSDKFactory, {
    type: ['object'],
    properties: {},
});
//# sourceMappingURL=playablePropsSDKFactory.js.map