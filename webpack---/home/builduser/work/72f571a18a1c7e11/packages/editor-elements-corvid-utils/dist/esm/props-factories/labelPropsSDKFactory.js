import {
    withValidation
} from '../validations';
var _labelPropsSDKFactory = function(_a) {
    var setProps = _a.setProps,
        props = _a.props;
    return ({
        get label() {
            return props.label || '';
        },
        set label(value) {
            var label = value || '';
            setProps({
                label: label
            });
        },
    });
};
export var labelPropsSDKFactory = withValidation(_labelPropsSDKFactory, {
    type: ['object'],
    properties: {
        label: {
            type: ['string', 'nil'],
            warnIfNil: true,
        },
    },
});
//# sourceMappingURL=labelPropsSDKFactory.js.map