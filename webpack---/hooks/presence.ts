import { useEffect, useRef, useState } from 'react';
import { loadingScheduler } from '../v1/services/loading-scheduler';
import { useAppState } from './app-state';
import { useServices } from './services-registry';
import { useSubscribeToPageNavigation } from './page-navigation';
import { useFirebase, FIREBASE_TIMESTAMP } from './firebase';
import { DeviceType, ViewMode } from '../types/host-sdk';

export interface Presence {
  deviceType: DeviceType;
  location: string;
  timestamp: string | number;
  derivedChatroomId: string;
  isContact: boolean;
  lastSeenTimestamp: any;
  pageName: string;
}

export const usePresence = () => {
  const [presence, setPresence] = useState<Presence>({} as Presence);
  const lastActiveTimestamp = useRef(Date.now());

  const updatePresence = (updatedPresence: Partial<Presence>) =>
    setPresence((prevState) => ({
      ...prevState,
      ...updatedPresence,
    }));

  useReportPresenceOnChange(presence);
  const { goOffline } = useFirebase(presence, updatePresence);

  const markAsActive = () => (lastActiveTimestamp.current = Date.now());

  useSetInitialPresence(updatePresence);
  useSyncPageTitle(updatePresence);
  useSyncIsContact(updatePresence, presence);
  useSyncChatroomId(updatePresence, presence);

  useHeartbeat(updatePresence, lastActiveTimestamp, goOffline);

  return {
    markAsActive,
  };
};

const useReportPresenceOnChange = (presence: Presence) => {
  const { appState } = useAppState();

  useEffect(() => {
    if (
      !appState.isBot &&
      appState.firebase &&
      presence.pageName &&
      presence.derivedChatroomId &&
      appState.viewMode !== ViewMode.Editor
    ) {
      void loadingScheduler.onConnective().then(async () => {
        const chatSdk = await import(
          /* webpackChunkName: "expanded-widget" */ '@wix/chat-sdk'
        );

        const group = (appState.firebase?.presencePath ?? '').split('/')[1];
        const sessionId = (appState.visitorInstanceId ?? '').split('|')[1];

        await chatSdk.chatSdk.presence.set(sessionId, group, presence);
      });
    }
  }, [presence, appState.viewMode]);
};

const useSetInitialPresence = (
  updatePresence: (presence: Partial<Presence>) => void,
) => {
  const { appState } = useAppState();
  const { hostSdk, visitCounter } = useServices();

  useEffect(() => {
    void (async () => {
      await visitCounter.increaseVisitNumber();

      const data = {
        deviceType: appState.deviceType,
        location: appState.location ?? '',
        timestamp: appState.timestamp ?? '',
        derivedChatroomId: appState.chatroomId ?? '',
        isContact: appState.isContact,
        lastSeenTimestamp: FIREBASE_TIMESTAMP,
        pageName: (await hostSdk.getPageTitle()) ?? '',
        visitCount: await visitCounter.getVisitNumber(),
      };

      updatePresence(data);
    })();
  }, []);
};

const useSyncIsContact = (
  updatePresence: (presence: Partial<Presence>) => void,
  presence: Presence,
) => {
  const { appState } = useAppState();

  useEffect(() => {
    void (() => {
      if (
        presence.isContact !== undefined &&
        presence.isContact !== appState.isContact
      ) {
        const data = {
          isContact: appState.isContact,
        };
        updatePresence(data);
      }
    })();
  }, [appState.isContact]);
};

const useSyncChatroomId = (
  updatePresence: (presence: Partial<Presence>) => void,
  presence: Presence,
) => {
  const { appState } = useAppState();

  useEffect(() => {
    void (() => {
      if (
        presence.derivedChatroomId !== undefined &&
        presence.derivedChatroomId !== appState.chatroomId
      ) {
        const data = {
          derivedChatroomId: appState.chatroomId,
        };
        updatePresence(data);
      }
    })();
  }, [appState.chatroomId]);
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

const useHeartbeat = (
  updatePresence: (presence: Partial<Presence>) => void,
  lastActiveTimestamp: React.RefObject<number>,
  goOffline: () => void,
) => {
  const intervalId = useRef<number>();

  useEffect(() => {
    const HEARTBEAT_INTERVAL = 90 * 1000; // 1.5 minutes
    const MAX_IDLE_TIME = 120; // 2 hours (in minutes)

    intervalId.current = window.setInterval(() => {
      const idleTime = diffMinutes(
        lastActiveTimestamp.current ?? Date.now(),
        Date.now(),
      );
      const shouldDisconnect = idleTime >= MAX_IDLE_TIME;

      if (shouldDisconnect) {
        window.clearInterval(intervalId.current);
        intervalId.current = undefined;
        goOffline();
      } else {
        updatePresence({
          lastSeenTimestamp: FIREBASE_TIMESTAMP,
        });
      }
    }, HEARTBEAT_INTERVAL);

    return () => window.clearInterval(intervalId.current);
  }, []);
};

const diffMinutes = (from: number, to: number) => {
  const diffMs = to - from;
  return Math.floor(diffMs / 60000);
};
