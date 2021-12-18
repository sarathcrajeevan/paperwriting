var __assign = (this && this.__assign) || function() {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import {
    ValidationResult,
} from '../createSchemaValidator';
import {
    assert
} from '../../assert';
import {
    messages
} from '../../messages';
export function validateInteger(value, schema, reportError, messageParams) {
    var minimum = schema.minimum,
        maximum = schema.maximum,
        enumArray = schema.enum;
    if (!assert.isInteger(value)) {
        return ValidationResult.InvalidType;
    }
    if (enumArray && !assert.isIn(value, enumArray)) {
        reportError(messages.invalidEnumValueMessage(__assign({
            value: value,
            enum: enumArray
        }, messageParams)), __assign(__assign({}, messageParams), {
            value: value
        }));
        return ValidationResult.Invalid;
    }
    if ((assert.isNumber(minimum) && assert.isBelow(value, minimum)) ||
        (assert.isNumber(maximum) && assert.isAbove(value, maximum))) {
        reportError(messages.invalidNumberBoundsMessage(__assign({
            value: value,
            minimum: minimum, // minimum / maximum has to be of number type
            maximum: maximum
        }, messageParams)), __assign(__assign({}, messageParams), {
            value: value
        }));
        return ValidationResult.Invalid;
    }
    return ValidationResult.Valid;
}
//# sourceMappingURL=integer.js.map