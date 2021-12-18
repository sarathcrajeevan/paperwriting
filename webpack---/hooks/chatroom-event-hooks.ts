import { useAppState } from './app-state';
import { DeviceType } from '../types/host-sdk';
import { useCollapseExpand } from './collapse-expand';
import { useServices } from './services-registry';
import { ChatEventHooks } from '@wix/chat-web';
import { useCorvidApi } from './corvid-api';
import { Button } from '@wix/chat-sdk';

export const CTA_PRODUCT = {
  APP_DEFINITION_ID: '1380b703-ce81-ff05-f115-39571d94dfcd',
  SECTION_ID: 'product_page',
  SECTION_ID_IN_URL: 'product-page',
};

export const useChatroomEventHooks = (): { eventHooks: ChatEventHooks } => {
  const collapseExpand = useCollapseExpand();
  const { appState, updateAppState } = useAppState();
  const { hostSdk, biLogger, experiments } = useServices();
  const corvidApi = useCorvidApi();
  const isMobile = appState.deviceType === DeviceType.Mobile;

  const onCallToActionClick = (url) => {
    biLogger.callToActionClickEvent(url);
    isMobile && collapseExpand.collapse();
    const productRegex = /product-page\/([^?/\s]+)/gm;
    const productMatch = productRegex.exec(url);
    const fallbackBehavior = () => hostSdk.openUrl(url);
    if (productMatch) {
      const productName = productMatch[1];
      hostSdk.navigateToSection(
        {
          appDefinitionId: CTA_PRODUCT.APP_DEFINITION_ID,
          sectionId: CTA_PRODUCT.SECTION_ID,
        },
        productName,
        fallbackBehavior,
      );
    } else {
      fallbackBehavior();
    }
  };

  const onMessageReceived = () => {
    if (!experiments.enabled('specs.chat.DisableAutoMessagesInHiddenPages')) {
      updateAppState({ hasMessages: true });
    }
    biLogger.messageReceivedEvent(appState.shardId);
  };

  const onSendMessage = (message) => {
    corvidApi.reportMessageSent(message);
    const host = appState.host;
    biLogger.sendMessageEvent({ host });
  };

  const onButtonInteraction = (button: Button) => {
    corvidApi.reportButtonInteraction(button);
    const host = appState.host;
    const buttonAppId = button.payload?.appId;
    const question_id = button.payload?.interactionId;
    biLogger.sendMessageEvent({ host, buttonAppId, question_id });
  };

  const onAttachmentClick = () => biLogger.attachmentClickEvent();

  const eventHooks: ChatEventHooks = {
    onMessageReceived,
    onSendMessage,
    onAttachmentClick,
    onCallToActionClick,
    onButtonInteraction,
  };

  return {
    eventHooks,
  };
};
