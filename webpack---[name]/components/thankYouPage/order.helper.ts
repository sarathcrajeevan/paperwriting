import {SubscriptionFrequency} from '@wix/wixstores-client-storefront-sdk/dist/es/src/graphql/queries-schema';

export const getPlanFrequencyByDurationTranslationKey = (
  frequency: SubscriptionFrequency,
  duration: number = 1
): string => {
  /* istanbul ignore next */
  if (frequency === 'UNDEFINED') {
    return;
  }

  const pluralTranslation = {
    DAY: 'DAYS_QA',
    WEEK: 'THANK_YOU_PAGE_PLAN_WEEKS',
    MONTH: 'THANK_YOU_PAGE_PLAN_MONTHS',
    YEAR: 'THANK_YOU_PAGE_PLAN_YEARS',
  };

  const singularTranslation = {
    DAY: 'DAY_QA',
    WEEK: 'THANK_YOU_PAGE_PLAN_WEEK',
    MONTH: 'THANK_YOU_PAGE_PLAN_MONTH',
    YEAR: 'THANK_YOU_PAGE_PLAN_YEAR',
  };

  const isPlural = duration !== 1;
  return isPlural ? pluralTranslation[frequency] : singularTranslation[frequency];
};

export const prepareSubdivision = (subdivisionKey: string) => {
  if (!subdivisionKey || !subdivisionKey.includes('-')) {
    return '';
  }

  return subdivisionKey.split('-')[1];
};
