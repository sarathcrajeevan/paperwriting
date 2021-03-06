import {
    __assign
} from "tslib";
import ProGalleryStore from './ProGalleryStore';
import {
    experimentsWrapper,
    translationUtils,
} from '@wix/photography-client-lib';
import directFullscreenHelper from '../helpers/directFullscreenHelper';
import {
    Utils
} from '../utils/workerUtils';
var CommonViewerScript = /** @class */ (function() {
    function CommonViewerScript(_a) {
        var context = _a.context,
            controllerConfig = _a.controllerConfig,
            APP_DEFINITION_ID = _a.APP_DEFINITION_ID,
            GALLERY_WIDGET_ID = _a.GALLERY_WIDGET_ID,
            _b = _a.isArtStore,
            isArtStore = _b === void 0 ? false : _b,
            fetcher = _a.fetcher,
            _c = _a.SSRWorkerLog,
            SSRWorkerLog = _c === void 0 ? [] : _c;
        this.proGalleryWorkerId = 'PGWorkerId-' + Date.now();
        this.context = context.getContext();
        this.pgStore = null;
        this.isArtStore = isArtStore;
        this.controllerConfig = controllerConfig;
        this.wixCodeApi = controllerConfig.wixCodeApi;
        this.sentryReporter = context.getSentry();
        this.fetcher = fetcher;
        this.SSRWorkerLog = SSRWorkerLog;
        this.initPgStore(APP_DEFINITION_ID, GALLERY_WIDGET_ID);
        this.setWarmupDataIfNeeded();
        this.sentryReport = this.sentryReport.bind(this);
    }
    CommonViewerScript.prototype.setContext = function(context) {
        this.context = context;
    };
    CommonViewerScript.prototype.setSentryReporter = function(sentryReporter) {
        this.sentryReporter = sentryReporter;
    };
    CommonViewerScript.prototype.getPgStore = function() {
        return this.pgStore;
    };
    CommonViewerScript.prototype.getClickedIdx = function() {
        return this.getPgStore().clickedIdx;
    };
    CommonViewerScript.prototype.getTotalItemsCount = function() {
        return this.getPgStore().getTotalItemsCount();
    };
    CommonViewerScript.prototype.getbaseUrls = function() {
        return this.getContext().baseUrls;
    };
    CommonViewerScript.prototype.getWarmupData = function() {
        return {
            items: this.getItems(),
            totalItemsCount: this.getPgStore().totalItemsCount,
            experiments: experimentsWrapper.experiments,
        };
    };
    CommonViewerScript.prototype.getDirectFullscreenItem = function() {
        return this.getPgStore().getDirectFullscreenItem();
    };
    CommonViewerScript.prototype.getDirectFullscreenMockBlueprint = function() {
        return this.getPgStore().getDirectFullscreenMockBlueprint();
    };
    CommonViewerScript.prototype.getTestType = function() {
        return this.getPgStore().getTestType();
    };
    CommonViewerScript.prototype.setMetaTagsInSSRIfNeeded = function() {
        var directFullscreenItem = this.getDirectFullscreenItem();
        if (this.isSSR() && directFullscreenItem && directFullscreenItem.itemId) {
            var pgStore = this.getPgStore();
            var wixCodeApi = this.wixCodeApi;
            var staticMediaUrls = this.getStaticMediaUrls();
            var currentDirectFullscreenUrl = ProGalleryStore.getCurrentDirectFullscreenUrl(wixCodeApi);
            var pageUrl = ProGalleryStore.getPageUrl(wixCodeApi);
            pgStore.setMetaTagsInSSR(directFullscreenItem, pageUrl, currentDirectFullscreenUrl, wixCodeApi, staticMediaUrls);
        }
    };
    CommonViewerScript.prototype.isInSEO = function() {
        var wixCodeApi = this.wixCodeApi;
        return (typeof wixCodeApi.seo.isInSEO === 'function' && !!wixCodeApi.seo.isInSEO());
    };
    CommonViewerScript.prototype.getQueryParams = function() {
        return this.wixCodeApi.location.query;
    };
    CommonViewerScript.prototype.getLocaleFromContext = function() {
        var scopedGlobalSdkApis = this.context.scopedGlobalSdkApis;
        return CommonViewerScript.getLocaleFromScopedGlobalSdkApis(scopedGlobalSdkApis);
    };
    CommonViewerScript.prototype.getCommonGalleryProps = function(isStore) {
        var _this = this;
        var pgStore = this.getPgStore();
        var wixCodeApi = this.wixCodeApi;
        var siteUrl = ProGalleryStore.getSiteUrl(wixCodeApi);
        var fullscreenEndPoint = isStore ?
            '/fullscreen-store-page' :
            '/fullscreen-page';
        var baseUrl = isStore ?
            this.context.scopedGlobalSdkApis.location.baseUrl :
            Utils.getBaseUrl(wixCodeApi, Utils.parseViewMode(wixCodeApi.window.viewMode));
        return {
            clientSetProps: !this.isSSR(),
            propFromSetPropsIndicator: true,
            onNavigate: function(url) {
                return wixCodeApi.location.to(url);
            },
            scrollTo: wixCodeApi.window.scrollTo,
            instance: this.getControllerConfig().appParams.instance,
            appDefinitionId: this.getControllerConfig().appParams.appDefinitionId,
            visitorId: this.getControllerConfig().platformAPIs.bi.visitorId,
            viewerName: this.getControllerConfig().platformAPIs.bi.viewerName,
            queryParams: wixCodeApi.location.query,
            viewMode: wixCodeApi.window.viewMode,
            baseUrl: baseUrl,
            siteUrl: siteUrl,
            pageUrl: ProGalleryStore.getPageUrl(wixCodeApi),
            fullscreenUrl: siteUrl + fullscreenEndPoint,
            instanceId: this.getInstanceId(),
            totalItemsCount: pgStore.totalItemsCount,
            gallerySettings: this.fetcher.settings,
            dateCreated: this.fetcher.dateCreated,
            galleryId: this.fetcher.galleryId,
            translations: translationUtils.translations,
            experiments: experimentsWrapper.experiments,
            setHeight: this.getSetHeightFunc(),
            getMoreItems: function(from) {
                return _this.getMoreItems(from);
            },
            onDimensionsReady: function(dimensions) {
                return _this.handleMeasuredDimensions(dimensions);
            },
            proGalleryWorkerId: this.proGalleryWorkerId,
            BOLT_SUPPORTING_FUNCTION_onNewHostDimensions: function(dimensions) {
                return _this.BOLT_SUPPORTING_FUNCTION_handleNewHostDimensions(dimensions);
            },
            onItemDimensionsMeasure: function(itemDimensions) {
                return _this.handleNewItemDimensions(itemDimensions);
            },
            appLoadStartedReported: pgStore.isAppLoadStartReported,
            tryToReportAppLoaded: pgStore.tryToReportAppLoaded,
            sentryReport: this.sentryReport,
            locale: this.getLocaleFromContext(),
            galleryItemsSource: this.getItemsSource(),
            staticMediaUrls: this.getStaticMediaUrls(),
            requestedHeight: pgStore.requestedHeight,
            requestedWidth: pgStore.requestedWidth,
        };
    };
    CommonViewerScript.prototype.getTryToReportAppLoaded = function() {
        return this.getPgStore().tryToReportAppLoaded;
    };
    CommonViewerScript.prototype.loadInitialBlueprint = function() {
        this.getPgStore().loadInitialBlueprint(this.isSSR());
    };
    CommonViewerScript.prototype.getWixCodeBlueprintReadyPromise = function() {
        return this.getPgStore().wixCodeBlueprintDeferred.promise;
    };
    CommonViewerScript.prototype.getBlueprintReadyPromise = function() {
        return this.getPgStore().blueprintReadyDeferred.promise;
    };
    CommonViewerScript.prototype.getDirectFullscreenReadyPromise = function() {
        return this.getPgStore().directFullscreenReadyDeferred.promise;
    };
    CommonViewerScript.prototype.loadDirectFullscreen = function() {
        var compId = this.getControllerConfig().compId;
        var pgStore = this.getPgStore();
        directFullscreenHelper.loadDirectFullscreen(compId, pgStore.galleryId, this.getQueryParams(), pgStore);
    };
    CommonViewerScript.prototype.getViewPortPromise = function() {
        var _a = this.getControllerConfig(),
            compId = _a.compId,
            wixCodeApi = _a.wixCodeApi;
        return ((this.isSSR() && wixCodeApi.window.getComponentViewportState(compId)) ||
            Promise.resolve({ in: true
            }));
    };
    CommonViewerScript.prototype.initPgStore = function(APP_DEFINITION_ID, GALLERY_WIDGET_ID) {
        var controllerData = this.getControllerConfig();
        var _a = controllerData.appParams,
            instanceId = _a.instanceId,
            instance = _a.instance,
            _b = controllerData.config,
            externalId = _b.externalId,
            style = _b.style,
            dimensions = _b.dimensions,
            compId = controllerData.compId,
            wixCodeApi = controllerData.wixCodeApi,
            avoidGettingItemsFromPGServer = controllerData.avoidGettingItemsFromPGServer;
        var _c = this.getContext(),
            msid = _c.msid,
            platformServices = _c.platformServices,
            scopedGlobalSdkApis = _c.scopedGlobalSdkApis;
        this.pgStore = new ProGalleryStore({
            context: {
                externalId: externalId,
                compId: compId,
                instanceId: instanceId,
                instance: instance,
                msid: msid,
                styles: style.styleParams,
                dimensions: dimensions,
                isSSR: this.isSSR(),
            },
            wixCodeApi: wixCodeApi,
            platformServices: platformServices,
            scopedGlobalSdkApis: scopedGlobalSdkApis,
            APP_DEFINITION_ID: APP_DEFINITION_ID,
            GALLERY_WIDGET_ID: GALLERY_WIDGET_ID,
            isArtStore: this.isArtStore,
            setBlueprintCallback: this.setBlueprint.bind(this),
            setKnownDimensionsCallback: this.setKnownDimensions.bind(this),
            avoidGettingItemsFromPGServer: avoidGettingItemsFromPGServer,
            setItemsLoveDataCallback: this.setItemsLoveData.bind(this),
            sentryReport: this.sentryReport.bind(this),
            fetcher: this.fetcher,
            SSRWorkerLog: this.SSRWorkerLog,
        });
    };
    CommonViewerScript.prototype.getContext = function() {
        return this.context;
    };
    CommonViewerScript.prototype.tryToReportAppLoaded = function() {
        this.getPgStore().tryToReportAppLoaded();
    };
    CommonViewerScript.prototype.getSetHeightFunc = function() {
        var _this = this;
        var setProps = this.getControllerConfig().setProps;
        return function(height) {
            _this.getPgStore().setHeightByLayoutchanges(height);
            setProps({
                dimensions: {
                    height: height,
                },
            });
        };
    };
    CommonViewerScript.prototype.getSetManualDimensionsFunc = function() {
        var setProps = this.getControllerConfig().setProps;
        return function(dimensions) {
            setProps({
                dimensions: dimensions,
            });
        };
    };
    CommonViewerScript.prototype.getSetMetaTagsFunc = function() {
        var _this = this;
        return function(itemData) {
            _this.getPgStore().setMetaTags(itemData, _this.wixCodeApi);
        };
    };
    CommonViewerScript.prototype.getOnLinkNavigationFunc = function() {
        var _this = this;
        return function(item) {
            return _this.getPgStore().navigateToLink(item);
        };
    };
    CommonViewerScript.prototype.getOnItemClickedFunc = function(galleryWixCodeApi) {
        return function(itemData, event) {
            if (galleryWixCodeApi) {
                galleryWixCodeApi.onItemClicked(itemData, event);
            }
        };
    };
    CommonViewerScript.prototype.handleMeasuredDimensions = function(dimensions) {
        var proGalleryStore = this.getPgStore();
        proGalleryStore.debouncedHandleMeasuredDimensions(dimensions);
    };
    CommonViewerScript.prototype.BOLT_SUPPORTING_FUNCTION_handleNewHostDimensions = function(hostDimensions) {
        var proGalleryStore = this.getPgStore();
        proGalleryStore.handleNewUserConfigDimensions(hostDimensions);
    };
    CommonViewerScript.prototype.updateUserConfig = function(newConfig) {
        var proGalleryStore = this.getPgStore();
        proGalleryStore.debouncedHandleNewUserConfig(newConfig);
    };
    CommonViewerScript.prototype.handleNewItemDimensions = function(itemDimensions) {
        var proGalleryStore = this.getPgStore();
        proGalleryStore.handleNewItemDimensions(itemDimensions);
    };
    CommonViewerScript.prototype.getMoreItems = function(from) {
        var proGalleryStore = this.getPgStore();
        proGalleryStore.getMoreItems(from);
    };
    CommonViewerScript.prototype.getItemsSource = function() {
        var proGalleryStore = this.getPgStore();
        return proGalleryStore.itemsSrc ? proGalleryStore.itemsSrc : 'server';
    };
    CommonViewerScript.prototype.getStaticMediaUrls = function() {
        if (this.getControllerConfig().platformAPIs.bi.viewerName !== 'bolt') {
            try {
                return this.getControllerConfig().platformAPIs.topology.media;
            } catch (e) {
                console.error('Could not get staticMediaUrls', e);
            }
        } else {
            return undefined;
        }
    };
    CommonViewerScript.prototype.getBlueprint = function() {
        var proGalleryStore = this.getPgStore();
        return proGalleryStore.getBlueprint();
    };
    CommonViewerScript.prototype.setBlueprint = function() {
        var proGalleryStore = this.getPgStore();
        var setProps = this.getControllerConfig().setProps;
        var blueprint = proGalleryStore.getBlueprint();
        setProps(__assign(__assign({}, blueprint), {
            fullscreenOptions: proGalleryStore.calculatedFullscreenStyles,
            totalItemsCount: proGalleryStore.getTotalItemsCount(),
            galleryItemsSource: this.getItemsSource(),
            SSRWorkerLog: this.getSSRWorkerLog()
        }));
    };
    CommonViewerScript.prototype.setKnownDimensions = function() {
        try {
            var proGalleryStore = this.getPgStore();
            if (proGalleryStore) {
                // dont do this on initial load (bolt bug)
                var setProps = this.getControllerConfig().setProps;
                setProps({
                    requestedHeight: proGalleryStore.requestedHeight,
                    requestedWidth: proGalleryStore.requestedWidth,
                });
            }
        } catch (e) {
            console.warn('couldnt set known dimensions', e);
        }
    };
    CommonViewerScript.prototype.setItemsLoveData = function(loveCountsReactionService) {
        var setProps = this.getControllerConfig().setProps;
        setProps({
            itemsLoveData: loveCountsReactionService,
        });
    };
    CommonViewerScript.prototype.getControllerConfig = function() {
        return this.controllerConfig;
    };
    CommonViewerScript.prototype.setWarmupDataIfNeeded = function() {
        var warmupData = this.getControllerConfig().warmupData;
        if (warmupData) {
            var proGalleryStore = this.getPgStore();
            proGalleryStore.prepareAndSetItems(warmupData.items);
            proGalleryStore.totalItemsCount = warmupData.totalItemsCount;
            experimentsWrapper.setExperiments(warmupData.experiments);
        }
    };
    CommonViewerScript.prototype.handleNewStyleParams = function(manualStyleParams) {
        this.getPgStore().handleManualStyleParams(manualStyleParams);
    };
    CommonViewerScript.prototype.setClickedIdx = function(clickedIdx) {
        var setProps = this.getControllerConfig().setProps;
        setProps({
            clickedIdx: clickedIdx
        });
    };
    CommonViewerScript.prototype.isValidWidgetId = function(type) {
        var WIDGET_ARRAY = this.WIDGET_ID_ARRAY;
        return WIDGET_ARRAY.includes(type);
    };
    CommonViewerScript.prototype.sentryReport = function(error) {
        this.sentryReporter.report(error);
    };
    CommonViewerScript.prototype.getItems = function() {
        return this.getPgStore().getItems();
    };
    CommonViewerScript.prototype.getSettings = function() {
        return this.fetcher.settings;
    };
    CommonViewerScript.prototype.getWatermark = function() {
        var settings = this.getSettings();
        if (!settings) {
            return;
        }
        if (typeof settings === 'object') {
            return settings.watermark;
        }
        return JSON.parse(settings).watermark;
    };
    CommonViewerScript.prototype.getInstanceId = function() {
        return this.getControllerConfig().appParams.instanceId;
    };
    CommonViewerScript.prototype.getSSRWorkerLog = function() {
        return this.getPgStore().getSSRWorkerLog();
    };
    CommonViewerScript.getLocaleFromScopedGlobalSdkApis = function(scopedGlobalSdkApis) {
        if (scopedGlobalSdkApis &&
            scopedGlobalSdkApis.site &&
            scopedGlobalSdkApis.site.language) {
            return scopedGlobalSdkApis.site.language;
        } else {
            return 'en';
        }
    };
    CommonViewerScript.setTranslationsAndExperiments = function(scopedGlobalSdkApis, sentryReporter, instance, initAppParam) {
        try {
            var locale = CommonViewerScript.getLocaleFromScopedGlobalSdkApis(scopedGlobalSdkApis);
            var santaWrapperTranslationsUrl = initAppParam.baseUrls.santaWrapperBaseUrl + "assets/locale/pro-gallery/messages_" + locale + ".json";
            var translationsPromise = ProGalleryStore.getTranslations(santaWrapperTranslationsUrl);
            Utils.getExperimentsAndInitWrapper()(scopedGlobalSdkApis, sentryReporter && sentryReporter.report, instance);
            translationsPromise
                .then(function(translationsRaw) {
                    return translationUtils.setTranslations(translationsRaw);
                })
                .catch(function(e) {
                    if (sentryReporter && sentryReporter.report) {
                        sentryReporter.report(e);
                    }
                    console.error('Waiting for translationsPromise failed', e);
                });
        } catch (e) {
            if (sentryReporter && sentryReporter.report) {
                sentryReporter.report(e);
            }
            console.error('Getting page init data failed', e);
        }
    };
    CommonViewerScript.getInitAppForPageFunc = function(context) {
        return function(initAppParam, platformUtilitiesApi, scopedGlobalSdkApis, platformServices) {
            var _a;
            context.setContext(__assign(__assign({}, initAppParam), {
                platformServices: platformServices,
                scopedGlobalSdkApis: scopedGlobalSdkApis,
                platformUtilitiesApi: platformUtilitiesApi
            }));
            context.initSentry(initAppParam, scopedGlobalSdkApis, platformServices);
            CommonViewerScript.setTranslationsAndExperiments(scopedGlobalSdkApis, context.getSentry(), (_a = context.context) === null || _a === void 0 ? void 0 : _a.instance, initAppParam);
        };
    };
    CommonViewerScript.prototype.isSSR = function() {
        return this.wixCodeApi.window.rendering.env === 'backend';
    };
    CommonViewerScript.getCreateControllers = function(controllerFunc, sentryReporter) {
        return function(controllerConfig) {
            try {
                var widgets_1 = controllerConfig.map(function(config) {
                    var type = config.type,
                        compId = config.compId,
                        setProps = config.setProps;
                    return {
                        type: type,
                        compId: compId,
                        setProps: setProps
                    };
                });
                return controllerConfig.map(function(config) {
                    var res = Promise.resolve(controllerFunc(__assign(__assign({}, config), {
                        widgets: widgets_1
                    })));
                    return res;
                });
            } catch (e) {
                if (sentryReporter && sentryReporter.report) {
                    sentryReporter.report(e);
                }
                console.error('Failed to get CreateControllers', e);
            }
        };
    };
    return CommonViewerScript;
}());
export default CommonViewerScript;
//# sourceMappingURL=CommonViewerScript.js.map