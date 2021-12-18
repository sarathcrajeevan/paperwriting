import {
    withValidation
} from '../validations';
var _readOnlyPropsSDKFactory = function(_a) {
    var setProps = _a.setProps,
        props = _a.props;
    return ({
        get readOnly() {
            return props.readOnly || false;
        },
        set readOnly(value) {
            setProps({
                readOnly: value
            });
        },
    });
};
export var readOnlyPropsSDKFactory = withValidation(_readOnlyPropsSDKFactory, {
    type: ['object'],
    properties: {
        readOnly: {
            type: ['boolean'],
        },
    },
});
//# sourceMappingURL=readOnlyPropsSDKFactory.js.map