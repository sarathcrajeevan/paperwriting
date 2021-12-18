import {
    renderUtils
} from './renderUtils';
import _ from 'lodash';
import window from '../sdk/windowWrapper';
import {
    GALLERY_CONSTS
} from 'pro-gallery-lib';
var TPADimensionsHelper = /** @class */ (function() {
    function TPADimensionsHelper() {
        this.lastHeight = undefined;
        this.lastOffsetTop = undefined;
        this.lastInfiniteScroll = undefined;
        this.lastIsHorizontal = undefined;
        this.setWixHeight = this.setWixHeight.bind(this);
        this.protectGalleryWidth = this.protectGalleryWidth.bind(this);
        this.protectGalleryHeight = this.protectGalleryHeight.bind(this);
    }
    /// / ---------------------------------- utils --------------------------------------- ////
    // TODO - this is a duplicate of the renderUtils function, should use only one
    TPADimensionsHelper.prototype.getViewportScaleRatio = function() {
        // 320 is a hack for wix - they have fixed viewport of 320 pixels regardlessof phone type
        var isGallery = typeof window !== 'undefined' && window.isGallery;
        var shouldIgnoreRatio = renderUtils.shouldDebug('ignoreScaleRatio') ||
            (renderUtils.isiOS() && isGallery); // PHOT 917, this is a hack to get galleries back to their normal placement on iOS, w/o this galleries on iOS are smaller by the ratio returned here.
        if (renderUtils.isMobile() &&
            !renderUtils.isMobileViewer() &&
            renderUtils.isSite() &&
            !shouldIgnoreRatio) {
            return 320 / renderUtils.getScreenWidth();
        } else {
            return 1;
        }
    };
    /// / ------------------------------- protections ------------------------------------////
    TPADimensionsHelper.prototype.protectGalleryWidth = function(width) {
        var maxGalleryWidth;
        if (renderUtils.isSite()) {
            maxGalleryWidth = Number(renderUtils.parseGetParam('width'));
        }
        if (renderUtils.browserIs('chromeIos')) {
            // This can be the width calc for all galleries, but in chromeIos it must be used otherwise there is a gap on the left of the gallery.
            // Currently there is a bug with Mitzi that the width parmeter is not updating fast enough once it is fixed, use this code always.
            maxGalleryWidth = maxGalleryWidth || document.body.clientWidth;
        } else {
            maxGalleryWidth = document.body.clientWidth;
        }
        if (renderUtils.isMobile()) {
            maxGalleryWidth = Math.floor(maxGalleryWidth / this.getViewportScaleRatio());
        }
        return Math.min(Math.floor(width), maxGalleryWidth);
    };
    TPADimensionsHelper.prototype.protectGalleryHeight = function(height, offsetTop) {
        if (offsetTop === void 0) {
            offsetTop = 0;
        }
        var galleryHeight = Math.floor(height - offsetTop);
        // if (renderUtils.isMobile() && !renderUtils.isiOS()) {
        // 	galleryHeight = Math.floor(galleryHeight / getViewportScaleRatio());
        // }
        return galleryHeight;
    };
    /// / ------------------------------ set Wix Height --------------------------------- ////
    TPADimensionsHelper.prototype.setWixHeight = function(_a) {
        var _this = this;
        var height = _a.height,
            _b = _a.offsetTop,
            offsetTop = _b === void 0 ? 0 : _b,
            styleParams = _a.styleParams,
            container = _a.container,
            numOfItems = _a.numOfItems,
            isInfinite = _a.isInfinite,
            updatedHeight = _a.updatedHeight,
            setHeightImp = _a.setHeightImp,
            viewMode = _a.viewMode,
            clearHeight = _a.clearHeight;
        if (viewMode) {
            renderUtils.updateViewMode(viewMode);
        }
        var getMaxRowHeight = function() {
            var maxByScreen = function() {
                return window.screen.height * 0.6;
            }; // make sure that the gallery is not heigher than the screen
            var addLayoutHeight = function() {
                return (GALLERY_CONSTS.isLayout('SLIDESHOW')(styleParams) ?
                        styleParams.slideshowInfoSize || 200 :
                        0) +
                    (styleParams.hasThumbnails && ['top', 'bottom'].indexOf(styleParams.galleryThumbnailsAlignment) >= 0 ?
                        styleParams.thumbnailSize || 120 :
                        0);
            };
            var addRatioFix = function() {
                return Number(GALLERY_CONSTS.isLayout('SLIDER')(styleParams) ? 0.85 : 1);
            }; // for Slider you want to make sure some of the 2nd picture is showing
            var maxForHorizontal = function() {
                return ((container.galleryWidth * 9) / 16 + addLayoutHeight()) *
                    addRatioFix() +
                    offsetTop;
            }; // in slideshow and thumbnails, the group ratio is calculated by the height so we need a fixed value
            var maxForEmpty = 390;
            if (numOfItems === 0) {
                return maxForEmpty;
            }
            if (styleParams.isInAdi) {
                var adiLoadMoreMaxHeight = void 0;
                var adiHorizontalHeight = void 0;
                var isMobile = renderUtils.isMobile();
                if (isMobile) {
                    adiLoadMoreMaxHeight = 700;
                    adiHorizontalHeight = 300;
                } else {
                    adiLoadMoreMaxHeight = 2000;
                    adiHorizontalHeight = 600;
                }
                if (styleParams.scrollDirection ===
                    GALLERY_CONSTS.scrollDirection.VERTICAL &&
                    !styleParams.enableInfiniteScroll) {
                    return Math.min(height, adiLoadMoreMaxHeight);
                } else if (styleParams.scrollDirection ===
                    GALLERY_CONSTS.scrollDirection.HORIZONTAL) {
                    return adiHorizontalHeight;
                }
            } else if (styleParams.scrollDirection ===
                GALLERY_CONSTS.scrollDirection.HORIZONTAL) {
                return Math.min(maxByScreen(), maxForHorizontal());
            } else if (!isInfinite) {
                return maxByScreen();
            } else {
                return false;
            }
        };
        var getNeededHeight = function(requestedHeight) {
            var newHeight = Math.round(requestedHeight * _this.getViewportScaleRatio());
            var should = false;
            if (isInfinite) {
                should = true;
            }
            if (updatedHeight) {
                should = true;
                newHeight = Math.min(updatedHeight, requestedHeight);
            }
            var maxRowHeight = getMaxRowHeight();
            if ((renderUtils.isEditor() || renderUtils.isInAlbumsBuilder()) &&
                maxRowHeight) {
                if (styleParams.isInAdi) {
                    newHeight = maxRowHeight;
                    should = true;
                } else if (styleParams.scrollDirection ===
                    GALLERY_CONSTS.scrollDirection.HORIZONTAL ||
                    (styleParams.scrollDirection ===
                        GALLERY_CONSTS.scrollDirection.VERTICAL &&
                        !isInfinite)) {
                    // when the layout changes, if the new layout is horizontal or with the show more button, adjust the height
                    should = false;
                    if (newHeight > maxRowHeight || renderUtils.isInAlbumsBuilder()) {
                        // only reduce the size of the gallery
                        newHeight = maxRowHeight;
                        should = true;
                    }
                }
            }
            return should && newHeight;
        };
        var finalSetHeight = function(neededHeight, lastHeight) {
            if (neededHeight) {
                if (renderUtils.isVerbose()) {
                    console.log('updating height', neededHeight);
                }
                if (Math.abs(lastHeight - neededHeight) < 6 || neededHeight === 0) {
                    if (renderUtils.isVerbose()) {
                        console.log('Skipping Wix height change: was too small ' +
                            lastHeight +
                            ", now it's " +
                            neededHeight);
                    }
                    return lastHeight;
                } else {
                    if (renderUtils.isVerbose()) {
                        console.warn('Changing wix height from: ' +
                            lastHeight +
                            '  to: ' +
                            neededHeight);
                    }
                    setHeightImp(Math.round(neededHeight));
                }
            }
            return neededHeight;
        };
        var updateLastValues = function() {
            _this.lastOffsetTop = offsetTop;
            _this.lastInfiniteScroll = styleParams.enableInfiniteScroll;
            _this.lastIsHorizontal =
                styleParams.scrollDirection ===
                GALLERY_CONSTS.scrollDirection.HORIZONTAL;
        };
        var clearHeightIfNeeded = function(isResponsive, isChangedLayout, allowHeightChangeOnNewLayout) {
            // in responsive Galleries  -  if the layout was changed to horizontal we need to clearHeight() that we setHeight() before.
            if (isResponsive && isChangedLayout && allowHeightChangeOnNewLayout) {
                if (typeof clearHeight === 'function') {
                    _this.lastHeight = 0; // to leave a clean slate for the next layout changes in responsive. (otherwise it stays as the last layout and if changed back to it wont refresh ...change < 6 in finalSetHeight)
                    clearHeight();
                } else {
                    console.warn('trying to clearHeight() for responsive gallery, clearHeight is not a function');
                }
            }
        };
        var shouldSetHeight = function() {
            var isInAdi = !!styleParams.isInAdi;
            var isFirstLoad = _.isUndefined(_this.lastIsHorizontal);
            var currentIsHorizontal = styleParams.scrollDirection ===
                GALLERY_CONSTS.scrollDirection.HORIZONTAL;
            var scrollDirectionChanged = currentIsHorizontal !== _this.lastIsHorizontal;
            var infiniteScrollChanged = styleParams.enableInfiniteScroll !== _this.lastInfiniteScroll;
            var allowHeightChangeOnNewLayout = !isFirstLoad || isInAdi; // do not change height on the first load in the editor - allow the gallery to fit itself first
            var isChangedLayout = scrollDirectionChanged || infiniteScrollChanged;
            var isResponsive = !!styleParams.responsive;
            // galleries should call set height after changing from infinite to horizontal. but not in responsive.
            var shouldSetOnLayoutChangeToHorizontal = !isInfinite &&
                !isResponsive &&
                isChangedLayout &&
                allowHeightChangeOnNewLayout;
            var should = isInfinite || updatedHeight || shouldSetOnLayoutChangeToHorizontal;
            if (!should) {
                // call clearHeight  - for responsive galleries (clearHeight will remove the previous setHeight request)
                clearHeightIfNeeded.call(_this, isResponsive, isChangedLayout, allowHeightChangeOnNewLayout);
            }
            updateLastValues.call(_this);
            return should;
        };
        if (height <= 0) {
            console.warn('Wix setHeight called with height less than 0');
            return;
        }
        if (shouldSetHeight.call(this)) {
            height = Math.round(height + offsetTop);
            var lastHeight = Math.round(this.lastHeight + this.lastOffsetTop);
            var finalHeight = getNeededHeight.call(this, height);
            this.lastHeight = finalHeight;
            var newHeight = finalSetHeight(finalHeight, lastHeight);
            updateLastValues.call(this);
            return newHeight;
        }
        return this.lastHeight;
    };
    return TPADimensionsHelper;
}());
export default new TPADimensionsHelper();
//# sourceMappingURL=TPADimensionsHelper.js.map