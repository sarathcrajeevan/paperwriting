import {
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
    StaffListViewModel
} from './staff-list.view-model';
import {
    BookingsAPI
} from '../api/bookingsAPI';
import DataPersister from '../utils/data-persister';
import {
    createSettings,
    getComponentSettings,
} from '../app-settings/app-settings';
import {
    FedopsAdapter
} from '@wix/bookings-adapters-reporting/dist/src/fedops/fedops-adapter';
import {
    STAFF_LIST_WIDGET_ID
} from '../platform/platform.const';
import {
    BiLogger
} from '../bi-logger/bi-logger';
import {
    WidgetName
} from '../bi-logger/bi.const';
import {
    isExperimentEnabled
} from '../utils/experiment-enabled';
import Experiments from '@wix/wix-experiments';
var dataPersister = new DataPersister();

function setupStaffList(appParams, $w, $widget, config, wixSdkAdapter, shouldFetchData, fedopsAdapter, externalId, experiments) {
    return __awaiter(this, void 0, void 0, function() {
        var biLogger, staffListViewModel, settings, bookingsAPI, language, _a, staffList, staffListWidgetSettings, translations, isDisplayAltOnImgEnabled;
        return __generator(this, function(_b) {
            switch (_b.label) {
                case 0:
                    biLogger = new BiLogger(wixSdkAdapter, WidgetName.STAFF_LIST);
                    staffListViewModel = new StaffListViewModel({
                        $w: $w,
                        $widget: $widget,
                        wixSdkAdapter: wixSdkAdapter,
                        biLogger: biLogger,
                    });
                    settings = createSettings({
                        appDefId: appParams.appDefinitionId,
                        externalId: externalId,
                        wixSdkAdapter: wixSdkAdapter,
                    });
                    bookingsAPI = new BookingsAPI(appParams.instance, wixSdkAdapter);
                    language = wixSdkAdapter.getCurrentLanguage();
                    return [4 /*yield*/ , Promise.all([
                        dataPersister.getOrFetch(function() {
                            return bookingsAPI.getStaffList();
                        }, shouldFetchData),
                        dataPersister.getOrFetch(function() {
                            return getComponentSettings(settings);
                        }, shouldFetchData),
                        dataPersister.getOrFetch(function() {
                            return bookingsAPI
                                .getTranslations(language)
                                .catch(function() {
                                    return console.error('failed to fetch translations for language: ', language);
                                });
                        }, shouldFetchData),
                    ])];
                case 1:
                    _a = _b.sent(), staffList = _a[0], staffListWidgetSettings = _a[1], translations = _a[2];
                    return [4 /*yield*/ , isExperimentEnabled('specs.bookings.DisplayAltOnImg', experiments)];
                case 2:
                    isDisplayAltOnImgEnabled = _b.sent();
                    staffListViewModel.setStaffList(staffList.resources, staffListWidgetSettings, translations, isDisplayAltOnImgEnabled);
                    if (!dataPersister.get("APP_LOADED_LOGGED" /* APP_LOADED_LOGGED */ )) {
                        fedopsAdapter.logAppLoaded();
                        dataPersister.set("APP_LOADED_LOGGED" /* APP_LOADED_LOGGED */ , true);
                        biLogger.sendStaffWidgetLoaded();
                    }
                    return [2 /*return*/ ];
            }
        });
    });
}
export var createWidgetController = function(_a) {
    var compId = _a.compId,
        config = _a.config,
        $w = _a.$w,
        appParams = _a.appParams,
        platformAPIs = _a.platformAPIs,
        wixCodeApi = _a.wixCodeApi,
        livePreviewOptions = _a.livePreviewOptions,
        externalId = _a.externalId;
    return __awaiter(void 0, void 0, void 0, function() {
        var widgetProps, widgetServices, $widget, initialControllerAPI, onPropsChanged, wixSdkAdapter, experiments, fedopsAdapter, shouldFetchData;
        return __generator(this, function(_b) {
            widgetProps = {};
            widgetServices = new WidgetServices(widgetProps);
            $widget = widgetServices.get$widget($w);
            initialControllerAPI = {};
            onPropsChanged = function(oldProps, newProps) {};
            $widget.onPropsChanged(onPropsChanged);
            wixSdkAdapter = new WixOOISDKAdapter(wixCodeApi, platformAPIs, appParams, compId);
            experiments = new Experiments({
                scope: 'bookings-viewer-script',
                baseUrl: wixSdkAdapter.isSSR() ? 'https://wix.com' : '',
            });
            fedopsAdapter = new FedopsAdapter(wixSdkAdapter, STAFF_LIST_WIDGET_ID);
            shouldFetchData = (livePreviewOptions && livePreviewOptions.shouldFetchData) ||
                wixSdkAdapter.isPreviewMode();
            return [2 /*return*/ , {
                pageReady: function() {
                    return __awaiter(void 0, void 0, void 0, function() {
                        var pageReadyPromise;
                        return __generator(this, function(_a) {
                            pageReadyPromise = setupStaffList(appParams, $w, $widget, config, wixSdkAdapter, shouldFetchData, fedopsAdapter, externalId, experiments);
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
//# sourceMappingURL=staff-list.controller.js.map