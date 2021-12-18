import { useEffect } from 'react';
import { useAppState } from './app-state';
import { useServices } from './services-registry';

export const useInstanceRefresher = () => {
  const { hostSdk } = useServices();
  const { updateAppState } = useAppState();

  useEffect(() => {
    return hostSdk.subscribeToInstanceUpdates((instance) => {
      updateAppState({ instance });
    });
  }, []);
};
