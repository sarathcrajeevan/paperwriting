import {
    __assign
} from "tslib";
import {
    GALLERY_CONSTS,
    assignByString
} from 'pro-gallery-lib';
export var LAYOUT_ORIENTATION_TYPES = {
    vertical: 'VERTICAL',
    horizontal: 'HORIZONTAL',
};
export var presets = {
    // PRESET 1
    1: {
        id: 1,
        layoutOrientation: LAYOUT_ORIENTATION_TYPES.horizontal,
        desktop: function(styles) {
            var res = __assign({}, styles);
            res = assignByString(res, 'layoutParams_repeatingGroupTypes', '1,2v,2v');
            res.cubeImages = true;
            res = assignByString(res, 'layoutParams_cropRatio', '50%/100%');
            res.imageMargin = 0;
            res.gridStyle = 1;
            res.scrollDirection = GALLERY_CONSTS.scrollDirection.HORIZONTAL;
            res.titlePlacement = 'SHOW_ON_HOVER';
            res.cubeType = 'crop';
            return res;
        },
        mobile: function(styles) {
            var res = __assign({}, styles);
            res = assignByString(res, 'layoutParams_repeatingGroupTypes', '1,2v,2v');
            res.cubeImages = true;
            res.imageMargin = 0;
            res.scrollDirection = GALLERY_CONSTS.scrollDirection.HORIZONTAL;
            res.titlePlacement = 'SHOW_ON_HOVER';
            res.cubeType = 'crop';
            return res;
        },
    },
    // PRESET 2
    2: {
        id: 2,
        layoutOrientation: LAYOUT_ORIENTATION_TYPES.vertical,
        desktop: function(styles) {
            var res = __assign({}, styles);
            res = assignByString(res, 'layoutParams_repeatingGroupTypes', '1,2v,2v,2v,2v,1');
            res.cubeImages = true;
            res = assignByString(res, 'layoutParams_cropRatio', 0.75);
            res.groupsPerStrip = 3;
            res.imageMargin = 5;
            res.gridStyle = 1;
            res.scrollDirection = GALLERY_CONSTS.scrollDirection.VERTICAL;
            res.enableInfiniteScroll = true;
            res.cubeType = 'crop';
            res.isVertical = false;
            return res;
        },
        mobile: function(styles) {
            var res = __assign({}, styles);
            res.isVertical = true;
            res.groupSize = 2;
            res = assignByString(res, 'layoutParams_repeatingGroupTypes', '1,2h,2h');
            res.cubeImages = true;
            res.rotatingCropRatios = 0.75;
            res.fixedColumns = 1;
            res.imageMargin = 2;
            res.gridStyle = 1;
            res.scrollDirection = GALLERY_CONSTS.scrollDirection.VERTICAL;
            return res;
        },
    },
    3: {
        id: 3,
        layoutOrientation: LAYOUT_ORIENTATION_TYPES.horizontal,
        desktop: function(styles) {
            var res = __assign({}, styles);
            res.groupSize = 1;
            res.cubeImages = true;
            res = assignByString(res, 'layoutParams_cropRatio', '100%/50%');
            res.rotatingCropRatios = '25%/100%,50%/100%';
            res.scrollDirection = GALLERY_CONSTS.scrollDirection.HORIZONTAL;
            res.isVertical = true;
            res.cubeType = 'crop';
            res.calculateTextBoxHeightMode = 'AUTOMATIC';
            return res;
        },
        mobile: function(styles) {
            var res = __assign({}, styles);
            res.cubeImages = false;
            // Slider fixed styles
            res.groupSize = 1;
            res.scrollDirection = GALLERY_CONSTS.scrollDirection.HORIZONTAL;
            res.isVertical = false;
            res.groupTypes = '1';
            res.enableInfiniteScroll = true;
            return res;
        },
    },
    4: {
        id: 4,
        layoutOrientation: LAYOUT_ORIENTATION_TYPES.vertical,
        desktop: function(styles) {
            var res = __assign({}, styles);
            res.isVertical = true;
            res.groupSize = 1;
            res.cubeImages = true;
            res = assignByString(res, 'layoutParams_cropRatio', 4 / 3);
            res.fixedColumns = 1;
            res.imageMargin = 0;
            res.gridStyle = 1;
            res.titlePlacement = 'ALTERNATE_HORIZONTAL';
            res.textBoxWidthPercent = 35;
            res.scrollDirection = GALLERY_CONSTS.scrollDirection.VERTICAL;
            res.hoveringBehaviour = 'NO_CHANGE';
            res.cubeType = 'crop';
            res.imageInfoType = 'NO_BACKGROUND';
            return res;
        },
        mobile: function(styles) {
            var res = __assign({}, styles);
            res.titlePlacement = 'SHOW_BELOW';
            res.cubeImages = true; // Grid fixed styles;
            res.isVertical = true;
            res.groupSize = 1;
            res.hasThumbnails = false;
            res.groupTypes = '1';
            res.scrollDirection = GALLERY_CONSTS.scrollDirection.VERTICAL;
            return res;
        },
    },
    5: {
        id: 5,
        layoutOrientation: LAYOUT_ORIENTATION_TYPES.horizontal,
        desktop: function(styles) {
            var res = __assign({}, styles);
            res = assignByString(res, 'layoutParams_repeatingGroupTypes', '2v');
            res.cubeImages = true;
            res.rotatingCropRatios = '25%/40%,25%/60%,25%/60%,25%/40%';
            res.imageMargin = 2;
            res.gridStyle = 1;
            res.scrollDirection = GALLERY_CONSTS.scrollDirection.HORIZONTAL;
            res.titlePlacement = 'SHOW_ON_HOVER';
            res.cubeType = 'crop';
            return res;
        },
        mobile: function(styles) {
            var res = __assign({}, styles);
            res.groupTypes = '2v';
            res = assignByString(res, 'layoutParams_repeatingGroupTypes', '2v');
            res.cubeImages = true;
            res.rotatingCropRatios = '50%/35%,50%/65%,50%/65%,50%/35%';
            res.imageMargin = 2;
            res.gridStyle = 1;
            res.scrollDirection = GALLERY_CONSTS.scrollDirection.HORIZONTAL;
            res.titlePlacement = 'SHOW_ON_HOVER';
            return res;
        },
    },
    6: {
        id: 6,
        layoutOrientation: LAYOUT_ORIENTATION_TYPES.horizontal,
        desktop: function(styles) {
            var res = __assign({}, styles);
            res = assignByString(res, 'layoutParams_repeatingGroupTypes', '2v,2v');
            res.imageMargin = 150;
            res.rotatingScatter = '-50%/80%,7%/70%,-280%/-220%,100%/-100%,-150%/-50%';
            res.gridStyle = 1;
            res.scrollDirection = GALLERY_CONSTS.scrollDirection.HORIZONTAL;
            res.titlePlacement = 'SHOW_ON_HOVER';
            return res;
        },
        mobile: function(styles) {
            var res = __assign({}, styles);
            res.cubeImages = false;
            res.arrowsPosition = 1;
            res.titlePlacement = 'SHOW_BELOW';
            // Slideshow fixed styles
            res.hoveringBehaviour = 'NEVER_SHOW';
            res.scrollDirection = GALLERY_CONSTS.scrollDirection.HORIZONTAL;
            res = assignByString(res, 'layoutParams_gallerySpacing', 0);
            res.isVertical = false;
            res.groupSize = 1;
            res.groupTypes = '1';
            return res;
        },
    },
    7: {
        id: 7,
        layoutOrientation: LAYOUT_ORIENTATION_TYPES.vertical,
        desktop: function(styles) {
            var res = __assign({}, styles);
            res.isVertical = true;
            res.groupSize = 1;
            res.cubeImages = true;
            res.fixedColumns = 1;
            res.imageMargin = 80;
            res.gridStyle = 1;
            res.titlePlacement = 'SHOW_ON_THE_RIGHT';
            res.textBoxWidthPercent = 66;
            res.scrollDirection = GALLERY_CONSTS.scrollDirection.VERTICAL;
            res.cubeType = 'crop';
            res.imageInfoType = 'NO_BACKGROUND';
            return res;
        },
        mobile: function(styles) {
            var res = __assign({}, styles);
            res.isVertical = true;
            res.groupSize = 1;
            res.cubeImages = true;
            res.fixedColumns = 1;
            res.imageMargin = 20;
            res = assignByString(res, 'layoutParams_gallerySpacing', 10);
            res.gridStyle = 1;
            res.titlePlacement = 'SHOW_ON_THE_RIGHT';
            res.scrollDirection = GALLERY_CONSTS.scrollDirection.VERTICAL;
            res.cubeType = 'crop';
            res.imageInfoType = 'NO_BACKGROUND';
            return res;
        },
    },
    8: {
        id: 8,
        layoutOrientation: LAYOUT_ORIENTATION_TYPES.vertical,
        desktop: function(styles) {
            var res = __assign({}, styles);
            res.groupTypes = '1,2v';
            res = assignByString(res, 'layoutParams_repeatingGroupTypes', '2v,1,2v');
            res.cubeImages = true;
            res.groupsPerStrip = 3;
            res.imageMargin = 20;
            res.gridStyle = 1;
            res.scrollDirection = GALLERY_CONSTS.scrollDirection.VERTICAL;
            res.cubeType = 'crop';
            res.isVertical = false;
            return res;
        },
        mobile: function(styles) {
            var res = __assign({}, styles);
            res.groupTypes = '2h,1';
            res = assignByString(res, 'layoutParams_repeatingGroupTypes', '2h,1');
            res.cubeImages = true;
            res.groupsPerStrip = 1;
            res.imageMargin = 10;
            res.gridStyle = 1;
            res.scrollDirection = GALLERY_CONSTS.scrollDirection.VERTICAL;
            res.gallerySize = 60;
            res.cubeType = 'crop';
            res.titlePlacement = 'SHOW_ON_HOVER';
            return res;
        },
    },
    9: {
        id: 9,
        layoutOrientation: LAYOUT_ORIENTATION_TYPES.vertical,
        desktop: function(styles) {
            var res = __assign({}, styles);
            res = assignByString(res, 'layoutParams_repeatingGroupTypes', '3t,3b');
            res.cubeImages = true;
            res.rotatingCropRatios = '1.41,.7,.7,.7,.7,1.41';
            res.groupsPerStrip = 2;
            res.imageMargin = 5;
            res.gridStyle = 1;
            res.scrollDirection = GALLERY_CONSTS.scrollDirection.VERTICAL;
            res.cubeType = 'crop';
            res.isVertical = false;
            return res;
        },
        mobile: function(styles) {
            var res = __assign({}, styles);
            res.groupTypes = '2h,1';
            res = assignByString(res, 'layoutParams_repeatingGroupTypes', '1,2h');
            res.cubeImages = true;
            res.groupsPerStrip = 1;
            res.gridStyle = 1;
            res.scrollDirection = GALLERY_CONSTS.scrollDirection.VERTICAL;
            res.cubeType = 'crop';
            res.titlePlacement = 'SHOW_ON_HOVER';
            return res;
        },
    },
    10: {
        id: 10,
        layoutOrientation: LAYOUT_ORIENTATION_TYPES.vertical,
        desktop: function(styles) {
            var res = __assign({}, styles);
            res = assignByString(res, 'layoutParams_repeatingGroupTypes', '1,2v,1,1');
            res.cubeImages = true;
            res.rotatingCropRatios = '1.6,1.2,1.2,1.2,1.6';
            res.groupsPerStrip = 2;
            res.imageMargin = 5;
            res.gridStyle = 1;
            res.scrollDirection = GALLERY_CONSTS.scrollDirection.VERTICAL;
            res.cubeType = 'crop';
            res.isVertical = false;
            return res;
        },
        mobile: function(styles) {
            var res = __assign({}, styles);
            res.groupTypes = '2h,1';
            res = assignByString(res, 'layoutParams_repeatingGroupTypes', '1,2h');
            res.cubeImages = true;
            res.groupsPerStrip = 1;
            res.gridStyle = 1;
            res.scrollDirection = GALLERY_CONSTS.scrollDirection.VERTICAL;
            res.cubeType = 'crop';
            res.titlePlacement = 'SHOW_ON_HOVER';
            return res;
        },
    },
    11: {
        id: 11,
        layoutOrientation: LAYOUT_ORIENTATION_TYPES.vertical,
        desktop: function(styles) {
            var res = __assign({}, styles);
            res.isVertical = true;
            res.minItemSize = 80;
            res.groupTypes = '2h,3h';
            res = assignByString(res, 'layoutParams_repeatingGroupTypes', '2h,3h');
            res.collageDensity = 0;
            res.cubeImages = true;
            res.fixedColumns = 1;
            res.imageMargin = 80;
            res = assignByString(res, 'layoutParams_gallerySpacing', 80);
            res.gridStyle = 1;
            res.scrollDirection = GALLERY_CONSTS.scrollDirection.VERTICAL;
            res.cubeType = 'crop';
            return res;
        },
        mobile: function(styles) {
            var res = __assign({}, styles);
            res.titlePlacement = 'SHOW_BELOW';
            // Slideshow fixed styles
            res.hoveringBehaviour = 'NEVER_SHOW';
            res.scrollDirection = GALLERY_CONSTS.scrollDirection.HORIZONTAL;
            res = assignByString(res, 'layoutParams_gallerySpacing', 0);
            res.isVertical = false;
            res.groupSize = 1;
            res.groupTypes = '1';
            return res;
        },
    },
    12: {
        id: 12,
        layoutOrientation: LAYOUT_ORIENTATION_TYPES.vertical,
        desktop: function(styles) {
            var res = __assign({}, styles);
            res.isVertical = true;
            res = assignByString(res, 'layoutParams_repeatingGroupTypes', '2v,2v');
            res.fixedColumns = 3;
            res.imageMargin = 100;
            res = assignByString(res, 'layoutParams_gallerySpacing', 100);
            res.rotatingScatter = '-50%/-40%,0%/-10%,40%/100%';
            res.gridStyle = 1;
            res.scrollDirection = GALLERY_CONSTS.scrollDirection.VERTICAL;
            return res;
        },
        mobile: function(styles) {
            var res = __assign({}, styles);
            res.cubeImages = false;
            res.arrowsPosition = 1;
            res.titlePlacement = 'SHOW_BELOW';
            // Slideshow fixed styles
            res.hoveringBehaviour = 'NEVER_SHOW';
            res.scrollDirection = GALLERY_CONSTS.scrollDirection.HORIZONTAL;
            res = assignByString(res, 'layoutParams_gallerySpacing', 0);
            res.isVertical = false;
            res.groupSize = 1;
            res.groupTypes = '1';
            return res;
        },
    },
    13: {
        id: 13,
        layoutOrientation: LAYOUT_ORIENTATION_TYPES.vertical,
        desktop: function(styles) {
            var res = __assign({}, styles);
            res.isVertical = true;
            res.groupSize = 1;
            res.cubeImages = true;
            res.rotatingCropRatios = '0.7,1.77,0.9,1.77,1.77,0.7,0.9';
            res.fixedColumns = 2;
            res.imageMargin = 97;
            res.gridStyle = 1;
            res.titlePlacement = 'SHOW_BELOW';
            res.scrollDirection = 0;
            return res;
        },
        mobile: function(styles) {
            var res = __assign({}, styles);
            res.isVertical = true;
            res.groupSize = 1;
            res.cubeImages = true;
            res.rotatingCropRatios = '0.7,1.77,0.9,1.77,1.77,0.7,0.9';
            res.fixedColumns = 2;
            res.imageMargin = 97;
            res.gridStyle = 1;
            res.titlePlacement = 'SHOW_BELOW';
            res.scrollDirection = 0;
            return res;
        },
    },
    /// NEW PRESETS
    14: {
        id: 14,
        layoutOrientation: LAYOUT_ORIENTATION_TYPES.vertical,
        desktop: function(styles) {
            var res = __assign({}, styles);
            res.isVertical = true;
            res.groupSize = 1;
            res.cubeImages = true;
            res.imageMargin = 0;
            res.fixedColumns = 1;
            res.gridStyle = 1;
            res.titlePlacement = GALLERY_CONSTS.placements.ALTERNATE_HORIZONTAL;
            res.cubeType = GALLERY_CONSTS.cubeType.CROP;
            return res;
        },
        mobile: function(styles) {
            var res = __assign({}, styles);
            res.cubeImages = true;
            res.isVertical = true;
            res.groupSize = 1;
            res.hasThumbnails = false;
            res.groupTypes = '1';
            res.slideshowLoop = false;
            res.titlePlacement = GALLERY_CONSTS.placements.SHOW_BELOW;
            res.isGrid = true;
            return res;
        },
    },
    15: {
        id: 15,
        layoutOrientation: LAYOUT_ORIENTATION_TYPES.vertical,
        desktop: function(styles) {
            var res = __assign({}, styles);
            res.groupSize = 2;
            res.cubeImages = true;
            res.gridStyle = 1;
            res.rotatingGroupTypes = '1,2h,1,1,1,2h,1,1';
            res.rotatingCropRatios = '1,1,1,1,2.02,1,1,1,1,2.02';
            res.groupsPerStrip = 2;
            return res;
        },
        mobile: function(styles) {
            var res = __assign({}, styles);
            res.isVertical = true;
            res.groupTypes = '2h,1';
            res.cubeImages = true;
            res.imageMargin = 50;
            res.fixedColumns = 1;
            res.gridStyle = 1;
            res.rotatingGroupTypes = '2h,2h,1';
            res.rotatingCropRatios = 1, 1, 1, 1, 2;
            return res;
        },
    },
    16: {
        id: 16,
        layoutOrientation: LAYOUT_ORIENTATION_TYPES.vertical,
        desktop: function(styles) {
            var res = __assign({}, styles);
            res.isVertical = true;
            res.groupSize = 1;
            res.cubeImages = true;
            res.imageMargin = 80;
            res.fixedColumns = 1;
            res.cubeRatio = 2;
            res.gridStyle = 1;
            res.titlePlacement = GALLERY_CONSTS.placements.ALTERNATE_HORIZONTAL;
            return res;
        },
        mobile: function(styles) {
            var res = __assign({}, styles);
            res.cubeImages = true;
            res.isVertical = true;
            res.groupSize = 1;
            res.hasThumbnails = false;
            res.groupTypes = '1';
            res.slideshowLoop = false;
            res.titlePlacement = GALLERY_CONSTS.placements.SHOW_BELOW;
            res.isGrid = true;
            return res;
        },
    },
    17: {
        id: 17,
        layoutOrientation: LAYOUT_ORIENTATION_TYPES.horizontal,
        desktop: function(styles) {
            var res = __assign({}, styles);
            res = assignByString(res, 'layoutParams_gallerySpacing', 20);
            res.isVertical = true;
            res.groupSize = 1;
            res.cubeImages = true;
            res.cubeType = GALLERY_CONSTS.cubeType.FIT;
            res.titlePlacement = GALLERY_CONSTS.placements.SHOW_BELOW;
            res.scrollDirection = 1;
            res.cubeFitPosition = GALLERY_CONSTS.cubeFitPosition.BOTTOM;
            return res;
        },
        mobile: function(styles) {
            var res = __assign({}, styles);
            res.oneRow = true,
                res.hoveringBehaviour = GALLERY_CONSTS.infoBehaviourOnHover.NEVER_SHOW;
            res.scrollDirection = 1;
            res.galleryMargin = 0;
            res.isVertical = false;
            res.groupSize = 1;
            res.groupTypes = '1';
            res.isSlideshow = true;
            return res;
        },
    },
};
export var addCustomPresetStyles = function(_a) {
    var _b, _c;
    var styles = _a.styles,
        presetId = _a.presetId,
        _d = _a.isMobile,
        isMobile = _d === void 0 ? false : _d;
    if (isMobile) {
        return ((_b = presets[presetId]) === null || _b === void 0 ? void 0 : _b.mobile(styles)) || styles;
    } else {
        return ((_c = presets[presetId]) === null || _c === void 0 ? void 0 : _c.desktop(styles)) || styles;
    }
};
//# sourceMappingURL=customPresetProcessor.js.map