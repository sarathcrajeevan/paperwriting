import {
    __awaiter,
    __generator
} from "tslib";
// @ts-nocheck
import {
    GALLERY_CONSTS
} from 'pro-gallery-lib';
import {
    experimentsWrapper,
    window
} from '@wix/photography-client-lib';
import * as lodash from './lodash';
export function onlyPositiveNumericValues(object) {
    var key;
    for (key in object) {
        var type = typeof object[key];
        if (type === 'object') {
            onlyPositiveNumericValues(object[key]);
        } else if (typeof object[key] !== 'number' || object[key] <= 0) {
            delete object[key];
        }
    }
    return object;
}
var Utils = /** @class */ (function() {
    function Utils() {
        var _this = this;
        this.init = function() {
            Object.assign(_this, lodash);
        };
        this.init();
    }
    Utils.getBaseUrl = function(api, viewMode) {
        var parsedViewMode = Utils.parseViewMode(viewMode);
        if (parsedViewMode === GALLERY_CONSTS.viewMode.PREVIEW ||
            parsedViewMode === GALLERY_CONSTS.viewMode.EDIT) {
            return 'https://progallery.wixapps.net';
        } else {
            var baseUrl = api.location.baseUrl;
            var baseUrlParts = baseUrl.split('/');
            var origin_1 = baseUrlParts.slice(0, 3).join('/');
            return origin_1;
        }
    };
    Utils.getUrlOverrideExperimentsParam = function(baseApi) {
        var _a;
        return (_a = baseApi.location.query) === null || _a === void 0 ? void 0 : _a.petri_ovr;
    };
    Utils.getExperiments = function(baseApi, instance) {
        //
        // only under scope `pro-gallery-viewer`
        var viewMode = Utils.parseViewMode(baseApi.window.viewMode);
        var baseUrl = Utils.getBaseUrl(baseApi, viewMode);
        var petri_ovr = Utils.getUrlOverrideExperimentsParam(baseApi);
        var url = baseUrl + "/_api/pro-gallery-webapp/v1/viewer/experiments" + (petri_ovr ? '?petri_ovr=' + petri_ovr : '');
        return fetch(url, {
                credentials: 'include',
                headers: {
                    Authorization: instance,
                },
            })
            .then(function(res) {
                return res.json();
            })
            .then(function(res) {
                return res.experiments;
            })
            .catch(function() {
                return {};
            });
    };
    Utils.parseViewMode = function(viewMode) {
        //
        switch (viewMode.toLowerCase()) {
            case 'editor':
            case 'edit':
                return GALLERY_CONSTS.viewMode.EDIT;
            case 'preview':
                return GALLERY_CONSTS.viewMode.PREVIEW;
            case 'site':
            default:
                return GALLERY_CONSTS.viewMode.SITE;
        }
    };
    Utils.formFactorToDeviceType = function(formFactor) {
        switch (formFactor.toLowerCase()) {
            case 'tablet':
                return GALLERY_CONSTS.deviceType.TABLET;
            case 'mobile':
            case 'smartphone':
                return GALLERY_CONSTS.deviceType.MOBILE;
            case 'desktop':
            default:
                return GALLERY_CONSTS.deviceType.DESKTOP;
        }
    };
    Utils.verifyExperiments = function(baseApi) {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                if (experimentsWrapper.experimentsAreReady) {
                    return [2 /*return*/ ];
                } else {
                    baseApi && this.getExperimentsAndInitWrapper()(baseApi);
                    return [2 /*return*/ , new Promise(function(resolve) {
                        experimentsWrapper.onExperimentsReady(function(response) {
                            return resolve(response);
                        });
                    })];
                }
                return [2 /*return*/ ];
            });
        });
    };
    Utils.prototype.isVerbose = function() {
        return (!this.isTest() && (this.safeLocalStorage() || {}).forceDevMode === 'true');
    };
    Utils.prototype.isTest = function() {
        try {
            return window.isTest;
        } catch (e) {
            return false;
        }
    };
    Utils.prototype.safeLocalStorage = function() {
        try {
            return localStorage ? localStorage : window; // TrackJS errors, function returning null
        } catch (e) {
            return window;
        }
    };
    Utils.prototype.isDev = function() {
        return (this.isLocal() ||
            process.env.NODE_ENV === 'development' ||
            (this.safeLocalStorage() || {}).forceDevMode === 'true');
    };
    Utils.prototype.isLocal = function() {
        var ipRegex = /([0-9]{1,3}\.){3}[0-9]{1,3}:[0-9]{1,5}/; // matches 111.222.333.444:9999
        var host = window.location.hostname || '';
        var isLocal = host === 'local.wix.com' ||
            host === '0.0.0.0' ||
            host.indexOf('localhost') >= 0 ||
            ipRegex.exec(host) !== null;
        return isLocal;
    };
    Utils.prototype.isMobile = function(deviceType) {
        // deviceType here supposed to be after it was processed in the formFactorToDeviceType function
        return deviceType === GALLERY_CONSTS.deviceType.MOBILE;
    };
    Utils.prototype.isDimensionless = function(item) {
        try {
            if (!item.metaData.height || !item.metaData.width) {
                return true;
            }
            if (item.metaData.height <= 1 || item.metaData.width <= 1) {
                return true;
            }
        } catch (e) {
            console.error('corrupt item, cant check for dimensions', item, e);
        }
        return false;
    };
    Utils.getExperimentsAndInitWrapper = (function() {
        var executed = false;
        return function() {
            if (!executed) {
                executed = true;
                return function(baseApi, report, instance) {
                    Utils.getExperiments(baseApi, instance)
                        .then(function(experimentsRaw) {
                            experimentsWrapper.setExperiments(experimentsRaw);
                        })
                        .catch(function(e) {
                            report && report(e);
                            console.error('Waiting for experimentsPromise failed', e);
                        });
                };
            } else {
                return function() {};
            }
        };
    })();
    return Utils;
}());
export {
    Utils
};
export var utils = new Utils();
//# sourceMappingURL=workerUtils.js.map