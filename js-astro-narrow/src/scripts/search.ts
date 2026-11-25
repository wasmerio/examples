import MiniSearch from 'minisearch';
import { defaultLocale } from '../config/i18n';

type SearchItem = {
  title: string;
  description?: string;
  url: string;
  lang: string;
  type: string;
  tags?: string[];
  content?: string;
};

/* The index stores tags as one string; MiniSearch tokenizes each field. */
type SearchDocument = Omit<SearchItem, 'tags'> & { tags: string };

const modal = document.getElementById('search-modal');
const overlay = document.getElementById('search-overlay');
const input = document.getElementById('search-input') as HTMLInputElement | null;
const closeButton = document.getElementById('search-close');
const empty = document.getElementById('search-empty');
const loading = document.getElementById('search-loading');
const noResults = document.getElementById('search-no-results');
const results = document.getElementById('search-results');
const locale = modal?.dataset.locale || defaultLocale;
const base = import.meta.env.BASE_URL || '/';
let engine: MiniSearch<SearchDocument> | null = null;
let indexPromise: Promise<SearchItem[]> | null = null;

const CJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;
const SEGMENT =
  /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]+|[\p{L}\p{N}]+/gu;

/*
 * Chinese and Japanese have no spaces, so whitespace tokenizing would index a
 * whole sentence as one term. Overlapping bigrams keep partial matches useful,
 * and prefix search still answers a single-character query.
 */
function tokenize(text: string) {
  const tokens: string[] = [];
  for (const [segment] of text.matchAll(SEGMENT)) {
    if (!CJK.test(segment)) {
      tokens.push(segment);
    } else if (segment.length === 1) {
      tokens.push(segment);
    } else {
      for (let i = 0; i < segment.length - 1; i += 1) tokens.push(segment.slice(i, i + 2));
    }
  }
  return tokens;
}

function show(element: HTMLElement | null) {
  element?.classList.remove('hidden');
}

function hide(element: HTMLElement | null) {
  element?.classList.add('hidden');
}

function openSearch() {
  modal?.classList.remove('pointer-events-none', 'opacity-0', 'scale-95');
  modal?.classList.add('opacity-100', 'scale-100');
  modal?.setAttribute('aria-hidden', 'false');
  overlay?.classList.remove('pointer-events-none', 'opacity-0');
  overlay?.classList.add('opacity-100');
  document.body.style.overflow = 'hidden';
  window.setTimeout(() => input?.focus(), 30);
  ensureIndex();
}

function closeSearch() {
  modal?.classList.add('pointer-events-none', 'opacity-0', 'scale-95');
  modal?.classList.remove('opacity-100', 'scale-100');
  modal?.setAttribute('aria-hidden', 'true');
  overlay?.classList.add('pointer-events-none', 'opacity-0');
  overlay?.classList.remove('opacity-100');
  document.body.style.overflow = '';
}

function buildIndex(items: SearchItem[]) {
  engine = new MiniSearch<SearchDocument>({
    fields: ['title', 'description', 'tags', 'content'],
    storeFields: ['title', 'description', 'url'],
    idField: 'url',
    tokenize,
    searchOptions: {
      boost: { title: 4, tags: 2, description: 1.5 },
      prefix: true,
      fuzzy: 0.2
    }
  });
  engine.addAll(
    items
      .filter((item) => item.lang === locale)
      .map((item) => ({ ...item, tags: (item.tags ?? []).join(' ') }))
  );
}

async function ensureIndex() {
  if (!indexPromise) {
    hide(empty);
    show(loading);
    indexPromise = fetch(`${base}api/search.json`).then((response) => response.json());
  }
  const data = await indexPromise;
  if (!engine) buildIndex(data);
  hide(loading);
  show(empty);
}

function renderSearch(query: string) {
  if (!results) return;
  results.replaceChildren();
  hide(empty);
  hide(noResults);

  if (!query.trim()) {
    show(empty);
    return;
  }

  const hits = engine?.search(query).slice(0, 12) ?? [];
  if (hits.length === 0) {
    show(noResults);
    return;
  }

  for (const hit of hits) {
    const link = document.createElement('a');
    link.href = hit.url;
    link.className = 'block rounded-base px-3 py-2 hover:bg-hover';

    const title = document.createElement('div');
    title.className = 'font-medium';
    title.textContent = hit.title;

    const description = document.createElement('div');
    description.className = 'mt-1 line-clamp-2 text-step--1 text-fg-muted';
    description.textContent = hit.description ?? '';

    link.append(title, description);
    results.appendChild(link);
  }
}

async function handleInput() {
  await ensureIndex();
  renderSearch(input?.value ?? '');
}

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  if (target.closest('[data-search-open]')) openSearch();
});

document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    openSearch();
  }
  if (event.key === 'Escape') closeSearch();
});

closeButton?.addEventListener('click', closeSearch);
overlay?.addEventListener('click', closeSearch);

// Wait for the IME to commit before searching, or a Chinese query would run
// against half-typed pinyin.
let composing = false;
input?.addEventListener('compositionstart', () => {
  composing = true;
});
input?.addEventListener('compositionend', () => {
  composing = false;
  handleInput();
});
input?.addEventListener('input', () => {
  if (!composing) handleInput();
});
