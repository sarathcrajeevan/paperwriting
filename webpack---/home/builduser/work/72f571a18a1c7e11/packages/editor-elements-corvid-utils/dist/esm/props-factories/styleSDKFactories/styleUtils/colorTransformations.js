import {
    isValidHexaOrHex,
    isValidRGBOrRGBA,
    isKeyword,
} from './colorAssertions';
import {
    colorKeywords
} from './colorKeywords';
export var getChannelsFromHex = function(color) {
    var chunkSize = Math.floor((color.length - 1) / 3);
    return color
        .slice(1)
        .match(new RegExp(".{" + chunkSize + "}", 'g'));
};
export var convertHexUnitTo256 = function(hex) {
    return parseInt(hex.repeat(2 / hex.length), 16);
};
export var convertHexaOrHexToRGBAUnits = function(color) {
    if (!isValidHexaOrHex(color)) {
        return;
    }
    var hexArr = getChannelsFromHex(color);
    var _a = hexArr.map(convertHexUnitTo256),
        r = _a[0],
        g = _a[1],
        b = _a[2],
        a = _a[3];
    var alpha = typeof a !== 'undefined' ? roundToTwoDecimals(a / 255) : 1;
    return [r, g, b, alpha];
};
export var convertRGBAorRGBToRGBAUnits = function(color) {
    if (!isValidRGBOrRGBA(color)) {
        return;
    }
    var inParts = color.substring(color.indexOf('(')).split(',');
    var r = parseInt(inParts[0].substring(1).trim(), 10);
    var g = parseInt(inParts[1].trim(), 10);
    var b = parseInt(inParts[2].trim(), 10);
    var a = inParts[3] &&
        parseFloat(inParts[3].substring(0, inParts[3].length - 1).trim());
    var alpha = typeof a !== 'undefined' ? a : 1;
    return [r, g, b, alpha];
};
export var convertColorToRGBAUnits = function(color) {
    return isValidHexaOrHex(color) ?
        convertHexaOrHexToRGBAUnits(color) :
        isValidRGBOrRGBA(color) ?
        convertRGBAorRGBToRGBAUnits(color) :
        isKeyword(color) ?
        convertHexaOrHexToRGBAUnits(colorKeywords[color]) :
        undefined;
};
export var extractOpacity = function(color) {
    var colorUnits = convertColorToRGBAUnits(color);
    if (colorUnits) {
        return colorUnits[3];
    }
    return;
};
export var applyOpacity = function(color, opacity) {
    var colorUnits = convertColorToRGBAUnits(color);
    if (colorUnits) {
        var r = colorUnits[0],
            g = colorUnits[1],
            b = colorUnits[2];
        return "rgba(" + r + ", " + g + ", " + b + ", " + opacity + ")";
    }
    return;
};
export var roundToTwoDecimals = function(number) {
    return Math.round(number * 1e2) / 1e2;
};
//# sourceMappingURL=colorTransformations.js.map