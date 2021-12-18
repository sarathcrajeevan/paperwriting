import {
    withValidation
} from '../validations';
import {
    registerCorvidKeyboardEvent,
    registerCorvidEvent,
} from '../corvidEvents';
var _textInputPropsSDKFactory = function(api) {
    return {
        get placeholder() {
            return api.props.placeholder || '';
        },
        set placeholder(value) {
            var placeholder = value || '';
            api.setProps({
                placeholder: placeholder
            });
        },
        get maxLength() {
            return api.props.maxLength;
        },
        set maxLength(value) {
            var maxLength = value === null || value === undefined ? null : value;
            api.setProps({
                maxLength: maxLength
            });
        },
        onKeyPress: function(handler) {
            return registerCorvidKeyboardEvent('onKeyPress', api, handler);
        },
        onInput: function(handler) {
            return registerCorvidEvent('onInput', api, handler);
        },
    };
};
export var textInputPropsSDKFactory = withValidation(_textInputPropsSDKFactory, {
    type: ['object'],
    properties: {
        placeholder: {
            type: ['string', 'nil'],
            warnIfNil: true,
        },
        maxLength: {
            type: ['integer', 'nil'],
            warnIfNil: true,
            minimum: 0,
        },
    },
});
//# sourceMappingURL=textInputPropsSDKFactory.js.map