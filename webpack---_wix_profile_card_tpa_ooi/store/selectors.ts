import { PrivacyStatus, RoleId } from '@wix/members-domain-ts';

import {
  AdditionalAction,
  AdditionalActionId,
  AdditionalActionName,
  DataHook,
  Experiments,
  InjectedComputedProps,
  Nullable,
  NumberStyleParam,
  ProfileLayout,
  PublicMember,
} from '../types';
import {
  aboutAppDefinitionId,
  myAccountAppDefinitionId,
} from '../constants/app-definition-id';
import { FlowAPI } from '../types/controller';
import { RootState } from './root-reducer';
import {
  defaultProfileAlignment,
  defaultProfileImageLayout,
  defaultProfileImageSize,
  defaultProfileLayout,
  defaultProfileWidgetHeight,
} from '../components/ProfileCard/stylesParams';
import { getBadgeSettingsProps } from '../services/badge-layout';
import { BLOCKED_MEMBER_ID } from '../constants/common';
import settingsParams from '../components/ProfileCard/settingsParams';
import {
  getCoverImageStyle,
  getCoverPosition,
  getCoverUrl,
} from '../services/cover-utils';

interface GetProfilePhotoProps {
  state: RootState;
  flowAPI: FlowAPI;
  profileLayout?: ProfileLayout;
  isMobile?: boolean;
}

export const isInPage = (flowAPI: FlowAPI, applicationId: string) => {
  const { currentPage } = flowAPI.controllerConfig.wixCodeApi.site;
  return currentPage?.applicationId === applicationId;
};

const isInSocialCommunity = (state: RootState) => {
  return getInCommunity(state) && state.site.isSocial;
};

export const getIsOwnProfile = ({ users: { viewed, current } }: RootState) => {
  return viewed.uid === current?.uid;
};

const getStyleParams = ({ componentSettings: { styleParams } }: RootState) => {
  return styleParams;
};

const getProfileLayout = (state: RootState, flowAPI: FlowAPI) => {
  if (flowAPI.environment.isEditorX) {
    return ProfileLayout.FullWidth;
  }

  const { numbers } = getStyleParams(state);
  const profileLayout = numbers[NumberStyleParam.ProfileLayout];

  return profileLayout ?? defaultProfileLayout;
};

const getProfileAlignment = (state: RootState) => {
  const { numbers } = getStyleParams(state);
  const profileAlignment = numbers[NumberStyleParam.ProfileAlignment];

  return profileAlignment ?? defaultProfileAlignment;
};

const getProfileStyle = (state: RootState) => {
  const pictureStyle = getStyleParams(state).numbers.pictureStyle;
  return pictureStyle ?? defaultProfileImageLayout;
};

const getProfileImageSize = (state: RootState) => {
  const profileImageSize = getStyleParams(state).numbers.profileImageSize;

  return profileImageSize ?? defaultProfileImageSize;
};

const showAllBadges = ({ site, users }: RootState) => {
  const badgesTabOpened = site.settingsTab === DataHook.BadgesTabButton;
  const hasBadgesAssigned = users.viewed.badges.length;

  return badgesTabOpened && !hasBadgesAssigned;
};

const getAssignedBadges = (state: RootState) => {
  const { users, badges } = state;
  const allBadges = badges.list;
  const viewedMemberBadges = users.viewed.badges;

  if (showAllBadges(state)) {
    return allBadges;
  }

  return allBadges.filter(({ id }) => {
    return viewedMemberBadges.includes(id);
  });
};

const getBadgeSettings = (
  language: string,
  state: RootState,
): InjectedComputedProps['badgesSettings'] => {
  const { componentSettings, globalSettings } = state;

  return {
    ...getBadgeSettingsProps(componentSettings, globalSettings),
    align: 'center',
    badges: getAssignedBadges(state),
    language,
    maxRows: 1,
    useTextRemainder: false,
  };
};

const getInCommunity = ({ users }: RootState) =>
  isMemberInCommunity(users.viewed);

const shouldHideEditRoleAction = (flowAPI: FlowAPI) => {
  return isInPage(flowAPI, myAccountAppDefinitionId);
};

