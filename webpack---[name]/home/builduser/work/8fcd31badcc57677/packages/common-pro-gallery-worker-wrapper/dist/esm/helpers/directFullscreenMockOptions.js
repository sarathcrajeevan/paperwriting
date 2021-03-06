import {
    GALLERY_CONSTS,
    mergeNestedObjects
} from 'pro-gallery-lib';
import {
    coreOptions
} from '@wix/photography-client-lib';
export var mockOptions = mergeNestedObjects(coreOptions, {
    layoutParams: {
        cropRatio: 1,
    },
    gotStyleParams: true,
    selectedLayout: 0,
    gallerySize: 45,
    cubeType: 'fit',
    allowSocial: true,
    allowDownload: true,
    allowTitle: true,
    allowDescription: true,
    loveButton: true,
    loveCounter: false,
    videoPlay: 'auto',
    gallerySliderImageRatio: 1.3333333333333333,
    galleryImageRatio: 2,
    sharpParams: {
        quality: 90,
        usm: {}
    },
    collageAmount: 0.8,
    collageDensity: 1,
    floatingImages: 0,
    viewMode: 'preview',
    galleryHorizontalAlign: 'center',
    galleryVerticalAlign: 'center',
    enableInfiniteScroll: 1,
    itemClick: 'link',
    fixedColumns: 0,
    scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
    showArrows: false,
    thumbnailSpacings: 5,
    gridStyle: 1,
    mobilePanorama: false,
    expandAnimation: 'NO_EFFECT',
    itemBorderColor: {
        themeName: 'color_15',
        value: 'rgba(0,0,0,1)'
    },
    itemShadowOpacityAndColor: {
        themeName: 'color_15',
        value: 'rgba(0,0,0,0.2)',
    },
    textBoxBorderColor: {
        themeName: 'color_15',
        value: 'rgba(0,0,0,1)'
    },
    titleDescriptionSpace: 6,
    textsVerticalPadding: 0,
    textsHorizontalPadding: 0,
    textBoxFillColor: {
        themeName: 'color_12',
        value: 'rgba(230,230,230,1)',
    },
    textImageSpace: 10,
    alwaysShowHover: false,
    isStoreGallery: false,
    previewHover: false,
    calculateTextBoxHeightMode: 'AUTOMATIC',
    galleryLayout: 5,
    thumbnailSize: 120,
    useCustomButton: false,
    itemOpacity: {
        themeName: 'color_14',
        value: 'rgba(155,155,155,0.6)',
    },
    itemFont: {
        style: {
            bold: true,
            italic: false,
            underline: false
        },
        family: 'open sans',
        preset: 'Heading-M',
        editorKey: 'font_5',
        size: 22,
        fontStyleParam: true,
        displayName: 'Basic Heading',
        value: 'font:normal normal bold 22px/1.4em "open sans",sans-serif;',
    },
    itemFontSlideshow: {
        family: 'avenir-lt-w01_85-heavy1475544',
        displayName: 'Basic Heading',
        style: {
            bold: false,
            italic: false,
            underline: false
        },
        size: 22,
        preset: 'Custom',
        editorKey: 'font_5',
        fontStyleParam: true,
        value: 'font:normal normal normal 22px/27px avenir-lt-w01_85-heavy1475544,sans-serif;',
    },
    itemDescriptionFontSlideshow: {
        family: 'avenir-lt-w01_35-light1475496',
        displayName: 'Paragraph 2',
        style: {
            bold: false,
            italic: false,
            underline: false
        },
        size: 15,
        preset: 'Custom',
        editorKey: 'font_8',
        fontStyleParam: true,
        value: 'font:normal normal normal 15px/18px avenir-lt-w01_35-light1475496,sans-serif;',
    },
    itemDescriptionFont: {
        family: 'avenir-lt-w01_35-light1475496',
        displayName: 'Paragraph 2',
        style: {
            bold: false,
            italic: false,
            underline: false
        },
        size: 15,
        preset: 'Custom',
        editorKey: 'font_8',
        fontStyleParam: true,
        value: 'font:normal normal normal 15px/18px avenir-lt-w01_35-light1475496,sans-serif;',
    },
    itemFontColor: {
        themeName: 'color_11',
        value: 'rgba(255,255,255,1)',
    },
    itemFontColorSlideshow: {
        themeName: 'color_15',
        value: 'rgba(0,0,0,1)',
    },
    itemDescriptionFontColor: {
        themeName: 'color_11',
        value: 'rgba(255,255,255,1)',
    },
    itemDescriptionFontColorSlideshow: {
        themeName: 'color_15',
        value: 'rgba(0,0,0,1)',
    },
    loadMoreButtonText: 'Load More',
    loadMoreButtonFont: {
        family: 'open sans',
        displayName: 'Paragraph 2',
        style: {
            bold: false,
            italic: false,
            underline: false
        },
        size: 15,
        preset: 'Body-M',
        editorKey: 'font_8',
        fontStyleParam: true,
        value: 'font:normal normal normal 15px/1.4em "open sans",sans-serif;',
    },
    loadMoreButtonFontColor: {
        themeName: 'color_15',
        value: 'rgba(0,0,0,1)',
    },
    loadMoreButtonColor: {
        themeName: 'color_11',
        value: 'rgba(255,255,255,1)',
    },
    loadMoreButtonBorderColor: {
        themeName: 'color_15',
        value: 'rgba(0,0,0,1)',
    },
    arrowsColor: {
        themeName: 'color_11',
        value: 'rgba(255,255,255,1)'
    },
    oneColorAnimationColor: {
        themeName: 'color_11',
        value: 'rgba(255,255,255,1)',
    },
});
// TODO: Consider removing these values from coreStyles in lib instead
delete mockOptions.pauseAutoSlideshowOnHover;
delete mockOptions.scrollDirection;
delete mockOptions.slideAnimation;
delete mockOptions.jsonStyleParams;
//# sourceMappingURL=directFullscreenMockOptions.js.map