/**
 * Returns Authorization header for internal API requests when OIDC/KC configured
 * Uses the id_token which is already stored locally after successful login
 *
 * Will return `null`, and cause the caller to fall through, when:
 *  - no token has been stashed
 *  - the stashed token can't be parsed
 *  - the token has already expired
 */

import { localStorageKeys } from '@/utils/config/defaults';

/* Base64URL → utf-8 string decode */
function decodeBase64Url(input) {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4;
  return atob(pad ? padded + '='.repeat(4 - pad) : padded);
}

/* Check JWT isn't expired, the server will handle the actual verification */
function isExpired(token) {
  try {
    const [, payload] = token.split('.');
    if (!payload) return true;
    const claims = JSON.parse(decodeBase64Url(payload));
    if (typeof claims.exp !== 'number') return false;
    return claims.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

/* Returns { Authorization: 'Bearer …' } or null if no usable token is available */
export default function getApiAuthHeader() {
  let token;
  try {
    token = localStorage.getItem(localStorageKeys.ID_TOKEN);
  } catch {
    return null;
  }
  if (!token || isExpired(token)) return null;
  return { Authorization: `Bearer ${token}` };
}
