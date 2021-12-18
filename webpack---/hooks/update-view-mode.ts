import { useEffect } from 'react';

import { useServices } from './services-registry';
import { useAppState } from './app-state';
import { useCollapseExpand } from './collapse-expand';

export const useUpdateViewMode = () => {
  const { hostSdk } = useServices();
  const { updateAppState } = useAppState();
  const { collapse } = useCollapseExpand();

  useEffect(() => {
    const handler = ({ editMode }) => {
      updateAppState({ viewMode: editMode });
      collapse();
    };
    const subscriber = hostSdk.subscribeToEditModeChange(handler);
    return () => subscriber();
  }, [collapse]);
};
