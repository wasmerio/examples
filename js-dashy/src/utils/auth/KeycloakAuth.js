import ConfigAccumulator from '@/utils/config/ConfigAccumalator';
import { localStorageKeys } from '@/utils/config/defaults';
import ErrorHandler from '@/utils/logging/ErrorHandler';
import getApiAuthHeader from '@/utils/auth/getApiAuthHeader';
import i18n from '@/utils/i18n';
import { toast } from '@/utils/Toast';

const getAppConfig = () => {
  const Accumulator = new ConfigAccumulator();
  return Accumulator.appConfig() || {};
};

const isKeycloakGuestAccessEnabled = () => {
  const { auth } = getAppConfig();
  return auth && auth.enableGuestAccess;
};

class KeycloakAuth {
  constructor(Keycloak) {
    const { auth } = getAppConfig();
    const {
      serverUrl, realm, clientId, idpHint, legacySupport, adminGroup, adminRole,
    } = auth.keycloak;
    this.adminGroup = adminGroup;
    this.adminRole = adminRole;
    if (typeof clientId === 'number' && !Number.isSafeInteger(clientId)) {
      ErrorHandler(
        'Keycloak clientId appears invalid. ',
        'You passed it as a number, and it is too long to be parsed without loosing precision. '
        + 'Wrap it in quotes in your conf.yml (e.g. clientId: "12345") to force it to be a string.',
      );
    }
    const url = legacySupport ? `${serverUrl}/auth` : serverUrl;
    const initOptions = { url, realm, clientId };
    const loginOptions = idpHint ? { idpHint } : {};

    this.loginOptions = loginOptions;
    this.keycloakClient = new Keycloak(initOptions);
  }

  login() {
    const hadValidToken = Boolean(getApiAuthHeader());
    return new Promise((resolve, reject) => {
      this.keycloakClient.init({ onLoad: 'check-sso', responseMode: 'query' })
        .then((auth) => {
          if (auth) {
            this.storeKeycloakInfo();
            // We've returned back from Keycloak login, and a fresh token has landed
            // Validate, then hard redirect home to fetch to (now fully readable) config
            if (!hadValidToken && getApiAuthHeader()) {
              toast(i18n.global.t('login.authenticated-redirecting'), { type: 'success' });
              setTimeout(() => window.location.replace('/'), 500);
              return undefined;
            }
            return resolve();
          } else if (isKeycloakGuestAccessEnabled()) {
            // Don't redirect, allow guest access
            return resolve();
          } else {
            return this.keycloakClient.login(this.loginOptions);
          }
        })
        .catch((reason) => reject(reason));
    });
  }

  logout() {
    localStorage.removeItem(localStorageKeys.USERNAME);
    localStorage.removeItem(localStorageKeys.KEYCLOAK_INFO);
    localStorage.removeItem(localStorageKeys.ISADMIN);
    localStorage.removeItem(localStorageKeys.ID_TOKEN);
    this.keycloakClient.logout();
  }

  storeKeycloakInfo() {
    if (this.keycloakClient.tokenParsed && typeof this.keycloakClient.tokenParsed === 'object') {
      const {
        groups,
        realm_access: realmAccess,
        resource_access: resourceAccess,
        azp: clientId,
        preferred_username: preferredUsername,
      } = this.keycloakClient.tokenParsed;

      const realmRoles = (realmAccess && realmAccess.roles) || [];

      let clientRoles = [];
      if (resourceAccess && Object.hasOwn(resourceAccess, clientId)) {
        clientRoles = resourceAccess[clientId].roles || [];
      }

      const roles = [...realmRoles, ...clientRoles];

      const info = {
        groups,
        roles,
      };

      // Compute isAdmin from the configured admin group/role
      const isAdmin = (Array.isArray(groups) && this.adminGroup && groups.includes(this.adminGroup))
        || (Array.isArray(roles) && this.adminRole && roles.includes(this.adminRole))
        || false;

      localStorage.setItem(localStorageKeys.KEYCLOAK_INFO, JSON.stringify(info));
      localStorage.setItem(localStorageKeys.USERNAME, preferredUsername);
      localStorage.setItem(localStorageKeys.ISADMIN, isAdmin);
      // Save id_token locally, so it can be attached as Bearer for network requests
      if (this.keycloakClient.idToken) {
        localStorage.setItem(localStorageKeys.ID_TOKEN, this.keycloakClient.idToken);
      }
    }
  }
}

export const isKeycloakEnabled = () => {
  const { auth } = getAppConfig();
  if (!auth) return false;
  return auth.enableKeycloak || false;
};

let keycloak;

export const initKeycloakAuth = async () => {
  const { default: Keycloak } = await import('keycloak-js');
  keycloak = new KeycloakAuth(Keycloak);
  return keycloak.login();
};

export const getKeycloakAuth = () => {
  if (!keycloak) {
    ErrorHandler("Keycloak not initialized, can't get instance of class");
  }
  return keycloak;
};
