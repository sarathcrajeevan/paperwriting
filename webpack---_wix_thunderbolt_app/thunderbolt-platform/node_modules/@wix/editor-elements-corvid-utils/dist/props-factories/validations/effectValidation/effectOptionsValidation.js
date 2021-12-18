import {
    messageTemplates
} from '../../../messages';
import {
    createSchemaValidator,
} from '../../../validations/createSchemaValidator';
import {
    reportWarning
} from '../../../reporters';
import {
    effectInfoLink
} from '../../animations';
import {
    effectsValidationSchema
} from './effectValidationSchema';
var createInvalidOptionsTypeWarningReporter = function(_a) {
    var effectName = _a.effectName,
        propertyName = _a.propertyName,
        compName = _a.compName;
    return function(message, messageParams) {
        reportWarning(messageTemplates.warning_invalid_type_effect_options({
            propertyName: propertyName,
            compName: compName,
            effectName: effectName,
            wrongValue: "" + (messageParams === null || messageParams === void 0 ? void 0 : messageParams.value),
            infoLink: effectInfoLink(propertyName),
        }));
    };
};
var createWrongOptionsWarningReporter = function(_a) {
    var effectName = _a.effectName,
        propertyName = _a.propertyName,
        compName = _a.compName;
    return function(message, messageParams) {
        reportWarning(messageTemplates.warning_invalid_effect_options({
            propertyName: propertyName,
            compName: compName,
            effectName: effectName,
            wrongProperty: 'value',
            wrongValue: "the key \"" + (messageParams === null || messageParams === void 0 ? void 0 : messageParams.propertyName) + "\" cannot be set to the value \"" + (messageParams === null || messageParams === void 0 ? void 0 : messageParams.value) + "\"",
            infoLink: effectInfoLink(propertyName),
        }));
    };
};
export var createEffectOptionsValidation = function(_a) {
    var propertyName = _a.propertyName,
        compName = _a.compName;
    return function(effectName, effectOptions) {
        if (!effectName) {
            return false;
        }
        if (effectOptions === undefined) {
            return true;
        }
        /**
         * Here we want to reuse createSchemaValidator, but
         * current implementation of it does not meet our needs.
         * We need:
         * 1. report warning instead of error
         * 2. report custom message instead of built by schema validator
         * Here below we have a hack where we pass warning report on for error reporting.
         */
        var invalidOptionTypeReporter = createInvalidOptionsTypeWarningReporter({
            effectName: effectName,
            propertyName: propertyName,
            compName: compName,
        });
        var isEffectOptionsTypeValid = function() {
            return createSchemaValidator({
                reportError: invalidOptionTypeReporter,
                reportWarning: function() {
                    return ({});
                },
            }, compName)(effectOptions, {
                type: ['object']
            }, propertyName);
        };
        if (!isEffectOptionsTypeValid()) {
            return false;
        }
        /**
         * Here we want to reuse createSchemaValidator, but
         * current implementation of it does not meet our needs.
         * We need:
         * 1. report warning instead of error
         * 2. report custom message instead of built by schema validator
         * Here below we have a hack where we pass warning report on for error reporting.
         */
        var invalidEffectOptionsReporter = createWrongOptionsWarningReporter({
            effectName: effectName,
            propertyName: propertyName,
            compName: compName,
        });
        var isEffectOptionsValid = function() {
            return createSchemaValidator({
                reportError: invalidEffectOptionsReporter,
                reportWarning: function() {
                    return ({});
                },
            }, compName)(effectOptions, effectsValidationSchema[effectName], propertyName);
        };
        if (!isEffectOptionsValid()) {
            return false;
        }
        return true;
    };
};
//# sourceMappingURL=effectOptionsValidation.js.map