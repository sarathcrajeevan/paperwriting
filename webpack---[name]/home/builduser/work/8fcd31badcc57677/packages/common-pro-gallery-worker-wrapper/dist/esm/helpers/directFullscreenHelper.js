import {
    __awaiter,
    __generator
} from "tslib";
var directFullscreenHelper = /** @class */ (function() {
    function directFullscreenHelper() {}
    // constructor() {}
    directFullscreenHelper.prototype.getDirectFullscreenFromParams = function(queryParams) {
        var fullscreenParam = queryParams && queryParams.pgid;
        if (fullscreenParam) {
            var _a = fullscreenParam.includes('_') ?
                fullscreenParam.split('_') :
                fullscreenParam.split(/-(.+)/),
                galleryIdent = _a[0],
                itemId = _a[1];
            return {
                galleryIdent: galleryIdent,
                itemId: itemId
            };
        } else {
            return false;
        }
    };
    directFullscreenHelper.prototype.getDirectFullscreenItemFromItemsList = function(queryParams, items, compId, fetcher) {
        return __awaiter(this, void 0, void 0, function() {
            var directfullscreenParams;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        directfullscreenParams = this.getDirectFullscreenFromParams(queryParams);
                        if (!directfullscreenParams || !items) {
                            return [2 /*return*/ , undefined];
                        }
                        if (!!compId.includes(directfullscreenParams.galleryIdent)) return [3 /*break*/ , 3];
                        if (!!fetcher.galleryId) return [3 /*break*/ , 2];
                        // if the galleryId is not yet populated
                        return [4 /*yield*/ , fetcher.fetchGalleryId()];
                    case 1:
                        // if the galleryId is not yet populated
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (fetcher.galleryId !== directfullscreenParams.galleryIdent) {
                            // try to match the gallery's galleryId
                            return [2 /*return*/ , undefined];
                        }
                        _a.label = 3;
                    case 3:
                        return [2 /*return*/ , items[items.findIndex(function(item) {
                            return item.itemId === directfullscreenParams.itemId &&
                                !item.metaData.isVideoPlaceholder;
                        })]];
                }
            });
        });
    };
    directFullscreenHelper.prototype.loadDirectFullscreen = function(compId, galleryId, queryParams, proGalleryStore) {
        var directfullscreenParams = this.getDirectFullscreenFromParams(queryParams);
        if (directfullscreenParams) {
            if (compId.includes(directfullscreenParams.galleryIdent)) {
                proGalleryStore.loadDirectFullscreenItem(directfullscreenParams.itemId);
                proGalleryStore.createDirectFullscreenBlueprintMockIfNeeded();
            } else if (proGalleryStore.isValidUUID(directfullscreenParams.galleryIdent) // if a galleryId was used to identify the gallery
            ) {
                proGalleryStore.loadDirectFullscreenItem(directfullscreenParams.itemId, directfullscreenParams.galleryIdent);
                proGalleryStore.createDirectFullscreenBlueprintMockIfNeeded();
            } else {
                proGalleryStore.directFullscreenReadyDeferred.resolve();
            }
        } else {
            proGalleryStore.directFullscreenReadyDeferred.resolve();
        }
    };
    directFullscreenHelper.prototype.setMetaTagsForItemIfNeeded = function(props, item) {
        var isInSEO = props.isInSEO;
        if (item && isInSEO) {
            var type = 'image'; // TODO - connect the real deal. could be galleryItem.js L1035 - and understand how it matters? maybe i dont need this one.
            var dto = item.metaData;
            props.setMetaTags && props.setMetaTags(type, dto);
        }
    };
    return directFullscreenHelper;
}());
export default new directFullscreenHelper();
//# sourceMappingURL=directFullscreenHelper.js.map