import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { ChatIcons, MinimizedChatLayouts } from '@wix/inbox-common';
import styles from './MinimizedChat.scss';
import { getIconComponent, getImageComponent, isIcon } from './icons';
import { AppState } from '../../hooks/app-state';

export interface MinimizedChatProps {
  layout: MinimizedChatLayouts;
  thumbnail?: ChatIcons | string;
  text?: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  font?: string;
  unreadCount: AppState['unreadCount'];
  onClick?(): void;
}

export const MinimizedChat: React.FunctionComponent<MinimizedChatProps> = ({
  layout,
  thumbnail,
  text,
  backgroundColor,
  textColor,
  borderRadius,
  font,
  unreadCount,
  onClick,
}) => {
  const [numberOfUnread, setNumberOfUnread] = useState(0);
  const iconLayout = layout === MinimizedChatLayouts.Icon;
  const withImageThumbnail = thumbnail && !isIcon(thumbnail);
  const iconSize = iconLayout ? '32px' : '26px';
  const imageSize = iconLayout ? '100%' : '32px';
  const adjustedBorderRadius = adjustBorderRadius(borderRadius, layout);

  const rootClasses = {
    [styles.iconLayout]: iconLayout,
    [styles.withImageThumbnail]: withImageThumbnail,
    [styles.fixedLayout]: layout === MinimizedChatLayouts.Fixed,
    [styles.iconLayout]: layout === MinimizedChatLayouts.Icon,
    [styles.floatingLayout]: layout === MinimizedChatLayouts.Floating,
  };

  const borderRadiusForLegacyIcons = thumbnail?.startsWith('legacy-')
    ? '50%'
    : '0';
  const thumbnailComponent = thumbnail
    ? isIcon(thumbnail)
      ? getIconComponent(
          thumbnail,
          textColor,
          iconSize,
          borderRadiusForLegacyIcons,
        )
      : getImageComponent(
          thumbnail,
          imageSize,
          iconLayout ? adjustedBorderRadius : '50%',
        )
    : undefined;

  useEffect(() => setNumberOfUnread(unreadCount ?? 0), [unreadCount]);

  const UnreadPimple: React.FunctionComponent = () => {
    const pimpleClasses = {
      [styles.border24]: borderRadius === '24',
      [styles.noBorder24]: borderRadius !== '24',
      [styles.noIconLayout]: layout !== MinimizedChatLayouts.Icon,
      [styles.twodigit]: numberOfUnread > 9,
    };
    return (
      <div
        data-hook="unread-pimple"
        className={classNames(styles.unreadPimple, pimpleClasses)}
      >
        {numberOfUnread <= 99 ? numberOfUnread : '+99'}
      </div>
    );
  };

  return (
    <button
      data-hook="minimized-chat"
      className={classNames(styles.minimizedChat, rootClasses)}
      style={{
        color: textColor,
        backgroundColor,
        borderRadius: adjustedBorderRadius,
      }}
      id="minimized-chat"
      onClick={onClick}
    >
      {numberOfUnread > 0 && <UnreadPimple />}
      {thumbnailComponent}
      {text ? (
        <h2
          data-hook="text"
          className={classNames(styles.text, {
            [styles.srOnly]: iconLayout,
          })}
          style={{
            fontFamily: font,
          }}
        >
          {text}
        </h2>
      ) : undefined}
    </button>
  );
};

MinimizedChat.displayName = 'MinimizedChat';

const adjustBorderRadius = (
  borderRadius: string,
  layout: MinimizedChatLayouts,
) => {
  if (borderRadius === '24') {
    if (layout === MinimizedChatLayouts.Icon) {
      return '50%';
    }
    if (layout === MinimizedChatLayouts.Floating) {
      return '30px';
    }
  }
  return `${borderRadius}px`;
};
