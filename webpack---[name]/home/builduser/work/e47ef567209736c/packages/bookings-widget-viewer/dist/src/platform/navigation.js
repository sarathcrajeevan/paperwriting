"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Navigation = exports.ClientConst = exports.StorageConst = exports.WidgetDeepLinkConst = void 0;
var tslib_1 = require("tslib");
var data_capsule_1 = require("data-capsule");
var constants_1 = require("../constants");
var bookings_uou_domain_1 = require("@wix/bookings-uou-domain");
var WidgetDeepLinkConst;
(function(WidgetDeepLinkConst) {
    WidgetDeepLinkConst["REFRESH_APP"] = "widgetRefreshApp";
})(WidgetDeepLinkConst = exports.WidgetDeepLinkConst || (exports.WidgetDeepLinkConst = {}));
var StorageConst;
(function(StorageConst) {
    StorageConst["DEEP_LINK"] = "deepLink";
})(StorageConst = exports.StorageConst || (exports.StorageConst = {}));
var ClientConst;
(function(ClientConst) {
    ClientConst["BOOKINGS_PAGE_ID"] = "bookingsPageId";
})(ClientConst = exports.ClientConst || (exports.ClientConst = {}));
var Navigation = /** @class */ (function() {
    function Navigation(wixSdkAdapter, compId, offering) {
        this.wixSdkAdapter = wixSdkAdapter;
        this.compId = compId;
        this.offering = offering;
    }
    Navigation.prototype.navigateToApp = function(intent) {
        return tslib_1.__awaiter(this, void 0, void 0, function() {
            return tslib_1.__generator(this, function(_a) {
                // TODO: remove when location.to is added to viewerScriptWrapper
                if (this.wixSdkAdapter.isRunningInIframe()) {
                    return [2 /*return*/ , this.legacyNavigateToApp(intent)];
                }
                return [2 /*return*/ , this.ooiNavigateToApp(intent)];
            });
        });
    };
    Navigation.prototype.ooiNavigateToApp = function(intent) {
        return tslib_1.__awaiter(this, void 0, void 0, function() {
            var suffix;
            return tslib_1.__generator(this, function(_a) {
                if (intent === constants_1.OfferingIntent.SHOW_DETAILS) {
                    return [2 /*return*/ , this.wixSdkAdapter.navigateToBookingsServicePage(this.offering.urlName)];
                }
                suffix = "/" + this.offering.urlName + (this.shouldNavigateToCalendar(intent) ? '/book' : '');
                return [2 /*return*/ , this.wixSdkAdapter.navigateToBookingsWithSuffix(suffix)];
            });
        });
    };
    Navigation.prototype.shouldNavigateToCalendar = function(intent) {
        return (intent === constants_1.OfferingIntent.BOOK_OFFERING &&
            this.offering.type !== bookings_uou_domain_1.OfferingType.COURSE);
    };
    Navigation.prototype.legacyNavigateToApp = function(intent) {
        return tslib_1.__awaiter(this, void 0, void 0, function() {
            var capsule, onNavigationBySectionIdFailed, isBookCheckoutInstalled;
            return tslib_1.__generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , this.legacyStoreDataCapsule(intent)];
                    case 1:
                        capsule = _a.sent();
                        onNavigationBySectionIdFailed = function() {
                            window.Wix.Utils.navigateToSection({});
                        };
                        return [4 /*yield*/ , this.wixSdkAdapter.isBookCheckoutInstalled()];
                    case 2:
                        isBookCheckoutInstalled = _a.sent();
                        window.Wix.Utils.navigateToSection({
                            sectionId: isBookCheckoutInstalled ?
                                bookings_uou_domain_1.BOOKINGS_CHECKOUT_SECTION_ID :
                                bookings_uou_domain_1.BOOKINGS_SCHEDULER_SECTION_ID,
                        }, onNavigationBySectionIdFailed);
                        return [2 /*return*/ , this.shouldRefreshBookings(capsule).then(function(shouldRefresh) {
                            if (shouldRefresh) {
                                window.Wix.PubSub.publish(WidgetDeepLinkConst.REFRESH_APP);
                            }
                        })];
                }
            });
        });
    };
    Navigation.prototype.legacyStoreDataCapsule = function(intent) {
        return tslib_1.__awaiter(this, void 0, void 0, function() {
            var capsule, data;
            return tslib_1.__generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        capsule = new data_capsule_1.DataCapsule({
                            strategy: new data_capsule_1.FrameStorageStrategy(window.top, '*', this.compId, {}),
                            namespace: 'wix',
                        });
                        data = {
                            serviceId: this.offering.id,
                            intent: intent,
                            timestamp: new Date().getTime(),
                        };
                        return [4 /*yield*/ , capsule.setItem(StorageConst.DEEP_LINK, data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/ , capsule];
                }
            });
        });
    };
    Navigation.prototype.shouldRefreshBookings = function(capsule) {
        return new Promise(function(resolve) {
            capsule
                .getItem(ClientConst.BOOKINGS_PAGE_ID)
                .then(function(bookingsPageId) {
                    window.Wix.getCurrentPageId(function(currPageId) {
                        return resolve(bookingsPageId === currPageId);
                    });
                })
                .catch(function() {
                    return resolve(false);
                });
        });
    };
    return Navigation;
}());
exports.Navigation = Navigation;
//# sourceMappingURL=navigation.js.map