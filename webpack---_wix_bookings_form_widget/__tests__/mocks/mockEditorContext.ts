import { EditorContext } from '../../src/utils/state/initialStateFactory';

export function mockEditorContext({
  isDummy = false,
  selectedSettingsSubTabId,
  selectedSettingsTabId,
}: Partial<EditorContext> = {}) {
  return {
    isDummy,
    selectedSettingsSubTabId,
    selectedSettingsTabId,
  };
}
