import { useEffect, useState } from 'react';
import { useAppState } from './app-state';
import { useCollapseExpand } from './collapse-expand';
import { useServices } from './services-registry';

export const useFirstExpandReporter = () => {
  const collapseExpand = useCollapseExpand();
  const [wasFirstExpandReported, setFirstExpandReported] = useState(false);
  const { serverApi, experiments } = useServices();
  const { allowInput } = useAppState();

  useEffect(() => {
    if (collapseExpand.isExpanded && !wasFirstExpandReported) {
      serverApi.reportFirstExpand(allowInput);
      serverApi.reportChatWidgetOpen();
      setFirstExpandReported(true);
    }
  }, [
    collapseExpand.isExpanded,
    wasFirstExpandReported,
    serverApi,
    allowInput,
  ]);
};
