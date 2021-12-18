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
var __awaiter = (this && this.__awaiter) || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new(P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }

        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }

        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function(thisArg, body) {
    var _ = {
            label: 0,
            sent: function() {
                if (t[0] & 1) throw t[1];
                return t[1];
            },
            trys: [],
            ops: []
        },
        f, y, t, g;
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;

    function verb(n) {
        return function(v) {
            return step([n, v]);
        };
    }

    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [0];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [6, e];
            y = 0;
        } finally {
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
import {
    createEffectValidation
} from './validations';
import {
    effectDefaultOptions,
    EFFECTS,
    sharedEffectDefaultOptions,
} from './animations';
export var createHiddenCollapsedSDKFactory = function(_a) {
    var _b = _a === void 0 ? {} : _a,
        viewportState = _b.viewportState,
        _c = _b.hasPortal,
        hasPortal = _c === void 0 ? false : _c;
    return function(_a) {
        var setStyles = _a.setStyles,
            portal = _a.portal,
            metaData = _a.metaData,
            getSdkInstance = _a.getSdkInstance,
            runAnimation = _a.runAnimation,
            createSdkState = _a.createSdkState,
            styleUtils = _a.styleUtils;
        var validateEffect = createEffectValidation({
            compName: metaData.role,
        });
        var _b = createSdkState({
                hidden: metaData.hiddenOnLoad,
                collapsed: metaData.collapsedOnLoad,
            }, 'hidden-collapsed'),
            state = _b[0],
            setState = _b[1];
        return {
            hide: function(effectName, effectOptions) {
                return __awaiter(void 0, void 0, void 0, function() {
                    var animationOptions;
                    var _a;
                    return __generator(this, function(_b) {
                        switch (_b.label) {
                            case 0:
                                if (state.collapsed || state.hidden) {
                                    setState({
                                        hidden: true
                                    });
                                    return [2 /*return*/ ];
                                }
                                if (!validateEffect({
                                        effectName: effectName,
                                        effectOptions: effectOptions,
                                        propertyName: 'hide',
                                    })) return [3 /*break*/ , 2];
                                animationOptions = {
                                    animationDirection: EFFECTS.HIDE.suffix,
                                    effectName: effectName,
                                    effectOptions: __assign(__assign({}, ((effectDefaultOptions === null || effectDefaultOptions === void 0 ? void 0 : effectDefaultOptions[effectName]) ||
                                        sharedEffectDefaultOptions)), effectOptions),
                                };
                                return [4 /*yield*/ , Promise.all([
                                    runAnimation(animationOptions),
                                    hasPortal ? portal.runAnimation(animationOptions) : undefined,
                                ])];
                            case 1:
                                _b.sent();
                                return [3 /*break*/ , 3];
                            case 2:
                                setStyles(styleUtils.getHiddenStyles());
                                if (hasPortal) {
                                    portal.setStyles(styleUtils.getHiddenStyles());
                                }
                                _b.label = 3;
                            case 3:
                                setState({
                                    hidden: true
                                });
                                (_a = viewportState === null || viewportState === void 0 ? void 0 : viewportState.onViewportLeave) === null || _a === void 0 ? void 0 : _a.forEach(function(cb) {
                                    return cb();
                                });
                                return [2 /*return*/ ];
                        }
                    });
                });
            },
            show: function(effectName, effectOptions) {
                return __awaiter(void 0, void 0, void 0, function() {
                    var runAnimationOptions;
                    var _a;
                    return __generator(this, function(_b) {
                        switch (_b.label) {
                            case 0:
                                if (state.collapsed || !state.hidden) {
                                    setState({
                                        hidden: false
                                    });
                                    return [2 /*return*/ ];
                                }
                                if (!validateEffect({
                                        effectName: effectName,
                                        effectOptions: effectOptions,
                                        propertyName: 'show',
                                    })) return [3 /*break*/ , 2];
                                runAnimationOptions = {
                                    animationDirection: EFFECTS.SHOW.suffix,
                                    effectName: effectName,
                                    effectOptions: __assign(__assign({}, ((effectDefaultOptions === null || effectDefaultOptions === void 0 ? void 0 : effectDefaultOptions[effectName]) ||
                                        sharedEffectDefaultOptions)), effectOptions),
                                };
                                return [4 /*yield*/ , Promise.all([
                                    runAnimation(runAnimationOptions),
                                    hasPortal ? portal.runAnimation(runAnimationOptions) : undefined,
                                ])];
                            case 1:
                                _b.sent();
                                return [3 /*break*/ , 3];
                            case 2:
                                setStyles(styleUtils.getShownStyles());
                                if (hasPortal) {
                                    portal.setStyles(styleUtils.getShownStyles());
                                }
                                _b.label = 3;
                            case 3:
                                setState({
                                    hidden: false
                                });
                                (_a = viewportState === null || viewportState === void 0 ? void 0 : viewportState.onViewportEnter) === null || _a === void 0 ? void 0 : _a.forEach(function(cb) {
                                    return cb();
                                });
                                return [2 /*return*/ ];
                        }
                    });
                });
            },
            collapse: function() {
                return __awaiter(void 0, void 0, void 0, function() {
                    var _a;
                    return __generator(this, function(_b) {
                        if (!state.collapsed) {
                            setStyles(styleUtils.getCollapsedStyles());
                            if (hasPortal) {
                                portal.setStyles(styleUtils.getCollapsedStyles());
                            }
                            setState({
                                collapsed: true
                            });
                            if (!state.hidden) {
                                (_a = viewportState === null || viewportState === void 0 ? void 0 : viewportState.onViewportLeave) === null || _a === void 0 ? void 0 : _a.forEach(function(cb) {
                                    return cb();
                                });
                            }
                        }
                        return [2 /*return*/ ];
                    });
                });
            },
            expand: function() {
                return __awaiter(void 0, void 0, void 0, function() {
                    var style;
                    var _a;
                    return __generator(this, function(_b) {
                        if (state.collapsed) {
                            style = __assign(__assign({}, styleUtils.getExpandedStyles()), {
                                visibility: state.hidden ? 'hidden' : null
                            });
                            setStyles(style);
                            if (hasPortal) {
                                portal.setStyles(style);
                            }
                            setState({
                                collapsed: false
                            });
                            if (!state.hidden) {
                                (_a = viewportState === null || viewportState === void 0 ? void 0 : viewportState.onViewportEnter) === null || _a === void 0 ? void 0 : _a.forEach(function(cb) {
                                    return cb();
                                });
                            }
                        }
                        return [2 /*return*/ ];
                    });
                });
            },
            get collapsed() {
                return state.collapsed;
            },
            get hidden() {
                return Boolean(state.hidden);
            },
            get isVisible() {
                if (!metaData.isRendered()) {
                    return false;
                }
                var parentSdk = getSdkInstance();
                while (parentSdk) {
                    if (parentSdk.hidden || parentSdk.collapsed) {
                        return false;
                    }
                    parentSdk = parentSdk.parent;
                }
                return true;
            },
            get isAnimatable() {
                return true;
            },
        };
    };
};
//# sourceMappingURL=hiddenCollapsedSDKFactory.js.map