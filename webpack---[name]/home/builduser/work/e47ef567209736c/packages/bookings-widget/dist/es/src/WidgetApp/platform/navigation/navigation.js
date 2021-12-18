"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Navigation = exports.ClientConst = exports.StorageConst = exports.WidgetDeepLinkConst = void 0;
var tslib_1 = require("tslib");
var data_capsule_1 = require("data-capsule");
var navigation_const_1 = require("./navigation.const");
var bookings_uou_domain_1 = require("@wix/bookings-uou-domain");
var bookings_const_1 = require("@wix/bookings-adapter-ooi-wix-sdk/dist/src/bookings.const");
var BILogger_1 = require("../../../SettingsEditor/bi/BILogger");
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
    function Navigation(wixSdkAdapter, compId) {
        this.wixSdkAdapter = wixSdkAdapter;
        this.compId = compId;
    }
    Navigation.prototype.navigateToApp = function(_a) {
        var offering = _a.offering,
            intent = _a.intent,
            _b = _a.isStaffPreselectionEnabled,
            isStaffPreselectionEnabled = _b === void 0 ? false : _b,
            staff = _a.staff,
            location = _a.location;
        return tslib_1.__awaiter(this, void 0, void 0, function() {
            return tslib_1.__generator(this, function(_c) {
                if (this.wixSdkAdapter.isRunningInIframe()) {
                    return [2 /*return*/ , this.legacyNavigateToApp(offering, intent)];
                }
                return [2 /*return*/ , this.ooiNavigateToApp(offering, intent, isStaffPreselectionEnabled, {
                    staff: staff,
                    location: location,
                })];
            });
        });
    };
    Navigation.prototype.ooiNavigateToApp = function(offering, intent, isStaffPreselectionEnabled, _a) {
        var staff = _a.staff,
            location = _a.location;
        return tslib_1.__awaiter(this, void 0, void 0, function() {
            var optionalParams;
            return tslib_1.__generator(this, function(_b) {
                optionalParams = tslib_1.__assign(tslib_1.__assign({
                    referral: BILogger_1.serviceListReferralInfo
                }, (isStaffPreselectionEnabled && staff ? {
                    staff: staff
                } : {})), (location ? {
                    location: location
                } : {}));
                if (this.shouldNavigateToCalendar(offering, intent)) {
                    return [2 /*return*/ , this.wixSdkAdapter.navigateToBookingsCalendarPage(offering.urlName, optionalParams)];
                }
                if (!isStaffPreselectionEnabled &&
                    offering.dummy &&
                    intent !== navigation_const_1.OfferingIntent.SHOW_DETAILS) {
                    return [2 /*return*/ , this.wixSdkAdapter.navigateToBookingsWithSuffix('')];
                }
                return [2 /*return*/ , this.wixSdkAdapter.navigateToBookingsServicePage(offering.dummy ? '' : offering.urlName, optionalParams)];
            });
        });
    };
    Navigation.prototype.shouldNavigateToCalendar = function(offering, intent) {
        return (intent === navigation_const_1.OfferingIntent.BOOK_OFFERING &&
            !offering.dummy &&
            offering.type !== bookings_uou_domain_1.OfferingType.COURSE);
    };
    Navigation.prototype.legacyNavigateToApp = function(offering, intent) {
        return tslib_1.__awaiter(this, void 0, void 0, function() {
            var isServicePageInstalled, isBookCheckoutInstalled, capsule, sectionId, onNavigationBySectionIdFailed;
            return tslib_1.__generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , this.wixSdkAdapter.isServicePageInstalled()];
                    case 1:
                        isServicePageInstalled = _a.sent();
                        return [4 /*yield*/ , this.wixSdkAdapter.isBookCheckoutInstalled()];
                    case 2:
                        isBookCheckoutInstalled = _a.sent();
                        return [4 /*yield*/ , this.legacyStoreDataCapsule(offering, intent)];
                    case 3:
                        capsule = _a.sent();
                        sectionId = bookings_uou_domain_1.BOOKINGS_SCHEDULER_SECTION_ID;
                        if (isServicePageInstalled && intent === navigation_const_1.OfferingIntent.SHOW_DETAILS) {
                            sectionId = bookings_const_1.BOOKINGS_SERVICE_PAGE_SECTION_ID;
                        } else if (isBookCheckoutInstalled) {
                            sectionId = bookings_uou_domain_1.BOOKINGS_CHECKOUT_SECTION_ID;
                        }
                        onNavigationBySectionIdFailed = function() {
                            window.Wix.Utils.navigateToSection({});
                        };
                        window.Wix.Utils.navigateToSection({
                            sectionId: sectionId,
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
    Navigation.prototype.legacyStoreDataCapsule = function(offering, intent) {
        return tslib_1.__awaiter(this, void 0, void 0, function() {
            var capsule, data;
            return tslib_1.__generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        capsule = new data_capsule_1.DataCapsule({
                            strategy: new data_capsule_1.FrameStorageStrategy(window.top, '*', this.compId, {}),
                            namespace: 'wix',
                        });
                        if (!!offering.dummy) return [3 /*break*/ , 2];
                        data = {
                            serviceId: offering.id,
                            intent: intent,
                            timestamp: new Date().getTime(),
                        };
                        return [4 /*yield*/ , capsule.setItem(StorageConst.DEEP_LINK, data)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
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