import { HttpClient } from '@wix/http-client';
import loadjs from 'loadjs';

let firebasePollingTimeoutId;
let loadingFirebasePromise;

const httpClient = new HttpClient();

const loadFirebaseScripts = ({ unpkgUrl }) => {
  return new Promise((resolve) => {
    const files = [
      `${unpkgUrl}/firebase@8.4.3/firebase-app.js`,
      `${unpkgUrl}/firebase@8.4.3/firebase-auth.js`,
      `${unpkgUrl}/firebase@8.4.3/firebase-database.js`,
    ];
    loadjs(files, {
      async: false,
      numRetries: 3,
      before: (path, scriptEl) => {
        scriptEl.crossOrigin = 'anonymous';
      },
      success: () => {
        resolve(undefined);
      },
    });
  });
};

const pollUrl = (url: string, { maxAttempts, interval }) => {
  return new Promise((resolve) => {
    const pollInternal = (numberOfAttempt = 1) => {
      httpClient
        .get(url)
        .then(async (res) => {
          if (res?.data || numberOfAttempt === maxAttempts) {
            resolve(undefined);
          } else {
            firebasePollingTimeoutId = setTimeout(
              () => pollInternal(++numberOfAttempt),
              interval,
            );
          }
        })
        .catch(() => resolve(undefined));
    };
    return pollInternal();
  });
};

const getFirebaseEventsUrl = async (chatToken: string) => {
  const realtimeToken = await httpClient
    .post(
      '/_api/chat-web/v1/real-time-tokens',
      {
        token: chatToken,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then((res) => res.data);

  const firebaseToken = await httpClient
    .post(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${realtimeToken.options.apiKey}`,
      {
        token: realtimeToken.authKey,
        returnSecureToken: true,
      },
    )
    .then((res) => res.data);

  return `${realtimeToken.options.databaseURL}${realtimeToken.eventsPath.substr(
    1,
  )}.json?auth=${firebaseToken.idToken}`;
};

export const lazilyLoadFirebase = async (
  unpkgUrl: string,
  chatToken: string,
  maxDelay: number,
  interval: number,
) => {
  const maxAttempts = Math.floor(maxDelay / interval);

  await getFirebaseEventsUrl(chatToken)
    .then((eventsUrl) =>
      pollUrl(eventsUrl, {
        interval,
        maxAttempts,
      }),
    )
    .catch(() => Promise.resolve(undefined));

  return loadFirebase(unpkgUrl);
};

export const loadFirebase = (unpkgUrl: string) => {
  if (!loadingFirebasePromise) {
    if (firebasePollingTimeoutId) {
      window.clearTimeout(firebasePollingTimeoutId);
      firebasePollingTimeoutId = undefined;
    }
    loadingFirebasePromise = loadFirebaseScripts({ unpkgUrl });
  }
  return loadingFirebasePromise;
};
