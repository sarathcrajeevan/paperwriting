function _extends() {
    _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends.apply(this, arguments);
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
import Texts from './texts/Texts';
import {
    GALLERY_CONSTS
} from 'pro-gallery-lib';

var TextInfoElement = /*#__PURE__*/ function(_React$Component) {
    _inheritsLoose(TextInfoElement, _React$Component);

    function TextInfoElement(props) {
        var _this;

        _this = _React$Component.call(this, props) || this;
        _this.state = {
            showShare: false
        };
        _this.isSmallItem = _this.isSmallItem.bind(_assertThisInitialized(_this));
        _this.isNarrow = _this.isNarrow.bind(_assertThisInitialized(_this));
        _this.hasRequiredMediaUrl = _this.hasRequiredMediaUrl.bind(_assertThisInitialized(_this));
        _this.getItemTextsDetails = _this.getItemTextsDetails.bind(_assertThisInitialized(_this));
        _this.createTextInfoElement = _this.createTextInfoElement.bind(_assertThisInitialized(_this));
        return _this;
    }

    var _proto = TextInfoElement.prototype;

    _proto.isSmallItem = function isSmallItem() {
        var _this$props = this.props,
            options = _this$props.options,
            style = _this$props.style;

        if (GALLERY_CONSTS.isLayout('SLIDESHOW')(options)) {
            return false;
        }

        var isSmallItem;
        var maxWidth = 90;
        var maxHeight = 90;

        if (options.cubeImages && options.cubeType === 'fit') {
            if (style.orientation === 'landscape') {
                // wide image
                isSmallItem = style.width / style.ratio <= maxHeight;
            } else {
                // tall image
                isSmallItem = style.height * style.ratio <= maxWidth;
            }
        } else {
            isSmallItem = style.width <= maxWidth || style.height <= maxHeight;
        }

        return isSmallItem;
    };

    _proto.isNarrow = function isNarrow() {
        return this.props.style.width < 200;
    };

    _proto.hasRequiredMediaUrl = function hasRequiredMediaUrl() {
        var _this$props2 = this.props,
            type = _this$props2.type,
            url = _this$props2.url; // if (there is an url for video items and image items) OR text item (text item do not use media url)

        return url || type === 'text';
    };

    _proto.getItemTextsDetails = function getItemTextsDetails(externalTotalInfoHeight) {
        if (externalTotalInfoHeight === void 0) {
            externalTotalInfoHeight = 0;
        }

        var isImage = this.props.type === 'image' || this.props.type === 'picture';
        var useCustomButton = this.props.options.useCustomButton === true;
        var shouldShowButton = (isImage || !this.props.options.isStoreGallery) && useCustomButton;
        return /*#__PURE__*/ React.createElement(Texts, _extends({}, this.props, {
            key: "item-texts-" + this.props.id,
            infoContainer: this.infoContainer,
            showShare: this.state.showShare,
            isSmallItem: this.isSmallItem(),
            isNarrow: this.isNarrow(),
            shouldShowButton: shouldShowButton,
            externalTotalInfoHeight: externalTotalInfoHeight,
            actions: {
                eventsListener: this.props.eventsListener
            }
        }));
    };

    _proto.createTextInfoElement = function createTextInfoElement() {
        var _this$props3 = this.props,
            options = _this$props3.options,
            style = _this$props3.style; // if there is no url for videos and images, we will not render the itemWrapper
        // but will render the info element if exists, with the whole size of the item

        var infoHeight = options.textBoxHeight + (this.hasRequiredMediaUrl() ? 0 : style.height);
        var itemTexts = this.getItemTextsDetails(infoHeight);
        return /*#__PURE__*/ React.createElement("div", {
            "data-hook": "external-info-element",
            style: {
                height: '100%'
            }
        }, itemTexts);
    };

    _proto.render = function render() {
        var _this2 = this;

        var infoElement = this.createTextInfoElement();
        return /*#__PURE__*/ React.createElement("div", {
            "data-hook": "info-element",
            ref: function ref(e) {
                return _this2.infoContainer = e;
            },
            style: {
                height: '100%',
                width: '100%'
            }
        }, infoElement);
    };

    return TextInfoElement;
}(React.Component);

export {
    TextInfoElement as
    default
};