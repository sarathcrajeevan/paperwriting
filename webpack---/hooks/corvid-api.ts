import { useServices } from './services-registry';
import { useCollapseExpand } from './collapse-expand';
import { loadingScheduler } from '../v1/services/loading-scheduler';
import { Message } from '@wix/chat-sdk';
import { AvailabilityStatus, useAppState } from './app-state';
import { triggerInteractivity } from '../init/chat-loader';
import { useChatSettings } from './chat-settings';
import { WIX_CODE_CHATROOM_TYPE } from '@wix/wix-chat-transform-bo-events';

export enum CorvidReportEvent {
  ChatIsReady = 'ChatWidget.isReady',
  MessageReceived = 'ChatWidget.onMessageReceived',
  MessageSent = 'ChatWidget.onMessageSent',
  ButtonInteraction = 'ChatWidget.onButtonInteraction',
  WidgetCollapsed = 'ChatWidget.onWidgetCollapsed',
  WidgetExpand = 'ChatWidget.onWidgetExpand',
}

export enum CorvidCommand {
  SendMessage = 'ChatWidget.sendMessage',
  ExpandWidget = 'ChatWidget.expandWidget',
  CollapseWidget = 'ChatWidget.collapseWidget',
  GetChatState = 'ChatWidget.getChatState',
  StartPrivateChat = 'ChatWidget.startPrivateChat',
  FocusChannel = 'ChatWidget.focusChannel',
  GetChatSettings = 'ChatWidget.getChatSettings',
  GetChannel = 'ChatWidget.getChannel',
  // ChatWidget.startChannel - was in old widget but it's undocumented. need to figure out if it's used somewhere.
}

export const useCorvidApi = () => {
  const { hostSdk } = useServices();

  const reportMessageReceived = (message: any) =>
    hostSdk.publishToPubSub(CorvidReportEvent.MessageReceived, message);
  const reportMessageSent = (message: any) =>
    hostSdk.publishToPubSub(CorvidReportEvent.MessageSent, message);

  const reportButtonInteraction = (button: any) =>
    hostSdk.publishToPubSub(CorvidReportEvent.ButtonInteraction, button);

  const reportWidgetCollapsed = () =>
    hostSdk.publishToPubSub(CorvidReportEvent.WidgetCollapsed);
  const reportWidgetExpand = () =>
    hostSdk.publishToPubSub(CorvidReportEvent.WidgetExpand);

  return {
    reportMessageReceived,
    reportMessageSent,
    reportButtonInteraction,
    reportWidgetCollapsed,
    reportWidgetExpand,
  };
};

let ce; // FIXME temp solution registerCorvidApi should be called once and still make collapseExpand update

