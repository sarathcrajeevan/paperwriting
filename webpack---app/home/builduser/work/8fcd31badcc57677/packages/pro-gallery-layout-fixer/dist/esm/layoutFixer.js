import React from 'react';
import PropTypes from 'prop-types';
var filterOptions = function(styleParams) {
    var requiredOptions = [
        'cubeType',
        'cubeImages',
        'cubeRatio',
        'cropRatio',
        'layoutParams_cropRatio',
        'collageAmount',
        'collageDensity',
        'columnsWidth',
        'cropOnlyFill',
        'chooseBestGroup',
        'externalInfoHeight',
        'externalInfoWidth',
        'fixedColumns',
        'groupsPerStrip',
        'galleryMargin',
        'layoutParams_gallerySpacing',
        'groupTypes',
        'groupSize',
        'isVertical',
        'imageMargin',
        'minItemSize',
        'scrollDirection',
        'placeGroupsLtr',
        'rotatingGroupTypes',
        'layoutParams_repeatingGroupTypes',
        'rotatingCropRatios',
        'smartCrop',
        'scatter',
        'smartCrop',
        'targetItemSize',
        'hasThumbnails',
        'thumbnailSize',
        'thumbnailSpacings',
        'galleryThumbnailsAlignment',
        'isSlideshow',
        'galleryLayout',
        'slideshowInfoSize',
    ];
    return Object.keys(styleParams)
        .filter(function(key) {
            return requiredOptions.indexOf(key) >= 0;
        })
        .reduce(function(res, key) {
            res[key] = styleParams[key];
            return res;
        }, {});
};
var hashToInt = function(str) {
    if (str === void 0) {
        str = '';
    }
    var int = 0;
    for (var i = 0; i < str.length; i++) {
        int += str.charCodeAt(i);
    }
    return int;
};
export var LayoutFixer = function(props) {
    try {
        var itemsStr = props.items
            .slice(0, 20)
            .map(function(item) {
                return hashToInt(item.mediaUrl) + "_" + (item.width || item.metaData.width) + "_" + (item.height || item.metaData.height);
            })
            .join('|');
        var optionsStr = Object.entries(filterOptions(props.options))
            .map(function(keyval) {
                return keyval.join(':');
            })
            .join('|');
        var hrefStr = "/_serverless/pro-gallery-css-v4-server/layoutCss?ver=2&id=" + props.id + "&items=" + itemsStr + "&options=" + optionsStr + "&container=";
        return (React.createElement("div", {
                id: 'layout-fixer-' + props.id,
                key: 'layout-fixer-' + props.id,
                style: {
                    display: 'none'
                }
            },
            React.createElement("link", {
                rel: "stylesheet",
                id: 'layout-fixer-style-' + props.id
            }),
            React.createElement("script", {
                dangerouslySetInnerHTML: {
                    __html: "try {\n            window.requestAnimationFrame(function() {\n              var pgMeasures = document.getElementById('" + ('pro-gallery-' + props.id) + "').getBoundingClientRect();\n              var layoutFixerUrl = 'https://' + window.location.host + '" + hrefStr + "' + pgMeasures.top + '_' + pgMeasures.width + '_' + pgMeasures.height + '_' + window.innerHeight;\n              document.getElementById('" + ('layout-fixer-style-' + props.id) + "').setAttribute('href', encodeURI(layoutFixerUrl));\n            });\n        } catch (e) {\n          console.warn('Cannot set layoutFixer css', e);\n        }",
                }
            })));
    } catch (e) {
        return (React.createElement("div", {
            id: "layoutFixerErrors",
            style: {
                display: 'none'
            }
        }, e));
    }
};
LayoutFixer.propTypes = {
    isPrerenderMode: PropTypes.bool,
    id: PropTypes.string,
    items: PropTypes.array,
    options: PropTypes.object,
};
//# sourceMappingURL=layoutFixer.js.map