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
    assert
} from '../assert';
import {
    messages
} from '../messages';
import * as typeValidators from './schemaValidators';
export var ValidationResult = {
    Valid: 'valid',
    Invalid: 'invalid',
    InvalidType: 'invalid-type',
};
export function createSchemaValidator(_a, compName, _b) {
    var reportError = _a.reportError,
        reportWarning = _a.reportWarning;
    var _c = _b === void 0 ? {} : _b,
        _d = _c.suppressIndexErrors,
        suppressIndexErrors = _d === void 0 ? false : _d;

    function validate(value, schema, setterName) {
        return validateSchema(value, schema, {
            functionName: setterName,
            propertyName: setterName,
            /**
             * This intentional? In such a case all errors related to "index"
             * will never be fired
             */
            index: undefined,
        });
    }

    function validateSchema(value, schema, params) {
        if (schema.warnIfNil && assert.isNil(value)) {
            reportWarning(messages.nilAssignmentMessage(__assign(__assign({}, params), {
                compName: compName
            })), __assign(__assign({}, params), {
                value: value
            }));
        }
        var typeIdx = 0;
        for (; typeIdx < schema.type.length; typeIdx++) {
            var validateSchemaForType = validatorsMap[schema.type[typeIdx]];
            var validationResult = validateSchemaForType(value, schema, params);
            if (validationResult !== ValidationResult.InvalidType) {
                return validationResult === ValidationResult.Valid;
            }
        }
        if (typeIdx === schema.type.length) {
            reportError(messages.invalidTypeMessage(__assign({
                value: value,
                types: schema.type
            }, params)), __assign(__assign({}, params), {
                value: value
            }));
        }
        return false;
    }
    var validatorsMap = {
        object: function(value, schema, messageParams) {
            return typeValidators.validateObject(value, schema, validateSchema, reportError, reportWarning, messageParams);
        },
        array: function(value, schema, messageParams) {
            return typeValidators.validateArray(value, schema, validateSchema, reportError, messageParams, suppressIndexErrors);
        },
        number: function(value, schema, messageParams) {
            return typeValidators.validateNumber(value, schema, reportError, messageParams);
        },
        integer: function(value, schema, messageParams) {
            return typeValidators.validateInteger(value, schema, reportError, messageParams);
        },
        string: function(value, schema, messageParams) {
            return typeValidators.validateString(value, schema, reportError, messageParams);
        },
        boolean: function(value) {
            return typeValidators.validateBoolean(value);
        },
        date: function(value) {
            return typeValidators.validateDate(value);
        },
        nil: function(value) {
            return typeValidators.validateNil(value);
        },
        function: function(value) {
            return typeValidators.validateFunction(value);
        },
    };
    return validate;
}
//# sourceMappingURL=createSchemaValidator.js.map