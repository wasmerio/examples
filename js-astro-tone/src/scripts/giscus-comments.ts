import { onReady } from './mount';

const GISCUS_ORIGIN = 'https://giscus.app';
const GISCUS_CLIENT_SRC = `${GISCUS_ORIGIN}/client.js`;
const GISCUS_CUSTOM_THEME_HEIGHT_BUFFER = 40;
const GISCUS_LOAD_ROOT_MARGIN = '3400px 0px';
const GISCUS_REVEAL_MIN_HEIGHT = 500;
const GISCUS_REVEAL_STABILIZE_DELAY = 180;
const GISCUS_REVEAL_FALLBACK_DELAY = 3600;
const GISCUS_THEME_SYNC_DELAYS = [0, 200, 600, 1200, 2400] as const;
const GISCUS_THEME_WATCHDOG_INTERVAL = 500;
const GISCUS_THEME_WATCHDOG_DURATION = 12000;
const themeCache = new Map<string, string>();
let themeObserver: MutationObserver | null = null;
let resizeMessageListenerMounted = false;
let lastGiscusResizeHeight: number | null = null;
let giscusLoadObserver: IntersectionObserver | null = null;
let giscusFallbackRevealTimer: number | null = null;
let giscusMeasuredRevealTimer: number | null = null;
let giscusThemeSyncFrame = 0;
let giscusThemeWatchdogTimer: number | null = null;
let themeSyncEventsMounted = false;

const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const isDarkTheme = (): boolean => {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'dark') return true;
  if (attr === 'light') return false;

  const stored = safeGetItem('theme');
  if (stored === 'dark') return true;
  if (stored === 'light') return false;

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const getGiscusThemeVariant = (container: HTMLElement): string => {
  if (container.dataset.themeMode !== 'custom') {
    return container.dataset.theme || 'preferred_color_scheme';
  }

  return isDarkTheme() ? 'custom-dark' : 'custom-light';
};

const resolveGiscusTheme = async (container: HTMLElement): Promise<string> => {
  if (container.dataset.themeMode !== 'custom') {
    return container.dataset.theme || 'preferred_color_scheme';
  }

  const isDark = isDarkTheme();
  const themePath = isDark ? container.dataset.darkThemePath : container.dataset.lightThemePath;
  if (!themePath) return container.dataset.theme || 'preferred_color_scheme';

  try {
    const themeUrl = new URL(themePath, window.location.href).toString();
    if (window.location.protocol === 'https:') return themeUrl;
    if (themeCache.has(themeUrl)) return themeCache.get(themeUrl)!;

    const response = await fetch(themeUrl);
    if (!response.ok) throw new Error(`Giscus theme fetch failed: ${response.status}`);
    const css = await response.text();
    const compactCss = css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}:;,>])\s*/g, '$1')
      .trim();
    const dataTheme = `data:text/css;charset=utf-8,${encodeURIComponent(compactCss)}`;
    themeCache.set(themeUrl, dataTheme);
    return dataTheme;
  } catch {
    return isDark ? 'noborder_dark' : 'noborder_light';
  }
};

const setDataAttribute = (
  script: HTMLScriptElement,
  name: string,
  value: string | undefined,
): void => {
  if (value) script.setAttribute(name, value);
};

const createGiscusClientScript = (container: HTMLElement, theme: string): HTMLScriptElement => {
  const script = document.createElement('script');
  script.src = GISCUS_CLIENT_SRC;
  script.async = true;
  script.crossOrigin = 'anonymous';

  setDataAttribute(script, 'data-repo', container.dataset.repo);
  setDataAttribute(script, 'data-repo-id', container.dataset.repoId);
  setDataAttribute(script, 'data-category', container.dataset.category);
  setDataAttribute(script, 'data-category-id', container.dataset.categoryId);
  setDataAttribute(script, 'data-mapping', container.dataset.mapping);
  setDataAttribute(script, 'data-term', container.dataset.term);
  setDataAttribute(script, 'data-strict', container.dataset.strict);
  setDataAttribute(script, 'data-reactions-enabled', container.dataset.reactionsEnabled);
  setDataAttribute(script, 'data-emit-metadata', container.dataset.emitMetadata);
  setDataAttribute(script, 'data-input-position', container.dataset.inputPosition);
  setDataAttribute(script, 'data-lang', container.dataset.lang);
  setDataAttribute(script, 'data-loading', container.dataset.loading || 'eager');
  setDataAttribute(script, 'data-theme', theme);

  return script;
};

const revealGiscus = (container: HTMLElement): void => {
  container.classList.add('is-ready');
  container.classList.remove('is-loading');
};

const clearGiscusMeasuredReveal = (): void => {
  if (giscusMeasuredRevealTimer === null) return;
  window.clearTimeout(giscusMeasuredRevealTimer);
  giscusMeasuredRevealTimer = null;
};

