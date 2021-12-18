import {
  OfferingCategoryDtoBuilder,
  OfferingCategoryDto,
} from '@wix/bookings-uou-domain';
import {
  BOOKINGS_MAIN_PAGE_EDITOR_X_PRESET_ID,
  BOOKINGS_MAIN_PAGE_PRESET_ID,
} from '../../Shared/appKeys/DefaultSettings';

export const DUMMY_CATEGORY_1 = 'dummy-category-id-1';
export const DUMMY_CATEGORY_2 = 'dummy-category-id-2';
export const DUMMY_CATEGORY_3 = 'dummy-category-id-3';

export const createDummyCategoriesDto = (presetId): OfferingCategoryDto[] => {
  if (
    presetId === BOOKINGS_MAIN_PAGE_PRESET_ID ||
    presetId === BOOKINGS_MAIN_PAGE_EDITOR_X_PRESET_ID
  ) {
    return [
      new OfferingCategoryDtoBuilder()
        .withCategoryId(DUMMY_CATEGORY_1)
        .withName('dummy.category-1.bookings.main.page.name')
        .build(),
      new OfferingCategoryDtoBuilder()
        .withCategoryId(DUMMY_CATEGORY_2)
        .withName('dummy.category-2.bookings.main.page.name')
        .build(),
      new OfferingCategoryDtoBuilder()
        .withCategoryId(DUMMY_CATEGORY_3)
        .withName('dummy.category-3.bookings.main.page.name')
        .build(),
    ];
  }
  return [
    new OfferingCategoryDtoBuilder()
      .withCategoryId(DUMMY_CATEGORY_1)
      .withName('dummy.category-1.bookings.main.page.name')
      .build(),
  ];
};
