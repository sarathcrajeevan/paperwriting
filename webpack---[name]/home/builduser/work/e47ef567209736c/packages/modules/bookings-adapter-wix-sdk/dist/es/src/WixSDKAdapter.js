import {
    __awaiter,
    __generator
} from "tslib";
var refreshWindow = function() {
    return window.location.reload();
};
var WixSDKAdapter = /** @class */ (function() {
    function WixSDKAdapter(Wix) {
        this.Wix = Wix;
        this.setColor = this.setColor.bind(this);
        this.setFont = this.setFont.bind(this);
    }
    WixSDKAdapter.prototype.openBackOfficeFrom = function(deepLink) {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , this.forceSaveSite()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/ , this.Wix.Settings.openDashboard({
                            onClose: function() {
                                refreshWindow();
                            },
                            state: deepLink,
                        })];
                }
            });
        });
    };
    WixSDKAdapter.prototype.isAppSectionInstalled = function(sectionId, options, cb) {
        return this.Wix.isAppSectionInstalled(sectionId, options, cb);
    };
    WixSDKAdapter.prototype.refreshApp = function(event) {
        return this.Wix.Settings.triggerSettingsUpdatedEvent(event, this.Wix.Utils.getOrigCompId());
    };
    WixSDKAdapter.prototype.forceSaveSite = function() {
        var _this = this;
        var didSiteUnsaved = function(siteInfo) {
            return siteInfo.baseUrl === '';
        };
        return new Promise(function(resolve) {
            _this.Wix.Settings.getSiteInfo(function(siteInfo) {
                if (didSiteUnsaved(siteInfo)) {
                    _this.Wix.Settings.getDashboardAppUrl(function() {
                        _this.refreshApp('scheduler-owner-update');
                        refreshWindow();
                    });
                } else {
                    resolve();
                }
            });
        });
    };
    WixSDKAdapter.prototype.navigate = function(sectionId) {
        this.Wix.Utils.navigateToSection({
            sectionId: sectionId
        }, function() {
            return console.error('cant navigate to book checkout');
        });
    };
    WixSDKAdapter.prototype.closeSettingsPanel = function() {
        this.Wix.Settings.closeWindow({
            target: 'ALL'
        });
    };
    WixSDKAdapter.prototype.openPackagePicker = function(referrer) {
        (this.Wix.SuperApps || this.Wix).Settings.openBillingPage({
            referrer: referrer
        });
    };
    WixSDKAdapter.prototype.isPremium = function() {
        var _this = this;
        return !!this.getSafeValue(function() {
            return _this.Wix.Utils.getInstanceValue('vendorProductId');
        });
    };
    Object.defineProperty(WixSDKAdapter.prototype, "instanceId", {
        get: function() {
            return this.getSafeValue(this.Wix.Utils.getInstanceId);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WixSDKAdapter.prototype, "isOverEditor", {
        get: function() {
            return this.getSafeValue(this.Wix.Utils.isOverEditor);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WixSDKAdapter.prototype, "isOwner", {
        get: function() {
            var permissions = this.getSafeValue(this.Wix.Utils.getPermissions);
            return permissions === 'OWNER';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WixSDKAdapter.prototype, "biToken", {
        get: function() {
            var _this = this;
            return this.getSafeValue(function() {
                return _this.Wix.Utils.getInstanceValue('biToken');
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WixSDKAdapter.prototype, "contactId", {
        get: function() {
            return this.getSafeValue(this.Wix.Utils.getUid);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WixSDKAdapter.prototype, "visitorId", {
        get: function() {
            var uid = this.Wix.Utils.getInstanceValue('uid');
            if (uid === null) {
                return this.Wix.Utils.getInstanceValue('aid');
            }
            return uid;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WixSDKAdapter.prototype, "siteColors", {
        get: function() {
            return new Promise(this.Wix.Styles.getSiteColors);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WixSDKAdapter.prototype, "siteTextPresets", {
        get: function() {
            return new Promise(this.Wix.Styles.getSiteTextPresets);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WixSDKAdapter.prototype, "styleParams", {
        get: function() {
            return new Promise(this.Wix.Styles.getStyleParams);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WixSDKAdapter.prototype, "isFullWidth", {
        get: function() {
            var _this = this;
            return new Promise(function(resolve) {
                return _this.Wix.Settings.isFullWidth(resolve);
            });
        },
        enumerable: false,
        configurable: true
    });
    WixSDKAdapter.prototype.setColor = function(key, value) {
        var _this = this;
        return new Promise(function(resolve) {
            return _this.Wix.Styles.setColorParam(key, {
                value: value
            }, resolve);
        });
    };
    WixSDKAdapter.prototype.setFont = function(key, value) {
        var _this = this;
        return new Promise(function(resolve) {
            return _this.Wix.Styles.setFontParam(key, {
                value: value
            }, resolve);
        });
    };
    WixSDKAdapter.prototype.getSafeValue = function(invokable) {
        try {
            return invokable();
        } catch (e) {
            return '';
        }
    };
    WixSDKAdapter.prototype.setHelpArticleId = function(articleId) {
        return this.Wix.Settings.setHelpArticle(articleId);
    };
    WixSDKAdapter.prototype.getDeviceType = function() {
        return this.Wix.Utils.getDeviceType();
    };
    return WixSDKAdapter;
}());
export {
    WixSDKAdapter
};
//# sourceMappingURL=WixSDKAdapter.js.map