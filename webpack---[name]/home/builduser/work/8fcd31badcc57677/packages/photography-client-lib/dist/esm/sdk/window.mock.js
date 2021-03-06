import {
    __assign
} from "tslib";
var noop = function() {
    return ({});
};
var width = 2560;
var height = 1440;
var dims = {
    y: 0,
    x: 0,
    width: width,
    height: height,
    innerWidth: width,
    innerHeight: height,
    clientWidth: width,
    clientHeight: height,
};
var elemProps = {
    parentNode: __assign(__assign({}, dims), {
        getBoundingClientRect: function() {
            return dims;
        },
        removeChild: noop,
        appendChild: noop,
        setAttribute: noop
    }),
    removeChild: noop,
    appendChild: noop,
    setAttribute: noop,
};
var elem = __assign(__assign(__assign({}, dims), elemProps), {
    getBoundingClientRect: function() {
        return dims;
    }
});
var event = {
    initCustomEvent: noop,
    createEvent: noop,
    composedPath: noop,
    initEvent: noop,
    preventDefault: noop,
    stopImmediatePropagation: noop,
    stopPropagation: noop,
};
var documentMock = __assign({
    addEventListener: noop,
    removeEventListener: noop,
    createEvent: function() {
        return event;
    },
    createElement: function() {
        return elem;
    },
    getElementById: function() {
        return elem;
    },
    getElementsByClassName: function() {
        return [elem];
    },
    getElementsByTagName: function() {
        return [elem];
    },
    querySelector: function() {
        return [elem];
    },
    documentElement: elem,
    activeElement: elem,
    style: dims
}, dims);
documentMock.body = documentMock;
var locationMock = {
    href: 'http://mock.wix.com/',
    protocol: 'http:',
    host: 'mock.wix.com',
    hostname: 'mock.wix.com',
    port: '',
    pathname: '/',
    search: '',
    hash: '',
};
var windowMock = __assign({
    isMock: true,
    isSSR: true,
    orientation: 0,
    devicePixelRatio: 1,
    scrollTop: 0,
    addEventListener: noop,
    removeEventListener: noop,
    createEvent: noop,
    CustomEvent: noop,
    screen: dims,
    open: noop,
    petri: {},
    search: {},
    location: locationMock,
    postMessage: noop,
    requestAnimationFrame: noop,
    dispatchEvent: noop,
    document: documentMock,
    getComputedStyle: noop,
    localStorage: {},
    frames: []
}, dims);
windowMock.parent = windowMock;
export default windowMock;
//# sourceMappingURL=window.mock.js.map