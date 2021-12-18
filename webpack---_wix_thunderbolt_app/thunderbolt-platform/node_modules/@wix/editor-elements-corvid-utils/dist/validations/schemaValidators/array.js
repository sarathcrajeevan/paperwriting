import {
    ValidationResult,
} from '../createSchemaValidator';
import {
    assert
} from '../../assert';

function isTupleSchema(schema) {
    return Array.isArray(schema);
}
export function validateArray(value, schema, validateSchema, reportError, messageParams, suppressIndexError) {
    if (suppressIndexError === void 0) {
        suppressIndexError = false;
    }
    if (!assert.isArray(value)) {
        return ValidationResult.InvalidType;
    }
    var isValid = ValidationResult.Valid;
    if (schema.items) {
        var itemsToValidateCount = isTupleSchema(schema.items) ?
            Math.min(value.length, schema.items.length) :
            value.length;
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (var itemIndex = 0; itemIndex < itemsToValidateCount; itemIndex++) {
            var item = value[itemIndex];
            var itemSchema = void 0;
            var propName = void 0;
            if (isTupleSchema(schema.items)) {
                itemSchema = schema.items[itemIndex];
                propName = schema.items[itemIndex].name;
            } else {
                itemSchema = schema.items;
                propName = schema.name;
            }
            var isItemValid = validateSchema(item, itemSchema, {
                functionName: messageParams.functionName,
                propertyName: propName || messageParams.propertyName,
                index: !suppressIndexError ? itemIndex : undefined,
            });
            if (!isItemValid) {
                isValid = ValidationResult.Invalid;
            }
        }
    }
    return isValid;
}
//# sourceMappingURL=array.js.map