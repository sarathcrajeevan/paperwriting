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

var Title = /*#__PURE__*/ function(_React$Component) {
    _inheritsLoose(Title, _React$Component);

    function Title() {
        return _React$Component.apply(this, arguments) || this;
    }

    var _proto = Title.prototype;

    _proto.render = function render() {
        var _this$props = this.props,
            title = _this$props.title,
            style = _this$props.style;
        return /*#__PURE__*/ React.createElement("div", {
            className: 'info-member info-element-title',
            "data-hook": "item-title",
            style: style
        }, /*#__PURE__*/ React.createElement("span", null, title));
    };

    return Title;
}(React.Component);

export {
    Title as
    default
};