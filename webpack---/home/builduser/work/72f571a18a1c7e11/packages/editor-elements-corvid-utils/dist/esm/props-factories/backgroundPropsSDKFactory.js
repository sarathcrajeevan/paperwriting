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
import {
    reportError
} from '../reporters';
import {
    withValidation
} from '../validations';
import {
    createMediaSrc,
    getScrollEffect,
    getFullMediaData,
    getMediaDataFromSrc,
    hasVideo,
    BG_VIDEO_DEFAULTS,
} from '../media';
import * as mediaItemUtils from '../media/mediaItemUtils';
/**
 * sort qualities ASC , remove 'storyboard' quality
 * @param qualities
 */
var normalizeQualities = function(qualities) {
    return qualities
        .filter(function(item) {
            return item.quality !== 'storyboard';
        })
        .sort(function(item1, item2) {
            return parseInt(item1.quality, 10) - parseInt(item2.quality, 10);
        });
};
var _backgroundPropsSDKFactory = function(_a) {
    var setProps = _a.setProps,
        props = _a.props,
        metaData = _a.metaData,
        compRef = _a.compRef;
    var isVideo = hasVideo(props);
    return {
        get background() {
            return {
                get src() {
                    var _a, _b;
                    var _c = props.fillLayers,
                        fillLayers = _c === void 0 ? {} : _c;
                    if ((_b = (_a = fillLayers === null || fillLayers === void 0 ? void 0 : fillLayers.video) === null || _a === void 0 ? void 0 : _a.videoInfo) === null || _b === void 0 ? void 0 : _b.videoId) {
                        var videoInfo = fillLayers.video.videoInfo;
                        var mediaItemUri = createMediaSrc({
                            mediaId: videoInfo.videoId,
                            type: mediaItemUtils.types.VIDEO,
                            title: fillLayers.video.posterImageInfo.title,
                            width: videoInfo.videoWidth,
                            height: videoInfo.videoHeight,
                            posterId: fillLayers.video.posterImageInfo.uri,
                        });
                        if (mediaItemUri.error) {
                            return '';
                        }
                        return mediaItemUri.item || '';
                    }
                    var image = fillLayers.image || fillLayers.backgroundImage;
                    if (image) {
                        var mediaItemUri = createMediaSrc({
                            mediaId: image.uri,
                            type: mediaItemUtils.types.IMAGE,
                            width: image.width,
                            height: image.height,
                            title: fillLayers.image ? fillLayers.image.title : undefined,
                        });
                        if (mediaItemUri.error) {
                            return '';
                        }
                        return mediaItemUri.item || '';
                    }
                    return '';
                },
                set src(newSrc) {
                    var _a = props.fillLayers,
                        fillLayers = _a === void 0 ? {} : _a;
                    if (!newSrc) {
                        // clear the background fillLayers
                        setProps({
                            fillLayers: {
                                containerId: metaData.compId,
                            },
                        });
                        return;
                    }
                    var mediaData = getMediaDataFromSrc(newSrc);
                    if (!mediaData) {
                        reportError("The \"src\" property cannot be set to \"" + newSrc + "\". It must be a valid URL starting with \"http://\", \"https://\", or \"wix:image://, or a valid video URL starting with \"wix:video://\".");
                        return;
                    }
                    var _b = getScrollEffect(fillLayers),
                        hasBgScrollEffect = _b.hasBgScrollEffect,
                        bgEffectName = _b.bgEffectName;
                    if (mediaData.type === 'WixVideo') {
                        getFullMediaData(mediaData, function(fullMediaRefData) {
                            if (!fullMediaRefData) {
                                return;
                            }
                            var propsFull = {
                                fillLayers: {
                                    containerId: metaData.compId,
                                    backgroundMedia: hasBgScrollEffect ?
                                        __assign({
                                            containerId: metaData.compId
                                        }, fillLayers.backgroundMedia) : undefined,
                                    hasBgFullscreenScrollEffect: fillLayers.hasBgFullscreenScrollEffect,
                                    video: __assign(__assign({}, BG_VIDEO_DEFAULTS), {
                                        alt: '',
                                        posterImageInfo: __assign({
                                            containerId: metaData.compId,
                                            hasBgScrollEffect: hasBgScrollEffect,
                                            bgEffectName: bgEffectName
                                        }, mediaData.posterImageRef),
                                        videoInfo: {
                                            containerId: metaData.compId,
                                            videoId: fullMediaRefData.mediaObject.videoId,
                                            videoWidth: fullMediaRefData.mediaObject.videoWidth,
                                            videoHeight: fullMediaRefData.mediaObject.videoHeight,
                                            qualities: normalizeQualities(fullMediaRefData.mediaObject.qualities),
                                            isVideoDataExists: '1',
                                            videoFormat: fullMediaRefData.mediaObject.videoFormat,
                                            playbackRate: fullMediaRefData.mediaObject.playbackRate,
                                            autoPlay: fullMediaRefData.mediaObject.autoPlay,
                                            hasBgScrollEffect: hasBgScrollEffect,
                                            bgEffectName: bgEffectName,
                                        }
                                    }),
                                },
                            };
                            setProps(propsFull);
                        });
                        // change to poster (video partial props)
                        setProps({
                            fillLayers: {
                                containerId: metaData.compId,
                                hasBgFullscreenScrollEffect: fillLayers.hasBgFullscreenScrollEffect,
                                backgroundMedia: hasBgScrollEffect ?
                                    __assign({
                                        containerId: metaData.compId
                                    }, fillLayers.backgroundMedia) : undefined,
                                video: __assign(__assign({}, BG_VIDEO_DEFAULTS), {
                                    alt: '',
                                    posterImageInfo: __assign({
                                        containerId: metaData.compId,
                                        hasBgScrollEffect: hasBgScrollEffect,
                                        bgEffectName: bgEffectName
                                    }, mediaData.posterImageRef),
                                    videoInfo: {
                                        containerId: metaData.compId,
                                        videoId: mediaData.videoId,
                                        isVideoDataExists: false,
                                    }
                                }),
                            },
                        });
                    } else {
                        // change to Image
                        setProps({
                            fillLayers: {
                                containerId: metaData.compId,
                                hasBgFullscreenScrollEffect: fillLayers.hasBgFullscreenScrollEffect,
                                backgroundMedia: hasBgScrollEffect ?
                                    __assign({
                                        containerId: metaData.compId
                                    }, fillLayers.backgroundMedia) : undefined,
                                image: __assign(__assign({}, mediaData), {
                                    uri: mediaData.mediaId || '',
                                    displayMode: 'fill',
                                    containerId: metaData.compId,
                                    name: '',
                                    width: mediaData.width || 0,
                                    height: mediaData.height || 0,
                                    alt: '',
                                    hasBgScrollEffect: hasBgScrollEffect,
                                    bgEffectName: bgEffectName
                                }),
                            },
                        });
                    }
                },
                get alt() {
                    var _a, _b, _c, _d;
                    return (((_b = (_a = props.fillLayers) === null || _a === void 0 ? void 0 : _a.image) === null || _b === void 0 ? void 0 : _b.alt) || ((_d = (_c = props.fillLayers) === null || _c === void 0 ? void 0 : _c.video) === null || _d === void 0 ? void 0 : _d.alt) || '');
                },
                set alt(newAlt) {
                    if (!props.fillLayers) {
                        return;
                    }
                    var _a = props.fillLayers,
                        image = _a.image,
                        video = _a.video;
                    var videoAttributes = video ?
                        {
                            video: __assign(__assign({}, video), {
                                alt: newAlt
                            })
                        } :
                        {};
                    var imageAttributes = image ?
                        {
                            image: __assign(__assign({}, image), {
                                alt: newAlt
                            })
                        } :
                        {};
                    setProps({
                        fillLayers: __assign(__assign(__assign({}, props.fillLayers), videoAttributes), imageAttributes),
                    });
                },
                play: function() {
                    if (isVideo) {
                        return compRef.play(true);
                    }
                },
                pause: function() {
                    if (isVideo) {
                        return compRef.pause();
                    }
                },
                stop: function() {
                    if (isVideo) {
                        return compRef.stop();
                    }
                },
            };
        },
    };
};
export var backgroundPropsSDKFactory = withValidation(_backgroundPropsSDKFactory, {
    type: ['object'],
    properties: {
        background: {
            type: ['object'],
            properties: {
                src: {
                    type: ['string', 'nil'],
                    warnIfNil: true,
                },
                alt: {
                    type: ['string', 'nil'],
                    warnIfNil: true,
                },
            },
        },
    },
});
//# sourceMappingURL=backgroundPropsSDKFactory.js.map