import {
    __assign,
    __awaiter,
    __generator,
    __rest
} from "tslib";
/* eslint-disable no-debugger */
import window from '../sdk/windowWrapper';
import Consts from '../utils/consts';
var AppSettings = /** @class */ (function() {
    function AppSettings(compId, instance, viewMode, baseUrl) {
        if (compId === void 0) {
            compId = undefined;
        }
        if (instance === void 0) {
            instance = undefined;
        }
        if (viewMode === void 0) {
            viewMode = undefined;
        }
        if (baseUrl === void 0) {
            baseUrl = undefined;
        }
        this.compId = compId;
        this.instance = instance;
        this.getCompId = this.getCompId.bind(this);
        this.getInstance = this.getInstance.bind(this);
        this.viewMode = viewMode;
        this.baseUrl = baseUrl || '';
    }
    AppSettings.prototype.getCompId = function() {
        if (this.compId) {
            return this.compId;
        }
        return window.Wix.Utils.getOrigCompId() ?
            window.Wix.Utils.getOrigCompId() :
            window.Wix.Utils.getCompId();
    };
    AppSettings.prototype.isLiveSite = function() {
        return this.viewMode && this.viewMode.toLowerCase() === 'site';
    };
    AppSettings.prototype.isPreview = function() {
        return this.viewMode && this.viewMode.toLowerCase() === 'preview';
    };
    AppSettings.prototype.getInstance = function() {
        return this.instance ? this.instance : window.instance;
    };
    AppSettings.prototype.get = function(state, key) {
        return __awaiter(this, void 0, void 0, function() {
            var host, response;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        host = 'VIEWER';
                        return [4 /*yield*/ , fetch(this.baseUrl + "/_api/app-settings-service/v1/settings/components/" + this.getCompId() + "?state=" + state + "&host=" + host, {
                            method: 'GET',
                            headers: {
                                Authorization: this.getInstance(),
                                Accept: 'application/json, text/plain, */*',
                            },
                        }).then(function(res) {
                            return res.json();
                        })];
                    case 1:
                        response = _a.sent();
                        if (!(response && response.settings)) return [3 /*break*/ , 4];
                        if (!response.settings.originGallerySettings) return [3 /*break*/ , 3];
                        response.settings = __assign(__assign({}, response.settings.originGallerySettings), response.settings);
                        response.settings.originGallerySettings = null;
                        if (!(!this.isLiveSite() && !this.isPreview())) return [3 /*break*/ , 3];
                        return [4 /*yield*/ , this.setMultiple(response.settings, Consts.dataSavedState.PUBLISHED)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        if (key) {
                            return [2 /*return*/ , response.settings[key]];
                        }
                        return [2 /*return*/ , response.settings];
                    case 4:
                        return [2 /*return*/ , undefined];
                }
            });
        });
    };
    AppSettings.prototype.setMultiple = function(settingObject, state) {
        if (state === void 0) {
            state = Consts.dataSavedState.SAVED;
        }
        return __awaiter(this, void 0, void 0, function() {
            var galleryId, neededSettings, host, settings, data;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        galleryId = settingObject.galleryId, neededSettings = __rest(settingObject, ["galleryId"]);
                        host = 'VIEWER';
                        settings = neededSettings ? neededSettings : {};
                        data = {
                            settings: settings,
                            host: host,
                            state: state
                        };
                        return [4 /*yield*/ , fetch(this.baseUrl + "/_api/app-settings-service/v1/settings/components/" + this.getCompId(), {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: this.getInstance(),
                            },
                            body: JSON.stringify(data),
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/ ];
                }
            });
        });
    };
    AppSettings.prototype.set = function(key, value) {
        var _a;
        this.setMultiple((_a = {}, _a[key] = value, _a));
    };
    return AppSettings;
}());
export default AppSettings;
//# sourceMappingURL=appSettings.js.map