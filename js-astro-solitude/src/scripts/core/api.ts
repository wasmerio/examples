import { navigate } from 'astro:transitions/client';
import type { SolitudeAPI } from '@/scripts/types/api';
import { getConfig, getPageConfig } from '@/scripts/core/config';
import { lifecycle } from '@/scripts/core/lifecycle';
import {
  loadScript,
  loadStyle,
  type ScriptOptions,
} from '@/scripts/core/resources';
import { saveToLocal } from '@/scripts/core/storage';
import { createIcon } from '@/scripts/core/icons';

document.documentElement.dataset.solitudeRuntime = 'booting';

const api: SolitudeAPI = window.Solitude || ({} as SolitudeAPI);

Object.defineProperties(api, {
  config: { configurable: true, get: getConfig },
  page: { configurable: true, get: getPageConfig },
});

Object.assign(api, {
  createIcon,
  saveToLocal,
  loadScript(url: string, options?: ScriptOptions) {
    if (/barrage(?:\.min)?\.js(?:\?|$)/.test(url)) api.installLegacyAdapter?.();
    return loadScript(url, options);
  },
  loadStyle,
  on: lifecycle.on.bind(lifecycle),
  listen: lifecycle.listen.bind(lifecycle),
  onPageCleanup: lifecycle.add.bind(lifecycle),
  addGlobalFn(
    key: string,
    fn: () => void,
    name: string | false = false,
    parent = window,
  ) {
    const globalFn = parent.globalFn || {};
    const keyObject = globalFn[key] || {};
    if (name && keyObject[name]) return;
    const id = name || Object.keys(keyObject).length;
    keyObject[id] = fn;
    globalFn[key] = keyObject;
    parent.globalFn = globalFn;
  },
  addEventListenerPjax(
    element: EventTarget | null,
    event: string,
    handler: EventListener,
    options: boolean | AddEventListenerOptions = false,
  ) {
    if (!element?.addEventListener) return;
    element.addEventListener(event, handler, options);
    lifecycle.add(() => element.removeEventListener(event, handler, options));
  },
  diffDateFormat(elements: NodeListOf<HTMLElement>) {
    elements?.forEach((item) => {
      const date = new Date(
        item.getAttribute('datetime') || item.textContent || '',
      );
      if (!Number.isNaN(date.valueOf()))
        item.textContent = `${date.getMonth() + 1}/${date.getDate()}`;
    });
  },
  installLegacyAdapter() {
    const aliases = { utils: api, sco: api, GLOBAL_CONFIG: api.config };
    Object.entries(aliases).forEach(([name, value]) => {
      if (!(name in window))
        Object.defineProperty(window, name, { configurable: true, value });
    });
  },
  disposePage: lifecycle.disposePage.bind(lifecycle),
  navigate(url: string) {
    if (!url) return;
    void navigate(url);
  },
});

api.getCSS = (url: string, id: string | false = false) =>
  api.loadStyle(url, id ? { id } : {});
api.getScript = (url: string, attributes: Record<string, string> = {}) =>
  api.loadScript(url, { attributes });

window.Solitude = api;

export { api as Solitude };
