"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createDummyCategoriesDto = exports.DUMMY_CATEGORY_3 = exports.DUMMY_CATEGORY_2 = exports.DUMMY_CATEGORY_1 = void 0;
var bookings_uou_domain_1 = require("@wix/bookings-uou-domain");
var DefaultSettings_1 = require("../../Shared/appKeys/DefaultSettings");
exports.DUMMY_CATEGORY_1 = 'dummy-category-id-1';
exports.DUMMY_CATEGORY_2 = 'dummy-category-id-2';
exports.DUMMY_CATEGORY_3 = 'dummy-category-id-3';
var createDummyCategoriesDto = function(presetId) {
    if (presetId === DefaultSettings_1.BOOKINGS_MAIN_PAGE_PRESET_ID ||
        presetId === DefaultSettings_1.BOOKINGS_MAIN_PAGE_EDITOR_X_PRESET_ID) {
        return [
            new bookings_uou_domain_1.OfferingCategoryDtoBuilder()
            .withCategoryId(exports.DUMMY_CATEGORY_1)
            .withName('dummy.category-1.bookings.main.page.name')
            .build(),
            new bookings_uou_domain_1.OfferingCategoryDtoBuilder()
            .withCategoryId(exports.DUMMY_CATEGORY_2)
            .withName('dummy.category-2.bookings.main.page.name')
            .build(),
            new bookings_uou_domain_1.OfferingCategoryDtoBuilder()
            .withCategoryId(exports.DUMMY_CATEGORY_3)
            .withName('dummy.category-3.bookings.main.page.name')
            .build(),
        ];
    }
    return [
        new bookings_uou_domain_1.OfferingCategoryDtoBuilder()
        .withCategoryId(exports.DUMMY_CATEGORY_1)
        .withName('dummy.category-1.bookings.main.page.name')
        .build(),
    ];
};
exports.createDummyCategoriesDto = createDummyCategoriesDto;
//# sourceMappingURL=dummy-category-dto.js.map