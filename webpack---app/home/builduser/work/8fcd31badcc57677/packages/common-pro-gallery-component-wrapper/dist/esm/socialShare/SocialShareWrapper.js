import {
    __assign,
    __extends
} from "tslib";
import React from 'react';
import {
    Utils,
    utils
} from '../utils/webUtils';
import {
    GALLERY_CONSTS
} from 'pro-gallery';
import {
    window
} from '@wix/photography-client-lib';
var SocialShareWrapper = /** @class */ (function(_super) {
    __extends(SocialShareWrapper, _super);

    function SocialShareWrapper(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            socialShareScreenLoaded: false,
            container: {
                width: Utils.isMobilePreview(_this.props.viewMode, _this.props.deviceType) ?
                    _this.props.getPreviewMobileEmulatorWidth() :
                    window.innerWidth,
            },
        };
        _this.resize = _this.resize.bind(_this);
        _this.debouncedResizeEvent = utils.debounce(_this.resize, 100);
        return _this;
    }
    /* ---------------------- React lifecycle ---------------------- */
    SocialShareWrapper.prototype.componentWillMount = function() {
        window.addEventListener('resize', this.debouncedResizeEvent);
    };
    SocialShareWrapper.prototype.componentWillUnmount = function() {
        window.removeEventListener('resize', this.debouncedResizeEvent);
    };
    /* ---------------------- Dynamic import ---------------------- */
    SocialShareWrapper.prototype.getSocialShareScreenIfNeeded = function() {
        if (this.props.deviceType === GALLERY_CONSTS.deviceType.MOBILE) {
            this.getMobileSocialShareScreen();
        } else {
            this.getDesktopSocialShareScreen();
        }
    };
    SocialShareWrapper.prototype.getMobileSocialShareScreen = function() {
        var _this = this;
        // Pro-Gallery mobile share drawer - Used in iOS devices and as a fallback to webShareAPI
        if (!this.SocialShareScreen && !this.fetchingSocialShareScreen) {
            this.fetchingSocialShareScreen = true;
            import (
                /* webpackChunkName: "MobileSocialShareScreen" */
                './MobileSocialShareScreen.js').then(function(module) {
                _this.fetchingSocialShareScreen = false;
                _this.SocialShareScreen = module.default;
                _this.setState({
                    socialShareScreenLoaded: true
                });
            });
        }
    };
    SocialShareWrapper.prototype.getDesktopSocialShareScreen = function() {
        var _this = this;
        if (!this.SocialShareScreen && !this.fetchingSocialShareScreen) {
            this.fetchingSocialShareScreen = true;
            import (
                /* webpackChunkName: "DesktopSocialShareScreen" */
                './DesktopSocialShareScreen.js').then(function(module) {
                _this.fetchingSocialShareScreen = false;
                _this.SocialShareScreen = module.default;
                _this.setState({
                    socialShareScreenLoaded: true
                });
            });
        }
    };
    /* ---------------------- Display functions ---------------------- */
    SocialShareWrapper.prototype.displayMobileWebShareApi = function() {
        var _this = this;
        // Native mobile browser share behavior
        if (navigator.share) {
            var shareData = {
                title: this.props.socialShareData.fileName ||
                    this.props.socialShareData.title ||
                    this.props.socialShareData.alt,
                text: '',
                url: this.props.socialShareData.directShareLink,
            };
            navigator
                .share(shareData)
                .then(function() {
                    // Successfully open webShareAPI
                    return null;
                })
                .catch(function(e) {
                    console.error("Couldnt use WebShareApi. error: " + e);
                    return _this.displaySocailShareScreen(); // Fallback
                });
        } else {
            console.warn('WebShareApi is not supported by this browser');
            return this.displaySocailShareScreen(); // Fallback
        }
        return null;
    };
    SocialShareWrapper.prototype.displaySocailShareScreen = function() {
        this.getSocialShareScreenIfNeeded();
        var SocialShareScreen = this.SocialShareScreen;
        return (React.createElement("div", {
            className: "social-share-wrapper",
            style: __assign({}, this.addMobilePreviewStylesIfNeeded())
        }, this.state.socialShareScreenLoaded && SocialShareScreen && (React.createElement(SocialShareScreen, {
            socialShareData: this.props.socialShareData,
            eventsListener: this.props.socialShareData.actions.eventsListener,
            toggleSocialShareScreen: this.props.toggleSocialShareScreen,
            itemActionsHelper: this.props.itemActionsHelper
        }))));
    };
    /* ---------------------- Mobile Preview ---------------------- */
    SocialShareWrapper.prototype.addMobilePreviewStylesIfNeeded = function() {
        if (Utils.isMobilePreview(this.props.viewMode, this.props.deviceType)) {
            return {
                position: 'fixed',
                top: '0',
                left: this.props.getPreviewMobileEmulatorLeft() + 'px',
                width: this.state.container.width + 'px',
                height: '100%',
            };
        } else {
            return {};
        }
    };
    SocialShareWrapper.prototype.resize = function() {
        this.setState({
            container: {
                width: Utils.isMobilePreview(this.props.viewMode, this.props.deviceType) ?
                    this.props.getPreviewMobileEmulatorWidth() :
                    window.innerWidth,
            },
        });
    };
    /* ---------------------- Render ---------------------- */
    SocialShareWrapper.prototype.render = function() {
        if (this.props.showSocialSharePopup) {
            if (this.props.deviceType === GALLERY_CONSTS.deviceType.MOBILE &&
                !utils.isiOS()) {
                // Anroid device --> use Mobile native Web Share API
                return this.displayMobileWebShareApi();
            } else {
                // Desktop and iOS
                return this.displaySocailShareScreen();
            }
        } else {
            return null;
        }
    };
    return SocialShareWrapper;
}(React.Component));
export default SocialShareWrapper;
//# sourceMappingURL=SocialShareWrapper.js.map