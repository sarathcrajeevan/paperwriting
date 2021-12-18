import { WIX_BLOG, WIX_FORUM, WIX_EVENTS, WIX_GROUPS } from '@wix/app-definition-ids';

export const USER_NAME_PATTERN = '{userName}';

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const SOCIAL_APPS = [
  WIX_BLOG,
  WIX_FORUM,
  WIX_GROUPS,
  WIX_EVENTS,
  '14ebe801-d78a-daa9-c9e5-0286a891e46f', // FOLLOWERS
  '14dbef06-cc42-5583-32a7-3abd44da4908', // ABOUT
  '1537b24e-29d1-6d8f-b8e1-d6860f2f70b9', // FILE SHARE
  '476dc2dd-e16e-43b0-a0aa-1a486c78fbe2', // SHARED GALLERY
];

export const RESTRICTED_MA_PAGES_EXPERIMENT = 'specs.membersArea.EnableMemberPagePermissions';

export const LOGIN_MENU_ID = '@members_login';
export const MEMBERS_MENU_ID = '@members_menu';
export const APP_WIDGET_LOGIN_MENU_ID = '@members-login-bar';
export const APP_WIDGET_MEMBERS_MENU_ID = '@members-menu';
export const MEMBERS_MENU_ITEMS_STORAGE_KEY = 'members-menu-initial-items';
export const LOGIN_DROPDOWN_MENU_ITEMS_STORAGE_KEY = 'login-dropdown-menu-initial-items';
