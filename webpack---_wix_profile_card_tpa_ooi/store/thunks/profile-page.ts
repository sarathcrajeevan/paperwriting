import {
  Nullable,
  ImageChangeOptions,
  StoreState,
  Thunk,
  ThunkExtra,
  ThunkDispatch,
  ThunkWithArgs,
} from '../../types';
import { myAccountAppDefinitionId } from '../../constants/app-definition-id';
import { myAccountPageId } from '../../constants/section-id';
import {
  getToggleIsCoverRepositionModeAction,
  getToggleIsCoverLoadingAction,
  getStopEditingProfileAction,
  getSetEditNameAction,
  getSetEditTitleAction,
  getSetEditPictureAction,
  getSetEditCoverAction,
  getSetViewedMemberAction,
} from '../actions';

import { Applications } from '../../services/public-api-store';
import { openMobileProfileEdit } from '../../services/modal';
import { scheduleViewedMemberSync, clearInitialDataCache } from './common';

export const enterCoverRepositionMode = () => {
  return getToggleIsCoverRepositionModeAction();
};

const openMobileEditModal = async (
  dispatch: ThunkDispatch,
  state: StoreState,
  extra: ThunkExtra,
) => {
  const { compId, wixCodeApi, membersService } = extra;
  const onModalClose = async () => {
    const { viewed } = state.users;
    const updatedMember = await membersService.getMember(viewed.uid);
    scheduleViewedMemberSync(extra);
    dispatch(getSetViewedMemberAction(updatedMember));
    clearInitialDataCache(state, extra);
  };

  return openMobileProfileEdit({ compId, wixCodeApi, onModalClose });
};

const navigateToMyAccount = async (
  { users }: StoreState,
  { getPublicAPI }: ThunkExtra,
) => {
  const membersAreaAPI = await getPublicAPI(Applications.MembersArea);
  const { uid, slug } = users.viewed;

  return membersAreaAPI?.navigateToSection({
    appDefinitionId: myAccountAppDefinitionId,
    sectionId: myAccountPageId,
    memberId: slug || uid,
  });
};

export const toggleIsEditingProfile: Thunk =
  () => async (dispatch, getState, extra) => {
    const { flowAPI } = extra;

    if (flowAPI.environment.isMobile) {
      await openMobileEditModal(dispatch, getState(), extra);
    } else {
      await navigateToMyAccount(getState(), extra);
    }
  };

export const stopEditingProfile: Thunk = () => (dispatch, getState) => {
  const { users } = getState();
  const { viewed } = users;

  dispatch(getStopEditingProfileAction(viewed.name, viewed.title ?? null));
};

export const setEditName = (editName: string) => getSetEditNameAction(editName);

export const setEditTitle = (editTitle: string) =>
  getSetEditTitleAction(editTitle);

export const setEditPicture = (options: ImageChangeOptions) =>
  getSetEditPictureAction(options);

export const setEditCover: ThunkWithArgs<Nullable<ImageChangeOptions>> =
  (options) => (dispatch) => {
    dispatch(getToggleIsCoverLoadingAction());
    dispatch(getSetEditCoverAction(options));
    dispatch(getToggleIsCoverLoadingAction());
  };
