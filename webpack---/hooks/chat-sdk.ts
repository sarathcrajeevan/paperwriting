import { useEffect, useState } from 'react';
import { loadingScheduler } from '../v1/services/loading-scheduler';
import { chatEventEmitter } from '@wix/chat-sdk';
import { useCorvidApi } from './corvid-api';
import { useAppState } from './app-state';

export const useInitChatSdk = ({ coreChatToken, experiments, instance }) => {
  const [isSdkLoaded, setSdkLoaded] = useState(false);
  const { appState } = useAppState();
  const corvidApi = useCorvidApi();

  useEffect(() => {
    const onNewRealtimeMessage = (message) =>
      corvidApi.reportMessageReceived(message);

    void loadingScheduler.onInteractive().then(async () => {
      if (!coreChatToken) {
        return;
      }
      const linguistHeader = [
        appState.language,
        appState.locale,
        appState.isPrimaryLanguage,
        appState.instanceId,
      ].join('|');

      const chatSdk = await import(
        /* webpackChunkName: "expanded-widget" */ '@wix/chat-sdk'
      );

      const isPresenceOverDuplexerEnabled = experiments
        ? experiments['specs.PresenceOverDuplexerSpec'] === 'true'
        : false;

      chatSdk.chatSdk.init({
        chatServerUrl: '/',
        chatToken: coreChatToken,
        preFetch: false,
        experiments,
        httpHeaders: {
          'x-wix-linguist': linguistHeader,
        },
        tokenServer: instance // TODO: Hack to bypass testkit issues
          ? { url: '/_api', authorization: instance }
          : undefined,
        presenceOptions: {
          useNewConvention: false,
          disableWatch: isPresenceOverDuplexerEnabled,
        },
      });

      chatEventEmitter.addListener(
        chatEventEmitter.CHAT_EVENTS.NEW_REALTIME_MESSAGE,
        onNewRealtimeMessage,
      );

      setSdkLoaded(true);
      loadingScheduler.triggerConnectivity();
    });

    return () => {
      void loadingScheduler.onInteractive().then(async () => {
        if (!coreChatToken) {
          return;
        }

        chatEventEmitter.removeListener(
          chatEventEmitter.CHAT_EVENTS.NEW_REALTIME_MESSAGE,
          onNewRealtimeMessage,
        );

        const chatSdk = await import(
          /* webpackChunkName: "expanded-widget" */ '@wix/chat-sdk'
        );
        chatSdk.chatSdk.disconnect();

        setSdkLoaded(false);
      });
    };
  }, [loadingScheduler, coreChatToken, experiments, instance]);

  return isSdkLoaded;
};
