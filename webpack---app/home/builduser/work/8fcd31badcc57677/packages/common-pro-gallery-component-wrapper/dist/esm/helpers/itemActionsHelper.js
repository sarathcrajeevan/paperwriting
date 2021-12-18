import {
    __awaiter,
    __generator
} from "tslib";
import {
    window
} from '@wix/photography-client-lib';
import {
    utils
} from '../utils/webUtils';
var ItemActionsHelper = /** @class */ (function() {
    function ItemActionsHelper(galleryWrapper, props, isStoreGallery, shouldUseGalleryIdForShareUrl) {
        this.galleryWrapper = galleryWrapper;
        this.galleryWrapperProps = props;
        this.isStoreGallery = isStoreGallery;
        this.shouldUseGalleryIdForShareUrl = shouldUseGalleryIdForShareUrl;
        this.update = this.update.bind(this);
        this.initItemActions = this.initItemActions.bind(this);
        this.useItemActions = this.useItemActions.bind(this);
        this.getAndInitItemActionsIfNeeded = this.getAndInitItemActionsIfNeeded.bind(this);
        this.onLoveCountsFetched = this.onLoveCountsFetched.bind(this);
        this.onLoveClicked = this.onLoveClicked.bind(this);
        this.onItemActionTriggered = this.onItemActionTriggered.bind(this);
        this.onItemClicked = this.onItemClicked.bind(this);
        this.onCurrentItemChanged = this.onCurrentItemChanged.bind(this);
        this.onLinkNavigation = this.onLinkNavigation.bind(this);
        this.handleItemActions = this.handleItemActions.bind(this);
        this.onItemFocused = this.onItemFocused.bind(this);
        this.onItemLostFocus = this.onItemLostFocus.bind(this);
        this.itemActions = null;
        this.initItemActionsStarted = false;
        this.reportMigratedLoveDataBiEvent = this.reportMigratedLoveDataBiEvent.bind(this);
        this.initWasRequested = false;
    }
    ItemActionsHelper.prototype.update = function(props) {
        this.galleryWrapperProps = props;
    };
    ItemActionsHelper.prototype.initItemActions = function() {
        return __awaiter(this, void 0, void 0, function() {
            var _a;
            return __generator(this, function(_b) {
                switch (_b.label) {
                    case 0:
                        _a = !this.initItemActionsStarted;
                        if (!_a) return [3 /*break*/ , 2];
                        return [4 /*yield*/ , this.useItemActions('initWidgetData', {
                            compId: this.galleryWrapperProps.id,
                            pageId: this.galleryWrapperProps.pageId,
                            styleId: this.galleryWrapperProps.styleId,
                            galleryId: this.galleryWrapperProps.galleryId,
                            isStoreGallery: this.isStoreGallery,
                            baseUrl: this.getBaseUrl(),
                            pageUrl: this.galleryWrapperProps.pageUrl,
                            fullscreenUrl: this.galleryWrapperProps.fullscreenUrl,
                            instanceId: this.galleryWrapperProps.instanceId,
                            instance: this.galleryWrapperProps.instance,
                            visitorId: this.galleryWrapperProps.visitorId,
                            appDefinitionId: this.galleryWrapperProps.appDefinitionId,
                            sentryReport: this.galleryWrapperProps.sentryReport,
                            reportMigratedLoveDataBiEvent: this.reportMigratedLoveDataBiEvent,
                            items: this.galleryWrapperProps.items,
                            onLoveCountsFetched: this.onLoveCountsFetched,
                            viewMode: this.galleryWrapper.siteHelper.parseViewMode(this.galleryWrapperProps.viewMode),
                            shouldUseGalleryIdForShareUrl: this.shouldUseGalleryIdForShareUrl,
                        })];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        _a;
                        this.initItemActionsStarted = true;
                        return [2 /*return*/ ];
                }
            });
        });
    };
    ItemActionsHelper.prototype.newItemLoveDataArrived = function(itemsLoveData) {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , this.useItemActions('setItemsLoveData', {
                            itemsLoveData: itemsLoveData,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/ ];
                }
            });
        });
    };
    ItemActionsHelper.prototype.getBaseUrl = function() {
        var baseUrl = this.galleryWrapperProps.baseUrl;
        var baseUrlParts = baseUrl.split('/');
        return baseUrlParts.slice(0, 3).join('/');
    };
    ItemActionsHelper.prototype.getItemActions = function() {
        var _this = this;
        if (utils.isSSR()) {
            return;
        }
        if (!!this.itemActions && typeof this.itemActions === 'object') {
            return Promise.resolve(this.itemActions);
        } else {
            return new Promise(function(resolve) {
                // todo: fix
                import (
                    /* webpackChunkName: "ItemActions" */
                    '@wix/photography-client-lib/dist/esm/item/itemActions').then(function(module) {
                    if (!_this.itemActions) {
                        var ItemActions = module.default;
                        _this.itemActions = new ItemActions();
                        resolve(_this.itemActions);
                    } else {
                        resolve(_this.itemActions);
                    }
                });
            });
        }
    };
    ItemActionsHelper.prototype.readFromItemActions = function(itemActions, method, args) {
        if (!!itemActions && typeof itemActions === 'object') {
            if (typeof itemActions[method] === 'function') {
                return itemActions[method].apply(itemActions, args);
            } else {
                return itemActions[method];
            }
        }
        return null;
    };
    ItemActionsHelper.prototype.getAndInitItemActionsIfNeeded = function() {
        return __awaiter(this, void 0, void 0, function() {
            var itemActions;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        itemActions = this.itemActions;
                        if (!(!this.initWasRequested && !this.itemActions && !utils.isSSR())) return [3 /*break*/ , 3];
                        this.initWasRequested = true;
                        return [4 /*yield*/ , this.getItemActions()];
                    case 1:
                        itemActions = _a.sent();
                        return [4 /*yield*/ , this.initItemActions()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        return [2 /*return*/ , itemActions];
                }
            });
        });
    };
    ItemActionsHelper.prototype.useItemActions = function(method) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function() {
            var itemActions;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , this.getAndInitItemActionsIfNeeded()];
                    case 1:
                        itemActions = _a.sent();
                        return [2 /*return*/ , this.readFromItemActions(itemActions, method, args)];
                }
            });
        });
    };
    ItemActionsHelper.prototype.onLoveCountsFetched = function(photoId2Love) {
        return __awaiter(this, void 0, void 0, function() {
            var itemsLoveData, photoId2LoveLength, index, _a, id, loveCount, _b, _c, _d;
            return __generator(this, function(_e) {
                switch (_e.label) {
                    case 0:
                        itemsLoveData = {};
                        photoId2LoveLength = Object.entries(photoId2Love).length;
                        index = 0;
                        _e.label = 1;
                    case 1:
                        if (!(index < photoId2LoveLength)) return [3 /*break*/ , 4];
                        _a = Object.entries(photoId2Love)[index], id = _a[0], loveCount = _a[1];
                        _b = itemsLoveData;
                        _c = id;
                        _d = {
                            loveCount: loveCount
                        };
                        return [4 /*yield*/ , this.useItemActions('isLoved', id)];
                    case 2:
                        _b[_c] = (_d.isLoved = _e.sent(),
                            _d);
                        _e.label = 3;
                    case 3:
                        index++;
                        return [3 /*break*/ , 1];
                    case 4:
                        this.galleryWrapper.setState({
                            itemsLoveData: itemsLoveData
                        });
                        return [2 /*return*/ ];
                }
            });
        });
    };
    ItemActionsHelper.prototype.onLoveClicked = function(eventData, origin) {
        return __awaiter(this, void 0, void 0, function() {
            var onLoveUpdated;
            var _this = this;
            return __generator(this, function(_a) {
                onLoveUpdated = function() {
                    return __awaiter(_this, void 0, void 0, function() {
                        return __generator(this, function(_a) {
                            switch (_a.label) {
                                case 0:
                                    // 2
                                    return [4 /*yield*/ , this.galleryWrapper.itemActionsHelper.handleItemActions('postLoveActivity', eventData)];
                                case 1:
                                    // 2
                                    _a.sent();
                                    return [4 /*yield*/ , this.galleryWrapper.itemActionsHelper.useItemActions('isLoved', eventData.id)];
                                case 2:
                                    // 3
                                    if (!(_a.sent())) {
                                        // check isLoved before toggleLove action
                                        // report bi event only if loved, not if unloved
                                        this.galleryWrapper.logHelper.reportBiEvent('love', eventData, origin);
                                    }
                                    // 4
                                    return [4 /*yield*/ , this.galleryWrapper.itemActionsHelper.handleItemActions('toggleLove', eventData)];
                                case 3:
                                    // 4
                                    _a.sent();
                                    return [2 /*return*/ ];
                            }
                        });
                    });
                };
                // 1 update local state
                this.galleryWrapper.onLoveClicked(eventData.id, origin, onLoveUpdated);
                return [2 /*return*/ ];
            });
        });
    };
    ItemActionsHelper.prototype.onItemFocused = function(eventData) {
        if (!this.galleryWrapper.state.accessibilityTooltipShowedOnce &&
            this.galleryWrapper.state.isAccessible &&
            !utils.isMobile()) {
            this.galleryWrapper.setState({
                showAccessibilityTooltip: true,
                accessibilityTooltipShowedOnce: true,
                accessibilityTooltipData: {
                    itemStyle: eventData.style,
                    options: eventData.options,
                    galleryScrollY: this.galleryWrapper.state.galleryScroll.y,
                    offsetLeft: eventData.offset.left,
                },
            });
        }
    };
    ItemActionsHelper.prototype.onItemLostFocus = function() {
        if (this.galleryWrapper.state.showAccessibilityTooltip) {
            this.galleryWrapper.setState({
                showAccessibilityTooltip: false
            });
        }
    };
    ItemActionsHelper.prototype.onItemActionTriggered = function(itemProps, options) {
        var itemClick = options.itemClick;
        var itemClickProps = {
            dto: this.galleryWrapper.itemsHelper
                .pgItemsProps()
                .items.find(function(item) {
                    return item.itemId === itemProps.id;
                }),
            id: itemProps.id,
            idx: itemProps.idx,
        };
        // this.onItemClicked(itemClickProps, itemClick);
        if (itemClick === 'fullscreen') {
            this.galleryWrapper.fullscreenHelper.toggleBrowserFullscreen();
            this.galleryWrapper.fullscreenHelper.animatedOpenFullscreen(itemClickProps);
        } else if (itemClick === 'expand') {
            this.galleryWrapper.fullscreenHelper.animatedOpenFullscreen(itemClickProps);
        } else if (itemClick === 'link') {
            if (typeof this.galleryWrapperProps.onLinkNavigation === 'function') {
                this.galleryWrapperProps.onLinkNavigation(itemClickProps, itemClick);
            }
        }
    };
    ItemActionsHelper.prototype.onItemClicked = function(itemProps) {
        // }, event) {
        var itemClickProps = {
            dto: this.galleryWrapper.itemsHelper
                .pgItemsProps()
                .items.find(function(item) {
                    return item.itemId === itemProps.id;
                }),
            id: itemProps.id,
            idx: itemProps.idx,
        };
        if (typeof this.galleryWrapperProps.onItemClicked === 'function') {
            this.galleryWrapperProps.onItemClicked(itemClickProps);
        }
    };
    ItemActionsHelper.prototype.onCurrentItemChanged = function(item) {
        if (typeof this.galleryWrapperProps.onCurrentItemChanged === 'function') {
            this.galleryWrapperProps.onCurrentItemChanged(item);
        }
    };
    ItemActionsHelper.prototype.onLinkNavigation = function(item) {
        var _a = item.directLink || {},
            url = _a.url,
            target = _a.target;
        var shouldUseDirectLink = !!(url && target);
        if (shouldUseDirectLink) {
            window.open(url, target);
        } else {
            var linkData = item.linkData;
            if (!linkData || !linkData.type) {
                console.error('link navigation failed due to invalid link data', linkData);
                return;
            }
            this.galleryWrapperProps.unblockScroll();
            var itemForNavigation = {
                dto: item.dto
            };
            delete itemForNavigation.createMediaUrl;
            this.galleryWrapperProps.onLinkNavigation(itemForNavigation);
        }
    };
    ItemActionsHelper.prototype.handleItemActions = function(action, actionData) {
        return __awaiter(this, void 0, void 0, function() {
            var item, _a;
            return __generator(this, function(_b) {
                switch (_b.label) {
                    case 0:
                        _a = action;
                        switch (_a) {
                            case 'share':
                                return [3 /*break*/ , 1];
                            case 'downloadTextItem':
                                return [3 /*break*/ , 3];
                            case 'postLoveActivity':
                                return [3 /*break*/ , 5];
                            case 'toggleLove':
                                return [3 /*break*/ , 7];
                        }
                        return [3 /*break*/ , 9];
                    case 1:
                        return [4 /*yield*/ , this.useItemActions('share', actionData.network, actionData.shareProps)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/ , 10];
                    case 3:
                        item = {
                            html: actionData.html,
                            style: actionData.style,
                        };
                        return [4 /*yield*/ , this.useItemActions('downloadTextItem', item)];
                    case 4:
                        _b.sent();
                        return [3 /*break*/ , 10];
                    case 5:
                        item = {
                            type: actionData.type,
                            itemId: actionData.itemId,
                            id: actionData.id,
                            idx: actionData.idx,
                            hashtag: actionData.hashtag,
                        };
                        return [4 /*yield*/ , this.useItemActions('postLoveActivity', item)];
                    case 6:
                        _b.sent();
                        return [3 /*break*/ , 10];
                    case 7:
                        return [4 /*yield*/ , this.useItemActions('toggleLove', actionData.id)];
                    case 8:
                        _b.sent();
                        return [3 /*break*/ , 10];
                    case 9:
                        return [3 /*break*/ , 10];
                    case 10:
                        return [2 /*return*/ ];
                }
            });
        });
    };
    ItemActionsHelper.prototype.reportMigratedLoveDataBiEvent = function(eventData) {
        this.galleryWrapper.logHelper.reportBiEvent('migratedLoveData', eventData);
    };
    return ItemActionsHelper;
}());
export default ItemActionsHelper;
//# sourceMappingURL=itemActionsHelper.js.map