import {
    __extends
} from "tslib";
import BaseUtils from './baseUtils';
import Wix from '../sdk/WixSdkWrapper';
import window from '../sdk/windowWrapper';
var RenderUtils = /** @class */ (function(_super) {
    __extends(RenderUtils, _super);

    function RenderUtils() {
        var _this = _super.call(this) || this;
        _this._cache = {};
        _this._hash2int = {};
        _this._params = {};
        _this._refs = {};
        _this._params = {};
        return _this;
    }
    RenderUtils.prototype.getScreenWidth = function() {
        if (this.isPreview() && this.isMobile()) {
            // In editor preview-mode, the screen is still a desktop, but the viewport in which the preview mode renders us is only 320, so 'window.screen.width' returns a wrong value.
            return 320;
        }
        if (this.isTest() || this.isSemiNative()) {
            return 1920;
        }
        try {
            if (this.isLandscape()) {
                return Math.max(window.screen.width, window.screen.height);
            } else {
                return window.screen.width;
            }
        } catch (e) {
            return 1920;
        }
    };
    RenderUtils.prototype.getScreenHeight = function() {
        if (this.isTest() || this.isSemiNative()) {
            return 1200;
        }
        try {
            if (this.isLandscape()) {
                return Math.min(window.screen.width, window.screen.height);
            } else {
                return window.screen.height;
            }
        } catch (e) {
            return 1200;
        }
    };
    RenderUtils.prototype.getWixMobileFixRatio = function() {
        return window.isSSR ? 1 : 320 / window.screen.width;
    };
    RenderUtils.prototype.fixViewport = function() {
        if (this.isSemiNative() || !this.isInWix()) {
            return;
        }
        try {
            this._cache.isLandscape = undefined;
            if (this.isSite() && this.isMobile() && !this.isMobileViewer()) {
                // using isUserAgentMobile creates a bug in mobile view when configured to show desktop on mobile (so isWixMobile is false)
                var viewportAspectRatio = this.getViewportScaleRatio();
                window.document.body.style.transform =
                    'scale(' + viewportAspectRatio + ')';
                window.document.body.style.transformOrigin = '0 0';
                window.document.body.style.width = 100 / viewportAspectRatio + '%';
                window.document.body.style.height = 100 / viewportAspectRatio + '%';
            }
        } catch (e) {
            return false;
        }
    };
    RenderUtils.prototype.isSmallScreen = function() {
        try {
            return (window.innerWidth || window.outerWidth) < 640 || this.isMobile();
        } catch (e) {
            return false;
        }
    };
    RenderUtils.prototype.isVerticalScreen = function() {
        try {
            return window.innerWidth < window.innerHeight;
        } catch (e) {
            return false;
        }
    };
    RenderUtils.prototype.isLandscape = function() {
        if (this.isSemiNative()) {
            return false;
        }
        if (!this.isUndefined(this._cache.isLandscape)) {
            return this._cache.isLandscape;
        }
        if (!this.isMobile()) {
            this._cache.isLandscape = false;
        }
        try {
            if (!this.isUndefined(window.orientation)) {
                this._cache.isLandscape =
                    window.orientation === 90 || window.orientation === -90;
            } else if (window.matchMedia) {
                var mql = window.matchMedia('(orientation: landscape)');
                if (mql && mql.matches === true) {
                    this._cache.isLandscape = true;
                } else {
                    this._cache.isLandscape = false;
                }
            } else {
                this._cache.isLandscape = false;
            }
        } catch (e) {
            this._cache.isLandscape = false;
        }
        return this._cache.isLandscape;
    };
    RenderUtils.prototype.getDevicePixelRatio = function() {
        try {
            return (window.devicePixelRatio ||
                window.screen.deviceXDPI / window.screen.logicalXDPI); // Support for IE10
        } catch (e) {
            return 1;
        }
    };
    RenderUtils.prototype.getWindowWidth = function() {
        try {
            return window.innerWidth || 980;
        } catch (e) {
            return 980;
        }
    };
    RenderUtils.prototype.getWindowHeight = function() {
        try {
            return window.innerHeight || 1080;
        } catch (e) {
            return 1080;
        }
    };
    RenderUtils.prototype.getWindow = function(windowName, verifyParam, compId, instanceId) {
        if (this.isTest()) {
            return window;
        }
        if (!this.isUndefined(this._refs[windowName])) {
            var cacheWindow = this._refs[windowName];
            if (cacheWindow && cacheWindow.location && cacheWindow.location.href) {
                return this._refs[windowName];
            } else {
                this._refs[windowName] = null;
            }
        }
        for (var d = 0; d < window.parent.frames.length; d++) {
            var frame = window.parent.frames[d];
            try {
                var found = false;
                try {
                    if (frame[verifyParam]) {
                        found = true;
                    }
                } catch (e) {
                    // console.warn('couldn\'t access frame', windowName, {d, e});
                }
                if (found) {
                    // check if this is the window
                    this._refs[windowName] = frame;
                    break;
                } else {
                    // check if one of this window's children is the one (e.g. when accessing the worker from the settings, the worker is inside the editor's iframe)
                    var frames_1 = [];
                    if (compId) {
                        if (frame.document.getElementById(compId)) {
                            frames_1 = frame.document
                                .getElementById(compId)
                                .getElementsByTagName('iframe');
                        }
                    } else {
                        frames_1 = frame.document.getElementsByTagName('iframe');
                    }
                    for (var f = 0; f < frames_1.length; f++) {
                        try {
                            var subFrame = frames_1[f].contentWindow;
                            if (subFrame[verifyParam]) {
                                // console.log('comparing ', instanceId, subFrame.instanceId);
                                if (!instanceId || subFrame.instanceId === instanceId) {
                                    // check if this is the window
                                    this._refs[windowName] = subFrame;
                                    break;
                                }
                            }
                        } catch (e) {
                            // console.warn('catch frame ', windowName, {d, f, e});
                        }
                    }
                    if (this._refs[windowName]) {
                        break;
                    }
                }
            } catch (e) {
                // console.warn('catch frame ', windowName, {d, e});
            }
        }
        if (this.isUndefined(this._refs[windowName])) {
            return this.safeSessionStorage();
        }
        return this._refs[windowName];
    };
    RenderUtils.prototype.getWorkerWindow = function() {
        if (this.isSemiNative()) {
            return [];
        }
        if (this.isStoreGallery()) {
            return this.getWindow('worker', 'isStoreWorker');
        } else {
            return this.getWindow('worker', 'isWorker');
        }
    };
    RenderUtils.prototype.getGalleryWindow = function(compId, instanceId) {
        return this.getWindow('gallery', 'isGallery', compId, instanceId);
    };
    RenderUtils.prototype.getGalleryByCompId = function(compId) {
        if (this.isUndefined(this._cache.galleries)) {
            this._cache.galleries = {};
        }
        // todo - caching of galleries removed because in some cases it made the window stay at a old version
        // e.g. - adding an image to the gallery (after fullscreen was already opened) and reopening it
        // if (!this.isUndefined(this._cache.galleries[compId])) {
        //  return this._cache.galleries[compId];
        // }
        for (var d = 0; d < window.parent.frames.length; d++) {
            try {
                var frame = window.parent.frames[d];
                if (frame.isGallery === true ||
                    frame.document.location.href.indexOf(this.getUrlPrefix() + 'gallery') >= 0) {
                    if (frame.document.location.href.indexOf('compId=' + compId) >= 0) {
                        // console.warn('got gallery by compId', compId, frame, frame['proGalleryWidget']);
                        this._cache.galleries[compId] = frame;
                    }
                }
            } catch (e) {
                // console.log('catch frame'+ d);
            }
        }
        return this._cache.galleries[compId];
    };
    RenderUtils.prototype.getViewportScaleRatio = function() {
        // 320 is a hack for wix - they have fixed viewport of 320 pixels regardlessof phone type
        var isGallery = typeof window !== 'undefined' && window.isGallery;
        var shouldIgnoreRatio = this.isiOS() && isGallery; // PHOT 917, this is a hack to get galleries back to their normal placement on iOS, w/o this galleries on iOS are smaller by the ratio returned here.
        if (!this.isOOI() &&
            this.isMobile() &&
            !this.isMobileViewer() &&
            this.isSite() &&
            !shouldIgnoreRatio) {
            return 320 / this.getScreenWidth();
        } else {
            return 1;
        }
    };
    RenderUtils.prototype.getMobileEnabledClick = function(action) {
        // todo: bring back this line before pushing to master
        return this.isMobile() ? {
            onTouchEnd: action
        } : {
            onClick: action
        };
        // return {onClick: action};
    };
    RenderUtils.prototype.getTopUrlParam = function(name) {
        if (this.isUndefined(this._cache.params)) {
            this._cache.params = {};
        }
        if (this.isUndefined(this._cache.params[name])) {
            try {
                this._cache.params[name] = top.location.search
                    .replace('?', '')
                    .split('&')
                    .map(function(ele) {
                        var arr = ele.split('=');
                        return arr[0] === name ? arr[1] || '' : '';
                    })
                    .join('');
            } catch (e) {
                this._cache.params[name] = false;
                // console.log('caught cross origin error');
                // comment to avoid 'block is empty' from linter
            }
        }
        return this._cache.params[name];
    };
    RenderUtils.prototype.getGalleryDataFromWorker = function() {
        var compId = Wix.Utils.getOrigCompId() ||
            this.getWorkerWindow()['pro-gallery-fullscreen-comp-id'];
        var galleryData = this.getWorkerWindow()['pro-gallery-data-' + compId] || {};
        return galleryData;
    };
    RenderUtils.prototype.getGallerySettingsFromWindow = function(galleryWindow) {
        if (galleryWindow === void 0) {
            galleryWindow = window;
        }
        try {
            var gallerySettingsStr = galleryWindow &&
                galleryWindow.prerenderedGallery &&
                galleryWindow.prerenderedGallery.gallerySettings;
            if (!gallerySettingsStr) {
                gallerySettingsStr =
                    galleryWindow &&
                    galleryWindow.prerenderedItem &&
                    galleryWindow.prerenderedItem.gallerySettings;
            }
            if (gallerySettingsStr) {
                return JSON.parse(this.stripSlashes(gallerySettingsStr));
            }
        } catch (e) {
            return {};
        }
    };
    RenderUtils.prototype.getTitleOrFilename = function(title, filename) {
        var shouldShowTitle = typeof title === typeof '';
        return shouldShowTitle ? title : filename;
    };
    RenderUtils.prototype.getFullscreenUrlState = function(compId, itemId, itemIdx, pageId, styleId) {
        return compId + "/" + itemId + "/" + itemIdx + "/?i=" + itemIdx + "&p=" + pageId + "&s=" + styleId;
    };
    return RenderUtils;
}(BaseUtils));
export default RenderUtils;
export var renderUtils = new RenderUtils(); // for inner use
//# sourceMappingURL=renderUtils.js.map