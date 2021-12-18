import { PrivacyStatus } from '@wix/members-domain-ts';

interface MemberInfo {
  memberId: string;
  memberSlug: string;
}

interface Section {
  appDefinitionId: string;
  sectionId: string;
  memberId?: string;
  memberSlug?: string;
  tpaInnerRoute?: string;
}

export interface MembersAreaApi {
  getSectionUrl: (section: Section) => Promise<string>;
  navigateToMember: (memberInfo: MemberInfo) => Promise<void>;
  navigateToSection: (section: Section) => Promise<void>;
  enterPublicProfilePreviewMode: () => Promise<void>;
  leavePublicProfilePreviewMode: () => Promise<void>;
  clearMenus: () => Promise<void>;
}

export interface ChatApi {
  startPrivateChat: (memberId: string) => Promise<void>;
}

export interface ProfileInfo {
  name?: string;
  title?: string;
  profilePrivacy?: PrivacyStatus;
}

export interface MyAccountApi {
  registerToProfileInfoChange: (
    callback: (publicInfo: ProfileInfo) => void,
  ) => void;
  setAvatarVisibility: (isVisible: boolean) => void;
}

export enum ProfileChangeEvent {
  BadgeAssigned = 'badge-assigned',
  MemberBlocked = 'member-blocked',
  PublicProfilePreviewChanged = 'public-profile-preview-changed',
}

type ProfileChangeEventPayload<T extends ProfileChangeEvent> = { event: T };

interface BadgesAssignedPayload {
  event: ProfileChangeEvent.BadgeAssigned;
  assignedBadgeIds: string[];
}

interface PublicProfilePreviewChangedPayload {
  event: ProfileChangeEvent.PublicProfilePreviewChanged;
  isPublicProfilePreview: boolean;
}

export type ProfileChangePayload =
  | ProfileChangeEventPayload<ProfileChangeEvent.MemberBlocked>
  | BadgesAssignedPayload
  | PublicProfilePreviewChangedPayload;

export type ProfileChangeCallback = (
  payload: ProfileChangePayload,
) => Promise<void> | void;

export interface ProfileCardAPI {
  registerToProfileChange?: (callback: ProfileChangeCallback) => void;
}
