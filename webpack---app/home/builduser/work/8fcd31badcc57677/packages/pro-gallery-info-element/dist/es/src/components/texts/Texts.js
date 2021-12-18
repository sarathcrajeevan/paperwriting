function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}

function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}

import React from 'react';
import {
    GALLERY_CONSTS
} from 'pro-gallery-lib';
import {
    utils
} from '../../common/utils/utils';
import CustomButton from '../buttons/CustomButton.js';
import Title from './Title.js';
import Description from './Description.js';
import lineHeightFixer from './LineHeightFixer.js';
import designConsts from '../../common/constants/designConsts.js';

var Texts = /*#__PURE__*/ function(_React$Component) {
    _inheritsLoose(Texts, _React$Component);

    function Texts(props) {
        var _this;

        _this = _React$Component.call(this, props) || this;
        _this.debouncedTryFixLineHeight = utils.debounce(_this.tryFixLineHeight.bind(_assertThisInitialized(_this)), 500).bind(_assertThisInitialized(_this));
        return _this;
    }

    var _proto = Texts.prototype;

    _proto.getTextsClassNames = function getTextsClassNames() {
        var _this$props = this.props,
            showShare = _this$props.showShare,
            isNarrow = _this$props.isNarrow;
        var classNames = ['info-element-text'];

        if (showShare) {
            classNames.push('hidden');
        }

        if (isNarrow) {
            classNames.push('narrow-item');
        }

        return classNames.join(' ');
    };

    _proto.allowAnyAction = function allowAnyAction() {
        var options = this.props.options;
        return options.loveButton || options.allowSocial || options.allowDownload;
    };

    _proto.getTextsStyles = function getTextsStyles() {
        var _this$props2 = this.props,
            options = _this$props2.options,
            style = _this$props2.style;
        var textsStyles = {
            alignItems: options.galleryHorizontalAlign,
            textAlign: options.galleryTextAlign
        };

        if (GALLERY_CONSTS.hasExternalVerticalPlacement(options.titlePlacement)) {
            textsStyles = _objectSpread(_objectSpread({}, textsStyles), {
                paddingBottom: options.textsVerticalPadding + 15 + 'px',
                paddingTop: options.textsVerticalPadding + 15 + 'px',
                paddingRight: this.getInfoHorizontalPadding(options) + 'px',
                paddingLeft: this.getInfoHorizontalPadding(options) + 'px',
                boxSizing: 'border-box',
                height: '100%'
            });
        } // Horizontal placement is not yet implemented in wix editor, but the gallery support it (for example in the designed presets)


        if (GALLERY_CONSTS.hasExternalHorizontalPlacement(options.titlePlacement)) {
            textsStyles = _objectSpread(_objectSpread({}, textsStyles), {}, {
                paddingBottom: options.textsVerticalPadding + 15 + 'px',
                paddingTop: options.textsVerticalPadding + 15 + 'px',
                paddingRight: this.getInfoHorizontalPadding(options) + 'px',
                paddingLeft: this.getInfoHorizontalPadding(options) + 'px',
                boxSizing: 'border-box',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: options.galleryVerticalAlign
            });
        }

        if (GALLERY_CONSTS.hasHoverPlacement(options.titlePlacement)) {
            textsStyles = _objectSpread(_objectSpread({}, textsStyles), {
                display: 'flex',
                justifyContent: options.galleryVerticalAlign,
                alignContent: options.galleryVerticalAlign
            });
        }

        if (GALLERY_CONSTS.isLayout('SLIDESHOW')(options)) {
            textsStyles = _objectSpread(_objectSpread({}, textsStyles), {}, {
                display: 'flex',
                flexDirection: 'column'
            });
        }

        var textsDisplayOnHover = !GALLERY_CONSTS.isLayout('SLIDESHOW')(options) && !GALLERY_CONSTS.isLayout('SLIDER')(options) && !options.hasThumbnails && GALLERY_CONSTS.hasHoverPlacement(options.titlePlacement) && options.hoveringBehaviour !== GALLERY_CONSTS.infoBehaviourOnHover.NEVER_SHOW;
        var isCentered = style.justifyContent === 'center';

        if (textsDisplayOnHover && this.allowAnyAction() && (options.allowTitle || options.allowDescription)) {
            // Set the texts fixed height considering the height of the love and share buttons which is about 100px;
            textsStyles.paddingBottom = 70;
        }

        if (isCentered) {
            textsStyles.marginTop = style.height / 15;
        }

        if (options.isRTL) {
            textsStyles.direction = 'rtl';
        } else {
            textsStyles.direction = 'ltr';
        }

        return textsStyles;
    };

    _proto.getInfoHorizontalPadding = function getInfoHorizontalPadding(options) {
        if (options.imageInfoType === GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND || options.imageInfoType === GALLERY_CONSTS.infoType.ATTACHED_BACKGROUND) {
            return options.textsHorizontalPadding + 30;
        }

        return options.textsHorizontalPadding;
    };

    _proto.getItemTexts = function getItemTexts() {
        var _this2 = this;

        var _this$props3 = this.props,
            title = _this$props3.title,
            description = _this$props3.description,
            id = _this$props3.id,
            options = _this$props3.options,
            style = _this$props3.style,
            isNarrow = _this$props3.isNarrow,
            shouldShowButton = _this$props3.shouldShowButton,
            container = _this$props3.container;
        var shouldShowTitle = title && options.allowTitle;
        var shouldShowDescription = description && options.allowDescription;
        var titleStyle, descStyle;
        var titleMarginBottom;

        if (shouldShowDescription) {
            titleMarginBottom = options.titleDescriptionSpace;
        } else if (shouldShowButton) {
            titleMarginBottom = designConsts.spaceBetweenElements;
        } else {
            titleMarginBottom = 0;
        }

        titleStyle = {
            overflow: 'visible',
            marginBottom: titleMarginBottom
        };

        if (shouldShowButton) {
            descStyle = {
                marginBottom: designConsts.spaceBetweenElements
            };
        } else {
            descStyle = {
                marginBottom: 0
            };
        }

        if (GALLERY_CONSTS.isLayout('SLIDESHOW')(options) && container && container.galleryWidth && container.galleryWidth < 800) {
            var maxWidth = container.galleryWidth;

            if (options.allowSlideshowCounter) {
                maxWidth -= 30;
            }

            if (options.playButtonForAutoSlideShow) {
                maxWidth -= 30;
            }

            titleStyle.maxWidth = maxWidth;
            descStyle.maxWidth = maxWidth;
        }

        var titleElem = shouldShowTitle && /*#__PURE__*/ React.createElement(Title, {
            key: 'item-title-' + id,
            title: title,
            style: titleStyle
        });
        var descriptionElem = shouldShowDescription && /*#__PURE__*/ React.createElement(Description, {
            key: 'item-description-' + id,
            description: description,
            style: descStyle
        });
        var buttonElem = shouldShowButton && /*#__PURE__*/ React.createElement(CustomButton, {
            type: "button",
            options: options,
            style: style,
            small: isNarrow,
            actions: {
                eventsListener: this.props.actions.eventsListener
            }
        });
        var shouldHideElement = !titleElem && !descriptionElem && !buttonElem;

        if (shouldHideElement) {
            return null;
        }

        var textsStyles = this.getTextsStyles();
        var textsClassNames = this.getTextsClassNames();
        var allTextsElements = /*#__PURE__*/ React.createElement(React.Fragment, null, titleElem, descriptionElem, buttonElem);
        return /*#__PURE__*/ React.createElement("div", {
                style: textsStyles,
                ref: function ref(x) {
                    return _this2.container = x;
                },
                className: textsClassNames,
                dir: "auto"
            }, GALLERY_CONSTS.isLayout('SLIDESHOW')(options) ? allTextsElements : /*#__PURE__*/ React.createElement("div", null, allTextsElements) // wrapped with div for flex alignment purposes
        );
    };

    _proto.tryFixLineHeight = function tryFixLineHeight() {
        try {
            lineHeightFixer.fix(this.props, this.container);
        } catch (e) {
            if (utils.isVerbose()) {
                console.error('Error on componentDidUpdate', e);
            }
        }
    };

    _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
        if (lineHeightFixer.shouldFix(prevProps, this.props)) {
            this.debouncedTryFixLineHeight();
        }
    };

    _proto.componentDidMount = function componentDidMount() {
        var _this3 = this;

        this.tryFixLineHeight();
        setTimeout(function() {
            _this3.tryFixLineHeight(); // waiting for wix inline styles to take affect

        }, 1000);
    };

    _proto.render = function render() {
        return this.getItemTexts();
    };

    return Texts;
}(React.Component);

export {
    Texts as
    default
};