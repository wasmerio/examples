import { load as yamlLoad } from 'js-yaml';
import request from '@/utils/request';
import i18n from '@/utils/i18n';
import { serviceEndpoints } from '@/utils/config/defaults';
import { statusMsg, statusErrorMsg } from '@/utils/logging/CoolConsole';
import { toast } from '@/utils/Toast';

const SW_LABEL = 'Service Worker Status';
const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000; // hourly
const AUTH_PROXY_COMPAT_KEY = 'dashy-auth-proxy-compat'; // mirrors appConfig.enableAuthProxyCompat
const AUTH_PROXY_RELOAD_KEY = 'dashy-auth-proxy-reloaded'; // one reload per tab, guards against loops

/* Loads conf.yml and returns the parsed object, or null on failure */
const loadAppConfig = async () => {
  try {
    const { data } = await request.get('/conf.yml');
    return yamlLoad(data) || null;
  } catch (e) {
    statusErrorMsg(SW_LABEL, 'Failed to load config for SW check', e);
    return null;
  }
};

/* Best-effort cleanup of any prior service worker (used when user opts out) */
const unregisterAll = async () => {
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    if (!regs.length) return;
    await Promise.all(regs.map(r => r.unregister().catch(() => {})));
    statusMsg(SW_LABEL, 'Service worker unregistered (opt-out).');
  } catch { /* no-op */ }
};

/* Remember the opt-in so it's known on later loads even when conf.yml comes from cache or fails */
const rememberAuthProxyCompat = (enabled) => {
  try {
    if (enabled) localStorage.setItem(AUTH_PROXY_COMPAT_KEY, '1');
    else localStorage.removeItem(AUTH_PROXY_COMPAT_KEY);
  } catch { /* storage unavailable */ }
};

const isReloadGuardSet = () => {
  try { return !!sessionStorage.getItem(AUTH_PROXY_RELOAD_KEY); } catch { return true; }
};
const setReloadGuard = (on) => {
  try {
    if (on) sessionStorage.setItem(AUTH_PROXY_RELOAD_KEY, '1');
    else sessionStorage.removeItem(AUTH_PROXY_RELOAD_KEY);
  } catch { /* no-op */ }
};

/**
 * If enabled (with appConfig.enableAuthProxyCompat), then check for expired sessions,
 * and then drop the cached SW and trigger a reload so the proxy can re-authenticate user
 */
const recoverFromAuthProxy = async () => {
  try { if (localStorage.getItem(AUTH_PROXY_COMPAT_KEY) !== '1') return false; } catch { return false; }
  let res;
  try {
    res = await fetch(serviceEndpoints.getUser, { cache: 'no-store', redirect: 'manual' });
  } catch { return false; } // network error / offline - keep SW for offline use
  if (res.type !== 'opaqueredirect') { setReloadGuard(false); return false; } // valid session - re-arm
  if (!navigator.serviceWorker.controller) return false; // no cached SW blocking the redirect
  if (isReloadGuardSet()) return false; // already reloaded once - avoid repeat on false positives
  setReloadGuard(true);
  statusMsg(SW_LABEL, 'Auth proxy redirect detected - unregistering SW and reloading.');
  await unregisterAll();
  window.location.reload();
  return true;
};

/* Sticky toast with a Refresh action that swaps in the new SW and reloads */
const promptForUpdate = (updateSW) => {
  const t = i18n.global.t;
  toast(t('updates.sw-update-available'), {
    type: 'info',
    duration: 0,
    dismissible: true,
    action: { text: t('updates.sw-update-action'), onClick: () => updateSW(true) },
  });
};

const initServiceWorker = async () => {
  if (import.meta.env.DEV) return;
  if (!('serviceWorker' in navigator)) return;

  const conf = await loadAppConfig();
  if (conf?.appConfig) {
    rememberAuthProxyCompat(conf.appConfig.enableServiceWorker && conf.appConfig.enableAuthProxyCompat);
  }

  // Probe for an auth-proxy session expiry
  if (await recoverFromAuthProxy()) return;

  if (!conf) return; // network/parse failed - leave any existing SW alone

  if (!conf.appConfig?.enableServiceWorker) {
    await unregisterAll();
    return;
  }

  try {
    const { registerSW } = await import('virtual:pwa-register');
    const updateSW = registerSW({
      onRegisteredSW(swUrl, reg) {
        statusMsg(SW_LABEL, `Service worker registered (${swUrl}).`);
        if (reg) setInterval(() => reg.update().catch(() => {}), UPDATE_CHECK_INTERVAL_MS);
      },
      onNeedRefresh: () => promptForUpdate(updateSW),
      onOfflineReady: () => statusMsg(SW_LABEL, 'App is ready for offline use.'),
      onRegisterError: (e) => statusErrorMsg(SW_LABEL, 'Error during SW registration', e),
    });
  } catch (e) {
    statusErrorMsg(SW_LABEL, 'Error setting up service worker', e);
  }
};

export default initServiceWorker;
