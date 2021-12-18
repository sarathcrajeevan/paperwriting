export var disablePropsSDKFactory = function(_a) {
    var setProps = _a.setProps,
        props = _a.props;
    return ({
        get enabled() {
            return typeof props.isDisabled !== 'undefined' ? !props.isDisabled : true;
        },
        disable: function() {
            setProps({
                isDisabled: true
            });
            return Promise.resolve();
        },
        enable: function() {
            setProps({
                isDisabled: false
            });
            return Promise.resolve();
        },
    });
};
//# sourceMappingURL=disablePropsSDKFactory.js.map