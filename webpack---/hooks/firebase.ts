import { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { ViewMode } from '../types/host-sdk';
import { loadingScheduler } from '../v1/services/loading-scheduler';
import { useAppState } from './app-state';
import { Presence } from './presence';

export const FIREBASE_TIMESTAMP = { '.sv': 'timestamp' };

export const useFirebase = (
  presence: Presence,
  updatePresence: (presence: Partial<Presence>) => void,
) => {
  const { appState } = useAppState();
  const [isReady, setIsReady] = useState(false);
  const [isReconnect, setIsReconnect] = useState(false);
  const lastDisconnectionTime = useRef(Date.now());
  const firebase = useRef<firebase.default.app.App>();
  const database = useRef<firebase.default.database.Database>();

  const goOffline = () => database.current?.goOffline();

  const authenticate = async (
    fb: firebase.default.app.App,
    persistence: firebase.default.auth.Auth.Persistence,
    authKey?: string,
  ) => {
    await fb.auth().setPersistence(persistence);
    if (authKey) {
      try {
        await fb.auth().signInWithCustomToken(authKey);
      } catch (e) {
        // swallow, it spams Sentry
      }
    }
  };

  const monitorConnectionStatus = (db: firebase.default.database.Database) => {
    const MAX_OFFLINE_DURATION = 3 * 60 * 1000; // 3 minutes
    const connectionInfoPath = '.info/connected';

    db.ref(connectionInfoPath).on('value', async (status) => {
      const isConnected = status?.val() === true;

      if (isConnected) {
        await db.ref(appState.firebase?.presencePath).onDisconnect().remove?.();

        if (isReconnect) {
          const offlineDuration = Date.now() - lastDisconnectionTime.current;
          if (offlineDuration > MAX_OFFLINE_DURATION) {
            updatePresence({
              timestamp: Date.now(),
            });
          }
        } else {
          setIsReconnect(true);
        }
      } else {
        lastDisconnectionTime.current = Date.now();
      }
    });
  };

  useEffect(() => {
    if (
      !appState.isBot &&
      appState.firebase?.authKey &&
      appState.firebase?.options &&
      appState.firebase?.presencePath &&
      appState.viewMode !== ViewMode.Editor
    ) {
      void loadingScheduler.onConnective().then(async () => {
        setIsReady(false);

        const Firebase = (await import('firebase/app')).default;

        const fb = Firebase.initializeApp(appState.firebase?.options, uuid());

        await authenticate(
          fb,
          Firebase.auth.Auth.Persistence.NONE,
          appState.firebase?.authKey,
        );

        const db = fb.database();
        monitorConnectionStatus(db);

        firebase.current = fb;
        database.current = db;

        setIsReady(true);
      });
    }

    return () => {
      goOffline();
    };
  }, [
    appState.firebase?.presencePath,
    appState.firebase?.authKey,
    appState.firebase?.options,
    appState.viewMode,
  ]);

  useEffect(() => {
    if (
      isReady &&
      !appState.isBot &&
      Object.keys(presence).length &&
      appState.viewMode !== ViewMode.Editor
    ) {
      database.current?.ref(appState.firebase?.presencePath).set(presence);
    }
  }, [presence, isReady, appState.firebase?.presencePath, appState.viewMode]);

  return { goOffline };
};