const getRolesActions = (flowAPI: FlowAPI, state: RootState) => {
  const { users, roles } = state;
  const { rolesActions } = users.viewed;
  const memberRoleActions = rolesActions ?? [];
  const shouldHideEdit = shouldHideEditRoleAction(flowAPI);
  const filteredRoleActions = memberRoleActions.filter((action) => {
    switch (action.roleId) {
      case RoleId.EDIT:
        return !shouldHideEdit;
      case RoleId.JOIN_COMMUNITY:
      case RoleId.LEAVE_COMMUNITY:
        return false;
      default:
        return true;
    }
  });

  return roles.map
    ? filteredRoleActions.map((action) => ({
        ...action,
        ...roles.map?.[action.roleId],
      }))
    : filteredRoleActions;
};

const getAdditionalActions = (state: RootState) => {
  const additionalActions: AdditionalAction[] = [];
  const _isInSocialCommunity = isInSocialCommunity(state);
  const _getIsOwnProfile = getIsOwnProfile(state);
  const isOwnSocialProfile = _isInSocialCommunity && _getIsOwnProfile;

  if (isOwnSocialProfile) {
    additionalActions.push({
      id: AdditionalActionId.ShareProfile,
      action: AdditionalActionName.ShareProfile,
    });
  }

  return additionalActions;
};

export const isMemberInCommunity = (member: Nullable<PublicMember>) => {
  if (!member) {
    return false;
  }

  const inCommunityStatuses = [PrivacyStatus.Public, PrivacyStatus.Unknown];

  return inCommunityStatuses.includes(member.privacyStatus);
};

const getIsDesignPreview = ({ site }: RootState) => {
  return site.settingsTab === DataHook.DesignTabButton;
};

const getIsResponsiveEditor = (flowAPI: FlowAPI) => {
  return flowAPI.environment.isEditorX;
};

const getShowCover = (state: RootState) => {
  return getStyleParams(state).booleans.showCover ?? false;
};

const getShowFollowButton = (flowAPI: FlowAPI) => {
  return flowAPI.settings.get(settingsParams.showFollowButton);
};

const getShowCoverPhoto = (flowAPI: FlowAPI) => {
  return flowAPI.settings.get(settingsParams.showCoverPhoto);
};

const getShowAsBlocked = ({ users }: RootState) => {
  const { current, viewed } = users;

  return (
    !!viewed.uid &&
    current?.uid !== viewed.uid &&
    viewed.roles.includes(RoleId.BLOCK_MEMBER)
  );
};

const isBlockedByMember = ({ users }: RootState) => {
  const { viewed } = users;
  return viewed.uid === BLOCKED_MEMBER_ID;
};

const hasBlogWriterProfileRoles = (roles: RoleId[]) => {
  const blogWriterProfileRoles = [
    RoleId.ADMIN,
    RoleId.SET_BLOG_WRITER,
    RoleId.SET_BLOG_EDITOR,
  ];

  return blogWriterProfileRoles.some((role) => roles.includes(role));
};

export const isBlogWriterOrEditor = ({ site, users }: RootState) => {
  const { installedApps } = site;
  const isBlogInstalled = installedApps.wixBlog ?? false;

  return isBlogInstalled && hasBlogWriterProfileRoles(users.viewed.roles);
};

const isFollowersInstalled = ({ site }: RootState) => {
  const { installedApps } = site;
  return !!installedApps.membersFF;
};

const showViewPublicProfileCTA = (state: RootState, flowAPI: FlowAPI) => {
  return (
    isInPage(flowAPI, aboutAppDefinitionId) &&
    isMemberInCommunity(state.users.viewed)
  );
};

const showEditProfileCTA = (state: RootState, flowAPI: FlowAPI) => {
  return (
    isInPage(flowAPI, aboutAppDefinitionId) &&
    !isMemberInCommunity(state.users.viewed)
  );
};

const getCanEdit = ({ users }: RootState) =>
  users.viewed.rolesActions?.some(({ roleId }) => roleId === RoleId.EDIT) ??
  false;

const getAllowChat = (flowAPI: FlowAPI, state: RootState) => {
  const { booleans } = getStyleParams(state);
  const showMessageButtonParam = flowAPI.environment.isMobile
    ? booleans.showMessageButtonMobile
    : booleans.showMessageButton;
  const showMessageButton = showMessageButtonParam ?? true;

  return showMessageButton && state.site.isSocialChat;
};

const getIsInProfilePage = (state: RootState, flowAPI: FlowAPI) => {
  return isInPage(flowAPI, aboutAppDefinitionId);
};

const getProfileWidgetHeight = (state: RootState) => {
  return (
    getStyleParams(state).numbers.profileWidgetHeight ??
    defaultProfileWidgetHeight
  );
};

