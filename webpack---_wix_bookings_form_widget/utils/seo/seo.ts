import { BOOKINGS_FORM_SECTION_ID } from '@wix/bookings-adapter-ooi-wix-sdk/dist/src/bookings.const';
import { FormState } from '../state/initialStateFactory';
import { WixOOISDKAdapter } from '@wix/bookings-adapter-ooi-wix-sdk';
import { TFunction } from '../../types/types';
import { FormStatus } from '../../types/form-state';

export async function getSeoItemData(
  initialState: FormState,
  wixSdkAdapter: WixOOISDKAdapter,
  t: TFunction,
) {
  const formName =
    initialState?.status === FormStatus.SSR
      ? getServiceFormSsrTitle(t)
      : getServiceFormTitle(initialState, t);
  const pageUrl = await wixSdkAdapter.getSectionAbsoluteUrl(
    BOOKINGS_FORM_SECTION_ID,
  );
  return {
    form: {
      name: formName,
    },
    pageUrl,
  };
}

function getServiceFormTitle(initialState: FormState, t: TFunction) {
  return initialState?.service?.name || t('app.seo.empty-state-title');
}
function getServiceFormSsrTitle(t: TFunction) {
  return t('app.seo.page-title');
}
