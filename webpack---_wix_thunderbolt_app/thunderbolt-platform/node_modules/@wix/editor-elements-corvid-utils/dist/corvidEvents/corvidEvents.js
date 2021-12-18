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
    createCompSchemaValidator
} from '../validations';
var reactToCorvidEventType = {
    dblclick: 'dblClick',
    keydown: 'keyPress',
    input: 'onInput',
};
export var convertToCorvidEvent = function(event) {
    var _a;
    var target = event.target,
        type = event.type,
        context = event.context;
    return {
        target: target,
        type: (_a = reactToCorvidEventType[type]) !== null && _a !== void 0 ? _a : type,
        context: context
    };
};
export var convertToCorvidMouseEvent = function(event) {
    var _a;
    var clientX = event.clientX,
        clientY = event.clientY,
        pageX = event.pageX,
        pageY = event.pageY,
        screenX = event.screenX,
        screenY = event.screenY,
        target = event.target,
        type = event.type,
        context = event.context,
        nativeEvent = event.nativeEvent;
    var offsetX = nativeEvent.offsetX,
        offsetY = nativeEvent.offsetY;
    return {
        clientX: clientX,
        clientY: clientY,
        pageX: pageX,
        pageY: pageY,
        screenX: screenX,
        screenY: screenY,
        target: target,
        type: (_a = reactToCorvidEventType[type]) !== null && _a !== void 0 ? _a : type,
        context: context,
        offsetX: offsetX,
        offsetY: offsetY,
    };
};
export var convertToCorvidKeyboardEvent = function(event) {
    var _a;
    var altKey = event.altKey,
        ctrlKey = event.ctrlKey,
        key = event.key,
        metaKey = event.metaKey,
        shiftKey = event.shiftKey,
        target = event.target,
        type = event.type,
        context = event.context;
    return {
        altKey: altKey,
        ctrlKey: ctrlKey,
        key: key,
        metaKey: metaKey,
        shiftKey: shiftKey,
        target: target,
        type: (_a = reactToCorvidEventType[type]) !== null && _a !== void 0 ? _a : type,
        context: context,
    };
};
var functionValidator = function(value, eventName, role) {
    return createCompSchemaValidator(role)(value, {
        type: ['function'],
    }, eventName);
};
var eventNameMapToMethodName = {
    onMouseEnter: 'onMouseIn',
    onMouseLeave: 'onMouseOt',
};
export var registerCorvidEvent = function(eventName, api, cb, projection) {
    var _a;
    var create$w = api.create$w,
        createEvent = api.createEvent,
        registerEvent = api.registerEvent,
        getSdkInstance = api.getSdkInstance,
        metaData = api.metaData;
    var setterName = (_a = eventNameMapToMethodName[eventName]) !== null && _a !== void 0 ? _a : eventName;
    if (!functionValidator(cb, setterName, metaData.role)) {
        return getSdkInstance();
    }
    registerEvent(eventName, function(event) {
        var baseEvent = createEvent({
            type: event.type,
            compId: event.compId
        });
        var $w = create$w({
            context: baseEvent.context
        });
        var projectionEvent = projection === null || projection === void 0 ? void 0 : projection({
            componentEvent: event
        });
        cb(__assign(__assign({}, projectionEvent), convertToCorvidEvent(baseEvent)), $w);
    });
    return getSdkInstance();
};
/**
 * Function that registers corvid keyboard event handler by forwarding callback prop to component.
 * 1. Validating user callback.
 * 2. Returning sdk instance.
 * 3. Passing $w selector as second argument of consumers callback.
 * 4. Includes platform metadata for consumers event object: target, context.
 * 5. Extracts required keyboard event fields from the React synthetic event.
 * @param eventName - the name of the callback that will be passed to component.
 * @param api - corvid sdk api object.
 * @param cb - consumers callback function.
 */
export var registerCorvidKeyboardEvent = function(eventName, api, cb) {
    return registerCorvidEvent(eventName, api, cb, function(_a) {
        var componentEvent = _a.componentEvent;
        return convertToCorvidKeyboardEvent(componentEvent);
    });
};
/**
 * Function that registers corvid mouse event handler by forwarding callback prop to component.
 * 1. Validating user callback.
 * 2. Returning sdk instance.
 * 3. Passing $w selector as second argument of consumers callback.
 * 4. Includes platform metadata for consumers event object: target, context.
 * 5. Extracts required mouse event fields from the React synthetic event.
 * @param eventName - the name of the callback that will be passed to component.
 * @param api - corvid sdk api object.
 * @param cb - consumers callback function.
 */
export var registerCorvidMouseEvent = function(eventName, api, cb) {
    return registerCorvidEvent(eventName, api, cb, function(_a) {
        var componentEvent = _a.componentEvent;
        return convertToCorvidMouseEvent(componentEvent);
    });
};
/**
 * Function that registers corvid event only once per sdk initialization.
 * This is function is used to sync the corvid state with the component state
 * synchronously.
 * @param {EventParameters} Object {
 *   @property {string} eventName - the name of the callback that will be passed to component.
 *   @property {CorvidSDKApi} api - corvid sdk api object.
 *   @property {Function} cb - callback function.
 *   @property {string} namespace - (optional) - state identifier used to make id unique by prop-factory.
 * }
 */
export var registerEventOnce = function(_a) {
    var eventName = _a.eventName,
        api = _a.api,
        cb = _a.cb,
        namespace = _a.namespace;
    var registerEvent = api.registerEvent,
        createSdkState = api.createSdkState;
    var _b = createSdkState({
            wasInvoked: false
        }, namespace),
        state = _b[0],
        setState = _b[1];
    if (!state.wasInvoked) {
        registerEvent(eventName, cb);
        setState({
            wasInvoked: true
        });
    }
};
//# sourceMappingURL=corvidEvents.js.map