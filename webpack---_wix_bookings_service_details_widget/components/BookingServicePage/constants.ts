// https://stackoverflow.com/questions/63961803/eslint-says-all-enums-in-typescript-app-are-already-declared-in-the-upper-scope
/* eslint-disable no-shadow */
export const SERVICE_PAGE_NAME = 'service-page';
export const SERVICE_LIST_PAGE_NAME = 'book-online';

export enum FailReasons {
  Premium = 'premium',
  PricingPlanNotInstalled = 'pricing_plan_not_installed',
  NoPlansAssignedToService = 'no_plans_assigned_to_service',
}
