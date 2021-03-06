import {
    __assign,
    __awaiter,
    __generator
} from "tslib";
import {
    BlueprintsManager,
    blueprints
} from 'pro-gallery-blueprints';
import {
    Utils,
    utils,
    onlyPositiveNumericValues
} from '../utils/workerUtils';
import directFullscreenHelper from '../helpers/directFullscreenHelper';
import * as VideoGallerySDK from '@wix/video-gallery-sdk';
import {
    experimentsWrapper,
    getResizeMediaUrl,
    getProGalleryStyles,
    parseStyleParams,
} from '@wix/photography-client-lib';
import {
    GALLERY_CONSTS,
    mergeNestedObjects
} from 'pro-gallery-lib';
import {
    GalleryItem
} from 'pro-layouts';
import BlueprintsApi from './WorkerBlueprintsApi';
import {
    reactionServiceManager
} from '../store/reactionServiceManager';
import {
    mockOptions
} from '../helpers/directFullscreenMockOptions';
var Deferred = /** @class */ (function() {
    function Deferred() {
        var _this = this;
        this.promise = new Promise(function(resolve, reject) {
            _this.reject = reject;
            _this.resolve = resolve;
        });
    }
    return Deferred;
}());
var emptyItemsResponse = {
    totalItemsCount: 0,
    items: [],
};
var UNKNOWN_CONTAINER = {
    desktop: {
        avoidGallerySelfMeasure: true,
        width: 980,
        height: 500,
        screen: {
            width: 1920,
            height: 1080
        },
        mobilePreviewFrame: {
            width: 1920,
            height: 1080
        },
    },
    mobile: {
        avoidGallerySelfMeasure: true,
        width: 320,
        height: 640,
        screen: {
            width: 320,
            height: 640
        },
        mobilePreviewFrame: {
            width: 320,
            height: 640
        },
    },
};
var ProGalleryStore = /** @class */ (function() {
    function ProGalleryStore(_a) {
        var _this = this;
        var context = _a.context,
            wixCodeApi = _a.wixCodeApi,
            platformServices = _a.platformServices,
            scopedGlobalSdkApis = _a.scopedGlobalSdkApis,
            APP_DEFINITION_ID = _a.APP_DEFINITION_ID,
            GALLERY_WIDGET_ID = _a.GALLERY_WIDGET_ID,
            isArtStore = _a.isArtStore,
            setBlueprintCallback = _a.setBlueprintCallback,
            setKnownDimensionsCallback = _a.setKnownDimensionsCallback,
            avoidGettingItemsFromPGServer = _a.avoidGettingItemsFromPGServer,
            setItemsLoveDataCallback = _a.setItemsLoveDataCallback,
            sentryReport = _a.sentryReport,
            fetcher = _a.fetcher,
            SSRWorkerLog = _a.SSRWorkerLog;
        this.debouncedHandleNewUserConfig = utils.debounce(this.handleNewUserConfig.bind(this), 100);
        this.debouncedHandleMeasuredDimensions = utils.debounce(this.handleMeasuredDimensions.bind(this), 100);
        this.createFedopsLogger = function(platformServices) {
            var fedOpsLoggerFactory = platformServices.fedOpsLoggerFactory;
            _this.fedopsLogger = fedOpsLoggerFactory.getLoggerForWidget({
                appId: _this.APP_DEFINITION_ID,
                widgetId: _this.GALLERY_WIDGET_ID,
            });
        };
        this.tryToReportAppLoaded = function() {
            if (_this.isAppLoadStartReported && !_this.isAppLoadedReported) {
                try {
                    if (_this.isSSR()) {
                        _this.fedopsLogger.appLoaded();
                    } else {
                        _this.fedopsLogger.appLoaded(_this.getFedopsCustomParams());
                    }
                    _this.isAppLoadedReported = true;
                } catch (e) {
                    if (utils.isVerbose()) {
                        console.log('cant run fedopsLogger.appLoaded()', e);
                    }
                }
            }
        };
        this.initFlowPromises();
        this.setBlueprintCallback = setBlueprintCallback;
        this.setItemsLoveDataCallback = setItemsLoveDataCallback;
        this.setKnownDimensionsCallback = setKnownDimensionsCallback;
        this.context = context;
        this.fetcher = fetcher;
        this.setItemsCurrentId = 0;
        this.setWixStyles(context.styles);
        this.calculatedGalleryStyles = undefined;
        this.calculatedFullscreenStyles = undefined;
        this.wixCodeApi = wixCodeApi;
        this.directfullscreenItem = 'init';
        this.SSRWorkerLog = SSRWorkerLog;
        this.APP_DEFINITION_ID = APP_DEFINITION_ID;
        this.GALLERY_WIDGET_ID = GALLERY_WIDGET_ID;
        this.isArtStore = isArtStore;
        this.avoidGettingItemsFromPGServer = avoidGettingItemsFromPGServer;
        this.getMoreItemsFromServer = this.getMoreItemsFromServer.bind(this);
        this.getMoreWixCodeItems = this.getMoreWixCodeItems.bind(this);
        this.loadInitialWixCodeItems = this.loadInitialWixCodeItems.bind(this);
        this.getItemsFromWixCode = this.getItemsFromWixCode.bind(this);
        this.setBlueprintIfNeeded = this.setBlueprintIfNeeded.bind(this);
        this.loadDirectFullscreenItemFromWixCode = this.loadDirectFullscreenItemFromWixCode.bind(this);
        this.prepareAndSetItems = this.prepareAndSetItems.bind(this);
        this.prepareItems = this.prepareItems.bind(this);
        this.getItems = this.getItems.bind(this);
        this.setDirectFullscreenItem = this.setDirectFullscreenItem.bind(this);
        this.setDirectFullscreenMockBlueprint = this.setDirectFullscreenMockBlueprint.bind(this);
        this.createDirectFullscreenBlueprintMockIfNeeded = this.createDirectFullscreenBlueprintMockIfNeeded.bind(this);
        this.createDirectFullscreenMockBlueprint = this.createDirectFullscreenMockBlueprint.bind(this);
        this.itemDimensionsCache = {};
        this.viewMode = Utils.parseViewMode(this.wixCodeApi.window.viewMode);
        this.deviceType = Utils.formFactorToDeviceType(this.wixCodeApi.window.formFactor);
        this.isMobile = utils.isMobile(this.deviceType);
        this.initDimensions();
        this.baseUrl = Utils.getBaseUrl(this.wixCodeApi, this.viewMode);
        this.SSRWorkerLog.push('baseUrl: ' + this.baseUrl);
        this.scopedGlobalSdkApis = scopedGlobalSdkApis;
        this.pgRenderStart = Date.now();
        this.sentryReport = sentryReport;
        this.setDirectfullscreenOnce = false;
        this.ITEMS_BATCH_SIZE = 50;
        this.INITIAL_ITEMS_BATCH_SIZE = 50;
        this.shouldUseBlueprintsFromServer = false;
        this.directFullscreenMockBlueprint = false;
        try {
            this.createFedopsLogger(platformServices);
            this.fedopsLogger.appLoadStarted();
            this.isAppLoadStartReported = true;
        } catch (e) {
            console.error('Cannot create fedops logger', e);
            this.fedopsLogger = {
                appLoaded: function() {},
                appLoadStarted: function() {},
            };
            this.isAppLoadStartReported = true;
        }
        this.fullListOfItemsLoveData = [];
        this.SSRWorkerLog.push('finnished the pgStore constructor. this isSSR?: ' +
            ("" + (this.isSSR() ? 'TRUE' : 'FALSE')));
    }
    ProGalleryStore.prototype.handleNewUserConfig = function(newConfig) {
        var newStyleParams = newConfig.style.styleParams,
            newDimensions = newConfig.dimensions;
        this.handleNewUserConfigDimensions(newDimensions);
        this.setWixStyles(newStyleParams);
        this.recalculateStylesExpensively();
        this.triggerBlueprintCreation({
            settingNewItems: false
        });
    };
    ProGalleryStore.prototype.ceilDimensions = function(dimensions) {
        var ceiledDimensions = {};
        Object.entries(dimensions).forEach(function(_a) {
            var key = _a[0],
                value = _a[1];
            if (typeof value === 'number') {
                ceiledDimensions[key] = Math.ceil(value);
            } else {
                ceiledDimensions[key] = value;
            }
        });
        return ceiledDimensions;
    };
    ProGalleryStore.prototype.handleNewUserConfigDimensions = function(newDimensions) {
        newDimensions = this.ceilDimensions(newDimensions);
        if (newDimensions &&
            JSON.stringify(this.userConfigDimensions) !==
            JSON.stringify(newDimensions)) {
            this.setUserDimensions(newDimensions);
            this.userConfigDimensions = __assign({}, newDimensions);
        }
    };
    ProGalleryStore.prototype.initDimensions = function() {
        this.initDefaultDimensions();
        this.handleNewUserConfigDimensions(this.context.dimensions || {});
    };
    ProGalleryStore.prototype.initDefaultDimensions = function() {
        // is an init and will not count for knownDimensions calcs
        this.requestedHeight = false;
        this.requestedWidth = false;
        this.dimensions = __assign({}, UNKNOWN_CONTAINER[this.isMobile ? 'mobile' : 'desktop']);
    };
    ProGalleryStore.prototype.getDimensions = function() {
        return this.dimensions;
    };
    ProGalleryStore.prototype.handleMeasuredDimensions = function(dimensions) {
        this.setClientMeasuredDimensions(dimensions);
        this.fixGalleryStyleRatiosInMobile();
        this.triggerBlueprintCreation({
            settingNewItems: false
        });
    };
    ProGalleryStore.prototype.setHeightByLayoutchanges = function(height) {
        this.setUserDimensions(__assign(__assign({}, this.userDimensions), {
            height: height
        }));
        this.fixGalleryStyleRatiosInMobile();
        this.triggerBlueprintCreation({
            settingNewItems: false
        });
    };
    ProGalleryStore.prototype.setClientMeasuredDimensions = function(dimensions) {
        this.clientMeasuredDimensions =
            onlyPositiveNumericValues(dimensions) || this.clientMeasuredDimensions;
        this.recalculateDimensions();
    };
    ProGalleryStore.prototype.recalculateDimensions = function() {
        var _dimensions = __assign(__assign(__assign({}, this.dimensions), this.clientMeasuredDimensions), this.userDimensions);
        this.setKnownDimensions();
        this.setDimensions(_dimensions);
    };
    ProGalleryStore.prototype.setUserDimensions = function(dimensions) {
        var newDimensions = onlyPositiveNumericValues(dimensions);
        if (JSON.stringify(newDimensions) !== JSON.stringify(this.userDimensions)) {
            this.userDimensions = newDimensions || this.userDimensions;
            this.recalculateDimensions();
        }
    };
    ProGalleryStore.prototype.setDimensions = function(newDimensions) {
        if (JSON.stringify(newDimensions) !== JSON.stringify(this.dimensions)) {
            this.SSRWorkerLog.push('setting dimensions: w: ' +
                newDimensions.width +
                ',h: ' +
                newDimensions.height);
            this.dimensions = __assign(__assign({}, this.dimensions), newDimensions);
        }
        this.dimensionsAreAvailableDeferred.resolve(); // this is not in the if. this.dimensions is initiallized elsewhere and should not yet resolve (not using setDimensions). setDimensions is called only after the first userConfig dimensions in the init and should resolve then.
    };
    ProGalleryStore.prototype.setKnownDimensions = function() {
        var inputedDimensions = __assign(__assign({}, this.clientMeasuredDimensions), this.userDimensions);
        if ((inputedDimensions === null || inputedDimensions === void 0 ? void 0 : inputedDimensions.height) !== this.requestedHeight ||
            (inputedDimensions === null || inputedDimensions === void 0 ? void 0 : inputedDimensions.width) !== this.requestedWidth) {
            this.requestedHeight = inputedDimensions.height;
            this.requestedWidth = inputedDimensions.width;
            // this will setProps to the component and should fire only on changes
            this.setKnownDimensionsCallback();
        }
    };
    ProGalleryStore.prototype.isSSR = function() {
        return this.wixCodeApi.window.rendering.env === 'backend';
    };
    ProGalleryStore.prototype.isSEO = function() {
        return this.wixCodeApi.seo.isInSEO();
    };
    ProGalleryStore.prototype.getFedopsCustomParams = function() {
        var customParams = {
            customParams: JSON.stringify({
                gallery_id: this.fetcher.galleryId || 'galleryId is undefined',
            }),
        };
        return customParams;
    };
    ProGalleryStore.getSiteUrl = function(api) {
        return api.location.baseUrl;
    };
    ProGalleryStore.getPageUrl = function(api) {
        var url = api.location.url.split('?')[0];
        return url;
    };
    ProGalleryStore.prototype.createShareUrl = function(itemId, api) {
        if (this.isArtStore)
            return null; // remove when art-store is using the new share methods
        var pageUrl = ProGalleryStore.getPageUrl(api);
        return (pageUrl +
            '?pgid=' +
            this.context.compId.replace('comp-', '') +
            '-' +
            itemId);
    };
    ProGalleryStore.getCurrentDirectFullscreenUrl = function(api) {
        var pageUrl = ProGalleryStore.getPageUrl(api);
        var query = api.location.query;
        var pgid = query && query.pgid;
        if (pgid) {
            return pageUrl + '?pgid=' + pgid;
        } else {
            return null;
        }
    };
    ProGalleryStore.getTranslations = function(url) {
        // only under scope `pro-gallery-viewer`
        return fetch(url)
            .then(function(res) {
                return res.json();
            })
            .catch(function() {
                return {};
            });
    };
    ProGalleryStore.prototype.getConnectedProvidersFromServer = function(wixInstance) {
        if (wixInstance === void 0) {
            wixInstance = false;
        }
        var instance = this.context.instance;
        if (wixInstance) {
            instance = wixInstance;
        }
        var url = this.baseUrl + "/_api/pro-gallery-webapp/v1/store/providers?instance=" + instance;
        return fetch(url).then(function(response) {
            return response.json();
        });
    };
    ProGalleryStore.prototype.getQueryParams = function() {
        return this.wixCodeApi.location.query;
    };
    ProGalleryStore.prototype.isValidUUID = function(id) {
        var regEx = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return !!id.match(regEx);
    };
    ProGalleryStore.prototype.getMoreItemsFromServer = function(from) {
        return __awaiter(this, void 0, void 0, function() {
            var res, e_1;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/ , this.fetcher.getGalleryDataFromServer({
                            from: from
                        })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/ , res.items];
                    case 2:
                        e_1 = _a.sent();
                        console.error('couldnt get more items from server', e_1);
                        return [2 /*return*/ , emptyItemsResponse];
                    case 3:
                        return [2 /*return*/ ];
                }
            });
        });
    };
    ProGalleryStore.prototype.navigateToLink = function(itemData) {
        var link = itemData &&
            itemData.dto &&
            itemData.dto.metaData &&
            itemData.dto.metaData.link; // replace to when available - itemData?.dto?.metaData?.link;
        try {
            if (link) {
                if (link.type === 'web') {
                    this.wixCodeApi.location.to(link.url);
                } else if (link.type === 'page') {
                    try {
                        var pageUrl = this.wixCodeApi.site
                            .getSiteStructure({
                                includePageId: true
                            })
                            .pages.find(function(page) {
                                return page.id === link.url;
                            }).url;
                        this.wixCodeApi.location.to(pageUrl);
                    } catch (e) {
                        console.warn('Cannot navigate to page', e);
                    }
                } else if (link.type === 'wix') {
                    var linkData = link.data;
                    if (linkData) {
                        var externalUrl = this.wixCodeApi.location.getExternalUrl(linkData);
                        if (!externalUrl) {
                            // PageLink with target of '_self' will open via this
                            this.wixCodeApi.location.navigateTo(linkData);
                        } else {
                            console.error('this should have been handled by <a href>');
                        }
                    }
                }
            }
        } catch (e) {
            console.error(e);
        }
    };
    ProGalleryStore.prototype.getVideoMediaId = function(item) {
        if (item.metaData.videoUrl &&
            item.metaData.videoUrl.includes('wix:video://')) {
            return item.metaData.videoUrl.split('/')[3] || item.itemId;
        } else {
            return item.mediaUrl;
        }
    };
    ProGalleryStore.prototype.getItemWithVideoUrls = function(item) {
        var videoId = this.getVideoMediaId(item);
        return VideoGallerySDK.getVideoURLs(videoId)
            .then(function(qualities) {
                item.metaData.qualities = qualities
                    .filter(function(quality) {
                        return quality.type === 'MP4';
                    })
                    .map(function(qualityObject) {
                        var url = qualityObject.url;
                        var quality = qualityObject.quality;
                        var height = parseInt(quality);
                        var width = Math.floor((height * item.metaData.width) / item.metaData.height);
                        return {
                            url: url,
                            height: height,
                            width: width,
                            quality: quality,
                            formats: ['mp4'],
                        };
                    });
                item.metaData.videoUrl = undefined;
                if (!experimentsWrapper.getExperimentBoolean('specs.pro-gallery.excludeFromHlsVideos')) {
                    var hls = qualities.filter(function(quality) {
                        return quality.type === 'HLS';
                    });
                    if (hls.length > 0) {
                        item.metaData.videoUrl = hls[0].url;
                    }
                } else {
                    item.metaData.ghostItem = true; // see below. this is here just for the experiment to have an "else" and not stay placeholder.
                }
                return item;
            })
            .catch(function(e) {
                item.metaData.ghostItem = true; // item does not exist but is still in the pg database
                return item;
            });
    };
    ProGalleryStore.prototype.getItemsWithWixVideosUrls = function(items) {
        var _this = this;
        var result = items.map(function(item) {
            if (_this.isUnreadyVideoFile(item)) {
                return _this.getItemWithVideoUrls(item);
            } else {
                return Promise.resolve(item);
            }
        });
        return Promise.all(result);
    };
    ProGalleryStore.prototype.replaceByPlaceHolder = function(item) {
        return {
            itemId: item.itemId,
            mediaUrl: item.metaData.posters[0].url,
            orderIndex: 0,
            metaData: __assign(__assign({}, item.metaData), {
                type: 'image',
                isVideoPlaceholder: true,
                height: item.metaData.posters[0].height,
                width: item.metaData.posters[0].width
            }),
        };
    };
    ProGalleryStore.prototype.isUnreadyVideoFile = function(item) {
        return (!item.metaData.ghostItem &&
            ((item.metaData.videoUrl &&
                    item.metaData.videoUrl.includes('wix:video://')) ||
                (item.metaData.type === 'video' &&
                    item.mediaUrl &&
                    !item.metaData.videoUrl)));
    };
    ProGalleryStore.prototype.addItemProperties = function(item) {
        var _a, _b, _c;
        var convertedToPlaceholder = false;
        if (this.isUnreadyVideoFile(item)) {
            item = this.replaceByPlaceHolder(item);
            convertedToPlaceholder = true;
        }
        try {
            if (!this.sitePages) {
                this.sitePages = this.wixCodeApi.site.getSiteStructure({
                    includePageId: true,
                }).pages;
            }
            if (((_c = (_b = (_a = item.metaData) === null || _a === void 0 ? void 0 : _a.link) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.type) === 'PageLink') {
                var page_1 = this.sitePages.find(function(_page) {
                    return item.metaData.link.data.pageId.endsWith(_page.id);
                });
                if (!!page_1 && 'name' in page_1) {
                    item.metaData.link.data.pageName = page_1.name;
                }
            }
        } catch (error) {
            console.log('ProGalleryStore, addItemProperties, try to add a pageName to an item if needed, error:', error);
        }
        var directLink = {
            url: undefined,
            target: undefined,
        };
        if (item.metaData && item.metaData.link) {
            var link = item.metaData.link;
            if (link.type === 'web' && typeof link.url === 'string') {
                var isExternal = link.url.slice(0, 4) === 'http' || link.url.slice(0, 2) === '//';
                if (isExternal || this.wixCodeApi.seo.isInSEO()) {
                    // bots need to see inner pathing e.g. "/subpage", they can only see it if its on the <a> tag JIRA PG-193
                    directLink = {
                        url: link.url,
                        target: '_blank',
                    };
                }
            } else if (link.type === 'wix') {
                var linkData_1 = link.data;
                if (linkData_1) {
                    try {
                        var externalUrl = this.wixCodeApi.location.getExternalUrl(linkData_1);
                        if (externalUrl) {
                            directLink = {
                                url: externalUrl,
                                target: linkData_1.target || link.target || '_blank',
                            };
                        } else if (!!linkData_1.pageName &&
                            linkData_1.target === '_blank' &&
                            linkData_1.type === 'PageLink') {
                            // PageLink with target of '_blank' will be treated as an externalLink and open via the 'a' tag of the itemView in PG core
                            var pageData = this.wixCodeApi.site
                                .getSiteStructure({
                                    includePageId: true
                                })
                                .pages.find(function(page) {
                                    return page.name === linkData_1.pageName;
                                });
                            var url = pageData &&
                                pageData.url &&
                                this.wixCodeApi.location.baseUrl &&
                                this.wixCodeApi.location.baseUrl + pageData.url;
                            directLink = !!url ?
                                {
                                    url: url,
                                    target: '_blank',
                                } :
                                directLink;
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
        }
        item.directLink = directLink;
        var itemId = function() {
            return item.id || item.photoId || item.itemId;
        };
        item.directShareLink = experimentsWrapper.getExperimentBoolean('specs.pro-gallery.itemDeeplinks') ?
            this.createShareUrl(itemId(), this.wixCodeApi) :
            null;
        return {
            item: item,
            convertedToPlaceholder: convertedToPlaceholder
        };
    };
    ProGalleryStore.prototype.prepareItems = function(items) {
        var _this = this;
        // TODO - make item properties be added only once - this is getting bigger.
        var shouldGetVideoUrls = false;
        var itemsListToGetLoveData = []; // Items that haven't yet got their love data
        var shouldUseReactionService = reactionServiceManager.shouldUseReactionService();
        var itemsToSet;
        if (items && items.length >= 0) {
            itemsToSet = items.map(function(item) {
                var _a = _this.addItemProperties(item),
                    resItem = _a.item,
                    convertedToPlaceholder = _a.convertedToPlaceholder;
                if (!shouldGetVideoUrls && convertedToPlaceholder) {
                    shouldGetVideoUrls = true;
                }
                if (utils.isDimensionless(resItem)) {
                    var itemWithDimensions = _this.addDimensionsFromCache(resItem);
                    if (!!itemWithDimensions) {
                        resItem = itemWithDimensions;
                    }
                }
                if (typeof resItem.metaData === 'string') {
                    // TODO - check this.... this moved from the itemsHelper.
                    try {
                        resItem = __assign(__assign({}, resItem), {
                            metaData: JSON.parse(resItem.metaData)
                        });
                    } catch (e) {
                        console.error('Failed parse item metaData', e);
                    }
                }
                // Item Love Data
                if (!resItem.isVisitedLoveData && shouldUseReactionService) {
                    itemsListToGetLoveData.push({
                        itemId: item.itemId
                    });
                    resItem.isVisitedLoveData = true;
                }
                return resItem;
            });
        } else {
            console.error('corrupt items', items, 'returning old items instead');
            itemsToSet = this.items;
        }
        this.getItemsLoveDataIfNeeded(itemsListToGetLoveData);
        return {
            itemsToSet: itemsToSet,
            shouldGetVideoUrls: shouldGetVideoUrls
        };
    };
    ProGalleryStore.prototype.getItemsFromWixCode = function(_a) {
        var from = _a.from,
            _b = _a.batchSize,
            batchSize = _b === void 0 ? this.ITEMS_BATCH_SIZE : _b;
        return this.allWixCodeItems.slice(from, from + batchSize);
    };
    ProGalleryStore.prototype.loadInitialWixCodeItems = function() {
        var newItems = this.getItemsFromWixCode({
            from: 0,
            batchSize: this.INITIAL_ITEMS_BATCH_SIZE,
        });
        this.prepareAndSetItems({
            newItems: newItems
        });
        this.loadDirectFullscreenItemFromWixCode();
    };
    ProGalleryStore.prototype.loadDirectFullscreenItemFromWixCode = function() {
        return __awaiter(this, void 0, void 0, function() {
            var directFullscreenItem;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , directFullscreenHelper.getDirectFullscreenItemFromItemsList(this.wixCodeApi.location.query, this.allWixCodeItems, this.context.compId, this.fetcher)];
                    case 1:
                        directFullscreenItem = _a.sent();
                        if (directFullscreenItem) {
                            this.prepareAndSetDirectFullscreenItem(directFullscreenItem);
                        } else {
                            this.directFullscreenReadyDeferred.resolve();
                        }
                        return [2 /*return*/ ];
                }
            });
        });
    };
    ProGalleryStore.prototype.prepareAndSetItems = function(_a) {
        var newItems = _a.newItems,
            setItemsId = _a.setItemsId,
            _b = _a.currentItems,
            currentItems = _b === void 0 ? [] : _b;
        // Here we have a system to prevent returning async item calls (like getting videoUrls) from applying over newer calls form itemsToSet:.
        if (setItemsId && setItemsId !== this.setItemsCurrentId) {
            // if the call that came back from getting urls is old we discard it here.
            return;
        }
        if (!setItemsId) {
            // new calls for preparing items will get a new progressing Id to give their follow-up calls after they get videoUrls.
            this.setItemsCurrentId++;
        }
        var _c = this.prepareItems(newItems),
            itemsToSet = _c.itemsToSet,
            shouldGetVideoUrls = _c.shouldGetVideoUrls;
        if (shouldGetVideoUrls) {
            this.buildVideoUrlsAndSet({
                newItems: newItems,
                setItemsId: this.setItemsCurrentId,
                currentItems: currentItems,
            });
        }
        this.setItems(currentItems.concat(itemsToSet));
    };
    ProGalleryStore.prototype.getItemsLoveDataIfNeeded = function(itemsListToGetLoveData) {
        var _this = this;
        var styleParams = this.wixStyles;
        var loveButton = getProGalleryStyles(styleParams).loveButton;
        if (reactionServiceManager.shouldUseReactionService() &&
            loveButton &&
            itemsListToGetLoveData.length > 0) {
            var instance = this.context.instance;
            var galleryId = this.fetcher.galleryId;
            var appDefinitionId = this.APP_DEFINITION_ID;
            reactionServiceManager
                .getItemsLoveData(itemsListToGetLoveData, instance, this.baseUrl, galleryId, appDefinitionId, this.sentryReport)
                .then(function(loveCountsReactionService) {
                    // Accumalative object that stores all items' love data (from all batches)
                    _this.fullListOfItemsLoveData = __assign(__assign({}, _this.fullListOfItemsLoveData), loveCountsReactionService);
                    // Upate the 'component part' that new data love of items has arrived
                    _this.setItemsLoveDataCallback(_this.fullListOfItemsLoveData);
                });
        }
    };
    ProGalleryStore.prototype.buildVideoUrlsAndSet = function(_a) {
        var _this = this;
        var newItems = _a.newItems,
            setItemsId = _a.setItemsId,
            currentItems = _a.currentItems;
        this.getItemsWithWixVideosUrls(newItems).then(function(itemsWithVideoUrls) {
            _this.prepareAndSetItems({
                newItems: itemsWithVideoUrls,
                setItemsId: setItemsId,
                currentItems: currentItems,
            });
        });
    };
    ProGalleryStore.prototype.setItems = function(items) {
        var _a;
        var _items = items.filter(function(item) {
            return !!item.mediaUrl || (item.metaData && !!item.metaData.html);
        });
        this.SSRWorkerLog.push('setting items, first item id is: ' + ((_a = _items[0]) === null || _a === void 0 ? void 0 : _a.itemId));
        this.SSRWorkerLog.push('items src is: ' + this.itemsSrc);
        this.items = _items || this.items;
        this.itemsAreAvailableDeferred.resolve();
        this.triggerBlueprintCreation({
            settingNewItems: true
        });
    };
    ProGalleryStore.prototype.setAllWixCodeItems = function(items) {
        var _a;
        this.SSRWorkerLog.push('trying to set ' + (items === null || items === void 0 ? void 0 : items.length) +
            ' wixCode items, first item id: ' + ((_a = items[0]) === null || _a === void 0 ? void 0 : _a.itemId));
        var _items = items.filter(function(item) {
            return !!item.mediaUrl || (item.metaData && !!item.metaData.html);
        });
        this.allWixCodeItems = _items;
    };
    ProGalleryStore.prototype.getItems = function() {
        return this.items || [];
    };
    ProGalleryStore.prototype.getBlueprint = function() {
        return this.blueprint;
    };
    ProGalleryStore.prototype.setBlueprint = function(blueprint) {
        this.blueprint = blueprint;
        if (this.itemsSrc === 'Velo') {
            this.SSRWorkerLog.push('setting a blueprint while currentItems are wixCode');
            this.wixCodeBlueprintDeferred.resolve(); // resolving that a wixCode items blueprint is available for flows that wait for it. namely art-store in albums
        } else {
            this.SSRWorkerLog.push('setting a server-items blueprint');
        }
        this.blueprintReadyDeferred.resolve();
        this.setBlueprintCallback();
    };
    ProGalleryStore.prototype.itemToGalleryItem = function(item, staticMediaUrls) {
        var galleryItem = new GalleryItem({
            dto: item,
            watermark: undefined,
            createMediaUrl: getResizeMediaUrl({
                staticMediaUrls: staticMediaUrls,
            }),
        });
        return galleryItem;
    };
    ProGalleryStore.prototype.constructMetaTagsItemData = function(galleryItem, page_url, fullscreen_url) {
        var itemData = {
            item: {
                id: galleryItem.id,
                type: galleryItem.type,
                title: galleryItem.title,
                description: galleryItem.description,
                page_url: page_url,
                fullscreen_url: fullscreen_url,
                image: {
                    url: galleryItem.createUrl(GALLERY_CONSTS.urlSizes.RESIZED, GALLERY_CONSTS.urlTypes.HIGH_RES),
                    width: galleryItem.width,
                    height: galleryItem.height,
                },
                video_url: galleryItem.videoUrl ||
                    galleryItem.createUrl(GALLERY_CONSTS.urlSizes.RESIZED, GALLERY_CONSTS.urlTypes.VIDEO),
                thumbnail: {
                    url: galleryItem.createUrl(GALLERY_CONSTS.urlSizes.RESIZED, GALLERY_CONSTS.urlTypes.LOW_RES),
                    width: 250,
                    height: 250,
                },
            },
        };
        return itemData;
    };
    ProGalleryStore.prototype.setMetaTagsInSSR = function(item, page_url, fullscreen_url, api, staticMediaUrls) {
        var galleryItem = this.itemToGalleryItem(item, staticMediaUrls);
        var itemData = this.constructMetaTagsItemData(galleryItem, page_url, fullscreen_url);
        this.setMetaTags(itemData, api);
    };
    ProGalleryStore.prototype.setMetaTags = function(itemData, api) {
        // Setting metaTags for SEO fullscreen navigation
        if (itemData.item) {
            api.seo.renderSEOTags({
                itemType: 'PRO_GALLERY_ITEM',
                itemData: itemData,
                asNewPage: true,
            });
        } else {
            api.seo.resetSEOTags();
        }
    };
    ProGalleryStore.prototype.prepareAndSetDirectFullscreenItem = function(item) {
        var _this = this;
        var _a = this.prepareItems([
                item,
            ]),
            itemsArray = _a.itemsToSet,
            shouldGetVideoUrls = _a.shouldGetVideoUrls;
        if (shouldGetVideoUrls) {
            this.getItemWithVideoUrls(item).then(function(itemWithVideoUrl) {
                _this.prepareAndSetDirectFullscreenItem(itemWithVideoUrl);
            });
        }
        var resItem = itemsArray[0];
        if (resItem.itemId && !resItem.metaData.isVideoPlaceholder) {
            this.setDirectFullscreenItem(resItem);
        }
    };
    ProGalleryStore.prototype.createDirectFullscreenMockBlueprint = function() {
        return blueprints.createBlueprint({
            params: {
                items: [this.directFullscreenItem],
                container: this.isMobile ?
                    UNKNOWN_CONTAINER.mobile.screen :
                    UNKNOWN_CONTAINER.desktop.screen,
                options: mockOptions,
            },
            lastParams: {},
            existingBlueprint: {},
            blueprintManagerId: 'direct fullscreen item blueprints',
            isUsingCustomInfoElements: true,
        });
    };
    ProGalleryStore.prototype.createDirectFullscreenBlueprintMockIfNeeded = function() {
        var _this = this;
        if (this.isSSR() && this.isSEO()) {
            this.directFullscreenItemReadyDeferred.promise
                .then(function() {
                    var directFullscreenMockBlueprint = _this.createDirectFullscreenMockBlueprint();
                    _this.setDirectFullscreenMockBlueprint(directFullscreenMockBlueprint);
                })
                .catch(function() {
                    _this.directFullscreenBlueprintMockReadyDeferred.resolve();
                });
        } else {
            this.directFullscreenBlueprintMockReadyDeferred.resolve();
        }
    };
    ProGalleryStore.prototype.setDirectFullscreenMockBlueprint = function(blueprint) {
        this.directFullscreenMockBlueprint =
            blueprint || this.directFullscreenMockBlueprint;
        this.directFullscreenBlueprintMockReadyDeferred.resolve();
    };
    ProGalleryStore.prototype.setDirectFullscreenItem = function(directFullscreenItem) {
        this.directFullscreenItem =
            directFullscreenItem || this.directFullscreenItem;
        this.directFullscreenItemReadyDeferred.resolve();
    };
    ProGalleryStore.prototype.getDirectFullscreenItem = function() {
        return this.directFullscreenItem ? this.directFullscreenItem : false;
    };
    ProGalleryStore.prototype.getDirectFullscreenMockBlueprint = function() {
        return this.directFullscreenMockBlueprint ?
            this.directFullscreenMockBlueprint :
            false;
    };
    ProGalleryStore.prototype.getTestType = function() {
        var queryParams = this.getQueryParams();
        var pgTestType = queryParams && queryParams.pgTestType;
        if (pgTestType) {
            return pgTestType;
        } else {
            return null;
        }
    };
    ProGalleryStore.prototype.getSSRWorkerLog = function() {
        this.SSRWorkerLog.push(' ######## requesting the worker log ######### (and setting props to the component');
        return this.SSRWorkerLog;
    };
    ProGalleryStore.prototype.addItems = function(items, from) {
        var curItems = this.getItems();
        this.prepareAndSetItems({
            newItems: items,
            currentItems: curItems.slice(0, from),
        });
    };
    ProGalleryStore.prototype.loadInitialItems = function() {
        return __awaiter(this, void 0, void 0, function() {
            var itemsData, e_2, items, totalItemsCount;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        this.SSRWorkerLog.push('Fn loadIntialItems');
                        if (utils.isVerbose()) {
                            console.log('Getting initial items from server', this.items, this.totalItemsCount);
                        }
                        if (!(this.items && this.items.length > 0)) return [3 /*break*/ , 1];
                        // items were already loaded by wix-code or warmup data
                        return [2 /*return*/ , Promise.resolve(this.items)];
                    case 1:
                        itemsData = void 0;
                        if (!this.avoidGettingItemsFromPGServer) return [3 /*break*/ , 2];
                        itemsData = emptyItemsResponse;
                        return [3 /*break*/ , 5];
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/ , this.fetcher.getGalleryDataFromServer({
                            from: 0,
                            batchSize: this.INITIAL_ITEMS_BATCH_SIZE,
                        })];
                    case 3:
                        itemsData = _a.sent();
                        return [3 /*break*/ , 5];
                    case 4:
                        e_2 = _a.sent();
                        console.error('couldnt get items', e_2);
                        itemsData = emptyItemsResponse;
                        return [3 /*break*/ , 5];
                    case 5:
                        if (utils.isVerbose()) {
                            console.log('Got initial items from server', itemsData);
                        }
                        try {
                            items = itemsData.items, totalItemsCount = itemsData.totalItemsCount;
                            if (this.itemsSrc !== 'Velo') {
                                // do not override wixCode items with items from db
                                this.prepareAndSetItems({
                                    newItems: items
                                });
                                this.totalItemsCount = Number(totalItemsCount);
                            }
                        } catch (e) {
                            console.error('Could not fetch initial items from server', e, itemsData);
                            this.totalItemsCount = 1;
                        }
                        return [2 /*return*/ , this.getItems()];
                }
            });
        });
    };
    ProGalleryStore.prototype.getBlueprintFromServer = function(args) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function() {
            var url, response, data, error_1;
            return __generator(this, function(_c) {
                switch (_c.label) {
                    case 0:
                        this.SSRWorkerLog.push('getting blueprint from server first itemId:', (_b = (_a = args === null || args === void 0 ? void 0 : args.params) === null || _a === void 0 ? void 0 : _a.items[0]) === null || _b === void 0 ? void 0 : _b.itemId);
                        this.SSRWorkerLog.push("Sending a request the blueprints server: ");
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 5]);
                        url = this.baseUrl + "/_serverless/pro-gallery-blueprints-server/createBlueprint";
                        return [4 /*yield*/ , fetch(url, {
                            method: 'POST',
                            credentials: 'omit',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(__assign({}, args)),
                        })];
                    case 2:
                        response = _c.sent();
                        return [4 /*yield*/ , response.json()];
                    case 3:
                        data = _c.sent();
                        return [2 /*return*/ , data];
                    case 4:
                        error_1 = _c.sent();
                        console.error('couldnt get blueprint from server ', error_1);
                        return [3 /*break*/ , 5];
                    case 5:
                        return [2 /*return*/ ];
                }
            });
        });
    };
    ProGalleryStore.prototype.isServerBlueprintsForcedByQuery = function() {
        var blueprintsServerQuery = 'forceServerBlueprints';
        var query = this.wixCodeApi.location.query;
        return query && query[blueprintsServerQuery] === 'true';
    };
    ProGalleryStore.prototype.createInitialBlueprint = function() {
        return __awaiter(this, void 0, void 0, function() {
            var previewUseServerBlueprints, siteUseServerBlueprints;
            var _this = this;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        this.SSRWorkerLog.push('Creating initial blueprint');
                        previewUseServerBlueprints = this.viewMode === GALLERY_CONSTS.viewMode.PREVIEW &&
                            experimentsWrapper.getExperimentBoolean('specs.pro-gallery.useServerBlueprints-preview');
                        siteUseServerBlueprints = this.viewMode !== GALLERY_CONSTS.viewMode.PREVIEW &&
                            experimentsWrapper.getExperimentBoolean('specs.pro-gallery.useServerBlueprints-viewer');
                        this.shouldUseBlueprintsFromServer =
                            siteUseServerBlueprints ||
                            previewUseServerBlueprints ||
                            this.isServerBlueprintsForcedByQuery();
                        this.blueprintsManager = new BlueprintsManager({
                            id: "pgStore " + this.context.compId,
                        });
                        this.generateBlueprintsApi();
                        return [4 /*yield*/ , this.loadInitialItems()];
                    case 1:
                        _a.sent();
                        this.blueprintsManagerReadyDeferred.resolve(); // resolve this after the this.blueprintManager is ready to shoot following blueprints
                        return [2 /*return*/ , Promise.all([
                            this.dimensionsAreAvailableDeferred.promise,
                            this.wixStylesAreAvailableDeferred.promise,
                            this.itemsAreAvailableDeferred.promise,
                            this.viewMode === GALLERY_CONSTS.viewMode.EDIT ?
                            Promise.reject() // we dont want an initial blueprint in the editor. it will be created only after all the params get back from the component, namely the dimensions the user set.
                            :
                            Promise.resolve(),
                        ]).then(function() {
                            return __awaiter(_this, void 0, void 0, function() {
                                return __generator(this, function(_a) {
                                    this.triggerBlueprintCreation(true);
                                    return [2 /*return*/ ];
                                });
                            });
                        }, function() {
                            return __awaiter(_this, void 0, void 0, function() {
                                return __generator(this, function(_a) {
                                    this.setBlueprint({});
                                    return [2 /*return*/ ];
                                });
                            });
                        })];
                }
            });
        });
    };
    ProGalleryStore.prototype.initFlowPromises = function() {
        var _this = this;
        this.blueprintReadyDeferred = new Deferred(); // to be resolved when a blueprint is available
        this.wixCodeBlueprintDeferred = new Deferred(); // to be resolved when wixCodeItems have a ready blueprint - for art-store in albums
        this.blueprintsManagerReadyDeferred = new Deferred(); // to be resolved when BM is ready (and onBlueprintReady is armed)
        this.dimensionsAreAvailableDeferred = new Deferred(); // to be resolved when dimensions are available
        this.wixStylesAreAvailableDeferred = new Deferred(); // to be resolved when styles are available
        this.itemsAreAvailableDeferred = new Deferred(); // to be resolved when items are available
        this.readyToCreateBlueprintsDeferred = new Deferred(); // to be resolved when we can trigger blueprints
        this.directFullscreenReadyDeferred = new Deferred(); // to be resolved when we can trigger blueprints
        this.directFullscreenItemReadyDeferred = new Deferred(); // to be resolved when we can trigger blueprints
        this.directFullscreenBlueprintMockReadyDeferred = new Deferred(); // to be resolved when we can trigger blueprints
        Promise.all([
            this.dimensionsAreAvailableDeferred.promise,
            this.wixStylesAreAvailableDeferred.promise,
            this.itemsAreAvailableDeferred.promise,
            this.blueprintsManagerReadyDeferred.promise,
        ]).then(function() {
            _this.readyToCreateBlueprintsDeferred.resolve(); // this should be resolved after everything is ready to create more blueprints when triggerBlueprintCreation is fired.
        });
        Promise.all([
            this.directFullscreenItemReadyDeferred.promise,
            this.directFullscreenBlueprintMockReadyDeferred.promise,
        ]).then(function() {
            _this.directFullscreenReadyDeferred.resolve(); // this should be resolved after everything is ready to create more blueprints when triggerBlueprintCreation is fired.
        });
    };
    ProGalleryStore.prototype.addDimensionsToCache = function(itemDimensions) {
        var _this = this;
        itemDimensions.forEach(function(dimensions) {
            _this.itemDimensionsCache[dimensions.mediaUrl] = dimensions;
        });
    };
    ProGalleryStore.prototype.addDimensionsFromCache = function(item) {
        var dimensions = this.itemDimensionsCache[item.mediaUrl];
        if (dimensions) {
            return __assign(__assign({}, item), {
                metaData: __assign(__assign({}, item.metaData), {
                    width: dimensions.width,
                    height: dimensions.height
                }),
                measured: true
            });
        }
        return null;
    };
    ProGalleryStore.prototype.handleNewItemDimensions = function(itemDimensions) {
        var _this = this;
        this.addDimensionsToCache(itemDimensions);
        var curItems = this.getItems();
        var setItemDimensions = false;
        var itemsWithDimensions = curItems.map(function(item) {
            if (utils.isDimensionless(item)) {
                var itemWithDimensions = _this.addDimensionsFromCache(item);
                if (!!itemWithDimensions) {
                    item = itemWithDimensions;
                    setItemDimensions = true;
                }
            }
            return item;
        });
        if (setItemDimensions) {
            this.setItems(itemsWithDimensions);
            // Items with added dimensions were already "set" with all needed properties. this is true for server and wixCode items
        }
    };
    ProGalleryStore.prototype.setWixStyles = function(wixStyles) {
        this.wixStyles = wixStyles || this.wixStyles;
        this.wixStylesAreAvailableDeferred.resolve();
    };
    ProGalleryStore.prototype.handleWixStylesChange = function(wixStyles) {
        this.setWixStyles(wixStyles);
        this.recalculateStylesExpensively();
        this.triggerBlueprintCreation({
            settingNewItems: false
        });
    };
    ProGalleryStore.prototype.getMoreItems = function(from) {
        this.blueprintsManager.getMoreItems(from);
    };
    ProGalleryStore.prototype.getMoreItemsFromItemsSource = function(from) {
        return __awaiter(this, void 0, void 0, function() {
            var getMoreItems;
            var _this = this;
            return __generator(this, function(_a) {
                getMoreItems = this.itemsSrc === 'Velo' ?
                    this.getMoreWixCodeItems :
                    this.getMoreItemsFromServer;
                return [2 /*return*/ , getMoreItems(from).then(function(items) {
                    _this.addItems(items);
                })];
            });
        });
    };
    ProGalleryStore.prototype.getMoreWixCodeItems = function(from) {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                return [2 /*return*/ , this.getItemsFromWixCode({
                    from: from,
                    batchSize: this.ITEMS_BATCH_SIZE,
                })];
            });
        });
    };
    ProGalleryStore.prototype.getTotalItemsCount = function() {
        return this.totalItemsCount || 1337;
    };
    ProGalleryStore.prototype.createBlueprintImp = function(args) {
        if (this.shouldUseBlueprintsFromServer) {
            args.deviceType = this.deviceType;
            return this.getBlueprintFromServer(args);
        } else {
            return blueprints.createBlueprint(args);
        }
    };
    ProGalleryStore.prototype.isBlueprintOfCurrentItems = function(blueprint) {
        var _a, _b;
        // make sure no new items were set since the blueprint was requested.
        return ((_a = blueprint === null || blueprint === void 0 ? void 0 : blueprint.items[0]) === null || _a === void 0 ? void 0 : _a.itemId) === ((_b = this.items[0]) === null || _b === void 0 ? void 0 : _b.itemId);
    };
    ProGalleryStore.prototype.setBlueprintIfNeeded = function(blueprint, blueprintChanged) {
        if (blueprintChanged === void 0) {
            blueprintChanged = true;
        }
        if (!blueprint) {
            return;
        }
        this.SSRWorkerLog.push('LOGIC got a blueprint, are there changes from the last one?' +
            ("" + (blueprintChanged ? ' TRUE' : ' FALSE')));
        this.SSRWorkerLog.push(this.isBlueprintOfCurrentItems(blueprint) ?
            'LOGIC blueprint contains current items' :
            'LOGIC blueprint contains older items and will not be set');
        if (blueprintChanged && this.isBlueprintOfCurrentItems(blueprint)) {
            this.setBlueprint(blueprint);
        }
    };
    ProGalleryStore.prototype.generateBlueprintsApi = function() {
        var _this = this;
        var functions = {
            createBlueprintImp: function(args) {
                return _this.createBlueprintImp(args);
            },
            getItems: function() {
                return _this.getItems();
            },
            getMoreItems: function(from) {
                return _this.getMoreItemsFromItemsSource(from).then(function() {
                    return _this.getItems();
                });
            },
            getTotalItemsCount: function() {
                return _this.totalItemsCount;
            },
            getOptions: function() {
                return _this.getPGStyles();
            },
            getContainer: function() {
                return _this.getDimensions();
            },
            onBlueprintReady: this.setBlueprintIfNeeded,
        };
        var wrapperBlueprintsApi = new BlueprintsApi(functions);
        this.blueprintsManager.init({
            api: wrapperBlueprintsApi,
            deviceType: this.deviceType,
        });
    };
    ProGalleryStore.prototype.loadInitialBlueprint = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        this.SSRWorkerLog.push('Fn loadInitialBlueprint');
                        return [4 /*yield*/ , Utils.verifyExperiments(this.scopedGlobalSdkApis)];
                    case 1:
                        _a.sent(); // make sure experiments were requestd and are ready before proceeding
                        this.SSRWorkerLog.push('Experiments are here, can create a blueprint');
                        if (utils.isVerbose()) {
                            console.log('Getting initial blueprint');
                        }
                        try {
                            this.createInitialBlueprint();
                        } catch (e) {
                            console.error('couldnt get blueprint', e);
                        }
                        return [2 /*return*/ ];
                }
            });
        });
    };
    ProGalleryStore.prototype.loadDirectFullscreenItem = function(requestedItemId, requestedgGalleryId) {
        return __awaiter(this, void 0, void 0, function() {
            var item, e_3;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        if (!requestedgGalleryId) return [3 /*break*/ , 2];
                        // if the identifier for this pgid is galleryId, we need to make sure we match it for both platformized and non platformized
                        return [4 /*yield*/ , this.fetcher.fetchGalleryId()];
                    case 1:
                        // if the identifier for this pgid is galleryId, we need to make sure we match it for both platformized and non platformized
                        _a.sent(); // will return immediately if its available or fetch if not
                        if (requestedgGalleryId !== this.fetcher.galleryId) {
                            // no match means we skip the direct fullscreen and resolve its promise here
                            this.directFullscreenReadyDeferred.resolve();
                            return [2 /*return*/ ];
                        }
                        if (!this.isValidUUID(requestedItemId)) {
                            console.error('used requestedItemId is not valid');
                            this.directFullscreenReadyDeferred.resolve();
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/ , this.fetcher.getItemByIdFromServer(requestedItemId)];
                    case 3:
                        item = _a.sent();
                        return [3 /*break*/ , 5];
                    case 4:
                        e_3 = _a.sent();
                        if (utils.isVerbose()) {
                            console.warn('Could not get direct fullscreen from server (could be velo item)', e_3);
                        }
                        item = null;
                        return [3 /*break*/ , 5];
                    case 5:
                        if (item && item.itemId) {
                            if (this.itemsSrc !== 'Velo') {
                                this.prepareAndSetDirectFullscreenItem(item);
                            }
                        } else {
                            if (this.itemsSrc !== 'Velo') {
                                this.directFullscreenReadyDeferred.resolve();
                            }
                            if (utils.isVerbose()) {
                                console.log('Could not fetch direct fullscreen item from server', item, '' + this.directFullscreenItem ?
                                    'The directFullscreen was loaded from wixCode' :
                                    '');
                            }
                        }
                        return [2 /*return*/ ];
                }
            });
        });
    };
    ProGalleryStore.prototype.pageReady = function(setProps) {
        this.setProps = setProps;
    };
    ProGalleryStore.prototype.handleManualStyleParams = function(manualStyleParams) {
        this.setManualStyleParams(manualStyleParams);
        this.recalculateStylesExpensively();
        this.triggerBlueprintCreation({
            settingNewItems: false
        });
    };
    ProGalleryStore.prototype.triggerBlueprintCreation = function(_a) {
        var _this = this;
        var settingNewItems = _a.settingNewItems;
        this.readyToCreateBlueprintsDeferred.promise.then(function() {
            if (settingNewItems === true) {
                _this.blueprintsManager.resetItemLooping();
            }
            _this.blueprintsManager.createBlueprint();
        });
    };
    ProGalleryStore.prototype.setManualStyleParams = function(manualStyleParams) {
        this.manualStyleParams = manualStyleParams;
    };
    ProGalleryStore.prototype.getManualStyleParams = function() {
        return this.manualStyleParams || {};
    };
    ProGalleryStore.prototype.shouldDisableStoreExpandMode = function() {
        if (this.isArtStore && this.fetcher.settings) {
            var _a = this.fetcher.settings,
                freeArtStore = _a.freeArtStore,
                ignoreFullscreen = _a.ignoreFullscreen;
            return !!(freeArtStore && ignoreFullscreen);
        } else {
            return false;
        }
    };
    ProGalleryStore.prototype.isStoreGallery = function() {
        var _a;
        var freeArtStore = (_a = this.fetcher.settings) === null || _a === void 0 ? void 0 : _a.freeArtStore;
        return this.isArtStore && !freeArtStore;
    };
    ProGalleryStore.prototype.getGalleryStyles = function(wixStyleParams) {
        var isMobile = this.isMobile; // never changes
        var isStoreGallery = this.isStoreGallery(); // never changes
        return getProGalleryStyles(wixStyleParams, {
            isMobile: isMobile,
            isStoreGallery: isStoreGallery,
        });
    };
    ProGalleryStore.prototype.getFullscreenStyles = function(wixStyleParams) {
        var isMobile = this.isMobile; // never changes
        var isStoreGallery = this.isStoreGallery(); // never changes
        return parseStyleParams(wixStyleParams, isStoreGallery, isMobile);
    };
    ProGalleryStore.prototype.fixGalleryStyleRatiosInMobile = function() {
        var _a;
        if (this.isMobile &&
            !this.isSSR() &&
            typeof((_a = this.calculatedGalleryStyles) === null || _a === void 0 ? void 0 : _a.gallerySize) === 'number') {
            var _b = this.baseMobileRatioStyles,
                gallerySize = _b.gallerySize,
                imageMargin = _b.imageMargin;
            // compensate for wix's 320px fix for mobile
            var fixRatio = void 0;
            if (this.viewMode === GALLERY_CONSTS.viewMode.PREVIEW) {
                // doesnt change
                fixRatio = 320 / this.getDimensions().mobilePreviewFrame.width; // in preview, the mobile view is simualted in a "mobile device" with width of 320
            } else {
                fixRatio = 320 / this.getDimensions().screen.width;
            }
            this.calculatedGalleryStyles.gallerySize = gallerySize * fixRatio;
            this.calculatedGalleryStyles.imageMargin = imageMargin * fixRatio;
        }
    };
    ProGalleryStore.prototype.recalculateStylesExpensively = function() {
        return __awaiter(this, void 0, void 0, function() {
            var styleParams, pgStyles, galleryStyles, gallerySize, imageMargin, fullscreenStyles;
            return __generator(this, function(_a) {
                styleParams = this.wixStyles;
                if (this.shouldDisableStoreExpandMode()) {
                    // albums free store set itemClick nothing
                    styleParams.numbers.itemClick = 2;
                }
                pgStyles = this.getGalleryStyles(styleParams);
                galleryStyles = mergeNestedObjects(pgStyles, this.getManualStyleParams());
                gallerySize = galleryStyles.gallerySize, imageMargin = galleryStyles.imageMargin;
                this.baseMobileRatioStyles = {
                    gallerySize: gallerySize,
                    imageMargin: imageMargin
                }; // keep a sub copy of thee two for ratio fixes in mobile. refreshed every recalculation(so they dont "get fixed" recursively)
                this.calculatedGalleryStyles = galleryStyles;
                fullscreenStyles = this.getFullscreenStyles(styleParams);
                this.calculatedFullscreenStyles = mergeNestedObjects(fullscreenStyles, this.getManualStyleParams());
                this.fixGalleryStyleRatiosInMobile();
                return [2 /*return*/ ];
            });
        });
    };
    ProGalleryStore.prototype.getPGStyles = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , Utils.verifyExperiments(this.scopedGlobalSdkApis)];
                    case 1:
                        _a.sent(); // make sure experiments were requestd and are ready before proceeding
                        if (!!this.calculatedGalleryStyles) return [3 /*break*/ , 3];
                        return [4 /*yield*/ , this.recalculateStylesExpensively()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        return [2 /*return*/ , this.calculatedGalleryStyles];
                }
            });
        });
    };
    return ProGalleryStore;
}());
export default ProGalleryStore;
//# sourceMappingURL=ProGalleryStore.js.map