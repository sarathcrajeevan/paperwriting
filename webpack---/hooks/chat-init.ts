import { useEffect } from 'react';
import { loadingScheduler } from '../v1/services/loading-scheduler';
import * as chatPremium from '@wix/chat-premium';
import { useInitChatSdk } from './chat-sdk';
import { useAppState } from './app-state';
import { useServices } from './services-registry';
import { useCollapseExpand } from './collapse-expand';
import { useVisitorMerge } from './visitor-merge';
import { appStateFromChatInitResult } from '../services/init-data';
import { triggerInteractivity } from '../init/chat-loader';
import { ViewMode } from '../types/host-sdk';

export const useInitChat = (experiments) => {
  const { appState, updateAppState } = useAppState();
  const { isExpanded } = useCollapseExpand();
  const { serverApi, hostSdk } = useServices();

  const initChat = async ({ reconnect = false } = {}) => {
    const { correlationId, deviceType, viewMode } = appState;

    const reconnectData = reconnect
      ? {
          refresh: true,
          oldVisitorInstanceId: appState.visitorInstanceId,
          prevChatToken: appState.coreChatToken,
        }
      : undefined;

    const chatInitResult = await serverApi.initChat({
      correlationId,
      deviceType,
      randomChatroom:
        experiments.enabled('specs.chat.RandomChatroomInPreview') &&
        (viewMode === ViewMode.Preview || viewMode === ViewMode.Editor),
      ...reconnectData,
    });

    updateAppState({
      ...appStateFromChatInitResult(chatInitResult),
      ...(reconnect ? { isContact: true } : undefined),
    });
  };

  useEffect(() => {
    if (isExpanded) {
      triggerInteractivity();
    }
  }, [isExpanded]);

  useEffect(() => {
    void loadingScheduler.onInteractive().then(() => {
      if (!appState.chatroomId) {
        void initChat();
      }
    });
    return () => {};
  }, []);

  const isSdkLoaded = useInitChatSdk({
    coreChatToken: appState.coreChatToken,
    instance: appState.instance,
    experiments: experiments.all(),
  });

  useVisitorMerge(initChat);

  useEffect(() => {
    void (async () => {
      if (appState.isBranded) {
        const { chat, ascend } = await hostSdk.getVendorProductIds();
        const isPremium = chatPremium.isPremium(chat, ascend);
        if (isPremium) {
          updateAppState({ isBranded: false });
        }
      }
    })();
  }, [appState.isBranded]);

  return { isSdkLoaded };
};
