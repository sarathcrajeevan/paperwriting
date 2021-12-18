import React from 'react';
import ReactDOM from 'react-dom';
import { ChatWidget } from '../components/ChatWidget/ChatWidget';
import { Environment, wrapWithEnvironment } from './wrapper';
import { loadChat } from './chat-loader';

export const init = (environment: Environment, chatToken: string) => {
  environment.fedopsLogger.appLoadingPhaseStart('Render');

  ReactDOM.render(
    wrapWithEnvironment(environment)(React.createElement(ChatWidget)),
    document.getElementById('root'),
  );

  loadChat({
    chatToken,
  });
};
