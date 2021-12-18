import constate from 'constate';
import { useState } from 'react';
import { EditorSettings } from '@wix/inbox-common';
import { hocify } from './utils';

interface ProviderProps {
  editorSettings: EditorSettings;
}

interface Context {
  publicData: EditorSettings['publicData'];
  styleParams: EditorSettings['styleParams'];
  siteColors: EditorSettings['siteColors'];
  textPresets: EditorSettings['textPresets'];
  setPublicData(publicData: EditorSettings['publicData']): void;
  setStyleParams(styleParams: EditorSettings['styleParams']): void;
  setSiteColors(siteColors: EditorSettings['siteColors']): void;
  setTextPresets(textPresets: EditorSettings['textPresets']): void;
}

const useContext = ({
  editorSettings: initialEditorSettings,
}: ProviderProps): Context => {
  const [publicData, setPublicData] = useState<EditorSettings['publicData']>(
    initialEditorSettings.publicData,
  );
  const [styleParams, setStyleParams] = useState<EditorSettings['styleParams']>(
    initialEditorSettings.styleParams,
  );
  const [siteColors, setSiteColors] = useState<EditorSettings['siteColors']>(
    initialEditorSettings.siteColors,
  );
  const [textPresets, setTextPresets] = useState<EditorSettings['textPresets']>(
    initialEditorSettings.textPresets,
  );

  return {
    publicData,
    styleParams,
    siteColors,
    textPresets,
    setPublicData,
    setStyleParams,
    setSiteColors,
    setTextPresets,
  };
};

const useEditorSettings_ = (context: Context) => {
  return context;
};

const useTexts_ = (context: Context) => {
  return context.publicData.texts;
};

const useLayout_ = (context: Context) => {
  return context.publicData.layout;
};

const useDesign_ = (context: Context) => {
  return context.publicData.design;
};

const useBehaviour_ = (context: Context) => {
  return context.publicData.behaviour;
};

const useColors_ = (context: Context) => {
  return context.styleParams.colors;
};

const useFonts_ = (context: Context) => {
  return Object.fromEntries(
    Object.entries(context.styleParams.fonts).map(([key, value]) => [
      key,
      (value as any)?.family ?? value,
    ]),
  );
};

const useSiteColors_ = (context: Context) => {
  return context.siteColors;
};

const useTextPresets_ = (context: Context) => {
  return context.textPresets;
};

export const [
  EditorSettingsProvider,
  useEditorSettings,
  useTexts,
  useLayout,
  useDesign,
  useBehaviour,
  useColors,
  useFonts,
  useSiteColors,
  useTextPresets,
] = constate(
  useContext,
  useEditorSettings_,
  useTexts_,
  useLayout_,
  useDesign_,
  useBehaviour_,
  useColors_,
  useFonts_,
  useSiteColors_,
  useTextPresets_,
);

export const withEditorSettings = hocify(useEditorSettings);
