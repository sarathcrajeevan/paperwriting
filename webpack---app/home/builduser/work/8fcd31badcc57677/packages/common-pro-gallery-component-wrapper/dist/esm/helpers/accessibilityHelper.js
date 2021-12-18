import {
    utils
} from '../utils/webUtils';
import {
    window
} from '@wix/photography-client-lib';
var AccessibilityHelper = /** @class */ (function() {
    function AccessibilityHelper(galleryWrapper, props, setAccessibilyState) {
        var _this = this;
        this.waitForFirstTabPress = function(event) {
            if (event.keyCode === 9) {
                event.preventDefault();
                window.removeEventListener('keydown', _this.waitForFirstTabPress);
                _this.tabWasPressed = true;
                if (_this.galleryWrapperProps.totalItemsCount > 1) {
                    _this.galleryWrapper.loadAccessibilityTooltipComponent();
                }
                _this.setAccessibilityStateCB(true);
                return false;
            }
        };
        this.galleryWrapper = galleryWrapper;
        this.galleryWrapperProps = props;
        this.update = this.update.bind(this);
        this.initAccessibility = this.initAccessibility.bind(this);
        this.cleanupAccessibility = this.cleanupAccessibility.bind(this);
        this.waitForFirstTabPress = this.waitForFirstTabPress.bind(this);
        this.isDevAccessibility = utils.shouldDebug('accessibility');
        this.tabWasPressed = false;
        this.setAccessibilityStateCB = setAccessibilyState;
    }
    AccessibilityHelper.prototype.update = function(props) {
        this.galleryWrapperProps = props;
        var isAccessible = (this.galleryWrapperProps.accessibilityEnabled ||
                this.isDevAccessibility) &&
            this.tabWasPressed;
        this.setAccessibilityStateCB(isAccessible);
    };
    AccessibilityHelper.prototype.initAccessibility = function() {
        if (this.galleryWrapperProps.accessibilityEnabled ||
            this.isDevAccessibility) {
            window.addEventListener('keydown', this.waitForFirstTabPress);
        }
    };
    AccessibilityHelper.prototype.cleanupAccessibility = function() {
        if (this.galleryWrapperProps.accessibilityEnabled ||
            this.isDevAccessibility) {
            window.removeEventListener('keydown', this.waitForFirstTabPress);
        }
    };
    return AccessibilityHelper;
}());
export default AccessibilityHelper;
//# sourceMappingURL=accessibilityHelper.js.map