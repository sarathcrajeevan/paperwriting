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
var hasOwnProperty = Object.prototype.hasOwnProperty;
var getOwnPropertyNames = Object.getOwnPropertyNames;
export function validateObject(value, schema, validateSchema, reportError, reportWarning, messageParams) {
    if (!assert.isObject(value)) {
        return ValidationResult.InvalidType;
    }
    if (schema.required) {
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (var propNameIdx = 0; propNameIdx < schema.required.length; propNameIdx++) {
            if (!hasOwnProperty.call(value, schema.required[propNameIdx])) {
                reportError(messages.missingFieldMessage({
                    functionName: messageParams.functionName,
                    index: messageParams.index,
                    propertyName: schema.required[propNameIdx],
                }), __assign(__assign({}, messageParams), {
                    value: value
                }));
                return ValidationResult.Invalid;
            }
        }
    }
    if (schema.properties) {
        var propNames = getOwnPropertyNames(schema.properties);
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (var propNameIdx = 0; propNameIdx < propNames.length; propNameIdx++) {
            var propName = propNames[propNameIdx];
            if (hasOwnProperty.call(value, propName)) {
                var propSchema = schema.properties[propName];
                var propValue = value[propName]; // hmmm...
                if (!validateSchema(propValue, propSchema, {
                        functionName: messageParams.functionName,
                        index: messageParams.index,
                        propertyName: propName,
                    })) {
                    return ValidationResult.Invalid;
                }
            }
        }
    }
    return ValidationResult.Valid;
}
//# sourceMappingURL=object.js.map