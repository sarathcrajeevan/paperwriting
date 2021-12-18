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

var Description = /*#__PURE__*/ function(_React$Component) {
    _inheritsLoose(Description, _React$Component);

    function Description() {
        return _React$Component.apply(this, arguments) || this;
    }

    var _proto = Description.prototype;

    _proto.render = function render() {
        var _this$props = this.props,
            description = _this$props.description,
            style = _this$props.style;
        return /*#__PURE__*/ React.createElement("div", {
            className: 'info-member info-element-description',
            "data-hook": "item-description",
            style: style
        }, description.split('\n').map(function(i, key) {
            return /*#__PURE__*/ React.createElement("span", {
                key: key
            }, i, /*#__PURE__*/ React.createElement("br", null));
        }));
    };

    return Description;
}(React.Component);

export {
    Description as
    default
};