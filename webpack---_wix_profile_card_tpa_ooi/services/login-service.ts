import { Experiments } from '../types';
import { WixCodeApi, WixExperiments } from '../types/controller';

export const requestLogin = (
  wixCodeApi: WixCodeApi,
  experiments?: WixExperiments,
) => {
  const openInModal = experiments?.enabled(Experiments.LoginInPopup);
  wixCodeApi.user.promptLogin({ modal: openInModal }).catch(() => {});
};
