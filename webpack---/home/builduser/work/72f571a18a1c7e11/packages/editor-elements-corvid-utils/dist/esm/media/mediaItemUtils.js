import {
    types,
    errors
} from './common';
var templates = {
    vector: function(svgId, filename) {
        return "wix:vector://v1/" + svgId + "/" + filename;
    },
    image: function(uri, filename, width, height, watermark) {
        return "wix:image://v1/" + uri + "/" + filename + "#originWidth=" + width + "&originHeight=" + height + (watermark ? "&watermark=" + watermark : '');
    },
    document: function(uri, filename) {
        return "wix:document://v1/" + uri + "/" + filename;
    },
    video: function(videoId, posterId, filename, width, height) {
        if (width === void 0) {
            width = 0;
        }
        if (height === void 0) {
            height = 0;
        }
        return "wix:video://v1/" + videoId + "/" + filename + "#posterUri=" + posterId + "&posterWidth=" + width + "&posterHeight=" + height;
    },
    audio: function(uri, filename, duration) {
        return "wix:audio://v1/" + uri + "/" + filename + "#duration=" + duration;
    },
};
/* eslint-disable no-useless-escape */
var matchers = {
    vector: /^wix:vector:\/\/v1\/([^\/]+)\/([^\/]*)$/,
    image: /^wix:image:\/\/v1\/([^\/]+)\/([^\/]+)#originWidth=([0-9]+)&originHeight=([0-9]+)(?:&watermark=([^\/]+))?$/,
    document: /^wix:document:\/\/v1\/([^\/]+)\/([^\/]+)$/,
    video: /^wix:video:\/\/v1\/([^\/]+)\/([^\/]+)#posterUri=([^\/]+)&posterWidth=([0-9]+)&posterHeight=([0-9]+)$/,
    audio: /^wix:audio:\/\/v1\/([^\/]+)\/([^\/]+)#duration=([0-9]+)$/,
    deprecated_video: /^wix:video:\/\/v1\/([^\/]+)\/([^\/]+)\/#posterUri=([^\/]+)&posterWidth=([0-9]+)&posterHeight=([0-9]+)$/,
    deprecated_image: /^image:\/\/v1\/([^\/]+)\/([0-9]+)_([0-9]+)\/([^\/]*)$/,
    deprecated_type: /^(image):/,
    type: /^wix:(\w+):/,
    splitExtension: /\.(?=[^.]+$)/,
    emptyTitle: /^_\./,
};
/* eslint-enable no-useless-escape*/
var matchersByType = {
    vector: [matchers.vector],
    image: [matchers.image, matchers.deprecated_image],
    document: [matchers.document],
    video: [matchers.video, matchers.deprecated_video],
    audio: [matchers.audio],
};
/**
 * Return a file name, use the extension from uri if the title has none
 */
function convertTitleToFilename(type, title, uri) {
    if (title === void 0) {
        title = '';
    }
    var _a = uri.split(matchers.splitExtension),
        uriName = _a[0],
        uriExtension = _a[1];
    var _b = title.split(matchers.splitExtension),
        titleName = _b[0],
        titleExtension = _b[1];
    var filename;
    switch (type) {
        case types.IMAGE:
            filename = (titleName || '_') + "." + (titleExtension || uriExtension);
            break;
        case types.DOCUMENT:
            filename = (titleName || uriName) + "." + (titleExtension || uriExtension);
            break;
        case types.VIDEO:
            filename = "" + (titleName || '_') + (titleExtension ? "." + titleExtension : '');
            break;
        case types.AUDIO:
            filename = (titleName || uriName) + "." + (titleExtension || uriExtension);
            break;
        case types.VECTOR:
            filename = (titleName || uriName) + "." + (titleExtension || uriExtension);
            break;
        default:
            filename = '';
            break;
    }
    return encodeURI(filename);
}
/**
 * return filename or an empty string
 */
function convertFilenameToTitle(filename) {
    return matchers.emptyTitle.test(filename) ? '' : decodeURI(filename);
}
/**
 * Create a MediaItem for an image, width and height are mandatory numbers
 */
