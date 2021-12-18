import {
    __assign,
    __extends
} from "tslib";
import React from 'react';
import ReactDOM from 'react-dom';
import ProGalleryFullscreenMock from './ProGalleryFullscreenMock';
import {
    window,
    experiments
} from '@wix/photography-client-lib';
import '../styles/dynamic/FullscreenWrapperWixStyles.scss';
import {
    GALLERY_CONSTS
} from 'pro-gallery';
import {
    Utils,
    utils
} from '../utils/webUtils';
var CommonFullscreenWrapper = /** @class */ (function(_super) {
    __extends(CommonFullscreenWrapper, _super);

    function CommonFullscreenWrapper(props) {
        var _this = _super.call(this, props) || this;
        _this.onFullscreenChange = function() {
            var container = {
                width: Utils.isMobilePreview(_this.props.viewMode, _this.props.deviceType) ?
                    _this.props.getPreviewMobileEmulatorWidth() :
                    window.screen.width,
                height: window.screen.height,
            };
            if (!window.document.fullscreenElement &&
                !window.document.webkitIsFullScreen &&
                !window.document.mozFullScreen &&
                !window.document.msFullscreenElement) {
                container = {
                    width: Utils.isMobilePreview(_this.props.viewMode, _this.props.deviceType) ?
                        _this.props.getPreviewMobileEmulatorWidth() :
                        window.innerWidth,
                    height: window.innerHeight,
                };
            }
            _this.setState({
                container: container
            });
        };
        _this.state = {
            container: {
                width: Utils.isMobilePreview(_this.props.viewMode, _this.props.deviceType) ?
                    _this.props.getPreviewMobileEmulatorWidth() :
                    window.innerWidth,
                height: window.innerHeight,
            },
            proFullscreenLoaded: false,
        };
        _this.onFullscreenChange = _this.onFullscreenChange.bind(_this);
        _this.resize = _this.resize.bind(_this);
        _this.debouncedResizeEvent = utils.debounce(_this.resize, 100);
        _this.lastPageScroll = -1;
        _this.FullscreenElement = null;
        _this.shouldUseNewSocialSharePopup =
            experiments('specs.pro-gallery.useNewSocialSharePopup') === 'true';
        return _this;
    }
    CommonFullscreenWrapper.prototype.componentDidMount = function() {
        this.loadFullscreenModuleIfNeeded();
    };
    CommonFullscreenWrapper.prototype.componentWillMount = function() {
        window.addEventListener('fullscreenchange', this.onFullscreenChange);
        window.addEventListener('webkitfullscreenchange', this.onFullscreenChange);
        window.addEventListener('mozfullscreenchange', this.onFullscreenChange);
        window.addEventListener('MSFullscreenChange', this.onFullscreenChange);
        window.addEventListener('resize', this.debouncedResizeEvent);
    };
    CommonFullscreenWrapper.prototype.componentWillUnmount = function() {
        window.removeEventListener('fullscreenchange', this.onFullscreenChange);
        window.removeEventListener('webkitfullscreenchange', this.onFullscreenChange);
        window.removeEventListener('mozfullscreenchange', this.onFullscreenChange);
        window.removeEventListener('MSFullscreenChange', this.onFullscreenChange);
        window.removeEventListener('resize', this.debouncedResizeEvent);
    };
    // return true if art-store and false for pro-gallery
    CommonFullscreenWrapper.prototype.isStoreGallery = function() {
        return false;
    };
    CommonFullscreenWrapper.prototype.resize = function() {
        this.setState({
            container: {
                width: Utils.isMobilePreview(this.props.viewMode, this.props.deviceType) ?
                    this.props.getPreviewMobileEmulatorWidth() :
                    window.innerWidth,
                height: window.innerHeight,
            },
        });
    };
    CommonFullscreenWrapper.prototype.shouldUseReactPortal = function() {
        return (this.props.viewMode !== GALLERY_CONSTS.viewMode.SEO && !utils.isSSR());
    };
    CommonFullscreenWrapper.prototype.blockParentScroll = function(shouldBlock) {
        var stopScrollClass = 'pro-gallery-stop-scroll-for-fullscreen';
        var pageHtml = window.document.getElementsByTagName('html')[0];
        var classList = pageHtml && pageHtml.classList;
        try {
            if (shouldBlock && !this.parentScrollIsBlocked) {
                this.lastPageScroll = window.scrollY;
                this.parentScrollIsBlocked = true;
                classList.add(stopScrollClass);
            } else if (!shouldBlock && this.parentScrollIsBlocked) {
                this.parentScrollIsBlocked = false;
                classList.remove(stopScrollClass);
                if (this.lastPageScroll >= 0) {
                    this.lastPageScroll = -1;
                    window.scrollTo(0, this.lastPageScroll);
                }
            }
        } catch (e) {
            console.log('Cannot stop parent scroll', e);
        }
    };
    CommonFullscreenWrapper.prototype.getFullscreenElement = function() {
        return this.state.proFullscreenLoaded && this.FullscreenElement ?
            this.FullscreenElement :
            null;
    };
    CommonFullscreenWrapper.prototype.loadFullscreenModuleIfNeeded = function() {
        var _this = this;
        if (utils.isSSR()) {
            return;
        }
        import (
            /* webpackChunkName: "pro-fullscreen-renderer" */
            '@wix/pro-fullscreen-renderer').then(function(module) {
            _this.FullscreenElement = module.ProFullscreen;
            _this.setState({
                proFullscreenLoaded: true
            });
        });
    };
    CommonFullscreenWrapper.prototype.additionalProFullscreenProps = function() {
        return {};
    };
    CommonFullscreenWrapper.prototype.canRender = function() {
        var _a = this.props,
            fullscreenIdx = _a.fullscreenIdx,
            items = _a.items,
            options = _a.options;
        return fullscreenIdx >= 0 && !!items && !!options;
    };
    CommonFullscreenWrapper.prototype.getRenderElement = function() {
        if (!this.canRender()) {
            return null;
        }
        var ProFullscreenElement = this.getFullscreenElement();
        var props = this.props;
        var pageUrl = experiments && experiments('specs.pro-gallery.itemDeeplinks') === 'true' ?
            props.pageUrl :
            null;
        if (ProFullscreenElement) {
            return (React.createElement(ProFullscreenElement, __assign({}, this.additionalProFullscreenProps(), {
                items: props.items,
                initialIdx: props.fullscreenIdx,
                totalItemsCount: props.totalItemsCount,
                container: this.state.container,
                locale: props.locale,
                homeGalleryPageUrl: pageUrl,
                styles: props.options,
                isAccessible: props.isAccessible,
                galleryId: props.galleryId,
                viewMode: props.viewMode,
                noFollowForSEO: props.noFollowForSEO,
                eventsListener: props.eventsListener,
                itemsLoveData: props.itemsLoveData,
                deviceType: props.deviceType,
                isPreview: props.viewMode === GALLERY_CONSTS.viewMode.PREVIEW,
                animationDuration: props.animationDuration,
                shouldUseNewSocialSharePopup: this.shouldUseNewSocialSharePopup,
                createMediaUrl: props.createMediaUrl,
                staticMediaUrls: props.staticMediaUrls,
                backgroundFilterElementSelector: props.backgroundFilterElementSelector,
                fullscreenAnimating: props.fullscreenAnimating,
                customComponents: props.customComponents
            })));
        } else if (props.viewMode === GALLERY_CONSTS.viewMode.SEO) {
            return (React.createElement(ProGalleryFullscreenMock, {
                items: props.viewMode === GALLERY_CONSTS.viewMode.SEO ?
                    props.items :
                    [props.items[this.props.fullscreenIdx]],
                totalItemsCount: props.totalItemsCount,
                container: this.state.container,
                locale: 'en',
                viewMode: props.viewMode,
                noFollowForSEO: props.noFollowForSEO,
                eventsListener: props.eventsListener,
                itemsLoveData: props.itemsLoveData,
                createMediaUrl: props.createMediaUrl,
                id: props.id,
                allowSSR: true,
                directFullscreenMockBlueprint: this.props.directFullscreenMockBlueprint
            }));
        } else if (props.viewMode === GALLERY_CONSTS.viewMode.SITE &&
            !this.isStoreGallery()
            // waiting for pro-fullscreen-renderer to load (inside 'loadFullscreenModuleIfNeeded'))
        ) {
            var bgColorExpand = (props.options.bgColorExpand && props.options.bgColorExpand.value) ||
                '';
            return (React.createElement("div", {
                className: "pro-fullscreen-wrapper-loading",
                style: {
                    backgroundColor: bgColorExpand,
                }
            }));
        } else {
            return null;
        }
    };
    CommonFullscreenWrapper.prototype.getStyleForWrapper = function() {
        return {
            opacity: this.props.fullscreenAnimating ? 0 : 1,
            transition: 'opacity .8s ease',
            overflow: 'hidden',
        };
    };
    CommonFullscreenWrapper.prototype.addMobilePreviewStylesIfNeeded = function() {
        if (Utils.isMobilePreview(this.props.viewMode, this.props.deviceType)) {
            return {
                left: this.props.getPreviewMobileEmulatorLeft() + 'px',
                width: this.state.container.width + 'px',
            };
        } else {
            return {};
        }
    };
    CommonFullscreenWrapper.prototype.render = function() {
        var renderElement = this.getRenderElement();
        if (!renderElement) {
            return null;
        }
        var fullscreen = (React.createElement("div", {
            className: "pro-fullscreen-wrapper",
            style: __assign(__assign({}, this.getStyleForWrapper()), this.addMobilePreviewStylesIfNeeded())
        }, renderElement));
        return this.shouldUseReactPortal() ?
            ReactDOM.createPortal(fullscreen, document.body) :
            fullscreen;
    };
    return CommonFullscreenWrapper;
}(React.Component));
export default CommonFullscreenWrapper;
//# sourceMappingURL=CommonFullscreenWrapper.js.map