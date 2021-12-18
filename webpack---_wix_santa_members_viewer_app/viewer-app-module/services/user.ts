import { HttpClient } from '@wix/http-client';

import { GetMyMemberResponse, Member, MemberData, RolesMap, WixCodeApi } from '../common/types';
import { USER_NAME_PATTERN } from '../constants';
import { logError } from '../utils/monitoring';
import { getMemoryStorage } from './memory-storage';
import { HttpClientService } from './httpClient';

const CURRENT_USER_SLUG_STORAGE_KEY = 'current-user-slug';
const CURRENT_USER_ID_STORAGE_KEY = 'current-user-id';

export function init(wixCodeApi: WixCodeApi) {
  let viewedUser: Member, currentUser: Member, userRoles: RolesMap;

  function fetchMenuCounters(user: Member, httpClient: HttpClient) {
    if (!user || user.loggedIn === false) {
      return Promise.resolve({});
    }
    return new Promise((resolve, reject) => {
      const userId = user && user.id;
      if (userId && httpClient) {
        fetchNumbers(userId, httpClient, (response: unknown) => {
          resolve(response);
        });
      } else {
        reject(new Error('No user to get menu counters by'));
      }
    });
  }

  async function fetchNumbers(userId: string, httpClient: HttpClient, successFn: Function) {
    const httpClientService = new HttpClientService(httpClient);
    const response = await httpClientService.get(`/_api/santa-members-server/temporary/members/${userId}/numbers`);

    return successFn(response);
  }

  async function fetchRoles(viewedUserId: string, loggedInUserId: string, httpClient: HttpClient): Promise<RolesMap> {
    const payload = [];
    if (viewedUserId) {
      payload.push(viewedUserId);
    }
    if (loggedInUserId) {
      payload.push(loggedInUserId);
    }
    const httpClientService = new HttpClientService(httpClient);
    const roles = await httpClientService.post<RolesMap>('/_api/santa-members-server/temporary/members/roles', payload);

    return roles;
  }

  function replaceUserPatternWithSlug(url: string, user: Member) {
    return url.replace(USER_NAME_PATTERN, user.slug).replace(encodeURI(USER_NAME_PATTERN), user.slug);
  }

  function getViewedUser() {
    return viewedUser ?? {};
  }

  function getCurrentUser() {
    return currentUser ?? {};
  }

  function getRoles() {
    return userRoles ?? {};
  }

  function setRoles(roles: RolesMap) {
    userRoles = roles;
  }

  function setViewedUser(userData: Member) {
    if (userData) {
      viewedUser = userData;
    }
  }

  function setCurrentUser(userData: MemberData, httpClient: HttpClient) {
    return Promise.resolve()
      .then(() => getCurrentUserSlug(userData, httpClient))
      .then((slug: string) => {
        currentUser = {
          id: userData.id,
          loggedIn: userData.loggedIn,
          slug,
        };
      });
  }

  async function fetchCurrentUserSlug(httpClient: HttpClient) {
    const httpClientService = new HttpClientService(httpClient);
    const response = await httpClientService.get<GetMyMemberResponse>('/_api/members/v1/members/my');
    return (response as GetMyMemberResponse).member?.profile?.slug;
  }

  function getCurrentUserSlug(userData: MemberData, httpClient: HttpClient) {
    const memoryStorage = getMemoryStorage();
    const storageSlug = memoryStorage.getItem(CURRENT_USER_SLUG_STORAGE_KEY);
    const currentUserId = memoryStorage.getItem(CURRENT_USER_ID_STORAGE_KEY);

    if (storageSlug && currentUserId === userData.id) {
      return storageSlug;
    }

    if (!currentUserId || currentUserId !== userData.id) {
      memoryStorage.setItem(CURRENT_USER_ID_STORAGE_KEY, userData.id);
    }

    if (userData.loggedIn && userData.getSlug) {
      // Calling manually instead of userData.loggedIn.getSlug to not depend on their implementation
      // This was applied as a hotfix because of broken userData.loggedIn.getSlug implementation
      if (wixCodeApi.window.viewMode === 'Site') {
        return fetchCurrentUserSlug(httpClient)
          .then((slug: string) => {
            const finalSlug = slug || userData.id;
            memoryStorage.setItem(CURRENT_USER_SLUG_STORAGE_KEY, finalSlug);
            return finalSlug;
          })
          .catch(() => logError('Error while fetching current user slug', { userDataId: userData.id }));
      }

      // For Preview mode we can't do the request so using default
      return userData.getSlug();
    }
    return userData.id;
  }

  return {
    getCurrentUser,
    setCurrentUser,
    getViewedUser,
    setViewedUser,
    fetchRoles,
    getRoles,
    setRoles,
    fetchMenuCounters,
    replaceUserPatternWithSlug,
  };
}

export type UserService = ReturnType<typeof init>;
