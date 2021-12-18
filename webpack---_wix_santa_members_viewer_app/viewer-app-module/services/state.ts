import { MenuItem } from '../common/types';

let membersLoginWidgets: MenuItem[];

export const getMembersLoginWidgets = () => membersLoginWidgets || [];
export const setMembersLoginWidgets = (newMembersLoginWidgets: MenuItem[]) => {
  membersLoginWidgets = newMembersLoginWidgets;
};
