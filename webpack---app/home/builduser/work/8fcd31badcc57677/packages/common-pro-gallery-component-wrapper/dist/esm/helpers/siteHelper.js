import {
    __assign
} from "tslib";
import {
    utils,
    Utils
} from '../utils/webUtils';
import {
    window,
    pgVersionManager,
    translationUtils,
    experimentsWrapper,
    TPADimensionsHelper,
} from '@wix/photography-client-lib';
import {
    GALLERY_CONSTS
} from 'pro-gallery';
import {
    VIEWER_SELECTOR
} from '../constants/constants';
var SiteHelper = /** @class */ (function() {
    function SiteHelper(galleryWrapper, props, isStoreGallery) {
        this.galleryWrapper = galleryWrapper;
        this.galleryWrapperProps = props;
        this.isStoreGallery = isStoreGallery;
        this.isAlbumStore = !!isStoreGallery && !!props.isAlbumsStore;
        this.update = this.update.bind(this);
        this.parseViewMode = this.parseViewMode.bind(this);
        this.handleNewGalleryStructure = this.handleNewGalleryStructure.bind(this);
        this.getScrollingElement = this.getScrollingElement.bind(this);
        this.getPGOptions = this.getPGOptions.bind(this);
        this.isPremiumSite = this.isPremiumSite.bind(this);
        this.isMobile = this.isMobile.bind(this);
        this.getStylesForProvider = this.getStylesForProvider.bind(this);
        this.getPreviewMobileEmulatorWidth =
            this.getPreviewMobileEmulatorWidth.bind(this);
        this.getPreviewMobileEmulatorLeft =
            this.getPreviewMobileEmulatorLeft.bind(this);
    }
    SiteHelper.prototype.update = function(props) {
        this.galleryWrapperProps = props;
        this.updateVersionManagerIfNeeded();
        translationUtils.setTranslations(this.galleryWrapperProps.translations);
        experimentsWrapper.setExperiments(__assign({}, this.galleryWrapperProps.experiments));
        utils.updateViewMode(this.galleryWrapperProps.viewMode);
        if (window.isSSR) {
            var isMobile = this.isMobile();
            window.deviceType = isMobile ? 'mobile' : 'desktop';
            utils.setIsWixMobile(isMobile);
        }
    };
    SiteHelper.prototype.parseViewMode = function(viewMode) {
        if (this.galleryWrapperProps.isInSEO) {
            return GALLERY_CONSTS.viewMode.SEO;
        }
        return Utils.parseViewMode(viewMode);
    };
    SiteHelper.prototype.formFactorToDeviceType = function(formFactor) {
        return Utils.formFactorToDeviceType(formFactor);
    };
    SiteHelper.prototype.handleNewGalleryStructure = function(newGalleryStructureData) {
        var _this = this;
        var numOfItems = newGalleryStructureData.numOfItems,
            container = newGalleryStructureData.container,
            options = newGalleryStructureData.options,
            layoutHeight = newGalleryStructureData.layoutHeight,
            isInfinite = newGalleryStructureData.isInfinite,
            updatedHeight = newGalleryStructureData.updatedHeight;
        var setHeightImp = function(newHeight) {
            if (typeof _this.galleryWrapperProps.setHeight === 'function') {
                if (utils.isVerbose()) {
                    console.log('Setting new height for gallery', newHeight);
                }
                _this.galleryWrapperProps.setHeight(newHeight);
            }
        };
        TPADimensionsHelper.setWixHeight({
            height: layoutHeight,
            offsetTop: 0,
            styleParams: options,
            container: container,
            numOfItems: numOfItems,
            isInfinite: isInfinite,
            updatedHeight: updatedHeight,
            setHeightImp: setHeightImp,
            viewMode: this.galleryWrapperProps.viewMode,
        });
        try {
            this.galleryWrapperProps.updateLayout();
        } catch (e) {
            console.log('Cannot call updateLayout', e);
        }
    };
    SiteHelper.prototype.updateVersionManagerIfNeeded = function() {
        var _a = this.galleryWrapperProps,
            dateCreated = _a.dateCreated,
            gallerySettings = _a.gallerySettings;
        try {
            var _dateCreated = Date.parse(dateCreated);
            if (pgVersionManager.dateCreated !== _dateCreated) {
                if (_dateCreated) {
                    pgVersionManager.setDateCreated(_dateCreated);
                    if (gallerySettings) {
                        var _gallerySettings = gallerySettings;
                        if (this.IsJsonString(_gallerySettings)) {
                            _gallerySettings = JSON.parse(gallerySettings);
                        }
                        var galleryUpgrades = _gallerySettings.upgrades;
                        pgVersionManager.update(null, galleryUpgrades);
                    }
                    if (utils.isDev()) {
                        window.dateCreated = dateCreated;
                    }
                }
            }
        } catch (e) {
            console.error('Could not update version manager', e);
        }
    };
    SiteHelper.prototype.IsJsonString = function(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };
    SiteHelper.prototype.getScrollingElement = function() {
        var _this = this;
        if (typeof this.scrollingElement === 'object') {
            return this.scrollingElement;
        } else if (typeof this.galleryWrapperProps.registerToScroll === 'function') {
            this.scrollingElement = {
                addEventListener: function(eventName, callback) {
                    _this.galleryWrapperProps.registerToScroll(callback);
                },
                removeEventListener: function() {},
                scrollTo: this.galleryWrapperProps.scrollTo,
            };
            return this.scrollingElement;
        } else {
            return {
                addEventListener: function() {},
                removeEventListener: function() {},
                scrollTo: this.galleryWrapperProps.scrollTo,
            };
        }
    };
    SiteHelper.prototype.getPGOptions = function() {
        return this.galleryWrapperProps.options;
    };
    SiteHelper.prototype.getPreviewMobileEmulatorWidth = function() {
        if (this.galleryWrapperProps.options.responsive) {
            // editorX
            return this.getPreviewMobileEmulatorBoundingClientRect().width;
        } else {
            // classic editor - no need to calc as it is always 320
            return 320;
        }
    };
    SiteHelper.prototype.getPreviewMobileEmulatorLeft = function() {
        if (this.galleryWrapperProps.options.responsive) {
            // editorX - no need to calc as it is always 0
            return 0;
        } else {
            // classic editor
            return this.getPreviewMobileEmulatorBoundingClientRect().left;
        }
    };
    SiteHelper.prototype.getPreviewMobileEmulatorBoundingClientRect = function() {
        try {
            if (!this.siteContainerElement) {
                this.siteContainerElement =
                    window.document.querySelector(VIEWER_SELECTOR);
            }
            return this.siteContainerElement.getBoundingClientRect();
        } catch (e) {
            console.error(e);
        }
    };
    SiteHelper.prototype.getStylesForProvider = function() {
        if (!this.isStoreGallery) {
            return {};
        } else {
            var styleParams = this.galleryWrapperProps.styleParams;
            return styleParams ?
                Object.assign({}, styleParams.colors, styleParams.fonts) :
                {};
        }
    };
    SiteHelper.prototype.isPremiumSite = function() {
        var baseUrl = this.galleryWrapperProps.baseUrl;
        return baseUrl && baseUrl.includes && !baseUrl.includes('.wixsite.com'); // this is a hack until we have a normal way to know
    };
    SiteHelper.prototype.isMobile = function() {
        return this.galleryWrapper.deviceType === GALLERY_CONSTS.deviceType.MOBILE;
    };
    return SiteHelper;
}());
export default SiteHelper;
//# sourceMappingURL=siteHelper.js.map