import {
    assert
} from '../../../assert';
export function validatePixel(value) {
    if (assert.isString(value)) {
        var endsWithPx = value.endsWith('px');
        var integerToValidate = value.slice(0, value.length - 2);
        var containsOnlyNumbers = /^\d*$/.test(integerToValidate);
        return endsWithPx && containsOnlyNumbers && parseInt(integerToValidate, 10);
    }
    return false;
}
//# sourceMappingURL=unitValidations.js.map