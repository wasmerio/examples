type PagefindSearchResultData = {
  url: string;
  excerpt?: string;
  meta: {
    title?: string;
    category?: string;
    preview?: string;
  };
};

type PagefindSearch = {
  results: Array<{
    data: () => Promise<PagefindSearchResultData>;
  }>;
};

type PagefindApi = {
  debouncedSearch: (
    term: string,
    options?: Record<string, never>,
    debounceTimeoutMs?: number,
  ) => Promise<PagefindSearch | null>;
};

type SearchEntry = {
  title: string;
  excerpt: string;
  url: string;
  category?: string;
};

type SearchElements = {
  input: HTMLInputElement;
  results: HTMLDivElement;
  status: HTMLElement | null;
};

const MAX_RESULTS = 8;
const SEARCH_DEBOUNCE_MS = 150;
const PAGEFIND_BUNDLE_URL = '/pagefind/pagefind.js';
const SEARCH_PREVIEWS_SCRIPT_ID = 'docs-search-previews';

let pagefindPromise: Promise<PagefindApi | null> | undefined;
let searchPreviewsCache: Record<string, string> | undefined;
let searchShortcutsBound = false;

const stripTags = (value: string) => value.replace(/<[^>]*>/g, '').trim();

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getSearchTerms = (query: string) =>
  Array.from(
    new Set(
      query
        .trim()
        .split(/\s+/)
        .map((term) => term.trim())
        .filter(Boolean)
        .sort((left, right) => right.length - left.length),
    ),
  );

const appendHighlightedText = (element: HTMLElement, value: string, query = '') => {
  const terms = getSearchTerms(query);
  if (!value || terms.length === 0) {
    element.append(document.createTextNode(value));
    return;
  }

  const matcher = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi');
  let lastIndex = 0;

  for (const match of value.matchAll(matcher)) {
    const matchIndex = match.index ?? 0;
    const matchedText = match[0];

    if (matchIndex > lastIndex) {
      element.append(document.createTextNode(value.slice(lastIndex, matchIndex)));
    }

    const mark = document.createElement('mark');
    mark.className = 'search-highlight';
    mark.textContent = matchedText;
    element.append(mark);

    lastIndex = matchIndex + matchedText.length;
  }

  if (lastIndex < value.length) {
    element.append(document.createTextNode(value.slice(lastIndex)));
  }
};

const normalizeSearchUrl = (value: string) => {
  try {
    const url = new URL(value, window.location.origin);
    return url.pathname.replace(/\/$/, '') || '/';
  } catch {
    return value.replace(/\/$/, '') || '/';
  }
};

const getPagefind = () => {
  if (import.meta.env.DEV) {
    return Promise.resolve(null);
  }

  if (!pagefindPromise) {
    pagefindPromise = import(/* @vite-ignore */ PAGEFIND_BUNDLE_URL)
      .then((module) => module as PagefindApi)
      .catch((error: unknown) => {
        console.error('Unable to load Pagefind.', error);
        return null;
      });
  }

  return pagefindPromise;
};

const getSearchElements = (root: HTMLElement): SearchElements | null => {
  const input = root.querySelector('[data-search-input]');
  const results = root.querySelector('[data-search-results]');
  const status = root.querySelector('[data-search-status]');

  if (!(input instanceof HTMLInputElement) || !(results instanceof HTMLDivElement)) {
    return null;
  }

  return {
    input,
    results,
    status: status instanceof HTMLElement ? status : null,
  };
};

const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;

  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target.isContentEditable
  );
};

const getSearchDialog = () => document.querySelector<HTMLDialogElement>('[data-search-dialog]');

const openSearchDialog = () => {
  const dialog = getSearchDialog();
  if (!dialog || dialog.open) return;

  const input = dialog.querySelector<HTMLInputElement>('[data-search-input]');
  dialog.showModal();
  if (input) {
    input.value = '';
    input.focus();
  }
};

const bindSearchShortcuts = () => {
  if (searchShortcutsBound) return;
  searchShortcutsBound = true;

  document.addEventListener('keydown', (event) => {
    if (event.defaultPrevented) return;

    const isSlashShortcut = event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey;
    const isCommandPaletteShortcut =
      event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey) && !event.altKey;

    if (!isSlashShortcut && !isCommandPaletteShortcut) return;
    if (isSlashShortcut && isEditableTarget(event.target)) return;

    event.preventDefault();
    openSearchDialog();
  });

  document.querySelectorAll('[data-search-open]').forEach((trigger) => {
    trigger.addEventListener('click', () => openSearchDialog());
  });

  const dialog = getSearchDialog();
  dialog?.querySelector('[data-search-close]')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
};

