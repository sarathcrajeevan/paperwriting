import {
    PRO_GALLERY
} from '../../constants';
import Fetcher from './fetcher';
import WorkerLog from '../../workerLog';
import {
    ViewerScriptContext,
    CommonViewerScript,
    WixCodeApi,
    utils,
    Utils,
    BiLogger,
} from '@wix/common-pro-gallery-worker-wrapper';

const context = new ViewerScriptContext(PRO_GALLERY.SENTRY_DSN);

const createAppController = (controllerConfig) => {
    const WIDGET_ARRAY = [
        PRO_GALLERY.GALLERY_WIDGET_ID,
        PRO_GALLERY.PG_TEST_GALLERY_WIDGET_ID,
    ];
    const {
        setProps
    } = controllerConfig;
    if (!WIDGET_ARRAY.includes(controllerConfig.type)) {
        return {
            pageReady: () => {},
            exports: () => {},
        };
    }
    const biLogger = new BiLogger(
        context.getContext().platformServices.biLoggerFactory(),
        Utils.parseViewMode(controllerConfig.wixCodeApi.window.viewMode),
        false, // isArtStore
    );

    const reportBiLog = (funcName, data) => {
        biLogger.log(fetcher.galleryId, funcName, data);
    };
    const SSRWorkerLog = new WorkerLog();

    const fetcher = new Fetcher({
        context,
        controllerConfig,
        reportBiLog,
        SSRWorkerLog,
    });
    fetcher.fetchGalleryId();
    const commonViewerScript = new CommonViewerScript({
        context,
        controllerConfig,
        APP_DEFINITION_ID: PRO_GALLERY.PG_APP_DEFINITION_ID,
        GALLERY_WIDGET_ID: PRO_GALLERY.GALLERY_WIDGET_ID,
        isArtStore: false,
        fetcher,
        SSRWorkerLog,
    });

    const tryToReportAppLoaded = commonViewerScript.getTryToReportAppLoaded();
    const galleryWixCodeApi = new WixCodeApi();
    return {
        pageReady: () => {
            try {
                const renderGallery = (viewPortState) => {
                    SSRWorkerLog.push('pageReady, starting promises flows');
                    let notInView = false;
                    if (viewPortState && !viewPortState.in) {
                        // notInView can be true only in SSR.
                        // tryToReportAppLoaded for this case will be called later here in "if (commonViewerScript.isSSR())"
                        notInView = true;
                    }
                    commonViewerScript.loadInitialBlueprint();
                    commonViewerScript.loadDirectFullscreen();
                    return Promise.all([
                            commonViewerScript.getBlueprintReadyPromise(),
                            commonViewerScript.getDirectFullscreenReadyPromise(),
                        ])
                        .catch((e) => {
                            commonViewerScript.sentryReport(e);
                            console.error('Waiting for promises failed', e);
                        })
                        .then(() => {
                            if (utils.isVerbose()) {
                                console.log(
                                    'query: ',
                                    JSON.stringify(commonViewerScript.getQueryParams()),
                                );
                            }
                            setProps({
                                ...commonViewerScript.getCommonGalleryProps(false),
                                reportBiLog,
                                onItemClicked: commonViewerScript.getOnItemClickedFunc(
                                    galleryWixCodeApi,
                                ),
                                onLinkNavigation: commonViewerScript.getOnLinkNavigationFunc(),
                                setMetaTags: commonViewerScript.getSetMetaTagsFunc(),
                                onCurrentItemChanged: (item) =>
                                    galleryWixCodeApi.onCurrentItemChanged(item),
                                isInSEO: commonViewerScript.isInSEO(),
                                cssBaseUrl: commonViewerScript.getbaseUrls()
                                    .santaWrapperBaseUrl,
                                directFullscreenItem: commonViewerScript.getDirectFullscreenItem(),
                                directFullscreenMockBlueprint: commonViewerScript.getDirectFullscreenMockBlueprint(),
                                testType: commonViewerScript.getTestType(),
                                clickedIdx: commonViewerScript.getClickedIdx(),
                                notInView,
                                totalItemsCount: commonViewerScript.getTotalItemsCount(),
                            });

                            if (commonViewerScript.isSSR()) {
                                commonViewerScript.setMetaTagsInSSRIfNeeded();
                                tryToReportAppLoaded(true);
                            }
                            return commonViewerScript.getWarmupData();
                        });
                };

                return commonViewerScript
                    .getViewPortPromise()
                    .then(renderGallery)
                    .catch((error) => {
                        console.error(error);
                        commonViewerScript.sentryReport({
                            errorMessage: 'viewportPromise rejected!',
                            error,
                        });
                        tryToReportAppLoaded();
                    });
            } catch (e) {
                console.error(e);
                commonViewerScript.sentryReport(e);
            }
        },
        updateConfig: (_, config) => {
            const isBolt = controllerConfig.platformAPIs.bi.viewerName === 'bolt';
            if (isBolt) {
                config.dimensions = config.dimensions || {};
            }
            commonViewerScript.updateUserConfig(config);
        },
        exports: () => {
            try {
                return galleryWixCodeApi.generateApi({
                    proGalleryStore: commonViewerScript.getPgStore(),
                    setNewStyleParams: (sp) =>
                        commonViewerScript.handleNewStyleParams(sp),
                    setClickedIdx: (clickedIdx) =>
                        commonViewerScript.setClickedIdx(clickedIdx),
                    setManualDimensions: commonViewerScript.getSetManualDimensionsFunc(),
                });
            } catch (e) {
                commonViewerScript.sentryReport(e);
            }
        },
    };
};

export const wrappedFunctions = {
    initAppForPage: CommonViewerScript.getInitAppForPageFunc(context),
    createControllers: CommonViewerScript.getCreateControllers(
        createAppController,
        context.getSentry(),
    ),
};