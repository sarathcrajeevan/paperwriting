import {
    __assign,
    __extends
} from "tslib";
import React from 'react';
import {
    GALLERY_CONSTS,
    flattenObject
} from 'pro-gallery-lib';
import '../styles/dynamic/GalleryWrapperWixStyles.scss';
import {
    experimentsWrapper,
    window,
    translationUtils,
} from '@wix/photography-client-lib';
import {
    utils
} from '../utils/webUtils';
import SiteHelper from '../helpers/siteHelper'; // ~35kb
import DimensionsHelper from '../helpers/dimensionsHelper'; // ~13kb
import FullscreenHelper from '../helpers/fullscreenHelper'; // ~5kb
import LogHelper from '../helpers/logHelper'; // ~12kb
import ItemsHelper from '../helpers/itemsHelper'; // ~113kb (!)
import ItemActionsHelper from '../helpers/itemActionsHelper'; // ~113kb (!)
import AccessibilityHelper from '../helpers/accessibilityHelper'; // ~1kb
import ProGalleryTestIdentifier from './ProGalleryTestIdentifier';
import RenderStatusIndicator from './RenderStatusIndicator';
import SyncEventHandler from '../helpers/syncEventHandler';
import SocialShareWrapper from '../socialShare/SocialShareWrapper.js';
import {
    LayoutFixer
} from '@wix/pro-gallery-layout-fixer';
import {
    ProGalleryRendererWrapper
} from './proGalleryRendererWrapper';
import {
    VIEWER_SELECTOR
} from '../constants/constants';
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
var CommonGalleryWrapper = /** @class */ (function(_super) {
    __extends(CommonGalleryWrapper, _super);

    function CommonGalleryWrapper(props) {
        var _this = this;
        props = __assign(__assign({}, props.host), props); // untill props.host will be fully active sv_addPropsToHostInNativeComponent
        _this = _super.call(this, props) || this;
        _this.initExperimentFunctions(props);
        _this.isPrerenderMode = true; // initially true
        _this.avoidGallerySelfMeasure = true; // the wrapper is measuring for the gallery
        _this.state = {
            fullscreen: {
                clickedIdx: props.clickedIdx >= 0 ? props.clickedIdx : -1,
                fullscreenAnimating: false,
                directFullscreenItem: !window.firstProGalleryRenderWithFullscreen &&
                    props.directFullscreenItem,
            },
            isAccessible: false,
            itemsLoveData: {},
            bannerHeight: 0,
            showSocialSharePopup: false,
            showAccessibilityTooltip: false,
            accessibilityTooltipShowedOnce: false,
            accessibilityTooltipData: {},
            accessibilityTooltipLoaded: false,
            galleryScroll: {
                x: 0,
                y: 0
            },
        };
        // ---------- dont change the order or else (unless you know what you are doing) ------------ //
        var isStoreGallery = _this.isStoreGallery();
        var shouldUseGalleryIdForShareUrl = _this.shouldUseGalleryIdForShareUrl();
        _this.itemsHelper = new ItemsHelper(_this, props, isStoreGallery);
        _this.siteHelper = new SiteHelper(_this, props, isStoreGallery);
        // this.dimensionsHelper = new DimensionsHelper(this, props);
        _this.logHelper = new LogHelper(_this, props, _this.getSentryDSN());
        _this.itemActionsHelper = new ItemActionsHelper(_this, props, isStoreGallery, shouldUseGalleryIdForShareUrl);
        _this.fullscreenHelper = new FullscreenHelper(_this, props, isStoreGallery);
        _this.setAccessibilityState = _this.setAccessibilityState.bind(_this);
        _this.accessibilityHelper = new AccessibilityHelper(_this, props, _this.setAccessibilityState);
        _this.syncEventHandler = new SyncEventHandler(_this, props);
        _this.clientSideFunctionsConnectedPromise = new Deferred();
        _this.onNewProps(props);
        _this.toggleSocialShareScreen = _this.toggleSocialShareScreen.bind(_this);
        _this.onLoveClicked = _this.onLoveClicked.bind(_this);
        _this.renderCount = 0;
        if (props.directFullscreenItem) {
            window.firstProGalleryRenderWithFullscreen = true;
        }
        return _this;
    }
    CommonGalleryWrapper.prototype.setAccessibilityState = function(isAccessible) {
        this.setState({
            isAccessible: isAccessible
        });
    };
    CommonGalleryWrapper.prototype.initExperimentFunctions = function(props) {
        this.shouldChangeParentHeight = function() {
            return experimentsWrapper.getExperimentBoolean('specs.pro-gallery.loadMoreClickedGalleryHeight');
        };
        this.shouldUseInlineStyles = function() {
            return (props.queryParams && props.queryParams.useInlineStyles === 'true') ||
                experimentsWrapper.getExperimentBoolean('specs.pro-gallery.useInlineStyles');
        };
        this.shouldUseLayoutFixer = function() {
            var _a;
            return !(((_a = props.queryParams) === null || _a === void 0 ? void 0 : _a.useLayoutFixer) === 'false' ||
                experimentsWrapper.getExperimentBoolean('specs.pro-gallery.excludeFromLayoutFixer'));
        };
        this.disableSSROpacity = function() {
            return props.queryParams && props.queryParams.disableSSROpacity === 'true';
        };
        this.shouldUseExperimentalFeature = function() {
            return experimentsWrapper.getExperimentBoolean('specs.pro-gallery.generalExperimentForNewFeature');
        };
    };
    // return true if art-store and false for pro-gallery
    CommonGalleryWrapper.prototype.isStoreGallery = function() {
        return false;
    };
    // return true in collections flow
    CommonGalleryWrapper.prototype.shouldUseGalleryIdForShareUrl = function() {
        return false;
    };
    // fullscreen wrapper for OOI apps
    CommonGalleryWrapper.prototype.getFullscreenWrapperElement = function() {
        return null;
    };
    // sentry dsn for the app
    CommonGalleryWrapper.prototype.getSentryDSN = function() {
        return '';
    };
    // item resizer - with watermark for art-store
    CommonGalleryWrapper.prototype.getItemResizer = function() {
        return null;
    };
    // props that are passed for fullscreen wrapper
    CommonGalleryWrapper.prototype.getArtStoreProps = function() {
        return {};
    };
    // watermark for pro-gallery (if false no watermark will be send)
    CommonGalleryWrapper.prototype.getWatermark = function() {
        return false;
    };
    // get pro gallery element (artstore adding banner)
    CommonGalleryWrapper.prototype.getProGalleryElement = function(ProGalleryElement) {
        var wrappedProGalleryElement = this.getWrappedProGalleryIfNeeded(ProGalleryElement);
        return wrappedProGalleryElement || ProGalleryElement;
    };
    CommonGalleryWrapper.prototype.getWrappedProGalleryIfNeeded = function() {
        return false;
    };
    CommonGalleryWrapper.prototype.getFullscreenSelectedIndex = function() {
        // I WANT THIS GONE!! but i need to workaround the can render of the fullscreen...
        return this.state.fullscreen.directFullscreenItem &&
            this.state.fullscreen.directFullscreenItem.itemId ?
            0 :
            this.state.fullscreen.clickedIdx;
    };
    // end of common methods
    CommonGalleryWrapper.prototype.componentDidMount = function() {
        this.accessibilityHelper.initAccessibility();
        this.dimensionsHelper = new DimensionsHelper(this);
        this.dimensionsHelper.createResizeObserver();
        this.dimensionsHelper.createIntersectionObserver();
        this.onNewProps(this.props);
    };
    CommonGalleryWrapper.prototype.componentWillReceiveProps = function(props) {
        this.onNewProps(props);
    };
    CommonGalleryWrapper.prototype.componentWillUnmount = function() {
        this.props.host.unblockScroll();
        this.accessibilityHelper.cleanupAccessibility();
    };
    CommonGalleryWrapper.prototype.onNewProps = function(props) {
        props = __assign(__assign({}, props.host), props); // untill props.host will be fully active sv_addPropsToHostInNativeComponent
        if (props.clientSetProps) {
            this.clientSideFunctionsConnectedPromise.resolve();
        }
        this.viewMode = this.siteHelper.parseViewMode(props.viewMode);
        this.deviceType = this.siteHelper.formFactorToDeviceType(props.formFactor);
        this.syncEventHandler.update(props);
        this.dimensionsHelper && this.dimensionsHelper.update(props); // will not happen before init in didMount
        if (this.workerId && this.workerId !== props.proGalleryWorkerId) {
            // worker existed but now its reset...(e.g. Data-Binding,Navigation in dynamic pages)
            // this is to make sure the worker has dimensions from the component
            this.dimensionsHelper &&
                this.dimensionsHelper.notifyWorkerOnDimensionsReady();
            this.isPrerenderMode = true;
        }
        this.siteHelper.update(props);
        this.fullscreenHelper.update(props);
        this.logHelper.update(props);
        this.itemsHelper.update(props);
        this.itemsHelper.loadItemsDimensionsIfNeeded();
        this.itemActionsHelper.update(props);
        this.accessibilityHelper.update(props);
        !this.isStoreGallery() && this.setNewDirectFullscreenIfNeeded(props);
        props.itemsLoveData &&
            this.itemActionsHelper.newItemLoveDataArrived(props.itemsLoveData);
        this.workerId = props.proGalleryWorkerId;
    };
    CommonGalleryWrapper.prototype.setNewDirectFullscreenIfNeeded = function(props) {
        if (!props.directFullscreenItem) {
            return;
        }
        if (props.directFullscreenItem.itemId &&
            (!this.state.fullscreen.directFullscreenItem ||
                this.state.fullscreen.directFullscreenItem.itemId !==
                props.directFullscreenItem.itemId)) {
            !window.firstProGalleryRenderWithFullscreen &&
                this.setState({
                    fullscreen: __assign(__assign({}, this.state.fullscreen), {
                        directFullscreenItem: props.directFullscreenItem
                    }),
                });
            window.firstProGalleryRenderWithFullscreen = true;
        }
    };
    CommonGalleryWrapper.prototype.onLoveClicked = function(id, origin, onFinish) {
        var _a;
        var itemsLoveData = this.state.itemsLoveData;
        var updatedItemLoveData;
        if (itemsLoveData[id]) {
            updatedItemLoveData = {
                isLoved: !itemsLoveData[id].isLoved,
                loveCount: itemsLoveData[id].isLoved ?
                    itemsLoveData[id].loveCount - 1 :
                    itemsLoveData[id].loveCount + 1,
            };
        } else {
            updatedItemLoveData = {
                isLoved: true,
                loveCount: 1,
            };
        }
        var updatedItemsLoveData = Object.assign({}, itemsLoveData, (_a = {},
            _a[id] = updatedItemLoveData,
            _a));
        this.setState({
            itemsLoveData: updatedItemsLoveData
        });
        onFinish();
    };
    CommonGalleryWrapper.prototype.shouldRenderGallery = function(_a) {
        var notInView = _a.notInView,
            options = _a.options,
            container = _a.container,
            noItemsToRender = _a.noItemsToRender;
        var should = true;
        // Dont render if its not in view - TODO check if this is relevant...
        if (utils.isSSR() &&
            this.viewMode !== GALLERY_CONSTS.viewMode.SEO &&
            notInView) {
            if (utils.isVerbose()) {
                console.log('PG not in view, skipping');
            }
            // for this case, reportAppLoaded is already called in the viewerScript
            should = false;
        }
        if (options &&
            options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
            container &&
            (container.height === undefined || container.height <= 0)) {
            // for this case, the height is 0 at the beginning, and will be set later.
            // so the appLoaded will be reported as usual, but in next renders
            should = false;
        }
        if (noItemsToRender) {
            should = false;
        }
        // Dont render the gallery in the background if a bot is viewing a directFulscreen page
        if (this.viewMode === GALLERY_CONSTS.viewMode.SEO &&
            this.state.fullscreen.directFullscreenItem) {
            should = false;
        }
        return should;
    };
    CommonGalleryWrapper.prototype.canRender = function(_a) {
        var galleryId = _a.galleryId,
            items = _a.items,
            propFromSetPropsIndicator = _a.propFromSetPropsIndicator,
            options = _a.options,
            container = _a.container,
            structure = _a.structure;
        var should = true;
        if (!options) {
            should = false;
        }
        if (!(container === null || container === void 0 ? void 0 : container.width) || !(container === null || container === void 0 ? void 0 : container.height)) {
            should = false;
        }
        if (!structure) {
            should = false;
        }
        // Dont render if items are corrupted
        if (items && this.itemsHelper.areOneOrMoreItemsCorrupted(items)) {
            console.error('Gallery Wrapper, one or more items are corrupted');
            if (typeof this.props.sentryReport === 'function') {
                var error = 'Gallery Wrapper, one or more items are corrupted. galleryId = ' +
                    galleryId +
                    ' items = ' +
                    items;
                this.props.sentryReport(error);
            }
            // Report app loaded as it wont be called from the gallery
            this.logHelper.onAppLoaded();
            should = false;
        }
        // Dont render in preview before the worker setProps().
        if (this.viewMode === GALLERY_CONSTS.viewMode.PREVIEW) {
            if (!propFromSetPropsIndicator) {
                // if this prop do not exist in the component (commonGalleryWrapper), it means that setProps was not called yet
                should = false; // if setProps was not called yet, we don't want to render. For now in preview only
            }
        }
        return should;
    };
    CommonGalleryWrapper.prototype.createRenderIndicator = function(_a) {
        var _b, _c;
        var isPrerenderMode = _a.isPrerenderMode,
            rendered = _a.rendered;
        if (((_c = (_b = this.props) === null || _b === void 0 ? void 0 : _b.queryParams) === null || _c === void 0 ? void 0 : _c.usePGRenderIndicator) === 'true' ||
            experimentsWrapper.getExperimentBoolean('specs.pro-gallery.enablePGRenderIndicator')) {
            return (React.createElement(RenderStatusIndicator, {
                isPrerenderMode: isPrerenderMode,
                renderedGallery: rendered,
                renderCount: this.renderCount,
                items: this.props.items,
                container: this.props.container,
                options: this.props.options,
                compId: this.props.compId,
                galleryId: this.props.galleryId,
                workerLog: this.props.SSRWorkerLog,
                key: "pro-gallery-render-ident"
            }));
        } else {
            return null;
        }
    };
    CommonGalleryWrapper.prototype.isUnKnownContainer = function(_a) {
        var container = _a.container,
            options = _a.options,
            requestedWidth = _a.requestedWidth,
            requestedHeight = _a.requestedHeight;
        var width = container.width,
            height = container.height,
            isMobile = container.isMobile;
        var scrollDirection = options.scrollDirection;
        var isKnownWidth = requestedWidth && requestedWidth === (container === null || container === void 0 ? void 0 : container.width);
        var isKnownHeight = requestedHeight && requestedHeight === (container === null || container === void 0 ? void 0 : container.height);
        var isMissingWidth = (!isKnownWidth && !isMobile) || typeof width !== 'number';
        var isMissingHeight = !isKnownHeight || typeof height !== 'number';
        return (isMissingWidth ||
            (scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
                isMissingHeight));
    };
    CommonGalleryWrapper.prototype.shouldUsePrerenderMode = function(_a) {
        var container = _a.container,
            options = _a.options,
            requestedWidth = _a.requestedWidth,
            requestedHeight = _a.requestedHeight;
        var isUnKnownContainer = container &&
            this.isUnKnownContainer({
                container: container,
                options: options,
                requestedWidth: requestedWidth,
                requestedHeight: requestedHeight,
            });
        var isSEO = this.viewMode === GALLERY_CONSTS.viewMode.SEO;
        return (this.isPrerenderMode =
            isUnKnownContainer && !isSEO && this.isPrerenderMode); // galleries cant go back to prerender, its one-way
    };
    CommonGalleryWrapper.prototype.toggleSocialShareScreen = function(showSocialSharePopup, socialShareData) {
        this.socialShareData = showSocialSharePopup ? socialShareData : {};
        this.setState({
            showSocialSharePopup: showSocialSharePopup,
        });
    };
    CommonGalleryWrapper.prototype.getCustomComponents = function() {
        return this.itemsHelper.getCustomComponents();
    };
    CommonGalleryWrapper.prototype.getFullscreenCustomComponents = function() {
        return null;
    };
    CommonGalleryWrapper.prototype.loadAccessibilityTooltipComponent = function() {
        var _this = this;
        import (
            /* webpackChunkName: "accessability-tooltip" */
            '../tooltip/tooltip').then(function(module) {
            _this.accessibilityTooltipComponent = module.default;
            _this.setState({
                accessibilityTooltipLoaded: true
            });
        });
    };
    CommonGalleryWrapper.prototype.getAccessibilityTooltipComponent = function() {
        return this.state.accessibilityTooltipLoaded ?
            this.accessibilityTooltipComponent :
            null;
    };
    CommonGalleryWrapper.prototype.render = function() {
        var cssBaseUrl = utils.isLocal() ?
            'https://localhost:3200/' :
            this.props.cssBaseUrl;
        var props = __assign(__assign({}, this.props.host), this.props); // until props.host will be fully active sv_addPropsToHostInNativeComponent
        var queryParams = props.queryParams,
            notInView = props.notInView,
            id = props.id,
            galleryId = props.galleryId,
            pageUrl = props.pageUrl;
        var options = props.options,
            fullscreenOptions = props.fullscreenOptions,
            items = props.items,
            requestedWidth = props.requestedWidth,
            requestedHeight = props.requestedHeight,
            structure = props.structure,
            totalItemsCount = props.totalItemsCount,
            propFromSetPropsIndicator = props.propFromSetPropsIndicator,
            staticMediaUrls = props.staticMediaUrls;
        var container = __assign(__assign({}, this.props.container), (this.dimensionsHelper ? this.dimensionsHelper.getScrollBase() : {}));
        var dom = [];
        var dangerouslySetInnerHTMLObject;
        var staticCssFile = this.isStoreGallery() ?
            'artStoreStaticCss.min.css' :
            'staticCss.min.css';
        if (cssBaseUrl) {
            dom.push(React.createElement("link", {
                key: "static-link",
                rel: "stylesheet",
                href: "" + cssBaseUrl + staticCssFile
            }));
        }
        var itemsProps = {
            items: items,
            totalItemsCount: totalItemsCount,
        };
        var noItemsToRender = !itemsProps || !itemsProps.items || itemsProps.items.length === 0;
        if (utils.isSSR() &&
            (noItemsToRender ||
                experimentsWrapper.getExperimentBoolean('specs.pro-gallery.skipSsr') ||
                (queryParams && queryParams.skipPgSsr === 'true'))) {
            console.error('Skipping Pro Gallery SSR!', this.props);
            return (React.createElement("div", {
                id: "gallery-wrapper-" + id,
                key: "gallery-wrapper-" + id,
                class: "pro-gallery-component-wrapper",
                style: {
                    overflow: 'hidden',
                    height: "100%",
                    width: '100%'
                }
            }));
        }
        if (this.canRender({
                galleryId: galleryId,
                items: items,
                propFromSetPropsIndicator: propFromSetPropsIndicator,
                options: options,
                container: container,
                structure: structure,
            })) {
            this.renderCount++;
            var useInlineStyles = this.shouldUseInlineStyles();
            var useLayoutFixer = this.shouldUseLayoutFixer();
            if (utils.isVerbose()) {
                console.log('Pro Gallery wrapper!', this.props);
                console.count('[OOISSR] proGallery ooi wrapper render');
            }
            this.commonProps = __assign(__assign({
                id: id,
                allowSSR: true,
                container: container
            }, itemsProps), {
                deviceType: this.deviceType,
                viewMode: this.viewMode,
                scrollingElement: this.siteHelper.getScrollingElement(),
                createMediaUrl: this.getItemResizer(staticMediaUrls)
            });
            var disableSSROpacity = this.disableSSROpacity();
            var isPrerenderMode = this.shouldUsePrerenderMode({
                container: container,
                options: options,
                requestedWidth: requestedWidth,
                requestedHeight: requestedHeight,
            });
            this.pgProps = __assign(__assign({}, this.commonProps), {
                options: options,
                structure: structure,
                customComponents: this.getCustomComponents(),
                eventsListener: this.syncEventHandler.eventHandler,
                settings: {
                    isAccessible: this.state.isAccessible,
                    avoidInlineStyles: !(useInlineStyles || useLayoutFixer),
                    disableSSROpacity: disableSSROpacity,
                },
                enableExperimentalFeatures: this.shouldUseExperimentalFeature(),
                translations: {
                    Accessibility_Left_Gallery: translationUtils.getByKey('Accessibility_Left_Gallery'),
                },
                isPrerenderMode: isPrerenderMode
            });
            this.fullscreenProps = __assign(__assign(__assign(__assign(__assign({}, this.commonProps), {
                backgroundFilterElementSelector: VIEWER_SELECTOR,
                options: fullscreenOptions,
                isAccessible: this.state.isAccessible,
                scrollTo: this.props.scrollTo,
                fullscreenAnimating: this.state.fullscreen.fullscreenAnimating,
                fullscreenIdx: this.state.fullscreen.clickedIdx,
                animationDuration: this.state.fullscreen.animationDuration,
                eventsListener: this.syncEventHandler.fullscreenEventHandler,
                getPreviewMobileEmulatorWidth: this.siteHelper
                    .getPreviewMobileEmulatorWidth,
                getPreviewMobileEmulatorLeft: this.siteHelper
                    .getPreviewMobileEmulatorLeft
            }), this.getArtStoreProps()), this.fullscreenHelper.directFullscreenItemProps()), {
                directFullscreenMockBlueprint: this.props.directFullscreenMockBlueprint,
                staticMediaUrls: staticMediaUrls,
                itemsLoveData: this.state.itemsLoveData,
                galleryId: galleryId,
                noFollowForSEO: !this.siteHelper.isPremiumSite(),
                pageUrl: pageUrl,
                customComponents: this.getFullscreenCustomComponents()
            });
            if (this.getWatermark()) {
                this.pgProps.watermark = this.getWatermark();
            }
            var AccessabilityTooltipComponent = this.getAccessibilityTooltipComponent();
            var shouldRenderGallery = this.shouldRenderGallery({
                notInView: notInView,
                options: options,
                container: container,
                noItemsToRender: noItemsToRender,
            });
            if (shouldRenderGallery) {
                dom.push(React.createElement(ProGalleryTestIdentifier, {
                    key: "pro-gallery-test-ident",
                    testType: this.props.testType
                }), this.getProGalleryElement(React.createElement(ProGalleryRendererWrapper, __assign({}, this.pgProps))));
            } else {
                var emptyStateDimensions = {
                    width: container.width + "px",
                    height: container.height + "px",
                };
                if (noItemsToRender && this.viewMode === GALLERY_CONSTS.viewMode.EDIT) {
                    var GalleryEmpty = this.getGalleryEmpty();
                    if (GalleryEmpty) {
                        dom.push(React.createElement("div", {
                            class: "pro-gallery-empty-wrapper",
                            style: emptyStateDimensions
                        }, React.createElement(GalleryEmpty, {
                            key: "pro-gallery-empty-state"
                        })));
                    }
                }
            }
            if (shouldRenderGallery && useLayoutFixer && isPrerenderMode) {
                dom.push(React.createElement(LayoutFixer, {
                    id: id,
                    items: itemsProps.items,
                    options: flattenObject(options),
                    isPrerenderMode: isPrerenderMode
                }));
            }
            dom.push(React.createElement(SocialShareWrapper, {
                showSocialSharePopup: this.state.showSocialSharePopup,
                socialShareData: this.socialShareData,
                toggleSocialShareScreen: this.toggleSocialShareScreen,
                viewMode: this.viewMode,
                deviceType: this.deviceType,
                getPreviewMobileEmulatorWidth: this.siteHelper.getPreviewMobileEmulatorWidth,
                getPreviewMobileEmulatorLeft: this.siteHelper.getPreviewMobileEmulatorLeft,
                itemActionsHelper: this.itemActionsHelper
            }));
            if (shouldRenderGallery && AccessabilityTooltipComponent) {
                dom.push(React.createElement(AccessabilityTooltipComponent, {
                    data: this.state.accessibilityTooltipData,
                    content: translationUtils.getByKey('Accessibility_Tooltip'),
                    showTooltip: this.state.showAccessibilityTooltip
                }));
            }
            dom.push(this.createRenderIndicator({
                isPrerenderMode: isPrerenderMode,
                rendered: true
            }));
            var ProFullscreenWrapper = this.getFullscreenElementIfNeeded();
            ProFullscreenWrapper &&
                dom.push(
                    // This is the last item in the dom array. When it was located before the layoutFixer it caused a PHOT-2368.
                    React.createElement(ProFullscreenWrapper, __assign({
                        key: "pro-fullscreen"
                    }, this.fullscreenProps)));
            var responsiveGallery = options &&
                (options.scrollDirection ===
                    GALLERY_CONSTS.scrollDirection.HORIZONTAL ||
                    (options.scrollDirection ===
                        GALLERY_CONSTS.scrollDirection.VERTICAL &&
                        options.enableInfiniteScroll === false &&
                        !this.loadMoreClicked)) &&
                !(this.props.host.dimensions.height > 0);
            dangerouslySetInnerHTMLObject = responsiveGallery ?
                {
                    __html: "div." + id + " {\n        height: 100%;\n        width: 100%;\n        position: relative;\n      }\n      div." + id + " > div {\n        position: absolute;\n        top: 0;\n        left: 0;\n      }",
                } :
                {
                    __html: "div." + id + " {\n      width: 100%;\n      }\n      " + (this.shouldChangeParentHeight() ?
                        "#" + id + "{\n          height: auto;\n        }" :
                        '') + "\n      ",
                };
        } else {
            dom = [];
            dom.push(this.createRenderIndicator({
                isPrerenderMode: false,
                rendered: false
            }));
        }
        return (React.createElement("div", {
                id: "gallery-wrapper-" + id,
                key: "gallery-wrapper-" + id,
                class: "pro-gallery-component-wrapper",
                style: {
                    overflow: 'hidden',
                    height: "100%",
                    width: '100%'
                }
            },
            React.createElement("style", {
                dangerouslySetInnerHTML: dangerouslySetInnerHTMLObject
            }),
            dom));
    };
    return CommonGalleryWrapper;
}(React.Component));
export default CommonGalleryWrapper;
//# sourceMappingURL=CommonGalleryWrapper.js.map