import {
    __awaiter,
    __generator
} from "tslib";
import {
    DeviceType
} from './WixSDKPort';
var getCurrentDeviceType = function() {
    return DeviceType.DESKTOP;
};
var safeCallCallback = function(callback, value) {
    if (callback) {
        callback(value);
    }
    return value;
};
export var getCurrentDimensions = function() {
    return getCurrentDeviceType() === DeviceType.MOBILE ?
        {
            width: 280,
            height: 500,
        } :
        {
            width: 700,
            height: 400,
        };
};
var WixMock = /** @class */ (function() {
    function WixMock(fakeTpaResponse, deviceType, dimensions, windowAdapter) {
        var _this = this;
        if (fakeTpaResponse === void 0) {
            fakeTpaResponse = null;
        }
        if (deviceType === void 0) {
            deviceType = getCurrentDeviceType();
        }
        if (dimensions === void 0) {
            dimensions = getCurrentDimensions();
        }
        if (windowAdapter === void 0) {
            windowAdapter = window;
        }
        this.deviceType = deviceType;
        this.dimensions = dimensions;
        this.windowAdapter = windowAdapter;
        this.getInstance = function() {
            return _this.instanceValue;
        };
        this.getBoundingRectAndOffsets = function(callback) {
            var _a = _this.dimensions,
                width = _a.width,
                height = _a.height;
            callback({
                rect: {
                    width: width,
                    height: height,
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                },
                offsets: {
                    x: 0,
                    y: 0,
                },
                scale: 1,
            });
        };
        this.Utils = {
            isOverEditor: function() {
                return false;
            },
            getPermissions: function() {
                return '';
            },
            getInstance: function() {
                return _this.instanceValue;
            },
            getInstanceValue: function(key) {
                return _this.instanceValue[key];
            },
            getInstanceId: function() {
                return 'id-of-buissnes';
            },
            Media: {
                getResizedImageUrl: function(uri, width, height) {
                    return '';
                },
            },
            getViewMode: function() {
                return 'standalone';
            },
            navigateToSection: function(_a, cb) {
                var _b = _a.sectionId,
                    sectionId = _b === void 0 ? null : _b;
                if (cb === void 0) {
                    cb = function() {
                        return null;
                    };
                }
                return null;
            },
            getOrigCompId: function() {
                return '123';
            },
            getCompId: function() {
                return 'comp-jnybzzmo';
            },
            getSiteOwnerId: function() {
                return '';
            },
            getUid: function() {
                return '';
            },
            getDemoMode: function() {
                return true;
            },
            getLocale: function() {
                return 'en';
            },
            getDeviceType: function() {
                return _this.deviceType;
            },
        };
        this.Performance = {
            applicationLoaded: function() {
                return null;
            },
        };
        this.Settings = {
            getSiteBaseUrl: function() {
                return 'https://same.site.url';
            },
            getSiteInfo: function(func) {
                func({
                    baseUrl: 'https://site.url.com'
                });
            },
            triggerSettingsUpdatedEvent: function(msg, compId) {
                return null;
            },
            setHelpArticle: function(articleId) {
                return null;
            },
            isFullWidth: function(callback) {
                callback(true);
            },
            closeWindow: function(args) {
                return null;
            },
        };
        this.Styles = {
            getSiteColors: function(cb) {
                return safeCallCallback(cb, _this.siteColors);
            },
            getSiteTextPresets: function(cb) {
                return safeCallCallback(cb, _this.siteTextPresets);
            },
            getStyleParams: function(cb) {
                return safeCallCallback(cb, _this.styleParams);
            },
            getStyleId: function(cb) {
                return safeCallCallback(cb, 'style-jp8ide5x');
            },
            getEditorFonts: function(cb) {
                // cb(fakeTpaResponse.res.fonts);
            },
            setFontParam: function(name) {
                return null;
            },
            openFontPicker: function(name) {
                return null;
            },
            openColorPicker: function(name) {
                return null;
            },
            setColorParam: function(name) {
                return null;
            },
            setNumberParam: function(key, value) {
                return null;
            },
            setUILIBParamValue: function(name) {
                return null;
            },
        };
        this.Events = {
            PUBLIC_DATA_CHANGED: 'PUBLIC_DATA_CHANGED',
        };
        this.addEventListener = function(eventName, cb) {
            _this.queue.push(cb);
        };
        this.Data = {
            Public: {
                get: function(key, scope, success, failure) {
                    var _a;
                    if (success === void 0) {
                        success = null;
                    }
                    if (failure === void 0) {
                        failure = null;
                    }
                    if (success) {
                        success((_a = {}, _a[key] = _this.publicData[key], _a));
                    } else if (failure) {
                        failure();
                    }
                },
                set: function(key, value, scope, success, failure) {
                    if (success === void 0) {
                        success = null;
                    }
                    if (failure === void 0) {
                        failure = null;
                    }
                    _this.publicData[key] = value;
                    if (success) {
                        success();
                    } else if (failure) {
                        failure();
                    }
                },
                getAll: function(success, failure) {
                    if (success === void 0) {
                        success = null;
                    }
                    if (failure === void 0) {
                        failure = null;
                    }
                    if (success) {
                        success({
                            COMPONENT: _this.publicData
                        });
                    } else if (failure) {
                        failure();
                    }
                },
            },
        };
        this.PubSub = {
            publish: function(key, data, isTo) {
                return null;
            },
        };
        this.Activities = {};
        this.Analytics = {};
        this.Billing = {};
        this.Dashboard = {};
        this.Features = {};
        this.Media = {};
        this.Preview = {};
        this.publicData = {};
        this.instanceValue =
            'fjedznBGpRyC4DtPPLy-PcWfOCfMsqgsNVqQw-DDqeY.eyJpbnN0YW5jZUlkIjoiODUxMTY1NGEtNmM1Yi00ODhlLTg1ZmItZTIzZmI4MDZiNWU5IiwiYXBwRGVmSWQiOiIxM2QyMWM2My1iNWVjLTU5MTItODM5Ny1jM2E1ZGRiMjdhOTciLCJtZXRhU2l0ZUlkIjoiNWRlZGI3ZDAtYzBmNi00OGFhLTg3M2YtNGUyMjg2MTc4ZGVmIiwic2lnbkRhdGUiOiIyMDE5LTAxLTAyVDEwOjE5OjU1LjIxOVoiLCJ1aWQiOm51bGwsImlwQW5kUG9ydCI6IjkxLjE5OS4xMTkuMjU0LzQwMDc0IiwidmVuZG9yUHJvZHVjdElkIjoiV2l4Qm9va2luZ3NVbmxpbWl0ZWQiLCJkZW1vTW9kZSI6ZmFsc2UsImFpZCI6ImU3N2IzYmYwLWQ4MzAtNDdkMy04YTUzLTE2NjFiNWM5NTgyYiIsImJpVG9rZW4iOiJkOGZjZDI5YS1hY2FkLTAwMjQtMDJjNC1hYzFkM2UxMTM4MDYiLCJzaXRlT3duZXJJZCI6IjRlNjYzNmQzLTE3OTMtNGQ0Yi05ZDk0LTBkNDY0MjJiZmVhYSJ9';
        this.siteColors = fakeTpaResponse ? fakeTpaResponse.res.siteColors : [];
        this.siteTextPresets = fakeTpaResponse ?
            fakeTpaResponse.res.siteTextPresets :
            {};
        this.styleParams = fakeTpaResponse ?
            fakeTpaResponse.res.style :
            {
                numbers: {}
            };
        if (windowAdapter.Wix &&
            windowAdapter.Wix.Utils.getViewMode() === 'standalone') {
            windowAdapter.Wix.Utils.getViewMode = function() {
                return 'site';
            };
            if (fakeTpaResponse) {
                windowAdapter.postMessage(JSON.stringify(fakeTpaResponse), '*');
            }
        }
        this.queue = [];
    }
    WixMock.prototype.getDashboardBaseUrl = function() {
        return 'htts://wix.com/biz-mgr/234234-3434/';
    };
    WixMock.prototype.getComponentInfo = function() {
        return 'componentInfo';
    };
    WixMock.prototype.getCurrentPageId = function(callback) {
        callback({});
    };
    WixMock.prototype.pushState = function() {
        //
    };
    WixMock.prototype.replaceSectionState = function() {
        //
    };
    WixMock.prototype.resizeComponent = function() {
        //
    };
    WixMock.prototype.openPackagePicker = function(referrer) {
        //
    };
    WixMock.prototype.openBackOfficeFrom = function(deepLink) {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                return [2 /*return*/ ];
            });
        });
    };
    WixMock.prototype.isPremium = function() {
        return true;
    };
    WixMock.prototype.isAppSectionInstalled = function(sectionId, options, cb) {
        cb(sectionId === 'bookings_member_area' || sectionId === 'book_checkout');
    };
    WixMock.prototype.getSiteInfo = function(callback) {
        callback({
            pageTitle: 'Local Server',
            pageTitleOnly: 'Home',
            referer: '',
            siteDescription: 'Local server',
            siteKeywords: 'Good things happen when everything connects',
            url: this.windowAdapter.location.href,
            baseUrl: this.windowAdapter.location.href,
        });
    };
    WixMock.prototype.setHeight = function() {
        return null;
    };
    WixMock.prototype.getExternalId = function(callback) {
        return safeCallCallback(callback, null);
    };
    return WixMock;
}());
export {
    WixMock
};
//# sourceMappingURL=WixMock.js.map