import React from 'react';
import classNames from 'classnames';
import { useTranslation } from '@wix/wix-i18n-config';
import {
  AppMode,
  AvatarConfig,
  ChatConfigurationProvider,
  ChatRoomScreen,
  ControlledChatRoomScreen,
  MessageDisplayConfig,
  TitleConfig,
} from '@wix/chat-web';
import FocusTrap from 'focus-trap-react';
import { MinimizedChatLayouts } from '@wix/inbox-common';
import styles from './ExpandedWidget.scss';
import { Header } from '../Header/Header';
import { useCollapseExpand } from '../../hooks/collapse-expand';
import { useBehaviour, useDesign, useTexts } from '../../hooks/editor-settings';
import { AvailabilityStatus, useAppState } from '../../hooks/app-state';
import { useTheme } from '../../hooks/theme';
import { DeviceType, ViewMode } from '../../types/host-sdk';
import { useEditorState } from '../../hooks/editor-state';
import {
  useSenderIdentity,
  useTransformedSendersData,
  WidgetSenderIdentityType,
} from '../../hooks/chat-settings';
import { useChatPlugins } from '../../hooks/chat-plugins';
import { Branding } from '../Branding/Branding';
import { useImageHandlers } from '../../hooks/image-handlers';
import { useAwayMessageHandler } from '../../hooks/away-message-handler';
import { useChatroomEventHooks } from '../../hooks/chatroom-event-hooks';
import { Loader } from './Loader';

export interface ExpandedWidgetProps {}

export const ExpandedWidget: React.FunctionComponent<ExpandedWidgetProps> =
  ({}) => {
    const { t } = useTranslation();
    const texts = useTexts();
    const behaviour = useBehaviour();
    const design = useDesign();
    const collapseExpand = useCollapseExpand();
    const { appState, allowInput } = useAppState();
    const theme = useTheme();
    const senderIdentity = useSenderIdentity();
    const senderData = useTransformedSendersData();
    const { handleImageClick, handleUploadFile } = useImageHandlers();
    useChatPlugins();
    useAwayMessageHandler();
    const { eventHooks } = useChatroomEventHooks();

    const isMobile = appState.deviceType === DeviceType.Mobile;
    const isOnline =
      appState.availabilityStatus === AvailabilityStatus.Available;
    const title =
      texts.businessName || appState.businessInfo?.name || texts.onlineTitle;

    const subtitleByAvailabilty = isOnline
      ? t('header.availability.online')
      : undefined;
    const subtitle = behaviour.responseTimeEnabled
      ? texts.responseTime
      : subtitleByAvailabilty;

    const messageDisplayOption: MessageDisplayConfig =
      senderIdentity !== WidgetSenderIdentityType.ANONYMOUS
        ? {
            avatarOption: AvatarConfig.INCOMING,
            titleOption: TitleConfig.INCOMING,
          }
        : {
            avatarOption: AvatarConfig.NONE,
            titleOption: TitleConfig.NONE,
          };

    const isInEditingExperience = appState.viewMode === ViewMode.Editor;

    const { messagesList, showSendButton } = useEditorState();

    const wrapWithChatConfigProvider = (chatroomScreen) => (
      <ChatConfigurationProvider
        onImageMessageClick={handleImageClick as any} // TODO as any
        allowInput={allowInput}
        disableAutoMessages={appState.disableAutoMessages}
      >
        {chatroomScreen}
      </ChatConfigurationProvider>
    );

    const chatRoom = () =>
      wrapWithChatConfigProvider(
        <ChatRoomScreen
          chatroomId={appState.chatroomId as string}
          instanceId={appState.instanceId}
          appMode={AppMode.Widget}
          locale={appState.language}
          onUploadFile={handleUploadFile}
          theme={theme.chatWeb}
          messageDisplayOption={messageDisplayOption}
          sendersData={senderData}
          isMobile={isMobile}
          isVisible={true}
          inputPlaceholder={texts.messageTextBox}
          banner={appState.isBranded ? <Branding /> : undefined}
          eventHooks={eventHooks}
          loadingState={<Loader />}
          sendOnEnter={!isMobile}
        />,
      );

    const editorChatRoom = () =>
      wrapWithChatConfigProvider(
        <ControlledChatRoomScreen
          messages={messagesList}
          isExpanded={true}
          locale={appState.language}
          theme={theme.chatWeb}
          messageDisplayOption={messageDisplayOption}
          sendersData={senderData}
          isMobile={isMobile}
          isVisible={true}
          banner={appState.isBranded ? <Branding /> : undefined}
          inputPlaceholder={texts.messageTextBox}
          showSendButton={showSendButton}
          eventHooks={eventHooks}
        />,
      );

    return (
      <FocusTrap
        focusTrapOptions={{
          clickOutsideDeactivates: true,
        }}
      >
        <div
          data-hook="expanded-widget"
          className={classNames(styles.expandedWidget, {
            [styles.mobile]: isMobile,
            [styles.floating]:
              !isMobile &&
              design.minimizedChatLayout !== MinimizedChatLayouts.Fixed,
          })}
          style={
            isMobile
              ? {}
              : {
                  borderRadius: theme.widget.borderRadius,
                  borderColor: theme.widget.borderColor,
                  borderWidth: theme.widget.borderWidth,
                  borderStyle: theme.widget.borderStyle,
                }
          }
        >
          <div className={styles.header}>
            <Header
              title={title}
              subtitle={subtitle}
              imageUrl={theme.header.imageUrl}
              imageSvg={theme.header.imageSvg}
              onlineIndicator={isOnline}
              onClose={
                !isInEditingExperience ? collapseExpand.collapse : () => {}
              }
              textColor={theme.header.textColor}
              backgroundColor={theme.header.backgroundColor}
              font={theme.header.font}
              closeButtonLabel={t('header.close-button.aria-label')}
            />
          </div>
          <div className={styles.chatroom}>
            {isInEditingExperience ? editorChatRoom() : chatRoom()}
          </div>
        </div>
      </FocusTrap>
    );
  };

ExpandedWidget.displayName = 'ExpandedWidget';

export default ExpandedWidget;
