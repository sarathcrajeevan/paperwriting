import React, { useEffect } from 'react';
import classNames from 'classnames';
import styles from './MessagePopup.scss';
import { useTheme } from '../../hooks/theme';
import { useAppState } from '../../hooks/app-state';
import { useCollapseExpand } from '../../hooks/collapse-expand';
import X from 'wix-ui-icons-common/X';
import { useTranslation } from '@wix/wix-i18n-config';
import { DeviceType, ViewMode } from '../../types/host-sdk';
import { useEditorState } from '../../hooks/editor-state';
import {
  useSenderIdentity,
  WidgetSenderIdentityType,
} from '../../hooks/chat-settings';

export interface MessagePopupProps {
  isMembersChat?: boolean;
}

export const MessagePopup: React.FunctionComponent<MessagePopupProps> = ({
  isMembersChat,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const collapseExpand = useCollapseExpand();
  const senderIdentity = useSenderIdentity();
  const { appState, updateAppState } = useAppState();
  const isMobile = appState.deviceType === DeviceType.Mobile;
  const popupStyle = {
    backgroundColor: theme.messageNotification.backgroundColor,
    borderRadius: theme.messageNotification.borderRadius,
    borderWidth: theme.messageNotification.borderWidth,
    borderColor: theme.messageNotification.borderColor,
    borderStyle: 'solid',
    color: theme.messageNotification.textColor,
    fontFamily: theme.messageNotification.fontFamily,
  };
  const clickToActionStyle = {
    color: theme.messageNotification.callToActionColor,
  };

  // used to show popup in editor, not to be confused with appState.showMessagePopup
  const { showMessagePopup } = useEditorState();

  const isInEditingExperience = appState.viewMode === ViewMode.Editor;

  useEffect(() => {
    if (isInEditingExperience) {
      if (showMessagePopup) {
        updateAppState({
          messagePopupSenderName: t(
            'popup-message.editor-example.message-sender',
          ),
          messagePopupLastUnreadMessage: t(
            'popup-message.editor-example.message-content',
          ),
          showMessagePopup: true,
        });
        collapseExpand.collapse();
      } else {
        updateAppState({
          showMessagePopup: false,
        });
      }
    }
  }, [showMessagePopup, isInEditingExperience]);

  const onCallToActionClick = async () => {
    const unreadCount = 0;
    const maybeUnreadCount = isMembersChat ? {} : { unreadCount };

    updateAppState({ showMessagePopup: false, ...maybeUnreadCount });

    await collapseExpand.expand('uou', 'message indication');
  };

  const isSenderIdentityIncludeTitle =
    appState.messagePopupSenderName &&
    (senderIdentity === WidgetSenderIdentityType.BUSINESS ||
      senderIdentity === WidgetSenderIdentityType.AGENT);

  const isTitleShouldBeDisplay =
    isSenderIdentityIncludeTitle || isInEditingExperience;

  return (
    <div
      style={popupStyle}
      data-hook="message-popup"
      className={classNames(styles.messagePopup, {
        [styles.showPopupMessage]:
          appState.showMessagePopup && collapseExpand.isCollapsed,
        [styles.mobile]: isMobile,
        [styles.desktop]: !isMobile,
      })}
      onClick={onCallToActionClick}
      role="alert"
      aria-label={t('popup-message.alert-aria-label')}
      aria-describedby="message-popup-content"
    >
      <button
        className={styles.closeButton}
        onClick={(evt) => {
          evt.stopPropagation();
          updateAppState({ showMessagePopup: false });
          collapseExpand.collapse();
        }}
        data-hook="message-popup-close-button"
        aria-label={t('popup-message.close-button.aria-label')}
      >
        <div
          className={styles.closeButtonWithHover}
          style={{ backgroundColor: theme.header.textColor }}
        />
        <X />
      </button>
      <div id="message-popup-content">
        <div className={styles.lastMessage}>
          {isTitleShouldBeDisplay && (
            <span
              className={styles.senderName}
              data-hook="message-popup-sender-name"
            >
              {`${appState.messagePopupSenderName}: `}
            </span>
          )}
          <span
            className={styles.lastMessageText}
            data-hook="message-popup-last-message"
          >
            {appState.messagePopupLastUnreadMessage}
          </span>
        </div>
        {appState.unreadCount > 1 && (
          <div
            className={styles.moreMessages}
            data-hook="message-popup-more-messages"
          >
            {t('popup-message.more-messages', {
              numberMessages: appState.unreadCount - 1,
            })}
          </div>
        )}
      </div>
      <button
        className={styles.clickToAction}
        style={clickToActionStyle}
        onClick={() => onCallToActionClick()}
        data-hook="message-popup-click-to-action"
      >
        {t('popup-message.click-to-action')}
      </button>
    </div>
  );
};

MessagePopup.displayName = 'MessagePopup';

export default MessagePopup;
