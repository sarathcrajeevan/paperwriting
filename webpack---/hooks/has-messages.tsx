import { chatEventEmitter } from '@wix/chat-sdk';
import { useCallback, useEffect } from 'react';
import { useAppState } from './app-state';
import { useServices } from './services-registry';

export const useHasMessages = () => {
  const {
    appState: { chatroomId },
    updateAppState,
  } = useAppState();
  const { experiments } = useServices();

  useEffect(() => {
    return () => updateAppState({ hasMessages: false });
  }, [chatroomId]);

  const setHasMessagesTrue = useCallback((message) => {
    if (
      !experiments.enabled('specs.chat.DisableAutoMessagesInHiddenPages') ||
      message.pluginName !== 'Engage'
    ) {
      updateAppState({ hasMessages: true });
    }
  }, []);

  useEffect(() => {
    chatEventEmitter.addListener(
      chatEventEmitter.CHAT_EVENTS.NEW_REALTIME_MESSAGE,
      setHasMessagesTrue,
    );

    return () =>
      chatEventEmitter.removeListener(
        chatEventEmitter.CHAT_EVENTS.NEW_REALTIME_MESSAGE,
        setHasMessagesTrue,
      );
  }, []);
};