function createImageItem(_a) {
    var mediaId = _a.mediaId,
        title = _a.title,
        width = _a.width,
        height = _a.height,
        watermark = _a.watermark;
    if (!mediaId) {
        return {
            error: errors.empty_media_id
        };
    }
    if (typeof height !== 'number' || typeof width !== 'number') {
        return {
            error: errors.missing_width_height
        };
    }
    var filename = convertTitleToFilename(types.IMAGE, title, mediaId);
    return {
        item: templates.image(mediaId, filename, width, height, watermark)
    };
}
/**
 * Create a MediaItem for a document
 */
function createDocumentItem(_a) {
    var mediaId = _a.mediaId,
        title = _a.title;
    if (!mediaId) {
        return {
            error: errors.empty_media_id
        };
    }
    var filename = convertTitleToFilename(types.DOCUMENT, title, mediaId);
    return {
        item: templates.document(mediaId, filename)
    };
}
/**
 * Create a MediaItem for a vector image
 */
function createVectorItem(_a) {
    var mediaId = _a.mediaId,
        title = _a.title;
    if (!mediaId) {
        return {
            error: errors.empty_media_id
        };
    }
    var filename = convertTitleToFilename(types.VECTOR, title, mediaId);
    return {
        item: templates.vector(mediaId, filename)
    };
}
/**
 * Create a MediaItem for a video, posterId is a mandatory image uri, width and height are mandatory numbers
 */
function createVideoItem(_a) {
    var mediaId = _a.mediaId,
        title = _a.title,
        width = _a.width,
        height = _a.height,
        posterId = _a.posterId;
    if (!mediaId) {
        return {
            error: errors.empty_media_id
        };
    }
    if (!posterId) {
        return {
            error: errors.empty_poster_id
        };
    }
    if (isNaN(height || NaN) || isNaN(width || NaN)) {
        return {
            error: errors.missing_width_height
        };
    }
    var strippedMediaId = mediaId.replace('video/', '');
    var filename = convertTitleToFilename(types.VIDEO, title, strippedMediaId);
    return {
        item: templates.video(strippedMediaId, posterId, filename, width, height),
    };
}
/**
 * Create a MediaItem for a audio
 */
function createAudioItem(_a) {
    var mediaId = _a.mediaId,
        title = _a.title,
        duration = _a.duration;
    if (!mediaId) {
        return {
            error: errors.empty_media_id
        };
    }
    var filename = convertTitleToFilename(types.AUDIO, title, mediaId);
    return {
        item: templates.audio(mediaId, filename, duration || 0)
    };
}
/**
 * Parse an image MediaItem
 */
function parseImageItem(item) {
    var _a = item.match(matchers.image) || [],
        mediaId = _a[1],
        filename = _a[2],
        width = _a[3],
        height = _a[4],
        watermark = _a[5];
    var title = convertFilenameToTitle(filename);
    if (mediaId) {
        var parsed = {
            type: types.IMAGE,
            mediaId: mediaId,
            title: title,
            width: parseInt(width, 10),
            height: parseInt(height, 10),
            watermark: watermark,
        };
        return parsed;
    }
    return {
        error: errors.bad_media_id
    };
}

function parseDeprecatedImageItem(item) {
    var _a = item.match(matchers.deprecated_image) || [],
        mediaId = _a[1],
        width = _a[2],
        height = _a[3],
        filename = _a[4];
    var title = convertFilenameToTitle(filename);
    if (mediaId) {
        return {
            type: types.IMAGE,
            mediaId: mediaId,
            title: title,
            width: parseInt(width, 10),
            height: parseInt(height, 10),
        };
    }
    return {
        error: errors.bad_media_id
    };
}
/**
 * Parse a document MediaItem
 */
function parseDocumentItem(item) {
    var _a = item.match(matchers.document) || [],
        mediaId = _a[1],
        filename = _a[2];
    var title = convertFilenameToTitle(filename);
    if (mediaId) {
        return {
            type: types.DOCUMENT,
            mediaId: mediaId,
            title: title,
        };
    }
    return {
        error: errors.bad_media_id
    };
}
/**
 * Parse a vector MediaItem
 */
