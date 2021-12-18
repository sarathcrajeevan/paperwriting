export interface UserMessage {
  shouldDisplayMessage: boolean;
  closeMessage: Function;
}
export function initUserMessage(
  setProps: (props: { [p: string]: any }) => void,
) {
  const userMessage: UserMessage = {
    shouldDisplayMessage: false,
    closeMessage: () => {
      hideMessage();
    },
  };

  const showUserMessage = () => {
    userMessage.shouldDisplayMessage = true;
    setProps({
      userMessage,
    });
  };

  const hideMessage = () => {
    userMessage.shouldDisplayMessage = false;
    setProps({
      userMessage,
    });
  };
  return { userMessage, showUserMessage };
}
