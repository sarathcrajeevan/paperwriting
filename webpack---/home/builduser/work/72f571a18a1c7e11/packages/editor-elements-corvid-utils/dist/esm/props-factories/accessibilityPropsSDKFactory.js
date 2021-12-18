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
    assert
} from '../assert';
import {
    composeSDKFactories
} from '../composeSDKFactories';
import {
    reportError
} from '../reporters';
export var REMOVABLE_ATTRIBUTES = ['ariaLabel'];
export var ErrorMessages;
(function(ErrorMessages) {
    ErrorMessages["ARIA_LABEL_NOT_STRING"] = "aria-label must be string";
    ErrorMessages["ARIA_LABEL_EMPTY_STRING"] = "aria-label can't be an empty string";
    ErrorMessages["REMOVING_MISSING_ATTRIBUTE"] = "Cannot remove a non existing attribute";
})(ErrorMessages || (ErrorMessages = {}));
export var getNotTextSelectorError = function(property) {
    return "The parameter that is passed to the \u2018" + property + "\u2019 property must be a selector function of a text element.";
};
export var getInvalidScreenReaderValueError = function(property) {
    return "The parameter that is passed to the \u2018" + property + "\u2019 property must be a string or \u2018null\u2019.";
};
var isTextElement = function(selector) {
    return selector.type === '$w.Text';
};
var legacyAriaLabelSDKFactory = function(_a) {
    var setProps = _a.setProps,
        props = _a.props;
    return ({
        get ariaLabel() {
            return props.ariaLabel;
        },
        set ariaLabel(label) {
            if (!assert.isString(label)) {
                reportError(ErrorMessages.ARIA_LABEL_NOT_STRING);
                return;
            }
            if (!label.length) {
                reportError(ErrorMessages.ARIA_LABEL_EMPTY_STRING);
                return;
            }
            setProps({
                ariaLabel: label
            });
        },
        remove: function(attribute) {
            var _a;
            if (!REMOVABLE_ATTRIBUTES.includes(attribute)) {
                reportError(ErrorMessages.REMOVING_MISSING_ATTRIBUTE);
                return;
            }
            setProps((_a = {}, _a[attribute] = undefined, _a));
        },
    });
};
var ariaLabelSDKFactory = function(_a) {
    var setProps = _a.setProps,
        props = _a.props;
    return ({
        get label() {
            var _a;
            return (_a = props.ariaAttributes) === null || _a === void 0 ? void 0 : _a.label;
        },
        set label(value) {
            if (value === undefined || value === null) {
                setProps({
                    ariaAttributes: __assign(__assign({}, props.ariaAttributes), {
                        label: undefined
                    }),
                });
                return;
            }
            if (!assert.isString(value)) {
                reportError(ErrorMessages.ARIA_LABEL_NOT_STRING);
                return;
            }
            if (!value.length) {
                reportError(ErrorMessages.ARIA_LABEL_EMPTY_STRING);
                return;
            }
            setProps({
                ariaAttributes: __assign(__assign({}, props.ariaAttributes), {
                    label: value
                }),
            });
        },
    });
};
var describedBySDKFactory = function(_a) {
    var setProps = _a.setProps,
        props = _a.props,
        create$w = _a.create$w;
    return ({
        get describedBy() {
            var _a;
            if (!((_a = props.ariaAttributes) === null || _a === void 0 ? void 0 : _a.describedBy)) {
                return undefined;
            }
            var $w = create$w();
            return $w("#" + props.ariaAttributes.describedBy);
        },
        set describedBy(selector) {
            if (!selector) {
                setProps({
                    ariaAttributes: __assign(__assign({}, props.ariaAttributes), {
                        describedBy: undefined
                    }),
                });
                return;
            }
            if (!isTextElement(selector)) {
                reportError(getNotTextSelectorError('describedBy'));
                return;
            }
            setProps({
                ariaAttributes: __assign(__assign({}, props.ariaAttributes), {
                    describedBy: selector.uniqueId
                }),
            });
        },
    });
};
var labelledBySDKFactory = function(_a) {
    var setProps = _a.setProps,
        props = _a.props,
        create$w = _a.create$w;
    return ({
        get labelledBy() {
            var _a;
            if (!((_a = props.ariaAttributes) === null || _a === void 0 ? void 0 : _a.labelledBy)) {
                return undefined;
            }
            var $w = create$w();
            return $w("#" + props.ariaAttributes.labelledBy);
        },
        set labelledBy(selector) {
            if (!selector) {
                setProps({
                    ariaAttributes: __assign(__assign({}, props.ariaAttributes), {
                        labelledBy: undefined
                    }),
                });
                return;
            }
            if (!isTextElement(selector)) {
                reportError(getNotTextSelectorError('labelledBy'));
                return;
            }
            setProps({
                ariaAttributes: __assign(__assign({}, props.ariaAttributes), {
                    labelledBy: selector.uniqueId
                }),
            });
        },
    });
};
var errorMessageSDKFactory = function(_a) {
    var setProps = _a.setProps,
        props = _a.props,
        create$w = _a.create$w;
    return ({
        get errorMessage() {
            var _a;
            if (!((_a = props.ariaAttributes) === null || _a === void 0 ? void 0 : _a.errorMessage)) {
                return undefined;
            }
            var $w = create$w();
            return $w("#" + props.ariaAttributes.errorMessage);
        },
        set errorMessage(selector) {
            if (!selector) {
                setProps({
                    ariaAttributes: __assign(__assign({}, props.ariaAttributes), {
                        errorMessage: undefined
                    }),
                });
                return;
            }
            if (!isTextElement(selector)) {
                reportError(getNotTextSelectorError('errorMessage'));
                return;
            }
            setProps({
                ariaAttributes: __assign(__assign({}, props.ariaAttributes), {
                    errorMessage: selector.uniqueId
                }),
            });
        },
    });
};
var createAriaAttributesSDKFactory = function(_a) {
    var enableAriaLabel = _a.enableAriaLabel,
        enableDescribedBy = _a.enableDescribedBy,
        enableLabelledBy = _a.enableLabelledBy,
        enableErrorMessage = _a.enableErrorMessage;
    var sdkFactories = [];
    if (enableAriaLabel) {
        sdkFactories.push(ariaLabelSDKFactory);
    }
    if (enableDescribedBy) {
        sdkFactories.push(describedBySDKFactory);
    }
    if (enableLabelledBy) {
        sdkFactories.push(labelledBySDKFactory);
    }
    if (enableErrorMessage) {
        sdkFactories.push(errorMessageSDKFactory);
    }
    var ariaAttributesSDKFactory = function(api) {
        return ({
            ariaAttributes: composeSDKFactories.apply(void 0, sdkFactories)(api),
        });
    };
    return ariaAttributesSDKFactory;
};
var screenReaderSDKFactory = function(_a) {
    var setProps = _a.setProps,
        props = _a.props;
    return ({
        screenReader: {
            get prefix() {
                var _a;
                return (_a = props.screenReader) === null || _a === void 0 ? void 0 : _a.prefix;
            },
            set prefix(value) {
                if (value !== null && !assert.isString(value)) {
                    reportError(getInvalidScreenReaderValueError('prefix'));
                    return;
                }
                setProps({
                    screenReader: __assign(__assign({}, props.screenReader), {
                        prefix: value
                    })
                });
            },
            get suffix() {
                var _a;
                return (_a = props.screenReader) === null || _a === void 0 ? void 0 : _a.suffix;
            },
            set suffix(value) {
                if (value !== null && !assert.isString(value)) {
                    reportError(getInvalidScreenReaderValueError('suffix'));
                    return;
                }
                setProps({
                    screenReader: __assign(__assign({}, props.screenReader), {
                        suffix: value
                    })
                });
            },
        },
    });
};
export var createAccessibilityPropSDKFactory = function(_a) {
    var _b = _a === void 0 ? {} : _a,
        _c = _b.enableLegacyAriaLabel,
        enableLegacyAriaLabel = _c === void 0 ? false : _c,
        _d = _b.enableAriaLabel,
        enableAriaLabel = _d === void 0 ? true : _d,
        _e = _b.enableDescribedBy,
        enableDescribedBy = _e === void 0 ? true : _e,
        _f = _b.enableLabelledBy,
        enableLabelledBy = _f === void 0 ? true : _f,
        _g = _b.enableErrorMessage,
        enableErrorMessage = _g === void 0 ? false : _g,
        _h = _b.enableScreenReader,
        enableScreenReader = _h === void 0 ? false : _h;
    return function(api) {
        var sdkFactories = [];
        var enableAriaAttributes = enableAriaLabel ||
            enableDescribedBy ||
            enableLabelledBy ||
            enableErrorMessage;
        if (enableAriaAttributes) {
            var ariaAttributesSDKFactory = createAriaAttributesSDKFactory({
                enableAriaLabel: enableAriaLabel,
                enableDescribedBy: enableDescribedBy,
                enableLabelledBy: enableLabelledBy,
                enableErrorMessage: enableErrorMessage,
            });
            sdkFactories.push(ariaAttributesSDKFactory);
        }
        if (enableLegacyAriaLabel) {
            sdkFactories.push(legacyAriaLabelSDKFactory);
        }
        if (enableScreenReader) {
            sdkFactories.push(screenReaderSDKFactory);
        }
        var accessibilitySdkFactory = composeSDKFactories.apply(void 0, sdkFactories);
        return {
            accessibility: accessibilitySdkFactory(api)
        };
    };
};
//# sourceMappingURL=accessibilityPropsSDKFactory.js.map