import { useEffect, useRef, useState } from 'react';
import { useAppState } from './app-state';
import { DeviceType, ViewMode } from '../types/host-sdk';
import type { Group } from '@wix/presence-client';
import { useServices } from './services-registry';
import { useSubscribeToPageNavigation } from './page-navigation';

const KEEP_ALIVE_INTERVAL = 90 * 1000; // 1.5 minutes
const IDLE_TIMEOUT = 3 * 60 * 60 * 1000; // 3 hours

export interface Presence {
  deviceType: DeviceType;
  location: string;
  timestamp: string | number;
  pageName: string;
  visitCount?: number;
}

export const usePresenceClient = () => {
  const { appState } = useAppState();
  const [presence, setPresence] = useState<Presence>({} as Presence);
  const { hostSdk, visitCounter, duplexer } = useServices();
  const instance = useRef<string>(appState.instance || '');

  useEffect(() => {
    if (appState.instance) {
      instance.current = appState.instance;
    }
  }, [appState.instance]);

  const presenceGroup = useRef<Group<Presence>>();
  const getSignedInstance = () => instance.current;
  //todo: change to connect when added
  const connectPresence = () =>
    presenceGroup.current?.track(() => {}, {
      watchGroup: false,
    });

  useEffect(() => {
    void (async () => {
      if (!appState.isBot && appState.viewMode !== ViewMode.Editor) {
        await visitCounter.increaseVisitNumber();
        const presenceClient = await import('@wix/presence-client');
        const { default: PresenceClient, Scope } = presenceClient;

        const presenceInstance = new PresenceClient({
          duplexer,
          getSignedInstance,
        });

        const initialState = {
          deviceType: appState.deviceType,
          location: appState.location ?? '',
          timestamp: appState.timestamp ?? '',
          pageName: (await hostSdk.getPageTitle()) ?? '',
          visitCount: await visitCounter.getVisitNumber(),
        };
        setPresence(initialState);

        presenceGroup.current = presenceInstance.group(Scope.VIEWER, {
          initialState,
          keepAliveInterval: KEEP_ALIVE_INTERVAL,
          onIdle: () => {
            presenceGroup.current?.disconnect();
          },
          onActive: connectPresence,
          isIdleMs: IDLE_TIMEOUT,
        });
        connectPresence();
      }
    })();
  }, []);

  const updatePresence = (newPresence: Partial<Presence>) => {
    const updatedPresence = {
      ...presence,
      ...newPresence,
    };
    setPresence(updatedPresence);
    if (updatedPresence.pageName && presenceGroup.current) {
      void presenceGroup.current.setState(updatedPresence);
    }
  };

  useSyncChatroomIdAndContact(updatePresence);
  useSyncPageTitle(updatePresence);

  // for avoiding conditional hook error
  return { markAsActive: () => {} };
};

const useSyncChatroomIdAndContact = (
  updatePresence: (presence: Partial<Presence>) => void,
) => {
  const { appState } = useAppState();

  useEffect(
    () => updatePresence({}),
    [appState.chatroomId, appState.isContact],
  );
};

const useSyncPageTitle = (
  updatePresence: (presence: Partial<Presence>) => void,
) => {
  const { pageTitle } = useSubscribeToPageNavigation();

  useEffect(() => {
    if (pageTitle) {
      updatePresence({
        pageName: pageTitle,
      });
    }
  }, [pageTitle]);
};
