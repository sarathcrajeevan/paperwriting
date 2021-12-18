import * as React from 'react';
import { TranslationGetter } from '@wix/editor-elements-types';

import { ILoginSocialBarProps } from '../LoginSocialBar.types';
import styles from './style/LoginSocialBarNativeMenu.scss';
import {
  LOGIN_SOCIAL_BAR_NAMESPACE,
  CHOOSE_OPTION_TEXT_DEFAULT,
  OPTION_VALUE_TEXT,
} from './constants/i18n.constants';

type ILoginSocialBarNativeMenuProps = Pick<
  ILoginSocialBarProps,
  | 'menuItems'
  | 'onLogout'
  | 'logOutText'
  | 'currentPrimaryPageHref'
  | 'navigateTo'
> & {
  translate?: TranslationGetter;
  ariaLabel: string;
};

export const OPTION_VALUE_CHOOSE = 'choose';
export const OPTION_VALUE_LOG_OUT = 'logout';

const LoginSocialBarNativeMenu: React.FC<ILoginSocialBarNativeMenuProps> = ({
  ariaLabel,
  menuItems,
  logOutText,
  currentPrimaryPageHref,
  onLogout,
  navigateTo,
  translate,
}) => {
  const optionValueText = translate!(
    LOGIN_SOCIAL_BAR_NAMESPACE,
    OPTION_VALUE_TEXT,
    CHOOSE_OPTION_TEXT_DEFAULT,
  );

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = event => {
    const { value } = event.target;

    if (value === OPTION_VALUE_CHOOSE) {
      return;
    }

    if (value === OPTION_VALUE_LOG_OUT) {
      onLogout();
      return;
    }

    const { link } = menuItems[parseInt(value, 10)];
    navigateTo(link);
  };

  const selectedValue = React.useMemo(() => {
    const selectedMenuItemIndex = menuItems.findIndex(
      ({ link }) => link.href && link.href === currentPrimaryPageHref,
    );
    return selectedMenuItemIndex !== -1
      ? selectedMenuItemIndex
      : OPTION_VALUE_CHOOSE;
  }, [currentPrimaryPageHref, menuItems]);

  return (
    <select
      aria-label={ariaLabel}
      className={styles.root}
      value={selectedValue}
      onChange={handleChange}
    >
      <option value={OPTION_VALUE_CHOOSE}>{optionValueText}</option>
      {menuItems.map(({ label, displayCount }, index) => (
        <option key={index} value={index}>
          {label}
          {typeof displayCount === 'number' && ` (${displayCount})`}
        </option>
      ))}
      <option value={OPTION_VALUE_LOG_OUT}>{logOutText}</option>
    </select>
  );
};

export default LoginSocialBarNativeMenu;