const getProfileCoverPhoto = ({
  flowAPI,
  profileLayout,
  state,
  isMobile = false,
}: GetProfilePhotoProps) => {
  const showCoverPhoto = getShowCoverPhoto(flowAPI);

  if (!showCoverPhoto) {
    return null;
  }

  const member = state.users.viewed;
  const editCover = state.profilePage.editCover;
  const coverUrl = getCoverUrl({
    member,
    editCover,
    isMobile,
    defaultCoverUrl: state.globalSettings.defaultProfileCoverUrl,
    profileLayout,
    isFullWidth: getIsResponsiveEditor(flowAPI),
  });

  const coverPosition = getCoverPosition({ member, editCover });

  return { src: coverUrl ? coverUrl : undefined, position: coverPosition };
};

const getProfileCoverPhotoStyle = ({
  state,
  flowAPI,
  profileLayout,
  isMobile = false,
}: GetProfilePhotoProps) => {
  const showCoverPhoto = getShowCoverPhoto(flowAPI);

  if (!showCoverPhoto) {
    return null;
  }

  const member = state.users.viewed;
  const editCover = state.profilePage.editCover;
  const coverUrl = getCoverUrl({
    member,
    editCover,
    isMobile,
    defaultCoverUrl: state.globalSettings.defaultProfileCoverUrl,
    profileLayout,
    isFullWidth: getIsResponsiveEditor(flowAPI),
  });

  return getCoverImageStyle({
    coverUrl,
    member,
    editCover,
  });
};

const showPrivateMemberIndicator = (state: RootState, flowAPI: FlowAPI) => {
  const { viewed } = state.users;
  return viewed?.privacyStatus === 'PRIVATE' && flowAPI.environment.isEditor;
};

const getIsUiTpaImageEnabled = (flowAPI: FlowAPI) => {
  return flowAPI.experiments.enabled(Experiments.UiTpaImage);
};

export const getComputedProps = (
  flowAPI: FlowAPI,
  state: RootState,
): InjectedComputedProps => ({
  profileLayout: getProfileLayout(state, flowAPI),
  profileAlignment: getProfileAlignment(state),
  pictureStyle: getProfileStyle(state),
  profileImageSize: getProfileImageSize(state),
  badgesSettings: getBadgeSettings(flowAPI.environment.language, state),
  rolesActions: getRolesActions(flowAPI, state),
  additionalActions: getAdditionalActions(state),
  inCommunity: getInCommunity(state),
  isDesignPreview: getIsDesignPreview(state),
  isResponsiveEditor: getIsResponsiveEditor(flowAPI),
  isInProfilePage: getIsInProfilePage(state, flowAPI),
  showAsBlocked: getShowAsBlocked(state),
  showCover: getShowCover(state),
  showCoverPhoto: getShowCoverPhoto(flowAPI),
  showAsBlockedByMember: isBlockedByMember(state),
  showTitle: true,
  showViewPublicProfileCTA: showViewPublicProfileCTA(state, flowAPI),
  showEditProfileCTA: showEditProfileCTA(state, flowAPI),
  showFollowButton: getShowFollowButton(flowAPI),
  canEdit: getCanEdit(state),
  allowChat: getAllowChat(flowAPI, state),
  followersInstalled: isFollowersInstalled(state),
  profileWidgetHeight: getProfileWidgetHeight(state),
  mobileProfileCoverPhoto: getProfileCoverPhoto({
    state,
    flowAPI,
    isMobile: true,
  }),
  mobileProfileCoverPhotoStyle: getProfileCoverPhotoStyle({
    state,
    flowAPI,
    isMobile: true,
  }),
  horizontalProfileCoverPhoto: getProfileCoverPhoto({
    flowAPI,
    state,
    profileLayout: ProfileLayout.FullWidth,
  }),
  cardProfileCoverPhoto: getProfileCoverPhoto({
    flowAPI,
    state,
    profileLayout: ProfileLayout.Card,
  }),
  horizontalProfileCoverPhotoStyle: getProfileCoverPhotoStyle({
    flowAPI,
    state,
    profileLayout: ProfileLayout.FullWidth,
  }),
  cardProfileCoverPhotoStyle: getProfileCoverPhotoStyle({
    flowAPI,
    state,
    profileLayout: ProfileLayout.Card,
  }),
  showPrivateMemberIndicator: showPrivateMemberIndicator(state, flowAPI),
  isUiTpaImageEnabled: getIsUiTpaImageEnabled(flowAPI),
});
