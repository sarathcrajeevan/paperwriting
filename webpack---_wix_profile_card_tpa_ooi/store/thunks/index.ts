import { RoleId } from '@wix/members-domain-ts';

import { Origin, Thunk } from '../../types';
import { getFollowOrUnfollowAction } from '../actions';
import { isMemberInCommunity } from '../selectors';
import { scheduleViewedMemberSync, clearInitialDataCache } from './common';
import { joinCommunity } from './role-action/community';
import { requestLogin } from '../../services/login-service';
import { followButtonClickedUou } from '@wix/bi-logger-members-app-uou/v2';
import { getCommonBIEventProps } from '../../services/bi-event';

export * from './cover-reposition';
export * from './profile-picture';
export * from './public-profile-preview';
export * from './profile-page';
export * from './navigation';
export * from './additional-actions';
export * from './role-action';
export * from './chat';
export * from './data-sync';

export const followOrUnfollow: Thunk =
  () => async (dispatch, getState, extra) => {
    const {
      wixCodeApi,
      membersService,
      experiments,
      biLogger,
      flowAPI,
      metaData,
    } = extra;
    const state = getState();
    const { current, viewed } = state.users;

    if (!current) {
      requestLogin(wixCodeApi, experiments);
      return;
    }

    if (!isMemberInCommunity(current)) {
      await joinCommunity(RoleId.JOIN_COMMUNITY)(dispatch, getState, extra);
      return;
    }

    scheduleViewedMemberSync(extra);
    dispatch(getFollowOrUnfollowAction());
    biLogger?.report(
      followButtonClickedUou({
        ...getCommonBIEventProps(flowAPI, state, metaData),
        origin: Origin.Profile,
        member_followed: viewed.uid,
        is_followed: !viewed.isSubscribed,
      }),
    );
    clearInitialDataCache(state, extra);
    membersService.toggleMemberFollowStatus(viewed.uid, viewed.isSubscribed);
  };
