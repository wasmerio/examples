import { pageRange } from '@/lib/routing/pagination';
import { Solitude } from '@/scripts/core/api';
import { requiredElement } from '@/scripts/core/dom';
import { lifecycle } from '@/scripts/core/lifecycle';
import { modalSession } from '@/scripts/core/modal';

interface SearchEntry {
  title: string;
  link: string;
  content: string;
}
const indexes = new Map<string, Promise<SearchEntry[]>>();
function loadIndex(path: string) {
  if (indexes.has(path)) return indexes.get(path)!;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  const request = fetch(path, { signal: controller.signal })
    .then(async (response) => {
      if (!response.ok)
        throw new Error(`Search index: HTTP ${response.status}`);
      const xml = new DOMParser().parseFromString(
        await response.text(),
        'text/xml',
      );
      if (xml.querySelector('parsererror') || !xml.querySelector('search'))
        throw new Error('Invalid search index');
      return Array.from(xml.querySelectorAll('entry')).flatMap((entry) => {
        const read = (name: string) =>
          entry.querySelector(name)?.textContent?.trim() || '';
        const title = read('title');
        const link = read('url');
        try {
          if (
            !title ||
            !link ||
            !['http:', 'https:'].includes(
              new URL(link, document.baseURI).protocol,
            )
          )
            return [];
        } catch {
          return [];
        }
        return [{ title, link, content: read('content').replace(/\s+/g, ' ') }];
      });
    })
    .catch((error) => {
      indexes.delete(path);
      throw error;
    })
    .finally(() => clearTimeout(timeout));
  indexes.set(path, request);
  return request;
}

const keywordsOf = (query: string) => [
  ...new Set(query.toLocaleLowerCase().split(/\s+/).filter(Boolean)),
];
const escapeRegex = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function highlighted(text: string, query: string) {
  const fragment = document.createDocumentFragment();
  const keywords = keywordsOf(query).sort((a, b) => b.length - a.length);
  if (!keywords.length) {
    fragment.append(text);
    return fragment;
  }
  const regex = new RegExp(keywords.map(escapeRegex).join('|'), 'giu');
  let offset = 0;
  for (const match of text.matchAll(regex)) {
    fragment.append(text.slice(offset, match.index));
    const mark = document.createElement('mark');
    mark.textContent = match[0];
    fragment.append(mark);
    offset = match.index + match[0].length;
  }
  fragment.append(text.slice(offset));
  return fragment;
}
function excerpt(content: string, query: string) {
  const positions = keywordsOf(query)
    .map((key) => content.toLocaleLowerCase().indexOf(key))
    .filter((index) => index >= 0);
  const start = Math.max(
    0,
    (positions.length ? Math.min(...positions) : 0) - 35,
  );
  const end = Math.min(content.length, start + 160);
  return `${start ? '…' : ''}${content.slice(start, end)}${end < content.length ? '…' : ''}`;
}

