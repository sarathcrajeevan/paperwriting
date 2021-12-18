"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createEditorXBookingsMainPageDummyOfferingsDto = exports.createBookingsMainPageDummyOfferingsDto = exports.createEditorXSingleServiceDummyOfferingsDto = exports.createSingleServiceDummyOfferingsDto = exports.createEditorXGridDummyOfferingsDto = exports.createGridDummyOfferingsDto = exports.createEditorXStripDummyOfferingsDto = exports.createStripDummyOfferingsDto = exports.createEditorXOverlappingDummyOfferingsDto = exports.createOverlappingDummyOfferingsDto = exports.createEditorXClassicDummyOfferingsDto = exports.createClassicDummyOfferingsDto = exports.createDummyOfferingsDto = void 0;
var bookings_uou_domain_1 = require("@wix/bookings-uou-domain");
var DefaultSettings_1 = require("../../Shared/appKeys/DefaultSettings");
var dummy_category_dto_1 = require("./dummy-category-dto");
var createDummyOfferingsDto = function(presetId, isNewAddPanelEnabled) {
    var _a;
    if (isNewAddPanelEnabled === void 0) {
        isNewAddPanelEnabled = false;
    }
    var dummyMap = (_a = {},
        _a[DefaultSettings_1.CLASSIC_PRESET_ID] = exports.createClassicDummyOfferingsDto,
        _a[DefaultSettings_1.OVERLAPPING_PRESET_ID] = exports.createOverlappingDummyOfferingsDto,
        _a[DefaultSettings_1.STRIP_PRESET_ID] = exports.createStripDummyOfferingsDto,
        _a[DefaultSettings_1.GRID_PRESET_ID] = exports.createGridDummyOfferingsDto,
        _a[DefaultSettings_1.BOOKINGS_MAIN_PAGE_PRESET_ID] = exports.createBookingsMainPageDummyOfferingsDto,
        _a[DefaultSettings_1.SINGLE_SERVICE_PRESET_ID] = exports.createSingleServiceDummyOfferingsDto,
        _a[DefaultSettings_1.CLASSIC_EDITOR_X_PRESET_ID] = exports.createEditorXClassicDummyOfferingsDto,
        _a[DefaultSettings_1.OVERLAPPING_EDITOR_X_PRESET_ID] = exports.createEditorXOverlappingDummyOfferingsDto,
        _a[DefaultSettings_1.STRIP_EDITOR_X_PRESET_ID] = exports.createEditorXStripDummyOfferingsDto,
        _a[DefaultSettings_1.GRID_EDITOR_X_PRESET_ID] = exports.createEditorXGridDummyOfferingsDto,
        _a[DefaultSettings_1.BOOKINGS_MAIN_PAGE_EDITOR_X_PRESET_ID] = exports.createEditorXBookingsMainPageDummyOfferingsDto,
        _a[DefaultSettings_1.SINGLE_SERVICE_EDITOR_X_PRESET_ID] = exports.createEditorXSingleServiceDummyOfferingsDto,
        _a);
    return dummyMap[presetId]({
        isNewAddPanelEnabled: isNewAddPanelEnabled
    });
};
exports.createDummyOfferingsDto = createDummyOfferingsDto;
var createClassicDummyOfferingsDto = function(_a) {
    var _b = _a === void 0 ? {} : _a,
        isNewAddPanelEnabled = _b.isNewAddPanelEnabled;
    var dummyOfferings = [];
    var dummyOffering1 = isNewAddPanelEnabled ?
        new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.GROUP)
        .withId('classic-offering-1')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder()
            .withIsFree(true)
            .withPriceText('dummy.offering-1.classic.price.v1')
            .build())
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder()
            .withDays([bookings_uou_domain_1.WeekDay.MONDAY, bookings_uou_domain_1.WeekDay.TUESDAY, bookings_uou_domain_1.WeekDay.FRIDAY])
            .withDurationInMinutes(60)
            .build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages({
                fileName: '11062b_0784fee4aebd4b178e31f63f6c121dd6~mv2.jpg',
                relativeUri: '11062b_0784fee4aebd4b178e31f63f6c121dd6~mv2.jpg',
                width: 5161,
                height: 3492,
            })
            .withName('dummy.offering-1.classic.name.v1')
            .withTagLine('dummy.offering-1.classic.tagLine.v1')
            .build())
        .withDummyIndication()
        .build() :
        new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.INDIVIDUAL)
        .withId('classic-offering-1')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(65).build())
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder()
            .withDurationInMinutes(60)
            .build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages({
                fileName: 'e320d0_9627064079e24613a681d754a8f9d12a~mv2_d_5161_3492_s_4_2.jpg',
                relativeUri: 'e320d0_9627064079e24613a681d754a8f9d12a~mv2_d_5161_3492_s_4_2.jpg',
                width: 5161,
                height: 3492,
            })
            .withName('dummy.offering-1.classic.name')
            .withTagLine('dummy.offering-1.classic.tagLine')
            .build())
        .withDummyIndication()
        .build();
    var dummyOffering2 = isNewAddPanelEnabled ?
        new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.GROUP)
        .withId('classic-offering-2')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder()
            .withDurationInMinutes(60)
            .withDays([bookings_uou_domain_1.WeekDay.MONDAY, bookings_uou_domain_1.WeekDay.TUESDAY])
            .build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(20).build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages({
                fileName: '11062b_9fc6d79b5e2b42be9f41346778381dab~mv2.jpg',
                relativeUri: '11062b_9fc6d79b5e2b42be9f41346778381dab~mv2.jpg',
                width: 8688,
                height: 5792,
            })
            .withName('dummy.offering-2.classic.name.v1')
            .withTagLine('dummy.offering-2.classic.tagLine.v1')
            .build())
        .withDummyIndication()
        .build() :
        new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.GROUP)
        .withId('classic-offering-2')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder()
            .withDurationInMinutes(60)
            .withDays([bookings_uou_domain_1.WeekDay.MONDAY, bookings_uou_domain_1.WeekDay.WEDNESDAY])
            .build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder()
            .withPriceText('dummy.offering-2.classic.price')
            .withIsFree(true)
            .build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages({
                fileName: 'e320d0_162c0c4c748f4dac9b8dfc615224f084~mv2_d_8688_5792_s_4_2.jpg',
                relativeUri: 'e320d0_162c0c4c748f4dac9b8dfc615224f084~mv2_d_8688_5792_s_4_2.jpg',
                width: 8688,
                height: 5792,
            })
            .withName('dummy.offering-2.classic.name')
            .withTagLine('dummy.offering-2.classic.tagLine')
            .build())
        .withDummyIndication()
        .build();
    var dummyOffering3 = isNewAddPanelEnabled ?
        new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.GROUP)
        .withId('classic-offering-3')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder()
            .withDurationInMinutes(90)
            .withDays([
                bookings_uou_domain_1.WeekDay.SUNDAY,
                bookings_uou_domain_1.WeekDay.MONDAY,
                bookings_uou_domain_1.WeekDay.TUESDAY,
                bookings_uou_domain_1.WeekDay.WEDNESDAY,
                bookings_uou_domain_1.WeekDay.THURSDAY,
                bookings_uou_domain_1.WeekDay.FRIDAY,
                bookings_uou_domain_1.WeekDay.SATURDAY,
            ])
            .build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(20).build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages({
                fileName: '11062b_0446500bceec497899a6adfb2d5cff9e~mv2.jpg',
                relativeUri: '11062b_0446500bceec497899a6adfb2d5cff9e~mv2.jpg',
                width: 5256,
                height: 3504,
            })
            .withName('dummy.offering-3.classic.name.v1')
            .withTagLine('dummy.offering-3.classic.tagLine.v1')
            .build())
        .withDummyIndication()
        .build() :
        new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.GROUP)
        .withId('classic-offering-3')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder()
            .withDurationInMinutes(60)
            .withDays([
                bookings_uou_domain_1.WeekDay.SUNDAY,
                bookings_uou_domain_1.WeekDay.MONDAY,
                bookings_uou_domain_1.WeekDay.TUESDAY,
                bookings_uou_domain_1.WeekDay.WEDNESDAY,
                bookings_uou_domain_1.WeekDay.THURSDAY,
                bookings_uou_domain_1.WeekDay.FRIDAY,
                bookings_uou_domain_1.WeekDay.SATURDAY,
            ])
            .build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(30).build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages({
                fileName: 'e320d0_605a7d8912fa41e399a403b35473df21~mv2_d_5256_3504_s_4_2.jpg',
                relativeUri: 'e320d0_605a7d8912fa41e399a403b35473df21~mv2_d_5256_3504_s_4_2.jpg',
                width: 5256,
                height: 3504,
            })
            .withName('dummy.offering-3.classic.name')
            .withTagLine('dummy.offering-3.classic.tagLine')
            .build())
        .withDummyIndication()
        .build();
    dummyOfferings.push(dummyOffering1, dummyOffering2, dummyOffering3);
    return dummyOfferings;
};
exports.createClassicDummyOfferingsDto = createClassicDummyOfferingsDto;
var createEditorXClassicDummyOfferingsDto = function() {
    var dummyOfferings = [];
    var dummyOffering1 = new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.INDIVIDUAL)
        .withId('classic-offering-1')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(60).build())
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder().withDurationInMinutes(40).build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages({
                fileName: '11062b_0f2218fd616445c7ab09ca78aacdb169~mv2.jpg',
                relativeUri: '11062b_0f2218fd616445c7ab09ca78aacdb169~mv2.jpg',
                width: 5630,
                height: 3135,
            })
            .withName('dummy.editor-x.offering-1.classic.name')
            .withTagLine('dummy.editor-x.offering-1.classic.tagLine')
            .build())
        .withDummyIndication()
        .build();
    var dummyOffering2 = new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.GROUP)
        .withId('classic-offering-2')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder()
            .withDurationInMinutes(40)
            .withDays([bookings_uou_domain_1.WeekDay.MONDAY, bookings_uou_domain_1.WeekDay.WEDNESDAY])
            .build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder()
            .withPriceText('dummy.editor-x.offering-2.classic.price')
            .withIsFree(true)
            .build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages({
                fileName: '11062b_77255a5b3f0247d6b8a5dc7f02ff601f~mv2.jpg',
                relativeUri: '11062b_77255a5b3f0247d6b8a5dc7f02ff601f~mv2.jpg',
                width: 6939,
                height: 5411,
            })
            .withName('dummy.editor-x.offering-2.classic.name')
            .withTagLine('dummy.editor-x.offering-2.classic.tagLine')
            .build())
        .withDummyIndication()
        .build();
    dummyOfferings.push(dummyOffering1, dummyOffering2);
    return dummyOfferings;
};
exports.createEditorXClassicDummyOfferingsDto = createEditorXClassicDummyOfferingsDto;
var createOverlappingDummyOfferingsDto = function(_a) {
    var _b = _a === void 0 ? {} : _a,
        isNewAddPanelEnabled = _b.isNewAddPanelEnabled;
    var dummyOfferings = [];
    var dummyOffering1 = isNewAddPanelEnabled ?
        new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.INDIVIDUAL)
        .withId('overlapping-offering-1')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder()
            .withDurationInMinutes(45)
            .build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages({
                fileName: '11062b_1edac74605d1465c97cd5de495f4878f~mv2.jpg',
                height: 3620,
                relativeUri: '11062b_1edac74605d1465c97cd5de495f4878f~mv2.jpg',
                width: 4827,
            })
            .withName('dummy.offering-1.overlapping.name.v1')
            .withTagLine('dummy.offering-1.overlapping.tagLine.v1')
            .build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(50).build())
        .withDummyIndication()
        .build() :
        new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.INDIVIDUAL)
        .withId('overlapping-offering-1')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder()
            .withDurationInMinutes(45)
            .build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages({
                fileName: 'e320d0_4270cd9b89284829855132e19c2d9736~mv2_d_4827_3620_s_4_2.jpg',
                height: 3620,
                relativeUri: 'e320d0_4270cd9b89284829855132e19c2d9736~mv2_d_4827_3620_s_4_2.jpg',
                width: 4827,
            })
            .withName('dummy.offering-1.overlapping.name')
            .withTagLine('dummy.offering-1.overlapping.tagLine')
            .build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(60).build())
        .withDummyIndication()
        .build();
    var dummyOffering2 = isNewAddPanelEnabled ?
        new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.GROUP)
        .withId('overlapping-offering-2')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder()
            .withDays([bookings_uou_domain_1.WeekDay.MONDAY])
            .withDurationInMinutes(90)
            .build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages({
                fileName: '11062b_2c7d9a449e2f42d08f4ed5ae827e230c~mv2.jpg',
                height: 2598,
                relativeUri: '11062b_2c7d9a449e2f42d08f4ed5ae827e230c~mv2.jpg',
                width: 3247,
            })
            .withName('dummy.offering-2.overlapping.name.v1')
            .withTagLine('dummy.offering-2.overlapping.tagLine.v1')
            .build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(70).build())
        .withDummyIndication()
        .build() :
        new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.INDIVIDUAL)
        .withId('overlapping-offering-2')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder()
            .withDurationInMinutes(90)
            .build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages({
                fileName: 'e320d0_732503d3ad6444a9853df7245430c2c3~mv2_d_3247_2598_s_4_2.jpg',
                height: 2598,
                relativeUri: 'e320d0_732503d3ad6444a9853df7245430c2c3~mv2_d_3247_2598_s_4_2.jpg',
                width: 3247,
            })
            .withName('dummy.offering-2.overlapping.name')
            .withTagLine('dummy.offering-2.overlapping.tagLine')
            .build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(125).build())
        .withDummyIndication()
        .build();
    dummyOfferings.push(dummyOffering1, dummyOffering2);
    return dummyOfferings;
};
exports.createOverlappingDummyOfferingsDto = createOverlappingDummyOfferingsDto;
var createEditorXOverlappingDummyOfferingsDto = function() {
    var dummyOfferings = [];
    var dummyOffering1 = new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.INDIVIDUAL)
        .withId('overlapping-offering-1')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder().withDurationInMinutes(80).build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages({
                fileName: '11062b_ee4c6f7007fb49b5ab00657a5be9471a~mv2.jpg',
                relativeUri: '11062b_ee4c6f7007fb49b5ab00657a5be9471a~mv2.jpg',
                width: 3425,
                height: 4153,
            })
            .withName('dummy.editor-x.offering-1.overlapping.name')
            .withTagLine('dummy.editor-x.offering-1.overlapping.tagLine')
            .build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(50).build())
        .withDummyIndication()
        .build();
    var dummyOffering2 = new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.INDIVIDUAL)
        .withId('overlapping-offering-2')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder().withDurationInMinutes(60).build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages({
                fileName: '11062b_bf0adb87a3c34b77b3444b84abd04515~mv2.jpg',
                relativeUri: '11062b_bf0adb87a3c34b77b3444b84abd04515~mv2.jpg',
                width: 4480,
                height: 3769,
            })
            .withName('dummy.editor-x.offering-2.overlapping.name')
            .withTagLine('dummy.editor-x.offering-2.overlapping.tagLine')
            .build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(75).build())
        .withDummyIndication()
        .build();
    var dummyOffering3 = new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.INDIVIDUAL)
        .withId('overlapping-offering-3')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder().withDurationInMinutes(45).build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages({
                fileName: '11062b_85d5afe9a7744a7382481773058866c8~mv2.jpg',
                relativeUri: '11062b_85d5afe9a7744a7382481773058866c8~mv2.jpg',
                width: 5760,
                height: 6720,
            })
            .withName('dummy.editor-x.offering-3.overlapping.name')
            .withTagLine('dummy.editor-x.offering-3.overlapping.tagLine')
            .build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(50).build())
        .withDummyIndication()
        .build();
    dummyOfferings.push(dummyOffering1, dummyOffering2, dummyOffering3);
    return dummyOfferings;
};
exports.createEditorXOverlappingDummyOfferingsDto = createEditorXOverlappingDummyOfferingsDto;
var createStripDummyOfferingsDto = function(_a) {
    var _b = _a === void 0 ? {} : _a,
        isNewAddPanelEnabled = _b.isNewAddPanelEnabled;
    var dummyOfferings = [];
    var dummyOffering1 = isNewAddPanelEnabled ?
        new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.INDIVIDUAL)
        .withId('strip-offering-1')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder()
            .withDurationInMinutes(45)
            .build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(80).build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withName('dummy.offering-1.strip.name.v1')
            .withTagLine('dummy.offering-1.strip.tagLine.v1')
            .withImages({
                fileName: '11062b_54ca9853021049c8abe5ccd1bd63eb4c~mv2.jpg',
                relativeUri: '11062b_54ca9853021049c8abe5ccd1bd63eb4c~mv2.jpg',
                width: 5651,
                height: 4129,
            })
            .build())
        .withDummyIndication()
        .build() :
        new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.INDIVIDUAL)
        .withId('strip-offering-1')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder()
            .withDurationInMinutes(60)
            .build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(75).build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withName('dummy.offering-1.strip.name')
            .withTagLine('dummy.offering-1.strip.tagLine')
            .withImages({
                fileName: 'e320d0_29611b1016934f0db572caa6580f3e42~mv2_d_5651_4129_s_4_2.jpg',
                relativeUri: 'e320d0_29611b1016934f0db572caa6580f3e42~mv2_d_5651_4129_s_4_2.jpg',
                width: 5651,
                height: 4129,
            })
            .build())
        .withDummyIndication()
        .build();
    var dummyOffering2 = isNewAddPanelEnabled ?
        new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.INDIVIDUAL)
        .withId('strip-offering-2')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder()
            .withDurationInMinutes(45)
            .build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(60).build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withName('dummy.offering-2.strip.name.v1')
            .withTagLine('dummy.offering-2.strip.tagLine.v1')
            .withImages({
                fileName: '11062b_1b367614d3cb4bf587f43e2b1c10d5bb~mv2.jpg',
                relativeUri: '11062b_1b367614d3cb4bf587f43e2b1c10d5bb~mv2.jpg',
                width: 5651,
                height: 4277,
            })
            .build())
        .withDummyIndication()
        .build() :
        new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.INDIVIDUAL)
        .withId('strip-offering-2')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder()
            .withDurationInMinutes(50)
            .build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(40).build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withName('dummy.offering-2.strip.name')
            .withTagLine('dummy.offering-2.strip.tagLine')
            .withImages({
                fileName: 'e320d0_13daa3827adc40219d0c97bc2fb0a727~mv2_d_5651_4277_s_4_2.jpg',
                relativeUri: 'e320d0_13daa3827adc40219d0c97bc2fb0a727~mv2_d_5651_4277_s_4_2.jpg',
                width: 5651,
                height: 4277,
            })
            .build())
        .withDummyIndication()
        .build();
    var dummyOffering3 = isNewAddPanelEnabled ?
        new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.INDIVIDUAL)
        .withId('strip-offering-3')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder()
            .withDurationInMinutes(45)
            .build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(35).build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withName('dummy.offering-3.strip.name.v1')
            .withTagLine('dummy.offering-3.strip.tagLine.v1')
            .withImages({
                fileName: '11062b_6d591d82e9e34ede89903b94a4388b7c~mv2.jpg',
                relativeUri: '11062b_6d591d82e9e34ede89903b94a4388b7c~mv2.jpg',
                width: 4820,
                height: 3595,
            })
            .build())
        .withDummyIndication()
        .build() :
        new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.INDIVIDUAL)
        .withId('strip-offering-3')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder()
            .withDurationInMinutes(90)
            .build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(130).build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withName('dummy.offering-3.strip.name')
            .withTagLine('dummy.offering-3.strip.tagLine')
            .withImages({
                fileName: 'e320d0_8dc880b9d5d2460bbb8bbd03e0edd010~mv2_d_4820_3595_s_4_2.jpg',
                relativeUri: 'e320d0_8dc880b9d5d2460bbb8bbd03e0edd010~mv2_d_4820_3595_s_4_2.jpg',
                width: 4820,
                height: 3595,
            })
            .build())
        .withDummyIndication()
        .build();
    dummyOfferings.push(dummyOffering1, dummyOffering2, dummyOffering3);
    return dummyOfferings;
};
exports.createStripDummyOfferingsDto = createStripDummyOfferingsDto;
var createEditorXStripDummyOfferingsDto = function() {
    var dummyOfferings = [];
    var dummyOffering1 = new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.INDIVIDUAL)
        .withId('strip-offering-1')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder().withDurationInMinutes(60).build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(75).build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withName('dummy.editor-x.offering-1.strip.name')
            .withTagLine('dummy.editor-x.offering-1.strip.tagLine')
            .withImages({
                fileName: '11062b_7d236aed806f48b6ab70c24c537c5640~mv2.jpg',
                relativeUri: '11062b_7d236aed806f48b6ab70c24c537c5640~mv2.jpg',
                width: 5616,
                height: 3744,
            })
            .build())
        .withDummyIndication()
        .build();
    var dummyOffering2 = new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.INDIVIDUAL)
        .withId('strip-offering-2')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder().withDurationInMinutes(50).build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(40).build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withName('dummy.editor-x.offering-2.strip.name')
            .withTagLine('dummy.editor-x.offering-2.strip.tagLine')
            .withImages({
                fileName: '11062b_a00383fc89cf48b28d60d47be508e082~mv2.jpg',
                relativeUri: '11062b_a00383fc89cf48b28d60d47be508e082~mv2.jpg',
                width: 5472,
                height: 3648,
            })
            .build())
        .withDummyIndication()
        .build();
    var dummyOffering3 = new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.INDIVIDUAL)
        .withId('strip-offering-3')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder().withDurationInMinutes(90).build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(130).build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withName('dummy.editor-x.offering-3.strip.name')
            .withTagLine('dummy.editor-x.offering-3.strip.tagLine')
            .withImages({
                fileName: '11062b_97f61437530d440f9c18def8124e67ec~mv2.jpg',
                relativeUri: '11062b_97f61437530d440f9c18def8124e67ec~mv2.jpg',
                width: 4261,
                height: 3196,
            })
            .build())
        .withDummyIndication()
        .build();
    dummyOfferings.push(dummyOffering1, dummyOffering2, dummyOffering3);
    return dummyOfferings;
};
exports.createEditorXStripDummyOfferingsDto = createEditorXStripDummyOfferingsDto;
var createGridDummyOfferingsDto = function(_a) {
    var _b = _a === void 0 ? {} : _a,
        isNewAddPanelEnabled = _b.isNewAddPanelEnabled;
    var dummyOfferings = [];
    var dummyOffering1 = isNewAddPanelEnabled ?
        new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.GROUP)
        .withId('grid-offering-1')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder()
            .withDays([bookings_uou_domain_1.WeekDay.MONDAY, bookings_uou_domain_1.WeekDay.WEDNESDAY])
            .withDurationInMinutes(150)
            .build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(50).build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages({
                fileName: '11062b_a25a342ff395431f9bcdda5e68648d3e~mv2.jpg',
                relativeUri: '11062b_a25a342ff395431f9bcdda5e68648d3e~mv2.jpg',
                width: 6359,
                height: 4042,
            })
            .withName('dummy.offering-1.grid.name.v1')
            .withTagLine('dummy.offering-1.grid.tagLine.v1')
            .build())
        .withDummyIndication()
        .build() :
        new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.INDIVIDUAL)
        .withId('grid-offering-1')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder()
            .withDurationInMinutes(30)
            .build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(25).build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages({
                fileName: 'e320d0_5c372f959e8e453e840450d4206f87ff~mv2_d_6359_4042_s_4_2.jpg',
                relativeUri: 'e320d0_5c372f959e8e453e840450d4206f87ff~mv2_d_6359_4042_s_4_2.jpg',
                width: 6359,
                height: 4042,
            })
            .withName('dummy.offering-1.grid.name')
            .withTagLine('dummy.offering-1.grid.tagLine')
            .build())
        .withDummyIndication()
        .build();
    var dummyOffering2 = isNewAddPanelEnabled ?
        new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.GROUP)
        .withId('grid-offering-2')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder()
            .withDays([bookings_uou_domain_1.WeekDay.FRIDAY])
            .withDurationInMinutes(120)
            .build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(35).build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages({
                fileName: '11062b_edc564b4d9d745e5943f4ebabedc007a~mv2.jpg',
                relativeUri: '11062b_edc564b4d9d745e5943f4ebabedc007a~mv2.jpg',
                width: 3467,
                height: 2311,
            })
            .withName('dummy.offering-2.grid.name.v1')
            .withTagLine('dummy.offering-2.grid.tagLine.v1')
            .build())
        .withDummyIndication()
        .build() :
        new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.INDIVIDUAL)
        .withId('grid-offering-2')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder()
            .withDurationInMinutes(120)
            .build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(40).build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages({
                fileName: 'e320d0_d3b564822c324611a1cf9dff069e39de~mv2_d_3467_2311_s_2.jpg',
                relativeUri: 'e320d0_d3b564822c324611a1cf9dff069e39de~mv2_d_3467_2311_s_2.jpg',
                width: 3467,
                height: 2311,
            })
            .withName('dummy.offering-2.grid.name')
            .withTagLine('dummy.offering-2.grid.tagLine')
            .build())
        .withDummyIndication()
        .build();
    var dummyOffering3 = isNewAddPanelEnabled ?
        new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.GROUP)
        .withId('grid-offering-3')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder()
            .withDays([bookings_uou_domain_1.WeekDay.TUESDAY])
            .withDurationInMinutes(120)
            .build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(40).build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages({
                fileName: '11062b_c2d2871f620b43bca4d28cfdaf02c686~mv2.jpg',
                relativeUri: '11062b_c2d2871f620b43bca4d28cfdaf02c686~mv2.jpg',
                width: 3467,
                height: 2311,
            })
            .withName('dummy.offering-3.grid.name.v1')
            .withTagLine('dummy.offering-3.grid.tagLine.v1')
            .build())
        .withDummyIndication()
        .build() :
        new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.INDIVIDUAL)
        .withId('grid-offering-3')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder()
            .withDurationInMinutes(30)
            .build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(20).build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages({
                fileName: 'e320d0_0004294d425a45c7a53904b5dcf912e5~mv2_d_4808_3205_s_4_2.jpeg',
                relativeUri: 'e320d0_0004294d425a45c7a53904b5dcf912e5~mv2_d_4808_3205_s_4_2.jpeg',
                width: 3467,
                height: 2311,
            })
            .withName('dummy.offering-3.grid.name')
            .withTagLine('dummy.offering-3.grid.tagLine')
            .build())
        .withDummyIndication()
        .build();
    dummyOfferings.push(dummyOffering1, dummyOffering2, dummyOffering3);
    return dummyOfferings;
};
exports.createGridDummyOfferingsDto = createGridDummyOfferingsDto;
var createEditorXGridDummyOfferingsDto = function() {
    var dummyOfferings = [];
    var dummyOffering1 = new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.INDIVIDUAL)
        .withId('grid-offering-1')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder().withDurationInMinutes(30).build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(55).build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages({
                fileName: '11062b_97d1f052abe64d21b75fb9b208f18074~mv2.jpg',
                relativeUri: '11062b_97d1f052abe64d21b75fb9b208f18074~mv2.jpg',
                width: 3648,
                height: 3644,
            })
            .withName('dummy.editor-x.offering-1.grid.name')
            .withTagLine('dummy.editor-x.offering-1.grid.tagLine')
            .build())
        .withDummyIndication()
        .build();
    var dummyOffering2 = new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.INDIVIDUAL)
        .withId('grid-offering-2')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder().withDurationInMinutes(120).build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(45).build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages({
                fileName: '11062b_fe1121cd7bf644edbd8e7c125fe4be63~mv2.jpg',
                relativeUri: '11062b_fe1121cd7bf644edbd8e7c125fe4be63~mv2.jpg',
                width: 2400,
                height: 2000,
            })
            .withName('dummy.editor-x.offering-2.grid.name')
            .withTagLine('dummy.editor-x.offering-2.grid.tagLine')
            .build())
        .withDummyIndication()
        .build();
    var dummyOffering3 = new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.INDIVIDUAL)
        .withId('grid-offering-3')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder().withDurationInMinutes(30).build())
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(35).build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages({
                fileName: '11062b_422ec8ffcfeb4ed4b36cc3d5e295ed29~mv2.jpg',
                relativeUri: '11062b_422ec8ffcfeb4ed4b36cc3d5e295ed29~mv2.jpg',
                width: 6123,
                height: 8164,
            })
            .withName('dummy.editor-x.offering-3.grid.name')
            .withTagLine('dummy.editor-x.offering-3.grid.tagLine')
            .build())
        .withDummyIndication()
        .build();
    dummyOfferings.push(dummyOffering1, dummyOffering2, dummyOffering3);
    return dummyOfferings;
};
exports.createEditorXGridDummyOfferingsDto = createEditorXGridDummyOfferingsDto;
var createSingleServiceDummyOfferingsDto = function(_a) {
    var _b = _a === void 0 ? {} : _a,
        isNewAddPanelEnabled = _b.isNewAddPanelEnabled;
    var dummyOfferings = [];
    var dummyOffering = isNewAddPanelEnabled ?
        new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.GROUP)
        .withId('single-service-offering')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder()
            .withIsFree(true)
            .withPriceText('dummy.single-service-offering.price.v1')
            .build())
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder()
            .withDays([bookings_uou_domain_1.WeekDay.MONDAY, bookings_uou_domain_1.WeekDay.WEDNESDAY])
            .withDurationInMinutes(30)
            .build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages({
                fileName: '11062b_8cfb007420a640ddb5089533123cbdd8~mv2.jpg',
                relativeUri: '11062b_8cfb007420a640ddb5089533123cbdd8~mv2.jpg',
                width: 5161,
                height: 3492,
            })
            .withName('dummy.single-service-offering.name.v1')
            .withTagLine('dummy.single-service-offering.tagLine.v1')
            .build())
        .withDummyIndication()
        .build() :
        new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.INDIVIDUAL)
        .withId('single-service-offering')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(20).build())
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder()
            .withDurationInMinutes(60)
            .build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages({
                fileName: 'e320d0_e929da97b44e44ff9f29361a91907cdf~mv2_d_5386_3590_s_4_2.jpg',
                relativeUri: 'e320d0_e929da97b44e44ff9f29361a91907cdf~mv2_d_5386_3590_s_4_2.jpg',
                width: 5161,
                height: 3492,
            })
            .withName('dummy.single-service-offering.name')
            .withTagLine('dummy.single-service-offering.tagLine')
            .build())
        .withDummyIndication()
        .build();
    dummyOfferings.push(dummyOffering);
    return dummyOfferings;
};
exports.createSingleServiceDummyOfferingsDto = createSingleServiceDummyOfferingsDto;
var createEditorXSingleServiceDummyOfferingsDto = function() {
    var dummyOfferings = [];
    var dummyOffering = new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.INDIVIDUAL)
        .withId('single-service-offering')
        .withCategoryId(dummy_category_dto_1.DUMMY_CATEGORY_1)
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(20).build())
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder().withDurationInMinutes(60).build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages({
                fileName: '11062b_241cfd042c4e473483aed978f2e87431~mv2.jpg',
                relativeUri: '11062b_241cfd042c4e473483aed978f2e87431~mv2.jpg',
                width: 3631,
                height: 4843,
            })
            .withName('dummy.editor-x.single-service-offering.name')
            .withTagLine('dummy.editor-x.single-service-offering.tagLine')
            .build())
        .withDummyIndication()
        .build();
    dummyOfferings.push(dummyOffering);
    return dummyOfferings;
};
exports.createEditorXSingleServiceDummyOfferingsDto = createEditorXSingleServiceDummyOfferingsDto;
var createBookingsMainPageDummyOfferingsDto = function(_a) {
    var _b = _a === void 0 ? {} : _a,
        isNewAddPanelEnabled = _b.isNewAddPanelEnabled;
    var dummyOfferings = [];
    var dummyOffering1 = createDummyOfferingForMainPage({
        categoryId: dummy_category_dto_1.DUMMY_CATEGORY_1,
        image: createImageDto(isNewAddPanelEnabled ?
            '11062b_91fa0735368f425da0bd82073a8c3695~mv2.jpg' :
            '413707c67361480983896a2e55509f29.jpg', 4527, 3018),
    });
    var dummyOffering2 = createDummyOfferingForMainPage({
        categoryId: dummy_category_dto_1.DUMMY_CATEGORY_1,
        image: createImageDto(isNewAddPanelEnabled ?
            '11062b_0f11289602d54bafa37c6c028bc2431e~mv2.jpg' :
            '2c2ed29dab6946dfb37072e57fd294a3.jpg', 3666, 2435),
    });
    var dummyOffering3 = createDummyOfferingForMainPage({
        categoryId: dummy_category_dto_1.DUMMY_CATEGORY_1,
        image: createImageDto(isNewAddPanelEnabled ?
            '11062b_3a7a451a259a41878898a4e53b6b6eac~mv2.jpg' :
            '6142ea7f91914d1c9bee8f8380110f78.jpg', 2607, 1738),
    });
    var dummyOffering4 = createDummyOfferingForMainPage({
        categoryId: dummy_category_dto_1.DUMMY_CATEGORY_2,
        image: createImageDto(isNewAddPanelEnabled ?
            '11062b_9d4f78f3e4ec44deafd2d86e5a6d5eb5~mv2.jpg' :
            'f656fb99b72847c7b66e01324d843074.jpg', 2144, 1432),
    });
    var dummyOffering5 = createDummyOfferingForMainPage({
        categoryId: dummy_category_dto_1.DUMMY_CATEGORY_2,
        image: createImageDto(isNewAddPanelEnabled ?
            '11062b_0d0ac3c3b9f5480d8a8636fe70e7d5b2~mv2.jpg' :
            'bfc7011abc1642358204a81111b9e72b.jpg', 1761, 1175),
    });
    var dummyOffering6 = createDummyOfferingForMainPage({
        categoryId: dummy_category_dto_1.DUMMY_CATEGORY_2,
        image: createImageDto(isNewAddPanelEnabled ?
            '11062b_8feb05dc20724cd0ae12466e62b51872~mv2.jpg' :
            'e2d524c78f3842a1b74dc3b2f4827727.jpg', 1984, 1324),
    });
    var dummyOffering7 = createDummyOfferingForMainPage({
        categoryId: dummy_category_dto_1.DUMMY_CATEGORY_3,
        image: createImageDto(isNewAddPanelEnabled ?
            '11062b_7be34dd7781a419892b217eae1188612~mv2.jpg' :
            'a781e4805ee549c193112e17192b376c.jpg', 1592, 1061),
    });
    var dummyOffering8 = createDummyOfferingForMainPage({
        categoryId: dummy_category_dto_1.DUMMY_CATEGORY_3,
        image: createImageDto(isNewAddPanelEnabled ?
            '11062b_64186737b5f44cb683764b92c4bb7791~mv2.jpg' :
            '7f70fae2af3e444d9ab8c3b7698a6c1a.jpg', 4865, 3247),
    });
    var dummyOffering9 = createDummyOfferingForMainPage({
        categoryId: dummy_category_dto_1.DUMMY_CATEGORY_3,
        image: createImageDto(isNewAddPanelEnabled ?
            '11062b_c5819ae1c5684aaa898164ccde6e970c~mv2.jpg' :
            'd18f6586a05443c8a8d4b671cee5ea4c.jpg', 2401, 1500),
    });
    dummyOfferings.push(dummyOffering1, dummyOffering2, dummyOffering3, dummyOffering4, dummyOffering5, dummyOffering6, dummyOffering7, dummyOffering8, dummyOffering9);
    return dummyOfferings;
};
exports.createBookingsMainPageDummyOfferingsDto = createBookingsMainPageDummyOfferingsDto;
var createEditorXBookingsMainPageDummyOfferingsDto = function() {
    var dummyOfferings = [];
    var dummyOffering1 = createDummyOfferingForMainPage({
        categoryId: dummy_category_dto_1.DUMMY_CATEGORY_1,
        image: createImageDto('11062b_77255a5b3f0247d6b8a5dc7f02ff601f~mv2.jpg', 6939, 5411),
        price: 45,
    });
    var dummyOffering2 = createDummyOfferingForMainPage({
        categoryId: dummy_category_dto_1.DUMMY_CATEGORY_1,
        image: createImageDto('11062b_0f2218fd616445c7ab09ca78aacdb169~mv2.jpg', 5630, 3135),
        price: 60,
    });
    var dummyOffering3 = createDummyOfferingForMainPage({
        categoryId: dummy_category_dto_1.DUMMY_CATEGORY_1,
        image: createImageDto('11062b_871ca2ea5a6349bfab4edf5e6f72045c~mv2.jpg', 3987, 4899),
        price: 50,
    });
    var dummyOffering4 = createDummyOfferingForMainPage({
        categoryId: dummy_category_dto_1.DUMMY_CATEGORY_2,
        image: createImageDto('11062b_97d1f052abe64d21b75fb9b208f18074~mv2.jpg', 3648, 3644),
    });
    var dummyOffering5 = createDummyOfferingForMainPage({
        categoryId: dummy_category_dto_1.DUMMY_CATEGORY_2,
        image: createImageDto('11062b_fe1121cd7bf644edbd8e7c125fe4be63~mv2.jpg', 2400, 2000),
    });
    var dummyOffering6 = createDummyOfferingForMainPage({
        categoryId: dummy_category_dto_1.DUMMY_CATEGORY_2,
        image: createImageDto('11062b_422ec8ffcfeb4ed4b36cc3d5e295ed29~mv2.jpg', 6123, 8164),
    });
    var dummyOffering7 = createDummyOfferingForMainPage({
        categoryId: dummy_category_dto_1.DUMMY_CATEGORY_3,
        image: createImageDto('11062b_85d5afe9a7744a7382481773058866c8~mv2.jpg', 5760, 6720),
        price: 50,
    });
    var dummyOffering8 = createDummyOfferingForMainPage({
        categoryId: dummy_category_dto_1.DUMMY_CATEGORY_3,
        image: createImageDto('11062b_bf0adb87a3c34b77b3444b84abd04515~mv2.jpg', 4480, 3769),
        price: 75,
    });
    var dummyOffering9 = createDummyOfferingForMainPage({
        categoryId: dummy_category_dto_1.DUMMY_CATEGORY_3,
        image: createImageDto('11062b_ee4c6f7007fb49b5ab00657a5be9471a~mv2.jpg', 3425, 4153),
        price: 50,
    });
    dummyOfferings.push(dummyOffering1, dummyOffering2, dummyOffering3, dummyOffering4, dummyOffering5, dummyOffering6, dummyOffering7, dummyOffering8, dummyOffering9);
    return dummyOfferings;
};
exports.createEditorXBookingsMainPageDummyOfferingsDto = createEditorXBookingsMainPageDummyOfferingsDto;
var createDummyOfferingForMainPage = function(_a) {
    var categoryId = _a.categoryId,
        image = _a.image,
        _b = _a.price,
        price = _b === void 0 ? 45 : _b;
    return new bookings_uou_domain_1.CatalogOfferingDtoBuilder()
        .withType(bookings_uou_domain_1.OfferingType.INDIVIDUAL)
        .withId('main-page-offering-3')
        .withCategoryId(categoryId)
        .withPayment(new bookings_uou_domain_1.OfferingPaymentDtoBuilder().withPrice(price).build())
        .withScheduleHeader(new bookings_uou_domain_1.OfferingScheduleHeaderDtoBuilder().withDurationInMinutes(60).build())
        .withInfo(new bookings_uou_domain_1.OfferingInfoDtoBuilder()
            .withImages(image)
            .withName('dummy.offering.bookings.main.page.name')
            .withTagLine('')
            .build())
        .withDummyIndication()
        .build();
};
var createImageDto = function(url, width, height) {
    return new bookings_uou_domain_1.ImageDtoBuilder()
        .withFileName(url)
        .withRelativeUri(url)
        .withHeight(height)
        .withWidth(width)
        .build();
};
//# sourceMappingURL=dummy-offering-dto.js.map