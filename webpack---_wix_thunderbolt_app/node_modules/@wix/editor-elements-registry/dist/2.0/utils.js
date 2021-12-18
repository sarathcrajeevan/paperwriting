"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.flat = exports.getExtension = exports.isCSS = exports.isJS = exports.LOCAL_DEV_HOSTS = exports.isBrowserMainThread = exports.isBrowser = exports.isServer = exports.isWorker = void 0;
var isWorker = function() {
    return typeof WorkerGlobalScope !== 'undefined';
};
exports.isWorker = isWorker;
var isServer = function() {
    return !exports.isWorker() && typeof window === 'undefined';
};
exports.isServer = isServer;
var isBrowser = function() {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined';
};
exports.isBrowser = isBrowser;
var isBrowserMainThread = function() {
    return exports.isBrowser() && !exports.isWorker();
};
exports.isBrowserMainThread = isBrowserMainThread;
exports.LOCAL_DEV_HOSTS = [
    'https://bo.wix.com/suricate/tunnel/',
    'https://localhost:',
    'http://localhost:',
    'https://sled.wix.dev/',
];

function isJS(url) {
    return getExtension(url) === 'js';
}
exports.isJS = isJS;

function isCSS(url) {
    return getExtension(url) === 'css';
}
exports.isCSS = isCSS;

function getExtension(url) {
    return url.split('.').pop();
}
exports.getExtension = getExtension;

function flat(arr) {
    var result = [];
    var _flat = function(_arr) {
        _arr.forEach(function(element) {
            if (Array.isArray(element)) {
                _flat(element);
            } else {
                result.push(element);
            }
        });
    };
    _flat(arr);
    return result;
}
exports.flat = flat;
//# sourceMappingURL=utils.js.map