export class LocalSearch {
  resultsPerPage: number;
  generation: number;
  dialog!: HTMLElement;
  input!: HTMLInputElement;
  results!: HTMLElement;
  suggestions!: HTMLElement;
  pagination!: HTMLElement;
  tips!: HTMLElement;
  mask!: HTMLElement;
  currentQuery = '';
  currentPage = 1;
  store: SearchEntry[] | null = null;
  currentResults: SearchEntry[] = [];
  error = false;
  composing = false;
  open = false;
  timer: ReturnType<typeof setTimeout> | undefined;
  releaseModal: ((restoreFocus?: boolean) => void) | null = null;
  constructor() {
    this.resultsPerPage = 10;
    this.generation = 0;
    document.addEventListener('keydown', (event) => {
      if (
        !event.isComposing &&
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === 'k' &&
        this.dialog?.isConnected
      ) {
        event.preventDefault();
        this.openSearch();
      }
    });
    Solitude.openSearch = () => this.openSearch();
  }
  get labels() {
    return Solitude.config.lang.search;
  }
  mount() {
    const dialog = document.querySelector<HTMLElement>(
      '#local-search .search-dialog',
    );
    if (!dialog) return;
    this.dialog = dialog;
    this.input = requiredElement<HTMLInputElement>(
      '#search-input',
      this.dialog,
    );
    this.results = requiredElement('#search-results', this.dialog);
    this.suggestions = requiredElement('#search-suggestions', this.dialog);
    this.pagination = requiredElement('#search-pagination', this.dialog);
    this.tips = requiredElement('#search-tips', this.dialog);
    this.mask = requiredElement('#search-mask');
    this.currentQuery = '';
    this.currentPage = 1;
    this.store = null;
    this.error = false;
    this.composing = false;
    const version = ++this.generation;
    const listen = lifecycle.listen.bind(lifecycle);
    listen(this.input, 'compositionstart', () => {
      this.composing = true;
      clearTimeout(this.timer);
    });
    listen(this.input, 'compositionend', () => {
      this.composing = false;
      this.schedule();
    });
    listen(this.input, 'input', (event) => {
      if (!this.composing && !event.isComposing) this.schedule();
    });
    listen(
      document.querySelector<HTMLElement>('#search-button > .search'),
      'click',
      (event) => {
        event.preventDefault();
        this.openSearch();
      },
    );
    listen(
      this.dialog.querySelector<HTMLElement>('.search-close-button'),
      'click',
      () => this.closeSearch(),
    );
    listen(this.mask, 'click', () => this.closeSearch());
    listen(this.dialog, 'keydown', (event) => this.onKeydown(event));
    this.suggestions
      .querySelectorAll<HTMLElement>('[data-query]')
      .forEach((button) => {
        listen(button, 'click', () => {
          this.input.value = button.dataset.query || '';
          this.search();
          this.input.focus();
        });
      });
    listen(document.getElementById('menu-search'), 'click', () => {
      Solitude.hideRightMenu?.();
      this.openSearch();
      if (Solitude.selectedText) {
        this.input.value = Solitude.selectedText;
        this.search();
      }
    });
    lifecycle.add(() => {
      this.closeSearch(false);
      clearTimeout(this.timer);
      if (version === this.generation) this.generation++;
    });
    if (Solitude.config.localsearch.preload) void this.ensureData();
  }
  async ensureData() {
    const version = this.generation;
    if (this.store) return;
    this.error = false;
    if (this.open) this.status(this.labels.loading, 'loading');
    try {
      const data = await loadIndex(Solitude.config.localsearch.path);
      if (version !== this.generation) return;
      this.store = data;
      if (this.open) this.search();
    } catch {
      if (version !== this.generation) return;
      this.error = true;
      if (this.open) this.status(this.labels.error, 'error');
    }
  }
  schedule() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.search(), 200);
  }
  openSearch() {
    if (!this.dialog?.isConnected) return;
    if (this.open) {
      this.input.focus();
      return;
    }
    this.open = true;
    this.dialog.style.display = 'flex';
    this.mask.style.display = 'block';
    document.documentElement.classList.add('search-open');
    this.releaseModal = modalSession(this.dialog, () => this.closeSearch(), [
      this.mask,
    ]);
    this.input.focus();
    if (
      this.store &&
      this.currentResults?.length &&
      this.currentQuery === this.input.value.trim()
    )
      this.render();
    else this.search();
    if (!this.store && !this.error) void this.ensureData();
  }
  closeSearch(restoreFocus = true) {
    if (!this.open) return;
    this.open = false;
    clearTimeout(this.timer);
    this.dialog.style.display = 'none';
    this.mask.style.display = 'none';
    document.documentElement.classList.remove('search-open');
    this.releaseModal?.(restoreFocus);
    this.releaseModal = null;
  }
  search() {
    clearTimeout(this.timer);
    this.timer = undefined;
    if (this.composing) return;
    this.currentQuery = this.input.value.trim();
    this.currentPage = 1;
    if (this.error) {
      this.status(this.labels.error, 'error');
      return;
    }
    if (!this.store) {
      this.status(this.labels.loading, 'loading');
      return;
    }
    if (!this.currentQuery) {
      this.results.replaceChildren();
      this.pagination.replaceChildren();
      this.tips.textContent = '';
      this.tips.classList.remove('search-status-only');
      this.results.hidden = true;
      this.suggestions.hidden = false;
      this.results.setAttribute('aria-busy', 'false');
      return;
    }
    const keywords = keywordsOf(this.currentQuery);
    const score = (item: SearchEntry) =>
      keywords.reduce(
        (sum, word) =>
          sum +
          (item.title.toLocaleLowerCase() === word
            ? 10
            : item.title.toLocaleLowerCase().includes(word)
              ? 5
              : 1),
        0,
      );
    this.currentResults = this.store
      .filter((item) =>
        keywords.every(
          (word) =>
            item.title.toLocaleLowerCase().includes(word) ||
            item.content.toLocaleLowerCase().includes(word),
        ),
      )
      .sort((a, b) => score(b) - score(a));
    this.render();
  }
  render() {
    this.results.replaceChildren();
    this.pagination.replaceChildren();
    this.results.hidden = false;
    this.suggestions.hidden = true;
    this.results.setAttribute('aria-busy', 'false');
    if (!this.currentResults.length) {
      this.status(
        this.labels.empty.replace(/\$\{query}/g, this.currentQuery),
        'empty',
      );
      return;
    }
    this.currentResults
      .slice(
        (this.currentPage - 1) * this.resultsPerPage,
        this.currentPage * this.resultsPerPage,
      )
      .forEach((result) => {
        const item = document.createElement('li');
        item.className = 'search-result-item';
        const link = document.createElement('a');
        link.className = 'search-result-title';
        link.href = result.link;
        const title = document.createElement('span');
        title.className = 'search-result-heading';
        title.append(highlighted(result.title, this.currentQuery));
        link.append(title);
        if (result.content) {
          const summary = document.createElement('span');
          summary.className = 'search-result-summary';
          summary.append(
            highlighted(
              excerpt(result.content, this.currentQuery),
              this.currentQuery,
            ),
          );
          link.append(summary);
        }
        link.addEventListener('click', () => this.closeSearch(false));
        item.append(link);
        this.results.append(item);
      });
    this.tips.classList.remove('search-status-only');
    this.tips.textContent = this.labels.count.replace(
      /\$\{(?:hits|count|query)}/g,
      String(this.currentResults.length),
    );
    const total = Math.ceil(this.currentResults.length / this.resultsPerPage);
    if (total > 1) {
      const list = document.createElement('ul');
      list.className = 'pagination-list';
      const add = (page: number, text: string, disabled = false) => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'pagination-button';
        button.textContent = text;
        button.disabled = disabled;
        button.dataset.page = String(page);
        button.setAttribute(
          'aria-label',
          page === this.currentPage - 1 && text === '‹'
            ? this.labels.previous
            : text === '›'
              ? this.labels.next
              : String(page),
        );
        if (text === String(this.currentPage)) {
          button.classList.add('select');
          button.setAttribute('aria-current', 'page');
        }
        button.addEventListener('click', () => {
          this.currentPage = page;
          this.render();
          this.results.scrollTop = 0;
          this.pagination
            .querySelector<HTMLElement>('[aria-current="page"]')
            ?.focus();
        });
        li.append(button);
        list.append(li);
      };
      add(this.currentPage - 1, '‹', this.currentPage === 1);
      for (const page of pageRange(this.currentPage, total)) {
        if (page === 'gap') {
          const li = document.createElement('li');
          li.className = 'page-gap';
          li.textContent = '…';
          li.setAttribute('aria-hidden', 'true');
          list.append(li);
        } else add(page, String(page));
      }
      add(this.currentPage + 1, '›', this.currentPage === total);
      this.pagination.append(list);
    }
  }
  status(message: string, kind: 'loading' | 'error' | 'empty') {
    this.results.replaceChildren();
    this.pagination.replaceChildren();
    this.results.hidden = false;
    this.suggestions.hidden = true;
    this.results.setAttribute('aria-busy', String(kind === 'loading'));
    const item = document.createElement('li');
    item.className = `search-result-${kind}`;
    item.textContent = message;
    if (kind === 'error') {
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'search-retry';
      retry.textContent = this.labels.retry;
      retry.addEventListener('click', () => {
        this.input.focus();
        void this.ensureData();
      });
      item.append(retry);
    }
    this.results.append(item);
    this.tips.classList.add('search-status-only');
    this.tips.textContent = message;
  }
  onKeydown(event: KeyboardEvent) {
    if (event.isComposing || this.composing) return;
    const links = Array.from(this.results.querySelectorAll('a'));
    if (!links.length) return;
    const index = links.findIndex((link) => link === document.activeElement);
    if (
      ['ArrowDown', 'ArrowUp'].includes(event.key) &&
      (index >= 0 || event.target === this.input)
    ) {
      event.preventDefault();
      const next =
        index < 0
          ? event.key === 'ArrowDown'
            ? 0
            : links.length - 1
          : (index + (event.key === 'ArrowDown' ? 1 : -1) + links.length) %
            links.length;
      links[next].focus({ preventScroll: true });
      links[next].scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'Enter' && event.target === this.input) {
      event.preventDefault();
      if (this.timer || this.currentQuery !== this.input.value.trim()) {
        this.search();
        this.results.querySelector('a')?.click();
      } else links[0].click();
    }
  }
}
export function initializeLocalSearch() {
  if (!Solitude.localSearch) Solitude.localSearch = new LocalSearch();
  Solitude.localSearch.mount();
}
