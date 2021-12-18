import {
    __awaiter,
    __generator
} from "tslib";
import _ from 'lodash';
import {
    baseUtils
} from '../utils/baseUtils.js';
import Wix from '../sdk/WixSdkWrapper';
import translationUtils from '../utils/translationUtils';
import window from '../sdk/windowWrapper';
import {
    reactionService
} from '../utils/reactionService';
var ItemActions = /** @class */ (function() {
    function ItemActions() {
        this.getLoveCount = this.getLoveCount.bind(this);
        this.wasInit = false;
        this.loveCounts = {};
        this.fetchSiteInfo();
    }
    ItemActions.prototype.initWidgetData = function(config) {
        this.config = config;
        if (config.instance) {
            this.instance = config.instance; // Will be use only in OOI
        }
        if (config.items) {
            this.items = config.items; // Will be use only in OOI
        }
        if (config.visitorId) {
            this.visitorId = config.visitorId; // Will be use only in OOI
        }
        if (config.appDefinitionId) {
            this.appDefinitionId = config.appDefinitionId; // Will be use only in OOI
        }
        if (config.sentryReport) {
            this.sentryReport = config.sentryReport; // Will be use only in OOI
        }
        if (config.reportMigratedLoveDataBiEvent) {
            this.reportMigratedLoveDataBiEvent = config.reportMigratedLoveDataBiEvent; // Will be use only in OOI
        }
        if (config.compId) {
            this.compId = config.compId;
        }
        if (config.pageId) {
            this.pageId = config.pageId;
        }
        if (config.styleId) {
            this.styleId = config.styleId;
        }
        if (config.pageUrl) {
            this.pageUrl = config.pageUrl;
        }
        if (typeof config.isStoreGallery === 'boolean') {
            this.isStoreGallery = config.isStoreGallery;
        }
        if (typeof config.shouldUseGalleryIdForShareUrl === 'boolean') {
            this.shouldUseGalleryIdForShareUrl = config.shouldUseGalleryIdForShareUrl;
        }
        if (config.galleryId) {
            this.galleryId = config.galleryId;
        }
        if (config.viewMode) {
            this.viewMode = config.viewMode.toLowerCase();
        }
        if (config.fullscreenUrl) {
            this.siteUrl = this.fullscreenUrl = this.normalizeFullscreenUrl(config.fullscreenUrl);
            try {
                this.siteUrl = this.fullscreenUrl.match(/.*\..*\//g)[0];
            } catch (e) {
                //
            }
        }
        if (config.onLoveCountsFetched) {
            this.onLoveCountsFetched = config.onLoveCountsFetched;
        }
        this.baseUrl = config.baseUrl || '//progallery.wixapps.net';
        if (config.reachLevel) {
            this.setReachLevel(config.reachLevel);
        }
        if (!baseUtils.isSSR() &&
            this.viewMode === 'site' &&
            this.galleryId &&
            this.galleryId !== '') {
            this.getStats();
        }
        this.wasInit = config;
        return Date.now();
    };
    ItemActions.prototype.setItemsLoveData = function(config) {
        var itemsLoveData = config.itemsLoveData;
        if (itemsLoveData) {
            this.reactionsServiceResponse = itemsLoveData; // 'this.reactionsServiceResponse' used in isLovedByCurrentVisitor()
            var parsedLovedItems = reactionService.parseReactionServiceResponse(itemsLoveData);
            this.onLoveCountsFetched(parsedLovedItems); // Update gallery
        }
    };
    /**
     * Sometimes we may get a full screen url with some additional parameters (like we get right after the user logs in. We need to remove them)
     */
    ItemActions.prototype.normalizeFullscreenUrl = function(fullscreenUrl) {
        var querylessUrl = fullscreenUrl;
        if (fullscreenUrl) {
            querylessUrl = fullscreenUrl.split('?')[0];
        }
        return querylessUrl;
    };
    ItemActions.prototype.fetchSiteInfo = function() {
        var _this = this;
        var href;
        try {
            href = window.location.href;
        } catch (e) {
            href = '';
        }
        if (baseUtils.isInWix()) {
            this.siteInfo = {};
            Wix.getSiteInfo(function(res) {
                _this.siteInfo = res;
            });
        } else {
            this.siteInfo = {
                url: href,
                baseUrl: href,
                siteTitle: 'Wix Pro Gallery',
                siteDescription: 'The best gallery any Wix user has ever seen!',
                siteKeywords: 'gallery,photos,photographer,professional',
            };
        }
    };
    ItemActions.prototype.getSiteUrl = function() {
        return this.siteInfo.url;
    };
    ItemActions.prototype.getStats = function() {
        return __awaiter(this, void 0, void 0, function() {
            var _this = this;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        if (this.viewMode !== 'site' || baseUtils.isDev() || baseUtils.isTest()) {
                            return [2 /*return*/ ];
                        }
                        if (!this.galleryId ||
                            this.galleryId === '' ||
                            this.galleryId.length < 10) {
                            console.log('galleryId id', this.galleryId, typeof this.galleryId);
                            console.error('get stats error - no galleryId');
                            return [2 /*return*/ ];
                        }
                        fetch(this.baseUrl + "/_api/pro-gallery-webapp/v1/gallery/" + this.galleryId + "/stats/properties")
                            .then(function(res) {
                                return res.json();
                            })
                            .then(function(res) {
                                try {
                                    if (res.properties) {
                                        _this.statsProps = JSON.parse(res.properties);
                                    } else if (res.statsToken) {
                                        // hack for art-store in albums (no res.properties)
                                        _this.statsProps = {
                                            instance_id: _this.config.instanceId,
                                            set_id: _this.galleryId,
                                        };
                                    }
                                    _this.statsToken = res.statsToken;
                                } catch (e) {
                                    console.error('Failed getting stats props', e);
                                }
                            });
                        // Love data migration process
                        return [4 /*yield*/ , this.migrateLoveDataFromStatsToReactionService()];
                    case 1:
                        // Love data migration process
                        _a.sent();
                        // Get love data from Reaction-Service
                        if (reactionService.shouldUseReactionService()) {
                            /*
                              The action of getItemsLoveData is no longer occuring within the client-lib ->
                              The GET call is occuring in 'BlueprintsProGalleryStore',
                              and eventually it triggers 'setItemsLoveData()' which in this file
                            */
                        } else {
                            // Use old 'loved items' API
                            this.getLoveDataWithOriginalFunction();
                        }
                        return [2 /*return*/ ];
                }
            });
        });
    };
    ItemActions.prototype.migrateLoveDataFromStatsToReactionService = function() {
        return __awaiter(this, void 0, void 0, function() {
            var loveCountsReactionService, error, loveCountsStatsApi, loveCountsStatsApi_1, mergedItemsPromises, _i, _a, _b, photoId, count, mergedItemsReponses, index, error, error, e_1, error;
            return __generator(this, function(_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 7, , 8]);
                        return [4 /*yield*/ , reactionService.getItemsLoveData(this.items, this.instance, this.baseUrl, this.galleryId, this.appDefinitionId)];
                    case 1:
                        loveCountsReactionService = _c.sent();
                        if (loveCountsReactionService.hasOwnProperty('error')) {
                            if (typeof this.sentryReport === 'function') {
                                error = loveCountsReactionService.error;
                                this.sentryReport(error);
                            }
                            return [2 /*return*/ ];
                        }
                        return [4 /*yield*/ , this.getLoveDataUsingStatsApi()];
                    case 2:
                        loveCountsStatsApi = _c.sent();
                        reactionService.sampleMigrationSuccessRate(loveCountsReactionService, loveCountsStatsApi, this.sentryReport);
                        if (!(Object.keys(loveCountsReactionService).length === 0)) return [3 /*break*/ , 6];
                        return [4 /*yield*/ , this.getLoveDataUsingStatsApi()];
                    case 3:
                        loveCountsStatsApi_1 = _c.sent();
                        if (!(Object.keys(loveCountsStatsApi_1).length > 0)) return [3 /*break*/ , 6];
                        // 3 - BI event - report Migration Started
                        if (typeof this.reportMigratedLoveDataBiEvent === 'function') {
                            this.reportMigratedLoveDataBiEvent({
                                galleryId: this.galleryId,
                                migrationStatus: 'start',
                            });
                        }
                        mergedItemsPromises = [];
                        for (_i = 0, _a = Object.entries(loveCountsStatsApi_1); _i < _a.length; _i++) {
                            _b = _a[_i], photoId = _b[0], count = _b[1];
                            mergedItemsPromises.push(reactionService.mergeDataFromStatsToReactionService(photoId, count, this.instance, this.baseUrl, this.galleryId, this.appDefinitionId));
                        }
                        return [4 /*yield*/ , Promise.all(mergedItemsPromises)];
                    case 4:
                        mergedItemsReponses = _c.sent();
                        return [4 /*yield*/ , reactionService.getItemsLoveData(this.items, this.instance, this.baseUrl, this.galleryId, this.appDefinitionId)];
                    case 5:
                        // 5 - Fetch again the data from the new Reaction service (now it will have the data from the old API)
                        loveCountsReactionService = _c.sent();
                        // IMPORTANT - the response contains only the first batch of items (50 items)
                        // So we'll check if all the items in this response are contained in loveCountsStatsApi (and not check for full equality)
                        // --> It will be a sample (midgam) of the first 50 items
                        // 6 Sentry report - Migration error
                        if (!baseUtils.isSubset(loveCountsStatsApi_1, loveCountsReactionService)) {
                            if (typeof this.sentryReport === 'function') {
                                index = mergedItemsReponses.findIndex(function(res) {
                                    return res.status.toString() !== '200';
                                });
                                if (index > -1) {
                                    error = "Reaction-Service error - migrating data failed - " + mergedItemsReponses[index].status + " : " + mergedItemsReponses[index].message;
                                    this.sentryReport(error);
                                } else {
                                    error = "Reaction-Service error - loveCountsReactionService !== loveCountsStatsApi";
                                    this.sentryReport(error);
                                }
                            }
                        } else {
                            // 7 Report BI event - Successfully migrated gallery
                            if (typeof this.reportMigratedLoveDataBiEvent === 'function') {
                                this.reportMigratedLoveDataBiEvent({
                                    galleryId: this.galleryId,
                                    migrationStatus: 'success',
                                });
                            }
                        }
                        _c.label = 6;
                    case 6:
                        return [3 /*break*/ , 8];
                    case 7:
                        e_1 = _c.sent();
                        if (typeof this.sentryReport === 'function') {
                            error = "Reaction-Service error - Migration general error";
                            this.sentryReport(error);
                        }
                        return [3 /*break*/ , 8];
                    case 8:
                        return [2 /*return*/ ];
                }
            });
        });
    };
    ItemActions.prototype.getLoveDataUsingStatsApi = function() {
        return __awaiter(this, void 0, void 0, function() {
            var instanceId, res, e_2;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        instanceId = '';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        instanceId = this.config.instanceId || window.instanceId;
                        if (!!instanceId) return [3 /*break*/ , 2];
                        console.warn('cannot report love counter - no instance id');
                        return [2 /*return*/ ];
                    case 2:
                        return [4 /*yield*/ , fetch(this.baseUrl + "/_api/pro-gallery-webapp/v1/gallery/" + this.galleryId + "/" + instanceId + "/stats")];
                    case 3:
                        res = _a.sent();
                        return [4 /*yield*/ , res.json()];
                    case 4:
                        res = _a.sent();
                        if (res && res.photoId2Love) {
                            return [2 /*return*/ , res.photoId2Love];
                        } else {
                            return [2 /*return*/ ];
                        }
                        _a.label = 5;
                    case 5:
                        return [3 /*break*/ , 7];
                    case 6:
                        e_2 = _a.sent();
                        console.error('Failed getting love counts', e_2);
                        return [3 /*break*/ , 7];
                    case 7:
                        return [2 /*return*/ ];
                }
            });
        });
    };
    ItemActions.prototype.getLoveDataWithOriginalFunction = function() {
        var _this = this;
        // Original function of getting love counts using the old API - stats
        var instanceId;
        try {
            instanceId = this.config.instanceId || window.instanceId;
        } catch (e) {
            instanceId = '';
        }
        if (!instanceId) {
            console.warn('cannot report love counter - no instance id');
        } else {
            fetch(this.baseUrl + "/_api/pro-gallery-webapp/v1/gallery/" + this.galleryId + "/" + instanceId + "/stats")
                .then(function(res) {
                    return res.json();
                })
                .then(function(res) {
                    try {
                        if (res && res.photoId2Love) {
                            _this.loveCounts = res.photoId2Love;
                            if (_this.onLoveCountsFetched) {
                                _this.onLoveCountsFetched(_this.loveCounts);
                            }
                        }
                    } catch (e) {
                        console.error('Failed getting love counts', e);
                    }
                });
        }
    };
    ItemActions.prototype.getLoveCount = function(photoId) {
        return Math.max(0, this.loveCounts[photoId]) || 0;
    };
    ItemActions.prototype.html2img = function(itemDto, callback) {
        import ( /* webpackChunkName: "html2canvas" */ 'html2canvas').then(function(html2canvas) {
            try {
                var div_1 = window.document.createElement('div');
                div_1.innerHTML = itemDto.html;
                div_1.style.boxSizing = 'border-box';
                div_1.style.background = itemDto.style.bgColor;
                div_1.style.position = 'absolute';
                div_1.style.top = 0;
                div_1.style.left = 0;
                div_1.style.zIndex = -1;
                div_1.className = 'text-item';
                window.document.body.appendChild(div_1);
                html2canvas(div_1).then(function(canvas) {
                    div_1.remove();
                    var url = canvas.toDataURL();
                    if (typeof callback === 'function') {
                        callback(url);
                    }
                });
            } catch (e) {
                if (typeof callback === 'function') {
                    callback('');
                }
            }
        });
    };
    ItemActions.prototype.share = function(type, itemDto, numOfItems) {
        if (baseUtils.isDemo()) {
            return;
        }
        if (numOfItems) {
            // itemDto.numOfItems is not extensible because it is being passed in props.
            itemDto.numOfItems = numOfItems;
        }
        this.shareImp(type, itemDto);
    };
    ItemActions.prototype.downloadTextItem = function(itemDto) {
        this.html2img(itemDto, function(url) {
            try {
                url = url.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
                window.open(url);
            } catch (e) {
                //
            }
        });
    };
    ItemActions.prototype.getReachLevel = function(increment) {
        var inc = Number(increment || 0);
        var rl;
        if (_.isUndefined(this.reachLevel)) {
            var ls = baseUtils.getLocalStorage();
            rl = Number(ls[this.siteUrl + "|reach-level"] || 0) + inc;
        } else {
            rl = this.reachLevel + inc;
        }
        return rl;
    };
    ItemActions.prototype.setReachLevel = function(rl) {
        if (!(rl > 0)) {
            rl = 0;
        }
        try {
            var origRl = this.getReachLevel(0); // if this user already registered a reach-level for this site (already saw it) don't register again
            if (rl > 0 && origRl === 0 && _.isUndefined(this.reachLevel)) {
                var ls = baseUtils.getLocalStorage();
                ls[this.siteUrl + "|reach-level"] = rl;
                this.reachLevel = rl;
            }
        } catch (e) {
            console.warn('set reach level error', e);
        }
    };
    ItemActions.prototype.getShareUrl = function(item) {
        var galleryIdentifier = this.shouldUseGalleryIdForShareUrl ? (this.galleryId + '_') : (this.compId.replace('comp-', '') +
            '-');
        return (this.pageUrl +
            '?pgid=' +
            galleryIdentifier +
            this.getItemId(item));
    };
    ItemActions.prototype.getItemId = function(item) {
        return item.id || item.photoId || item.itemId;
    };
    ItemActions.prototype.shareImp = function(type, itemDto, callback) {
        function openWindow(url, source) {
            try {
                if (baseUtils.isiOS() && source === 'Email') {
                    window.location.href = url;
                } else {
                    var windowRef_1 = window.open(url, source + ' Share', 'height=640,width=960,toolbar=no,menubar=no,scrollbars=no,location=no,status=no');
                    setTimeout(
                        // When the mailto url opens. In some configurations the new window redirects to the configured mail client (e.g. gmail).
                        // In other instances a desktop client is opened (e.g. Outlook) and the new window is blank. This tests for that situation and closes the window if it happens.
                        function() {
                            try {
                                if (source === 'Email' &&
                                    windowRef_1.location.hasOwnProperty('pathname') &&
                                    windowRef_1.location.pathname === 'blank') {
                                    windowRef_1.close();
                                }
                            } catch (e) {
                                console.warn('Could not close mailto window');
                            }
                        }, 5000);
                }
            } catch (e) {
                //
            }
        }

        function copyToClipboard(str) {
            // proudly copy and pasted from pg-core, which proudly copy and pasted from https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
            var el = document.createElement('textarea');
            el.value = str;
            el.setAttribute('readonly', '');
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            document.body.appendChild(el);
            var selected = document.getSelection().rangeCount > 0 ?
                document.getSelection().getRangeAt(0) :
                false;
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            if (selected) {
                document.getSelection().removeAllRanges();
                document.getSelection().addRange(selected);
            }
        }
        var item = {
            id: this.getItemId(itemDto),
            idx: itemDto.idx || 0,
            url: itemDto.createUrl && itemDto.createUrl('sample', 'img'),
            title: itemDto.title || itemDto.description || this.siteInfo.siteTitle,
            hashtag: itemDto.hashtag,
        };
        var shareUrl = encodeURIComponent(this.getShareUrl(item));
        var shareTitle = encodeURIComponent(item.title || '');
        var shareImageUrl = encodeURIComponent(item.url);
        var shareKeywords = encodeURIComponent(this.siteInfo.siteKeywords);
        var shareMessage = encodeURIComponent("" + this.getShareUrl(item));
        if (!_.isFunction(callback)) {
            callback = openWindow;
        }
        switch (type) {
            case 'facebook':
                callback('http://www.facebook.com/sharer/sharer.php?u=' +
                    shareUrl +
                    '&t=' +
                    shareTitle, 'Facebook');
                break;
            case 'twitter':
                {
                    var twitterMaxLength = 110;
                    var shareUrlExtraData = '&amp;text=' + (shareTitle === 'undefined' ? '' : shareTitle);
                    if (shareUrlExtraData.length > twitterMaxLength) {
                        shareUrlExtraData =
                            shareUrlExtraData.slice(0, twitterMaxLength - 3) + '...';
                    } else {
                        var shareKeywordsUrlComponent = '&amp;hashtags=' + shareKeywords;
                        if ((shareUrlExtraData + shareKeywordsUrlComponent).length <=
                            twitterMaxLength) {
                            shareUrlExtraData += shareKeywordsUrlComponent;
                        }
                    }
                    callback('https://twitter.com/intent/tweet?url=' +
                        shareUrl +
                        shareUrlExtraData, 'Twitter');
                    break;
                }
            case 'pinterest':
                callback('https://pinterest.com/pin/create/button/?url=' +
                    shareUrl +
                    '&media=' +
                    shareImageUrl.replace('webp', 'jpg') +
                    '&description=' +
                    shareTitle, 'Pinterest');
                break;
            case 'google':
                callback('https://plus.google.com/share?url=' + shareUrl, 'Google Plus');
                break;
            case 'tumblr':
                callback('http://www.tumblr.com/share/link?url=' + shareUrl, 'Tumblr');
                break;
            case 'email':
                callback('mailto:?Subject=' + shareTitle + '&body=' + shareMessage, 'Email');
                break;
            case 'copylink':
                var url = this.getShareUrl(item);
                copyToClipboard(url);
                break;
            default:
                break;
        }
    };
    ItemActions.prototype.reportLoveToStats = function(photoId, value) {
        try {
            if (!this.statsProps || !this.statsProps.instance_id) {
                this.getStats();
                return;
            }
            var statsProps = _.merge(this.statsProps, {
                photo_id: photoId,
            });
            var statsToken = this.statsToken || window.statsToken;
            var uniqueUUID = baseUtils.generateUUID();
            fetch(window.location.protocol +
                '//photographers-counters.wix.com/collector/rest/collect-js?ctToken=' +
                statsToken, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        messageId: uniqueUUID,
                        metrics: [{
                            type: 'photo',
                            reportMetrics: [{
                                name: 'love',
                                value: String(value),
                            }, ],
                            properties: statsProps,
                        }, ],
                    }),
                }).then(function(data) {
                console.log('Success report love', data);
            });
        } catch (e) {
            console.error('Error reporting love to stats', e);
        }
    };
    ItemActions.prototype.getLoveStorageKey = function(photoId) {
        return 'pro-gallery-item-love-' + photoId;
    };
    ItemActions.prototype.isLoved = function(photoId) {
        if (reactionService.shouldUseReactionService()) {
            var retVal = reactionService.isLovedByCurrentVisitor(photoId, this.visitorId, this.reactionsServiceResponse);
            // Although using the new Reaction-service to display the data,
            // We still need to check the local storage to see if the visitor already loved the photo (back when we used the old process)
            var isLovedFromLocalStorage = baseUtils.getLocalStorage()[this.getLoveStorageKey(photoId)];
            return retVal || isLovedFromLocalStorage;
        } else {
            try {
                if (typeof baseUtils.getLocalStorage() === 'undefined') {
                    return false;
                }
                return (!!baseUtils.getLocalStorage()[this.getLoveStorageKey(photoId)] ||
                    false);
            } catch (e) {
                console.warn('isLoved failed', e);
            }
        }
    };
    ItemActions.prototype.toggleLove = function(photoId, forceVal) {
        // Update item love count with new the Reaction-Service
        try {
            var isItemLoved = this.isLoved(photoId);
            var method = isItemLoved ? 'DELETE' : 'PUT';
            reactionService.toggleItemLove(photoId, method, this.instance, this.baseUrl, this.galleryId, this.appDefinitionId);
        } catch (e) {
            baseUtils.isVerbose() &&
                console.warn('Reaction service toggleLove failed', e);
            if (typeof this.sentryReport === 'function') {
                var error = "Reaction Service error - couldn't toggle love data in gallery: " + this.galleryId + " item: " + photoId;
                this.sentryReport(error);
            }
        }
        /* Update item love count with the old stats API
          We still write love counts to the old API (to maintain backward compatibility if we turn off the experiment)
          TODO: This process can be removed when we're sure that the Reaction-Service process is working as expected
        */
        try {
            if (!baseUtils.getLocalStorage()) {
                return false;
            }
            var inc = void 0;
            if ((this.isLoved(photoId) && forceVal !== true) || forceVal === false) {
                // unlove
                baseUtils.getLocalStorage()[this.getLoveStorageKey(photoId)] = '';
                inc = -1;
            } else {
                // love
                baseUtils.getLocalStorage()[this.getLoveStorageKey(photoId)] = true;
                inc = 1;
            }
            this.reportLoveToStats(photoId, inc);
        } catch (e) {
            console.warn('toggleLove failed', e);
        }
    };
    ItemActions.prototype.isFirstLoveClick = function(photoId) {
        try {
            return (baseUtils.getLocalStorage()[this.getLoveStorageKey(photoId)] ===
                undefined);
        } catch (e) {
            console.warn('isFirstLoveClick failed', e);
        }
    };
    ItemActions.prototype.postLoveActivity = function(item) {
        var postSocialTrackActivity = function(data) {
            try {
                var activity = {
                    type: Wix.Activities.Type.SOCIAL_TRACK,
                    info: {
                        type: data.activityType,
                        channel: data.activityNetwork,
                        itemInfo: {
                            itemUrl: data.url,
                            itemId: data.id,
                            itemType: data.type.toUpperCase(),
                        },
                    },
                    details: {
                        additionalInfoUrl: data.url,
                        summary: '',
                    },
                    contactUpdate: null,
                };
                var onSuccess = function(d) {
                    console.log('Activity ID: ' + d.activityId + ', Contact ID: ' + d.contactId);
                };
                var onFailure = function(d) {
                    console.log('Failure message:', d);
                };
                Wix.Activities.postActivity(activity, onSuccess, onFailure);
            } catch (e) {
                console.log('error posting activity.', e);
            }
        };
        var itemId = this.getItemId(item);
        if (this.isFirstLoveClick(itemId)) {
            postSocialTrackActivity({
                activityType: 'LOVE',
                activityNetwork: 'SITE',
                id: itemId,
                url: this.getShareUrl(item),
                type: item.type,
            });
        }
    };
    ItemActions.prototype.showTooltip = function(e, key, pos) {
        if (document.getElementsByClassName('pro-tooltip').length >= 1) {
            return;
        }
        var target = e.currentTarget;
        if (!target) {
            return;
        }
        var offset = target.getBoundingClientRect();
        var top = offset.top;
        var left = offset.left;
        var css;
        var innerWidth;
        try {
            innerWidth = window.innerWidth;
        } catch (exception) {
            innerWidth = 980;
        }
        if (typeof pos === 'undefined') {
            pos = left > innerWidth / 2 ? 'right' : 'left';
        }
        switch (pos) {
            case 'top':
                css = {
                    top: top - 30 + 'px',
                    left: left + 28 + 'px',
                    opacity: 1,
                };
                break;
            case 'right':
                css = {
                    top: top - 4 + 'px',
                    left: left - 20 + 'px',
                    opacity: 1,
                };
                break;
            default:
            case 'left':
                css = {
                    top: top - 4 + 'px',
                    left: left + 40 + 'px',
                    opacity: 1,
                };
                break;
        }
        css['pointer-events'] = 'none';
        var div = window.document.createElement('div');
        div.classList.add('pro-tooltip');
        div.classList.add(pos);
        Object.assign(div.style, css);
        div.innerHTML = translationUtils.getByKey(key);
        window.document.body.appendChild(div);
    };
    ItemActions.prototype.hideTooltip = function() {
        window.document.body.removeChild(document.getElementsByClassName('pro-tooltip')[0]);
    };
    ItemActions.prototype.toggleTooltip = function(e, key, pos) {
        var hasTooltip = document.getElementsByClassName('pro-tooltip').length === 1;
        if (hasTooltip) {
            this.hideTooltip();
        } else {
            this.showTooltip(e, key, pos);
        }
    };
    ItemActions.prototype.viewClassName = function(layout, device) {
        if (layout === 'fullscreen') {
            return device === 'desktop' ? 'fullscreen-icon' : '';
        } else {
            return '';
        }
    };
    return ItemActions;
}());
export default ItemActions;
export var itemActions = new ItemActions();
//# sourceMappingURL=itemActions.js.map