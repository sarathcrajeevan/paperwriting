import React, { useState } from 'react';
import { Popover, Button } from 'wix-style-react';
import { useTranslation } from '@wix/wix-i18n-config';
import styles from './Branding.scss';
import { UoUAscendBrandingNew, getPackagePickerUrl } from './Brandings';
import { ViewMode } from '../../types/host-sdk';
import { useAppState } from '../../hooks/app-state';
import { useServices } from '../../hooks/services-registry';
import { withLockedTranslation } from '../../hooks/utils';

const _Branding: React.FunctionComponent = () => {
  const [isPopupShown, setIsPopupShown] = useState(false);

  const { appState } = useAppState();
  const { t } = useTranslation();
  const { experiments, hostSdk } = useServices();

  const isAscendNewPPExperimentOn = experiments.enabled(
    'specs.market.AscendNewPackagePicker',
  );

  return (
    <div className={styles.branding} data-hook="branding">
      {appState.viewMode === ViewMode.Preview ? (
        <div>
          <Popover
            animate
            appendTo="window"
            flip
            shown={isPopupShown}
            placement="top"
            showArrow
            onMouseEnter={() => setIsPopupShown(true)}
            onMouseLeave={() => setIsPopupShown(false)}
            dataHook={'branding-popup'}
            moveArrowTo={175}
          >
            <Popover.Element>
              <UoUAscendBrandingNew />
            </Popover.Element>
            <Popover.Content>
              <div className={styles.upgradePopup} data-hook="branding-tooltip">
                <div
                  className={styles.upgradePopupText}
                  data-hook="branding-popup-text"
                >
                  {t('branding.preview-branding-ascend')}
                </div>
                <div className={styles.upgradePopupButton}>
                  <Button
                    skin="premium"
                    size="tiny"
                    as="a"
                    href={getPackagePickerUrl(
                      hostSdk,
                      isAscendNewPPExperimentOn,
                    )}
                    target="_blank"
                    dataHook={'branding-popup-button'}
                  >
                    {t('branding.upgrade')}
                  </Button>
                </div>
              </div>
            </Popover.Content>
          </Popover>
        </div>
      ) : (
        <UoUAscendBrandingNew />
      )}
    </div>
  );
};

export const Branding = withLockedTranslation(_Branding);
