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

import {
    RenderUtils
} from '@wix/photography-client-lib';

var Utils = /*#__PURE__*/ function(_RenderUtils) {
    _inheritsLoose(Utils, _RenderUtils);

    /* @ngInject */
    function Utils() {
        return _RenderUtils.call(this) || this;
    }

    var _proto = Utils.prototype;

    _proto.pick = function pick(obj, keys) {
        var res = {};
        Object.entries(obj || {}).forEach(function(_ref) {
            var key = _ref[0],
                val = _ref[1];

            if (keys.indexOf(key) >= 0) {
                res[key] = val;
            }
        });
        return res;
    };

    _proto.debounce = function debounce(callback, wait) {
        var _this = this;

        var timeout;
        return function() {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            clearTimeout(timeout);
            timeout = setTimeout(function() {
                callback.apply(_this, args);
            }, wait);
        };
    };

    _proto.get = function get(obj, path, defaultValue) {
        var result = String.prototype.split.call(path, /[,[\].]+?/).filter(Boolean).reduce(function(res, key) {
            return res !== null && res !== undefined ? res[key] : res;
        }, obj);
        return result === undefined || result === obj ? defaultValue : result;
    };

    _proto.flipGalleryHorizontalAlign = function flipGalleryHorizontalAlign(galleryHorizontalAlign) {
        // Usage in RTL galleries
        return galleryHorizontalAlign === 'flex-start' ? 'flex-end' : galleryHorizontalAlign === 'flex-end' ? 'flex-start' : galleryHorizontalAlign;
    };

    return Utils;
}(RenderUtils);

export var utils = new Utils();