const clearGiscusRevealTimers = (): void => {
  if (giscusFallbackRevealTimer !== null) {
    window.clearTimeout(giscusFallbackRevealTimer);
    giscusFallbackRevealTimer = null;
  }
  clearGiscusMeasuredReveal();
};

const scheduleGiscusReveal = (
  container: HTMLElement,
  delay: number,
  options: { kind?: 'fallback' | 'measured'; requireMeasuredHeight?: boolean } = {},
): void => {
  const kind = options.kind || 'measured';
  if (kind === 'fallback' && giscusFallbackRevealTimer !== null) {
    window.clearTimeout(giscusFallbackRevealTimer);
  }
  if (kind === 'measured') clearGiscusMeasuredReveal();

  const timer = window.setTimeout(() => {
    if (kind === 'fallback') {
      giscusFallbackRevealTimer = null;
    } else {
      giscusMeasuredRevealTimer = null;
    }
    if (container.dataset.giscusLoaded !== 'true') return;
    if (options.requireMeasuredHeight) {
      const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
      if (!iframe || iframe.getBoundingClientRect().height < GISCUS_REVEAL_MIN_HEIGHT) return;
    }
    revealGiscus(container);
  }, delay);

  if (kind === 'fallback') {
    giscusFallbackRevealTimer = timer;
  } else {
    giscusMeasuredRevealTimer = timer;
  }
};

const appendGiscusClient = async (container: HTMLElement): Promise<void> => {
  const themeVariant = getGiscusThemeVariant(container);
  const theme = await resolveGiscusTheme(container);
  clearGiscusRevealTimers();
  container.classList.remove('is-ready', 'is-resized');
  container.classList.add('is-loading');
  container.dataset.giscusAppliedTheme = themeVariant;
  container.innerHTML = '';

  container.appendChild(createGiscusClientScript(container, theme));

  scheduleGiscusReveal(container, GISCUS_REVEAL_FALLBACK_DELAY, { kind: 'fallback' });
  scheduleGiscusThemeSync(container);
};

const reloadLocalCustomGiscusTheme = async (
  container: HTMLElement,
  iframe: HTMLIFrameElement,
  themeVariant: string,
): Promise<void> => {
  const theme = await resolveGiscusTheme(container);
  const iframeHeight = Math.max(
    iframe.getBoundingClientRect().height,
    lastGiscusResizeHeight || 0,
    GISCUS_REVEAL_MIN_HEIGHT
  );
  const url = new URL(iframe.src);

  url.searchParams.set('theme', theme);
  iframe.style.height = `${Math.ceil(iframeHeight + GISCUS_CUSTOM_THEME_HEIGHT_BUFFER)}px`;
  container.style.minHeight = `${Math.ceil(iframeHeight + GISCUS_CUSTOM_THEME_HEIGHT_BUFFER)}px`;
  container.dataset.giscusAppliedTheme = themeVariant;
  container.classList.add('is-ready', 'is-resized');
  container.classList.remove('is-loading');
  iframe.src = url.toString();

  window.setTimeout(() => {
    if (container.dataset.giscusAppliedTheme !== themeVariant) return;
    container.style.removeProperty('min-height');
  }, GISCUS_REVEAL_FALLBACK_DELAY);
};

const mountResizeMessageListener = (): void => {
  if (resizeMessageListenerMounted) return;
  resizeMessageListenerMounted = true;

  const applyMeasuredHeight = (resizeHeight: number): void => {
    const container = document.getElementById('giscus-container');
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    if (!container || !iframe) return;

    container.classList.add('is-resized');

    if (container.dataset.themeMode !== 'custom') return;

    iframe.style.height = `${Math.ceil(resizeHeight + GISCUS_CUSTOM_THEME_HEIGHT_BUFFER)}px`;

    const hasMeasuredHeight = iframe.getBoundingClientRect().height >= GISCUS_REVEAL_MIN_HEIGHT;
    if (container.classList.contains('is-loading') && resizeHeight >= GISCUS_REVEAL_MIN_HEIGHT && hasMeasuredHeight) {
      scheduleGiscusReveal(container, GISCUS_REVEAL_STABILIZE_DELAY, {
        kind: 'measured',
        requireMeasuredHeight: true,
      });
    } else if (resizeHeight < GISCUS_REVEAL_MIN_HEIGHT) {
      clearGiscusMeasuredReveal();
    }
  };

  const scheduleMeasuredHeight = (resizeHeight: number): void => {
    window.requestAnimationFrame(() => applyMeasuredHeight(resizeHeight));
    [120, 500, 1200].forEach((delay) => {
      window.setTimeout(() => applyMeasuredHeight(resizeHeight), delay);
    });
  };

  window.addEventListener('message', (event) => {
    if (event.origin !== GISCUS_ORIGIN) return;

    const data = event.data as { giscus?: { resizeHeight?: unknown } } | null;
    const resizeHeight = data?.giscus?.resizeHeight;
    if (typeof resizeHeight !== 'number' || !Number.isFinite(resizeHeight)) return;

    lastGiscusResizeHeight = resizeHeight;
    const container = document.getElementById('giscus-container');
    if (container) {
      if (resizeHeight >= GISCUS_REVEAL_MIN_HEIGHT) {
        scheduleGiscusReveal(container, GISCUS_REVEAL_STABILIZE_DELAY, {
          kind: 'measured',
          requireMeasuredHeight: true,
        });
      } else {
        clearGiscusMeasuredReveal();
      }
      void updateGiscusTheme(container);
    }
    scheduleMeasuredHeight(resizeHeight);
  });
};

