import {
    __awaiter,
    __generator
} from "tslib";
import {
    cssScrollHelper,
    GALLERY_CONSTS
} from 'pro-gallery';
import {
    Consts,
    window
} from '@wix/photography-client-lib';
var FullscreenHelper = /** @class */ (function() {
    function FullscreenHelper(galleryWrapper, props, isStore) {
        var _this = this;
        this.fullscreenItemsProps = function() {
            var items, totalItemsCount;
            if (_this.galleryWrapper.state.fullscreen.directFullscreenItem &&
                _this.galleryWrapper.state.fullscreen.directFullscreenItem.itemId) {
                items = [_this.galleryWrapper.state.fullscreen.directFullscreenItem];
                totalItemsCount = 1;
                return {
                    items: items,
                    totalItemsCount: totalItemsCount,
                };
            } else {
                return _this.galleryWrapper.itemsHelper.pgItemsProps();
            }
        };
        this.directFullscreenItemProps = function() {
            var items, totalItemsCount, fullscreenIdx;
            if (_this.galleryWrapper.state.fullscreen.directFullscreenItem &&
                _this.galleryWrapper.state.fullscreen.directFullscreenItem.itemId) {
                items = [_this.galleryWrapper.state.fullscreen.directFullscreenItem];
                totalItemsCount = 1;
                fullscreenIdx = 0;
                return {
                    items: items,
                    totalItemsCount: totalItemsCount,
                    fullscreenIdx: fullscreenIdx,
                };
            } else {
                return {};
            }
        };
        this.galleryWrapper = galleryWrapper;
        this.galleryWrapperProps = props;
        this.isStore = isStore;
        this.update = this.update.bind(this);
        this.fullscreenItemsProps = this.fullscreenItemsProps.bind(this);
        this.updateFullscreenCurrentItem = this.updateFullscreenCurrentItem.bind(this);
        this.toggleBrowserFullscreen = this.toggleBrowserFullscreen.bind(this);
        this.getFullscreenIndex = this.getFullscreenIndex.bind(this);
        this.animatedOpenFullscreen = this.animatedOpenFullscreen.bind(this);
        this.animatedCloseFullscreen = this.animatedCloseFullscreen.bind(this);
        this.updateUrl = this.updateUrl.bind(this);
    }
    FullscreenHelper.prototype.update = function(props) {
        this.galleryWrapperProps = props;
        this.openFullscreenByProps(props);
    };
    FullscreenHelper.prototype.openFullscreenByProps = function(props) {
        if (props.clickedIdx >= 0 && props.clickedIdx !== this.clickedIdx) {
            this.clickedIdx = props.clickedIdx;
            this.animatedOpenFullscreen({
                idx: this.clickedIdx
            });
        }
    };
    FullscreenHelper.prototype.updateFullscreenCurrentItem = function(galleryItem) {
        return __awaiter(this, void 0, void 0, function() {
            var fullscreen_url, page_url, itemData;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , this.galleryWrapper.itemActionsHelper.useItemActions('getShareUrl', galleryItem)];
                    case 1:
                        fullscreen_url = _a.sent();
                        return [4 /*yield*/ , this.galleryWrapper.itemActionsHelper.useItemActions('pageUrl')];
                    case 2:
                        page_url = _a.sent();
                        itemData = {
                            item: {
                                id: galleryItem.id,
                                type: galleryItem.type,
                                title: galleryItem.title,
                                description: galleryItem.description,
                                page_url: page_url,
                                fullscreen_url: fullscreen_url,
                                image: {
                                    url: galleryItem.createUrl(GALLERY_CONSTS.urlSizes.RESIZED, GALLERY_CONSTS.urlTypes.HIGH_RES),
                                    width: galleryItem.width,
                                    height: galleryItem.height,
                                },
                                video_url: galleryItem.videoUrl ||
                                    galleryItem.createUrl(GALLERY_CONSTS.urlSizes.RESIZED, GALLERY_CONSTS.urlTypes.VIDEO),
                                thumbnail: {
                                    url: galleryItem.createUrl(GALLERY_CONSTS.urlSizes.RESIZED, GALLERY_CONSTS.urlTypes.LOW_RES),
                                    width: 250,
                                    height: 250,
                                },
                            },
                        };
                        if (typeof this.galleryWrapperProps.setMetaTags === 'function') {
                            this.galleryWrapperProps.setMetaTags(itemData);
                        }
                        if (!window.location.search.includes('&product=')) {
                            this.updateUrl(fullscreen_url);
                        }
                        return [2 /*return*/ ];
                }
            });
        });
    };
    FullscreenHelper.prototype.getQueryParamsFromCurrentUrl = function() {
        var currentUrl = window && window.location.href;
        var queryParams = {};
        if (currentUrl.includes('?')) {
            currentUrl
                .split('?')[1]
                .split('&')
                .map(function(dim) {
                    return dim.split('=');
                })
                .forEach(function(dim) {
                    queryParams[dim[0]] = isNaN(Number(dim[1])) ?
                        String(dim[1]) :
                        Number(dim[1]);
                });
        }
        return queryParams;
    };
    FullscreenHelper.prototype.canUpdateUrl = function() {
        if (this.galleryWrapper.siteHelper.parseViewMode(this.galleryWrapperProps.viewMode) !== GALLERY_CONSTS.viewMode.SITE) {
            return false;
        }
        return true;
    };
    FullscreenHelper.prototype.updateUrl = function(neededUrl) {
        if (!this.canUpdateUrl()) {
            return;
        }
        var queryParams = this.getQueryParamsFromCurrentUrl();
        // remove the last pgid, if there is one
        delete queryParams.pgid;
        // remove the last editor product id, if there is one
        delete queryParams.product;
        // build queryParams to string
        var queryPairs = [];
        for (var _i = 0, _a = Object.entries(queryParams); _i < _a.length; _i++) {
            var _b = _a[_i],
                key = _b[0],
                value = _b[1];
            queryPairs.push(key + "=" + value);
        }
        var queryString = queryPairs.join('&');
        // build the new url
        var newUrl = neededUrl +
            (queryString.length > 0 ?
                (neededUrl.includes('?') ? '&' : '?') + queryString :
                '');
        // pushState
        window.history.replaceState &&
            window.history.replaceState('Object', 'Title', newUrl);
    };
    FullscreenHelper.prototype.toggleBrowserFullscreen = function() {
        if (!window.document.fullscreenElement &&
            !window.document.mozFullScreenElement &&
            !window.document.webkitFullscreenElement &&
            !window.document.msFullscreenElement) {
            // current working methods
            if (window.document.documentElement.requestFullscreen) {
                window.document.documentElement.requestFullscreen();
            } else if (window.document.documentElement.msRequestFullscreen) {
                window.document.documentElement.msRequestFullscreen();
            } else if (window.document.documentElement.mozRequestFullScreen) {
                window.document.documentElement.mozRequestFullScreen();
            } else if (window.document.documentElement.webkitRequestFullscreen) {
                window.document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (window.document.exitFullscreen) {
                window.document.exitFullscreen();
            } else if (window.document.msExitFullscreen) {
                window.document.msExitFullscreen();
            } else if (window.document.mozCancelFullScreen) {
                window.document.mozCancelFullScreen();
            } else if (window.document.webkitExitFullscreen) {
                window.document.webkitExitFullscreen();
            }
        }
    };
    FullscreenHelper.prototype.getFullscreenIndex = function(itemProps) {
        var totalItemsCount = this.galleryWrapper.itemsHelper.pgItemsProps().totalItemsCount;
        if (itemProps.idx > 0 && totalItemsCount > 0) {
            return itemProps.idx % totalItemsCount;
        }
        return itemProps.idx;
    };
    FullscreenHelper.prototype.setGalleryWrapperFullscreenState = function(fullscreen, callback) {
        this.galleryWrapper.setState({
            fullscreen: fullscreen
        }, callback);
    };
    FullscreenHelper.prototype.animatedOpenFullscreen = function(itemProps) {
        var _this = this;
        this.galleryWrapperProps.blockScroll();
        var expandAnimation = Consts.expandAnimations.FADE_IN; // styleParams.expandAnimation
        if (expandAnimation === Consts.expandAnimations.FADE_IN) {
            var fullscreen = Object.assign({}, this.galleryWrapper.state.fullscreen, {
                fullscreenAnimating: true,
                clickedIdx: this.getFullscreenIndex(itemProps),
            });
            this.setGalleryWrapperFullscreenState(fullscreen, function() {
                var _fullscreen = Object.assign({}, _this.galleryWrapper.state.fullscreen, {
                    fullscreenAnimating: false,
                });
                _this.setGalleryWrapperFullscreenState(_fullscreen);
            });
        } else {
            var fullscreen = Object.assign({}, this.galleryWrapper.state.fullscreen, {
                fullscreenAnimating: false,
                clickedIdx: this.getFullscreenIndex(itemProps),
            });
            this.setGalleryWrapperFullscreenState(fullscreen);
        }
    };
    FullscreenHelper.prototype.animatedCloseFullscreen = function(itemIdx, animationDuration) {
        var _this = this;
        if (animationDuration === void 0) {
            animationDuration = 800;
        }
        // scroll to the item
        this.galleryWrapperProps.unblockScroll();
        var y;
        try {
            if (itemIdx >= 0) {
                var itemDto = this.galleryWrapper.itemsHelper.pgItemsProps().items[itemIdx];
                var item = {
                    id: itemDto.itemId,
                    idx: itemIdx
                };
                var itemDomId = cssScrollHelper.getSellectorDomId(item);
                var itemContainer = window.document.getElementById(itemDomId);
                var rect = itemContainer.getBoundingClientRect();
                var padding = (window.innerHeight - rect.height) / 2;
                y = window.scrollY + rect.y - padding;
                if (y >= 0) {
                    this.galleryWrapperProps.scrollTo(0, y);
                }
                itemContainer.focus();
            }
        } catch (e) {
            console.warn('Could find last fullscreen item', itemIdx, e);
        }
        var fullscreen = Object.assign({}, this.galleryWrapper.state.fullscreen, {
            fullscreenAnimating: true,
            animationDuration: animationDuration,
        });
        this.setGalleryWrapperFullscreenState(fullscreen, function() {
            return __awaiter(_this, void 0, void 0, function() {
                var _a;
                var _this = this;
                return __generator(this, function(_b) {
                    switch (_b.label) {
                        case 0:
                            setTimeout(function() {
                                var _fullscreen = Object.assign({}, _this.galleryWrapper.state.fullscreen, {
                                    directFullscreenItem: undefined,
                                    clickedIdx: -1,
                                });
                                _this.setGalleryWrapperFullscreenState(_fullscreen);
                            }, animationDuration);
                            if (typeof this.galleryWrapperProps.setMetaTags === 'function') {
                                this.galleryWrapperProps.setMetaTags({});
                            }
                            _a = this.updateUrl;
                            return [4 /*yield*/ , this.galleryWrapper.itemActionsHelper.useItemActions('pageUrl')];
                        case 1:
                            _a.apply(this, [_b.sent()]);
                            return [2 /*return*/ ];
                    }
                });
            });
        });
    };
    return FullscreenHelper;
}());
export default FullscreenHelper;
//# sourceMappingURL=fullscreenHelper.js.map