export const useCorvidCommandApi = () => {
  const { hostSdk } = useServices();
  const collapseExpand = useCollapseExpand();
  const { appState, updateAppState, allowInput } = useAppState();
  const { chatSettings } = useChatSettings();
  ce = collapseExpand;

  const respondToEvent = (
    viewerSubscribeResponseEvent: CorvidCommand,
    requestId: string | null,
    success: boolean = true,
    results?: object | null,
  ) => {
    if (requestId) {
      const responseEvent = `${viewerSubscribeResponseEvent}Response.${requestId}`;
      hostSdk.publishToPubSub(
        responseEvent,
        results ? { success, results } : { success },
      );
    }
  };

  const handleSendMessageRequest = async (options: any = {}) => {
    const {
      message,
      chatroom,
      requestId,
    }: {
      message: string;
      chatroom?: string;
      requestId: string;
    } = options.data || {};

    if (!message) {
      console.error('`message` must be populated when sending message');
      return respondToEvent(CorvidCommand.SendMessage, requestId, false);
    }

    try {
      const defaultChatroomId = appState.businessChatroomId ?? '';
      const userId = appState.visitorId;
      const createdAt = new Date().getDate();
      const messageParam = {
        createdAt,
        summary: message,
        chatroomId: chatroom ? chatroom : defaultChatroomId,
        sender: {
          type: 'Visitor',
          userId,
        },
        text: message,
        data: [{ data: { text: message } }],
      };

      const {
        chatSdk,
        Message: { fromText },
      } = await import(
        /* webpackChunkName: "expanded-widget" */ '@wix/chat-sdk'
      );
      const messageObj: Message = fromText(messageParam);
      triggerInteractivity();
      await loadingScheduler.onConnective();

      chatSdk.sendMessage(messageObj);
      respondToEvent(CorvidCommand.SendMessage, requestId);
    } catch (e) {
      return respondToEvent(CorvidCommand.SendMessage, requestId, false);
    }
  };

  const handleCollapseWidgetRequest = async (options: any = {}) => {
    await ce.collapse();
    respondToEvent(CorvidCommand.CollapseWidget, options.data?.requestId);
  };

  const handleExpandWidgetRequest = async (options: any = {}) => {
    await ce.expand();
    respondToEvent(CorvidCommand.ExpandWidget, options.data?.requestId);
  };

  const handleGetChatStateRequest = async (options: any = {}) => {
    const { chatSdk } = await import(
      /* webpackChunkName: "expanded-widget" */ '@wix/chat-sdk'
    );
    triggerInteractivity();
    await loadingScheduler.onConnective();

    const chatrooms = await new Promise(async (resolve) => {
      return chatSdk.subscribeToChatRoomsList({
        callback: ({ rooms }) => rooms && resolve(rooms),
      });
    });

    respondToEvent(CorvidCommand.GetChatState, options.data?.requestId, true, {
      isWidgetExpanded: ce.isExpanded,
      isWidgetCollapsed: !ce.isExpanded,
      isWidgetAvailable:
        appState.availabilityStatus === AvailabilityStatus.Available,
      isWidgetAllowInput: allowInput,
      isWidgetHasMessages: appState.hasMessages,
      wasWidgetLeadCaptureFormFilled: appState.wasLCFSent,
      currentChatroom: appState.currentChatroom?.id ?? null,
      businessChatroom: appState.businessChatroomId,
      chatrooms,
    });
  };

  const handleStartPrivateChatRequest = async (options: any = {}) => {
    if (options.data?.userId) {
      updateAppState({ activeSocialMemberId: options.data?.userId });
      collapseExpand.expand();
    }

    respondToEvent(CorvidCommand.StartPrivateChat, options.data?.requestId);
  };

  const handleFocusChannelRequest = async (options: any = {}) => {
    const { requestId, channelId, type } = options.data ?? {};

    if (!channelId && type !== 'Business') {
      respondToEvent(CorvidCommand.FocusChannel, requestId, false);
    }

    const chatroomId =
      !channelId && type === 'Business'
        ? appState.businessChatroomId
        : channelId;

    if (chatroomId) {
      if (chatSettings.socialChatEnabled) {
        updateAppState({ activeSocialChatroomId: chatroomId });
      }
      collapseExpand.expand();
    }

    respondToEvent(CorvidCommand.FocusChannel, requestId);
  };

  const handleGetChatSettingsRequest = async (options: any = {}) => {
    const { requestId } = options.data ?? {};

    const results = {
      isSocialChat: chatSettings.socialChatEnabled,
      isBusinessChat: chatSettings.businessChatEnabled,
    };

    respondToEvent(CorvidCommand.GetChatSettings, requestId, true, results);
  };

  const handleGetChannelRequest = async (options: any = {}) => {
    const { requestId, channelId, type } = options.data ?? {};

    const retrieveId = () => {
      if (type === WIX_CODE_CHATROOM_TYPE.BUSINESS) {
        return appState.businessChatroomId;
      }
      if (type === WIX_CODE_CHATROOM_TYPE.FOCUSED) {
        return appState.currentChatroom?.id ?? appState.businessChatroomId;
      }
    };

    const id = channelId ?? retrieveId();

    if (!id) {
      respondToEvent(CorvidCommand.GetChannel, requestId, false);
    }

    const { chatSdk } = await import(
      /* webpackChunkName: "expanded-widget" */ '@wix/chat-sdk'
    );
    triggerInteractivity();
    await loadingScheduler.onConnective();

    const room = await chatSdk.getChatroom({
      chatroomId: id,
    });

    const results = {
      channel: room,
      type:
        id === appState.businessChatroomId
          ? WIX_CODE_CHATROOM_TYPE.BUSINESS
          : WIX_CODE_CHATROOM_TYPE.SOCIAL,
    };

    respondToEvent(CorvidCommand.GetChannel, requestId, true, results);
  };

  const registerCorvidApi = () => {
    hostSdk.subscribeToPubSub(
      CorvidCommand.ExpandWidget,
      handleExpandWidgetRequest,
      true,
    );

    hostSdk.subscribeToPubSub(
      CorvidCommand.CollapseWidget,
      handleCollapseWidgetRequest,
    );

    hostSdk.subscribeToPubSub(
      CorvidCommand.GetChatState,
      handleGetChatStateRequest,
    );

    hostSdk.subscribeToPubSub(
      CorvidCommand.SendMessage,
      handleSendMessageRequest,
    );

    hostSdk.subscribeToPubSub(
      CorvidCommand.StartPrivateChat,
      handleStartPrivateChatRequest,
    );

    hostSdk.subscribeToPubSub(
      CorvidCommand.FocusChannel,
      handleFocusChannelRequest,
    );

    hostSdk.subscribeToPubSub(
      CorvidCommand.GetChatSettings,
      handleGetChatSettingsRequest,
    );

    hostSdk.subscribeToPubSub(
      CorvidCommand.GetChannel,
      handleGetChannelRequest,
    );

    hostSdk.publishToPubSub(CorvidReportEvent.ChatIsReady);
  };

  return {
    registerCorvidApi,
  };
};
