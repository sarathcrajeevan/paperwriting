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
export function validateString(value, schema, reportError, messageParams) {
    var minLength = schema.minLength,
        maxLength = schema.maxLength,
        enumArray = schema.enum,
        pattern = schema.pattern;
    if (!assert.isString(value)) {
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
    if ((minLength && assert.isBelow(value.length, minLength)) ||
        (maxLength && assert.isAbove(value.length, maxLength))) {
        reportError(messages.invalidStringLengthMessage(__assign({
            value: value,
            minimum: minLength,
            maximum: maxLength
        }, messageParams)), __assign(__assign({}, messageParams), {
            value: value
        }));
        return ValidationResult.Invalid;
    }
    if (pattern && !new RegExp(pattern).test(value)) {
        reportError(messages.patternMismatchMessage(__assign({
            value: value
        }, messageParams)), __assign(__assign({}, messageParams), {
            value: value
        }));
        return ValidationResult.Invalid;
    }
    return ValidationResult.Valid;
}
//# sourceMappingURL=string.js.map