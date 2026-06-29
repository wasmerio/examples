/**
 * Server-side OIDC / Keycloak token verification.
 *
 * Why this exists: Dashy's OIDC + Keycloak flows are otherwise entirely
 * client-side, so the server never sees an identity. This module verifies the
 * id_token a logged-in browser attaches to API requests, so admin-gated
 * endpoints (and authenticated endpoints generally) can enforce auth server-side.
 *
 * The middleware is permissive on a missing Authorization header — bootstrap
 * fetches (e.g. /conf.yml) must succeed before the user is logged in. Endpoints
 * that require auth should be paired with `requireAuth` (in app.js).
 * A present-but-invalid token is always rejected.
 */

const fs = require('fs');
const yaml = require('js-yaml');
const { createRemoteJWKSet, jwtVerify } = require('jose');

/* Normalise the OIDC / Keycloak block from conf.yml into a unified shape.
   Returns null when neither provider is enabled or required fields are missing. */
function loadOidcSettings(authConfig) {
  if (!authConfig || typeof authConfig !== 'object') return null;

  if (authConfig.enableOidc && authConfig.oidc) {
    const {
      endpoint, clientId, adminGroup, adminRole, allowedIssuers,
    } = authConfig.oidc;
    if (!endpoint || !clientId) return null;
    return {
      kind: 'oidc',
      issuer: String(endpoint),
      clientId: String(clientId),
      adminGroup: adminGroup || null,
      adminRole: adminRole || null,
      allowedIssuers: Array.isArray(allowedIssuers) && allowedIssuers.length
        ? allowedIssuers.map(String) : null,
    };
  }

  if (authConfig.enableKeycloak && authConfig.keycloak) {
    const {
      serverUrl, realm, clientId, adminGroup, adminRole, legacySupport,
    } = authConfig.keycloak;
    if (!serverUrl || !realm || !clientId) return null;
    // Mirror the URL keycloak-js builds in the browser.
    const base = (legacySupport ? `${serverUrl}/auth` : serverUrl).replace(/\/$/, '');
    return {
      kind: 'keycloak',
      issuer: `${base}/realms/${realm}`,
      clientId: String(clientId),
      adminGroup: adminGroup || null,
      adminRole: adminRole || null,
    };
  }

  return null;
}

/* Per-issuer cache: discovery metadata + JWKS resolver. createRemoteJWKSet
   handles key caching + rotation internally. */
const issuerCache = new Map();

async function fetchDiscovery(issuer) {
  const base = issuer.endsWith('/') ? issuer : `${issuer}/`;
  const url = new URL('.well-known/openid-configuration', base);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OIDC discovery returned ${res.status} for ${url}`);
  return res.json();
}

async function getIssuerContext(issuer) {
  const cached = issuerCache.get(issuer);
  if (cached) return cached;
  const config = await fetchDiscovery(issuer);
  if (!config.issuer || !config.jwks_uri) {
    throw new Error('Discovery document is missing `issuer` or `jwks_uri`');
  }
  const ctx = {
    canonicalIssuer: config.issuer,
    jwks: createRemoteJWKSet(new URL(config.jwks_uri)),
  };
  issuerCache.set(issuer, ctx);
  return ctx;
}

/* Helper is true when the token's claims map to the configured admin group/role.
   Handles standard OIDC top-level `groups`/`roles` claims, GitLab's `groups_direct`
   plus Keycloak's nested realm_access / resource_access role shapes */
function deriveIsAdmin(claims, settings) {
  if (!claims) return false;
  const groups = Array.isArray(claims.groups) ? [...claims.groups] : [];
  if (Array.isArray(claims.groups_direct)) groups.push(...claims.groups_direct);
  const roles = Array.isArray(claims.roles) ? [...claims.roles] : [];

  if (settings.kind === 'keycloak') {
    const realmRoles = claims.realm_access && claims.realm_access.roles;
    if (Array.isArray(realmRoles)) roles.push(...realmRoles);
    const clientRoles = claims.resource_access
      && claims.resource_access[settings.clientId]
      && claims.resource_access[settings.clientId].roles;
    if (Array.isArray(clientRoles)) roles.push(...clientRoles);
  }

  const { adminGroup, adminRole } = settings;
  if (adminGroup && groups.includes(adminGroup)) return true;
  if (adminRole && roles.includes(adminRole)) return true;
  return false;
}

/* Connect middleware factory. Verifies Bearer id_token; sets req.auth on success
 * If `permissive: true`, falls through on verification failure instead of 401 */
function createOidcMiddleware(settings, { permissive = false } = {}) {
  return async (req, res, next) => {
    const header = req.headers.authorization || '';
    const match = header.match(/^Bearer\s+(.+)$/i);
    if (!match) return next(); // No token attached, let downstream gates decide
    const token = match[1].trim();
    if (!token) return next();

    try {
      const { canonicalIssuer, jwks } = await getIssuerContext(settings.issuer);
      const { payload } = await jwtVerify(token, jwks, {
        issuer: settings.allowedIssuers || canonicalIssuer,
        audience: settings.clientId,
        clockTolerance: '30s',
      });
      req.auth = {
        user: payload.preferred_username || payload.email || payload.sub || 'unknown',
        isAdmin: deriveIsAdmin(payload, settings),
        claims: payload,
      };
      return next();
    } catch (e) {
      console.warn('[auth-oidc] token verification failed:', e.message || e); // eslint-disable-line no-console
      if (permissive) return next();
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - Invalid or expired token',
      });
    }
  };
}

/* Prevent unauthenticated access to config, by making stripped version of conf.yml
 * When auth is configured AND guest access disabled AND user not yet authenticated
 * Otherwise, returns null, and the parent proceeds to use full config
 * Has just enough info (the auth config) to initiate the auth process
 * Plus a special `_bootstrap` marker so frontend can distinguish a stripped config
*/
function maybeBootstrapConfig(filePath, opts) {
  const { isRootConfig, isAuthenticated, guestAccessOn } = opts;
  // Pass through, if already authenticated / auth not configured
  if (!isRootConfig || isAuthenticated || guestAccessOn) return null;
  const full = yaml.load(fs.readFileSync(filePath, 'utf8')) || {};
  return yaml.dump({
    _bootstrap: {
      authenticated: false,
      timestamp: new Date().toISOString(),
    },
    appConfig: {
      auth: full.appConfig?.auth || {},
      enableServiceWorker: full.appConfig?.enableServiceWorker,
      enableAuthProxyCompat: full.appConfig?.enableAuthProxyCompat,
    },
    pageInfo: { title: `Login | ${full.pageInfo?.title || 'Dashy'}` },
  });
}

module.exports = {
  loadOidcSettings,
  createOidcMiddleware,
  deriveIsAdmin,
  maybeBootstrapConfig,
};
