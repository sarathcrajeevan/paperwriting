import {
    __awaiter,
    __generator
} from "tslib";
import {
    experimentsWrapper
} from '../sdk/experimentsWrapper';
import {
    baseUtils
} from './baseUtils.js';
var REACTION_TYPES = {
    LOVE: 'love',
};
var REACTION_CODES = {
    NEW_LOVE: 'love',
    OLD_LOVES: 'loveCountFromStats',
};
var ReactionService = /** @class */ (function() {
    function ReactionService() {
        this.getEncodedContextToken = this.getEncodedContextToken.bind(this);
        this.parseReactionServiceResponse = this.parseReactionServiceResponse.bind(this);
    }
    // APIs
    ReactionService.prototype.getItemsLoveData = function(items, instance, baseUrl, galleryId, appDefinitionId) {
        return __awaiter(this, void 0, void 0, function() {
            var encodedContextToken, itemsById, resourceIds, reactionsUrl, res, responses, parsedLovedItems, e_1;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        encodedContextToken = this.getEncodedContextToken(galleryId, appDefinitionId);
                        itemsById = items.map(function(item) {
                            return item.itemId;
                        });
                        resourceIds = itemsById.join('&resourceIds=');
                        reactionsUrl = baseUrl + "/_api/reactions-server/v1/reactions?contextToken=" + encodedContextToken + "&resourceIds=" + resourceIds;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/ , fetch(reactionsUrl, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: instance,
                            },
                        })];
                    case 2:
                        res = _a.sent();
                        if (!(res.status === 200)) return [3 /*break*/ , 4];
                        return [4 /*yield*/ , res.json()];
                    case 3:
                        responses = (_a.sent()).responses;
                        parsedLovedItems = this.parseReactionServiceResponse(responses);
                        return [2 /*return*/ , parsedLovedItems];
                    case 4:
                        baseUtils.isVerbose() &&
                            console.error("Reaction-Service error - GET call response status: " + res.status);
                        return [2 /*return*/ , {
                            error: "Reaction-Service error - GET call response status: " + res.status,
                        }];
                    case 5:
                        return [3 /*break*/ , 7];
                    case 6:
                        e_1 = _a.sent();
                        baseUtils.isVerbose() &&
                            console.error("Reaction-Service error - some error when requesting data from reaction-service: " + e_1.message);
                        return [2 /*return*/ , {
                            error: "Reaction-Service error - some error when requesting data from reaction-service: " + e_1.message,
                        }];
                    case 7:
                        return [2 /*return*/ ];
                }
            });
        });
    };
    ReactionService.prototype.toggleItemLove = function(itemId, method, instance, baseUrl, galleryId, appDefinitionId) {
        return __awaiter(this, void 0, void 0, function() {
            var encodedContextToken, reactionCode, reactionsUrl, res, response, e_2;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        encodedContextToken = this.getEncodedContextToken(galleryId, appDefinitionId);
                        reactionCode = REACTION_CODES.NEW_LOVE;
                        reactionsUrl = baseUrl + "/_api/reactions-server/v1/reactions/" + itemId + "/" + reactionCode + "?contextToken=" + encodedContextToken;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/ , fetch(reactionsUrl, {
                            method: method,
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: instance,
                            },
                        })];
                    case 2:
                        res = _a.sent();
                        if (!(res.status === 200)) return [3 /*break*/ , 4];
                        return [4 /*yield*/ , res.json()];
                    case 3:
                        response = _a.sent();
                        baseUtils.isVerbose() &&
                            console.log("Succeeded " + method + " action of Reactions service for item " + itemId + ". response: " + response);
                        _a.label = 4;
                    case 4:
                        return [3 /*break*/ , 6];
                    case 5:
                        e_2 = _a.sent();
                        baseUtils.isVerbose() &&
                            console.error("Failed " + method + " action of Reactions service for item " + itemId + ". " + e_2);
                        return [2 /*return*/ , {
                            responses: 'some error when requesting from reactions service' +
                                reactionsUrl +
                                e_2.message,
                        }];
                    case 6:
                        return [2 /*return*/ ];
                }
            });
        });
    };
    ReactionService.prototype.mergeDataFromStatsToReactionService = function(itemId, count, instance, baseUrl, galleryId, appDefinitionId) {
        return __awaiter(this, void 0, void 0, function() {
            var encodedContextToken, reactionsUrl, res, response, message, e_3;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        encodedContextToken = this.getEncodedContextToken(galleryId, appDefinitionId);
                        reactionsUrl = baseUrl + "/_api/reactions-server/v1/reactions/" + itemId + "/add-reaction?contextToken=" + encodedContextToken;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4 /*yield*/ , fetch(reactionsUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: instance,
                            },
                            body: JSON.stringify({
                                reaction: {
                                    reactionCode: REACTION_CODES.OLD_LOVES,
                                    reactionParams: {
                                        count: String(count),
                                    },
                                },
                            }),
                        })];
                    case 2:
                        res = _a.sent();
                        if (!(res.status === 200)) return [3 /*break*/ , 4];
                        return [4 /*yield*/ , res.json()];
                    case 3:
                        response = _a.sent();
                        baseUtils.isVerbose() &&
                            console.log("Succeeded to POST old love counts from stats to Reactions service for item " + itemId + ". response: " + response);
                        return [2 /*return*/ , {
                            status: res.status,
                            message: 'success',
                        }];
                    case 4:
                        return [4 /*yield*/ , res.json()];
                    case 5:
                        message = (_a.sent()).message;
                        return [2 /*return*/ , {
                            status: res.status,
                            message: message,
                        }];
                    case 6:
                        return [3 /*break*/ , 8];
                    case 7:
                        e_3 = _a.sent();
                        baseUtils.isVerbose() &&
                            console.error("Failed to POST old love counts from stats to Reactions service for item " + itemId + ". " + e_3);
                        return [2 /*return*/ , {
                            responses: 'some error when requesting from reactions service' +
                                reactionsUrl +
                                e_3.message,
                        }];
                    case 8:
                        return [2 /*return*/ ];
                }
            });
        });
    };
    // Helpers
    ReactionService.prototype.isLovedByCurrentVisitor = function(photoId, visitorId, reactionsServiceResponse) {
        var _a, _b;
        try {
            if (reactionsServiceResponse) {
                var itemReactions = (_b = (_a = reactionsServiceResponse[photoId]) === null || _a === void 0 ? void 0 : _a.identityReactions) === null || _b === void 0 ? void 0 : _b.reactions;
                var index = itemReactions === null || itemReactions === void 0 ? void 0 : itemReactions.findIndex(function(r) {
                    return (r.identity.identityId === visitorId &&
                        r.reaction.reactionCode === REACTION_CODES.NEW_LOVE);
                });
                return index > -1 ? true : false;
            }
        } catch (e) {
            console.warn('isLovedByCurrentVisitor failed', e);
        }
    };
    ReactionService.prototype.parseReactionServiceResponse = function(reactionsServiceResponse) {
        var _a;
        try {
            var parsedLovedItems_1 = {};
            var _loop_1 = function(itemId, value) {
                parsedLovedItems_1[itemId] = 0;
                var reactions = (_a = value.identityReactions) === null || _a === void 0 ? void 0 : _a.reactions;
                var isFirstOldLovesVisited = false;
                // eslint-disable-next-line no-loop-func
                reactions.forEach(function(r) {
                    var _a, _b, _c;
                    switch ((_a = r.reaction) === null || _a === void 0 ? void 0 : _a.reactionCode) {
                        case REACTION_CODES.OLD_LOVES:
                            {
                                if (!isFirstOldLovesVisited) {
                                    parsedLovedItems_1[itemId] += Number((_c = (_b = r.reaction) === null || _b === void 0 ? void 0 : _b.reactionParams) === null || _c === void 0 ? void 0 : _c.count);
                                    isFirstOldLovesVisited = true;
                                }
                                break;
                            }
                        case REACTION_CODES.NEW_LOVE:
                            {
                                parsedLovedItems_1[itemId] += 1;
                                break;
                            }
                        default:
                            break;
                    }
                });
            };
            for (var _i = 0, _b = Object.entries(reactionsServiceResponse); _i < _b.length; _i++) {
                var _c = _b[_i],
                    itemId = _c[0],
                    value = _c[1];
                _loop_1(itemId, value);
            }
            return parsedLovedItems_1;
        } catch (e) {
            baseUtils.isVerbose() &&
                console.error("Reaction-Service error - problem with parsing response: " + e.message);
            return {
                error: "Reaction-Service error - problem with parsing response: " + e.message,
            };
        }
    };
    ReactionService.prototype.shouldUseReactionService = function() {
        // 'useReactionService' responsible to decide from which source to display the love data --> from Reaction-Service or from the old stats API
        return experimentsWrapper.getExperimentBoolean('specs.pro-gallery.useReactionService');
    };
    ReactionService.prototype.getEncodedContextToken = function(galleryId, appDefinitionId) {
        // Used in Reaction-Service APIs
        var contextToken = {
            authorizerAppDefId: appDefinitionId,
            contextId: galleryId,
            contextType: REACTION_TYPES.LOVE,
        };
        var encodedContextToken = encodeURIComponent(JSON.stringify(contextToken));
        return encodedContextToken;
    };
    // Sample migration
    ReactionService.prototype.sampleMigrationSuccessRate = function(loveCountsReactionService, loveCountsStatsApi, sentryReportCallback) {
        /* We are sampling 1 item from the gallery, and checking if the counts in the reaction-service response is equal to the stats response.
          We allow a margin error of +-2 loves. For example:
          Migration succeeded: item "A" have 12 loves in the reaction-service and 10 in stats.
          Migration failed: item "A" have 5 loves in the reaction-service and 9 in stats.
        */
        var marginError = 2;
        var getRandomInt = function(max) {
            return Math.floor(Math.random() * Math.floor(max));
        };
        try {
            if (Object.keys(loveCountsReactionService).length > 0 &&
                Object.keys(loveCountsStatsApi).length > 0) {
                // Choose an item randomly
                var loveCountsReactionServiceLength = Object.keys(loveCountsReactionService).length;
                var randomIndexToSample = getRandomInt(loveCountsReactionServiceLength);
                // Chosen sample item
                var itemId = Object.keys(loveCountsReactionService)[randomIndexToSample];
                var itemReactionServiceLoveCounts = loveCountsReactionService[itemId];
                var itemStatsLoveCounts = (loveCountsStatsApi.hasOwnProperty(itemId) &&
                        loveCountsStatsApi[itemId]) ||
                    null;
                // if item exists in loveCountsReactionService but not in loveCountsStatsApi
                if (loveCountsStatsApi.hasOwnProperty(itemId)) {
                    if (itemReactionServiceLoveCounts <=
                        itemStatsLoveCounts + marginError &&
                        itemReactionServiceLoveCounts >= itemStatsLoveCounts - marginError) {
                        typeof sentryReportCallback === 'function' &&
                            sentryReportCallback("Reaction-Service Migration 3rd try - Sample is successful");
                    } else {
                        typeof sentryReportCallback === 'function' &&
                            sentryReportCallback("Reaction-Service Migration 3rd try - Sample is failure");
                    }
                } else {
                    typeof sentryReportCallback === 'function' &&
                        sentryReportCallback("Reaction-Service Migration 3rd try - Item doesnt exist in stats response");
                }
            } else {
                typeof sentryReportCallback === 'function' &&
                    sentryReportCallback("Reaction-Service Migration 3rd try - reactionService and stats responses are empty");
            }
        } catch (e) {
            typeof sentryReportCallback === 'function' &&
                sentryReportCallback("Reaction-Service Migration 3rd try - Error in sampleMigrationSuccessRate");
        }
    };
    return ReactionService;
}());
export default ReactionService;
var reactionService = new ReactionService();
export {
    reactionService
};
//# sourceMappingURL=reactionService.js.map