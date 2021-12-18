export enum AdditionalActionId {
  ShareProfile = 'share_profile',
}

export enum AdditionalActionName {
  ShareProfile = 'MemberRoles.action_set.share_profile',
}

export interface AdditionalAction {
  id: AdditionalActionId;
  action: AdditionalActionName;
}
