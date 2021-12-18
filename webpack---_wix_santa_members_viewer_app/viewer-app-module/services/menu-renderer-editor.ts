import { MEMBERS_MENU_ID, USER_NAME_PATTERN } from '../constants';
import { W, WixCodeApi, Router } from '../common/types';

const getCurrentPath = (wixCodeApi: WixCodeApi, routers: Router[]) => {
  const { prefix, path } = wixCodeApi.location;
  const publicRouter = routers.find(({ config: { type } }) => type === 'public');

  if (publicRouter?.prefix === prefix) {
    const [, ...restPath] = path;
    return `/${prefix}/${USER_NAME_PATTERN}/${restPath.join('/')}`;
  }

  return `/${prefix}/${path.join('/')}`;
};

export const setMobileMembersMenuValue = ($w: W, wixCodeApi: WixCodeApi, routers: Router[]) => {
  const currentPath = getCurrentPath(wixCodeApi, routers);

  $w(MEMBERS_MENU_ID).forEach((menu) => {
    if (menu.onChange) {
      const selectedOption = menu.options?.find(({ link }) => link === currentPath);
      menu.value = selectedOption?.value ?? menu.value;
    }
  });
};
