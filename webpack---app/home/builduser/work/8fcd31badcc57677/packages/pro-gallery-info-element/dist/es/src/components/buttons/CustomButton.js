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
import INFO_EVENTS from '../../common/constants/infoEvents';
import CustomButtonIcon from './CustomButtonIcon';
import {
    utils
} from '../../common/utils/utils';

var CustomButton = /*#__PURE__*/ function(_React$Component) {
    _inheritsLoose(CustomButton, _React$Component);

    function CustomButton() {
        return _React$Component.apply(this, arguments) || this;
    }

    var _proto = CustomButton.prototype;

    _proto.render = function render() {
        var _this = this;

        var _this$props = this.props,
            options = _this$props.options,
            actions = _this$props.actions;
        var buttonText = options.customButtonText || 'Click here'; // Flip alignment sides when RTL

        var justifyContent = options.galleryHorizontalAlign;

        if (options.isRTL) {
            justifyContent = utils.flipGalleryHorizontalAlign(options.galleryHorizontalAlign);
        }

        return /*#__PURE__*/ React.createElement("div", {
            className: "info-member info-element-custom-button-wrapper",
            "data-hook": "custom-button-wrapper",
            style: {
                justifyContent: justifyContent,
                zIndex: 17
            }
        }, this.props.small && options.isStoreGallery ? /*#__PURE__*/ React.createElement(CustomButtonIcon, null) : /*#__PURE__*/ React.createElement("button", {
            "data-hook": "custom-button-button",
            className: 'info-element-custom-button-button',
            onClick: function onClick() {
                return actions.eventsListener(INFO_EVENTS.CUSTOM_BUTTON_CLICKED, _this.props);
            },
            style: {
                cursor: 'inherit'
            },
            tabIndex: -1
        }, buttonText, /*#__PURE__*/ React.createElement("div", {
            className: "overlay"
        })));
    };

    return CustomButton;
}(React.Component);

export default CustomButton;