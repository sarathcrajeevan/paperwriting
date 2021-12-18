import {
    __awaiter,
    __generator
} from "tslib";
import {
    appClient,
    Scope
} from '@wix/app-settings-client';
import {
    AppSettingsClientAdapter,
} from '@wix/bookings-adapter-ooi-wix-sdk';
export var createSettings = function(_a) {
    var appDefId = _a.appDefId,
        externalId = _a.externalId,
        wixSdkAdapter = _a.wixSdkAdapter;
    var settings;
    try {
        settings = appClient({
            scope: Scope.COMPONENT,
            adapter: new AppSettingsClientAdapter({
                appDefId: appDefId,
                instanceId: wixSdkAdapter.getInstanceId(),
                externalId: externalId,
            }),
        });
    } catch (e) {
        console.log('failed to init component settings', e);
    }
    return settings;
};
export var getComponentSettings = function(settings) {
    return __awaiter(void 0, void 0, void 0, function() {
        var e_1;
        return __generator(this, function(_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/ , settings.getAll()];
                case 1:
                    return [2 /*return*/ , _a.sent()];
                case 2:
                    e_1 = _a.sent();
                    console.log('failed to get component settings', e_1);
                    return [2 /*return*/ , {}];
                case 3:
                    return [2 /*return*/ ];
            }
        });
    });
};
export var getSettings = function(_a) {
    var appDefId = _a.appDefId,
        externalId = _a.externalId,
        wixSdkAdapter = _a.wixSdkAdapter;
    return __awaiter(void 0, void 0, void 0, function() {
        var settings;
        return __generator(this, function(_b) {
            settings = createSettings({
                appDefId: appDefId,
                externalId: externalId,
                wixSdkAdapter: wixSdkAdapter,
            });
            return [2 /*return*/ , getComponentSettings(settings)];
        });
    });
};
//# sourceMappingURL=app-settings.js.map