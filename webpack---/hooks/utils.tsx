import React from 'react';
import { useTranslation } from '@wix/wix-i18n-config';
import { I18nextProvider } from 'react-i18next';

export const withLockedTranslation = (Comp) => {
  return function WrapperComp(props) {
    const [t, i18n] = useTranslation();
    return (
      <I18nextProvider i18n={i18n as any}>
        <Comp {...props} />
      </I18nextProvider>
    );
  };
};

// TODO add types
export const hocify = (useHook) => {
  return (Comp) => {
    return function WrapperComp(props) {
      const result = useHook();
      return <Comp {...result} {...props} />;
    };
  };
};
