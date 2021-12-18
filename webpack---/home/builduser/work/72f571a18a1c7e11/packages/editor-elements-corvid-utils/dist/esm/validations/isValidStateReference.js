import {
    assert
} from '../assert';
import {
    messages
} from '../messages';
import {
    reportError
} from '../reporters';
export var isValidStateReference = function(functionArgs, sdkFactoryArgs) {
    var stateReference = functionArgs[0];
    var isObjectStateReference = assert.isObject(stateReference);
    var states = sdkFactoryArgs.getChildren();
    var inputState = -1;
    // if stateRefernce is object - validate object by properties and search by id
    if (assert.isObject(stateReference)) {
        var isValidStateSDKObject = Object.keys(states[0]).every(function(key) {
            return stateReference.hasOwnProperty(key);
        });
        if (!isValidStateSDKObject) {
            reportError(messages.invalidTypeMessage({
                propertyName: 'stateReference',
                functionName: 'changeState',
                value: stateReference,
                types: ['state', 'string'],
                index: undefined,
            }));
            return false;
        }
        inputState = states.findIndex(function(state) {
            return state.uniqueId === stateReference.uniqueId;
        });
    }
    // if stateReference is string - find by role
    if (assert.isString(stateReference)) {
        inputState = states.findIndex(function(state) {
            return state.role === stateReference;
        });
    }
    if (inputState < 0) {
        reportError(messages.invalidStateInputMessage({
            value: isObjectStateReference ?
                stateReference.role :
                stateReference,
            propertyName: 'stateReference',
            functionName: 'changeState',
            stateBoxId: sdkFactoryArgs.metaData.role,
        }));
        return false;
    }
    return true;
};
//# sourceMappingURL=isValidStateReference.js.map