import {
    __awaiter,
    __generator
} from "tslib";
import {
    WidgetServices
} from '../platform/platform-services';
import {
    WixOOISDKAdapter
} from '@wix/bookings-adapter-ooi-wix-sdk';
import {
    BookButtonViewModel
} from './book-button.view-model';
import {
    BiLogger
} from '../bi-logger/bi-logger';
import {
    WidgetName
} from '../bi-logger/bi.const';
export var createWidgetController = function(_a) {
    var compId = _a.compId,
        type = _a.type,
        config = _a.config,
        $w = _a.$w,
        warmupData = _a.warmupData,
        setProps = _a.setProps,
        appParams = _a.appParams,
        platformAPIs = _a.platformAPIs,
        wixCodeApi = _a.wixCodeApi;
    return __awaiter(void 0, void 0, void 0, function() {
        var widgetProps, widgetServices, $widget, initialControllerAPI, onPropsChanged, wixSdkAdapter, biLogger;
        return __generator(this, function(_b) {
            widgetProps = {};
            widgetServices = new WidgetServices(widgetProps);
            $widget = widgetServices.get$widget($w);
            initialControllerAPI = {};
            onPropsChanged = function(oldProps, newProps) {};
            $widget.onPropsChanged(onPropsChanged);
            wixSdkAdapter = new WixOOISDKAdapter(wixCodeApi, platformAPIs, appParams, compId);
            biLogger = new BiLogger(wixSdkAdapter, WidgetName.BOOK_BUTTON);
            return [2 /*return*/ , {
                pageReady: function() {
                    return __awaiter(void 0, void 0, void 0, function() {
                        var bookButtonViewModel;
                        return __generator(this, function(_a) {
                            bookButtonViewModel = new BookButtonViewModel({
                                $button: $w('#bookButton'),
                                controllerConfig: config,
                                wixSdkAdapter: wixSdkAdapter,
                                biLogger: biLogger,
                            });
                            return [2 /*return*/ ];
                        });
                    });
                },
                exports: function() {
                    return widgetServices.generateControllerAPI($widget, initialControllerAPI);
                },
            }];
        });
    });
};
//# sourceMappingURL=book-button.controller.js.map