const setResultsVisibility = (input: HTMLInputElement, results: HTMLDivElement, isVisible: boolean) => {
  results.classList.toggle('hidden', !isVisible);
  results.setAttribute('aria-hidden', String(!isVisible));
  input.setAttribute('aria-expanded', String(isVisible));
};

const areResultsVisible = (results: HTMLDivElement) =>
  !results.classList.contains('hidden') && results.getAttribute('aria-hidden') !== 'true';

const getResultLinks = (results: HTMLDivElement) =>
  Array.from(results.querySelectorAll<HTMLAnchorElement>('[data-search-result-link]'));

const announceStatus = (status: HTMLElement | null, message = '') => {
  if (status) {
    status.textContent = message;
  }
};

const hideResults = (input: HTMLInputElement, results: HTMLDivElement, status?: HTMLElement | null) => {
  results.replaceChildren();
  setResultsVisibility(input, results, false);
  announceStatus(status ?? null, '');
};

const renderEmptyState = (
  input: HTMLInputElement,
  results: HTMLDivElement,
  status: HTMLElement | null,
  message: string,
) => {
  const emptyState = document.createElement('p');
  emptyState.className = 'search-empty';
  emptyState.textContent = message;

  results.replaceChildren(emptyState);
  setResultsVisibility(input, results, true);
  announceStatus(status, message);
};

const resultIcon = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
    <path d="M14 2v5a1 1 0 0 0 1 1h5" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
  </svg>
`;

const enterIcon = `
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M20 4v7a4 4 0 0 1-4 4H4" /><path d="m9 10-5 5 5 5" />
  </svg>
