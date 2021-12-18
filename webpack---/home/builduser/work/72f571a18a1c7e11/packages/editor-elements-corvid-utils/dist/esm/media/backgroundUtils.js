var __assign = (this && this.__assign) || function() {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import _ from 'lodash';
import {
    isValidMediaSrc,
    parseMediaSrc
} from './mediaSrcHandler';
export var BG_VIDEO_DEFAULTS = {
    loop: true,
    preload: 'auto',
    muted: true,
    isVideoEnabled: true,
};
var getVideoPosterObject = function(_a) {
    var mediaId = _a.mediaId,
        posterId = _a.posterId,
        width = _a.width,
        height = _a.height,
        title = _a.title;
    return {
        type: 'WixVideo',
        videoId: mediaId,
        posterImageRef: {
            type: 'Image',
            uri: posterId,
            width: width,
            height: height,
            title: title,
        },
    };
};
export var getScrollEffect = function(fillLayers) {
    if (fillLayers === void 0) {
        fillLayers = {};
    }
    var _a = (fillLayers.backgroundMedia || {}).bgEffectName,
        bgEffectName = _a === void 0 ? '' : _a;
    return {
        hasBgScrollEffect: bgEffectName ? 'true' : '',
        bgEffectName: bgEffectName,
    };
};
export var hasVideo = function(props) {
    var _a, _b;
    var _c = props.fillLayers,
        fillLayers = _c === void 0 ? {} : _c;
    return (_b = (_a = fillLayers === null || fillLayers === void 0 ? void 0 : fillLayers.video) === null || _a === void 0 ? void 0 : _a.videoInfo) === null || _b === void 0 ? void 0 : _b.videoId;
};
export var getIdFromUrl = function(fileUrl) {
    var result = fileUrl.match(/(?:\/|^)([0-9a-fA-F_]+)(?:\/|$)/);
    if (!result) {
        return '';
    }
    return result.length > 1 ? result[1] : '';
};
var getVideoId = function(videoId) {
    return videoId.replace('video/', '');
};
var getObjectValueByKey = function(object, key) {
    return object[key] || object[_.camelCase(key)];
};
var fixMediaTitleLength = function(value, lengthLimit) {
    var CHARS_TO_ADD = '...';
    var NUM_OF_CHARS_TO_KEEP = 3;
    if (value.length <= lengthLimit) {
        return value;
    }
    var arr = value.split('');
    var numOfCharsToRemove = value.length - lengthLimit + CHARS_TO_ADD.length;
    var isFileTypeSuffix = value.lastIndexOf('.') >
        value.length - numOfCharsToRemove - NUM_OF_CHARS_TO_KEEP;
    var fileTypeSuffixIndex = isFileTypeSuffix ?
        value.lastIndexOf('.') :
        value.length - 1;
    var removeIndex = fileTypeSuffixIndex - numOfCharsToRemove - NUM_OF_CHARS_TO_KEEP;
    arr.splice(removeIndex, numOfCharsToRemove, CHARS_TO_ADD);
    return arr.join('');
};
var parseVideoQualities = function(fileOutput) {
    var mp4Videos = _.filter(fileOutput.video, {
        format: 'mp4'
    });
    var storyboard = _.find(fileOutput.storyboard, {
        format: 'mp4'
    });
    var qualities = _.map(mp4Videos, function(quality) {
        return _.pick(quality, ['width', 'height', 'quality', 'url']);
    });
    if (storyboard) {
        qualities.push({
            quality: 'storyboard',
            width: storyboard.width,
            height: storyboard.height,
            url: storyboard.url,
        });
    }
    return qualities;
};
var parseAdaptiveUrls = function(fileOutput) {
    var adaptiveVideo = getObjectValueByKey(fileOutput, 'adaptive_video');
    return _.map(adaptiveVideo, function(item) {
        return {
            format: item.format,
            url: item.url,
        };
    });
};
var parseMediaFeatures = function(fileInfo) {
    var mediaFeatures = [];
    if (fileInfo.tags && _.includes(fileInfo.tags, '_mp4_alpha')) {
        mediaFeatures.push('alpha');
    }
    return _.isEmpty(mediaFeatures) ? null : mediaFeatures;
};
var url2uri = function(url) {
    // eslint-disable-next-line
    return url.replace(/^(.*[\/])/, '');
};
var parseVideoPosters = function(fileOutput) {
    return _.map(fileOutput.image, function(image) {
        return url2uri(image.url);
    });
};
var parseVideoFileInfo = function(fileInfo, info) {
    var TITLE_LENGTH_LIMIT = 100;
    var fileInput = getObjectValueByKey(fileInfo, 'file_input');
    var fileOutput = getObjectValueByKey(fileInfo, 'file_output');
    var videoId = getIdFromUrl(fileInfo.fileUrl || fileInfo.file_name);
    var title = fixMediaTitleLength(fileInfo.title, TITLE_LENGTH_LIMIT);
    var qualities = parseVideoQualities(fileOutput);
    var adaptiveVideo = parseAdaptiveUrls(fileOutput);
    var mediaFeatures = parseMediaFeatures(fileInfo);
    // parse poster - get the first item in data
    var imageData = _.head(fileOutput.image);
    var posterImageRef = {
        type: 'Image',
        width: imageData.width,
        height: imageData.height,
        uri: url2uri(imageData.url),
        description: info.path ? info.path : undefined,
    };
    var parsed = {
        type: 'WixVideo',
        title: title,
        videoId: videoId,
        duration: +(fileInput.duration / 1000).toFixed(2),
        posterImageRef: posterImageRef,
        generatedPosters: parseVideoPosters(fileOutput),
        qualities: qualities,
        adaptiveVideo: adaptiveVideo,
        artist: {
            name: fileInfo.vendor || '',
            id: fileInfo.reference || ''
        },
        hasAudio: getObjectValueByKey(_.head(fileOutput.video), 'audio_bitrate') !== -1,
        fps: _.get(_.head(fileOutput.video), 'fps', '').toString(),
        mediaFeatures: mediaFeatures || [],
    };
    return parsed;
};
var getVideoBackgroundObject = function(fileInfo, info) {
    var MEDIA_OBJECT_DEFAULTS = {
        animatePoster: 'none',
        autoPlay: true,
        playbackRate: 1,
        fittingType: 'fill',
        hasBgScrollEffect: '',
        bgEffectName: '',
        isVideoDataExists: '1',
        alignType: 'center',
        videoFormat: 'mp4',
        playerType: 'html5',
        isEditorMode: false,
        isViewerMode: true,
        videoHeight: fileInfo.file_input.height,
        videoWidth: fileInfo.file_input.width,
    };
    var mediaObject = parseVideoFileInfo(fileInfo, info);
    return __assign({
        mediaObject: __assign(__assign({}, MEDIA_OBJECT_DEFAULTS), mediaObject)
    }, BG_VIDEO_DEFAULTS);
};
var getFullVideoData = function(videoId, callback) {
    videoId = getVideoId(videoId);
    var VIDEO_INFO_END_POINT = "https://files.wix.com/site/media/files/" + videoId + "/info";
    fetch(VIDEO_INFO_END_POINT)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            var fullVideoMediaRef = getVideoBackgroundObject(response, {});
            callback(fullVideoMediaRef);
        });
};
export var getMediaDataFromSrc = function(value) {
    if (isValidMediaSrc(value, 'video')) {
        var parseMediaItem = parseMediaSrc(value, 'video');
        if (parseMediaItem.error) {
            return null;
        }
        return __assign(__assign({}, getVideoPosterObject(parseMediaItem)), {
            name: parseMediaItem.title,
            fileName: parseMediaItem.title,
            type: 'WixVideo',
        });
    } else {
        var parseMediaItem = parseMediaSrc(value, 'image');
        if (parseMediaItem.error) {
            return null;
        }
        return __assign(__assign({}, parseMediaItem), {
            name: parseMediaItem.title,
            type: 'Image',
        });
    }
};
export var getFullMediaData = function(mediaData, callback) {
    if (mediaData.videoId) {
        getFullVideoData(mediaData.videoId, callback);
        return;
    }
    callback();
};
//# sourceMappingURL=backgroundUtils.js.map