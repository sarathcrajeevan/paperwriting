import {
    __awaiter,
    __generator
} from "tslib";
import {
    GALLERY_CONSTS
} from 'pro-gallery';
import {
    FULLSCREEN_EVENTS
} from '@wix/pro-fullscreen-renderer';
import {
    utils
} from '../utils/webUtils';
import {
    INFO_EVENTS
} from '@wix/pro-gallery-info-element';
var AsyncEventHandler = /** @class */ (function() {
    function AsyncEventHandler(galleryWrapper, props) {
        this.galleryWrapper = galleryWrapper;
        this.galleryWrapperProps = props;
        this.update = this.update.bind(this);
        this.handleEvent = this.handleEvent.bind(this);
        this.handleFullscreenEvent = this.handleFullscreenEvent.bind(this);
        this.handleGalleryScrolled = this.handleGalleryScrolled.bind(this);
        this.debounceHandleGalleryScrolled = utils.debounce(this.handleGalleryScrolled, 150);
    }
    AsyncEventHandler.prototype.update = function(props) {
        this.galleryWrapperProps = props;
    };
    AsyncEventHandler.prototype.handleGalleryScrolled = function(eventData) {
        var top = eventData.top,
            left = eventData.left;
        this.galleryWrapper.setState({
            galleryScroll: {
                x: top,
                y: left
            }
        });
    };
    AsyncEventHandler.prototype.handleEvent = function(eventName, eventData, event) {
        return __awaiter(this, void 0, void 0, function() {
            var _a;
            return __generator(this, function(_b) {
                switch (_b.label) {
                    case 0:
                        _a = eventName;
                        switch (_a) {
                            case GALLERY_CONSTS.events.GALLERY_SCROLLED:
                                return [3 /*break*/ , 1];
                            case GALLERY_CONSTS.events.LOAD_MORE_CLICKED:
                                return [3 /*break*/ , 2];
                            case GALLERY_CONSTS.events.ITEM_ACTION_TRIGGERED:
                                return [3 /*break*/ , 3];
                            case GALLERY_CONSTS.events.CURRENT_ITEM_CHANGED:
                                return [3 /*break*/ , 4];
                            case GALLERY_CONSTS.events.ITEM_FOCUSED:
                                return [3 /*break*/ , 5];
                            case GALLERY_CONSTS.events.ITEM_LOST_FOCUS:
                                return [3 /*break*/ , 6];
                            case GALLERY_CONSTS.events.NEED_MORE_ITEMS:
                                return [3 /*break*/ , 7];
                            case INFO_EVENTS.SHARE_BUTTON_CLICKED:
                                return [3 /*break*/ , 8];
                            case INFO_EVENTS.SOCIAL_SHARE_BUTTON_CLICKED:
                                return [3 /*break*/ , 10];
                            case INFO_EVENTS.TEXT_DOWNLOAD_BUTTON_CLICKED:
                                return [3 /*break*/ , 11];
                            case INFO_EVENTS.LOVE_BUTTON_CLICKED:
                                return [3 /*break*/ , 13];
                            case GALLERY_CONSTS.events.ITEM_CLICKED:
                                return [3 /*break*/ , 14];
                            case INFO_EVENTS.DOWNLOAD_BUTTON_CLICKED:
                                return [3 /*break*/ , 15];
                            case INFO_EVENTS.CUSTOM_BUTTON_CLICKED:
                                return [3 /*break*/ , 16];
                            case GALLERY_CONSTS.events.THUMBNAIL_CLICKED:
                                return [3 /*break*/ , 17];
                        }
                        return [3 /*break*/ , 18];
                    case 1:
                        this.debounceHandleGalleryScrolled(eventData);
                        return [3 /*break*/ , 19];
                    case 2:
                        this.galleryWrapper.loadMoreClicked = true;
                        return [3 /*break*/ , 19];
                    case 3:
                        this.galleryWrapper.itemActionsHelper.onItemActionTriggered(eventData, this.galleryWrapper.siteHelper.getPGOptions());
                        return [3 /*break*/ , 19];
                    case 4:
                        this.galleryWrapper.itemActionsHelper.onCurrentItemChanged(eventData);
                        return [3 /*break*/ , 19];
                    case 5:
                        this.galleryWrapper.itemActionsHelper.onItemFocused(eventData);
                        return [3 /*break*/ , 19];
                    case 6:
                        this.galleryWrapper.itemActionsHelper.onItemLostFocus();
                        return [3 /*break*/ , 19];
                    case 7:
                        this.galleryWrapper.itemsHelper.getMoreItems(eventData);
                        return [3 /*break*/ , 19];
                    case 8:
                        return [4 /*yield*/ , this.galleryWrapper.itemActionsHelper.handleItemActions('share', eventData)];
                    case 9:
                        _b.sent();
                        this.galleryWrapper.logHelper.reportBiEvent('share', eventData, 'gallery');
                        return [3 /*break*/ , 19];
                    case 10:
                        this.galleryWrapper.toggleSocialShareScreen(eventData.showSocialSharePopup, eventData);
                        this.galleryWrapper.logHelper.reportBiEvent('info', // Share icon (that opens the social-share popup) clicked
                            eventData, 'gallery');
                        return [3 /*break*/ , 19];
                    case 11:
                        return [4 /*yield*/ , this.galleryWrapper.itemActionsHelper.handleItemActions('downloadTextItem', eventData)];
                    case 12:
                        _b.sent();
                        this.galleryWrapper.logHelper.reportBiEvent('downloadTextItem', eventData, 'gallery');
                        return [3 /*break*/ , 19];
                    case 13:
                        this.galleryWrapper.itemActionsHelper.onLoveClicked(eventData, 'gallery');
                        return [3 /*break*/ , 19];
                    case 14:
                        this.galleryWrapper.itemActionsHelper.onItemClicked(eventData, event);
                        this.galleryWrapper.logHelper.reportBiEvent('onItemClicked', eventData, 'gallery');
                        return [3 /*break*/ , 19];
                    case 15:
                        this.galleryWrapper.logHelper.reportBiEvent('onDownloadButtonClicked', eventData, 'gallery');
                        return [3 /*break*/ , 19];
                    case 16:
                        if (this.galleryWrapper.isStoreGallery()) {
                            this.galleryWrapper.logHelper.reportBiEvent('onBuyNowClicked', eventData, 'gallery');
                        } else {
                            this.galleryWrapper.logHelper.reportBiEvent('onPGCustomButtonClicked', eventData, 'gallery');
                        }
                        return [3 /*break*/ , 19];
                    case 17:
                        this.galleryWrapper.logHelper.reportBiEvent('onThumbnailClicked', eventData, 'gallery');
                        return [3 /*break*/ , 19];
                    case 18:
                        if (utils.isVerbose()) {
                            console.log(eventName, 'is not handled in handleEvent function');
                        }
                        _b.label = 19;
                    case 19:
                        return [2 /*return*/ ];
                }
            });
        });
    };
    AsyncEventHandler.prototype.handleFullscreenEvent = function(eventName, eventData) {
        return __awaiter(this, void 0, void 0, function() {
            var _a;
            return __generator(this, function(_b) {
                switch (_b.label) {
                    case 0:
                        _a = eventName;
                        switch (_a) {
                            case FULLSCREEN_EVENTS.UPDATE_CURRENT_ITEM:
                                return [3 /*break*/ , 1];
                            case FULLSCREEN_EVENTS.CLOSE_FULLSCREEN:
                                return [3 /*break*/ , 3];
                            case FULLSCREEN_EVENTS.NEED_MORE_ITEMS:
                                return [3 /*break*/ , 4];
                            case FULLSCREEN_EVENTS.TOGGLE_BROWSER_FULLSCREEN:
                                return [3 /*break*/ , 5];
                            case FULLSCREEN_EVENTS.NAVIGATE:
                                return [3 /*break*/ , 6];
                            case FULLSCREEN_EVENTS.FULLSCREEN_LOADED:
                                return [3 /*break*/ , 7];
                            case FULLSCREEN_EVENTS.SHARE_BUTTON_CLICKED:
                                return [3 /*break*/ , 8];
                            case FULLSCREEN_EVENTS.SOCIAL_SHARE_BUTTON_CLICKED:
                                return [3 /*break*/ , 10];
                            case FULLSCREEN_EVENTS.TEXT_DOWNLOAD_BUTTON_CLICKED:
                                return [3 /*break*/ , 11];
                            case FULLSCREEN_EVENTS.DOWNLOAD_BUTTON_CLICKED:
                                return [3 /*break*/ , 13];
                            case FULLSCREEN_EVENTS.LOVE_BUTTON_CLICKED:
                                return [3 /*break*/ , 14];
                        }
                        return [3 /*break*/ , 15];
                    case 1:
                        return [4 /*yield*/ , this.galleryWrapper.fullscreenHelper.updateFullscreenCurrentItem(eventData.item)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/ , 16];
                    case 3:
                        this.galleryWrapper.fullscreenHelper.animatedCloseFullscreen(eventData.itemIdx, eventData.animationDuration);
                        return [3 /*break*/ , 16];
                    case 4:
                        this.galleryWrapper.itemsHelper.getMoreItems(eventData);
                        return [3 /*break*/ , 16];
                    case 5:
                        this.galleryWrapper.fullscreenHelper.toggleBrowserFullscreen();
                        return [3 /*break*/ , 16];
                    case 6:
                        this.galleryWrapper.itemActionsHelper.onLinkNavigation(eventData);
                        return [3 /*break*/ , 16];
                    case 7:
                        this.galleryWrapper.logHelper.reportBiEvent('item_expanded', eventData, 'fullscreen');
                        return [3 /*break*/ , 16];
                    case 8:
                        return [4 /*yield*/ , this.galleryWrapper.itemActionsHelper.handleItemActions('share', eventData)];
                    case 9:
                        _b.sent();
                        this.galleryWrapper.logHelper.reportBiEvent('share', eventData, 'fullscreen');
                        return [3 /*break*/ , 16];
                    case 10:
                        this.galleryWrapper.toggleSocialShareScreen(eventData.showSocialSharePopup, eventData);
                        this.galleryWrapper.logHelper.reportBiEvent('info', // Share icon (that opens the social-share popup) clicked
                            eventData, 'fullscreen');
                        return [3 /*break*/ , 16];
                    case 11:
                        return [4 /*yield*/ , this.galleryWrapper.itemActionsHelper.handleItemActions('downloadTextItem', eventData)];
                    case 12:
                        _b.sent();
                        this.galleryWrapper.logHelper.reportBiEvent('downloadTextItem', eventData, 'fullscreen');
                        return [3 /*break*/ , 16];
                    case 13:
                        this.galleryWrapper.logHelper.reportBiEvent('onDownloadButtonClicked', eventData, 'fullscreen');
                        return [3 /*break*/ , 16];
                    case 14:
                        // 1
                        this.galleryWrapper.itemActionsHelper.onLoveClicked(eventData, 'fullscreen');
                        return [3 /*break*/ , 16];
                    case 15:
                        if (utils.isVerbose()) {
                            console.log(eventName, 'is not handled in handleEvent function');
                        }
                        _b.label = 16;
                    case 16:
                        return [2 /*return*/ ];
                }
            });
        });
    };
    return AsyncEventHandler;
}());
export default AsyncEventHandler;
//# sourceMappingURL=asyncEventHandler.js.map