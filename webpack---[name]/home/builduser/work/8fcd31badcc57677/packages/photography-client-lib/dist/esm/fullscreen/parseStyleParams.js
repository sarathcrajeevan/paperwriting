import {
    __assign
} from "tslib";
/* eslint-disable complexity */
import _ from 'lodash';
import {
    baseUtils as utils
} from '../utils/baseUtils';
import Consts from '../utils/consts';
export var parseStyleParams = function(styles, isStoreGallery, isMobile) {
    if (isStoreGallery === void 0) {
        isStoreGallery = false;
    }
    if (isMobile === void 0) {
        isMobile = utils.isMobile();
    }
    var flatStyles = styles &&
        (styles.numbers || styles.colors || styles.booleans || styles.fonts) ?
        __assign(__assign(__assign(__assign({}, styles.numbers), styles.colors), styles.booleans), styles.fonts) : styles;
    var styleParams = {
        allowDownload: false,
        allowSocial: true,
        loveButton: true,
        isStoreGallery: isStoreGallery,
        loveCounter: true,
        allowTitle: true,
        allowTitleExpand: true,
        allowDescriptionExpand: true,
        allowLinkExpand: true,
        allowFullscreenExpand: true,
        allowExifExpand: false,
        defaultShowInfoExpand: true,
        showInfoExpandButton: true,
        expandInfoPosition: 'SIDE',
        addToCartButtonText: '',
        galleryAlignExpand: 'left',
        fullscreenLoop: false,
        mobileSwipeAnimation: Consts.mobileSwipeAnimations.EXPAND,
        enableFullscreenVideoPlaceholder: true,
        allowFullscreenMagnifyImage: false,
        fullscreenMagnificationLevel: 2,
        allowBackgroundGradient: false,
        backgroundGrayscaleFilter: false,
        backgroundBlurFilter: 1,
        backgroundGradientDegrees: 180,
    };
    if (isMobile) {
        flatStyles = convertToMobileSettingIfNeeded(flatStyles);
    }
    _.merge(styleParams, _.pick(flatStyles, [
        'isRTL',
        'actionsColorExpand',
        'addToCartColorExpand',
        'addToCartBackColorExpand',
        'addToCartBorderColor',
        'addToCartFontExpand',
        'addToCartBorderWidth',
        'titleColorExpand',
        'descriptionColorExpand',
        'titleFontExpand',
        'descriptionFontExpand',
        'allowDownload',
        'allowSocial',
        'loveButton',
        'allowTitle',
        'allowTitleExpand',
        'allowDescriptionExpand',
        'allowExifExpand',
        'allowLinkExpand',
        'allowFullscreenExpend',
        'addToCartButtonText',
        'fullscreenLoop',
        'expandInfoPosition',
        'allowBackgroundGradient',
        'backgroundGrayscaleFilter',
        'backgroundBlurFilter',
        'backgroundGradientDegrees',
    ]));
    if (!_.isUndefined(flatStyles.expandInfoPosition)) {
        styleParams.expandInfoPosition = flatStyles.expandInfoPosition ?
            'BOTTOM' :
            'SIDE';
    }
    if (!_.isUndefined(flatStyles.loveCounter)) {
        styleParams.loveCounter = flatStyles.loveCounter === 0;
    }
    if (!_.isUndefined(flatStyles.galleryAlignExpand)) {
        switch (flatStyles.galleryAlignExpand) {
            case 0:
            default:
                styleParams.galleryAlignExpand = 'left';
                styleParams.galleryAlignExpandIcons = {
                    float: 'left',
                };
                break;
            case 1:
                styleParams.galleryAlignExpand = 'center';
                styleParams.galleryAlignExpandIcons = {
                    margin: 'auto',
                };
                break;
            case 2:
                styleParams.galleryAlignExpand = 'right';
                styleParams.galleryAlignExpandIcons = {
                    float: 'right',
                };
                break;
        }
    }
    if (!_.isUndefined(flatStyles.videoSpeed)) {
        styleParams.videoSpeed = flatStyles.videoSpeed;
    }
    if (!_.isUndefined(flatStyles.videoLoop)) {
        styleParams.videoLoop = flatStyles.videoLoop;
    }
    if (!_.isUndefined(flatStyles.enableFullscreenVideoPlaceholder)) {
        styleParams.enableFullscreenVideoPlaceholder =
            flatStyles.enableFullscreenVideoPlaceholder;
    }
    if (!_.isUndefined(flatStyles.mobileSwipeAnimation)) {
        if (String(flatStyles.mobileSwipeAnimation) === '1') {
            styleParams.mobileSwipeAnimation = Consts.mobileSwipeAnimations.FADE;
        } else if (String(flatStyles.mobileSwipeAnimation) === '2') {
            styleParams.mobileSwipeAnimation = Consts.mobileSwipeAnimations.CAROUSEL;
        } else {
            // String(flatStyles.mobileSwipeAnimation) === '0'
            styleParams.mobileSwipeAnimation = Consts.mobileSwipeAnimations.EXPAND;
        }
    }
    if (!isMobile) {
        if (!_.isUndefined(flatStyles.defaultShowInfoExpand)) {
            styleParams.defaultShowInfoExpand =
                flatStyles.defaultShowInfoExpand === 1 || flatStyles.expandInfoPosition;
            styleParams.showInfoExpandButton =
                flatStyles.defaultShowInfoExpand === 0 &&
                !flatStyles.expandInfoPosition;
        } else {
            styleParams.showInfoExpandButton = false;
        }
    } else {
        styleParams.defaultShowInfoExpand = false;
    }
    if (!_.isUndefined(flatStyles.addToCartButtonText)) {
        styleParams.addToCartButtonText = String(flatStyles.addToCartButtonText);
    }
    if (!_.isUndefined(flatStyles.allowFullscreenExpand)) {
        styleParams.allowFullscreenExpand = flatStyles.allowFullscreenExpand;
    }
    if (!_.isUndefined(flatStyles.allowFullscreenMagnifyImage)) {
        styleParams.allowFullscreenMagnifyImage =
            flatStyles.allowFullscreenMagnifyImage;
    }
    if (!_.isUndefined(flatStyles.fullscreenMagnificationLevel)) {
        styleParams.fullscreenMagnificationLevel =
            flatStyles.fullscreenMagnificationLevel / 100;
    }
    var parseBackgroundCss = function(_a) {
        var allowBackgroundGradient = _a.allowBackgroundGradient,
            backgroundGradientColor1 = _a.backgroundGradientColor1,
            backgroundGradientColor2 = _a.backgroundGradientColor2,
            _b = _a.backgroundGradientDegrees,
            backgroundGradientDegrees = _b === void 0 ? styleParams.backgroundGradientDegrees : _b;
        if (allowBackgroundGradient &&
            backgroundGradientColor1 &&
            backgroundGradientColor2 &&
            backgroundGradientDegrees) {
            var backgroundCss = "linear-gradient(" + backgroundGradientDegrees + "deg," + backgroundGradientColor1.value + "," + backgroundGradientColor2.value + ")";
            return {
                value: backgroundCss
            };
        } else {
            return flatStyles.bgColorExpand;
        }
    };
    styleParams.bgColorExpand = parseBackgroundCss(flatStyles);
    if (!_.isUndefined('itemClick')) {
        if (typeof flatStyles.itemClick === 'number') {
            switch (flatStyles.itemClick) {
                case 0:
                default:
                    styleParams.itemClick = 'expand';
                    break;
                case 1:
                    styleParams.itemClick = 'link';
                    break;
                case 2:
                    styleParams.itemClick = 'nothing';
                    break;
                case 3:
                    styleParams.itemClick = 'fullscreen';
                    break;
            }
        } else if (flatStyles.itemClick === 'expand' ||
            flatStyles.itemClick === 'link' ||
            flatStyles.itemClick === 'nothing' ||
            flatStyles.itemClick === 'fullscreen') {
            styleParams.itemClick = flatStyles.itemClick;
        } else {
            styleParams.itemClick = 'expand';
        }
    }
    styleParams.sharpParams = {
        quality: 90,
        usm: {},
    };
    if (!_.isUndefined(flatStyles.usmToggle) && flatStyles.usmToggle === true) {
        styleParams.sharpParams.allowUsm = flatStyles.usmToggle;
        if (!_.isUndefined(flatStyles.imageQuality)) {
            styleParams.sharpParams.quality = flatStyles.imageQuality;
        }
        if (!_.isUndefined(flatStyles.usm_a)) {
            styleParams.sharpParams.usm.usm_a = (flatStyles.usm_a || 0) / 100;
        }
        if (!_.isUndefined(flatStyles.usm_r)) {
            styleParams.sharpParams.usm.usm_r = flatStyles.usm_r;
        }
        if (!_.isUndefined(flatStyles.usm_t)) {
            styleParams.sharpParams.usm.usm_t = (flatStyles.usm_t || 0) / 255;
        }
    }
    return styleParams;
};

function convertToMobileSettingIfNeeded(styles) {
    Object.keys(styles).forEach(function(val) {
        if (val.startsWith('m_')) {
            styles[val.slice(2)] = styles[val];
        }
    });
    return styles;
}
//# sourceMappingURL=parseStyleParams.js.map