`;

const renderResults = (
  input: HTMLInputElement,
  results: HTMLDivElement,
  status: HTMLElement | null,
  entries: SearchEntry[],
  label = 'Search results',
  query = '',
) => {
  const heading = document.createElement('p');
  heading.className = 'search-results-label eyebrow';
  heading.textContent = label;

  const list = document.createElement('ul');
  list.className = 'search-results-list';
  list.setAttribute('aria-label', label);

  entries.forEach((entry, index) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = entry.url;
    link.className = 'search-result-link';
    link.dataset.searchResultLink = 'true';
    link.id = `${input.id}-result-${index}`;
    link.role = 'option';
    link.tabIndex = -1;
    link.setAttribute('aria-selected', 'false');

    const icon = document.createElement('span');
    icon.className = 'search-result-icon';
    icon.innerHTML = resultIcon;

    const body = document.createElement('span');
    body.className = 'search-result-body';

    if (entry.category) {
      const meta = document.createElement('span');
      meta.className = 'search-result-meta';
      meta.textContent = entry.category;
      body.append(meta);
    }

    const title = document.createElement('span');
    title.className = 'search-result-title';
    appendHighlightedText(title, entry.title, query);
    body.append(title);

    if (entry.excerpt) {
      const excerpt = document.createElement('span');
      excerpt.className = 'search-result-excerpt';
      appendHighlightedText(excerpt, entry.excerpt, query);
      body.append(excerpt);
    }

    const enter = document.createElement('span');
    enter.className = 'search-result-enter';
    enter.innerHTML = enterIcon;

    link.append(icon, body, enter);
    item.append(link);
    list.append(item);
  });

  results.replaceChildren(heading, list);
  setResultsVisibility(input, results, true);
  announceStatus(status, `${entries.length} ${entries.length === 1 ? 'result' : 'results'} available.`);
};

const getSuggestions = (root: HTMLElement): SearchEntry[] => {
  const rawSuggestions = root.dataset.searchSuggestions;
  if (!rawSuggestions) return [];

  try {
    const parsed = JSON.parse(rawSuggestions) as SearchEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getSearchPreviews = () => {
  if (searchPreviewsCache) return searchPreviewsCache;

  const previews = document.getElementById(SEARCH_PREVIEWS_SCRIPT_ID);
  if (!(previews instanceof HTMLScriptElement) || !previews.textContent) {
    searchPreviewsCache = {};
    return searchPreviewsCache;
  }

  try {
    const parsed = JSON.parse(previews.textContent) as Record<string, string>;
    searchPreviewsCache = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    searchPreviewsCache = {};
  }

  return searchPreviewsCache;
};

const renderSuggestions = (
  root: HTMLElement,
  input: HTMLInputElement,
  results: HTMLDivElement,
  status: HTMLElement | null,
) => {
  const suggestions = getSuggestions(root);
  if (suggestions.length === 0) {
    hideResults(input, results, status);
    return;
  }

  renderResults(input, results, status, suggestions, 'Popular articles');
  announceStatus(
    status,
    `${suggestions.length} suggested ${suggestions.length === 1 ? 'article' : 'articles'} available.`,
  );
};

const searchPagefind = async (
  query: string,
  searchPreviews: Record<string, string>,
): Promise<SearchEntry[] | null | undefined> => {
  const pagefind = await getPagefind();
  if (!pagefind) return null;

  const search = await pagefind.debouncedSearch(query, {}, SEARCH_DEBOUNCE_MS);
  if (!search) return undefined;

  return Promise.all(
    search.results.slice(0, MAX_RESULTS).map(async (result) => {
      const data = await result.data();
      const normalizedUrl = normalizeSearchUrl(data.url);
      const preview = data.excerpt
        ? stripTags(data.excerpt)
        : (searchPreviews[normalizedUrl] ?? data.meta.preview ?? '');
      const title = data.meta.title ?? 'Untitled';

      return {
        title,
        excerpt: preview,
        url: data.url,
        category: data.meta.category,
      };
    }),
  );
};

const attachSearch = (root: HTMLElement) => {
  const elements = getSearchElements(root);
  if (!elements) return;

  const { input, results, status } = elements;
  const emptyMessage = root.dataset.searchEmpty ?? 'No matching articles found.';
  const errorMessage = root.dataset.searchError ?? 'Search is temporarily unavailable.';
  const searchPreviews = getSearchPreviews();
  const isDialog = root.dataset.searchMode === 'dialog';
  let latestQuery = '';
  let activeResultIndex = -1;

  const setActiveResult = (index: number) => {
    const links = getResultLinks(results);
    if (links.length === 0) {
      activeResultIndex = -1;
      return;
    }

    activeResultIndex = (index + links.length) % links.length;

    links.forEach((link, linkIndex) => {
      const isActive = linkIndex === activeResultIndex;
      link.classList.toggle('is-active', isActive);
      link.setAttribute('aria-selected', String(isActive));

      if (isActive) {
        input.setAttribute('aria-activedescendant', link.id);
        link.scrollIntoView({ block: 'nearest' });
      }
    });
  };

  const clearActiveResult = () => {
    activeResultIndex = -1;
    input.removeAttribute('aria-activedescendant');
    getResultLinks(results).forEach((link) => {
      link.classList.remove('is-active');
      link.setAttribute('aria-selected', 'false');
    });
  };

  const navigateToActiveResult = () => {
    const links = getResultLinks(results);
    const link = links[activeResultIndex] ?? links[0];
    if (!link) return false;

    window.location.href = link.href;
    return true;
  };

  const runSearch = async () => {
    const query = input.value.trim();
    latestQuery = query;

    if (!query) {
      renderSuggestions(root, input, results, status);
      clearActiveResult();
      return;
    }

    const matches = await searchPagefind(query, searchPreviews);
    if (query !== latestQuery) return;

    if (matches === undefined) {
      return;
    }

    if (matches === null) {
      renderEmptyState(input, results, status, errorMessage);
      clearActiveResult();
      return;
    }

    if (matches.length === 0) {
      renderEmptyState(input, results, status, emptyMessage);
      clearActiveResult();
      return;
    }

    renderResults(input, results, status, matches, 'Search results', query);
    clearActiveResult();
    if (isDialog) setActiveResult(0);
  };

  input.addEventListener('focus', () => {
    void getPagefind();
    if (!input.value.trim()) {
      renderSuggestions(root, input, results, status);
      clearActiveResult();
    }
  });

  input.addEventListener('click', () => {
    if (!input.value.trim()) {
      renderSuggestions(root, input, results, status);
      clearActiveResult();
    }
  });

  input.addEventListener('input', () => {
    clearActiveResult();
    void runSearch();
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (isDialog) return;
      hideResults(input, results, status);
      clearActiveResult();
      input.blur();
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const links = getResultLinks(results);
      if (!areResultsVisible(results) || links.length === 0) return;

      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      const nextIndex =
        activeResultIndex === -1 ? (direction > 0 ? 0 : links.length - 1) : activeResultIndex + direction;
      setActiveResult(nextIndex);
      return;
    }

    if (event.key === 'Enter' && areResultsVisible(results) && getResultLinks(results).length > 0) {
      event.preventDefault();
      navigateToActiveResult();
    }
  });

  document.addEventListener('click', (event) => {
    if (isDialog) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (!root.contains(target)) {
      hideResults(input, results);
      clearActiveResult();
    }
  });

  root.addEventListener('focusout', (event) => {
    if (isDialog) return;
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && root.contains(nextTarget)) return;
    hideResults(input, results);
    clearActiveResult();
  });
};

const initDocsSearch = () => {
  bindSearchShortcuts();

  document.querySelectorAll<HTMLElement>('[data-docs-search]').forEach((root) => {
    if (root.dataset.searchBound === 'true') return;
    root.dataset.searchBound = 'true';
    attachSearch(root);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDocsSearch, { once: true });
} else {
  initDocsSearch();
}
