import {
    getStaffListToDisplay
} from './staff-list.mappers';
import {
    StaffWidgetSettingsKeys
} from '@wix/bookings-app-builder-settings-const/dist/src/StaffWidget/Settings.const';
var StaffListViewModel = /** @class */ (function() {
    function StaffListViewModel(_a) {
        var _this = this;
        var $widget = _a.$widget,
            $w = _a.$w,
            wixSdkAdapter = _a.wixSdkAdapter,
            biLogger = _a.biLogger;
        this.setStaffImage = function(image, $image) {
            if (image && _this.isElementVisible($image)) {
                var originalImageDimensions = $image.src.split('#').pop();
                $image.src = "wix:image://v1/" + image.url + "/" + image.url + "#" + originalImageDimensions;
                $image.tooltip = null;
            }
        };
        this.getStaffDetails = function(itemData) {
            return itemData.email && itemData.phone ?
                itemData.email + "\n" + itemData.phone :
                itemData.email ?
                "" + itemData.email :
                itemData.phone ?
                "" + itemData.phone :
                '';
        };
        this.$w = $w;
        this.$widget = $widget;
        this.wixSdkAdapter = wixSdkAdapter;
        this.biLogger = biLogger;
    }
    StaffListViewModel.prototype.setStaffList = function(staffDtoList, staffListWidgetSettings, translations, isDisplayAltOnImgEnabled) {
        if (staffListWidgetSettings === void 0) {
            staffListWidgetSettings = {};
        }
        if (translations === void 0) {
            translations = {};
        }
        if (isDisplayAltOnImgEnabled === void 0) {
            isDisplayAltOnImgEnabled = false;
        }
        this.setupReadyListeners(staffListWidgetSettings, translations, isDisplayAltOnImgEnabled);
        this.staffRepeater.data = getStaffListToDisplay(staffDtoList, staffListWidgetSettings);
    };
    StaffListViewModel.prototype.setupReadyListeners = function(staffListWidgetSettings, translations, isDisplayAltOnImgEnabled) {
        var _this = this;
        this.staffRepeater.onItemReady(function($item, itemData) {
            _this.setStaffImage(itemData.image, $item('#staffImage'));
            var staffDetails = _this.getStaffDetails(itemData);
            var staffDescription = itemData.description;
            var buttonTextFromSettings = staffListWidgetSettings[StaffWidgetSettingsKeys.BOOK_BUTTON_TEXT];
            $item('#staffName').text = itemData.name;
            if (isDisplayAltOnImgEnabled &&
                _this.isElementVisible($item('#staffImage'))) {
                if (!$item('#staffImage').alt) {
                    $item('#staffImage').alt = itemData.name;
                }
            }
            if (_this.isElementVisible($item('#staffDetails'))) {
                staffDetails
                    ?
                    ($item('#staffDetails').text = staffDetails) :
                    _this.setDefaultAndCollapse($item('#staffDetails'), translations['bookings.staff-list.cta.book.details']);
            }
            if (_this.isElementVisible($item('#staffDescription'))) {
                staffDescription
                    ?
                    ($item('#staffDescription').text = staffDescription) :
                    _this.setDefaultAndCollapse($item('#staffDescription'), translations['bookings.staff-list.cta.book.description']);
            }
            if (_this.isElementVisible($item('#staffButton'))) {
                $item('#staffButton').label = buttonTextFromSettings ?
                    buttonTextFromSettings :
                    translations['bookings.staff-list.cta.book.button'];
                $item('#staffButton').onClick(function() {
                    return _this.staffClickHandler(itemData);
                });
            }
        });
    };
    StaffListViewModel.prototype.isElementVisible = function($element) {
        return !$element.hasOwnProperty('length');
    };
    StaffListViewModel.prototype.setDefaultAndCollapse = function($element, text) {
        $element.collapse();
        $element.text = text;
    };
    StaffListViewModel.prototype.staffClickHandler = function(itemData) {
        var shouldNavigateToSpecificSitePage = !!itemData.overridePageId;
        this.biLogger.sendStaffClicked(shouldNavigateToSpecificSitePage);
        shouldNavigateToSpecificSitePage
            ?
            this.wixSdkAdapter.navigateToSpecificSitePage(itemData.overridePageId) :
            this.wixSdkAdapter.navigateToServiceListWithQuery('staff', itemData.slug);
    };
    Object.defineProperty(StaffListViewModel.prototype, "staffRepeater", {
        get: function() {
            return this.$w('#staffRepeater');
        },
        enumerable: false,
        configurable: true
    });
    return StaffListViewModel;
}());
export {
    StaffListViewModel
};
//# sourceMappingURL=staff-list.view-model.js.map