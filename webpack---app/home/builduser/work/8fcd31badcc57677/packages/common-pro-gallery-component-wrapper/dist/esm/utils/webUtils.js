import {
    __extends
} from "tslib";
import {
    RenderUtils
} from '@wix/photography-client-lib';
import {
    GALLERY_CONSTS
} from 'pro-gallery';
import * as lodash from './lodash';
var Utils = /** @class */ (function(_super) {
    __extends(Utils, _super);
    /* @ngInject */
    function Utils() {
        var _this = _super.call(this) || this;
        _this.init = function() {
            Object.assign(_this, lodash);
        };
        _this.init();
        return _this;
    }
    Utils.parseViewMode = function(viewMode) {
        switch (viewMode.toLowerCase()) {
            case 'editor':
                return GALLERY_CONSTS.viewMode.EDIT;
            case 'preview':
                return GALLERY_CONSTS.viewMode.PREVIEW;
            case 'site':
            default:
                return GALLERY_CONSTS.viewMode.SITE;
        }
    };
    Utils.formFactorToDeviceType = function(formFactor) {
        // santa options: mobile/desktop
        // bolt options: smartphone/desktop/tablet
        switch (formFactor.toLowerCase()) {
            case 'tablet':
                return GALLERY_CONSTS.deviceType.TABLET;
            case 'mobile':
            case 'smartphone':
                return GALLERY_CONSTS.deviceType.MOBILE;
            case 'desktop':
            default:
                return GALLERY_CONSTS.deviceType.DESKTOP;
        }
    };
    Utils.isMobilePreview = function(viewMode, deviceType) {
        return (viewMode === GALLERY_CONSTS.viewMode.PREVIEW &&
            deviceType === GALLERY_CONSTS.deviceType.MOBILE);
    };
    return Utils;
}(RenderUtils));
export {
    Utils
};
export var utils = new Utils();
//# sourceMappingURL=webUtils.js.map