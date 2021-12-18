import {
    __assign,
    __awaiter,
    __generator
} from "tslib";
import React from 'react';
import {
    GALLERY_CONSTS
} from 'pro-gallery-lib';
import {
    utils
} from '../utils/webUtils';
import {
    experimentsWrapper
} from '@wix/photography-client-lib';
import {
    EXTERNAL_INFO_TYPE,
    TextInfoElement,
} from '@wix/pro-gallery-info-element';
var Deferred = /** @class */ (function() {
    function Deferred() {
        var _this = this;
        this.promise = new Promise(function(resolve, reject) {
            _this.reject = reject;
            _this.resolve = resolve;
        });
    }
    return Deferred;
}());
var ItemsHelper = /** @class */ (function() {
    function ItemsHelper(galleryWrapper, props, isStoreGallery) {
        var _this = this;
        this.hoverInfoElement = function(pgItemProps) {
            _this.fetchItemMetadata(pgItemProps);
            return _this.renderInfoElement(EXTERNAL_INFO_TYPE.HOVER, pgItemProps);
        };
        this.externalInfoElement = function(pgItemProps) {
            return _this.renderInfoElement(EXTERNAL_INFO_TYPE.EXTERNAL, pgItemProps);
        };
        this.slideshowInfoElement = function(pgItemProps) {
            _this.fetchItemMetadata(pgItemProps);
            return _this.renderInfoElement(EXTERNAL_INFO_TYPE.SLIDESHOW, pgItemProps);
        };
        this.galleryWrapper = galleryWrapper;
        this.galleryWrapperProps = props;
        this.isStoreGallery = isStoreGallery;
        this.update = this.update.bind(this);
        this.customImageRenderer = this.customImageRenderer.bind(this);
        this.pgItemsProps = this.pgItemsProps.bind(this);
        this.areOneOrMoreItemsCorrupted =
            this.areOneOrMoreItemsCorrupted.bind(this);
        this.getMoreItems = this.getMoreItems.bind(this);
        this.processPgItemPropsForInfoElement =
            this.processPgItemPropsForInfoElement.bind(this);
        this.getCustomComponents = this.getCustomComponents.bind(this);
        this.getMoreItemsCalled = false;
        this.itemsDimensions = {};
        this.preloadedItems = {};
        this.itemDimensionsCache = {};
    }
    ItemsHelper.prototype.isFreeArtStore = function() {
        var additionalProviderParams = this.galleryWrapperProps.additionalProviderParams;
        return (additionalProviderParams && additionalProviderParams.freeArtStore === true);
    };
    ItemsHelper.prototype.canDownloadHighResolution = function() {
        var additionalProviderParams = this.galleryWrapperProps.additionalProviderParams;
        return (additionalProviderParams &&
            additionalProviderParams.canDownloadHighResolution);
    };
    ItemsHelper.prototype.getCustomDownloadUrlFuncIfNeeded = function() {
        var _this = this;
        if (this.isStoreGallery && this.canDownloadHighResolution()) {
            return function(mediaUrl, itemId) {
                return __awaiter(_this, void 0, void 0, function() {
                    var _a, galleryId, srcId, url, response, data;
                    return __generator(this, function(_b) {
                        switch (_b.label) {
                            case 0:
                                _a = this.galleryWrapperProps, galleryId = _a.galleryId, srcId = _a.additionalProviderParams.srcId;
                                url = "https://www.wix.com/_api/albums-node-server/getSecuredFileUrl?galleryId=" + galleryId + "&instanceId=" + srcId + "&itemId=" + itemId + "&mediaUrl=" + mediaUrl;
                                return [4 /*yield*/ , fetch(url, {
                                    method: 'GET'
                                })];
                            case 1:
                                response = _b.sent();
                                return [4 /*yield*/ , response.json()];
                            case 2:
                                data = _b.sent();
                                return [2 /*return*/ , data[0].path];
                        }
                    });
                });
            };
        } else {
            return undefined;
        }
    };
    ItemsHelper.prototype.update = function(props) {
        this.galleryWrapperProps = props;
    };
    ItemsHelper.prototype.pgItemsProps = function() {
        return {
            items: this.galleryWrapperProps.items,
            totalItemsCount: this.galleryWrapperProps.totalItemsCount,
        };
    };
    ItemsHelper.prototype.areOneOrMoreItemsCorrupted = function(items) {
        return items.some(this.isInvalidItem);
    };
    ItemsHelper.prototype.isInvalidItem = function(item) {
        // for future validations add more conditions
        var containsItemId = item.itemId === undefined;
        return containsItemId;
    };
    ItemsHelper.prototype.getMoreItems = function(from) {
        if (this.galleryWrapperProps.getMoreItems) {
            this.getMoreItemsCalled = true;
            this.galleryWrapperProps.getMoreItems(from);
        }
    };
    // getInitialItemsEstimation(pgStyles) { //TODO - this code should move to somewhere in the worker.
    //   const min = 5;
    //   const max = 50;
    //   let numOfCols = 1;
    //   let numOfRows = 1;
    //   const isMobile =
    //     this.galleryWrapper.deviceType === GALLERY_CONSTS.deviceType.MOBILE;
    //   switch (pgStyles.galleryLayout) {
    //     // Adaptive layouts / Vertical only layouts
    //     case -1: // EMPTY: -1
    //     case 1: // MASONRY: 1
    //     case 6: // PANORAMA: 6
    //     case 8: // MAGIC: 8
    //     case 10: // BRICKS: 10
    //     case 11: // MIX: 11
    //     case 12: // ALTERNATE: 12
    //       // pgStyles.scrollDirection = GALLERY_CONSTS.scrollDirection.VERTICAL;
    //       numOfRows = 4;
    //       numOfCols =
    //         (pgStyles.gridStyle !== 0 && pgStyles.numberOfImagesPerRow) ||
    //         (isMobile ? 1 : 5);
    //       break;
    //     case 0: // COLLAGE: 0,
    //     case 2: // GRID: 2,
    //       const scrollDirection =
    //         pgStyles.scrollDirection === undefined
    //           ? GALLERY_CONSTS.scrollDirection.VERTICAL
    //           : pgStyles.scrollDirection;
    //       if (scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL) {
    //         numOfRows = 5;
    //         numOfCols =
    //           (pgStyles.gridStyle !== 0 && pgStyles.numberOfImagesPerRow) ||
    //           (isMobile ? 1 : 5);
    //       } else {
    //         numOfRows = pgStyles.numberOfImagesPerCol || 4;
    //         numOfCols = 10;
    //       }
    //       break;
    //     // Horizontal only layouts
    //     case 3: // THUMBNAIL: 3
    //       numOfCols = isMobile ? 5 : 20;
    //       break;
    //     case 4: // SLIDER: 4
    //       numOfCols = 6;
    //       break;
    //     case 5: // SLIDESHOW: 5
    //       break;
    //     case 7: // COLUMN: 7
    //       numOfCols = 10;
    //       break;
    //     case 9: // FULLSIZE: 9
    //       break;
    //     default:
    //       // pgStyles.scrollDirection = GALLERY_CONSTS.scrollDirection.VERTICAL;
    //       numOfCols = 5;
    //       numOfRows = 5;
    //       break;
    //   }
    //   const res = numOfRows * numOfCols;
    //   return res < min ? min : res > max ? max : res;
    // }
    ItemsHelper.prototype.processPgItemPropsForInfoElement = function(infoType, pgItemProps) {
        var wrapperProps = {
            viewMode: this.galleryWrapper.siteHelper.parseViewMode(this.galleryWrapperProps.viewMode),
            eventsListener: this.galleryWrapper.syncEventHandler.eventHandler,
            infoType: infoType,
            shouldUseNewSocialSharePopup: this.shouldUseNewSocialSharePopup,
        };
        var itemLoveData = __assign({}, this.galleryWrapper.state.itemsLoveData[pgItemProps.id]);
        return __assign(__assign(__assign(__assign({}, pgItemProps), wrapperProps), itemLoveData), {
            customDownloadUrl: this.getCustomDownloadUrlFuncIfNeeded()
        });
    };
    ItemsHelper.prototype.shouldTextBeOnRequestedInfoType = function(requestedInfoType, titlePlacement, isSlideshow) {
        switch (requestedInfoType) {
            case EXTERNAL_INFO_TYPE.HOVER:
                return GALLERY_CONSTS.hasHoverPlacement(titlePlacement);
            case EXTERNAL_INFO_TYPE.SLIDESHOW:
                return isSlideshow;
            case EXTERNAL_INFO_TYPE.EXTERNAL:
                return (GALLERY_CONSTS.hasExternalVerticalPlacement(titlePlacement) ||
                    GALLERY_CONSTS.hasExternalHorizontalPlacement(titlePlacement));
            default:
                return true;
        }
    };
    ItemsHelper.prototype.fetchInfoElementIfNeeded = function() {
        var _this = this;
        if (utils.isSSR()) {
            return;
        }
        if (!this.infoElement && !this.fetchingInfoElement) {
            this.fetchingInfoElement = true;
            import (
                /* webpackChunkName: "ProGalleryInfoElement" */
                '@wix/pro-gallery-info-element').then(function(module) {
                _this.fetchingInfoElement = false;
                var InfoElement = module.InfoElement;
                _this.infoElement = InfoElement;
            });
        }
    };
    ItemsHelper.prototype.initItemActionsIfNeeded = function(pgItemProps) {
        return __awaiter(this, void 0, void 0, function() {
            var ex_1;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!pgItemProps.options.loveButton) return [3 /*break*/ , 2];
                        return [4 /*yield*/ , this.galleryWrapper.itemActionsHelper.getAndInitItemActionsIfNeeded()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        return [3 /*break*/ , 4];
                    case 3:
                        ex_1 = _a.sent();
                        return [3 /*break*/ , 4];
                    case 4:
                        return [2 /*return*/ ];
                }
            });
        });
    };
    ItemsHelper.prototype.renderInfoElement = function(type, pgItemProps) {
        var InfoElement = this.infoElement ||
            (this.shouldTextBeOnRequestedInfoType(type, pgItemProps.options.titlePlacement, GALLERY_CONSTS.isLayout('SLIDESHOW')(pgItemProps.options)) ?
                TextInfoElement :
                null);
        return (InfoElement && (React.createElement(InfoElement, __assign({}, this.processPgItemPropsForInfoElement(type, pgItemProps)))));
    };
    ItemsHelper.prototype.customImageRenderer = function(props) {
        var originalSource = function(src) {
            if (src.indexOf('.webp') > 0) {
                if (src.indexOf('.png') > 0) {
                    return (React.createElement("source", {
                        srcSet: src.replace('webp', 'png'),
                        type: "image/png"
                    }));
                } else if (src.indexOf('.jpg') > 0 || src.indexOf('.jpeg') > 0) {
                    return (React.createElement("source", {
                        srcSet: src.replace('webp', 'jpeg'),
                        type: "image/jpeg"
                    }));
                } else {
                    return null;
                }
            } else {
                return null;
            }
        };
        var webpSource = function(src) {
            if (src.match(/\.\w{3,4}\/v\d\/\w*\//)) {
                // only change resized urls
                return (React.createElement("source", {
                    srcSet: src.replace(/(jpg|jpeg|png)$/, 'webp'),
                    type: "image/webp"
                }));
            }
        };
        if (typeof props.src === 'string') {
            return (React.createElement("picture", {
                    key: "picture_" + props.id
                },
                webpSource(props.src),
                originalSource(props.src),
                React.createElement("img", __assign({
                    alt: props.alt
                }, props))));
        } else if (typeof props.src === 'object') {
            return (React.createElement("picture", {
                    key: "multi_picture_" + props.id
                },
                props.src.map(function(src) {
                    return (React.createElement("source", {
                        srcSet: src.dpr || src.url,
                        type: "image/" + src.type
                    }));
                }),
                React.createElement("img", __assign({
                    alt: props.alt
                }, props, {
                    src: props.src[props.src.length - 1].url
                }))));
        }
    };
    ItemsHelper.prototype.fetchItemMetadata = function(pgItemProps) {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        this.getSocialShareExpriment();
                        this.fetchInfoElementIfNeeded();
                        return [4 /*yield*/ , this.initItemActionsIfNeeded(pgItemProps)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/ ];
                }
            });
        });
    };
    ItemsHelper.prototype.getSocialShareExpriment = function() {
        if (!this.alreadyGotExperimentStatus) {
            this.shouldUseNewSocialSharePopup =
                experimentsWrapper.getExperimentBoolean('specs.pro-gallery.useNewSocialSharePopup');
            this.alreadyGotExperimentStatus = true;
        }
    };
    ItemsHelper.prototype.shouldUsePictureElement = function() {
        return ((this.galleryWrapperProps.queryParams &&
                this.galleryWrapperProps.queryParams.usePictureElement === 'true') ||
            experimentsWrapper.getExperimentBoolean('specs.pro-gallery.usePictureElement'));
    };
    ItemsHelper.prototype.getCustomComponents = function() {
        return __assign({
            customHoverRenderer: this.hoverInfoElement,
            customInfoRenderer: this.externalInfoElement,
            customSlideshowInfoRenderer: this.slideshowInfoElement
        }, (this.shouldUsePictureElement() && {
            customImageRenderer: this.customImageRenderer,
        }));
    };
    ItemsHelper.prototype.isDimensionless = function(item) {
        var metaData = item.metaData || item.metadata;
        try {
            if (!metaData.height || !metaData.width) {
                return true;
            }
            if (metaData.height <= 1 || metaData.width <= 1) {
                return true;
            }
        } catch (e) {
            console.error('corrupt item, cant check for dimensions', item, e);
        }
        return false;
    };
    ItemsHelper.prototype.preloadItem = function(item, onload) {
        if (!item || !item.itemId || !item.mediaUrl) {
            return;
        }
        try {
            var id = item.itemId;
            if (this.itemsDimensions[id]) {
                return; // already measured
            }
            if (typeof this.preloadedItems[id] !== 'undefined') {
                return;
            }
            this.preloadedItems[id] = new Image();
            if (utils.isVerbose()) {
                console.log('Preloading item #' + item);
            }
            this.preloadedItems[id].src = item.mediaUrl;
            if (typeof onload === 'function') {
                this.preloadedItems[id].onload = function(e) {
                    onload(e);
                };
            }
            return this.preloadedItems[id];
        } catch (e) {
            console.error('Could not preload item', item, e);
            return;
        }
    };
    ItemsHelper.prototype.addSentDimensionsToCache = function(itemDimensions) {
        var _this = this;
        itemDimensions.forEach(function(dimensions) {
            _this.itemDimensionsCache[dimensions.mediaUrl] = dimensions;
        });
    };
    ItemsHelper.prototype.loadItemsDimensionsIfNeeded = function() {
        var _this = this;
        if (utils.isSSR()) {
            return;
        }
        if (!(this.galleryWrapperProps.items &&
                this.galleryWrapperProps.items.length > 0)) {
            return;
        }
        var items = this.galleryWrapperProps.items;
        var itemsWithoutDimensions = items.filter(function(item) {
            try {
                return (!_this.itemDimensionsCache[item.mediaUrl] && _this.isDimensionless(item) // if this was already measured and sent to the worker (might not be present yet on items)
                );
            } catch (e) {
                return false;
            }
        });
        if (!itemsWithoutDimensions.length) {
            return;
        }
        var itemPromises = itemsWithoutDimensions.map(function() {
            return new Deferred();
        });
        itemsWithoutDimensions.forEach(function(item, idx) {
            var itemPromise = itemPromises[idx];
            _this.preloadItem(item, function(e) {
                try {
                    if (utils.isVerbose()) {
                        console.log('item loaded event', e);
                    }
                    var ele = e.srcElement;
                    var itemId = item.itemId;
                    var mediaUrl = item.mediaUrl;
                    var itemDim = {
                        width: ele.width,
                        height: ele.height,
                        measured: true,
                        itemId: itemId,
                        mediaUrl: mediaUrl,
                    };
                    _this.itemsDimensions[itemId] = itemDim;
                    itemPromise.resolve(_this.itemsDimensions[itemId]);
                } catch (_e) {
                    console.error('Could not calc element dimensions', _e);
                }
            });
        });
        Promise.all(itemPromises.map(function(deffered) {
            return deffered.promise;
        })).then(function(itemDimensions) {
            _this.galleryWrapper.clientSideFunctionsConnectedPromise.promise.then(function() {
                // This makes sure we are not calling worker functions before they were set in the client side worker
                _this.galleryWrapperProps.onItemDimensionsMeasure(itemDimensions);
                _this.addSentDimensionsToCache(itemDimensions);
            });
        });
    };
    return ItemsHelper;
}());
export default ItemsHelper;
//# sourceMappingURL=itemsHelper.js.map