const updateGiscusTheme = async (container: HTMLElement): Promise<void> => {
  const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
  if (!iframe?.contentWindow) return;

  const themeVariant = getGiscusThemeVariant(container);
  const usesLocalCustomTheme = container.dataset.themeMode === 'custom' && window.location.protocol !== 'https:';
  if (usesLocalCustomTheme) {
    if (container.dataset.giscusAppliedTheme === themeVariant) return;
    void reloadLocalCustomGiscusTheme(container, iframe, themeVariant);
    return;
  }

  if (container.dataset.giscusAppliedTheme === themeVariant) return;

  const theme = await resolveGiscusTheme(container);
  try {
    iframe.contentWindow.postMessage({ giscus: { setConfig: { theme } } }, GISCUS_ORIGIN);
    container.dataset.giscusAppliedTheme = themeVariant;
  } catch {
    return;
  }

  if (lastGiscusResizeHeight !== null) {
    const resizeHeight = lastGiscusResizeHeight;
    window.setTimeout(() => {
      const giscusIframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
      if (!giscusIframe || container.dataset.themeMode !== 'custom') return;
      giscusIframe.style.height = `${Math.ceil(resizeHeight + GISCUS_CUSTOM_THEME_HEIGHT_BUFFER)}px`;
    }, 250);
  }
};

const requestGiscusThemeSync = (container: HTMLElement): void => {
  if (giscusThemeSyncFrame) return;
  giscusThemeSyncFrame = window.requestAnimationFrame(() => {
    giscusThemeSyncFrame = 0;
    void updateGiscusTheme(container);
  });
};

const scheduleGiscusThemeSync = (container: HTMLElement): void => {
  GISCUS_THEME_SYNC_DELAYS.forEach((delay) => {
    window.setTimeout(() => {
      void updateGiscusTheme(container);
    }, delay);
  });
};

const mountThemeSyncEvents = (container: HTMLElement): void => {
  if (themeSyncEventsMounted) return;
  themeSyncEventsMounted = true;
  window.addEventListener('scroll', () => requestGiscusThemeSync(container), { passive: true });
  window.addEventListener('resize', () => requestGiscusThemeSync(container), { passive: true });
};

const startGiscusThemeWatchdog = (container: HTMLElement): void => {
  if (giscusThemeWatchdogTimer !== null) {
    window.clearInterval(giscusThemeWatchdogTimer);
  }

  const startedAt = Date.now();
  giscusThemeWatchdogTimer = window.setInterval(() => {
    requestGiscusThemeSync(container);
    if (Date.now() - startedAt < GISCUS_THEME_WATCHDOG_DURATION) return;
    if (giscusThemeWatchdogTimer !== null) {
      window.clearInterval(giscusThemeWatchdogTimer);
      giscusThemeWatchdogTimer = null;
    }
  }, GISCUS_THEME_WATCHDOG_INTERVAL);
};

export const mountGiscusComments = (): void => {
  onReady(() => {
    const container = document.getElementById('giscus-container');
    if (!container) return;
    if (container.dataset.giscusReady === 'true') return;
    container.dataset.giscusReady = 'true';

    mountResizeMessageListener();
    mountThemeSyncEvents(container);

    const load = () => {
      if (container.dataset.giscusLoaded === 'true') return;
      container.dataset.giscusLoaded = 'true';
      void appendGiscusClient(container);
      startGiscusThemeWatchdog(container);

      themeObserver?.disconnect();
      themeObserver = new MutationObserver(() => {
        scheduleGiscusThemeSync(container);
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });
    };

    if ('IntersectionObserver' in window) {
      giscusLoadObserver?.disconnect();
      giscusLoadObserver = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          giscusLoadObserver?.disconnect();
          giscusLoadObserver = null;
          load();
        },
        { rootMargin: GISCUS_LOAD_ROOT_MARGIN }
      );
      giscusLoadObserver.observe(container);
      return;
    }

    setTimeout(load, 1200);
  });
};
