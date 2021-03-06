import {
    __awaiter,
    __generator
} from "tslib";
import {
    experimentsWrapper
} from '@wix/photography-client-lib';
import {
    utils
} from '../utils/workerUtils';
var REACTION_TYPES = {
    LOVE: 'love',
};
/*
  README: There is a similar file in photography-client-lib that is being used by the "component" part.
  This file is used in the Worker part only.
*/
var ReactionServiceManager = /** @class */ (function() {
    function ReactionServiceManager() {
        this.getEncodedContextToken = this.getEncodedContextToken.bind(this);
    }
    // APIs
    ReactionServiceManager.prototype.getItemsLoveData = function(items, instance, baseUrl, galleryId, appDefinitionId, sentryReportCallback) {
        return __awaiter(this, void 0, void 0, function() {
            var encodedContextToken, itemsById, resourceIds, reactionsUrl, res, responses, error, e_1, error;
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
                        return [2 /*return*/ , responses]; // 'responses' is the raw response -> parsing it will happen in the client-lib (component part)
                    case 4:
                        error = "Reaction-Service error - Worker - GET call response status: " + res.status;
                        utils.isVerbose() && console.error(error);
                        sentryReportCallback(error);
                        return [2 /*return*/ , {
                            error: error,
                        }];
                    case 5:
                        return [3 /*break*/ , 7];
                    case 6:
                        e_1 = _a.sent();
                        error = "Reaction-Service error - Worker - some error when requesting data from reaction-service: " + e_1.message;
                        sentryReportCallback(error);
                        utils.isVerbose() && console.error(error);
                        return [2 /*return*/ , {
                            error: error,
                        }];
                    case 7:
                        return [2 /*return*/ ];
                }
            });
        });
    };
    // Helpers
    ReactionServiceManager.prototype.shouldUseReactionService = function() {
        // 'useReactionService' responsible to decide from which source to display the love data --> from Reaction-Service or from the old stats API
        return experimentsWrapper.getExperimentBoolean('specs.pro-gallery.useReactionService');
    };
    ReactionServiceManager.prototype.getEncodedContextToken = function(galleryId, appDefinitionId) {
        // Used in Reaction-Service APIs
        var contextToken = {
            authorizerAppDefId: appDefinitionId,
            contextId: galleryId,
            contextType: REACTION_TYPES.LOVE,
        };
        var encodedContextToken = encodeURIComponent(JSON.stringify(contextToken));
        return encodedContextToken;
    };
    return ReactionServiceManager;
}());
export default ReactionServiceManager;
var reactionServiceManager = new ReactionServiceManager();
export {
    reactionServiceManager
};
//# sourceMappingURL=reactionServiceManager.js.map