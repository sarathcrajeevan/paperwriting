import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { MinimizedChatLayouts } from '@wix/inbox-common';
import styles from './ChatWidget.scss';
import { MinimizedChat } from '../MinimizedChat/MinimizedChat';
import { useCollapseExpand } from '../../hooks/collapse-expand';
import { useFirstExpandReporter } from '../../hooks/first-expand-reporter';
import { useInstanceRefresher } from '../../hooks/instance-refresher';
import {
  useColors,
  useDesign,
  useLayout,
  useTexts,
  useFonts,
} from '../../hooks/editor-settings';
import { useInitChat } from '../../hooks/chat-init';
import { useServices } from '../../hooks/services-registry';
import {
  AppState,
  AvailabilityStatus,
  useAppState,
} from '../../hooks/app-state';
import { DeviceType, ViewMode } from '../../types/host-sdk';
import { getThumbnail } from './thumbnail';
import { useQab } from '../../hooks/quick-action-button';
import { withSounds } from '@wix/chat-web';
import { useVisitorOnPageReporter } from '../../hooks/visitor-on-page';
import { useHasMessages } from '../../hooks/has-messages';
import { useVisibilityHandler } from '../../hooks/visibility-handler';
import { useNewMessageHandler } from '../../hooks/new-message-handler';
import { usePresence } from '../../hooks/presence';
import { useCorvidCommandApi } from '../../hooks/corvid-api';
import { fallbackFont, WINDOW_POSITION } from '../../constants';
import { useChatSettings } from '../../hooks/chat-settings';
import { useUpdateViewMode } from '../../hooks/update-view-mode';
import { useTranslation } from '@wix/wix-i18n-config';
import { usePresenceClient } from '../../hooks/presence-client';

const ExpandedWidget = React.lazy(
  () =>
    import(
      /* webpackChunkName: "expanded-widget" */ '../ExpandedWidget/ExpandedWidget'
    ),
);

const SocialWidget = React.lazy(
  () =>
    import(
      /* webpackChunkName: "social-widget" */ '../Social/SocialWidget/SocialWidget'
    ),
);

const EditorWidget = React.lazy(
  () =>
    import(
      /* webpackChunkName: "editor-widget" */ '../EditorWidget/EditorWidget'
    ),
);

const MessagePopup = React.lazy(
  () =>
    import(
      /* webpackChunkName: "expanded-widget" */ '../MessagePopup/MessagePopup'
    ),
);

export interface ChatWidgetProps {}

const _ChatWidget: React.FunctionComponent<ChatWidgetProps> = () => {
  const [isLoggedInMember, setIsLoggedInMember] = useState<boolean | undefined>(
    false,
  );

  const texts = useTexts();
  const design = useDesign();
  const layout = useLayout();
  const colors = useColors();
  const fonts = useFonts();
  const collapseExpand = useCollapseExpand();
  const { t } = useTranslation();

  const { hostSdk, fedopsLogger, experiments, biLogger } = useServices();
  const corvidCommandApi = useCorvidCommandApi();
  const { appState }: { appState: AppState } = useAppState();
  const {
    chatSettings: { socialChatEnabled },
  } = useChatSettings();
  const isMobile = appState.deviceType === DeviceType.Mobile;
  const isMembersChat = !!(socialChatEnabled && isLoggedInMember);

  const { isSdkLoaded } = useInitChat(experiments);

  useUpdateViewMode();
  useInstanceRefresher();
  useQab();

  useEffect(() => {
    collapseExpand.collapse();
    hostSdk.reportApplicationLoaded();
    fedopsLogger.appLoaded();
    fedopsLogger.flush();
    biLogger.chatDisplayedEvent(
      appState.deviceType,
      design.minimizedChatLayout,
      appState.host,
    );
    corvidCommandApi.registerCorvidApi();
  }, []);

  useEffect(() => {
    void (async () => {
      const member = await hostSdk.getCurrentMember();
      const isPublicMember = member?.attributes?.privacyStatus === 'PUBLIC';
      const isBlockedMember = member?.status === 'DENIED';

      const _isLoggedInMember = isPublicMember && !isBlockedMember;
      setIsLoggedInMember(_isLoggedInMember);
    })();
  }, []);

  useFirstExpandReporter();
  useVisitorOnPageReporter();
  useHasMessages();
  useVisibilityHandler();
  useNewMessageHandler(isSdkLoaded, isMembersChat);

  const isPresenceOverDuplexerSpecOn = experiments.enabled(
    'specs.PresenceOverDuplexerSpec',
  );

  const isPresenceInTbSpecOn = experiments.enabled(
    'specs.thunderbolt.presenceApi',
  );

  const emptyPresenceFunction = () => ({ markAsActive: () => {} });
  const presenceClientHook = isPresenceOverDuplexerSpecOn
    ? isPresenceInTbSpecOn
      ? emptyPresenceFunction
      : usePresenceClient
    : usePresence;

  const { markAsActive } = presenceClientHook();

  const thumbnail = getThumbnail(
    design,
    appState.businessInfo?.image,
    collapseExpand.isExpanded,
    isMembersChat,
    hostSdk.getResizedImgUrl,
  );
  const borderRadius = isMobile ? '24' : design.selectedRadiusOption;

  const isInEditingExperience = appState.viewMode === ViewMode.Editor;

  const isOnline = appState.availabilityStatus === AvailabilityStatus.Available;
  const title = isMembersChat
    ? t('social.chatroom-list.title')
    : isOnline
    ? texts.onlineTitle
    : texts.offlineTitle;

  const isChatVisible =
    appState.isVisible ||
    !experiments.enabled('specs.chat.DisableAutoMessagesInHiddenPages');

  return (
    <div
      data-hook="chat-widget"
      ref={(elm) => elm && collapseExpand.setRef(elm)}
      className={classNames(styles.chatWidget, {
        [styles.left]: layout.position === WINDOW_POSITION.BOTTOM_LEFT,
        [styles.right]: layout.position === WINDOW_POSITION.BOTTOM_RIGHT,
        [styles.fixed]:
          design.minimizedChatLayout === MinimizedChatLayouts.Fixed,
        [styles.expanded]: collapseExpand.isExpanded,
        [styles.mobile]: isMobile,
      })}
      onClick={markAsActive}
      role="main"
    >
      {isSdkLoaded && !appState.withQab && isChatVisible && (
        <MessagePopup isMembersChat={isMembersChat} />
      )}
      {isInEditingExperience && <EditorWidget />}
      {collapseExpand.isExpanded && isSdkLoaded && isChatVisible && (
        <>{isMembersChat ? <SocialWidget /> : <ExpandedWidget />}</>
      )}
      {collapseExpand.isCollapsed &&
        !appState.withQab &&
        appState.isVisible &&
        appState.editorSettingsLoaded && (
          <div
            data-hook="minimized-chat-wrapper"
            className={styles.minimizedChat}
          >
            <MinimizedChat
              layout={design.minimizedChatLayout}
              text={title}
              thumbnail={thumbnail}
              textColor={colors.minimizedChatTextColor.value}
              backgroundColor={colors.minimizedChatBackgroundColor.value}
              borderRadius={borderRadius}
              font={[fonts.header, fallbackFont].join(', ')}
              unreadCount={appState.unreadCount}
              onClick={() => collapseExpand.toggle('uou', 'widget')}
            />
          </div>
        )}
    </div>
  );
};

_ChatWidget.displayName = 'ChatWidget';

export const ChatWidget = withSounds<ChatWidgetProps>({
  isChatActivePredicate: () => true,
})(_ChatWidget);
