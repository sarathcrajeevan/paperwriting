import {
    GALLERY_CONSTS
} from 'pro-gallery';
import {
    INFO_EVENTS
} from '@wix/pro-gallery-info-element';
import {
    FULLSCREEN_EVENTS
} from '@wix/pro-fullscreen-renderer';
var SyncEventHandler = /** @class */ (function() {
    function SyncEventHandler(galleryWrapper, galleryWrapperProps) {
        this.galleryWrapper = galleryWrapper;
        this.galleryWrapperProps = galleryWrapperProps;
        this.reportedBiGalleryRendered = false;
        this.update = this.update.bind(this);
        this.eventHandler = this.eventHandler.bind(this);
        this.fullscreenEventHandler = this.fullscreenEventHandler.bind(this);
    }
    SyncEventHandler.prototype.update = function(galleryWrapperProps) {
        this.galleryWrapperProps = galleryWrapperProps;
        if (this.asyncEventHandler) {
            this.asyncEventHandler.update(galleryWrapperProps);
        }
        if (this.galleryWrapperProps.appLoadStartedReported &&
            this.appLoadedEventReported) {
            this.onAppLoaded();
        }
    };
    SyncEventHandler.prototype.onAppLoaded = function() {
        this.galleryWrapper.logHelper.onAppLoaded();
        this.reportedBiGalleryRenderedIfNeeded();
    };
    SyncEventHandler.prototype.reportedBiGalleryRenderedIfNeeded = function() {
        // should report only once!
        if (!this.reportedBiGalleryRendered) {
            this.reportedBiGalleryRendered = true;
            // if (Math.random() < 0.01 || utils.shouldDebug('gallery_rendered')) {
            // use only 1 of 100 events (do not overflow the bi)
            // randomization removed temporarily for post-mortem reasons
            this.galleryWrapper.logHelper.reportBiEvent('gallery_rendered');
            // }
        }
    };
    SyncEventHandler.prototype.eventHandler = function(eventName, eventData) {
        var _this = this;
        if (eventName === 'GALLERY_CHANGE') {
            // this.onGalleryChangeEvent();
            this.galleryWrapper.siteHelper.handleNewGalleryStructure(eventData);
            return;
        } else if (eventName === 'APP_LOADED') {
            this.onAppLoadedEvent();
        }
        var whiteListedEvents = [
            GALLERY_CONSTS.events.LOAD_MORE_CLICKED,
            GALLERY_CONSTS.events.ITEM_ACTION_TRIGGERED,
            GALLERY_CONSTS.events.CURRENT_ITEM_CHANGED,
            GALLERY_CONSTS.events.NEED_MORE_ITEMS,
            INFO_EVENTS.SHARE_BUTTON_CLICKED,
            INFO_EVENTS.TEXT_DOWNLOAD_BUTTON_CLICKED,
            INFO_EVENTS.LOVE_BUTTON_CLICKED,
            GALLERY_CONSTS.events.ITEM_CLICKED,
            INFO_EVENTS.DOWNLOAD_BUTTON_CLICKED,
            INFO_EVENTS.CUSTOM_BUTTON_CLICKED,
            INFO_EVENTS.SOCIAL_SHARE_BUTTON_CLICKED,
            GALLERY_CONSTS.events.THUMBNAIL_CLICKED,
            GALLERY_CONSTS.events.ITEM_FOCUSED,
            GALLERY_CONSTS.events.ITEM_LOST_FOCUS,
            GALLERY_CONSTS.events.GALLERY_SCROLLED,
        ];
        var isEventHandled = whiteListedEvents.includes(eventName);
        if (isEventHandled) {
            if (!this.asyncEventHandler) {
                import (
                    /* webpackChunkName: "AsyncEventHandler" */
                    './asyncEventHandler').then(function(module) {
                    _this.asyncEventHandler = new module.default(_this.galleryWrapper, _this.galleryWrapperProps);
                    _this.asyncEventHandler.handleEvent(eventName, eventData);
                });
            } else if (this.asyncEventHandler) {
                this.asyncEventHandler.handleEvent(eventName, eventData);
            }
        }
    };
    SyncEventHandler.prototype.fullscreenEventHandler = function(eventName, eventData) {
        var _this = this;
        var whiteListedFullscreenEvents = [
            FULLSCREEN_EVENTS.UPDATE_CURRENT_ITEM,
            FULLSCREEN_EVENTS.CLOSE_FULLSCREEN,
            FULLSCREEN_EVENTS.NEED_MORE_ITEMS,
            FULLSCREEN_EVENTS.TOGGLE_BROWSER_FULLSCREEN,
            FULLSCREEN_EVENTS.NAVIGATE,
            FULLSCREEN_EVENTS.FULLSCREEN_LOADED,
            FULLSCREEN_EVENTS.SHARE_BUTTON_CLICKED,
            FULLSCREEN_EVENTS.TEXT_DOWNLOAD_BUTTON_CLICKED,
            FULLSCREEN_EVENTS.DOWNLOAD_BUTTON_CLICKED,
            FULLSCREEN_EVENTS.LOVE_BUTTON_CLICKED,
            FULLSCREEN_EVENTS.SOCIAL_SHARE_BUTTON_CLICKED,
        ];
        var isEventHandled = whiteListedFullscreenEvents.includes(eventName);
        if (isEventHandled) {
            if (!this.asyncEventHandler) {
                import (
                    /* webpackChunkName: "AsyncEventHandler" */
                    './asyncEventHandler').then(function(module) {
                    _this.asyncEventHandler = new module.default(_this.galleryWrapper, _this.galleryWrapperProps);
                    _this.asyncEventHandler.handleFullscreenEvent(eventName, eventData);
                });
            } else if (this.asyncEventHandler) {
                this.asyncEventHandler.handleFullscreenEvent(eventName, eventData);
            }
        }
    };
    // onGalleryChangeEvent() {
    //   this.galleryChangeEventReported = true;
    //   if (this.galleryWrapperProps.appLoadStartedReported) {
    //     this.onAppLoaded();
    //   }
    // }
    SyncEventHandler.prototype.onAppLoadedEvent = function() {
        this.appLoadedEventReported = true;
        if (this.galleryWrapperProps.appLoadStartedReported) {
            this.onAppLoaded();
        }
    };
    return SyncEventHandler;
}());
export default SyncEventHandler;
//# sourceMappingURL=syncEventHandler.js.map