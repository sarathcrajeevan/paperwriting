import * as React from 'react';
import classNames from 'classnames';

import {
  DIRECTION_LEFT_TO_RIGHT,
  DIRECTION_RIGHT_TO_LEFT,
  TEST_ID_LINK,
  TEST_ID_CUSTOM_MENU,
} from '../constants';
import { ILoginSocialBarProps } from '../LoginSocialBar.types';
import Link from '../../Link/viewer/Link';
import { keyCodes, activateByEnterButton } from '../../../core/commons/a11y';
import styles from './style/LoginSocialBarCustomMenu.scss';

type ILoginSocialBarCustomMenuProps = Pick<
  ILoginSocialBarProps,
  | 'menuItems'
  | 'onLogout'
  | 'logOutText'
  | 'direction'
  | 'currentPrimaryPageHref'
> & {
  ariaLabel: string;
  open: boolean;
  onClose(): void;
};

export interface ILoginSocialBarCustomMenu {
  focusFirstMenuItem(): void;
}

const queryFocusableMenuElements = (menuElement: HTMLElement) =>
  Array.from(menuElement.querySelectorAll<HTMLElement>('[tabindex],[href]'));

const LoginSocialBarCustomMenu: React.ForwardRefRenderFunction<
  ILoginSocialBarCustomMenu,
  ILoginSocialBarCustomMenuProps
> = (
  {
    ariaLabel,
    menuItems,
    logOutText,
    direction,
    currentPrimaryPageHref,
    open,
    onLogout,
    onClose,
  },
  ref,
) => {
  const navRef = React.useRef<HTMLElement>(null);
  const className = classNames(styles.root, {
    [styles.open]: open,
    [styles.rtl]: direction === DIRECTION_RIGHT_TO_LEFT,
    [styles.ltr]: direction === DIRECTION_LEFT_TO_RIGHT,
  });

  React.useImperativeHandle(ref, () => ({
    focusFirstMenuItem: () => {
      if (!navRef.current) {
        return;
      }
      const [firstElement] = queryFocusableMenuElements(navRef.current);
      if (firstElement) {
        firstElement.focus();
      }
    },
  }));

  const handleKeyDown: React.KeyboardEventHandler = event => {
    const { keyCode } = event;
    const { escape, arrowDown, arrowUp, tab, enter } = keyCodes;
    const focusChangeKeys: Array<number> = [arrowDown, arrowUp, tab];

    if (keyCode === escape) {
      event.preventDefault();
      onClose();
    } else if (keyCode === enter) {
      event.preventDefault();
      const menuItemLink = event.target as HTMLElement;
      menuItemLink.click();
    } else if (focusChangeKeys.includes(keyCode)) {
      event.preventDefault();
      if (!navRef.current) {
        return;
      }

      const focusableElements = queryFocusableMenuElements(navRef.current);
      const currentElement = event.target as HTMLElement;
      const currentElementIndex = focusableElements.indexOf(currentElement);
      if (currentElementIndex === -1) {
        return;
      }

      let nextElementIndex = currentElementIndex;
      if (keyCode === arrowUp) {
        nextElementIndex--;
        if (nextElementIndex < 0) {
          nextElementIndex = focusableElements.length - 1;
        }
      } else {
        nextElementIndex = (nextElementIndex + 1) % focusableElements.length;
      }

      focusableElements[nextElementIndex].focus();
    }
  };

  return (
    <nav
      ref={navRef}
      className={className}
      aria-label={ariaLabel}
      aria-live="polite"
      data-testid={TEST_ID_CUSTOM_MENU}
      onKeyDown={handleKeyDown}
      onClick={onClose}
    >
      <ul>
        {menuItems.map(({ label, link, displayCount }, index) => (
          <li key={index}>
            <Link
              {...link}
              dataTestId={TEST_ID_LINK}
              className={classNames(styles.link, {
                [styles.selected]:
                  !!link.href && link.href === currentPrimaryPageHref,
              })}
            >
              <span className={styles.label}>{label}</span>
              {typeof displayCount === 'number' && (
                <span className={styles.displayCount}>({displayCount})</span>
              )}
            </Link>
          </li>
        ))}
        {!!menuItems.length && (
          <li role="separator">
            <hr />
          </li>
        )}
        <li>
          <div
            className={styles.link}
            tabIndex={0}
            data-testid={TEST_ID_LINK}
            onClick={onLogout}
            onKeyDown={activateByEnterButton}
          >
            <span className={styles.label}>{logOutText}</span>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default React.forwardRef(LoginSocialBarCustomMenu);
