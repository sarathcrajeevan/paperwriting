import {
    __awaiter,
    __generator
} from "tslib";
import {
    BookButtonSettingsKeys,
    GeneralLinkDestinationOptions,
    SelectedServiceLinkDestinationOptions,
} from '@wix/bookings-app-builder-settings-const/dist/src/BookButton/Settings.const';
import {
    OfferingType
} from '@wix/bookings-uou-domain/dist/src';
import {
    WidgetReferralInfo
} from '../bi-logger/bi.const';
var BookButtonViewModel = /** @class */ (function() {
    function BookButtonViewModel(_a) {
        var $button = _a.$button,
            wixSdkAdapter = _a.wixSdkAdapter,
            controllerConfig = _a.controllerConfig,
            biLogger = _a.biLogger;
        this.$button = $button;
        this.wixSdkAdapter = wixSdkAdapter;
        this.controllerConfig = controllerConfig;
        this.biLogger = biLogger;
        this.initListener();
    }
    BookButtonViewModel.prototype.shouldNavigateToCalendar = function() {
        var service = this.controllerConfig[BookButtonSettingsKeys.SELECTED_SERVICE];
        var isCourseOffering = service.type === OfferingType.COURSE;
        var isBookable = service.isBookable;
        var isNavigateToCalendar = this.controllerConfig[BookButtonSettingsKeys.SELECTED_SERVICE_LINK_DESTINATION] === SelectedServiceLinkDestinationOptions.CALENDAR;
        return isBookable && !isCourseOffering && isNavigateToCalendar;
    };
    BookButtonViewModel.prototype.initListener = function() {
        var _this = this;
        this.$button.onClick(function() {
            return __awaiter(_this, void 0, void 0, function() {
                return __generator(this, function(_a) {
                    if (this.shouldNavigateToServiceList()) {
                        void this.navigateToServiceList();
                    } else {
                        void this.navigateToSpecificService();
                    }
                    return [2 /*return*/ ];
                });
            });
        });
    };
    BookButtonViewModel.prototype.shouldNavigateToServiceList = function() {
        var linkDestination = this.controllerConfig[BookButtonSettingsKeys.LINK_DESTINATION];
        return (!linkDestination ||
            linkDestination === GeneralLinkDestinationOptions.SERVICE_LIST);
    };
    BookButtonViewModel.prototype.navigateToServiceList = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , this.biLogger.sendBookButtonClickEvent({
                            isPendingApproval: null,
                            service_id: null,
                            type: null,
                        })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/ , this.wixSdkAdapter.navigateToServiceList()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/ ];
                }
            });
        });
    };
    BookButtonViewModel.prototype.navigateToSpecificService = function() {
        return __awaiter(this, void 0, void 0, function() {
            var service;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        service = this.controllerConfig[BookButtonSettingsKeys.SELECTED_SERVICE];
                        if (!service) return [3 /*break*/ , 2];
                        return [4 /*yield*/ , this.biLogger.sendBookButtonClickEvent({
                            isPendingApproval: service.isPendingApproval,
                            service_id: service.id,
                            type: service.type,
                        })];
                    case 1:
                        _a.sent();
                        if (this.shouldNavigateToCalendar()) {
                            return [2 /*return*/ , this.navigateToCalendarPage(service)];
                        }
                        return [2 /*return*/ , this.navigateToServicePage(service)];
                    case 2:
                        return [2 /*return*/ ];
                }
            });
        });
    };
    BookButtonViewModel.prototype.navigateToCalendarPage = function(service) {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , this.wixSdkAdapter.navigateToBookingsCalendarPage(service.slug, {
                            referral: WidgetReferralInfo.BOOK_BUTTON,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/ ];
                }
            });
        });
    };
    BookButtonViewModel.prototype.navigateToServicePage = function(service) {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , this.wixSdkAdapter.navigateToBookingsServicePage(service.slug, {
                            referral: WidgetReferralInfo.BOOK_BUTTON,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/ ];
                }
            });
        });
    };
    return BookButtonViewModel;
}());
export {
    BookButtonViewModel
};
//# sourceMappingURL=book-button.view-model.js.map