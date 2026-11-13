import { auth } from './firebase';

/** Same as fetch(), but attaches the signed-in user's Firebase ID token. */
export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const user = auth.currentUser;
  if (user) {
    try {
      headers.set('Authorization', `Bearer ${await user.getIdToken()}`);
    } catch {
      // Offline token refresh may fail; proceed cleanly so caller can apply offline fallback
    }
  }
  return fetch(input, { ...init, headers });
}
