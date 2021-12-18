import { RoleId } from '@wix/members-domain-ts';
import { actionButtonClicked } from '@wix/bi-logger-members-app-uou/v2';
import { BLOCKED_MEMBER_ID } from '../../../constants/common';
import PublicMemberBuilder from '../../../services/public-member-builder';
import { getSetViewedMemberAction } from '../../actions';
import {
  IFrameEvent,
  Origin,
  ProfileChangeEvent,
  PublicMember,
  ThunkWithArgs,
} from '../../../types';
import { openModalWithCallback } from '../../../services/modal';
import { Applications } from '../../../services/public-api-store';
import { notifyProfileChangeObservers } from '../common';
import { getCommonBIEventProps } from '../../../services/bi-event';

const getBlockedMember = (): PublicMember => {
  return new PublicMemberBuilder().withUid(BLOCKED_MEMBER_ID).build();
};

export const memberBlockMember: ThunkWithArgs<RoleId> =
  (roleId) => async (dispatch, getState, extra) => {
    const {
      compId,
      wixCodeApi,
      platformAPIs,
      experiments,
      dataSyncService,
      getPublicAPI,
      biLogger,
      flowAPI,
      metaData,
    } = extra;

    const state = getState();
    const { viewed } = state.users;
    const { uid } = viewed;
    const membersAreaAPI = await getPublicAPI(Applications.MembersArea);

    const onConfirm = async () => {
      const { blockMemberService } = extra;
      await blockMemberService.blockMember(uid);
      biLogger?.report(
        actionButtonClicked({
          ...getCommonBIEventProps(flowAPI, state, metaData),
          action_type: 'block_confirm',
          member_chosen: uid,
          formOrigin: Origin.Profile,
          site_member_id: state.users.current?.uid,
        }),
      );
      dataSyncService.addIFrameEvent(IFrameEvent.SetMemberAsBlocked);
      if (membersAreaAPI?.clearMenus) {
        await membersAreaAPI.clearMenus();
      }
      notifyProfileChangeObservers(extra, {
        event: ProfileChangeEvent.MemberBlocked,
      });
      dispatch(getSetViewedMemberAction(getBlockedMember()));
    };

    openModalWithCallback({
      compId,
      modalType: roleId,
      payload: { memberName: viewed.name },
      platformAPIs,
      wixCodeApi,
      experiments,
      onConfirm,
    });
  };
