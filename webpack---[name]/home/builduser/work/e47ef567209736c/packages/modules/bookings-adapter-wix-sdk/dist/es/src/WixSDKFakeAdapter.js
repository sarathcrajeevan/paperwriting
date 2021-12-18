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
var WixSDKFakeAdapter = /** @class */ (function() {
    function WixSDKFakeAdapter(fakeTpaResponse, deviceType, dimensions) {
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
        this.deviceType = deviceType;
        this.dimensions = dimensions;
        this.getInstance = function() {
            return '11111111';
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
                    left: 0,
                },
            });
        };
        this.addEventListener = function(eventName, cb) {
            _this.queue.push(cb);
        };
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
        this.queue = [];
    }
    WixSDKFakeAdapter.prototype.refreshApp = function(event) {
        //
    };
    WixSDKFakeAdapter.prototype.forceSaveSite = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                return [2 /*return*/ ];
            });
        });
    };
    Object.defineProperty(WixSDKFakeAdapter.prototype, "instanceId", {
        get: function() {
            return 'instanceId';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WixSDKFakeAdapter.prototype, "isOverEditor", {
        get: function() {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WixSDKFakeAdapter.prototype, "isOwner", {
        get: function() {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WixSDKFakeAdapter.prototype, "biToken", {
        get: function() {
            return 'biToken';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WixSDKFakeAdapter.prototype, "contactId", {
        get: function() {
            return 'contactId';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WixSDKFakeAdapter.prototype, "visitorId", {
        get: function() {
            return 'visitorId';
        },
        enumerable: false,
        configurable: true
    });
    WixSDKFakeAdapter.prototype.setColor = function(key, value) {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                return [2 /*return*/ , 'setColor Done'];
            });
        });
    };
    WixSDKFakeAdapter.prototype.setFont = function(key, value) {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                return [2 /*return*/ , 'setFont Done'];
            });
        });
    };
    WixSDKFakeAdapter.prototype.getDashboardBaseUrl = function() {
        return 'htts://wix.com/biz-mgr/234234-3434/';
    };
    WixSDKFakeAdapter.prototype.getComponentInfo = function() {
        return 'componentInfo';
    };
    WixSDKFakeAdapter.prototype.getCurrentPageId = function(callback) {
        callback({});
    };
    WixSDKFakeAdapter.prototype.pushState = function() {
        //
    };
    WixSDKFakeAdapter.prototype.replaceSectionState = function() {
        //
    };
    WixSDKFakeAdapter.prototype.resizeComponent = function() {
        //
    };
    WixSDKFakeAdapter.prototype.openPackagePicker = function(referrer) {
        //
    };
    WixSDKFakeAdapter.prototype.openBackOfficeFrom = function(deepLink) {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                return [2 /*return*/ ];
            });
        });
    };
    WixSDKFakeAdapter.prototype.isPremium = function() {
        return true;
    };
    Object.defineProperty(WixSDKFakeAdapter.prototype, "isFullWidth", {
        get: function() {
            return new Promise(function(resolve) {
                return resolve(true);
            });
        },
        enumerable: false,
        configurable: true
    });
    WixSDKFakeAdapter.prototype.navigate = function(sectionId) {
        console.log('Navigating to: ', sectionId);
    };
    WixSDKFakeAdapter.prototype.closeSettingsPanel = function() {
        console.log('closing settings panel');
    };
    WixSDKFakeAdapter.prototype.isAppSectionInstalled = function(sectionId, options, cb) {
        cb(sectionId === 'bookings_member_area' || sectionId === 'book_checkout');
    };
    WixSDKFakeAdapter.prototype.getSiteInfo = function(callback) {
        callback({
            pageTitle: 'Local Server',
            pageTitleOnly: 'Home',
            referer: '',
            siteDescription: 'Local server',
            siteKeywords: 'Good things happen when everything connects',
            url: window.location.href,
            baseUrl: window.location.href,
        });
    };
    WixSDKFakeAdapter.prototype.setHeight = function() {
        return null;
    };
    WixSDKFakeAdapter.prototype.getExternalId = function(callback) {
        callback(null);
    };
    WixSDKFakeAdapter.prototype.setHelpArticleId = function(articleId) {
        return null;
    };
    WixSDKFakeAdapter.prototype.getDeviceType = function() {
        return getCurrentDeviceType();
    };
    return WixSDKFakeAdapter;
}());
export {
    WixSDKFakeAdapter
};
//# sourceMappingURL=WixSDKFakeAdapter.js.map