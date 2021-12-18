var _a;
import * as mediaItemUtils from './mediaItemUtils';
import {
    types,
    errors
} from './common';
var matchers = {
    externalUrl: /(^https?)|(^data)|(^blob)|(^\/\/)/,
    inlineSvg: /<svg[\s\S]*>[\s\S]*<\/svg>/im,
};
var extraMatchersByType = (_a = {},
    _a[mediaItemUtils.types.VECTOR] = [matchers.externalUrl, matchers.inlineSvg],
    _a[mediaItemUtils.types.IMAGE] = [matchers.externalUrl],
    _a[mediaItemUtils.types.DOCUMENT] = [],
    _a[mediaItemUtils.types.VIDEO] = [],
    _a[mediaItemUtils.types.AUDIO] = [matchers.externalUrl],
    _a);
/**
 * Create a MediaItem in the form of 'wix:<media_type>:<uri>/...' or extra supported source(e.g., external url) of one of the supported type
 */
function createMediaSrc(_a) {
    var _b;
    var mediaId = _a.mediaId,
        type = _a.type,
        title = _a.title,
        width = _a.width,
        height = _a.height,
        posterId = _a.posterId,
        watermark = _a.watermark,
        duration = _a.duration;
    if (
        // @ts-ignore
        (_b = extraMatchersByType[type]) === null || _b === void 0 ? void 0 : _b.some(function(matcher) {
            return matcher.test(mediaId);
        })) {
        return {
            item: mediaId
        };
    }
    return mediaItemUtils.createMediaItemUri({
        mediaId: mediaId,
        type: type,
        title: title,
        width: width,
        height: height,
        posterId: posterId,
        watermark: watermark,
        duration: duration,
    });
}
/**
 * Parse a media item url of one of the supported types, including extra source type(e.g. external url)
 */
function parseMediaSrc(mediaItemSrc, type) {
    if (!Object.values(types).includes(type)) {
        return {
            error: errors.unknown_media_type
        };
    }
    if (extraMatchersByType[type].some(function(matcher) {
            return matcher.test(mediaItemSrc);
        })) {
        return {
            type: type,
            mediaId: mediaItemSrc
        };
    }
    var mediaItemUri = mediaItemUtils.parseMediaItemUri(mediaItemSrc);
    if (mediaItemUri.error === errors.non_string_media_id) {
        return mediaItemUri;
    }
    if (mediaItemUri.error === errors.unknown_media_type ||
        type !== mediaItemUri.type) {
        return {
            error: errors.bad_media_id
        };
    }
    return mediaItemUri;
}
/**
 * Checks if a given url is a valid media source url
 */
function isValidMediaSrc(mediaSrc, type) {
    var isValidMediaItemUri = mediaItemUtils.isValidMediaItemUri(mediaSrc, type);
    return (isValidMediaItemUri ||
        (extraMatchersByType[type] &&
            extraMatchersByType[type].some(function(matcher) {
                return matcher.test(mediaSrc);
            })));
}
export {
    isValidMediaSrc,
    createMediaSrc,
    parseMediaSrc,
    errors,
    types
};
//# sourceMappingURL=mediaSrcHandler.js.map