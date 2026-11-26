// The editor's re-render strips inline `<script>`s, so every component whose
// behavior lives in one must have its setup registered here as well.

import {
  setupAllContentSelectors,
  setupContentSelector,
} from "./src/components/building-blocks/wrappers/content-selector/setup";
import {
  setupAllModals,
  setupModalShell,
} from "./src/components/building-blocks/wrappers/modal/setup";
import { setupAllForms, setupForm } from "./src/components/building-blocks/forms/form/setup";
import { setupAllVideos } from "./src/components/building-blocks/core-elements/video/setup";
import { setupAllSearch, setupSearch } from "./src/components/navigation/search/setup";
import { setupAllTocs, setupToc } from "./src/components/navigation/toc/setup";
import {
  setupAllCodeSurfaces,
  setupCodeFence,
  setupCodeSurface,
} from "./src/components/building-blocks/core-elements/code-block/setup";
import {
  setupAllCodeTabs,
  setupCodeTabs,
} from "./src/components/building-blocks/core-elements/code-tabs/setup";
import {
  setupAllDiagrams,
  setupDiagram,
} from "./src/components/building-blocks/core-elements/diagram/setup";
import {
  setupAllPageFeedback,
  setupPageFeedback,
} from "./src/components/navigation/page-feedback/setup";
import { setupAllCopyPage, setupCopyPage } from "./src/components/navigation/copy-page/setup";
import { setupHeadingLinks } from "./src/components/navigation/heading-links/setup";
import {
  setupAllPrintButtons,
  setupPrintButton,
} from "./src/components/building-blocks/core-elements/print-button/setup";
import {
  setupAllMasonry,
  setupMasonry,
} from "./src/components/building-blocks/wrappers/masonry/setup";
import { setupAllThemeSelectors } from "./src/components/navigation/theme-selector/setup";
import { setupSiteChrome } from "./src/components/utils/siteChrome";

const DEBUG = import.meta.env.DEV;

function log(...args) {
  if (DEBUG) console.log("[editor-live-sync]", ...args);
}

function initNewComponents(root) {
  if (root.nodeType !== Node.ELEMENT_NODE) return;

  const newModals = [];

  if (root.classList?.contains("modal-popover") && !root.hasAttribute("data-modal-initialized")) {
    newModals.push(root);
  }

  root
    .querySelectorAll(".modal-popover:not([data-modal-initialized])")
    .forEach((el) => newModals.push(el));

  for (const el of newModals) {
    log("initializing new modal", el);
    setupModalShell(el);
  }

  const newSearch = [];

  if (root.classList?.contains("search") && !root.hasAttribute("data-search-initialized")) {
    newSearch.push(root);
  }

  root
    .querySelectorAll(".search:not([data-search-initialized])")
    .forEach((el) => newSearch.push(el));

  for (const el of newSearch) {
    log("initializing new search", el);
    setupSearch(el);
  }

  const newTocs = [];

  if (root.classList?.contains("toc") && !root.hasAttribute("data-toc-initialized")) {
    newTocs.push(root);
  }

  root.querySelectorAll(".toc:not([data-toc-initialized])").forEach((el) => newTocs.push(el));

  for (const el of newTocs) {
    log("initializing new toc", el);
    setupToc(el);
  }

  const initialiseNew = (selector, flag, setup, label) => {
    const found = [];

    if (root.classList?.contains(selector) && !root.hasAttribute(flag)) found.push(root);

    root.querySelectorAll(`.${selector}:not([${flag}])`).forEach((el) => found.push(el));

    for (const el of found) {
      log(`initializing new ${label}`, el);
      setup(el);
    }
  };

  initialiseNew("code-surface", "data-code-initialized", setupCodeSurface, "code surface");
  initialiseNew("astro-code", "data-code-initialized", setupCodeFence, "code fence");
  initialiseNew("code-tabs", "data-code-tabs-initialized", setupCodeTabs, "code tabs");
  initialiseNew("diagram", "data-diagram-initialized", setupDiagram, "diagram");
  initialiseNew("page-feedback", "data-feedback-initialized", setupPageFeedback, "page feedback");
  initialiseNew("print-button", "data-print-initialized", setupPrintButton, "print button");
  initialiseNew("copy-page", "data-copy-page-initialized", setupCopyPage, "copy page");

  const newMasonry = [];

  if (root.classList?.contains("masonry") && !root.hasAttribute("data-masonry-initialized")) {
    newMasonry.push(root);
  }

  root
    .querySelectorAll(".masonry:not([data-masonry-initialized])")
    .forEach((el) => newMasonry.push(el));

  for (const el of newMasonry) {
    log("initializing new masonry", el);
    setupMasonry(el);
  }

  const newForms = [];

  if (root.classList?.contains("form") && !root.hasAttribute("data-form-initialized")) {
    newForms.push(root);
  }

  root
    .querySelectorAll("form.form:not([data-form-initialized])")
    .forEach((el) => newForms.push(el));

  for (const el of newForms) {
    log("initializing new form", el);
    setupForm(el);
  }

  const newContentSelectors = [];

  if (root.classList?.contains("content-selector-items")) {
    newContentSelectors.push(root);
  }

  root.querySelectorAll(".content-selector-items").forEach((el) => newContentSelectors.push(el));

  for (const el of newContentSelectors) {
    log("initializing new content selector", el);
    setupContentSelector(el);
  }

  setupAllVideos(root);
}

// CloudCannon resets attributes on <html>, so editor-only CSS can't hang off a flag there; a
// <style> in <head> survives. The stretched card link would otherwise swallow clicks on editable regions.
const editorStyles = document.createElement("style");

editorStyles.textContent = ".card-grid-hit { pointer-events: none; }";
document.head.append(editorStyles);

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const { type } = mutation;

    if (type === "childList") {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;

        initNewComponents(node);
      }
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

setupAllModals();
setupAllSearch();
setupAllTocs();
setupAllMasonry();
setupAllContentSelectors();
setupAllVideos();
setupAllForms();
setupAllCodeSurfaces();
setupAllCodeTabs();
setupAllDiagrams();
setupAllPageFeedback();
setupAllPrintButtons();
setupAllCopyPage();
setupHeadingLinks();
setupAllThemeSelectors();
setupSiteChrome();

log("observer active");
