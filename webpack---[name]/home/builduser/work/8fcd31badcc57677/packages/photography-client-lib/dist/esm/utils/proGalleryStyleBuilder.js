import {
    __assign
} from "tslib";
/* eslint-disable complexity */
/* eslint-disable no-eval */
import Consts from './consts';
import {
    GALLERY_CONSTS,
    addPresetOptions,
    assignByString,
    mergeNestedObjects,
} from 'pro-gallery-lib';
import {
    addCustomPresetStyles
} from './customPresetProcessor';
import coreOptions from './coreOptions';
var isUndefined = function(a) {
    return typeof a === 'undefined';
};
var baseDefaultStyles = mergeNestedObjects(coreOptions, {
    layoutParams: {
        cropRatio: 1,
    },
    gotStyleParams: false,
    selectedLayout: 0,
    allowSocial: true,
    allowDownload: false,
    allowTitle: true,
    allowDescription: false,
    loveButton: true,
    loveCounter: true,
    showVideoPlayButton: true,
    gallerySliderImageRatio: 0,
    galleryImageRatio: 2,
    collageAmount: 0.8,
    floatingImages: 0,
    viewMode: 'preview',
    galleryHorizontalAlign: 'center',
    galleryVerticalAlign: 'center',
    enableInfiniteScroll: 1,
    itemClick: 'expand',
    fixedColumns: 0,
    scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
    showArrows: true,
    hasThumbnails: false,
    galleryThumbnailsAlignment: 'bottom',
    thumbnailSpacings: 0,
    mobilePanorama: false,
    arrowsPadding: 23,
    slideshowInfoSize: 200,
    imageLoadingMode: GALLERY_CONSTS.loadingMode.COLOR,
    imageLoadingWithColorMode: GALLERY_CONSTS.loadingWithColorMode.PICKED_COLOR,
    imageRatioType: Consts.imageRatioType.FIXED,
    numberOfDisplayedItems: 3,
    expandAnimation: Consts.expandAnimations.NO_EFFECT,
    itemBorderColor: 'color-5',
    itemShadowOpacityAndColor: {
        value: 'rgba(0, 0, 0, 0.2)'
    },
    textBoxBorderColor: 'color-5',
    titleDescriptionSpace: 6,
    textsVerticalPadding: 0,
    textsHorizontalPadding: 0,
    textBoxFillColor: 'color-2',
    alwaysShowHover: false,
    previewHover: false,
    calculateTextBoxHeightMode: GALLERY_CONSTS.textBoxWidthCalculationOptions.AUTOMATIC,
    slideAnimation: GALLERY_CONSTS.slideAnimations.SCROLL,
    jsonStyleParams: '',
    designedPresetId: -1,
    galleryLayoutType: '',
    allowOverlayGradient: false,
    overlayGradientDegrees: 180,
    shouldIndexDirectShareLinkInSEO: false,
    slideTransition: Consts.slideTransitions.EASE_IN_OUT,
    slideDuration: 400,
    autoSlideshowContinuousSpeed: 50,
    overlayType: 0,
    overlayPosition: GALLERY_CONSTS.overlayPositions.BOTTOM,
    overlaySize: 100,
    overlayPadding: 0,
    overlaySizeType: GALLERY_CONSTS.overlaySizeType.PERCENT,
    arrowsVerticalPosition: GALLERY_CONSTS.arrowsVerticalPosition.ITEM_CENTER,
});
var getDefaultStyles = function(isMobile, isStoreGallery) {
    baseDefaultStyles.galleryLayout = isStoreGallery ? 2 : 0;
    baseDefaultStyles.thumbnailSize = isMobile ? 90 : 120;
    baseDefaultStyles.useCustomButton = isStoreGallery;
    baseDefaultStyles.customButtonText = isStoreGallery ?
        'Buy Now' :
        'Click here';
    baseDefaultStyles.isStoreGallery = isStoreGallery;
    return baseDefaultStyles;
};
var convertToMobileSettingIfNeeded = function(isMobile, styles) {
    if (isMobile) {
        Object.keys(styles).forEach(function(val) {
            if (val.startsWith('m_')) {
                styles[val.slice(2)] = styles[val];
            }
        });
    }
    return styles;
};
export var getProGalleryStylesImp = function(wixStyles, gotStyleParams, options) {
    var isMobile = options.isMobile,
        isStoreGallery = options.isStoreGallery,
        isOnBoarding = options.isOnBoarding;
    var defaultStateStyles = getDefaultStyles(isMobile, isStoreGallery);
    var stateStyles = {}; // Object.assign({}, this.props.styles || {}, this.props.behaviour || {}, this.newProps.styles || {}, this.newProps.behaviour || {}, window.styles || {}, window.behaviour || {});
    function canSet(wixParam, stateParam) {
        // wixStyles    =>  Styles arrived directly from wix
        // stateStyles  =>  The result of the styles format
        // wixParam     =>  The name of the parameter in wixParams
        // stateParam   =>  The name of the parameter in the formatted styles result
        if (isUndefined(stateParam)) {
            // the wixParam and stateParam have the same names
            // check that the wixParam is not already set in the stateStyles AND wixStyles have it
            return (isUndefined(stateStyles[wixParam]) && !isUndefined(wixStyles[wixParam]));
        } else {
            // the stateParam and wixParam have different names
            // check that the stateParam is not already set in the stateStyles AND wixStyles have the wixParam
            return (isUndefined(stateStyles[stateParam]) &&
                !isUndefined(wixStyles[wixParam]));
        }
    }
    wixStyles.gallerySize = wixStyles.gallerySize || 30;
    wixStyles = convertToMobileSettingIfNeeded(isMobile, wixStyles);
    if (String(wixStyles.mobilePanorama) === '1' && isMobile) {
        stateStyles.galleryLayout = 6;
        stateStyles = assignByString(stateStyles, 'layoutParams_repeatingGroupTypes', '1');
        stateStyles.isVertical = true;
        stateStyles.numberOfImagesPerRow = 1;
        stateStyles.scrollDirection = GALLERY_CONSTS.scrollDirection.VERTICAL;
    }
    // behaviour
    if (canSet('alwaysShowHover')) {
        stateStyles.alwaysShowHover = wixStyles.alwaysShowHover;
    }
    if (canSet('previewHover')) {
        stateStyles.previewHover = wixStyles.previewHover;
    }
    if (canSet('fullscreen')) {
        stateStyles.fullscreen = wixStyles.fullscreen.toString() === '0';
    } else {
        stateStyles.fullscreen = true;
    }
    if (canSet('allowSocial')) {
        stateStyles.allowSocial = wixStyles.allowSocial;
    } else {
        stateStyles.allowSocial = defaultStateStyles.allowSocial;
    }
    if (canSet('allowTitle')) {
        stateStyles.allowTitle = isOnBoarding ? true : wixStyles.allowTitle;
    }
    if (canSet('allowDescription')) {
        stateStyles.allowDescription = wixStyles.allowDescription;
    }
    if (canSet('allowOverlayGradient')) {
        var allowOverlayGradient = wixStyles.allowOverlayGradient,
            overlayGradientColor1 = wixStyles.overlayGradientColor1,
            overlayGradientColor2 = wixStyles.overlayGradientColor2,
            overlayGradientDegrees = wixStyles.overlayGradientDegrees;
        if (allowOverlayGradient) {
            stateStyles.overlayBackground = "linear-gradient(" + overlayGradientDegrees + "deg," + overlayGradientColor1.value + "," + overlayGradientColor2.value + ")";
        } else {
            stateStyles.overlayBackground = false;
        }
    }
    if (canSet('isInAdi')) {
        stateStyles.isInAdi = wixStyles.isInAdi;
    }
    if (canSet('useCustomButton')) {
        stateStyles.useCustomButton = wixStyles.useCustomButton;
    } else {
        stateStyles.useCustomButton = defaultStateStyles.useCustomButton;
    }
    if (canSet('allowDownload')) {
        stateStyles.allowDownload = wixStyles.allowDownload;
    } else {
        stateStyles.allowDownload = defaultStateStyles.allowDownload;
    }
    if (canSet('allowContextMenu')) {
        stateStyles.allowContextMenu = wixStyles.allowContextMenu;
    } else {
        stateStyles.allowContextMenu = stateStyles.allowDownload;
    }
    if (canSet('loveButton')) {
        stateStyles.loveButton = wixStyles.loveButton;
    } else {
        stateStyles.loveButton = defaultStateStyles.loveButton;
    }
    // note: 0 is true and false is 1 - super confusing (can't change it - because of backwards compatibility)
    if (canSet('loveCounter')) {
        stateStyles.loveCounter = String(wixStyles.loveCounter) === '0';
    } else {
        stateStyles.loveCounter = defaultStateStyles.loveCounter;
    }
    if (canSet('enableInfiniteScroll')) {
        stateStyles.enableInfiniteScroll =
            String(wixStyles.enableInfiniteScroll) === '1';
    } else {
        stateStyles.enableInfiniteScroll =
            String(defaultStateStyles.enableInfiniteScroll) === '1';
    }
    // design
    if (canSet('imageMargin')) {
        stateStyles.imageMargin = Number(wixStyles.imageMargin);
    }
    if (canSet('galleryMargin')) {
        stateStyles = assignByString(stateStyles, 'layoutParams_gallerySpacing', Number(wixStyles.galleryMargin));
    }
    if (canSet('isRTL')) {
        stateStyles.isRTL = String(wixStyles.isRTL) === '1';
    }
    if (canSet('isVertical')) {
        stateStyles.isVertical = String(wixStyles.isVertical) === '1';
    }
    if (canSet('imageOrientation', 'isVertical')) {
        stateStyles.isVertical = String(wixStyles.imageOrientation) === '1';
    }
    if (canSet('collageAmount')) {
        stateStyles.collageAmount = Number(wixStyles.collageAmount) / 10;
    }
    if (canSet('collageDensity')) {
        stateStyles.collageDensity = Number(wixStyles.collageDensity) / 100;
    }
    if (canSet('minItemSize')) {
        stateStyles.minItemSize = wixStyles.minItemSize;
    }
    if (canSet('gallerySize')) {
        stateStyles.gallerySize = wixStyles.gallerySize;
    }
    if (canSet('magicLayoutSeed')) {
        stateStyles.magicLayoutSeed = wixStyles.magicLayoutSeed;
    }
    if (canSet('gallerySizePx')) {
        stateStyles.gallerySizePx = wixStyles.gallerySizePx;
    }
    if (canSet('gallerySizeRatio')) {
        stateStyles.gallerySizeRatio = wixStyles.gallerySizeRatio;
    }
    if (canSet('gallerySizeType')) {
        stateStyles.gallerySizeType = ['smart', 'px', 'ratio'][Number(wixStyles.gallerySizeType)];
    }
    if (canSet('gridStyle')) {
        stateStyles.gridStyle = wixStyles.gridStyle;
    }
    if (canSet('groupSize')) {
        stateStyles.groupSize = Number(wixStyles.groupSize);
    }
    if (canSet('chooseBestGroup')) {
        stateStyles.chooseBestGroup = String(wixStyles.chooseBestGroup) === '1';
    }
    if (canSet('groupTypes')) {
        stateStyles.groupTypes = String(wixStyles.groupTypes);
    }
    if (canSet('rotatingGroupTypes')) {
        stateStyles = assignByString(stateStyles, 'layoutParams_repeatingGroupTypes', String(wixStyles.rotatingGroupTypes));
    }
    if (canSet('rotatingCropRatios')) {
        stateStyles.rotatingCropRatios = String(wixStyles.rotatingCropRatios);
    }
    if (canSet('itemBorderWidth')) {
        stateStyles.itemBorderWidth = Number(wixStyles.itemBorderWidth);
    }
    if (canSet('itemBorderColor')) {
        stateStyles.itemBorderColor = wixStyles.itemBorderColor;
    }
    if (canSet('itemBorderRadius')) {
        stateStyles.itemBorderRadius = Number(wixStyles.itemBorderRadius);
    }
    if (canSet('itemShadowOpacityAndColor')) {
        stateStyles.itemShadowOpacityAndColor = wixStyles.itemShadowOpacityAndColor;
    }
    if (canSet('itemShadowBlur')) {
        stateStyles.itemShadowBlur = Number(wixStyles.itemShadowBlur);
    }
    if (canSet('itemShadowDirection')) {
        stateStyles.itemShadowDirection = Number(wixStyles.itemShadowDirection);
    }
    if (canSet('itemShadowSize')) {
        stateStyles.itemShadowSize = Number(wixStyles.itemShadowSize);
    }
    if (canSet('itemEnableShadow')) {
        stateStyles.itemEnableShadow = wixStyles.itemEnableShadow;
    }
    // testing a new way (with less text and less "ifs") TODO - ask guy if i should adopt it (90% of the items)
    // const styleFnMap = {
    // 	imageMargin: () =>  Number(wixStyles.imageMargin)
    // }
    // for (let key of Object.keys(wixStyles)) {
    // 	if (styleFnMap[key] && canSet(key)) {
    // 		stateStyles[key] = styleFnMap[key]()
    // 	}
    // }
    if (canSet('floatingImages')) {
        stateStyles.floatingImages = Number(wixStyles.floatingImages) / 100;
    }
    if (canSet('thumbnailSpacings')) {
        stateStyles.thumbnailSpacings = Number(wixStyles.thumbnailSpacings) / 2;
    }
    if (canSet('cubeImages')) {
        stateStyles.cubeImages = String(wixStyles.cubeImages) === '1';
    }
    if (canSet('smartCrop')) {
        stateStyles.smartCrop = String(wixStyles.smartCrop) === '1';
    }
    if (canSet('cubeRatio')) {
        stateStyles = assignByString(stateStyles, 'layoutParams_cropRatio', Number(eval(wixStyles.cubeRatio)));
    }
    if (canSet('imageResize', 'cubeType')) {
        stateStyles.cubeType =
            String(wixStyles.imageResize) === '1' ? 'fit' : 'fill';
        if (stateStyles.cubeType === 'fit') {
            if (stateStyles.cropOnlyFill === true) {
                stateStyles.cubeImages = false;
            }
        }
    }
    // TODO, I changed it so that we will have the wixStyles, in the renderer I need to change the function to have the functionality of isSlider / isGrid - V
    // TODO should I add the new style names to the defaults as undefined? - no, i dont (should check with guy to make sure)
    if (canSet('imageRatioType')) {
        if (String(wixStyles.imageRatioType) === '1') {
            stateStyles.imageRatioType = Consts.imageRatioType.RESPONSIVE;
        } else {
            // String(wixStyles.imageRatioType) === '0'
            stateStyles.imageRatioType = Consts.imageRatioType.FIXED;
        }
    }
    if (canSet('numberOfDisplayedItems')) {
        stateStyles.numberOfDisplayedItems = Number(wixStyles.numberOfDisplayedItems);
    } else {
        stateStyles.numberOfDisplayedItems =
            defaultStateStyles.numberOfDisplayedItems;
    }
    if (stateStyles.imageRatioType === Consts.imageRatioType.RESPONSIVE) {
        stateStyles.gallerySliderImageRatio = (100 / Number(stateStyles.numberOfDisplayedItems)).toFixed(2) + "%/100%";
    } else if (canSet('gallerySliderImageRatio', 'cubeRatio')) {
        // stateStyles.imageRatioType === Consts.imageRatioType.FIXED
        stateStyles.gallerySliderImageRatio = Number(eval(['16/9', '4/3', '1', '3/4', '9/16'][Number(wixStyles.gallerySliderImageRatio)]));
    } else if (isUndefined(stateStyles.cubeRatio)) {
        stateStyles.gallerySliderImageRatio = Number(eval(['16/9', '4/3', '1', '3/4', '9/16'][Number(defaultStateStyles.gallerySliderImageRatio)]));
    }
    if (canSet('galleryImageRatio', 'cubeRatio')) {
        stateStyles.galleryImageRatioFromWix = Number(eval(['16/9', '4/3', '1', '3/4', '9/16'][Number(wixStyles.galleryImageRatio)]));
    }
    // check if slider and pass cropRatio to the gallery instead of gallerySliderImageRatio / galleryImageRatioFromWix
    if (String(wixStyles.galleryLayout) === '4') {
        stateStyles = assignByString(stateStyles, 'layoutParams_cropRatio', stateStyles.gallerySliderImageRatio);
    } else if (String(wixStyles.galleryLayout) === '2' ||
        (isStoreGallery && wixStyles.galleryLayout === undefined)) {
        stateStyles = assignByString(stateStyles, 'layoutParams_cropRatio', stateStyles.galleryImageRatioFromWix ||
            defaultStateStyles.layoutParams.cropRatio);
    }
    if (canSet('fixedColumns')) {
        stateStyles.fixedColumns = Number(wixStyles.fixedColumns);
    }
    if (canSet('groupsPerStrip')) {
        stateStyles.groupsPerStrip = Number(wixStyles.groupsPerStrip);
    }
    // TODO move to renderer - need to split again - V
    if (canSet('numberOfImagesPerRow')) {
        stateStyles.numberOfImagesPerRow = Number(wixStyles.numberOfImagesPerRow);
    } else {
        stateStyles.numberOfImagesPerRow = defaultStateStyles.numberOfImagesPerRow;
    }
    if (isMobile) {
        // we want the product to be that if the user didnt change the number per row in mobile settings it will still show as 1
        var numberOfImagesPerRowWasntChangedInMobile = typeof wixStyles.m_numberOfImagesPerRow === 'undefined';
        if (numberOfImagesPerRowWasntChangedInMobile) {
            stateStyles.numberOfImagesPerRow = 1;
        }
    }
    if (canSet('numberOfImagesPerCol')) {
        stateStyles.numberOfImagesPerCol = Number(wixStyles.numberOfImagesPerCol);
    }
    if (canSet('galleryThumbnailsAlignment')) {
        stateStyles.galleryThumbnailsAlignment = ['bottom', 'left', 'top', 'right'][wixStyles.galleryThumbnailsAlignment];
    }
    // There's some kunch-ptant here so support opacity, checkout .default css className usage
    // (If this style isn't defined, we add 'default' to the className, and there we all the default params)
    if (canSet('itemOpacity')) {
        stateStyles.itemOpacity = wixStyles.itemOpacity;
    }
    if (canSet('overlayBackground')) {
        stateStyles.overlayBackground = wixStyles.overlayBackground;
    }
    if (canSet('galleryLayout')) {
        stateStyles.galleryLayout = wixStyles.galleryLayout;
    } else {
        stateStyles.galleryLayout = defaultStateStyles.galleryLayout;
    }
    if (canSet('scrollDirection')) {
        stateStyles.scrollDirection = wixStyles.scrollDirection;
    } else {
        stateStyles.scrollDirection = defaultStateStyles.scrollDirection;
    }
    // const isHorizontalLayout = () => { //taken care of by addPresetOptions and processLayout
    //   return (
    //     String(stateStyles.galleryLayout) === '3' || // Thumbnails
    //     String(stateStyles.galleryLayout) === '4' || // Slider
    //     String(stateStyles.galleryLayout) === '5' || // Slideshow
    //     String(stateStyles.galleryLayout) === '7' || // Column
    //     (String(stateStyles.galleryLayout) === '2' &&
    //       String(stateStyles.scrollDirection) === '1') || // Grid && scrollDirectionHorizontal
    //     (String(stateStyles.galleryLayout) === '0' &&
    //       String(stateStyles.scrollDirection) === '1')
    //   ); // Collage && scrollDirectionHorizontal
    // };
    // stateStyles.scrollDirection = isHorizontalLayout() ? scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL : scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL;
    // if (stateStyles.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL) {
    //   // if the gallery is horizontal, use horizontal orientation only
    //   stateStyles.isVertical = false;
    // }
    if (canSet('galleryType')) {
        stateStyles.galleryType = wixStyles.galleryType;
    }
    if (canSet('titlePlacement')) {
        stateStyles.titlePlacement = {
            '0': GALLERY_CONSTS.placements.SHOW_BELOW,
            '2': GALLERY_CONSTS.placements.SHOW_ABOVE,
        }[String(wixStyles.titlePlacement)] || GALLERY_CONSTS.placements.SHOW_ON_HOVER;
    }
    if (canSet('hoveringBehaviour')) {
        if (String(wixStyles.hoveringBehaviour) === '1') {
            stateStyles.hoveringBehaviour =
                GALLERY_CONSTS.infoBehaviourOnHover.DISAPPEARS;
        } else if (String(wixStyles.hoveringBehaviour) === '2') {
            stateStyles.hoveringBehaviour =
                GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE;
        } else {
            // String(wixStyles.hoveringBehaviour) === '0'
            stateStyles.hoveringBehaviour =
                GALLERY_CONSTS.infoBehaviourOnHover.APPEARS;
        }
    }
    if (canSet('overlaySizeType') && String(wixStyles.overlaySizeType) === '1') {
        stateStyles.overlaySizeType = GALLERY_CONSTS.overlaySizeType.PIXEL;
        if (canSet('overlaySizePixel')) {
            stateStyles.overlaySize = Number(wixStyles.overlaySizePixel);
        }
    } else {
        stateStyles.overlaySizeType = GALLERY_CONSTS.overlaySizeType.PERCENT;
        if (canSet('overlaySizePercent')) {
            stateStyles.overlaySize = Number(wixStyles.overlaySizePercent);
        }
    }
    if (canSet('overlayPosition')) {
        var overlayPosition = String(wixStyles.overlayPosition);
        var _a = GALLERY_CONSTS.overlayPositions,
            LEFT = _a.LEFT,
            RIGHT = _a.RIGHT,
            BOTTOM = _a.BOTTOM,
            TOP = _a.TOP,
            CENTERED_VERTICALLY = _a.CENTERED_VERTICALLY,
            CENTERED_HORIZONTALLY = _a.CENTERED_HORIZONTALLY;
        var mapOverlayPositionToString = {
            0: LEFT,
            1: RIGHT,
            2: BOTTOM,
            3: TOP,
            4: CENTERED_VERTICALLY,
            5: CENTERED_HORIZONTALLY,
        };
        var currentPosition = mapOverlayPositionToString[overlayPosition] || BOTTOM;
        stateStyles.overlayPosition = currentPosition;
    }
    if (canSet('overlayPadding')) {
        stateStyles.overlayPadding = Number(wixStyles.overlayPadding);
    }
    // overlayType sp only in wix, '0' is full overlay.
    if (canSet('overlayType') && String(wixStyles.overlayType) === '0') {
        stateStyles.overlaySizeType = defaultStateStyles.overlaySizeType;
        stateStyles.overlaySize = defaultStateStyles.overlaySize;
        stateStyles.overlayPosition = defaultStateStyles.overlayPosition;
        stateStyles.overlayPadding = defaultStateStyles.overlayPadding;
    }
    // in PG settings in editor, if !allowTitle && !allowDescription, the titlePlacement and the hovering behaviour settings will not be shown
    // and we will like the user to get the default setting of those two
    if (!isUndefined(stateStyles.allowTitle) &&
        !stateStyles.allowTitle &&
        !isUndefined(stateStyles.allowDescription) &&
        !stateStyles.allowDescription) {
        stateStyles.titlePlacement = GALLERY_CONSTS.placements.SHOW_ON_HOVER;
        stateStyles.hoveringBehaviour = GALLERY_CONSTS.infoBehaviourOnHover.APPEARS;
    }
    if (canSet('arrowsVerticalPosition')) {
        stateStyles.arrowsVerticalPosition = {
            0: GALLERY_CONSTS.arrowsVerticalPosition.ITEM_CENTER,
            1: GALLERY_CONSTS.arrowsVerticalPosition.IMAGE_CENTER,
            2: GALLERY_CONSTS.arrowsVerticalPosition.INFO_CENTER,
        }[wixStyles.arrowsVerticalPosition];
    } else if (GALLERY_CONSTS.isLayout('SLIDESHOW')(stateStyles)) {
        stateStyles.arrowsVerticalPosition = GALLERY_CONSTS.arrowsVerticalPosition.IMAGE_CENTER;
    }
    if (canSet('scrollAnimation')) {
        // should not allow scrollAnimation in Thumbnails and Slideshow
        var shouldNotAllowHorizontalScrollAnimation = String(stateStyles.galleryLayout) === '3' || // Thumbnails
            String(stateStyles.galleryLayout) === '5'; // Slideshow
        if (shouldNotAllowHorizontalScrollAnimation) {
            stateStyles.scrollAnimation = GALLERY_CONSTS.scrollAnimations.NO_EFFECT;
        } else if (String(wixStyles.scrollAnimation) === '1') {
            stateStyles.scrollAnimation = GALLERY_CONSTS.scrollAnimations.FADE_IN;
        } else if (String(wixStyles.scrollAnimation) === '2') {
            stateStyles.scrollAnimation = GALLERY_CONSTS.scrollAnimations.GRAYSCALE;
        } else if (String(wixStyles.scrollAnimation) === '3') {
            stateStyles.scrollAnimation = GALLERY_CONSTS.scrollAnimations.SLIDE_UP;
        } else if (String(wixStyles.scrollAnimation) === '4') {
            stateStyles.scrollAnimation = GALLERY_CONSTS.scrollAnimations.EXPAND;
        } else if (String(wixStyles.scrollAnimation) === '5') {
            stateStyles.scrollAnimation = GALLERY_CONSTS.scrollAnimations.SHRINK;
        } else if (String(wixStyles.scrollAnimation) === '6') {
            stateStyles.scrollAnimation = GALLERY_CONSTS.scrollAnimations.ZOOM_OUT;
        } else if (String(wixStyles.scrollAnimation) === '7') {
            stateStyles.scrollAnimation = GALLERY_CONSTS.scrollAnimations.ONE_COLOR;
        } else {
            // String(wixStyles.scrollAnimation) === '0'
            stateStyles.scrollAnimation = GALLERY_CONSTS.scrollAnimations.NO_EFFECT;
        }
    }
    if (canSet('slideAnimation')) {
        // should allow slideAnimation only in Thumbnails and Slideshow
        var shouldAllowSlideAnimation = String(stateStyles.galleryLayout) === '3' || // Thumbnails
            String(stateStyles.galleryLayout) === '5'; // Slideshow
        if (!shouldAllowSlideAnimation) {
            stateStyles.slideAnimation = GALLERY_CONSTS.slideAnimations.SCROLL;
        } else {
            var slideAnimation = String(wixStyles.slideAnimation);
            switch (slideAnimation) {
                case '1':
                    stateStyles.slideAnimation = GALLERY_CONSTS.slideAnimations.FADE;
                    break;
                case '2':
                    stateStyles.slideAnimation = GALLERY_CONSTS.slideAnimations.DECK;
                    break;
                case '0':
                default:
                    stateStyles.slideAnimation = GALLERY_CONSTS.slideAnimations.SCROLL;
                    break;
            }
        }
    } else {
        stateStyles.slideAnimation = GALLERY_CONSTS.slideAnimations.SCROLL;
    }
    if (canSet('slideTransition')) {
        // should allow slideAnimation only in Thumbnails and Slideshow
        var slideTransition = String(wixStyles.slideTransition);
        switch (slideTransition) {
            case '0':
                stateStyles.slideTransition = Consts.slideTransitions.LINEAR;
                break;
            case '2':
                stateStyles.slideTransition = Consts.slideTransitions.EASE_OUT;
                break;
            case '3':
                stateStyles.slideTransition = Consts.slideTransitions.EASE_IN;
                break;
            case '4':
                stateStyles.slideTransition = Consts.slideTransitions.BOUNCE_IN;
                break;
            case '5':
                stateStyles.slideTransition = Consts.slideTransitions.BOUNCE_OUT;
                break;
            case '6':
                stateStyles.slideTransition = Consts.slideTransitions.BOUNCE_IN_OUT;
                break;
            case '7':
                stateStyles.slideTransition = Consts.slideTransitions.EXPO;
                break;
            case '1':
            default:
                stateStyles.slideTransition = Consts.slideTransitions.EASE_IN_OUT;
                break;
        }
    }
    if (canSet('scrollDuration')) {
        stateStyles.scrollDuration = Number(wixStyles.scrollDuration) * 1000 || 0;
    }
    if (canSet('overlayAnimation')) {
        var overlayAnimation = String(wixStyles.overlayAnimation);
        var _b = GALLERY_CONSTS.overlayAnimations,
            NO_EFFECT = _b.NO_EFFECT,
            FADE_IN = _b.FADE_IN,
            EXPAND = _b.EXPAND,
            SLIDE_UP = _b.SLIDE_UP,
            SLIDE_RIGHT = _b.SLIDE_RIGHT,
            SLIDE_DOWN = _b.SLIDE_DOWN,
            SLIDE_LEFT = _b.SLIDE_LEFT;
        var mapOverlayAnimationToString = {
            0: NO_EFFECT,
            1: FADE_IN,
            2: EXPAND,
            3: SLIDE_UP,
            4: SLIDE_RIGHT,
            5: SLIDE_DOWN,
            6: SLIDE_LEFT,
        };
        stateStyles.overlayAnimation =
            mapOverlayAnimationToString[overlayAnimation] || NO_EFFECT;
    }
    if (canSet('imageHoverAnimation')) {
        if (String(wixStyles.imageHoverAnimation) === '1') {
            stateStyles.imageHoverAnimation =
                GALLERY_CONSTS.imageHoverAnimations.ZOOM_IN;
        } else if (String(wixStyles.imageHoverAnimation) === '2') {
            stateStyles.imageHoverAnimation =
                GALLERY_CONSTS.imageHoverAnimations.BLUR;
        } else if (String(wixStyles.imageHoverAnimation) === '3') {
            stateStyles.imageHoverAnimation =
                GALLERY_CONSTS.imageHoverAnimations.GRAYSCALE;
        } else if (String(wixStyles.imageHoverAnimation) === '4') {
            stateStyles.imageHoverAnimation =
                GALLERY_CONSTS.imageHoverAnimations.SHRINK;
        } else if (String(wixStyles.imageHoverAnimation) === '5') {
            stateStyles.imageHoverAnimation =
                GALLERY_CONSTS.imageHoverAnimations.INVERT;
        } else if (String(wixStyles.imageHoverAnimation) === '6') {
            stateStyles.imageHoverAnimation =
                GALLERY_CONSTS.imageHoverAnimations.COLOR_IN;
        } else if (String(wixStyles.imageHoverAnimation) === '7') {
            stateStyles.imageHoverAnimation =
                GALLERY_CONSTS.imageHoverAnimations.DARKENED;
        } else {
            // String(wixStyles.imageHoverAnimation) === '0'
            stateStyles.imageHoverAnimation =
                GALLERY_CONSTS.imageHoverAnimations.NO_EFFECT;
        }
    }
    if (canSet('expandAnimation')) {
        if (String(wixStyles.expandAnimation) === '1') {
            stateStyles.expandAnimation = Consts.expandAnimations.EXPAND;
        } else if (String(wixStyles.expandAnimation) === '2') {
            stateStyles.expandAnimation = Consts.expandAnimations.FADE_IN;
        } else if (String(wixStyles.expandAnimation) === '3') {
            stateStyles.expandAnimation = Consts.expandAnimations.ZOOM;
        } else {
            // String(wixStyles.expandAnimation) === '0'
            stateStyles.expandAnimation = Consts.expandAnimations.NO_EFFECT;
        }
    }
    if (canSet('itemFont')) {
        stateStyles.itemFont = wixStyles.itemFont;
    }
    if (canSet('itemFontSlideshow')) {
        stateStyles.itemFontSlideshow = wixStyles.itemFontSlideshow;
    }
    if (canSet('itemDescriptionFontSlideshow')) {
        stateStyles.itemDescriptionFontSlideshow =
            wixStyles.itemDescriptionFontSlideshow;
    }
    if (canSet('itemDescriptionFont')) {
        stateStyles.itemDescriptionFont = wixStyles.itemDescriptionFont;
    }
    if (canSet('itemFontColor')) {
        stateStyles.itemFontColor = wixStyles.itemFontColor;
    }
    // We need another param because the color should be different on hover(white on black) or underneath (black on white)
    if (canSet('itemFontColorSlideshow')) {
        stateStyles.itemFontColorSlideshow = wixStyles.itemFontColorSlideshow;
    }
    if (canSet('itemDescriptionFontColor')) {
        stateStyles.itemDescriptionFontColor = wixStyles.itemDescriptionFontColor;
    }
    if (canSet('itemDescriptionFontColorSlideshow')) {
        stateStyles.itemDescriptionFontColorSlideshow =
            wixStyles.itemDescriptionFontColorSlideshow;
    }
    if (canSet('textBoxFillColor')) {
        stateStyles.textBoxFillColor = wixStyles.textBoxFillColor;
    }
    if (canSet('textsVerticalPadding')) {
        stateStyles.textsVerticalPadding = wixStyles.textsVerticalPadding;
    } else {
        stateStyles.textsVerticalPadding = defaultStateStyles.textsVerticalPadding;
    }
    if (canSet('textsHorizontalPadding')) {
        stateStyles.textsHorizontalPadding = wixStyles.textsHorizontalPadding;
    } else {
        stateStyles.textsHorizontalPadding =
            defaultStateStyles.textsHorizontalPadding;
    }
    if (canSet('textBoxBorderRadius')) {
        stateStyles.textBoxBorderRadius = Number(wixStyles.textBoxBorderRadius);
    }
    if (canSet('textBoxBorderWidth')) {
        stateStyles.textBoxBorderWidth = Number(wixStyles.textBoxBorderWidth);
    }
    if (canSet('textBoxBorderColor')) {
        stateStyles.textBoxBorderColor = wixStyles.textBoxBorderColor;
    }
    if (canSet('titleDescriptionSpace')) {
        stateStyles.titleDescriptionSpace = Number(wixStyles.titleDescriptionSpace);
    } else {
        stateStyles.titleDescriptionSpace =
            defaultStateStyles.titleDescriptionSpace;
    }
    if (canSet('textImageSpace')) {
        stateStyles.textImageSpace = wixStyles.textImageSpace;
    }
    if (canSet('imageInfoType')) {
        var selectedImageInfoType = void 0;
        if (String(wixStyles.imageInfoType) === '0') {
            selectedImageInfoType = GALLERY_CONSTS.infoType.NO_BACKGROUND;
        } else if (String(wixStyles.imageInfoType) === '1') {
            selectedImageInfoType = GALLERY_CONSTS.infoType.ATTACHED_BACKGROUND;
        } else if (String(wixStyles.imageInfoType) === '2') {
            selectedImageInfoType = GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND;
        } else {
            selectedImageInfoType = GALLERY_CONSTS.infoType.NO_BACKGROUND;
        }
        stateStyles.imageInfoType = selectedImageInfoType;
    }
    if (canSet('galleryHorizontalAlign')) {
        var horizontalAlign = void 0;
        var textAlign = void 0;
        switch (wixStyles.galleryHorizontalAlign) {
            case 0:
                horizontalAlign = 'flex-start';
                textAlign = 'left';
                break;
            case 1:
            default:
                horizontalAlign = 'center';
                textAlign = 'center';
                break;
            case 2:
                horizontalAlign = 'flex-end';
                textAlign = 'right';
                break;
        }
        stateStyles.galleryHorizontalAlign = horizontalAlign;
        stateStyles.galleryTextAlign = textAlign;
    } else {
        stateStyles.galleryHorizontalAlign =
            defaultStateStyles.galleryHorizontalAlign;
        stateStyles.galleryTextAlign = defaultStateStyles.galleryTextAlign;
    }
    if (canSet('galleryVerticalAlign')) {
        var verticalAlign = void 0;
        switch (wixStyles.galleryVerticalAlign) {
            case 0:
            default:
                verticalAlign = 'flex-start';
                break;
            case 1:
                verticalAlign = 'center';
                break;
            case 2:
                verticalAlign = 'flex-end';
                break;
        }
        stateStyles.galleryVerticalAlign = verticalAlign;
    } else {
        stateStyles.galleryVerticalAlign = defaultStateStyles.galleryVerticalAlign;
    }
    if (canSet('itemClick')) {
        if (typeof wixStyles.itemClick === 'number') {
            switch (wixStyles.itemClick) {
                case 0:
                default:
                    stateStyles.itemClick = 'expand';
                    break;
                case 1:
                    stateStyles.itemClick = 'link';
                    break;
                case 2:
                    stateStyles.itemClick = 'nothing';
                    break;
                case 3:
                    stateStyles.itemClick = 'fullscreen';
                    break;
            }
        } else if (wixStyles.itemClick === 'expand' ||
            wixStyles.itemClick === 'link' ||
            wixStyles.itemClick === 'nothing' ||
            wixStyles.itemClick === 'fullscreen') {
            stateStyles.itemClick = wixStyles.itemClick;
        } else {
            stateStyles.itemClick = 'expand';
        }
    }
    if (canSet('loadMoreButtonText')) {
        stateStyles.loadMoreButtonText = String(wixStyles.loadMoreButtonText);
    }
    if (canSet('loadMoreButtonFont')) {
        stateStyles.loadMoreButtonFont = wixStyles.loadMoreButtonFont;
    }
    if (canSet('loadMoreButtonFontColor')) {
        stateStyles.loadMoreButtonFontColor = wixStyles.loadMoreButtonFontColor;
    }
    if (canSet('loadMoreButtonColor')) {
        stateStyles.loadMoreButtonColor = wixStyles.loadMoreButtonColor;
    }
    if (canSet('loadMoreButtonBorderWidth')) {
        stateStyles.loadMoreButtonBorderWidth = wixStyles.loadMoreButtonBorderWidth;
    }
    if (canSet('loadMoreButtonBorderColor')) {
        stateStyles.loadMoreButtonBorderColor = wixStyles.loadMoreButtonBorderColor;
    }
    if (canSet('loadMoreButtonBorderRadius')) {
        stateStyles.loadMoreButtonBorderRadius =
            wixStyles.loadMoreButtonBorderRadius;
    }
    if (canSet('autoSlideshowContinuousSpeed')) {
        stateStyles.autoSlideshowContinuousSpeed =
            Number(wixStyles.autoSlideshowContinuousSpeed) || 0;
    }
    if (canSet('autoSlideshowType')) {
        // should allow Continuous Auto Slide only when slideAnimation is scroll
        var shouldAllowContinuousAutoSlide = stateStyles.slideAnimation === GALLERY_CONSTS.slideAnimations.SCROLL;
        if (!shouldAllowContinuousAutoSlide) {
            stateStyles.autoSlideshowType = Consts.autoSlideshowTypes.INTERVAL;
        } else {
            var autoSlideshowType = String(wixStyles.autoSlideshowType);
            switch (autoSlideshowType) {
                case '0':
                    stateStyles.autoSlideshowType = Consts.autoSlideshowTypes.INTERVAL;
                    break;
                case '1':
                    stateStyles.autoSlideshowType = Consts.autoSlideshowTypes.CONTINUOUS;
                    break;
                default:
                    stateStyles.autoSlideshowType = Consts.autoSlideshowTypes.INTERVAL;
                    break;
            }
        }
    }
    if (canSet('customButtonText')) {
        stateStyles.customButtonText = String(wixStyles.customButtonText);
    } else {
        stateStyles.customButtonText = defaultStateStyles.customButtonText;
    }
    // #region Extrnal custom button (slideshow, above, below, left, right)
    if (canSet('customButtonFontForHover')) {
        // text font
        stateStyles.customButtonFontForHover = wixStyles.customButtonFontForHover;
    }
    if (canSet('customButtonFontColorForHover')) {
        // text color
        stateStyles.customButtonFontColorForHover =
            wixStyles.customButtonFontColorForHover;
    }
    if (canSet('externalCustomButtonColor')) {
        stateStyles.externalCustomButtonColor = wixStyles.externalCustomButtonColor;
    }
    if (canSet('externalCustomButtonBorderWidth')) {
        stateStyles.externalCustomButtonBorderWidth =
            wixStyles.externalCustomButtonBorderWidth;
    }
    if (canSet('externalCustomButtonBorderColor')) {
        stateStyles.externalCustomButtonBorderColor =
            wixStyles.externalCustomButtonBorderColor;
    }
    if (canSet('externalCustomButtonBorderRadius')) {
        stateStyles.externalCustomButtonBorderRadius =
            wixStyles.externalCustomButtonBorderRadius;
    }
    // #endregion
    // #region On item custom button (show on hover)
    if (canSet('customButtonFont')) {
        stateStyles.customButtonFont = wixStyles.customButtonFont;
    }
    if (canSet('customButtonFontColor')) {
        stateStyles.customButtonFontColor = wixStyles.customButtonFontColor;
    }
    if (canSet('customButtonColor')) {
        stateStyles.customButtonColor = wixStyles.customButtonColor;
    }
    if (canSet('customButtonBorderWidth')) {
        stateStyles.customButtonBorderWidth = wixStyles.customButtonBorderWidth;
    }
    if (canSet('customButtonBorderColor')) {
        stateStyles.customButtonBorderColor = wixStyles.customButtonBorderColor;
    }
    if (canSet('customButtonBorderRadius')) {
        stateStyles.customButtonBorderRadius = wixStyles.customButtonBorderRadius;
    }
    // #endregion
    if (canSet('loadMoreAmount')) {
        if (String(wixStyles.loadMoreAmount) === '1') {
            stateStyles.loadMoreAmount = 'partial';
        } else {
            // String(wixStyles.loadMoreAmount) === '0'
            stateStyles.loadMoreAmount = 'all';
        }
    }
    // defaults - need to leave here to have it defined
    stateStyles.sharpParams = {
        quality: 90,
        usm: {},
    };
    if (canSet('imageQuality')) {
        stateStyles.sharpParams.quality = wixStyles.imageQuality;
    }
    if (canSet('usmToggle')) {
        stateStyles.sharpParams.allowUsm = wixStyles.usmToggle;
        if (wixStyles.usmToggle === true) {
            if (canSet('usm_a')) {
                stateStyles.sharpParams.usm.usm_a = (wixStyles.usm_a || 0) / 100;
            }
            if (canSet('usm_r')) {
                stateStyles.sharpParams.usm.usm_r = wixStyles.usm_r;
            }
            if (canSet('usm_t')) {
                stateStyles.sharpParams.usm.usm_t = (wixStyles.usm_t || 0) / 255;
            }
        }
    }
    if (canSet('videoPlay')) {
        switch (wixStyles.videoPlay) {
            case 0:
            default:
                stateStyles.videoPlay = 'hover';
                break;
            case 1:
                stateStyles.videoPlay = 'auto';
                break;
            case 2:
                stateStyles.videoPlay = 'onClick';
                break;
        }
    }
    if (canSet('videoSound')) {
        stateStyles.videoSound = wixStyles.videoSound;
    }
    if (canSet('videoSpeed')) {
        stateStyles.videoSpeed = wixStyles.videoSpeed;
    }
    if (canSet('videoLoop')) {
        stateStyles.videoLoop = wixStyles.videoLoop;
    }
    if (canSet('showVideoPlayButton')) {
        stateStyles.showVideoPlayButton = wixStyles.showVideoPlayButton;
    }
    if (canSet('mobilePanorama')) {
        stateStyles.mobilePanorama = String(wixStyles.mobilePanorama) === '1';
    }
    if (canSet('placeGroupsLtr')) {
        stateStyles.placeGroupsLtr = String(wixStyles.placeGroupsLtr) === '1';
    }
    if (canSet('isAutoSlideshow')) {
        stateStyles.isAutoSlideshow = String(wixStyles.isAutoSlideshow) === '1';
    }
    if (canSet('slideshowLoop')) {
        stateStyles.slideshowLoop = String(wixStyles.slideshowLoop) === '1';
    }
    if (canSet('playButtonForAutoSlideShow')) {
        stateStyles.playButtonForAutoSlideShow =
            String(wixStyles.playButtonForAutoSlideShow) === '1';
    }
    if (canSet('pauseAutoSlideshowOnHover')) {
        stateStyles.pauseAutoSlideshowOnHover = wixStyles.pauseAutoSlideshowOnHover;
    }
    if (canSet('allowSlideshowCounter')) {
        stateStyles.allowSlideshowCounter = wixStyles.allowSlideshowCounter;
    }
    if (canSet('autoSlideshowInterval')) {
        stateStyles.autoSlideshowInterval =
            Number(wixStyles.autoSlideshowInterval) || 0;
    }
    if (canSet('showArrows')) {
        stateStyles.showArrows = wixStyles.showArrows;
    } else if (isUndefined(stateStyles.showArrows)) {
        stateStyles.showArrows = defaultStateStyles.showArrows;
    }
    if (canSet('arrowsSize')) {
        stateStyles.arrowsSize = Number(wixStyles.arrowsSize) || 23;
    }
    if (canSet('arrowsColor')) {
        stateStyles.arrowsColor = wixStyles.arrowsColor;
    }
    if (canSet('arrowsPosition')) {
        stateStyles.arrowsPosition =
            Number(stateStyles.showArrows) === 1 ? wixStyles.arrowsPosition : 0;
    }
    stateStyles.arrowsPadding = canSet('arrowsPadding') ?
        wixStyles.arrowsPadding :
        defaultStateStyles.arrowsPadding;
    if (canSet('oneColorAnimationColor')) {
        stateStyles.oneColorAnimationColor = wixStyles.oneColorAnimationColor;
    }
    if (canSet('slideshowInfoSize')) {
        stateStyles.slideshowInfoSize = Number(wixStyles.slideshowInfoSize);
    }
    if (canSet('thumbnailSize')) {
        stateStyles.thumbnailSize = isMobile ?
            defaultStateStyles.thumbnailSize :
            Number(wixStyles.thumbnailSize) || defaultStateStyles.thumbnailSize;
    }
    if (canSet('responsive')) {
        stateStyles.responsive = wixStyles.responsive;
    } else {
        stateStyles.responsive = false;
    }
    if (canSet('imageLoadingMode')) {
        if (String(wixStyles.imageLoadingMode) === '1') {
            stateStyles.imageLoadingMode = GALLERY_CONSTS.loadingMode.COLOR;
        } else {
            // String(wixStyles.imageLoadingMode) === '0'
            stateStyles.imageLoadingMode = GALLERY_CONSTS.loadingMode.BLUR;
        }
    }
    if (canSet('imageLoadingWithColorMode')) {
        if (String(wixStyles.imageLoadingWithColorMode) === '1') {
            stateStyles.imageLoadingWithColorMode =
                GALLERY_CONSTS.loadingWithColorMode.MAIN_COLOR;
        } else {
            // String(wixStyles.imageLoadingWithColorMode) === '0'
            stateStyles.imageLoadingWithColorMode =
                GALLERY_CONSTS.loadingWithColorMode.PICKED_COLOR;
        }
    }
    if (canSet('textBoxHeight')) {
        stateStyles.textBoxHeight = wixStyles.textBoxHeight;
    }
    if (canSet('calculateTextBoxHeightMode')) {
        if (String(wixStyles.calculateTextBoxHeightMode) === '1') {
            stateStyles.calculateTextBoxHeightMode =
                GALLERY_CONSTS.textBoxWidthCalculationOptions.MANUAL;
        } else {
            // String(wixStyles.calculateTextBoxHeightMode) === '0'
            stateStyles.calculateTextBoxHeightMode =
                GALLERY_CONSTS.textBoxWidthCalculationOptions.AUTOMATIC;
        }
    } else {
        stateStyles.calculateTextBoxHeightMode =
            defaultStateStyles.calculateTextBoxHeightMode;
    }
    if (canSet('jsonStyleParams')) {
        stateStyles.jsonStyleParams = wixStyles.jsonStyleParams;
    }
    if (canSet('designedPresetId')) {
        stateStyles.designedPresetId = wixStyles.designedPresetId;
    }
    if (canSet('galleryLayoutType')) {
        stateStyles.galleryLayoutType = wixStyles.galleryLayoutType;
    }
    if (canSet('shouldIndexDirectShareLinkInSEO')) {
        stateStyles.shouldIndexDirectShareLinkInSEO =
            wixStyles.shouldIndexDirectShareLinkInSEO;
    }
    // it is not set in the 'else' of 'canSet' casue there is another place when it is important to know if the user configured this value or not
    if (isUndefined(stateStyles.allowTitle)) {
        stateStyles.allowTitle = defaultStateStyles.allowTitle;
    }
    // it is not set in the 'else' of 'canSet' casue there is another place when it is important to know if the user configured this value or not
    if (isUndefined(stateStyles.allowDescription)) {
        stateStyles.allowDescription = defaultStateStyles.allowDescription;
    }
    var getFontLineHeight = function(font) {
        if (font.value.match(/\/(\d+)px/)) {
            // lineHeight is in px
            return parseInt(font.value.match(/\/(\d+)px/)[1]);
        } else if (font.value.match(/\/(\d+)%/)) {
            // lineHeight is in percentage
            return font.size * (parseInt(font.value.match(/\/(\d+)%/)[1]) / 100);
        } else if (font.value.match(/px\/(([0-9]*[.])?[0-9]*)/)) {
            // lineHeight is in em or without any units (which means em too)
            return (font.size * parseFloat(font.value.match(/px\/(([0-9]*[.])?[0-9]*)/)[1]));
        } else {
            console.error('GalleryContainer -> getFontLineHeight -> font lineHeight do not match any pattern. font value: ', font.value);
            return font.size;
        }
    };
    var getHeightByContent = function(stateStyles) {
        var itemFontSlideshow = stateStyles.itemFontSlideshow,
            itemDescriptionFontSlideshow = stateStyles.itemDescriptionFontSlideshow,
            allowTitle = stateStyles.allowTitle,
            allowDescription = stateStyles.allowDescription,
            useCustomButton = stateStyles.useCustomButton,
            titlePlacement = stateStyles.titlePlacement;
        if (titlePlacement !== GALLERY_CONSTS.placements.SHOW_ABOVE &&
            titlePlacement !== GALLERY_CONSTS.placements.SHOW_BELOW) {
            return 0;
        }
        var paddingTopAndBottom = 45; // TODO: change to 30
        var defaultButtonHeight = useCustomButton ? 33 : 0;
        var defaultItemFontSize = 22;
        var defaultItemDescriptionFontSize = 15;
        var spaceBetweenElements = 16;
        var spaceBetweenTitleAndDescription = 6;
        var totalSpaceBetweenElements = useCustomButton && (allowTitle || allowDescription) ?
            spaceBetweenElements :
            0;
        var titleFontSize = 0;
        var descriptionFontSize = 0;
        if (allowTitle) {
            titleFontSize = itemFontSlideshow ?
                getFontLineHeight(itemFontSlideshow) :
                defaultItemFontSize;
            totalSpaceBetweenElements += allowDescription ?
                spaceBetweenTitleAndDescription :
                0;
        }
        if (allowDescription) {
            descriptionFontSize = itemDescriptionFontSlideshow ?
                getFontLineHeight(itemDescriptionFontSlideshow) :
                defaultItemDescriptionFontSize;
        }
        return (10 +
            titleFontSize +
            3 * descriptionFontSize +
            paddingTopAndBottom +
            totalSpaceBetweenElements +
            defaultButtonHeight); // HACK  +10 for spare place. we can not really know that this is the final font - thus, this whole calc to get the bottom info height will break one day again.
    };
    stateStyles.gotStyleParams = gotStyleParams;
    var finalStyleParams = mergeNestedObjects(defaultStateStyles, stateStyles);
    if (finalStyleParams.designedPresetId >= 1) {
        // has got a preset
        finalStyleParams = addCustomPresetStyles({
            styles: finalStyleParams,
            presetId: finalStyleParams.designedPresetId,
            isMobile: isMobile,
        });
        delete finalStyleParams.jsonStyleParams;
        delete finalStyleParams.m_jsonStyleParams;
        delete finalStyleParams.designedPresetId;
        delete finalStyleParams.m_designedPresetId;
        finalStyleParams.galleryLayout = -1;
    }
    if (finalStyleParams.calculateTextBoxHeightMode ===
        GALLERY_CONSTS.textBoxWidthCalculationOptions.AUTOMATIC) {
        // pro-gallery do not have calculateTextBoxHeightMode SP. for it it is always set by the textBoxHeight that was given to it.
        // it will set the textBoxHeight that was given to it.
        // this is why in 'AUTOMATIC' we need to calculate it here.
        // sp basically after this function, the stateStyles.calculateTextBoxHeightMode is redundant.
        finalStyleParams.calculateTextBoxHeightMode =
            GALLERY_CONSTS.textBoxWidthCalculationOptions.MANUAL;
        finalStyleParams.textBoxHeight = getHeightByContent(finalStyleParams);
    }
    return addPresetOptions(finalStyleParams);
};
export var getProGalleryStyles = function(wixStyles, options) {
    if (options === void 0) {
        options = {};
    }
    var defaultOptions = {
        isMobile: false,
        isStoreGallery: false,
        isOnBoarding: false,
    };
    var spreadStyles = __assign(__assign(__assign(__assign(__assign({}, wixStyles.booleans), wixStyles.numbers), wixStyles.colors), wixStyles.fonts), wixStyles.manual);
    var styles = getProGalleryStylesImp(spreadStyles, true, __assign(__assign({}, defaultOptions), options));
    return styles;
};
//# sourceMappingURL=proGalleryStyleBuilder.js.map