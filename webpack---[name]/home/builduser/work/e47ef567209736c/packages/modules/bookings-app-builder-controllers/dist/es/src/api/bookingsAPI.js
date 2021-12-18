import {
    __assign,
    __awaiter,
    __generator
} from "tslib";
import httpAdapterFactory from '@wix/bookings-adapter-http-api';
import {
    ServiceType,
    TimezoneType,
} from '@wix/bookings-uou-types/dist/src';
import {
    DailyTimetableSettingsKeys
} from '@wix/bookings-app-builder-settings-const/dist/src/DailyTimeTable/Settings.const';
import {
    BookingsServer
} from '@wix/ambassador-bookings-server/http';
import {
    ServicesCatalogServer,
} from '@wix/ambassador-services-catalog-server/http';
import {
    mapCatalogServiceResponseToService,
    mapResponseToBusinessInfo,
    mapCatalogResourceResponseToStaffMember,
} from '@wix/bookings-uou-mappers';
import {
    AvailabilityCalendar
} from '@wix/ambassador-availability-calendar/http';
import {
    getLocalTimezone
} from '@wix/bookings-date-time';
import {
    getEndOfMonthShiftedRfcString,
    getShiftedRfcStringDateStart,
    getStartOfDayInSelectedTimezone,
} from '../utils/date-time';
export var AVAILABILITY_SERVER_URL = '_api/availability-calendar';
export var CATALOG_SERVER_URL = '_api/services-catalog';
export var BOOKINGS_SERVER_URL = '_api/bookings';
var BookingsAPI = /** @class */ (function() {
    function BookingsAPI(instance, wixSdkAdapter, externalId) {
        this.instance = instance;
        this.wixSdkAdapter = wixSdkAdapter;
        var siteRevision = wixSdkAdapter.getSiteRevision();
        var csrfToken = wixSdkAdapter.getCsrfToken();
        this.httpAdapter = httpAdapterFactory(instance, siteRevision, csrfToken);
        this.wixSdkAdapter = wixSdkAdapter;
        this.externalId = externalId;
        var baseUrl = this.wixSdkAdapter.getServerBaseUrl();
        this.availabilityCalendarServer = AvailabilityCalendar("" + this.wixSdkAdapter.getServerBaseUrl() + AVAILABILITY_SERVER_URL);
        this.availabilityCalendarServer = AvailabilityCalendar("" + baseUrl + AVAILABILITY_SERVER_URL);
        this.catalogServer = ServicesCatalogServer("" + baseUrl + CATALOG_SERVER_URL);
        this.bookingsServer = BookingsServer("" + baseUrl + BOOKINGS_SERVER_URL);
    }
    BookingsAPI.prototype.getTranslations = function(language) {
        return __awaiter(this, void 0, void 0, function() {
            var staticsBaseUrl;
            return __generator(this, function(_a) {
                staticsBaseUrl = this.wixSdkAdapter.getPlatformAppStaticsBaseUrl();
                return [2 /*return*/ , this.httpAdapter.get(staticsBaseUrl + "assets/locale/messages_" + language + ".json", null)];
            });
        });
    };
    BookingsAPI.prototype.getStaffList = function() {
        return __awaiter(this, void 0, void 0, function() {
            var serverBaseURl, queryFilter, pagingLimitParam;
            return __generator(this, function(_a) {
                serverBaseURl = this.wixSdkAdapter.getServerBaseUrl();
                queryFilter = encodeURIComponent("{\"resource.tags\":\"staff\"}");
                pagingLimitParam = '&query.paging.limit=500';
                if (this.wixSdkAdapter.isEditorMode()) {
                    return [2 /*return*/ , this.httpAdapter.get(serverBaseURl + "_api/services-catalog-writer/resources?query.filter.stringValue=" + queryFilter + pagingLimitParam)];
                }
                return [2 /*return*/ , this.httpAdapter.get(serverBaseURl + "_api/services-catalog/resources?query.filter.stringValue=" + queryFilter + pagingLimitParam)];
            });
        });
    };
    BookingsAPI.prototype.getSessionsForDate = function(_a) {
        var date = _a.date,
            timezone = _a.timezone,
            regionalSettings = _a.regionalSettings;
        return __awaiter(this, void 0, void 0, function() {
            var serverBaseUrl, externalIdQueryParam, baseQueryParams, serverEndpoint;
            return __generator(this, function(_b) {
                serverBaseUrl = this.wixSdkAdapter.getServerBaseUrl();
                externalIdQueryParam = this.externalId ?
                    "&externalId=" + this.externalId :
                    '';
                baseQueryParams = "?timezone=" + timezone + "&type=GROUP&regionalSettings=" + regionalSettings + externalIdQueryParam;
                serverEndpoint = "_api/bookings-viewer/daily-timetable/sessions/" + date.format('YYYY-MM-DD');
                return [2 /*return*/ , this.httpAdapter.get("" + serverBaseUrl + serverEndpoint + baseQueryParams)];
            });
        });
    };
    BookingsAPI.prototype.getTimetableConfig = function(_a) {
        var timezone = _a.timezone,
            regionalSettings = _a.regionalSettings;
        return __awaiter(this, void 0, void 0, function() {
            var serverBaseUrl, serverEndpoint, externalIdQueryParam, baseQueryParams;
            return __generator(this, function(_b) {
                serverBaseUrl = this.wixSdkAdapter.getServerBaseUrl();
                serverEndpoint = "_api/bookings-viewer/daily-timetable/config";
                externalIdQueryParam = this.externalId ?
                    "&externalId=" + this.externalId :
                    '';
                baseQueryParams = "?timezone=" + timezone + "&type=GROUP&regionalSettings=" + regionalSettings + externalIdQueryParam;
                return [2 /*return*/ , this.httpAdapter.get("" + serverBaseUrl + serverEndpoint + baseQueryParams)];
            });
        });
    };
    BookingsAPI.prototype.notifyOwnerNonPremium = function() {
        return __awaiter(this, void 0, void 0, function() {
            var serverBaseUrl;
            return __generator(this, function(_a) {
                serverBaseUrl = this.wixSdkAdapter.getServerBaseUrl();
                return [2 /*return*/ , this.httpAdapter.post(serverBaseUrl + "_api/bookings-viewer/visitor/classes/nonPremium", '')];
            });
        });
    };
    BookingsAPI.prototype.filterHiddenServices = function(serviceResponse) {
        var _a, _b;
        return (((_b = (_a = serviceResponse.service) === null || _a === void 0 ? void 0 : _a.customProperties) === null || _b === void 0 ? void 0 : _b.uouHidden) !== 'true' &&
            serviceResponse.category);
    };
    BookingsAPI.prototype.getCatalogData = function() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function() {
            var servicesCatalogService, bulkRequest, catalogData, filteredServiceResponse, services, businessInfo, activeFeatures, staffMembers;
            return __generator(this, function(_c) {
                switch (_c.label) {
                    case 0:
                        servicesCatalogService = this.catalogServer.Bulk();
                        bulkRequest = this.createBulkRequest();
                        return [4 /*yield*/ , servicesCatalogService({
                            Authorization: this.instance,
                        }).get(bulkRequest)];
                    case 1:
                        catalogData = _c.sent();
                        filteredServiceResponse = catalogData.responseServices.services.filter(this.filterHiddenServices);
                        services = filteredServiceResponse.map(function(service) {
                            return mapCatalogServiceResponseToService(service);
                        });
                        businessInfo = mapResponseToBusinessInfo(catalogData.responseBusiness);
                        activeFeatures = catalogData.responseBusiness
                            .activeFeatures;
                        staffMembers = (_b = (_a = catalogData.responseResources) === null || _a === void 0 ? void 0 : _a.resources) === null || _b === void 0 ? void 0 : _b.map(mapCatalogResourceResponseToStaffMember);
                        return [2 /*return*/ , {
                            services: services,
                            businessInfo: businessInfo,
                            activeFeatures: activeFeatures,
                            staffMembers: staffMembers,
                        }];
                }
            });
        });
    };
    BookingsAPI.prototype.getDefaultTimezone = function(catalogData) {
        var shouldUseBusinessTimezone = catalogData.businessInfo.timezoneProperties.defaultTimezone ===
            TimezoneType.BUSINESS;
        var businessTimezone = catalogData.businessInfo.timeZone;
        return shouldUseBusinessTimezone ? businessTimezone : getLocalTimezone();
    };
    BookingsAPI.prototype.getNextAvailableDate = function(catalogData, settings) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function() {
            var timezone, startOfDayAtSelectedTimezone, availabilityCalendarService, monthRange, from, to, slotAvailability, e_1;
            return __generator(this, function(_g) {
                switch (_g.label) {
                    case 0:
                        timezone = this.getDefaultTimezone(catalogData);
                        startOfDayAtSelectedTimezone = getStartOfDayInSelectedTimezone(timezone);
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 3, , 4]);
                        availabilityCalendarService = this.availabilityCalendarServer.AvailabilityCalendar();
                        monthRange = 4;
                        from = startOfDayAtSelectedTimezone;
                        to = getEndOfMonthShiftedRfcString(startOfDayAtSelectedTimezone, monthRange);
                        return [4 /*yield*/ , availabilityCalendarService({
                            Authorization: this.instance,
                        }).queryAvailability(this.createSlotAvailabilityRequest(catalogData, settings, from, to, true))];
                    case 2:
                        slotAvailability = _g.sent();
                        return [2 /*return*/ , ((_c = (_b = (_a = slotAvailability === null || slotAvailability === void 0 ? void 0 : slotAvailability.availabilityEntries) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.slot) === null || _c === void 0 ? void 0 : _c.startDate) ? getShiftedRfcStringDateStart((_f = (_e = (_d = slotAvailability === null || slotAvailability === void 0 ? void 0 : slotAvailability.availabilityEntries) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.slot) === null || _f === void 0 ? void 0 : _f.startDate) :
                            startOfDayAtSelectedTimezone
                        ];
                    case 3:
                        e_1 = _g.sent();
                        console.log('failed to fetch first available slot', e_1);
                        return [2 /*return*/ , startOfDayAtSelectedTimezone];
                    case 4:
                        return [2 /*return*/ ];
                }
            });
        });
    };
    BookingsAPI.prototype.getAvailabilitySlots = function(catalogData, rfcDateTime, settings) {
        return __awaiter(this, void 0, void 0, function() {
            var availabilityCalendarService, availability, e_2;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        availabilityCalendarService = this.availabilityCalendarServer.AvailabilityCalendar();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/ , availabilityCalendarService({
                            Authorization: this.instance,
                        }).queryAvailability(this.createSlotAvailabilityRequest(catalogData, settings, rfcDateTime, rfcDateTime.replace('00:00:00', '23:59:59')))];
                    case 2:
                        availability = _a.sent();
                        return [2 /*return*/ , availability.availabilityEntries];
                    case 3:
                        e_2 = _a.sent();
                        console.log('failed to fetch availability', e_2);
                        return [2 /*return*/ , []];
                    case 4:
                        return [2 /*return*/ ];
                }
            });
        });
    };
    BookingsAPI.prototype.getBookings = function() {
        return __awaiter(this, void 0, void 0, function() {
            var currentUser, bookingsService, bookings, e_3;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        currentUser = this.wixSdkAdapter.getCurrentUser();
                        if (!(currentUser.loggedIn &&
                                !this.wixSdkAdapter.isEditorMode() &&
                                !this.wixSdkAdapter.isPreviewMode())) return [3 /*break*/ , 2];
                        bookingsService = this.bookingsServer.BookingsReader();
                        return [4 /*yield*/ , bookingsService({
                            Authorization: this.instance,
                        }).list({})];
                    case 1:
                        bookings = _a.sent();
                        return [2 /*return*/ , bookings.bookingsEntries];
                    case 2:
                        return [2 /*return*/ , []];
                    case 3:
                        return [3 /*break*/ , 5];
                    case 4:
                        e_3 = _a.sent();
                        console.log('failed to fetch members bookings', e_3);
                        return [2 /*return*/ , []];
                    case 5:
                        return [2 /*return*/ ];
                }
            });
        });
    };
    BookingsAPI.prototype.createBulkRequest = function() {
        return {
            requestServices: {
                includeDeleted: false,
                query: {
                    fieldsets: [],
                    filter: "{\"schedules.tags\": \"" + ServiceType.GROUP + "\"}",
                    paging: {
                        limit: 500,
                    },
                    fields: [],
                    sort: [],
                },
            },
            requestBusiness: {
                suppressNotFoundError: false,
            },
            requestListResources: {
                query: {
                    fieldsets: [],
                    filter: null,
                    paging: {
                        limit: 500,
                    },
                    fields: [],
                    sort: [],
                },
            },
        };
    };
    BookingsAPI.prototype.createSlotAvailabilityRequest = function(catalogData, settings, fromRfcString, toRfcString, nextAvailable) {
        if (nextAvailable === void 0) {
            nextAvailable = false;
        }
        var selectedServices = settings[DailyTimetableSettingsKeys.SELECTED_SERVICES];
        var filteredServices = selectedServices ?
            catalogData.services.filter(function(service) {
                return selectedServices[service.id];
            }) :
            catalogData.services;
        var serviceIds = filteredServices.map(function(service) {
            return service.id;
        });
        return {
            timezone: this.getDefaultTimezone(catalogData),
            query: __assign({
                filter: __assign({
                    serviceId: serviceIds,
                    startDate: fromRfcString,
                    endDate: toRfcString
                }, (nextAvailable ?
                    {
                        openSpots: {
                            $gte: '1'
                        },
                        'bookingPolicyViolations.tooLateToBook': false,
                    } :
                    {}))
            }, (nextAvailable ?
                {
                    cursorPaging: {
                        limit: 1
                    },
                } :
                {})),
        };
    };
    return BookingsAPI;
}());
export {
    BookingsAPI
};
//# sourceMappingURL=bookingsAPI.js.map