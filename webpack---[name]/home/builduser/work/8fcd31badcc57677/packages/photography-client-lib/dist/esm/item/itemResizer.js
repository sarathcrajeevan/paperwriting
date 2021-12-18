import {
    __assign
} from "tslib";
/* eslint-disable no-debugger */
import window from '../sdk/windowWrapper';
import imageTokenHelper from '../store/imageTokenHelper';
import {
    baseUtils
} from '../utils/baseUtils';
// const WIX_MEDIA_PREFIX = 'https://static.wixstatic.com/media/';
// mediaRootUrl: "https://static.wixstatic.com/"
// staticMediaUrl: "https://static.wixstatic.com/media"
// staticVideoUrl: "https://video.wixstatic.com/"
export {
    getResizeMediaUrl
};
var getResizeMediaUrl = function(_a) {
    var _b = _a === void 0 ? {} : _a,
        imageToken = _b.imageToken,
        staticMediaUrls = _b.staticMediaUrls;
    return function(args) {
        return resize(__assign(__assign({}, args), {
            imageToken: imageToken,
            staticMediaUrls: staticMediaUrls
        }));
    };
};
var joinURL = function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var url = args[0];
    for (var i = 1; i < args.length; ++i) {
        url = url.replace(/\/$/, '') + "/" + args[i].replace(/^\//, '');
    }
    return url;
};
var isExternalUrl = function(url, WIX_MEDIA_PREFIX) {
    var isFullUrl = /(^https?)|(^data)|(^blob)/.test(url);
    var isWixMedia = url.indexOf(WIX_MEDIA_PREFIX) === 0;
    var isResizePrevented = url.indexOf('preventResize') > 0;
    return isFullUrl && (!isWixMedia || isResizePrevented);
};
var isPosterImage = function(item) {
    if (item && item.dto && item.dto.metaData) {
        var type = item.dto.metaData.type;
        var poster = item.poster;
        if (type === 'video' && poster) {
            return true;
        }
    }
    return false;
};
var prefixUrlIfNeeded = function(originalUrl, WIX_MEDIA_PREFIX) {
    if (isExternalUrl(originalUrl, WIX_MEDIA_PREFIX)) {
        return originalUrl;
    } else {
        return joinURL(WIX_MEDIA_PREFIX, originalUrl);
    }
};
var removeResizeParams = function(originalUrl, WIX_MEDIA_PREFIX) {
    var isResizePrevented = originalUrl.indexOf('preventResize') >= 0;
    if (isResizePrevented)
        return originalUrl;
    originalUrl = originalUrl.replace(WIX_MEDIA_PREFIX, '');
    var resizingParamerterRegex = /(\/v\d\/(fill|fit|crop)\/(((w|h|x|y|scl|al|q)_[cf\d]*)\,?)*){1,}/;
    var resizingParametersPosition = resizingParamerterRegex.exec(originalUrl);
    if (resizingParametersPosition && resizingParametersPosition.index > 0) {
        return originalUrl.substr(0, resizingParametersPosition.index);
    } else {
        return originalUrl;
    }
};
var createResizedVideoUrl = function(_a, WIX_VIDEO_PREFIX) {
    var item = _a.item,
        originalUrl = _a.originalUrl,
        requiredHeight = _a.requiredHeight;
    var videoUrl = originalUrl;
    if (item.qualities && item.qualities.length) {
        var suffix = '/';
        var mp4Qualities = item.qualities.filter(function(video) {
            return video.formats[0] === 'mp4';
        });
        // search for the first quality bigger that the required one
        if (mp4Qualities.length > 1 &&
            mp4Qualities[0].height > mp4Qualities[1].height) {
            // some have reversed quality order. not sure how or when this happened
            mp4Qualities.reverse();
        }
        // eslint-disable-next-line no-cond-assign
        for (var quality = void 0, q = 0;
            (quality = mp4Qualities[q]); q++) {
            if (quality.height >= requiredHeight || !mp4Qualities[q + 1]) {
                suffix += quality.quality; // e.g. 720p
                // eslint-disable-next-line no-cond-assign
                for (var format = void 0, i = 0;
                    (format = quality.formats[i]); i++) {
                    videoUrl = joinURL(WIX_VIDEO_PREFIX, 'video/', item.url, suffix, format, '/file.' + format);
                }
                break;
            }
        }
        return videoUrl;
    }
};
var createResizedImageUrl = function(_a) {
    var item = _a.item,
        originalUrl = _a.originalUrl,
        resizeMethod = _a.resizeMethod,
        requiredWidth = _a.requiredWidth,
        requiredHeight = _a.requiredHeight,
        sharpParams = _a.sharpParams,
        focalPoint = _a.focalPoint,
        _b = _a.useWebp,
        useWebp = _b === void 0 ? false : _b,
        _c = _a.devicePixelRatio,
        devicePixelRatio = _c === void 0 ? 1 : _c,
        WIX_MEDIA_PREFIX = _a.WIX_MEDIA_PREFIX;
    var isTransparent = function() {
        return originalUrl.indexOf('.png') > 0 || originalUrl.indexOf('.gif') > 0;
    };
    var addSharpParams = function() {
        sharpParams = sharpParams || {};
        if (!sharpParams.quality) {
            sharpParams.quality = 90;
        }
        // don't allow quality above 90 till we have proper UI indication
        sharpParams.quality = Math.min(90, sharpParams.quality);
        if (sharpParams.allowUsm === true) {
            sharpParams.usm.usm_a = Math.min(5, Math.max(0, sharpParams.usm.usm_a || 0));
            sharpParams.usm.usm_r = Math.min(128, Math.max(0, sharpParams.usm.usm_r || 0)); // should be max 500 - but it's returning a 404
            sharpParams.usm.usm_t = Math.min(1, Math.max(0, sharpParams.usm.usm_t || 0));
        }
        var retUrl = '';
        retUrl += ',q_' + sharpParams.quality;
        if (sharpParams.blur && !isTransparent()) {
            // the blur looks bad in pngs
            retUrl += ',blur_' + sharpParams.blur;
        }
        retUrl +=
            sharpParams.usm && sharpParams.usm.usm_r ?
            ',usm_' +
            sharpParams.usm.usm_r.toFixed(2) +
            '_' +
            sharpParams.usm.usm_a.toFixed(2) +
            '_' +
            sharpParams.usm.usm_t.toFixed(2) :
            '';
        return retUrl;
    };
    var calcCropParams = function() {
        var scale;
        var x;
        var y;
        var orgW;
        var orgH;
        var maxHeight;
        var maxWidth;
        if (isPosterImage(item) && typeof item.poster === 'object') {
            maxHeight = item.poster.height;
            maxWidth = item.poster.width;
        } else {
            maxHeight = item.maxHeight;
            maxWidth = item.maxWidth;
        }
        var requiredRatio = requiredWidth / requiredHeight;
        var itemRatio = maxWidth / maxHeight;
        // find the scale
        if (itemRatio > requiredRatio) {
            // wide image (relative to required ratio
            scale = requiredHeight / maxHeight;
            orgW = Math.floor(requiredHeight * itemRatio);
            y = 0;
            x = Math.round(orgW * focalPoint[0] - requiredWidth / 2);
            x = Math.min(orgW - requiredWidth, x);
            x = Math.max(0, x);
        } else {
            // narrow image
            scale = requiredWidth / maxWidth;
            orgH = Math.floor(requiredWidth / itemRatio);
            x = 0;
            y = Math.round(orgH * focalPoint[1] - requiredHeight / 2);
            y = Math.min(orgH - requiredHeight, y);
            y = Math.max(0, y);
        }
        // make sure scale is not lower than needed
        // scale must be higher to prevent cases that there will be white margins (or 404)
        scale = (Math.ceil(scale * 100) / 100).toFixed(2);
        return {
            x: x,
            y: y,
            scale: scale
        };
    };
    var addResizeParams = function() {
        if (!focalPoint || focalPoint.every(function(f) {
                return f === 0.5;
            })) {
            resizeMethod = resizeMethod === 'fit' ? 'fit' : 'fill';
            if (requiredHeight <= 1 && requiredWidth <= 1)
                resizeMethod = 'fill';
            return "/v1/" + resizeMethod + "/w_" + requiredWidth + ",h_" + requiredHeight;
        } else {
            var fpStr = focalPoint
                .map(function(fp) {
                    return String(Math.floor(fp * 100) / 100).slice(0, 4);
                })
                .join('_');
            return "/v1/fill/w_" + requiredWidth + ",h_" + requiredHeight + ",fp_" + fpStr;
            // example: https://static.wixstatic.com/media/d97dd6_4c4d9f9cb4ae49db8da0a7ec384a2b6c~mv2.jpg/v1/fill/w_278,h_278,fp_0.52_0.46,q_90/d97dd6_4c4d9f9cb4ae49db8da0a7ec384a2b6c~mv2.webp
            // const { x, y, scale } = calcCropParams(
            //   item,
            //   requiredWidth,
            //   requiredHeight,
            //   focalPoint,
            // );
            // return `/v1/crop/w_${requiredWidth},h_${requiredHeight},x_${x},y_${y},scl_${scale}`;
        }
    };
    var addFilename = function() {
        return ('/' +
            (useWebp ? originalUrl.replace(/[^.]\w*$/, 'webp') : originalUrl).match(/[^/][\w.~]*$/)[0]);
    };
    var mobileScaleFix = Math.max(baseUtils.isMobile() && !baseUtils.isSSR() ? window.screen.width / 320 : 1, 1);
    requiredWidth = Math.ceil(requiredWidth * devicePixelRatio * mobileScaleFix);
    requiredHeight = Math.ceil(requiredHeight * devicePixelRatio * mobileScaleFix);
    var retUrl = prefixUrlIfNeeded(originalUrl, WIX_MEDIA_PREFIX);
    retUrl += addResizeParams();
    retUrl += addSharpParams();
    retUrl += addFilename();
    retUrl = imageTokenHelper.addToken(retUrl, item);
    return retUrl;
};
var getMediaType = function(originalUrl) {
    return ({
        jpg: 'jpeg',
        jpeg: 'jpeg',
        png: 'png',
        gif: 'gif',
    }[originalUrl.match(/[^\.]\w*$/)[0]] || 'jpeg');
};
var resize = function(_a) {
    var item = _a.item,
        originalUrl = _a.originalUrl,
        resizeMethod = _a.resizeMethod,
        requiredWidth = _a.requiredWidth,
        requiredHeight = _a.requiredHeight,
        _b = _a.sharpParams,
        sharpParams = _b === void 0 ? {} : _b,
        _c = _a.focalPoint,
        focalPoint = _c === void 0 ? [0.5, 0.5] : _c,
        _d = _a.createMultiple,
        createMultiple = _d === void 0 ? false : _d,
        _e = _a.imageToken,
        imageToken = _e === void 0 ? '' : _e,
        _f = _a.staticMediaUrls,
        staticMediaUrls = _f === void 0 ? {} : _f;
    var WIX_MEDIA_PREFIX = (staticMediaUrls === null || staticMediaUrls === void 0 ? void 0 : staticMediaUrls.staticMediaUrl) ? staticMediaUrls.staticMediaUrl :
        'https://static.wixstatic.com/media/';
    var WIX_VIDEO_PREFIX = (staticMediaUrls === null || staticMediaUrls === void 0 ? void 0 : staticMediaUrls.staticVideoUrl) ? staticMediaUrls.staticVideoUrl :
        'https://video.wixstatic.com/';
    var hasImageToken = item.dto.imageToken || item.dto.token || imageToken;
    originalUrl = removeResizeParams(originalUrl, WIX_MEDIA_PREFIX);
    var params = {
        item: item,
        originalUrl: originalUrl,
        resizeMethod: resizeMethod,
        requiredWidth: requiredWidth,
        requiredHeight: requiredHeight,
        sharpParams: sharpParams,
        focalPoint: focalPoint,
    };
    if (resizeMethod === 'video') {
        return createResizedVideoUrl(params, WIX_VIDEO_PREFIX);
    } else if (isExternalUrl(originalUrl, WIX_MEDIA_PREFIX)) {
        return originalUrl;
    } else if (resizeMethod === 'full' && !hasImageToken) {
        return prefixUrlIfNeeded(originalUrl, WIX_MEDIA_PREFIX);
    } else if (createMultiple) {
        return [{
                type: 'webp',
                url: createResizedImageUrl(__assign(__assign({}, params), {
                    useWebp: true,
                    devicePixelRatio: 1,
                    WIX_MEDIA_PREFIX: WIX_MEDIA_PREFIX
                })),
                dpr: [1, 2]
                    .map(function(dpr) {
                        return createResizedImageUrl(__assign(__assign({}, params), {
                            useWebp: true,
                            devicePixelRatio: dpr,
                            WIX_MEDIA_PREFIX: WIX_MEDIA_PREFIX
                        })) + (" " + dpr + "x");
                    })
                    .join(', '),
            },
            {
                type: getMediaType(originalUrl),
                url: createResizedImageUrl(__assign(__assign({}, params), {
                    useWebp: false,
                    devicePixelRatio: 1,
                    WIX_MEDIA_PREFIX: WIX_MEDIA_PREFIX
                })),
                dpr: [1, 2]
                    .map(function(dpr) {
                        return createResizedImageUrl(__assign(__assign({}, params), {
                            useWebp: false,
                            devicePixelRatio: dpr,
                            WIX_MEDIA_PREFIX: WIX_MEDIA_PREFIX
                        })) + (" " + dpr + "x");
                    })
                    .join(', '),
            },
        ];
    } else {
        return createResizedImageUrl(__assign(__assign({}, params), {
            WIX_MEDIA_PREFIX: WIX_MEDIA_PREFIX
        }));
    }
};
//# sourceMappingURL=itemResizer.js.map