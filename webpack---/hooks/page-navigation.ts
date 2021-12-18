import { useEffect, useState } from 'react';
import { useServices } from './services-registry';

export const useSubscribeToPageNavigation = () => {
  const { hostSdk } = useServices();

  const [pageData, setPageData] = useState<{
    pageId?: string;
    pageTitle?: string;
  }>({});

  const updatePageDataFromHostSdk = async () => {
    const pageId = await hostSdk.getCurrentPageId();
    const pageTitle = await hostSdk.getPageTitle();
    setPageData({ pageId, pageTitle });
  };

  useEffect(() => {
    updatePageDataFromHostSdk().catch();
    return hostSdk.subscribeToPageNavigation(async () => {
      await updatePageDataFromHostSdk();
    });
  }, []);

  return pageData;
};
