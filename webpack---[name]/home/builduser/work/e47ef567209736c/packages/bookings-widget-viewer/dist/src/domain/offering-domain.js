"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OfferingDomain = exports.createDummyOfferingDto = exports.DummyOfferingContext = exports.OfferingType = exports.DUMMY_OFFERING_ID = void 0;
var bookings_uou_domain_1 = require("@wix/bookings-uou-domain");
exports.DUMMY_OFFERING_ID = '-1';
var OfferingType;
(function(OfferingType) {
    OfferingType["INDIVIDUAL"] = "INDIVIDUAL";
    OfferingType["GROUP"] = "GROUP";
    OfferingType["COURSE"] = "COURSE";
    OfferingType["TOUR"] = "TOUR";
    OfferingType["DUMMY"] = "DUMMY";
})(OfferingType = exports.OfferingType || (exports.OfferingType = {}));
var DummyOfferingContext;
(function(DummyOfferingContext) {
    DummyOfferingContext["EDITOR_MODE"] = "editormode";
    DummyOfferingContext["VIEWER_MODE"] = "viewermode";
})(DummyOfferingContext = exports.DummyOfferingContext || (exports.DummyOfferingContext = {}));
var baseDummyOffering = function(_a) {
    var _b = _a.dummyName,
        dummyName = _b === void 0 ? '' : _b;
    return {
        dummy: true,
        id: exports.DUMMY_OFFERING_ID,
        categoryId: '-1',
        order: -1,
        type: OfferingType.DUMMY,
        urlName: null,
        offeredAs: [bookings_uou_domain_1.OfferedAsType.ONE_TIME],
        pricingPlanInfo: null,
        info: {
            name: dummyName,
            description: null,
            tagLine: null,
            images: [{
                fileName: 'widget-icon.png',
                height: 1000,
                relativeUri: 'e320d0_e929da97b44e44ff9f29361a91907cdf~mv2_d_5386_3590_s_4_2.jpg',
                width: 1000,
            }, ],
        },
        location: {
            type: null,
            locationText: '',
        },
        payment: {
            currency: 'USD',
            price: 20,
            isFree: false,
            priceText: '',
            minCharge: 0,
            paymentType: 'OFFLINE',
        },
        schedulePolicy: {
            displayOnlyNoBookFlow: false,
            maxParticipantsPerOrder: undefined,
            uouHidden: undefined,
            capacity: undefined,
            futureBookingsPolicy: undefined,
            bookUpToXMinutesBefore: undefined,
            isPendingApprovalFlow: false,
            isPassedStartDate: false,
            isPassedEndDate: false,
        },
        schedule: {
            startDate: null,
            endDate: null,
            durationInMinutes: 60,
        },
    };
};
var createDummyOfferingDto = function(context) {
    switch (context) {
        case DummyOfferingContext.VIEWER_MODE:
            return baseDummyOffering({
                dummyName: 'viewer-dummy-service.title',
            });
        case DummyOfferingContext.EDITOR_MODE:
            return baseDummyOffering({
                dummyName: 'editor-dummy-service.title',
            });
        default:
            return;
    }
};
exports.createDummyOfferingDto = createDummyOfferingDto;
var OfferingDomain = /** @class */ (function() {
    function OfferingDomain(offeringDto) {
        this.offeringDto = offeringDto;
    }
    OfferingDomain.createDummyOffering = function(context) {
        return OfferingDomain.fromDto(exports.createDummyOfferingDto(context));
    };
    OfferingDomain.fromDto = function(offeringDto) {
        return offeringDto ? new OfferingDomain(offeringDto) : null;
    };
    Object.defineProperty(OfferingDomain.prototype, "name", {
        get: function() {
            return this.offeringDto.info.name;
        },
        set: function(newName) {
            this.offeringDto.info.name = newName;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OfferingDomain.prototype, "type", {
        get: function() {
            return this.offeringDto.type;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OfferingDomain.prototype, "priceText", {
        get: function() {
            var priceDto = bookings_uou_domain_1.PriceDtoFactory.fromOfferingDto(this.offeringDto);
            return new bookings_uou_domain_1.PriceDomain(priceDto, this.offeringDto.offeredAs).text;
        },
        enumerable: false,
        configurable: true
    });
    OfferingDomain.prototype.durationTextByFormat = function(formatter) {
        var durationDto = bookings_uou_domain_1.DurationDtoFactory.fromOfferingDto(this.offeringDto);
        return new bookings_uou_domain_1.DurationDomain(this.offeringDto.type, durationDto).getTextByFormat(formatter);
    };
    Object.defineProperty(OfferingDomain.prototype, "pricingPlanInfo", {
        get: function() {
            return this.offeringDto.pricingPlanInfo;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OfferingDomain.prototype, "schedule", {
        get: function() {
            return this.offeringDto.schedule;
        },
        enumerable: false,
        configurable: true
    });
    OfferingDomain.prototype.daysTextByFormat = function(formatter) {
        if (this.type === OfferingType.GROUP) {
            var daysOrder = formatter('first-day-of-week') === '0' ?
                ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] :
                ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
            var classHours_1 = this.offeringDto.schedule
                .classHours;
            var offeringDays = Object.keys(classHours_1);
            var weekDayKeyPrefix_1 = offeringDays.length === 1 ? 'week-day.' : 'short-week-day.';
            return daysOrder
                .filter(function(day) {
                    return classHours_1[day];
                })
                .map(function(day) {
                    return formatter(weekDayKeyPrefix_1 + day);
                })
                .join(', ');
        }
    };
    OfferingDomain.prototype.errorMessageTranslation = function(formatter) {
        return formatter('user-message.not-bookable');
    };
    OfferingDomain.prototype.userMessageButtonLabel = function(formatter) {
        return formatter('user-message.action-ok-label');
    };
    Object.defineProperty(OfferingDomain.prototype, "image", {
        get: function() {
            var image = this.offeringDto.info.images && this.offeringDto.info.images[0];
            return image ? image : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OfferingDomain.prototype, "displayOnlyNoBookFlow", {
        get: function() {
            return this.offeringDto.schedulePolicy.displayOnlyNoBookFlow;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OfferingDomain.prototype, "description", {
        get: function() {
            return this.offeringDto.info.description;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OfferingDomain.prototype, "payment", {
        get: function() {
            return this.offeringDto.payment;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OfferingDomain.prototype, "currency", {
        set: function(newCurrency) {
            this.offeringDto.payment.currency = newCurrency;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OfferingDomain.prototype, "id", {
        get: function() {
            return this.offeringDto.id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OfferingDomain.prototype, "dummy", {
        get: function() {
            return this.offeringDto.dummy;
        },
        enumerable: false,
        configurable: true
    });
    return OfferingDomain;
}());
exports.OfferingDomain = OfferingDomain;
//# sourceMappingURL=offering-domain.js.map