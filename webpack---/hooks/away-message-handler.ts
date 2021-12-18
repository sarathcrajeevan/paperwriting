import { useEffect, useCallback } from 'react';
import { AvailabilityStatus, useAppState } from './app-state';
import { useTexts } from './editor-settings';

export const useAwayMessageHandler = () => {
  const {
    appState: {
      availabilityStatus,
      isContact,
      chatroomId,
      hasMessages,
      wasAwayMessageSent,
    },
    updateAppState,
  } = useAppState();
  const { offlineChatMessage } = useTexts();
  const setAwayMessageSent = useCallback(
    () => updateAppState({ hasMessages: true }),
    [],
  );
  useEffect(() => {
    if (
      !wasAwayMessageSent &&
      availabilityStatus === AvailabilityStatus.Away &&
      isContact &&
      !hasMessages &&
      offlineChatMessage
    ) {
      void (async () => {
        const { chatSdk, Message } = await import(
          /* webpackChunkName: "expanded-widget" */ '@wix/chat-sdk'
        );
        const messageDto = Message.fromText({
          text: offlineChatMessage,
          chatroomId: chatroomId || '',
          userId: 'business',
          summary: offlineChatMessage,
        });
        void chatSdk.addMessage(messageDto);
      })();
      setAwayMessageSent();
    }
  }, [
    wasAwayMessageSent,
    availabilityStatus,
    isContact,
    offlineChatMessage,
    hasMessages,
  ]);
};
