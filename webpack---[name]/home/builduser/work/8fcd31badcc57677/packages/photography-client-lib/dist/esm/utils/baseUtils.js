import Wix from '../sdk/WixSdkWrapper';
import {
    clone,
    toString,
    keys,
    isFunction,
    reduce,
    isEqual,
    isArray,
    merge,
    isObject,
} from 'lodash';
import {
    stringify,
    parse
} from 'query-string';
import window from '../sdk/windowWrapper';
var BaseUtils = /** @class */ (function() {
    /* @ngInject */
    function BaseUtils() {
        this._cache = {};
        this._hash2int = {};
        this._params = {};
        this._useCache = this.shouldUseCache();
        this.setIsWixMobile = this.setIsWixMobile.bind(this);
    }
    BaseUtils.prototype.shouldUseCache = function() {
        var viewMode = true;
        try {
            viewMode =
                window &&
                window.Wix &&
                window.Wix.Utils &&
                window.Wix.Utils.getViewMode();
        } catch (e) {}
        if (this.isUndefined(viewMode)) {
            return true;
        }
        return viewMode !== 'editor' && viewMode !== 'preview';
    };
    BaseUtils.prototype.isUndefined = function(something) {
        return typeof something === 'undefined';
    };
    BaseUtils.prototype.getOrPutFromCache = function(fld, func) {
        // ignore cache in SSR (in ssr the module is kept alive between different renders) and in Editor and preview
        if (!this._useCache || this.isSSR()) {
            return func();
        }
        if (this._cache[fld] !== undefined) {
            return this._cache[fld];
        }
        this._cache[fld] = func();
        return this._cache[fld];
    };
    BaseUtils.prototype.isDemo = function() {
        return this.parseGetParam('demo') === '1';
    };
    BaseUtils.prototype.isInWix = function() {
        return (this.isTest() ||
            this.getOrPutFromCache('isInWix', function() {
                try {
                    return (top !== self &&
                        (document.location.host === 'progallery.wix.com' || // WIXAPPS-REFACTOR
                            document.location.host === 'progallery.wixapps.net') &&
                        document.location.search.indexOf('instance=') >= 0);
                } catch (e) {
                    return false;
                }
            }));
    };
    BaseUtils.prototype.isSemiNative = function() {
        try {
            return window.semiNative;
        } catch (e) {
            return false;
        }
    };
    BaseUtils.prototype.hashToInt = function(str, min, max) {
        var int = 0;
        if (this.isUndefined(str) || str.length === 0) {
            return int;
        }
        if (!this._hash2int[str]) {
            for (var i = 0; i < str.length; i++) {
                int += str.charCodeAt(i);
            }
            this._hash2int[str] = int;
        }
        if (this.isUndefined(min) || this.isUndefined(max)) {
            return this._hash2int[str];
        } else {
            return (this._hash2int[str] % (max - min + 1)) + min;
        }
    };
    BaseUtils.prototype.parseGetParam = function(val, url) {
        try {
            if (!this.isUndefined(this._params[val])) {
                return this._params[val];
            }
            var result_1 = '',
                tmp_1 = [];
            var _location = location;
            if (url) {
                _location = {
                    search: '?' + (url.split('?')[1] || ''),
                    pathname: (url.split('?')[0] || '').split('/')[1] || '',
                };
            }
            _location.search
                // .replace ( "?", "" )
                // this is better, there might be a question mark inside
                .substr(1)
                .split('&')
                .forEach(function(item) {
                    tmp_1 = item.split('=');
                    if (tmp_1[0] === val) {
                        result_1 = decodeURIComponent(tmp_1[1]);
                    }
                });
            if (!result_1) {
                // if the param was not found in the search, try decoding the path
                var query = decodeURIComponent(_location.pathname).split('?')[1];
                if (!query) {
                    return '';
                }
                query.split('&').forEach(function(item) {
                    tmp_1 = item.split('=');
                    if (tmp_1[0] === val) {
                        result_1 = decodeURIComponent(tmp_1[1]);
                    }
                });
            }
            this._params[val] = result_1;
            return result_1;
        } catch (e) {
            return false;
        }
    };
    BaseUtils.prototype.parsePathParam = function(val) {
        var path = location.pathname;
        var pathArr = path.split('/');
        for (var i = 0; i < pathArr.length; i++) {
            var param = pathArr[i];
            if (param.indexOf(val) >= 0) {
                return param;
            }
        }
        return '';
    };
    BaseUtils.prototype.parseHashParam = function(val) {
        var result = '';
        var tmp = [];
        var hashPart = location.href.split('#')[1] || '';
        if (!hashPart) {
            return '';
        }
        hashPart
            // .replace ( "?", "" )
            // this is better, there might be a question mark inside
            .substr(1)
            .split('&')
            .forEach(function(item) {
                tmp = item.split('=');
                if (tmp[0] === val) {
                    result = decodeURIComponent(tmp[1]);
                }
            });
        return result;
    };
    BaseUtils.prototype.stripSlashes = function(str) {
        var newStr = '';
        if (typeof str === 'string') {
            newStr = str
                .replace(/\\\//g, '/')
                .replace(/\\'/g, "'")
                .replace(/\\"/g, '"')
                .replace(/\\0/g, '\0')
                .replace(/\\\\/g, '\\');
        }
        return newStr;
    };
    BaseUtils.prototype.parseStringObject = function(sObj) {
        if (typeof sObj !== 'string') {
            return sObj;
        }
        var stripedObj = this.stripSlashes(sObj);
        if (typeof sObj === 'string' &&
            /^[\],:{}\s]*$/.test(stripedObj
                .replace(/\\["\\\/bfnrtu]/g, '@')
                .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
            // this is a json
            try {
                return JSON.parse(stripedObj);
            } catch (e) {
                // console.error('Parse object error: Catched ', e);
            }
        }
        return stripedObj;
    };
    BaseUtils.prototype.isWixMobile = function() {
        var _this = this;
        var _isWixMobile = function() {
            var deviceType = _this.parseGetParam('deviceType') || window.deviceType;
            var isMobileViewer = _this.parseGetParam('showMobileView') === 'true';
            if (isMobileViewer) {
                return true;
            } else if (deviceType) {
                return String(deviceType).toLowerCase().indexOf('mobile') >= 0;
            } else {
                return undefined;
            }
        };
        if (!this.isSite()) {
            return _isWixMobile();
        } else {
            return this.getOrPutFromCache('isWixMobile', _isWixMobile);
        }
    };
    BaseUtils.prototype.isUserAgentMobile = function() {
        try {
            var _isUserAgentMobile = function() {
                var check = false;
                (function(a) {
                    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|pixel|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) ||
                        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
                        check = true;
                    }
                })(navigator.userAgent || navigator.vendor || window.opera);
                return check;
            };
            if (!this.isSite()) {
                return _isUserAgentMobile();
            } else {
                return this.getOrPutFromCache('isUserAgentMobile', _isUserAgentMobile);
            }
        } catch (e) {
            return false;
        }
    };
    BaseUtils.prototype.setIsWixMobile = function(val) {
        window.deviceType = val ? 'mobile' : 'desktop';
        this._cache.isWixMobile = val;
        this._cache.isMobile = val;
    };
    BaseUtils.prototype.isMobile = function() {
        var _this = this;
        var _isMobile = function() {
            var isWixMobile = _this.isWixMobile();
            var isUserAgentMobile = _this.isUserAgentMobile();
            return _this.isUndefined(isWixMobile) ? isUserAgentMobile : isWixMobile;
        };
        if (this.isTest()) {
            return false;
        } else if (!this.isSite()) {
            return _isMobile();
        } else {
            return this.getOrPutFromCache('isMobile', _isMobile);
        }
    };
    BaseUtils.prototype.isTest = function() {
        try {
            return window.isTest;
        } catch (e) {
            return false;
        }
    };
    BaseUtils.prototype.isDev = function() {
        var _this = this;
        return this.getOrPutFromCache('isDev', function() {
            return (_this.isLocal() ||
                (_this.isOOI() && process.env.NODE_ENV === 'development') ||
                _this.shouldDebug('ph_local') ||
                !!_this.parseGetParam('debug') ||
                (_this.safeLocalStorage() || {}).forceDevMode === 'true');
        });
    };
    BaseUtils.prototype.isVerbose = function() {
        return (!this.isTest() &&
            ((this.safeLocalStorage() || {}).forceDevMode === 'true' ||
                this.shouldDebug('ph_verbose')));
    };
    BaseUtils.prototype.isLocal = function() {
        return this.getOrPutFromCache('isLocal', function() {
            var ipRegex = /([0-9]{1,3}\.){3}[0-9]{1,3}:[0-9]{1,5}/; // matches 111.222.333.444:9999
            var host = window.location.hostname || '';
            var isLocal = host === 'local.wix.com' ||
                host === '0.0.0.0' ||
                host.indexOf('localhost') >= 0 ||
                ipRegex.exec(host) !== null;
            return isLocal;
        });
    };
    BaseUtils.prototype.isStoreGallery = function() {
        var _this = this;
        return this.getOrPutFromCache('isStoreGallery', function() {
            if (_this.isSemiNative()) {
                return false;
            }
            try {
                return window.location.search.toLowerCase().indexOf('isstore') > -1;
            } catch (e) {
                if (_this.isDev()) {
                    console.error('cant find window', e);
                }
                return false;
            }
        });
    };
    BaseUtils.prototype.isDemoMode = function() {
        return (Wix &&
            Wix.Utils &&
            Wix.Utils.getInstanceValue &&
            Wix.Utils.getInstanceValue('demoMode'));
    };
    BaseUtils.prototype.isSSR = function() {
        return !!window.isMock;
    };
    BaseUtils.prototype.isOOI = function() {
        return (this.isSSR() ||
            (typeof top !== 'undefined' &&
                typeof self !== 'undefined' &&
                (top === self ||
                    self.location.href.includes('AlbumsGOGOOI') ||
                    self.location.origin.includes('editor.wix.com') ||
                    self.location.origin.includes('editorx.com'))));
    };
    BaseUtils.prototype.isPremium = function() {
        var _this = this;
        return this.getOrPutFromCache('isPremium', function() {
            var actualValue = true; // does not exist yet. requested in WEED-18724
            var forcedPremium = _this.shouldDebug('ph_force_premium');
            var forcedFreemium = _this.shouldDebug('ph_force_freemium');
            if (forcedPremium) {
                return true;
            } else if (forcedFreemium) {
                return false;
            } else if (actualValue) {
                return true;
            } else {
                return false;
            }
        });
    };
    BaseUtils.prototype.updateViewMode = function(forceVal) {
        // NOTICE: this method must be called after each EDIT_MODE_CHANGED event to clear the cache
        if (typeof forceVal === 'string' && this.isOOI()) {
            this._cache.viewMode = forceVal.toLowerCase();
            return this._cache.viewMode;
        }
        try {
            if (window &&
                window.Wix &&
                window.Wix.Utils &&
                window.Wix.Utils.getViewMode) {
                this._cache.viewMode = window.Wix.Utils.getViewMode();
                return this._cache.viewMode;
            }
        } catch (e) {
            return false;
        }
    };
    BaseUtils.prototype.getViewModeFromCache = function() {
        var _this = this;
        return this.getOrPutFromCache('viewMode', function() {
            try {
                if (_this.isOOI()) {
                    // maybe should use !isInWix() instead isOOI(), but seems that isInWix() is not working good as well (it's using isTest but isTest is not good for OOI)
                    if (_this.isVerbose()) {
                        console.warn('OOI - viewMode not found, returning site if not in wix.com(old test)');
                    }
                    try {
                        return window.location.host.includes('wixapps.net') ?
                            'undefined' :
                            'site';
                    } catch (e) {
                        return 'undefined';
                    }
                }
                if (_this.isSSR()) {
                    return 'site';
                }
                if (window &&
                    window.Wix &&
                    window.Wix.Utils &&
                    window.Wix.Utils.getViewMode) {
                    return window.Wix.Utils.getViewMode();
                }
                return 'undefined';
            } catch (e) {
                return false;
            }
        });
    };
    BaseUtils.prototype.isEditor = function() {
        // New OOI api
        if (this.isOOI()) {
            return this.getViewModeFromCache() === 'editor';
        }
        // Old iframe api
        if (!this.isInWix()) {
            return false;
        }
        return this.getViewModeFromCache() === 'editor';
    };
    BaseUtils.prototype.isPreview = function() {
        // New OOI api
        if (this.isOOI()) {
            return this.getViewModeFromCache() === 'preview';
        }
        // Old iframe api
        if (!this.isInWix()) {
            return false;
        }
        return this.getViewModeFromCache() === 'preview';
    };
    BaseUtils.prototype.isSite = function() {
        // New OOI api
        if (this.isOOI()) {
            return this.getViewModeFromCache() === 'site';
        }
        // Old iframe api
        return !this.isEditor() && !this.isPreview();
    };
    BaseUtils.prototype.getUUID = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (Math.random() * 16) | 0,
                v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };
    BaseUtils.prototype.generateUUID = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.floor(Math.random() * 16) || 0;
            return c === 'x' ? r.toString(16) : c;
        });
    };
    BaseUtils.prototype.isInSettings = function() {
        return this.parseGetParam('expandsettingsmode') === '1';
    };
    BaseUtils.prototype.isExternalUrl = function(url) {
        return /(^https?)|(^data)|(^blob)/.test(url);
    };
    BaseUtils.prototype.isMobileViewer = function() {
        var _this = this;
        return this.getOrPutFromCache('isMobileViewer', function() {
            var isWixMobile = _this.isWixMobile();
            var isUserAgentMobile = _this.isUserAgentMobile();
            return isWixMobile && !isUserAgentMobile;
        });
    };
    BaseUtils.prototype.isiOS = function() {
        return this.getOrPutFromCache('isiOS', function() {
            try {
                return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            } catch (e) {
                return false;
            }
        });
    };
    BaseUtils.prototype.isiPhone = function() {
        return this.getOrPutFromCache('isiPhone', function() {
            try {
                return /iPhone/.test(navigator.userAgent) && !window.MSStream;
            } catch (e) {
                return false;
            }
        });
    };
    BaseUtils.prototype.isTouch = function() {
        var _this = this;
        return this.getOrPutFromCache('isTouch', function() {
            try {
                return (_this.isMobile() || 'ontouchstart' in window.document.documentElement);
            } catch (e) {
                return false;
            }
        });
    };
    BaseUtils.prototype.browserIs = function(browserName) {
        var _browsers = this.getOrPutFromCache('browsers', function() {
            var browsers = {
                chrome: false,
                chromeIos: false,
                explorer: false,
                firefox: false,
                safari: false,
                opera: false,
            };
            try {
                browsers.chrome = navigator.userAgent.indexOf('Chrome') > -1;
                browsers.chromeIos = navigator.userAgent.indexOf('CriOS') > -1;
                browsers.explorer =
                    navigator.userAgent.indexOf('MSIE') > -1 ||
                    !!navigator.userAgent.match(/Trident.*rv\:11\./); // support for edge
                browsers.firefox = navigator.userAgent.indexOf('Firefox') > -1;
                browsers.safari = navigator.userAgent.indexOf('Safari') > -1;
                browsers.opera = navigator.userAgent.toLowerCase().indexOf('op') > -1;
                if (browsers.chrome && browsers.safari) {
                    browsers.safari = false;
                }
                if (browsers.chrome && browsers.opera) {
                    browsers.chrome = false;
                }
                return browsers;
            } catch (e) {
                return browsers;
            }
        });
        return _browsers[browserName];
    };
    BaseUtils.prototype.isPlayground = function() {
        if (this.isInWix()) {
            return false;
        }
        try {
            var isPlayground = false;
            try {
                isPlayground = top.location.href.indexOf('playground.html') > 0;
            } catch (e) {
                isPlayground = false;
            }
            return isPlayground;
        } catch (e) {
            return false;
        }
    };
    BaseUtils.prototype.isInAlbumsBuilder = function() {
        if (!this.isInWix()) {
            return false;
        }
        try {
            return (window &&
                window.debugApp &&
                window.debugApp.indexOf('ph_source_albums') > -1);
        } catch (e) {
            return false;
        }
    };
    BaseUtils.prototype.isWixDomain = function() {
        try {
            return window.location.href.indexOf('wixapps.net') >= 0;
        } catch (e) {
            return false;
        }
    };
    BaseUtils.prototype.isLandscape = function() {
        var _this = this;
        if (this.isSemiNative()) {
            return false;
        }
        return this.getOrPutFromCache('isLandscape', function() {
            if (!_this.isMobile()) {
                return false;
            }
            try {
                if (!_this.isUndefined(window.orientation)) {
                    return window.orientation === 90 || window.orientation === -90;
                } else {
                    var mql = window.matchMedia('(orientation: landscape)');
                    if (mql && mql.matches === true) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } catch (e) {
                return false;
            }
        });
    };
    BaseUtils.prototype.isOnBoarding = function() {
        try {
            var params = parse(window.location.search);
            return params.viewMode && params.viewMode.toLowerCase() === 'onboarding';
        } catch (e) {
            return false;
        }
    };
    BaseUtils.prototype.isAccessibilityEnabled = function() {
        var _this = this;
        // for iFrame only
        return this.getOrPutFromCache('isAccessibilityEnabled', function() {
            if (!_this.isSite()) {
                return false;
            }
            if (_this.isOOI()) {
                return false;
            }
            var isDevAccessibility = _this.shouldDebug('accessibility');
            if (Wix && typeof Wix.isVisualFocusEnabled === 'function') {
                try {
                    Wix.isVisualFocusEnabled(function(isIt) {
                        return isIt || isDevAccessibility;
                    });
                } catch (e) {
                    //
                }
            }
            return isDevAccessibility;
        });
    };
    BaseUtils.prototype.isDebugBuild = function() {
        try {
            return process.env.NODE_ENV === 'development';
        } catch (e) {
            return false;
        }
    };
    BaseUtils.prototype.getDeviceType = function() {
        return this.isWixMobile() ? 'mobile' : 'desktop';
    };
    BaseUtils.prototype.safeLocalStorage = function() {
        try {
            return localStorage ? localStorage : window; // TrackJS errors, function returning null
        } catch (e) {
            return window;
        }
    };
    BaseUtils.prototype.shouldDebug = function(str) {
        try {
            return (!!this.safeLocalStorage()[str] ||
                (window.debugApp || '').indexOf(str) >= 0 ||
                (this.parseGetParam('debugApp') || '').indexOf(str) >= 0);
        } catch (e) {
            return false;
        }
    };
    BaseUtils.prototype.shouldLog = function(str) {
        return this.shouldDebug('ph_log_' + str);
    };
    BaseUtils.prototype.getDateCreatedTicksFromStr = function(dateCreatedStr) {
        var isDateCreatedValid = isNaN(Date.parse(dateCreatedStr)) === false;
        if (isDateCreatedValid) {
            return Date.parse(dateCreatedStr);
        }
        // date that is not too old
        // 1499609301000
        return Date.parse('2017-07-09T14:08:21.000Z');
    };
    BaseUtils.prototype.deviceHasMemoryIssues = function() {
        return this.isiOS();
    };
    BaseUtils.prototype.getUrlPrefix = function(forceProduction) {
        try {
            return (window.location.protocol +
                '//' +
                (!forceProduction && this.isLocal() ?
                    'local.wix.com:3001' :
                    'progallery.wixapps.net') +
                '/');
        } catch (e) {
            console.error('getUrlPrefix', {
                e: e
            });
            return 'http://progallery.wixapps.net/';
        }
    };
    BaseUtils.prototype.getFullscreenSectionId = function() {
        var isStore = this.isStoreGallery();
        return isStore ? 'fullscreen_store_page' : 'fullscreen_page';
    };
    BaseUtils.prototype.getApiUrlPrefix = function() {
        return this.getUrlPrefix(true) + 'api/v1/';
    };
    BaseUtils.prototype.generateUrl = function(endpointFile, params) {
        params = params || {};
        var isStore = this.isStoreGallery();
        var url = this.getUrlPrefix() + endpointFile;
        if (isStore) {
            params.isStore = true;
        }
        var paramsStr = stringify(params);
        return paramsStr ? url + '?' + paramsStr : url;
    };
    BaseUtils.prototype.getTextEditorUrl = function() {
        return this.generateUrl('text-editor.html');
    };
    BaseUtils.prototype.getManageMediaUrl = function() {
        return this.generateUrl('photos.html');
    };
    BaseUtils.prototype.getExpandSettingsUrl = function(params) {
        return this.generateUrl('settings-expand.html', params);
    };
    BaseUtils.prototype.getSettingsWatermarkDisableUrl = function() {
        return this.generateUrl('settings-watermark-disable.html');
    };
    BaseUtils.prototype.getSettingsAddonsUrl = function(params) {
        if (params === void 0) {
            params = {};
        }
        return this.generateUrl('settings-addons.html', params);
    };
    BaseUtils.prototype.getProviderModalUrl = function(params) {
        if (params === void 0) {
            params = {};
        }
        return this.generateUrl('provider-modal.html', params);
    };
    BaseUtils.prototype.getTabIndex = function(elementName) {
        var elementsArr = [
            'currentGalleryItem',
            'loadMoreButton',
            'slideshowNext',
            'slideshowPrev',
            'currentThumbnail',
            'slideshowLove',
            'slideshowShare',
            'cartIcon',
            'cartClose',
            'cartFrame',
            'fullscreenClose',
            'fullscreenNext',
            'fullscreenPrev',
            'fullscreenInfo',
            // 'fullscreenTitle',
            // 'fullscreenDesc',
            'fullscreenLink',
            'fullscreenProvider',
            'fullscreenCartButton',
            'fullscreenCheckout',
            'fullscreenExpand',
            'fullscreenVideoPlay',
            'fullscreenVideoBar',
            'fullscreenVideoMute',
            'fullscreenVideoVolume',
            'fullscreenCartIcon',
            'fullscreenDownload',
            'fullscreenLove',
            'fullscreenShare',
        ];
        var elementIdx = elementsArr.indexOf(elementName) + 1;
        if (elementIdx >= 0 && this.isOOI()) {
            return 0;
        }
        return elementIdx || -1; // no tabIndex (tab will not focus on this item)
    };
    BaseUtils.prototype.safeSessionStorage = function() {
        try {
            return sessionStorage;
        } catch (e) {
            return window || {};
        }
    };
    BaseUtils.prototype.getLocalStorage = function() {
        if (this.isDev()) {
            return this.safeSessionStorage();
        } else {
            var _localStorage = this.safeLocalStorage();
            return _localStorage || this.safeSessionStorage();
        }
    };
    BaseUtils.prototype.setStateAndLog = function(that, caller, state, callback) {
        var _this = this;
        if (this.isVerbose()) {
            console.log("State Change Called (" + caller + ")", state);
            var oldState_1 = clone(that.state);
            that.setState(state, function() {
                var newState = clone(that.state);
                var change = _this.printableObjectsDiff(oldState_1, newState, 'state');
                if (keys(change).length > 0) {
                    console.log("State Change Completed (" + caller + ")", change);
                }
                if (isFunction(callback)) {
                    callback.bind(that)();
                }
            });
        } else {
            that.setState(state, function() {
                if (isFunction(callback)) {
                    callback.bind(that)();
                }
            });
        }
    };
    BaseUtils.prototype.printableObjectsDiff = function(obj1, obj2, prefix) {
        var _this = this;
        if (prefix === void 0) {
            prefix = '';
        }
        var _toString = function(v) {
            if (v === '') {
                v = "''";
            } else if (_this.isUndefined(v)) {
                v = 'undefined';
            }
            return toString(v);
        };
        var getInnerDiff = function(innerObj1, innerObj2, innerPrefix) {
            var innerDiff = reduce(innerObj1, function(res, v, k) {
                if (!isEqual(v, innerObj2[k])) {
                    if (isArray(innerObj2[k])) {
                        if (v.length !== innerObj2[k].length) {
                            res[k + '.length'] =
                                '[' + v.length + '] => [' + innerObj2[k].length + ']';
                        }
                        res = merge(res, getInnerDiff(v, innerObj2[k], (innerPrefix ? innerPrefix + '.' : '') + k));
                    } else if (isObject(innerObj2[k])) {
                        res = merge(res, getInnerDiff(v, innerObj2[k], (innerPrefix ? innerPrefix + '.' : '') + k));
                    } else {
                        res[(innerPrefix ? innerPrefix + '.' : '') + k] =
                            _toString(v) + ' => ' + _toString(innerObj2[k]);
                    }
                }
                return res;
            }, {});
            return innerDiff;
        };
        return getInnerDiff(obj1, obj2, prefix);
    };
    BaseUtils.prototype.setExternalId = function() {
        var _this = this;
        try {
            var uuid_1 = this.getUUID();
            this._setExternalId(uuid_1);
            if (!this.setExternalIdTimeouts) {
                this.setExternalIdTimeouts = {};
            }
            for (var delay = 1000; delay < 10000; delay += 1000) {
                if (this.setExternalIdTimeouts[delay]) {
                    clearTimeout(this.setExternalIdTimeouts[delay]);
                }
                this.setExternalIdTimeouts[delay] = setTimeout(function() {
                    return _this._setExternalId(uuid_1);
                }, delay); // try setting external id again. There is a bug that it is not set sometimes.
            }
        } catch (e) {
            console.error('Utils setExternalId - fail');
            return false;
        }
    };
    BaseUtils.prototype._setExternalId = function(id) {
        var _this = this;
        Wix.Settings.setExternalId(id, function(success) {
            _this.isDev() &&
                console.log('Utils setExternalId - success', id, success);
        }, function(error) {
            console.error('Utils setExternalId - fail', id, error);
        });
    };
    BaseUtils.prototype.isWebpSupported = function() {
        if (this.isTest()) {
            return false;
        }
        try {
            var canvas = typeof document === 'object' ?
                window.document.createElement('canvas') :
                {};
            canvas.width = canvas.height = 1;
            return canvas.toDataURL ?
                canvas.toDataURL('image/webp').indexOf('image/webp') === 5 :
                false;
        } catch (e) {
            return false;
        }
    };
    BaseUtils.prototype.getGalleryLayoutName = function(galleryLayout) {
        switch (galleryLayout) {
            case 0:
                return 'Collage';
            case 1:
                return 'Masonry';
            case 2:
                return 'Grid';
            case 3:
                return 'Thumbnails';
            case 4:
                return 'Slider';
            case 5:
                return 'Slideshow';
            case 6:
                return 'Strip';
            case 7:
                return 'Columns';
            case 8:
                return 'Magic';
            case 10:
                return 'Bricks';
            case 11:
                return 'Mix';
            case 12:
                return 'Alternate';
            default:
                return '';
        }
    };
    BaseUtils.prototype.shallowObjectsCompare = function(obj1, obj2) {
        return (Object.keys(obj1).length === Object.keys(obj2).length &&
            Object.keys(obj1).every(function(key) {
                return obj2.hasOwnProperty(key) && obj1[key] === obj2[key];
            }));
    };
    BaseUtils.prototype.isSubset = function(superObj, subObj) {
        return Object.keys(subObj).every(function(ele) {
            return subObj[ele] === superObj[ele];
        });
    };
    return BaseUtils;
}());
export default BaseUtils;
export var baseUtils = new BaseUtils(); // for inner use
//# sourceMappingURL=baseUtils.js.map