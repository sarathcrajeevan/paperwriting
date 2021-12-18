import {
    __assign,
    __awaiter,
    __generator
} from "tslib";
import {
    WidgetServices
} from '../platform/platform-services';
import {
    WixOOISDKAdapter
} from '@wix/bookings-adapter-ooi-wix-sdk';
import {
    WeeklyDayPickerViewModel
} from './weekly-day-picker.view-model';
import * as moment from 'moment';
import {
    BookingsAPI
} from '../api/bookingsAPI';
import {
    SlotsListViewModel
} from './slots-list.view-model';
import {
    BiLogger
} from '../bi-logger/bi-logger';
import {
    FedopsAdapter
} from '@wix/bookings-adapters-reporting/dist/src/fedops/fedops-adapter';
import {
    WidgetName
} from '../bi-logger/bi.const';
import DataPersister from '../utils/data-persister';
import {
    DAILY_TIMETABLE_WIDGET_ID
} from '../platform/platform.const';
import Experiments from '@wix/wix-experiments';
import {
    getLocalTimezone
} from '../utils/timezone';
import {
    DailyTimetableSettingsKeys,
    FirstDay,
} from '@wix/bookings-app-builder-settings-const/dist/src/DailyTimeTable/Settings.const';
import {
    createSettings,
    getComponentSettings,
    getSettings,
} from '../app-settings/app-settings';
import {
    RefreshAppContextContextBuilder,
} from '@wix/bookings-app-builder-settings-const/dist/src/DailyTimeTable/refresh-app-context';
import {
    isExperimentEnabled
} from '../utils/experiment-enabled';
import {
    getFirstDayOfTheWeek,
    dateToShiftedRfcString,
} from '@wix/bookings-date-time';
var DEFAULT_LANGUAGE = 'en';
var legacyIsSundayTheFirstDay = function(timetableConfig, translations) {
    return timetableConfig.firstDayOfWeek &&
        timetableConfig.firstDayOfWeek !== FirstDay.NONE ?
        timetableConfig.firstDayOfWeek === FirstDay.SUNDAY :
        translations['first-day-of-week.in-english'] === 'Sunday';
};
var isSundayFirstDay = function(catalogData) {
    return (getFirstDayOfTheWeek(catalogData.businessInfo.dateRegionalSettingsLocale) === 0);
};
var isTextDefinedInSettings = function(settings, key) {
    return settings[key] !== undefined;
};
var getAvailabilitySlots = function(catalogData, date, slotsListViewModel, httpAdapter, settings) {
    return __awaiter(void 0, void 0, void 0, function() {
        return __generator(this, function(_a) {
            switch (_a.label) {
                case 0:
                    return [4 /*yield*/ , slotsListViewModel.setLoading()];
                case 1:
                    _a.sent();
                    return [2 /*return*/ , httpAdapter.getAvailabilitySlots(catalogData, date.format('YYYY-MM-DDTHH:mm:ss'), settings)];
            }
        });
    });
};
var getSessionsForDate = function(date, slotsListViewModel, httpAdapter, businessTimezone, localTimezone, regionalSettings) {
    return __awaiter(void 0, void 0, void 0, function() {
        var sessionsInRange;
        return __generator(this, function(_a) {
            switch (_a.label) {
                case 0:
                    return [4 /*yield*/ , slotsListViewModel.setLoading()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/ , httpAdapter.getSessionsForDate({
                        date: date,
                        timezone: localTimezone,
                        regionalSettings: regionalSettings,
                    })];
                case 2:
                    sessionsInRange = _a.sent();
                    return [2 /*return*/ , sessionsInRange.slots];
            }
        });
    });
};
var getTimetableConfig = function(_a) {
    var httpAdapter = _a.httpAdapter,
        appDefId = _a.appDefId,
        externalId = _a.externalId,
        wixSdkAdapter = _a.wixSdkAdapter;
    return __awaiter(void 0, void 0, void 0, function() {
        var _b, catalogData_1, componentSettings_1, _c, catalogData, bookingEntries, componentSettings, firstAvailableDate, initialSlots;
        return __generator(this, function(_d) {
            switch (_d.label) {
                case 0:
                    if (!wixSdkAdapter.isSSR()) return [3 /*break*/ , 2];
                    return [4 /*yield*/ , Promise.all([
                        httpAdapter.getCatalogData(),
                        getSettings({
                            wixSdkAdapter: wixSdkAdapter,
                            appDefId: appDefId,
                            externalId: externalId,
                        }),
                    ])];
                case 1:
                    _b = _d.sent(), catalogData_1 = _b[0], componentSettings_1 = _b[1];
                    return [2 /*return*/ , {
                        catalogData: catalogData_1,
                        componentSettings: componentSettings_1,
                        bookingEntries: [],
                        firstAvailableDate: dateToShiftedRfcString(new Date()),
                        initialSlots: [],
                    }];
                case 2:
                    return [4 /*yield*/ , Promise.all([
                        httpAdapter.getCatalogData(),
                        httpAdapter.getBookings(),
                        getSettings({
                            wixSdkAdapter: wixSdkAdapter,
                            appDefId: appDefId,
                            externalId: externalId,
                        }),
                    ])];
                case 3:
                    _c = _d.sent(), catalogData = _c[0], bookingEntries = _c[1], componentSettings = _c[2];
                    return [4 /*yield*/ , httpAdapter.getNextAvailableDate(catalogData, componentSettings)];
                case 4:
                    firstAvailableDate = _d.sent();
                    return [4 /*yield*/ , httpAdapter.getAvailabilitySlots(catalogData, firstAvailableDate, componentSettings)];
                case 5:
                    initialSlots = _d.sent();
                    return [2 /*return*/ , {
                        catalogData: catalogData,
                        bookingEntries: bookingEntries,
                        firstAvailableDate: firstAvailableDate,
                        componentSettings: componentSettings,
                        initialSlots: initialSlots,
                    }];
            }
        });
    });
};
var getTimetableConfigUsingFes = function(wixSdkAdapter, httpAdapter, businessTimezone, localTimezone, regionalSettings, externalId, appDefId) {
    return __awaiter(void 0, void 0, void 0, function() {
        var settings;
        var _a;
        return __generator(this, function(_b) {
            switch (_b.label) {
                case 0:
                    if (!wixSdkAdapter.isSSR()) return [3 /*break*/ , 2];
                    settings = createSettings({
                        appDefId: appDefId,
                        externalId: externalId,
                        wixSdkAdapter: wixSdkAdapter,
                    });
                    _a = {
                        slots: [],
                        firstDateWithSessions: moment().format('YYYY-MM-DD')
                    };
                    return [4 /*yield*/ , getComponentSettings(settings)];
                case 1:
                    return [2 /*return*/ , (_a.settings = _b.sent(),
                        _a)];
                case 2:
                    return [2 /*return*/ , httpAdapter.getTimetableConfig({
                        timezone: localTimezone,
                        regionalSettings: regionalSettings,
                    })];
            }
        });
    });
};
var dataPersister = new DataPersister();

