import React from 'react';
import styles from './Brandings.scss';
import { useTranslation } from '@wix/wix-i18n-config';
import { HostSdk } from '../../types/host-sdk';
import { CHAT_DEF_ID, ASCEND_LANDING_PAGE_URL } from '../../constants';

export const UoUAscendBrandingNew = () => {
  const { t } = useTranslation();

  const text: string = t('branding.new-uou-branding-ascend', {
    logo: '{{logo}}',
    upgrade: '{{upgrade}}',
  });
  const leftText = text.split('{{logo}}')[0];
  const rightText = text.split('{{logo}}')[1];

  return (
    <div className={styles.brandingsNew}>
      <span data-hook="left-branding">{leftText}</span>
      <a
        target="_blank"
        title={t('branding.logo-ascend')}
        href={ASCEND_LANDING_PAGE_URL}
        className={styles.brandingLogo}
        data-hook="branding-logo"
      />
      <span data-hook="right-branding">{rightText}</span>
    </div>
  );
};

export const getPackagePickerUrl = (
  hostSdk: HostSdk,
  isAscendNewPP: boolean,
) => {
  const returnUrl = isAscendNewPP
    ? hostSdk.getAscendUpgradeUrl()
    : `https://www.wix.com/apps/upgrade?metaSiteId=${hostSdk.getMetaSiteId()}&appDefId=${CHAT_DEF_ID}&pp_origin=widget_banner&originAppSlug=wix-chat`;
  return returnUrl;
};
