import { FileSelectionMethods } from '@wix/chat-web';
import { useServices } from './services-registry';
import { useAppState } from './app-state';
import { mediaManager } from '@wix/inbox-common';
import { IMAGE_PREVIEW_MODAL_SIZE } from '../constants';

export const useImageHandlers = () => {
  const { appState } = useAppState();
  const { serverApi, hostSdk, biLogger } = useServices();

  const handleUploadFile = async (file: File, source: FileSelectionMethods) => {
    const { token, url, folderId } = await serverApi.getUploadToken();
    const effectiveFolderId = folderId;

    if (source !== FileSelectionMethods.Input) {
      const { chatroomId, visitorId } = appState;
      biLogger.fileUploadFromClipboard(
        file.name,
        file.size,
        file.type,
        '',
        chatroomId,
        visitorId,
        source === FileSelectionMethods.DragNDrop,
      );
    }

    return mediaManager.uploadFileToMedia({
      file,
      token,
      uploadUrlApi: url,
      folderId: effectiveFolderId,
    });
  };

  const handleImageClick = ({ url, width, height, fileName, fileSize }) => {
    const { deviceType } = appState;

    // TODO use correct wiring here
    const buttonBackground = 'black';
    const textColor = 'black';

    const isDesktop = deviceType === 'desktop';
    biLogger.imageClickEvent();
    hostSdk.openImagePreview(
      url,
      fileName,
      fileSize,
      buttonBackground,
      '',
      textColor,
      isDesktop ? IMAGE_PREVIEW_MODAL_SIZE.width : undefined,
      isDesktop ? IMAGE_PREVIEW_MODAL_SIZE.height : undefined,
    );
  };

  return { handleImageClick, handleUploadFile };
};
