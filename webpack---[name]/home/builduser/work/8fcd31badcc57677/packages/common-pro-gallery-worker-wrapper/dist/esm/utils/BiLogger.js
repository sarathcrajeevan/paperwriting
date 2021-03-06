import {
    __assign
} from "tslib";
import initSchemaLogger from '@wix/bi-logger-photo-ugc';
import {
    utils
} from './workerUtils';
import {
    GALLERY_CONSTS
} from 'pro-gallery-lib';
var BiLogger = /** @class */ (function() {
    function BiLogger(biLoggerFactory, viewMode, isStore) {
        try {
            this.logger = initSchemaLogger(biLoggerFactory)();
        } catch (e) {
            console.log('BI Failed to init');
        }
        this.galleryLogData = {
            galleryType: isStore ? 'store' : 'progallery',
        };
        this.viewMode = viewMode;
        this.log = this.log.bind(this);
    }
    BiLogger.prototype.log = function(galleryId, funcName, data) {
        if (data === void 0) {
            data = {};
        }
        if (this.viewMode !== GALLERY_CONSTS.viewMode.SITE ||
            utils.isDev() ||
            utils.isTest()) {
            return;
        }
        try {
            var initialData = __assign(__assign({}, this.galleryLogData), {
                gallery_id: galleryId
            });
            var logData = __assign(__assign({}, initialData), data);
            if (this.logger[funcName]) {
                this.logger[funcName](logData);
            }
        } catch (e) {
            console.log('Error bi logger', e);
        }
    };
    return BiLogger;
}());
export default BiLogger;
//# sourceMappingURL=BiLogger.js.map