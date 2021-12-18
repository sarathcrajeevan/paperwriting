import * as React from 'react';
import classNames from 'classnames';

import { keyCodes } from '../../../core/commons/a11y';
import Image from '../../Image/viewer/Image';
import VectorImage from '../../VectorImage/viewer/VectorImage';
import {
  DISPLAY_MODE_AVATAR_ONLY,
  DISPLAY_MODE_AVATAR_AND_TEXT,
  DISPLAY_MODE_TEXT_ONLY,
  DIRECTION_RIGHT_TO_LEFT,
  DIRECTION_LEFT_TO_RIGHT,
  ARIA_LABEL_ACCOUNT_MENU,
  ARIA_LABEL_MEMBERS_BAR,
} from '../constants';
import { ILoginSocialBarProps } from '../LoginSocialBar.types';
import LoginSocialBarCustomMenu, {
  ILoginSocialBarCustomMenu,
} from './LoginSocialBarCustomMenu';
import LoginSocialBarNativeMenu from './LoginSocialBarNativeMenu';
import LoginSocialBarIcons from './LoginSocialBarIcons';
import styles from './style/LoginSocialBar.scss';
import { ReactComponent as ArrowIcon } from './assets/arrow.svg';
import {
  LOGIN_SOCIAL_BAR_NAMESPACE,
  LOGGED_OUT_TEXT,
  LOGGED_OUT_TEXT_DEFAULT,
  LOG_OUT_TEXT,
  LOG_OUT_TEXT_DEFAULT,
} from './constants/i18n.constants';

const shouldShowAvatar = ({ displayMode }: ILoginSocialBarProps) =>
  displayMode === DISPLAY_MODE_AVATAR_ONLY ||
  displayMode === DISPLAY_MODE_AVATAR_AND_TEXT;

const shouldShowUserName = ({ displayMode }: ILoginSocialBarProps) =>
  displayMode === DISPLAY_MODE_TEXT_ONLY ||
  displayMode === DISPLAY_MODE_AVATAR_AND_TEXT;

// TODO - Reuse Icon Component
const renderAvatar = ({
  id,
  isLoggedIn,
  avatarUri,
  iconSize,
  defaultAvatarSvgContent,
}: ILoginSocialBarProps) => (
  <div className={styles.avatar}>
    {isLoggedIn && avatarUri ? (
      <Image
        id={`customAvatar-${id}`}
        containerId={id}
        width={iconSize}
        height={iconSize}
        displayMode="fill"
        uri={avatarUri}
        name=""
        alt=""
      />
    ) : (
      <VectorImage
        id={`defaultAvatar-${id}`}
        className={styles.avatarSvg}
        svgContent={defaultAvatarSvgContent}
        shouldScaleStroke={false}
        withShadow={false}
      />
    )}
  </div>
);

const LoginSocialBar: React.FC<ILoginSocialBarProps> = props => {
  const {
    id,
    isLoggedIn,
    userName,
    loggedInText,
    loggedOutText,
    logOutText,
    direction,
    useNativeMenu,
    menuItems,
    iconItems,
    currentPrimaryPageHref,
    onLogin,
    onLogout,
    navigateTo,
    onMouseEnter,
    onMouseLeave,
    isMenuOpen,
    onMenuOpen,
    onMenuClose,
    translate,
  } = props;
  const translatedLoggedOutText = translate!(
    LOGIN_SOCIAL_BAR_NAMESPACE,
    LOGGED_OUT_TEXT,
    LOGGED_OUT_TEXT_DEFAULT,
  );
  const translatedLogOutText = translate!(
    LOGIN_SOCIAL_BAR_NAMESPACE,
    LOG_OUT_TEXT,
    LOG_OUT_TEXT_DEFAULT,
  );
  const avatar = shouldShowAvatar(props) && renderAvatar(props);
  const toggleMenuOpen = () => (isMenuOpen ? onMenuClose() : onMenuOpen());

  const closeMenuOnClickOutside: React.FocusEventHandler = ({
    currentTarget,
    relatedTarget,
  }) => {
    if (!relatedTarget || !currentTarget.contains(relatedTarget as Node)) {
      onMenuClose();
    }
  };

  const handleLogin = () => onLogin();
  const handleLogout = (event: React.MouseEvent<Element, MouseEvent>) =>
    onLogout(event);

  const userButtonRef = React.useRef<HTMLButtonElement>(null);
  const customMenuRef = React.useRef<ILoginSocialBarCustomMenu>(null);

  const handleUserButtonKeyDown: React.KeyboardEventHandler = event => {
    const { keyCode } = event;
    const { enter, space, escape, arrowUp, arrowDown } = keyCodes;
    const openMenuKeys: Array<number> = [enter, space, arrowDown];
    const closeMenuKeys: Array<number> = [enter, space, escape, arrowUp];

    if (isMenuOpen) {
      if (closeMenuKeys.includes(keyCode)) {
        event.preventDefault();
        onMenuClose();
      } else if (keyCode === arrowDown) {
        event.preventDefault();
        if (customMenuRef.current) {
          customMenuRef.current.focusFirstMenuItem();
        }
      }
    } else if (openMenuKeys.includes(keyCode)) {
      event.preventDefault();
      onMenuOpen();
    }
  };

  const handleCustomMenuClose = () => {
    onMenuClose();
    if (userButtonRef.current) {
      userButtonRef.current.focus();
    }
  };

  const commonMenuProps = {
    menuItems,
    logOutText: logOutText || translatedLogOutText,
    currentPrimaryPageHref,
    onLogout: handleLogout,
  };

  const hasIcons = !!iconItems.length;
  const className = classNames(styles.root, {
    [styles.rtl]: direction === DIRECTION_RIGHT_TO_LEFT,
    [styles.ltr]: direction === DIRECTION_LEFT_TO_RIGHT,
    [styles.withIcons]: hasIcons,
  });

  return (
    <div
      id={id}
      className={className}
      onBlur={
        isLoggedIn && !useNativeMenu ? closeMenuOnClickOutside : undefined
      }
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isLoggedIn ? (
        <>
          {hasIcons && (
            <LoginSocialBarIcons
              containerId={id}
              iconItems={iconItems}
              direction={direction}
            />
          )}
          <button
            ref={userButtonRef}
            className={styles.user}
            aria-label={`${userName} ${ARIA_LABEL_ACCOUNT_MENU}`}
            onClick={!useNativeMenu ? toggleMenuOpen : undefined}
            onKeyDown={handleUserButtonKeyDown}
          >
            {avatar}
            {shouldShowUserName(props) && (
              <div className={styles.name}>
                {loggedInText} {userName}
              </div>
            )}
            <div className={styles.arrow}>
              <ArrowIcon />
            </div>
            {useNativeMenu && (
              <LoginSocialBarNativeMenu
                {...commonMenuProps}
                ariaLabel={ARIA_LABEL_MEMBERS_BAR}
                navigateTo={navigateTo}
                translate={translate}
              />
            )}
          </button>
          {!useNativeMenu && (
            <LoginSocialBarCustomMenu
              {...commonMenuProps}
              ref={customMenuRef}
              ariaLabel={ARIA_LABEL_MEMBERS_BAR}
              open={isMenuOpen}
              direction={direction}
              onClose={handleCustomMenuClose}
            />
          )}
        </>
      ) : (
        <button className={styles.login} onClick={handleLogin}>
          {avatar}
          <span>{loggedOutText || translatedLoggedOutText}</span>
        </button>
      )}
    </div>
  );
};

export default LoginSocialBar;
