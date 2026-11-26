/**
 * Live preview needs `api.dataset("theme")`, not `api.file(...)` — resolve it via
 * `resolveDataSource`. Properties go on `<html>` so a section pinning its own
 * `data-theme` inherits them. The `themeSelector` switch must not be gated at build
 * time: that leaves no element to unhide.
 */

import type {
  CloudCannonEditorWindow,
  CloudCannonJavaScriptV1API,
  CloudCannonJavaScriptV1APIFile,
} from "@cloudcannon/javascript-api";
import { themeCustomProperties } from "@utils/themeTokens.mjs";
import { onPageLoad } from "@component-utils/onPageLoad";
import { framed, resolveDataSource } from "@component-utils/editorData";

const THEME_DATASET = "theme";
const VISIBILITY_KEY = "themeSelector";
const THEME_FILE = "src/data/theme.json";
const THEME_SLUG = "theme";

const POLL_INTERVAL = 300;
const POLL_LIMIT = 300_000;

declare const window: CloudCannonEditorWindow;

/** Reapplied after client-side navigation, which serves the page as built. */
let applied: Record<string, string> = {};
let visible = false;

function apply(properties: Record<string, string>) {
  const { style } = document.documentElement;

  for (const name of Object.keys(applied)) {
    if (!(name in properties)) style.removeProperty(name);
  }

  for (const [name, value] of Object.entries(properties)) {
    style.setProperty(name, value);
  }

  applied = properties;
}

/** Every selector, not just `wire`'s: navigation swaps in a fresh copy that ships `hidden`. */
function setVisible(next: boolean) {
  visible = next;

  document.querySelectorAll<HTMLElement>(".theme-selector").forEach((element) => {
    element.hidden = !visible;
  });
}

function readVisible(data: unknown): boolean {
  if (!data || typeof data !== "object" || Array.isArray(data)) return true;

  return (data as Record<string, unknown>)[VISIBILITY_KEY] !== false;
}

function readTheme(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== "object" || Array.isArray(data)) return {};

  const theme = (data as Record<string, unknown>)[THEME_SLUG];

  return theme && typeof theme === "object" && !Array.isArray(theme)
    ? (theme as Record<string, unknown>)
    : {};
}

interface Live {
  file: CloudCannonJavaScriptV1APIFile;
  startPolling: () => void;
}

/** One subscription per document: re-resolving on navigation would stack duplicate listeners. */
let live: Promise<Live | undefined> | undefined;

function connect(api: CloudCannonJavaScriptV1API): Promise<Live | undefined> {
  live ??= (async () => {
    const source = await resolveDataSource(api, { dataset: THEME_DATASET, path: THEME_FILE });

    if (!source) {
      console.warn(`[theme-selector] ${THEME_FILE} is not editable here.`);

      return undefined;
    }

    const { file, emitters } = source;

    const repaint = framed(async () => {
      const data = await file.data.get();

      apply(themeCustomProperties(readTheme(data)));
      setVisible(readVisible(data));
    });

    // Only a received change event retires the poll; never assume the subscription reaches here.
    let liveEvents = false;
    let poll: ReturnType<typeof setInterval> | undefined;

    const stopPolling = () => {
      clearInterval(poll);
      poll = undefined;
    };

    for (const emitter of emitters) {
      emitter.addEventListener("change", () => {
        liveEvents = true;
        stopPolling();
        repaint();
      });
    }

    const startPolling = () => {
      if (liveEvents || poll) return;

      poll = setInterval(repaint, POLL_INTERVAL);
      setTimeout(stopPolling, POLL_LIMIT);
    };

    repaint();

    return { file, startPolling };
  })();

  return live;
}

async function wire(element: HTMLElement, api: CloudCannonJavaScriptV1API) {
  const connection = await connect(api);

  if (!connection) return;

  const { file, startPolling } = connection;
  const trigger = element.querySelector<HTMLButtonElement>(".theme-selector-trigger");

  trigger?.addEventListener("click", (event) => {
    const rect = trigger.getBoundingClientRect();

    file.data.edit({
      slug: THEME_SLUG,
      position: {
        x: event.clientX,
        y: event.clientY,
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      },
    });

    startPolling();
  });

  setVisible(visible);
}

let pageLoadBound = false;

function bindPageLoad() {
  if (pageLoadBound) return;
  pageLoadBound = true;

  onPageLoad(() => {
    apply(applied);
    setVisible(visible);
    setupAllThemeSelectors();
  });
}

export function setupThemeSelector(element: HTMLElement) {
  bindPageLoad();

  if (element.dataset.themeSelectorInitialized !== undefined) return;
  element.dataset.themeSelectorInitialized = "";

  const start = () => {
    const api = window.CloudCannonAPI?.useVersion("v1", true);

    if (api) wire(element, api);
  };

  if (window.CloudCannonAPI) start();
  else document.addEventListener("cloudcannon:load", start, { once: true });
}

export function setupAllThemeSelectors(root: ParentNode = document) {
  bindPageLoad();

  root
    .querySelectorAll<HTMLElement>(".theme-selector:not([data-theme-selector-initialized])")
    .forEach(setupThemeSelector);
}
