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
    assert
} from './assert';
export var SVG_FALLBACK_CONTENT = '<svg data-failed />';
export var SVG_TYPE_INLINE = 'inline';
export var SVG_TYPE_WIX_MEDIA = 'wixMedia';
export var SVG_TYPE_URL = 'url';
var WIX_MEDIA_PREFIX_REGEX = /^wix:vector:\/\/v1\//;
var WIX_MEDIA_REGEX = /^wix:vector:\/\/v1\/[0-9|a-z|_]+.svg/;
var resolveSvgShape = function(value, baseSvgMediaUrl) {
    /**
     * Shapes have next format `wix:vector://v1/svgshape.v2.Svg_283bac5c7f3f4b348e0f68e27825aaa0/`
     * and they handled separately:
     * https://github.com/wix-private/santa-core/blob/master/santa-core-utils/src/coreUtils/core/svgUtils.js#L61
     */
    var extractShapeUri = function(svgId) {
        var _a = svgId
            .replace(/^.*\//, '')
            .split('.'),
            shapeVersion = _a[1],
            hash = _a[2],
            svgName = _a[3];
        var version = shapeVersion === 'v1' ? 1 : 2;
        var svgHash = hash.replace(/svg_/i, '');
        return svgHash + (version === 1 ? "_svgshape.v1." + svgName : '') + ".svg";
    };
    var svgShape = value.replace(WIX_MEDIA_PREFIX_REGEX, '').split('/')[0];
    var svgUri = extractShapeUri(svgShape);
    return {
        type: SVG_TYPE_WIX_MEDIA,
        data: baseSvgMediaUrl + "/" + svgUri,
    };
};
var extractWixMediaUrl = function(value) {
    var wixMediaUrl = (WIX_MEDIA_REGEX.exec(value) || [])[0];
    return wixMediaUrl;
};
export var createSvgWixMediaUrl = function(id, title) {
    var titleSuffix = title ? encodeURIComponent(title) : '';
    return "wix:vector://v1/" + id + "/" + titleSuffix;
};
export var resolveSvg = function(src, baseSvgMediaUrl) {
    if (assert.isWixSVGShape(src)) {
        return resolveSvgShape(src, baseSvgMediaUrl);
    }
    var wixMediaUrl = extractWixMediaUrl(src);
    if (wixMediaUrl) {
        var svgId = wixMediaUrl.replace(WIX_MEDIA_PREFIX_REGEX, '');
        return {
            type: SVG_TYPE_WIX_MEDIA,
            data: "" + baseSvgMediaUrl + svgId,
        };
    }
    if (assert.isInlineSvg(src)) {
        return {
            type: SVG_TYPE_INLINE,
            data: src
        };
    }
    return {
        type: SVG_TYPE_URL,
        data: src
    };
};
export var fetchSvg = function(url) {
    return __awaiter(void 0, void 0, void 0, function() {
        var response, _a;
        return __generator(this, function(_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/ , fetch(url)];
                case 1:
                    response = _b.sent();
                    if (response.ok) {
                        return [2 /*return*/ , response.text()];
                    }
                    return [3 /*break*/ , 3];
                case 2:
                    _a = _b.sent();
                    return [3 /*break*/ , 3];
                case 3:
                    return [2 /*return*/ , SVG_FALLBACK_CONTENT];
            }
        });
    });
};
export var resolveAndFetchSvg = function(src, baseSvgMediaUrl) {
    return __awaiter(void 0, void 0, void 0, function() {
        var _a, type, data;
        return __generator(this, function(_b) {
            _a = resolveSvg(src, baseSvgMediaUrl), type = _a.type, data = _a.data;
            if (type === SVG_TYPE_INLINE) {
                return [2 /*return*/ , data];
            }
            return [2 /*return*/ , fetchSvg(data)];
        });
    });
};
export var isFallbackSvg = function(svg) {
    return svg === SVG_FALLBACK_CONTENT;
};
//# sourceMappingURL=svg.js.map