function setUpTimeTable(appParams, $w, $widget, config, wixSdkAdapter, fedopsAdapter, refreshAppContext, externalId, experiments) {
    return __awaiter(this, void 0, void 0, function() {
        var isTimetableAccessibilityEnabled, isAlignDateAndTimeEnabled, isSlotAvailabilityInTimetableEnabled, biLogger, httpAdapter, businessTimezone, localTimezone, language, failedTranslationFetch, regionalSettings, _a, translations_1, _b, catalogData_2, bookingEntries, firstAvailableDate, componentSettings, initialSlots, e_1, settings_1, slotsListViewModel_1, selectedDate_1, dateRegionalSettingsLocale, sundayAsFirstDay, onDaySelected, getTranslation, dayPickerViewModel, setSessions_1, reportAppLoaded, _c, timetableConfig, translations_2, e_2, settings, slotsListViewModel_2, selectedDate_2, dateRegionalSettingsLocale, sundayAsFirstDay, onDaySelected, getTranslation, dayPickerViewModel, setSessions_2, reportAppLoaded;
        var _this = this;
        return __generator(this, function(_d) {
            switch (_d.label) {
                case 0:
                    return [4 /*yield*/ , isExperimentEnabled('specs.bookings.TimetableAccessibility', experiments)];
                case 1:
                    isTimetableAccessibilityEnabled = _d.sent();
                    return [4 /*yield*/ , isExperimentEnabled('specs.bookings.AlignDateAndTime', experiments)];
                case 2:
                    isAlignDateAndTimeEnabled = _d.sent();
                    return [4 /*yield*/ , isExperimentEnabled('specs.bookings.SlotAvailabilityInTimetable', experiments)];
                case 3:
                    isSlotAvailabilityInTimetableEnabled = _d.sent();
                    biLogger = new BiLogger(wixSdkAdapter, WidgetName.DAILY_TIMETABLE);
                    httpAdapter = new BookingsAPI(appParams.instance, wixSdkAdapter, externalId);
                    businessTimezone = wixSdkAdapter.getSiteTimezone() || 'UTC';
                    localTimezone = getLocalTimezone(businessTimezone);
                    language = wixSdkAdapter.getCurrentLanguage();
                    failedTranslationFetch = false;
                    regionalSettings = wixSdkAdapter.getRegionalSettings();
                    if (!wixSdkAdapter.isEditorMode() && !wixSdkAdapter.isPreviewMode()) {
                        fedopsAdapter.logInteractionStarted('get-tt-data');
                    }
                    if (!isSlotAvailabilityInTimetableEnabled) return [3 /*break*/ , 9];
                    return [4 /*yield*/ , Promise.all([
                        dataPersister.getOrFetch(function() {
                            return httpAdapter
                                .getTranslations(language)
                                .catch(function() {
                                    return httpAdapter
                                        .getTranslations(language)
                                        .catch(function() {
                                            return (failedTranslationFetch = true);
                                        });
                                });
                        }, refreshAppContext.shouldFetchServices),
                        dataPersister.getOrFetch(function() {
                            return getTimetableConfig({
                                httpAdapter: httpAdapter,
                                appDefId: appParams.appDefinitionId,
                                wixSdkAdapter: wixSdkAdapter,
                                externalId: externalId,
                            });
                        }, refreshAppContext.shouldFetchServices),
                    ])];
                case 4:
                    _a = _d.sent(), translations_1 = _a[0], _b = _a[1], catalogData_2 = _b.catalogData, bookingEntries = _b.bookingEntries, firstAvailableDate = _b.firstAvailableDate, componentSettings = _b.componentSettings, initialSlots = _b.initialSlots;
                    /* eslint-enable prefer-const */
                    if (!wixSdkAdapter.isEditorMode() && !wixSdkAdapter.isPreviewMode()) {
                        fedopsAdapter.logInteractionEnded('get-tt-data');
                    }
                    if (!failedTranslationFetch) return [3 /*break*/ , 8];
                    wixSdkAdapter.setCurrentLanguage(DEFAULT_LANGUAGE);
                    language = wixSdkAdapter.getCurrentLanguage();
                    _d.label = 5;
                case 5:
                    _d.trys.push([5, 7, , 8]);
                    return [4 /*yield*/ , httpAdapter.getTranslations(language)];
                case 6:
                    translations_1 = _d.sent();
                    return [3 /*break*/ , 8];
                case 7:
                    e_1 = _d.sent();
                    console.error("Failed to get translations for default language - " + language + ": " + e_1.message);
                    return [3 /*break*/ , 8];
                case 8:
                    settings_1 = __assign(__assign({}, componentSettings), refreshAppContext.updatedSettings);
                    if (isTextDefinedInSettings(settings_1, DailyTimetableSettingsKeys.TIMETABLE_HEADING_TEXT)) {
                        $w('#timetableTitle').text =
                            settings_1[DailyTimetableSettingsKeys.TIMETABLE_HEADING_TEXT] ||
                            translations_1['bookings.daily-timetable.title'];
                    }
                    if (isTextDefinedInSettings(settings_1, DailyTimetableSettingsKeys.EMPTY_STATE_TEXT)) {
                        $w('#messageText').text =
                            settings_1[DailyTimetableSettingsKeys.EMPTY_STATE_TEXT] ||
                            translations_1['bookings.daily-timetable.empty-state'];
                    }
                    slotsListViewModel_1 = new SlotsListViewModel({
                        $w: $w,
                        $widget: $widget,
                        wixSdkAdapter: wixSdkAdapter,
                        biLogger: biLogger,
                        bookingsApi: httpAdapter,
                        isTimetableAccessibilityEnabled: isTimetableAccessibilityEnabled,
                        isSlotAvailabilityInTimetableEnabled: isSlotAvailabilityInTimetableEnabled,
                        timetableSettings: settings_1,
                        catalogData: catalogData_2,
                        bookingEntries: bookingEntries,
                        translations: translations_1,
                    });
                    selectedDate_1 = moment(firstAvailableDate.substring(0, 10));
                    dateRegionalSettingsLocale = catalogData_2.businessInfo.dateRegionalSettingsLocale;
                    sundayAsFirstDay = isSundayFirstDay(catalogData_2);
                    onDaySelected = function(date, navigationInfo) {
                        return __awaiter(_this, void 0, void 0, function() {
                            var availabilitySlots;
                            return __generator(this, function(_a) {
                                switch (_a.label) {
                                    case 0:
                                        return [4 /*yield*/ , getAvailabilitySlots(catalogData_2, date, slotsListViewModel_1, httpAdapter, settings_1)];
                                    case 1:
                                        availabilitySlots = _a.sent();
                                        biLogger.sendTimetableNavigationEvent(__assign(__assign({}, navigationInfo), {
                                            additionalInfo: date.toISOString(),
                                            isEmptyState: availabilitySlots.length === 0
                                        }));
                                        return [2 /*return*/ , setSessions_1(availabilitySlots)];
                                }
                            });
                        });
                    };
                    getTranslation = function(key) {
                        return translations_1[key];
                    };
                    dayPickerViewModel = new WeeklyDayPickerViewModel({
                        $widget: $widget,
                        $w: $w,
                        wixSdkAdapter: wixSdkAdapter,
                        getTranslation: getTranslation,
                        onDaySelected: onDaySelected,
                        sundayAsFirstDay: sundayAsFirstDay,
                        dateRegionalSettingsLocale: dateRegionalSettingsLocale,
                        isAlignDateAndTimeEnabled: isAlignDateAndTimeEnabled,
                        isTimetableAccessibilityEnabled: isTimetableAccessibilityEnabled,
                    });
                    setSessions_1 = function(newSessions, isInitialLoad) {
                        if (isInitialLoad === void 0) {
                            isInitialLoad = false;
                        }
                        return __awaiter(_this, void 0, void 0, function() {
                            return __generator(this, function(_a) {
                                return [2 /*return*/ , slotsListViewModel_1.setSlotsList(newSessions, businessTimezone, isInitialLoad)];
                            });
                        });
                    };
                    reportAppLoaded = function(slots) {
                        fedopsAdapter.logAppLoaded();
                        biLogger.sendTimetableLoadedEvent({
                            additionalInfo: selectedDate_1.toISOString(),
                            isEmptyState: slots.length === 0,
                        });
                        dataPersister.set("APP_LOADED_LOGGED" /* APP_LOADED_LOGGED */ , true);
                    };
                    // Leave SSR in loading state so it shows with loader and SSR cache is meaningful
                    if (wixSdkAdapter.isSSR()) {
                        slotsListViewModel_1.setCleanMode();
                        dayPickerViewModel.hideAllElements();
                    } else {
                        setSessions_1(initialSlots, true);
                        dayPickerViewModel.setSelectedDate(selectedDate_1);
                        // Show hidden elements when not in SSR (we must hide them in SSR since data is dynamic) #SCHED-19226
                        dayPickerViewModel.hideAllElements();
                        dayPickerViewModel.showAllElements();
                    }
                    if (!dataPersister.get("APP_LOADED_LOGGED" /* APP_LOADED_LOGGED */ )) {
                        reportAppLoaded(initialSlots);
                    }
                    return [3 /*break*/ , 15];
                case 9:
                    return [4 /*yield*/ , Promise.all([
                        dataPersister.getOrFetch(function() {
                            return getTimetableConfigUsingFes(wixSdkAdapter, httpAdapter, businessTimezone, localTimezone, regionalSettings, externalId, appParams.appDefinitionId);
                        }, refreshAppContext.shouldFetchServices),
                        dataPersister.getOrFetch(function() {
                            return httpAdapter
                                .getTranslations(language)
                                .catch(function() {
                                    return httpAdapter
                                        .getTranslations(language)
                                        .catch(function() {
                                            return (failedTranslationFetch = true);
                                        });
                                });
                        }, refreshAppContext.shouldFetchServices),
                    ])];
                case 10:
                    _c = _d.sent(), timetableConfig = _c[0], translations_2 = _c[1];
                    if (!wixSdkAdapter.isEditorMode() && !wixSdkAdapter.isPreviewMode()) {
                        fedopsAdapter.logInteractionEnded('get-tt-data');
                    }
                    if (!failedTranslationFetch) return [3 /*break*/ , 14];
                    wixSdkAdapter.setCurrentLanguage(DEFAULT_LANGUAGE);
                    language = wixSdkAdapter.getCurrentLanguage();
                    _d.label = 11;
                case 11:
                    _d.trys.push([11, 13, , 14]);
                    return [4 /*yield*/ , httpAdapter.getTranslations(language)];
                case 12:
                    translations_2 = _d.sent();
                    return [3 /*break*/ , 14];
                case 13:
                    e_2 = _d.sent();
                    console.error("Failed to get translations for default language - " + language + ": " + e_2.message);
                    return [3 /*break*/ , 14];
                case 14:
                    settings = __assign(__assign({}, timetableConfig.settings), refreshAppContext.updatedSettings);
                    if (isTextDefinedInSettings(settings, DailyTimetableSettingsKeys.TIMETABLE_HEADING_TEXT)) {
                        $w('#timetableTitle').text =
                            settings[DailyTimetableSettingsKeys.TIMETABLE_HEADING_TEXT] ||
                            translations_2['bookings.daily-timetable.title'];
                    }
                    if (isTextDefinedInSettings(settings, DailyTimetableSettingsKeys.EMPTY_STATE_TEXT)) {
                        $w('#messageText').text =
                            settings[DailyTimetableSettingsKeys.EMPTY_STATE_TEXT] ||
                            translations_2['bookings.daily-timetable.empty-state'];
                    }
                    slotsListViewModel_2 = new SlotsListViewModel({
                        $w: $w,
                        $widget: $widget,
                        wixSdkAdapter: wixSdkAdapter,
                        biLogger: biLogger,
                        bookingsApi: httpAdapter,
                        isTimetableAccessibilityEnabled: isTimetableAccessibilityEnabled,
                        isSlotAvailabilityInTimetableEnabled: isSlotAvailabilityInTimetableEnabled,
                        timetableSettings: settings,
                        catalogData: {},
                        bookingEntries: [],
                        translations: translations_2,
                    });
                    selectedDate_2 = moment(timetableConfig.firstDateWithSessions);
                    dateRegionalSettingsLocale = timetableConfig.dateRegionalSettingsLocale;
                    sundayAsFirstDay = legacyIsSundayTheFirstDay(timetableConfig, translations_2);
                    onDaySelected = function(date, navigationInfo) {
                        return __awaiter(_this, void 0, void 0, function() {
                            var newSessions;
                            return __generator(this, function(_a) {
                                switch (_a.label) {
                                    case 0:
                                        return [4 /*yield*/ , getSessionsForDate(date, slotsListViewModel_2, httpAdapter, businessTimezone, localTimezone, regionalSettings)];
                                    case 1:
                                        newSessions = _a.sent();
                                        biLogger.sendTimetableNavigationEvent(__assign(__assign({}, navigationInfo), {
                                            additionalInfo: date.toISOString(),
                                            isEmptyState: newSessions.length === 0
                                        }));
                                        return [2 /*return*/ , setSessions_2(newSessions)];
                                }
                            });
                        });
                    };
                    getTranslation = function(key) {
                        return translations_2[key];
                    };
                    dayPickerViewModel = new WeeklyDayPickerViewModel({
                        $widget: $widget,
                        $w: $w,
                        wixSdkAdapter: wixSdkAdapter,
                        getTranslation: getTranslation,
                        onDaySelected: onDaySelected,
                        sundayAsFirstDay: sundayAsFirstDay,
                        dateRegionalSettingsLocale: dateRegionalSettingsLocale,
                        isAlignDateAndTimeEnabled: isAlignDateAndTimeEnabled,
                        isTimetableAccessibilityEnabled: isTimetableAccessibilityEnabled,
                    });
                    setSessions_2 = function(newSessions, isInitialLoad) {
                        if (isInitialLoad === void 0) {
                            isInitialLoad = false;
                        }
                        return __awaiter(_this, void 0, void 0, function() {
                            return __generator(this, function(_a) {
                                return [2 /*return*/ , slotsListViewModel_2.setSlotsList(newSessions, businessTimezone, isInitialLoad)];
                            });
                        });
                    };
                    reportAppLoaded = function(slots) {
                        fedopsAdapter.logAppLoaded();
                        biLogger.sendTimetableLoadedEvent({
                            additionalInfo: selectedDate_2.toISOString(),
                            isEmptyState: slots.length === 0,
                        });
                        dataPersister.set("APP_LOADED_LOGGED" /* APP_LOADED_LOGGED */ , true);
                    };
                    // Leave SSR in loading state so it shows with loader and SSR cache is meaningful
                    if (wixSdkAdapter.isSSR()) {
                        slotsListViewModel_2.setCleanMode();
                        dayPickerViewModel.hideAllElements();
                    } else {
                        setSessions_2(timetableConfig.slots, true).catch(function(e) {
                            return console.error('Failed to set sessions - ', e);
                        });
                        dayPickerViewModel.setSelectedDate(selectedDate_2);
                        // Show hidden elements when not in SSR (we must hide them in SSR since data is dynamic) #SCHED-19226
                        dayPickerViewModel.hideAllElements();
                        dayPickerViewModel.showAllElements();
                    }
                    dayPickerViewModel.setViewLoaded();
                    slotsListViewModel_2.setViewLoaded();
                    if (!dataPersister.get("APP_LOADED_LOGGED" /* APP_LOADED_LOGGED */ )) {
                        reportAppLoaded(timetableConfig.slots);
                    }
                    _d.label = 15;
                case 15:
                    return [2 /*return*/ ];
            }
        });
    });
}
export function createRefreshAppContext(_a) {
    var refreshAppInput = _a.refreshAppInput,
        isPreviewMode = _a.isPreviewMode;
    var refreshAppContext;
    if (typeof refreshAppInput === 'object' && refreshAppInput) {
        refreshAppContext = refreshAppInput;
    } else {
        var refreshAppContextContextBuilder = new RefreshAppContextContextBuilder();
        if (refreshAppInput) {
            refreshAppContextContextBuilder.shouldFetchServices();
        } else {
            refreshAppContextContextBuilder.shouldNotFetchServices();
        }
        refreshAppContext = refreshAppContextContextBuilder.build();
    }
    // need to investigate - when switching to preview mode in editor, the loader will get stuck, adding 'isPreviewMode' solves it (talk to Or if not sure)
    if (isPreviewMode) {
        refreshAppContext.shouldFetchServices = true;
    }
    return refreshAppContext;
}
export var createWidgetController = function(_a) {
    var compId = _a.compId,
        type = _a.type,
        config = _a.config,
        $w = _a.$w,
        warmupData = _a.warmupData,
        setProps = _a.setProps,
        appParams = _a.appParams,
        platformAPIs = _a.platformAPIs,
        wixCodeApi = _a.wixCodeApi,
        livePreviewOptions = _a.livePreviewOptions,
        externalId = _a.externalId;
    return __awaiter(void 0, void 0, void 0, function() {
        var wixSdkAdapter, experiments, fedopsAdapter, widgetProps, widgetServices, $widget, initialControllerAPI, onPropsChanged, shouldFetchData, refreshAppContext;
        return __generator(this, function(_b) {
            wixSdkAdapter = new WixOOISDKAdapter(wixCodeApi, platformAPIs, appParams, compId);
            experiments = new Experiments({
                scopes: ['bookings-viewer-script', 'wix-bookings-client'],
                baseUrl: wixSdkAdapter.isSSR() ? 'https://wix.com' : '',
            });
            fedopsAdapter = new FedopsAdapter(wixSdkAdapter, DAILY_TIMETABLE_WIDGET_ID);
            widgetProps = {};
            widgetServices = new WidgetServices(widgetProps);
            $widget = widgetServices.get$widget($w);
            initialControllerAPI = {};
            onPropsChanged = function(oldProps, newProps) {};
            $widget.onPropsChanged(onPropsChanged);
            shouldFetchData = livePreviewOptions && livePreviewOptions.shouldFetchData;
            refreshAppContext = createRefreshAppContext({
                refreshAppInput: shouldFetchData,
                isPreviewMode: wixSdkAdapter.isPreviewMode(),
            });
            return [2 /*return*/ , {
                pageReady: function() {
                    return __awaiter(void 0, void 0, void 0, function() {
                        var pageReadyPromise;
                        return __generator(this, function(_a) {
                            pageReadyPromise = setUpTimeTable(appParams, $w, $widget, config, wixSdkAdapter, fedopsAdapter, refreshAppContext, externalId, experiments);
                            return [2 /*return*/ , pageReadyPromise];
                        });
                    });
                },
                exports: function() {
                    return widgetServices.generateControllerAPI($widget, initialControllerAPI);
                },
            }];
        });
    });
};
//# sourceMappingURL=daily-timetable.controller.js.map