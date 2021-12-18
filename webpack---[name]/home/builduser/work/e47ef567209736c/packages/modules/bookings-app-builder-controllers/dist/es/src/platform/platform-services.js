import * as _ from 'lodash';
//* **********************************************************
//                  START OF STATIC CODE
//* **********************************************************\
var shouldBeAnObserver = function(obj) {
    return _.isObject(obj) && !_.isArray(obj);
};
var clone = function(obj) {
    return JSON.parse(JSON.stringify(obj));
};
var WidgetServices = /** @class */ (function() {
    function WidgetServices(widgetProps) {
        this.onPropsChangedRegistrar = this.createEventRegistrar();
        this.widgetProperties = widgetProps;
    }
    WidgetServices.prototype.pushObservedObject = function(targetObject, objectToWatch, initialProps, onPropsChangedRegistrar) {
        var observersCache = {};

        function definePropertiesOnTarget(target, objectRoot, props, path) {
            if (path === void 0) {
                path = [];
            }
            props =
                props ||
                Object.getOwnPropertyNames(objectRoot).filter(function(prop) {
                    return !_.isFunction(objectRoot[prop]);
                });
            for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
                var propName = props_1[_i];
                defineProperty(target, propName, path);
            }
            return target;
        }

        function getObserver(obj, path) {
            var propPathName = path.join('/');
            if (observersCache[propPathName]) {
                return observersCache[propPathName];
            }
            var newObserver = definePropertiesOnTarget({}, obj, null, path);
            observersCache[propPathName] = newObserver;
            return newObserver;
        }

        function defineProperty(target, propName, path) {
            Object.defineProperty(target, propName, {
                configurable: false,
                enumerable: true,
                get: function() {
                    var propPath = path.concat(propName);
                    var propValue = _.get(objectToWatch, propPath);
                    if (shouldBeAnObserver(propValue)) {
                        propValue = getObserver(propValue, propPath);
                    }
                    return propValue;
                },
                set: function(newValue) {
                    var propPath = path.concat(propName);
                    var propPathName = propPath.join('/');
                    var oldPropsClone = clone(objectToWatch);
                    _.set(objectToWatch, propPath, newValue);
                    delete observersCache[propPathName]; // eslint-disable-line
                    onPropsChangedRegistrar.fire(oldPropsClone, objectToWatch);
                },
            });
        }
        return definePropertiesOnTarget(targetObject, objectToWatch, initialProps);
    };
    WidgetServices.prototype.createEventRegistrar = function() {
        var callbacksArray = [];
        return {
            register: function(callback) {
                callbacksArray.push(callback);
            },
            fire: function() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                callbacksArray.forEach(function(cb) {
                    return cb.apply(void 0, args);
                });
            },
        };
    };
    WidgetServices.prototype.get$widget = function($w) {
        var _this = this;
        return {
            props: this.widgetProperties,
            onPropsChanged: function(cb) {
                _this.onPropsChangedRegistrar.register(cb);
            },
            fireEvent: function(eventName, data) {
                $w.fireEvent(eventName, $w.createEvent('widgetEvent', {
                    data: data
                }));
            },
        };
    };
    WidgetServices.prototype.generateControllerAPI = function($widget, initialControllerAPI) {
        var controllerAPI = _.assign({}, initialControllerAPI);
        this.pushObservedObject(controllerAPI, $widget.props, _.keys($widget.props), this.onPropsChangedRegistrar);
        return controllerAPI;
    };
    return WidgetServices;
}());
export {
    WidgetServices
};
//# sourceMappingURL=platform-services.js.map