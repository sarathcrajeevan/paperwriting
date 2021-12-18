import {
    __assign
} from "tslib";
import {
    utils
} from '../utils/webUtils';
import {
    window
} from '@wix/photography-client-lib';
import ResizeObserver from 'resize-observer-polyfill';
import {
    GALLERY_CONSTS
} from 'pro-gallery';
import {
    VIEWER_SELECTOR
} from '../constants/constants';
var DimensionsHelper = /** @class */ (function() {
    function DimensionsHelper(parent) {
        this.debouncedMeasureContainer = utils.debounce(this.measureContainer.bind(this), 500);
        this.container = {};
        this.id = parent.props.id || '';
        this._cache = {};
        this.lastPropsJson = '';
        this.parent = parent;
        this.dimensions = {};
        this.componentDimensionsReady = false;
    }
    DimensionsHelper.prototype.getOrPutInCache = function(field, createValue) {
        if (this._cache[field])
            return this._cache[field];
        this._cache[field] = createValue();
        return this._cache[field];
    };
    DimensionsHelper.prototype.dumpCache = function(field) {
        if (field) {
            this._cache[field] = undefined;
        } else {
            this._cache = {};
        }
    };
    DimensionsHelper.prototype.update = function(props) {
        var dimensions = props.dimensions,
            id = props.id;
        var propsJson = JSON.stringify({
            dimensions: dimensions,
            id: id
        });
        if (this.lastPropsJson !== propsJson) {
            this.lastPropsJson = propsJson;
            this.id = id || this.id;
            this.measureContainer();
            this.BOLT_SUPPORTING_FUNCTION_updateWorkerWithHostDimensions(props);
        }
        this.observeResize();
        this.observeIntersection();
    };
    DimensionsHelper.prototype.BOLT_SUPPORTING_FUNCTION_updateWorkerWithHostDimensions = function(props) {
        var _this = this;
        var _a;
        if (props.viewerName !== 'thunderbolt') {
            var hostDimensions_1 = (_a = props.host) === null || _a === void 0 ? void 0 : _a.dimensions;
            this.parent.clientSideFunctionsConnectedPromise.promise.then(function() {
                // This makes sure we are not calling worker functions before they were set in the client side worker
                _this.parent.props.BOLT_SUPPORTING_FUNCTION_onNewHostDimensions(hostDimensions_1);
            });
        }
    };
    DimensionsHelper.prototype.createResizeObserver = function() {
        var _this = this;
        this.resizeObserver = new ResizeObserver(function() {
            _this.debouncedMeasureContainer();
        });
        this.observeResize();
    };
    DimensionsHelper.prototype.observeResize = function() {
        if (this.observingResize || !this.resizeObserver) {
            return;
        }
        var galleryWrapperElement = window.document.getElementById("gallery-wrapper-" + this.id);
        if (galleryWrapperElement) {
            this.observingResize = true;
            this.resizeObserver.observe(galleryWrapperElement);
        }
    };
    DimensionsHelper.prototype.removeListeners = function() {
        this.resizeObserver && this.resizeObserver.disconnect();
        this.intersectionObserver && this.intersectionObserver.disconnect();
        this.observingResize = false;
        this.observingIntersection = false;
    };
    DimensionsHelper.prototype.createIntersectionObserver = function() {
        var _this = this;
        if (utils.isSSR()) {
            return;
        }
        // import of intersection-observer breaks SSR!!!
        if (typeof window.IntersectionObserver === 'function') {
            // Export existing IntersectionObservers' implementation.
            IntersectionObserver = window.IntersectionObserver;
            this.initIntersectionObserver();
        } else {
            // Export polyfill.
            import (
                /* webpackChunkName: "intersection-observer" */
                'intersection-observer').then(function() {
                _this.initIntersectionObserver();
            });
        }
    };
    DimensionsHelper.prototype.initIntersectionObserver = function() {
        var _this = this;
        this.intersectionObserver = new IntersectionObserver(function(entries) {
            var entry = entries.length > 0 && entries[0];
            if (entry && entry.boundingClientRect) {
                var newWrapperBoundingRectY = entry.boundingClientRect.y;
                if (_this.wrapperBoundingRectY !== newWrapperBoundingRectY) {
                    _this.measureScrollBase(newWrapperBoundingRectY);
                }
            }
        });
        this.observeIntersection();
    };
    DimensionsHelper.prototype.observeIntersection = function() {
        if (this.observingIntersection || !this.intersectionObserver) {
            return;
        }
        try {
            var galleryWrapperElement = window.document.getElementById("gallery-wrapper-" + this.id);
            if (galleryWrapperElement) {
                this.observingIntersection = true;
                this.intersectionObserver.observe(galleryWrapperElement);
            }
        } catch (e) {
            console.error('dimensionsHelper -> observeIntersection,', e);
        }
    };
    DimensionsHelper.prototype.measureContainer = function() {
        this.dumpCache();
        this.container = this.getMeasuredContainer() || this.container;
        var dimensions = __assign(__assign(__assign(__assign({}, this.getGalleryDimensions()), this.getScrollBase()), this.getScreenDimensions()), (this.isPreview() ? this.getMobilePreviewFrameDimensions() : {}));
        if (JSON.stringify(dimensions) !== JSON.stringify(this.dimensions)) {
            this.setDimensions(dimensions);
            this.notifyWorkerOnDimensionsReady();
        }
    };
    DimensionsHelper.prototype.notifyWorkerOnDimensionsReady = function() {
        var _this = this;
        if (!this.componentDimensionsReady) {
            return;
        }
        var newDimensions = Object.assign({}, this.getDimensions());
        delete newDimensions.scrollBase;
        this.parent.clientSideFunctionsConnectedPromise.promise.then(function() {
            // This makes sure we are not calling worker functions before they were set in the client side worker
            _this.parent.props.onDimensionsReady(newDimensions);
        });
    };
    DimensionsHelper.prototype.measureScrollBase = function(newWrapperBoundingRectY) {
        this.dumpCache('scrollBase');
        this.dumpCache('bodyBoundingRect');
        var scrollBase = this.calcScrollBase(newWrapperBoundingRectY);
        if (JSON.stringify(scrollBase) !== JSON.stringify(this.dimensions.scrollBase)) {
            var dimensions = Object.assign({}, this.dimensions, {
                scrollBase: scrollBase,
            });
            this.setDimensions(dimensions);
            // this.parent.clientSideFunctionsConnectedPromise.promise.then(() => {
            //   // This makes sure we are not calling worker functions before they were set in the client side worker
            //   this.parent.props.onDimensionsReady(this.getDimensions());
            // });
        }
    };
    DimensionsHelper.prototype.setDimensions = function(dimensions) {
        this.componentDimensionsReady = true;
        this.dimensions = dimensions;
    };
    DimensionsHelper.prototype.getDimensions = function() {
        return this.dimensions || {};
    };
    DimensionsHelper.prototype.getGalleryDimensions = function() {
        var _this = this;
        return this.getOrPutInCache('galleryDimensions', function() {
            var res = {
                avoidGallerySelfMeasure: _this.parent.avoidGallerySelfMeasure,
                galleryWidth: Math.floor(_this.getGalleryWidth()),
                galleryHeight: Math.floor(_this.getGalleryHeight()),
                height: Math.floor(_this.container.height),
                width: Math.floor(_this.container.width),
                documentHeight: Math.floor(window.document.body.scrollHeight),
                windowWidth: Math.floor(window.innerWidth),
            };
            return res;
        });
    };
    DimensionsHelper.prototype.getScreenDimensions = function() {
        var screen = {
            width: window.screen.width,
            height: window.screen.height,
        };
        return {
            screen: screen,
        };
    };
    DimensionsHelper.prototype.getScrollBase = function() {
        return {
            scrollBase: Math.ceil(this.calcScrollBase()),
        };
    };
    DimensionsHelper.prototype.isUnknownWidth = function(container) {
        if (container === void 0) {
            container = this.container;
        }
        return this.getOrPutInCache('isUnknownWidth', function() {
            // if the container width is not a number, it is fullwidth (e.g.: "", "100%", "calc(100% + -160px)")
            return (container &&
                String(parseInt(container.width)) !== String(container.width));
        });
    };
    DimensionsHelper.prototype.isUnknownHeight = function(container) {
        if (container === void 0) {
            container = this.container;
        }
        return this.getOrPutInCache('isUnknownHeight', function() {
            // if the container height is not a number, it is fullHeight (e.g.: "", "100%", "calc(100% + -160px)")
            return (container &&
                String(parseInt(container.height)) !== String(container.height));
        });
    };
    DimensionsHelper.prototype.getMeasuredContainer = function() {
        return {
            width: this.getBoundingRect().width,
            height: this.getBoundingRect().height,
        };
    };
    DimensionsHelper.prototype.calcBoundingRect = function() {
        if (utils.isVerbose()) {
            console.count('calcBoundingRect');
        }
        try {
            this.galleryWrapperElement = window.document.getElementById("gallery-wrapper-" + this.id);
            return this.galleryWrapperElement.getBoundingClientRect();
        } catch (e) {
            return false;
        }
    };
    DimensionsHelper.prototype.getBoundingRect = function() {
        var _this = this;
        return this.getOrPutInCache('boundingRect', function() {
            return (_this.calcBoundingRect() || {
                x: 0,
                y: 0,
                width: Math.floor(window.innerWidth),
                height: 0,
            });
        });
    };
    DimensionsHelper.prototype.getBodyBoundingRect = function() {
        var _this = this;
        return this.getOrPutInCache('bodyBoundingRect', function() {
            return (_this.calcBodyBoundingRect() || {
                x: 0,
                y: 0,
                width: window.innerWidth,
                height: window.innerHeight,
            });
        });
    };
    DimensionsHelper.prototype.calcBodyBoundingRect = function() {
        if (utils.isVerbose()) {
            console.count('calcBodyBoundingRect');
        }
        try {
            var popupRootElement = window.document.getElementById('POPUPS_ROOT');
            if (!this.galleryWrapperElement) {
                this.galleryWrapperElement = window.document.getElementById("gallery-wrapper-" + this.id);
            }
            if (popupRootElement &&
                this.galleryWrapperElement &&
                popupRootElement.contains(this.galleryWrapperElement)) {
                return popupRootElement.getBoundingClientRect();
            } else {
                return window.document.body.getBoundingClientRect();
            }
        } catch (_a) {
            return false;
        }
    };
    DimensionsHelper.prototype.calcScrollBase = function(newWrapperBoundingRectY) {
        var _this = this;
        return this.getOrPutInCache('scrollBase', function() {
            var scrollBase = _this.container.scrollBase;
            try {
                if (!(scrollBase >= 0)) {
                    scrollBase = 0;
                }
                _this.wrapperBoundingRectY =
                    newWrapperBoundingRectY === undefined ?
                    _this.getBoundingRect().y :
                    newWrapperBoundingRectY;
                var offset = _this.wrapperBoundingRectY - _this.getBodyBoundingRect().y; // clientRect are relative to the viewport, thus affected by scroll and need to be normalized to the body
                if (offset >= 0) {
                    scrollBase += offset;
                }
            } catch (e) {
                //
            }
            return Math.ceil(scrollBase);
        });
    };
    DimensionsHelper.prototype.getGalleryWidth = function() {
        var _this = this;
        return this.getOrPutInCache('galleryWidth', function() {
            var domWidth = function() {
                return utils.isSSR() ? '' : Math.floor(_this.getBoundingRect().width);
            };
            return _this.container.width > 0 ?
                Math.floor(_this.container.width) :
                domWidth();
        });
    };
    DimensionsHelper.prototype.getGalleryHeight = function() {
        var _this = this;
        return this.getOrPutInCache('galleryHeight', function() {
            var domHeight = function() {
                return utils.isSSR() ? '' : Math.floor(_this.getBoundingRect().height);
            };
            return _this.container.height > 0 ?
                Math.floor(_this.container.height) :
                domHeight();
        });
    };
    DimensionsHelper.prototype.getMobilePreviewFrameDimensions = function() {
        var mobilePreviewFrame = this.getPreviewMobileEmulatorBoundingClientRect();
        return {
            mobilePreviewFrame: mobilePreviewFrame
        };
    };
    DimensionsHelper.prototype.getPreviewMobileEmulatorBoundingClientRect = function() {
        try {
            if (!this.siteContainerElement) {
                this.siteContainerElement = window.document.querySelector(VIEWER_SELECTOR);
            }
            return this.siteContainerElement.getBoundingClientRect();
        } catch (e) {
            console.error(e);
        }
    };
    DimensionsHelper.prototype.isPreview = function() {
        return this.parent.viewMode === GALLERY_CONSTS.viewMode.PREVIEW;
    };
    return DimensionsHelper;
}());
export default DimensionsHelper;
//# sourceMappingURL=dimensionsHelper.js.map