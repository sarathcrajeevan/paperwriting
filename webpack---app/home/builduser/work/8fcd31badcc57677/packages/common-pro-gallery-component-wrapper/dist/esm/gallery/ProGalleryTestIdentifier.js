import {
    __extends
} from "tslib";
import React from 'react';
import {
    PG_TEST_TYPE
} from '../constants/constants';
var ProGalleryTestIdentifier = /** @class */ (function(_super) {
    __extends(ProGalleryTestIdentifier, _super);

    function ProGalleryTestIdentifier() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProGalleryTestIdentifier.prototype.createTestDescriptionElement = function() {
        var testColor = 'blue';
        var message = '_ DEFAULT MESSAGE';
        var testType = this.props.testType;
        switch (testType) {
            case PG_TEST_TYPE.USER_SSR:
                message = '_ USER-VIEW SSR';
                testColor = 'navy';
                break;
            case PG_TEST_TYPE.BOT_SSR:
                message = '_ BOT-VIEW SSR';
                testColor = 'rosybrown';
                break;
            case PG_TEST_TYPE.USER_CLIENT:
                message = '_ USER-VIEW CLIENT';
                testColor = 'mediumslateblue';
                break;
            case PG_TEST_TYPE.PRODUCTION_USER_SSR:
                message = '_ USER-VIEW PRODUCTION SSR';
                testColor = 'red';
                break;
            case PG_TEST_TYPE.PRODUCTION_USER_CLIENT:
                message = '_ USER-VIEW PRODUCTION CLIENT';
                testColor = 'orangered';
                break;
            case PG_TEST_TYPE.USER_SSR_WITH_CUSTOM_VARIANT:
                message = '_ USER-VIEW SSR WITH CUSTOM VARIANT';
                testColor = 'navy';
                break;
            case PG_TEST_TYPE.BOT_SSR_WITH_CUSTOM_VARIANT:
                message = '_ BOT-VIEW SSR WITH CUSTOM VARIANT';
                testColor = 'rosybrown';
                break;
            case PG_TEST_TYPE.USER_CLIENT_WITH_CUSTOM_VARIANT:
                message = '_ USER-VIEW CLIENT WITH CUSTOM VARIANT';
                testColor = 'mediumslateblue';
                break;
            case PG_TEST_TYPE.PRODUCTION_USER_SSR_WITH_CUSTOM_VARIANT:
                message = '_ USER-VIEW PRODUCTION SSR WITH CUSTOM VARIANT';
                testColor = 'red';
                break;
            case PG_TEST_TYPE.PRODUCTION_USER_CLIENT_WITH_CUSTOM_VARIANT:
                message = '_ USER-VIEW PRODUCTION CLIENT WITH CUSTOM VARIANT';
                testColor = 'orangered';
                break;
            default:
                return null;
        }
        return (React.createElement("div", {
            class: "test-pg",
            style: {
                fontFamily: 'Sans-Serif',
                boxShadow: "inset -15px 0 0 " + testColor + ", inset 0 -15px 0 " + testColor + ", inset 15px 0 0 " + testColor + ", inset 0 15px 0 " + testColor,
                height: '100%',
                width: '100%',
                position: 'absolute',
                zIndex: '2000',
                color: testColor,
                fontSize: '50px',
            }
        }, message));
    };
    ProGalleryTestIdentifier.prototype.render = function() {
        var isNeeded = typeof this.props.testType === 'number' ||
            typeof this.props.testType === 'string';
        return isNeeded ? this.createTestDescriptionElement() : null;
    };
    return ProGalleryTestIdentifier;
}(React.Component));
export default ProGalleryTestIdentifier;
//# sourceMappingURL=ProGalleryTestIdentifier.js.map