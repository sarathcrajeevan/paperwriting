import { useEffect } from 'react';
import { chatEventEmitter } from '@wix/chat-sdk';
import { triggerInteractivity } from '../init/chat-loader';

export const useVisitorMerge = (initChat: ({ reconnect: boolean }) => void) => {
  const onVisitorMerge = (event) => {
    if (event.subType !== 'VisitorMerge') {
      return;
    }

    if (
      !event.mergedIntoChatroomId ||
      event.mergedIntoChatroomId === event.visitorChatroomId
    ) {
      return;
    }

    triggerInteractivity();
    initChat({ reconnect: true });
  };

  useEffect(() => {
    chatEventEmitter.addListener(
      chatEventEmitter.CHAT_EVENTS.EXTERNAL_HOST,
      onVisitorMerge,
    );

    return () => {
      chatEventEmitter.removeListener(
        chatEventEmitter.CHAT_EVENTS.EXTERNAL_HOST,
        onVisitorMerge,
      );
    };
  }, []);
};
