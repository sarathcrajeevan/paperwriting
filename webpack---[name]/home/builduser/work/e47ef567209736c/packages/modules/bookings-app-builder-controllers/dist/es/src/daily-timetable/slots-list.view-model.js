import {
    __assign,
    __awaiter,
    __generator,
    __spreadArrays
} from "tslib";
import * as format from 'string-format';
import * as moment from 'moment';
import {
    TimetableActionType,
    WidgetReferralInfo
} from '../bi-logger/bi.const';
import {
    DailyTimetableSettingsKeys,
} from '@wix/bookings-app-builder-settings-const/dist/src/DailyTimeTable/Settings.const';
import {
    ServiceLocationType,
    ServiceType,
    SessionOccupancyStatus,
} from '@wix/bookings-uou-types/dist/src';
import {
    DateTimeFormatter
} from '@wix/bookings-date-time';
import {
    LocationType,
} from '@wix/ambassador-availability-calendar/types';
export var SlotRepeaterState;
(function(SlotRepeaterState) {
    SlotRepeaterState["LOADING"] = "loaderState";
    SlotRepeaterState["LIST"] = "slotRepeaterState";
    SlotRepeaterState["NO_CLASSES"] = "noClassesState";
})(SlotRepeaterState || (SlotRepeaterState = {}));
var createDummySlotsAvailability = function(translations) {
    return [
        createDummySlotAvailability({
            translations: translations,
            index: 0,
            availableSpots: 16,
        }),
        createDummySlotAvailability({
            translations: translations,
            index: 1,
            availableSpots: 10,
        }),
        createDummySlotAvailability({
            translations: translations,
            index: 2,
            availableSpots: 12,
        }),
    ];
};
var createDummyServices = function(translations) {
    return [
        createDummyService(translations, 0),
        createDummyService(translations, 1),
        createDummyService(translations, 2),
    ];
};
var createDummyService = function(translations, index) {
    return {
        id: "dummy-service-id-" + (index + 1),
        info: {
            name: translations["bookings.daily-timetable.dummy.workout" + (index + 1)],
            slug: "dummy-service-" + (index + 1),
            type: ServiceType.GROUP,
        },
    };
};
var createDummySlotAvailability = function(_a) {
    var translations = _a.translations,
        index = _a.index,
        availableSpots = _a.availableSpots;
    var start = moment()
        .add(index + 1, 'hours')
        .startOf('hour');
    var end = moment()
        .add(index + 2, 'hours')
        .startOf('hour');
    return {
        slot: {
            sessionId: "dummy-slot-id-" + (index + 1),
            serviceId: "dummy-service-id-" + (index + 1),
            startDate: start.format(),
            endDate: end.format(),
            scheduleId: "dummy-schedule-id-" + (index + 1),
            resource: {
                id: "dummy-staff-id-" + (index + 1),
                name: translations["bookings.daily-timetable.dummy.name" + (index + 1)],
            },
        },
        openSpots: availableSpots,
        bookingPolicyViolations: {
            tooEarlyToBook: false,
            tooLateToBook: false,
            bookOnlineDisabled: false,
        },
        bookable: true,
    };
};
var createDummyDataSlot = function(_a) {
    var translations = _a.translations,
        index = _a.index,
        getLocalizedTime = _a.getLocalizedTime,
        availableSpots = _a.availableSpots;
    var start = moment()
        .add(index + 1, 'hours')
        .startOf('hour');
    return {
        id: "dummy-slot-id-" + (index + 1),
        service: {
            id: "dummy-service-id-" + (index + 1),
            name: translations["bookings.daily-timetable.dummy.workout" + (index + 1)],
            slugs: ["dummy-service-" + (index + 1)],
            type: ServiceType.GROUP,
        },
        occupancy: {
            status: SessionOccupancyStatus.AVAILABLE,
            availableWaitingListSpots: 0,
            availableSpots: availableSpots,
            isBookedByMember: false,
        },
        displayData: {
            startTime: getLocalizedTime(start.valueOf()),
            startDate: new Date(start.valueOf()).toISOString().split('T')[0],
        },
        policyLimitations: {
            isTooLateToBook: false,
            isTooEarlyToBook: false,
            isNoBookFlow: false,
            isBlockedByActiveFeatures: false,
        },
        staffMember: {
            id: "dummy-staff-id-" + (index + 1),
            name: translations["bookings.daily-timetable.dummy.name" + (index + 1)],
        },
        bookingInfo: {
            start: start.valueOf(),
            end: start.clone().add(30, 'minutes').valueOf(),
            scheduleId: "dummy-schedule-id-" + (index + 1),
        },
    };
};
var createDummyData = function(translations, getLocalizedTime) {
    return [
        createDummyDataSlot({
            translations: translations,
            index: 0,
            getLocalizedTime: getLocalizedTime,
            availableSpots: 16,
        }),
        createDummyDataSlot({
            translations: translations,
            index: 1,
            getLocalizedTime: getLocalizedTime,
            availableSpots: 10,
        }),
        createDummyDataSlot({
            translations: translations,
            index: 2,
            getLocalizedTime: getLocalizedTime,
            availableSpots: 12,
        }),
    ];
};
var SlotsListViewModel = /** @class */ (function() {
    function SlotsListViewModel(_a) {
        var _this = this;
        var $widget = _a.$widget,
            $w = _a.$w,
            wixSdkAdapter = _a.wixSdkAdapter,
            biLogger = _a.biLogger,
            bookingsApi = _a.bookingsApi,
            _b = _a.isTimetableAccessibilityEnabled,
            isTimetableAccessibilityEnabled = _b === void 0 ? false : _b,
            _c = _a.isSlotAvailabilityInTimetableEnabled,
            isSlotAvailabilityInTimetableEnabled = _c === void 0 ? false : _c,
            timetableSettings = _a.timetableSettings,
            catalogData = _a.catalogData,
            bookingEntries = _a.bookingEntries,
            translations = _a.translations;
        this.isRtl = false;
        this.isMobile = false;
        this.isLoading = false;
        this.isAnimating = false;
        this.translations = {};
        this.timezone = 'UTC';
        this.isRendered = false;
        this.shouldDisplaySlotLocations = false;
        this.isDummy = false;
        this.animateLoader = function() {
            var duration = 400;
            var delay = 100;
            return Promise.all([
                _this.$w('#vectorImage3')
                .show('zoom', {
                    duration: duration,
                    delay: 3 * delay
                })
                .then(function() {
                    return _this.$w('#vectorImage3').hide('zoom', {
                        duration: duration
                    });
                }),
                _this.$w('#vectorImage2')
                .show('zoom', {
                    duration: duration,
                    delay: 2 * delay
                })
                .then(function() {
                    return _this.$w('#vectorImage2').hide('zoom', {
                        duration: duration
                    });
                }),
                _this.$w('#vectorImage1')
                .show('zoom', {
                    duration: duration,
                    delay: delay
                })
                .then(function() {
                    return _this.$w('#vectorImage1').hide('zoom', {
                        duration: duration
                    });
                }),
            ]);
        };
        this.$w = $w;
        this.$widget = $widget;
        this.wixSdkAdapter = wixSdkAdapter;
        this.translations = translations;
        this.bookingsApi = bookingsApi;
        this.isMobile = this.wixSdkAdapter.getDeviceType() === 'Mobile';
        this.isRtl = this.wixSdkAdapter.isViewDirectionRtl();
        this.biLogger = biLogger;
        this.isTimetableAccessibilityEnabled = isTimetableAccessibilityEnabled;
        this.isSlotAvailabilityInTimetableEnabled = isSlotAvailabilityInTimetableEnabled;
        this.settings = timetableSettings;
        this.catalogData = catalogData;
        this.bookingEntries = bookingEntries;
        this.setupReadyListeners();
        if (this.isSlotAvailabilityInTimetableEnabled) {
            this.dateTimeFormatter = new DateTimeFormatter(this.catalogData.businessInfo.dateRegionalSettingsLocale);
            if (this.wixSdkAdapter.isEditorMode()) {
                this.dummyServices = createDummyServices(this.translations);
            }
            this.shouldDisplaySlotLocations = this.hasMultipleBusinessLocations();
        }
    }
    SlotsListViewModel.prototype.hasMultipleBusinessLocations = function() {
        var businessLocationsIds = this.catalogData.services
            .flatMap(function(service) {
                return service === null || service === void 0 ? void 0 : service.locations;
            })
            .filter(function(location) {
                return location.type === ServiceLocationType.OWNER_BUSINESS;
            })
            .map(function(location) {
                var _a;
                return (_a = location === null || location === void 0 ? void 0 : location.businessLocation) === null || _a === void 0 ? void 0 : _a.id;
            });
        var businessLocationsIdsWithoutDuplications = new Set(businessLocationsIds);
        return businessLocationsIdsWithoutDuplications.size > 1;
    };
    SlotsListViewModel.prototype.setLoading = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        this.isLoading = true;
                        return [4 /*yield*/ , this.switchState(SlotRepeaterState.LOADING)];
                    case 1:
                        _a.sent();
                        this.startAnimation();
                        return [2 /*return*/ , this.startLoaderAnimation()];
                }
            });
        });
    };
    SlotsListViewModel.prototype.setListLoaded = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        this.isLoading = false;
                        this.stopAnimation();
                        return [4 /*yield*/ , this.switchState(SlotRepeaterState.LIST)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/ ];
                }
            });
        });
    };
    SlotsListViewModel.prototype.setNoClassesState = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        this.isLoading = false;
                        this.stopAnimation();
                        return [4 /*yield*/ , this.switchState(SlotRepeaterState.NO_CLASSES)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/ ];
                }
            });
        });
    };
    SlotsListViewModel.prototype.setSlots = function(slots, isInitialLoad) {
        return __awaiter(this, void 0, void 0, function() {
            var _this = this;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        this.slotsRepeater.data = slots
                            .sort(function(slot1, slot2) {
                                if (_this.isSlotAvailabilityInTimetableEnabled) {
                                    return (+new Date(slot1.slot.endDate) - +new Date(slot2.slot.startDate));
                                }
                                return slot1.bookingInfo.start - slot2.bookingInfo.start;
                            })
                            .map(function(slot, index) {
                                return (__assign(__assign({}, slot), {
                                    _id: _this.isSlotAvailabilityInTimetableEnabled ?
                                        slot.slot.sessionId :
                                        slot.id,
                                    isFocused: _this.isTimetableAccessibilityEnabled && !isInitialLoad && index === 0
                                }));
                            });
                        return [4 /*yield*/ , this.setListLoaded()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/ ];
                }
            });
        });
    };
    SlotsListViewModel.prototype.setCleanMode = function() {
        this.slotsRepeater.data = [];
    };
    SlotsListViewModel.prototype.setSlotsList = function(slots, timezone, isInitialLoad) {
        if (isInitialLoad === void 0) {
            isInitialLoad = false;
        }
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        this.timezone = timezone;
                        if (!(slots && slots.length)) return [3 /*break*/ , 2];
                        this.isDummy = false;
                        return [4 /*yield*/ , this.setSlots(slots, isInitialLoad)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/ , 9];
                    case 2:
                        if (!this.wixSdkAdapter.isEditorMode()) return [3 /*break*/ , 7];
                        if (!this.isSlotAvailabilityInTimetableEnabled) return [3 /*break*/ , 4];
                        this.isDummy = true;
                        return [4 /*yield*/ , this.setSlots(createDummySlotsAvailability(this.translations), isInitialLoad)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/ , 6];
                    case 4:
                        return [4 /*yield*/ , this.setSlots(createDummyData(this.translations, this.getLocalizedTimeFormatter(this.wixSdkAdapter, this.timezone)), isInitialLoad)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        return [3 /*break*/ , 9];
                    case 7:
                        this.isDummy = false;
                        this.slotsRepeater.data = [];
                        return [4 /*yield*/ , this.setNoClassesState()];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9:
                        return [2 /*return*/ ];
                }
            });
        });
    };
    SlotsListViewModel.prototype.setViewLoaded = function() {
        this.isRendered = true;
    };
    SlotsListViewModel.prototype.stopAnimation = function() {
        this.isAnimating = false;
    };
    SlotsListViewModel.prototype.startAnimation = function() {
        this.isAnimating = true;
    };
    SlotsListViewModel.prototype.isNoBookFlow = function(itemData) {
        return this.isSlotAvailabilityInTimetableEnabled ?
            itemData.bookingPolicyViolations.bookOnlineDisabled :
            itemData.policyLimitations.isNoBookFlow;
    };
    SlotsListViewModel.prototype.isBlockedByActiveFeatures = function(itemData) {
        return this.isSlotAvailabilityInTimetableEnabled ?
            !this.catalogData.activeFeatures.applicableForGroups :
            itemData.policyLimitations.isBlockedByActiveFeatures;
    };
    SlotsListViewModel.prototype.isFull = function(itemData) {
        return this.isSlotAvailabilityInTimetableEnabled ?
            itemData.openSpots === 0 :
            itemData.occupancy.status === SessionOccupancyStatus.FULL;
    };
    SlotsListViewModel.prototype.isWaitingListFlow = function(itemData) {
        var _a;
        return this.isSlotAvailabilityInTimetableEnabled ?
            (this.isFull(itemData) && ((_a = itemData.waitingList) === null || _a === void 0 ? void 0 : _a.openSpots)) || false :
            itemData.occupancy.status === SessionOccupancyStatus.WAITLIST_AVAILABLE;
    };
    SlotsListViewModel.prototype.isTooLateToBook = function(itemData) {
        return this.isSlotAvailabilityInTimetableEnabled ?
            itemData.bookingPolicyViolations.tooLateToBook :
            itemData.policyLimitations.isTooLateToBook;
    };
    SlotsListViewModel.prototype.isBookedByMember = function(itemData) {
        return this.isSlotAvailabilityInTimetableEnabled ?
            this.bookingEntries.some(function(bookingEntry) {
                var _a, _b, _c;
                return ((_c = (_b = (_a = bookingEntry.booking) === null || _a === void 0 ? void 0 : _a.bookedEntity) === null || _b === void 0 ? void 0 : _b.singleSession) === null || _c === void 0 ? void 0 : _c.sessionId) ===
                    itemData.slot.sessionId;
            }) :
            itemData.occupancy.isBookedByMember;
    };
    SlotsListViewModel.prototype.getSlotCtaText = function(itemData) {
        if (this.isBookedByMember(itemData)) {
            return (this.settings[DailyTimetableSettingsKeys.BUTTON_DISABLED_TEXT_BOOKED] ||
                this.translations['bookings.daily-timetable.cta.defaults.booked']);
        }
        if (this.isNoBookFlow(itemData)) {
            return (this.settings[DailyTimetableSettingsKeys.BUTTON_ENABLED_TEXT_MORE_INFO] ||
                this.translations['bookings.daily-timetable.cta.defaults.more-info']);
        }
        if (this.isWaitingListFlow(itemData)) {
            return (this.settings[DailyTimetableSettingsKeys.BUTTON_ENABLED_TEXT_WAITING_LIST] ||
                this.translations['bookings.daily-timetable.cta.defaults.waiting-list']);
        }
        if (this.isFull(itemData)) {
            return (this.settings[DailyTimetableSettingsKeys.BUTTON_DISABLED_TEXT_FULL] ||
                this.translations['bookings.daily-timetable.cta.defaults.full']);
        }
        if (this.isTooLateToBook(itemData)) {
            return (this.settings[DailyTimetableSettingsKeys.BUTTON_DISABLED_TEXT_CLOSED] ||
                this.translations['bookings.daily-timetable.cta.defaults.closed']);
        }
        return (this.settings[DailyTimetableSettingsKeys.BUTTON_ENABLED_TEXT_BOOK_NOW] ||
            this.translations['bookings.daily-timetable.cta.defaults.book-now']);
    };
    SlotsListViewModel.prototype.shouldDisableCta = function(itemData) {
        if (this.isWaitingListFlow(itemData) || this.isNoBookFlow(itemData)) {
            return false;
        }
        if (this.isSlotAvailabilityInTimetableEnabled) {
            return !itemData.bookable || this.isBookedByMember(itemData);
        } else {
            return (itemData.occupancy.status === SessionOccupancyStatus.FULL ||
                itemData.policyLimitations.isTooEarlyToBook ||
                itemData.policyLimitations.isTooLateToBook ||
                itemData.occupancy.isBookedByMember);
        }
    };
    SlotsListViewModel.prototype.navigateToSelectedSection = function(itemData, service) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function() {
            var serviceId, serviceSlug, location, sendClickEventWithAction, actionName;
            var _this = this;
            return __generator(this, function(_e) {
                switch (_e.label) {
                    case 0:
                        serviceId = this.isSlotAvailabilityInTimetableEnabled ?
                            itemData.slot.serviceId :
                            itemData.service.id;
                        serviceSlug = this.isSlotAvailabilityInTimetableEnabled ?
                            service.info.slug :
                            itemData.service.slugs[0];
                        location = this.isSlotAvailabilityInTimetableEnabled ?
                            (_b = (_a = itemData.slot) === null || _a === void 0 ? void 0 : _a.location) === null || _b === void 0 ? void 0 : _b.id : (_d = (_c = itemData.location) === null || _c === void 0 ? void 0 : _c.businessLocation) === null || _d === void 0 ? void 0 : _d.id;
                        sendClickEventWithAction = function(action) {
                            return _this.biLogger.sendTimeTableClickEvent({
                                serviceId: serviceId,
                                type: ServiceType.GROUP,
                                isNoBookFlow: _this.isNoBookFlow(itemData),
                                isOverEditor: _this.wixSdkAdapter.isEditorMode(),
                                isPreviewMode: _this.wixSdkAdapter.isPreviewMode(),
                                action: action,
                            });
                        };
                        if (!this.isNoBookFlow(itemData)) return [3 /*break*/ , 2];
                        sendClickEventWithAction(TimetableActionType.NAVIGATE_TO_SERVICE_PAGE);
                        return [4 /*yield*/ , this.wixSdkAdapter.navigateToBookingsServicePage(serviceSlug, {
                            referral: WidgetReferralInfo.TIME_TABLE,
                            location: location,
                        })];
                    case 1:
                        _e.sent();
                        return [3 /*break*/ , 14];
                    case 2:
                        if (!(!this.wixSdkAdapter.isTemplateMode() &&
                                this.isBlockedByActiveFeatures(itemData))) return [3 /*break*/ , 7];
                        if (!this.wixSdkAdapter.isPreviewMode()) return [3 /*break*/ , 4];
                        sendClickEventWithAction(TimetableActionType.OPEN_OWNER_PREMIUM_MODAL);
                        return [4 /*yield*/ , this.wixSdkAdapter.openPreviewPremiumModal(ServiceType.GROUP, WidgetReferralInfo.TIME_TABLE)];
                    case 3:
                        _e.sent();
                        return [3 /*break*/ , 6];
                    case 4:
                        sendClickEventWithAction(TimetableActionType.OPEN_UOU_PREMIUM_MODAL);
                        void this.bookingsApi.notifyOwnerNonPremium();
                        void this.biLogger.sendTimetablePremiumPrevention();
                        return [4 /*yield*/ , this.wixSdkAdapter.openUoUPremiumModal(ServiceType.GROUP, WidgetReferralInfo.TIME_TABLE)];
                    case 5:
                        _e.sent();
                        _e.label = 6;
                    case 6:
                        return [3 /*break*/ , 14];
                    case 7:
                        if (!this.isWaitingListFlow(itemData)) return [3 /*break*/ , 9];
                        sendClickEventWithAction(TimetableActionType.OPEN_WAITING_LIST_MODAL);
                        return [4 /*yield*/ , this.wixSdkAdapter.openWaitingListModal(ServiceType.GROUP)];
                    case 8:
                        _e.sent();
                        return [3 /*break*/ , 14];
                    case 9:
                        return [4 /*yield*/ , this.wixSdkAdapter.isBookingFormInstalled()];
                    case 10:
                        actionName = (_e.sent()) ?
                            TimetableActionType.NAVIGATE_TO_BOOKING_FORM :
                            TimetableActionType.NAVIGATE_TO_CONTACT_FORM;
                        sendClickEventWithAction(actionName);
                        if (!this.isSlotAvailabilityInTimetableEnabled) return [3 /*break*/ , 12];
                        return [4 /*yield*/ , this.wixSdkAdapter.navigateToBookingsFormPage({
                            slotAvailability: itemData,
                            serviceId: serviceId,
                            serviceSlug: serviceSlug,
                            referral: WidgetReferralInfo.TIME_TABLE,
                        })];
                    case 11:
                        _e.sent();
                        return [3 /*break*/ , 14];
                    case 12:
                        return [4 /*yield*/ , this.wixSdkAdapter.navigateToBookingsSessionPage(itemData, WidgetReferralInfo.TIME_TABLE)];
                    case 13:
                        _e.sent();
                        _e.label = 14;
                    case 14:
                        return [2 /*return*/ ];
                }
            });
        });
    };
    SlotsListViewModel.prototype.setupReadyListeners = function() {
        var _this = this;
        this.slotsRepeater.onItemReady(function($item, itemData, index) {
            var _a;
            var serviceName, startTime, spotsAvailable, staffMember, duration, service;
            if (_this.isSlotAvailabilityInTimetableEnabled) {
                var services = _this.isDummy ?
                    _this.dummyServices :
                    _this.catalogData.services;
                service = services.find(function(_a) {
                    var id = _a.id;
                    return id === itemData.slot.serviceId;
                });
                serviceName = service.info.name;
                startTime = _this.dateTimeFormatter.formatTime(itemData.slot.startDate);
                spotsAvailable = _this.getSpotsString(itemData.openSpots);
                staffMember = _this.getSessionInfoString(itemData.slot.resource, itemData.slot.location);
                duration = _this.getDurationString(new Date(itemData.slot.startDate).valueOf(), new Date(itemData.slot.endDate).valueOf());
            } else {
                serviceName = itemData.service.name;
                startTime = itemData.displayData.startTime;
                spotsAvailable = _this.getSpotsString(itemData.occupancy.availableSpots);
                staffMember = _this.getSessionInfoString(itemData.staffMember, itemData.location);
                duration = _this.getDurationString(itemData.bookingInfo.start, itemData.bookingInfo.end);
            }
            $item('#serviceName').text = serviceName;
            $item('#time').text = startTime;
            $item('#spots').text = spotsAvailable;
            $item('#staffMember').text = staffMember;
            $item('#duration').text = duration;
            $item('#bookButton').label = _this.getSlotCtaText(itemData);
            if (_this.shouldDisableCta(itemData)) {
                $item('#bookButton').disable();
            }
            $item('#bookButton').onClick(function() {
                void _this.navigateToSelectedSection(itemData, service);
            });
            if (itemData.isFocused && $item('#bookButton').focus) {
                // todo: until thunderbolt is completely merged we need to check that focus exists
                $item('#bookButton').focus();
            }
            if (_this.isTimetableAccessibilityEnabled && ((_a = $item('#bookButton')) === null || _a === void 0 ? void 0 : _a.accessibility)) {
                // todo: until thunderbolt is completely merged we need to check $item('#bookButton')?.accessibility
                $item('#bookButton').accessibility.ariaLabel = _this.getSlotCtaText(itemData) + ", " + serviceName + ", " + startTime + ", " + spotsAvailable + ", " + staffMember + ", " + duration;
            }
        });
    };
    Object.defineProperty(SlotsListViewModel.prototype, "slotsRepeater", {
        get: function() {
            return this.$w('#slotRepeater');
        },
        enumerable: false,
        configurable: true
    });
    SlotsListViewModel.prototype.getSessionInfoString = function(staffMember, location) {
        var staffText = staffMember && staffMember.name;
        var locationText;
        if (this.isSlotAvailabilityInTimetableEnabled &&
            this.shouldDisplaySlotLocations) {
            if (location && location.locationType === LocationType.OWNER_CUSTOM) {
                locationText = location.formattedAddress;
            } else if (location && location.name) {
                locationText = location.name;
            }
        }
        if (location && location.type === ServiceLocationType.OWNER_CUSTOM) {
            locationText = location.locationText;
        } else if (location && location.businessLocation) {
            locationText = location.businessLocation.name;
        }
        var sessionInfo = __spreadArrays((staffText ? [staffText] : []), (locationText ? [locationText] : []));
        return sessionInfo.join(', ');
    };
    SlotsListViewModel.prototype.getLocalizedTimeFormatter = function(wixSdkAdapter, timezone) {
        return function(timestamp) {
            return new Date(timestamp).toLocaleTimeString(wixSdkAdapter.getRegionalSettings(), {
                timeZone: timezone,
                hour: '2-digit',
                minute: '2-digit',
            });
        };
    };
    SlotsListViewModel.prototype.switchState = function(targetState) {
        return __awaiter(this, void 0, void 0, function() {
            var changeStatePromise, e_1;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        changeStatePromise = this.$w('#statebox').changeState(targetState);
                        if (!this.isRendered) return [3 /*break*/ , 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/ , changeStatePromise];
                    case 2:
                        _a.sent();
                        return [3 /*break*/ , 4];
                    case 3:
                        e_1 = _a.sent();
                        // WA for https://jira.wixpress.com/browse/WEED-20100
                        console.error('failed to change state to: ', targetState, ' caused by ', e_1);
                        return [3 /*break*/ , 4];
                    case 4:
                        return [2 /*return*/ , null];
                }
            });
        });
    };
    SlotsListViewModel.prototype.getSpotsString = function(availableSpots) {
        var formatString = this.translations[availableSpots === 0 ?
            'bookings.daily-timetable.available-spot.none' :
            availableSpots === 1 ?
            'bookings.daily-timetable.available-spot.single' :
            'bookings.daily-timetable.available-spot.multiple'];
        return format(formatString, availableSpots);
    };
    SlotsListViewModel.prototype.getDurationString = function(start, end) {
        var _a = this.getDuration(start, end),
            min = _a.min,
            hr = _a.hr;
        var minFormatString = this.translations[min === 1 ?
            'bookings.daily-timetable.min.single' :
            'bookings.daily-timetable.min.multiple'];
        var hrFormatString = this.translations[hr === 1 ?
            'bookings.daily-timetable.hours.single' :
            'bookings.daily-timetable.hours.multiple'];
        return format(this.translations['bookings.daily-timetable.duration'] || '{0} {1}', hr ? format(hrFormatString, hr) : '', min || !hr ? format(minFormatString, min) : '').trim();
    };
    SlotsListViewModel.prototype.getDuration = function(start, end) {
        var durationTime = moment.duration(end - start, 'milliseconds');
        return {
            min: durationTime.minutes(),
            hr: Math.floor(durationTime.asHours()),
        };
    };
    SlotsListViewModel.prototype.getDurationStringInMinutes = function(start, end) {
        var min = this.getDurationInMin(start, end);
        var formatString = this.translations[min === 1 ?
            'bookings.daily-timetable.min.single' :
            'bookings.daily-timetable.min.multiple'];
        return format(formatString, min);
    };
    SlotsListViewModel.prototype.getDurationInMin = function(start, end) {
        return Math.round((end - start) / 60000);
    };
    SlotsListViewModel.prototype.startLoaderAnimation = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.wixSdkAdapter.isEditorMode()) return [3 /*break*/ , 2];
                        return [4 /*yield*/ , Promise.all(this.loader.map(function(dot) {
                            return dot.hide();
                        }))];
                    case 1:
                        _a.sent();
                        this.asyncInterval(this.animateLoader);
                        _a.label = 2;
                    case 2:
                        return [2 /*return*/ ];
                }
            });
        });
    };
    SlotsListViewModel.prototype.asyncInterval = function(func) {
        var _this = this;
        func().then(function() {
            return _this.isLoading && _this.isAnimating && _this.asyncInterval(func);
        });
    };
    Object.defineProperty(SlotsListViewModel.prototype, "loader", {
        get: function() {
            return [
                this.$w('#vectorImage1'),
                this.$w('#vectorImage2'),
                this.$w('#vectorImage3'),
            ];
        },
        enumerable: false,
        configurable: true
    });
    return SlotsListViewModel;
}());
export {
    SlotsListViewModel
};
//# sourceMappingURL=slots-list.view-model.js.map