function parseVectorItem(item) {
    var _a = item.match(matchers.vector) || [],
        mediaId = _a[1],
        filename = _a[2];
    var title = convertFilenameToTitle(filename);
    if (mediaId) {
        return {
            type: types.VECTOR,
            mediaId: mediaId,
            title: title,
        };
    }
    return {
        error: errors.bad_media_id
    };
}
/**
 * Parse a video MediaItem
 */
function parseVideoItem(item) {
    var videoMatcher = matchers.deprecated_video.test(item) ?
        matchers.deprecated_video :
        matchers.video;
    var _a = item.match(videoMatcher) || [],
        mediaId = _a[1],
        filename = _a[2],
        posterId = _a[3],
        width = _a[4],
        height = _a[5];
    var title = convertFilenameToTitle(filename);
    if (mediaId && posterId) {
        return {
            type: types.VIDEO,
            mediaId: mediaId,
            posterId: posterId,
            width: parseInt(width, 10),
            height: parseInt(height, 10),
            title: title,
        };
    }
    return {
        error: errors.bad_media_id
    };
}
/**
 * Parse a audio MediaItem
 */
function parseAudioItem(item) {
    var _a = item.match(matchers.audio) || [],
        mediaId = _a[1],
        filename = _a[2],
        duration = _a[3];
    var title = convertFilenameToTitle(filename);
    if (mediaId) {
        return {
            type: types.AUDIO,
            mediaId: mediaId,
            title: title,
            duration: parseInt(duration, 10),
        };
    }
    return {
        error: errors.bad_media_id
    };
}
/**
 * Create a MediaItem in the form of 'wix:<media_type>:<uri>/...' of one of the supported type
 */
function createMediaItemUri(_a) {
    var mediaId = _a.mediaId,
        type = _a.type,
        title = _a.title,
        width = _a.width,
        height = _a.height,
        posterId = _a.posterId,
        watermark = _a.watermark,
        duration = _a.duration;
    switch (type) {
        case types.IMAGE:
            return createImageItem({
                mediaId: mediaId,
                title: title,
                width: width,
                height: height,
                watermark: watermark
            });
        case types.DOCUMENT:
            return createDocumentItem({
                mediaId: mediaId,
                title: title
            });
        case types.VECTOR:
            return createVectorItem({
                mediaId: mediaId,
                title: title
            });
        case types.VIDEO:
            return createVideoItem({
                mediaId: mediaId,
                title: title,
                width: width,
                height: height,
                posterId: posterId
            });
        case types.AUDIO:
            return createAudioItem({
                mediaId: mediaId,
                title: title,
                duration: duration
            });
        default:
            return {
                error: errors.unknown_media_type
            };
    }
}
/**
 * Parse a media item url of one of the supported types
 */
function parseMediaItemUri(mediaItemUri) {
    if (mediaItemUri === void 0) {
        mediaItemUri = '';
    }
    if (typeof mediaItemUri !== 'string') {
        return {
            error: errors.non_string_media_id
        };
    }
    var _a = mediaItemUri.match(matchers.type) || [],
        type = _a[1];
    switch (type) {
        case types.IMAGE:
            return parseImageItem(mediaItemUri);
        case types.DOCUMENT:
            return parseDocumentItem(mediaItemUri);
        case types.VECTOR:
            return parseVectorItem(mediaItemUri);
        case types.VIDEO:
            return parseVideoItem(mediaItemUri);
        case types.AUDIO:
            return parseAudioItem(mediaItemUri);
        default:
            var _b = mediaItemUri.match(matchers.deprecated_type) || [],
                deprecatedType = _b[1];
            if (deprecatedType) {
                return parseDeprecatedImageItem(mediaItemUri);
            }
            return {
                error: errors.unknown_media_type
            };
    }
}
/**
 * Checks if a given url is a valid media item url
 */
function isValidMediaItemUri(mediaItemUri, type) {
    if (mediaItemUri === void 0) {
        mediaItemUri = '';
    }
    var typeMatchers = matchersByType[type];
    return (typeMatchers && typeMatchers.some(function(matcher) {
        return matcher.test(mediaItemUri);
    }));
}
export {
    isValidMediaItemUri,
    createMediaItemUri,
    parseMediaItemUri,
    errors,
    types,
};
//# sourceMappingURL=mediaItemUtils.js.map