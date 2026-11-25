import { navigate } from 'astro:transitions/client';
import { pageRange } from '@/lib/routing/pagination';
import { createIcon } from '@/scripts/core/icons';
import type { RuntimeIconName } from '@/lib/icons';
/** Browser behavior preserved from Solitude Hugo; typed boundary: core/api.ts. */
const SAFE_ARCHIVE_PROTOCOLS = new Set(['http:', 'https:']);
const resolveArchivePostUrl = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value, document.baseURI);
    return SAFE_ARCHIVE_PROTOCOLS.has(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
};
export const archivePageController = (() => {
  const createElement = <K extends keyof HTMLElementTagNameMap>(
    tag: K,
    className?: string,
    text?: string,
  ) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  interface ArchivePost {
    url: string;
    title: string;
    cover: string;
    year: string | number;
    primaryCategory?: string;
    dateLabel: string;
  }
  const controller = {
    shell: null as HTMLElement | null,
    list: null as HTMLElement | null,
    yearList: null as HTMLElement | null,
    pagination: null as HTMLElement | null,
    paginationSection: null as HTMLElement | null,
    labels: {} as Record<string, string>,
    posts: [] as ArchivePost[],
    years: [] as string[],
    perPage: 10,
    activeYear: 'all',
    currentPage: 1,
    abortController: null as AbortController | null,
    init() {
      const shell = document.getElementById('archives-page');
      const dataElement = document.getElementById('archive-page-data');
      if (!shell || !dataElement || shell.dataset.archiveInitialized === 'true')
        return;
      const list = shell.querySelector<HTMLElement>('#archives-page-list');
      const yearList = shell.querySelector<HTMLElement>(
        '#archives-year-filter-list',
      );
      const pagination = shell.querySelector<HTMLElement>(
        '#pagination .pagination',
      );
      const paginationSection = shell.querySelector<HTMLElement>(
        '.archive-page-section-pagination',
      );
      if (!list || !yearList || !pagination || !paginationSection) return;
      this.labels = {
        error: shell.dataset.labelError || 'Unable to load posts.',
        empty: shell.dataset.labelEmpty || 'No posts for this year.',
        uncategorized: shell.dataset.labelUncategorized || 'Uncategorized',
        previous: shell.dataset.labelPrevious || 'Previous page',
        next: shell.dataset.labelNext || 'Next page',
      };
      let posts;
      try {
        posts = JSON.parse(
          (dataElement instanceof HTMLTemplateElement
            ? dataElement.content.textContent
            : '') ||
            dataElement.textContent ||
            '[]',
        );
      } catch (error) {
        this.renderState(shell, this.labels.error);
        console.error('Failed to parse archive data:', error);
        return;
      }
      shell.dataset.archiveInitialized = 'true';
      this.shell = shell;
      this.list = list;
      this.yearList = yearList;
      this.pagination = pagination;
      this.paginationSection = paginationSection;
      this.posts = Array.isArray(posts) ? posts : [];
      this.perPage = Math.max(Number(shell.dataset.perPage) || 10, 1);
      this.years = [
        ...new Set(this.posts.map((post) => String(post.year))),
      ].sort((a, b) => Number(b) - Number(a));
      const params = new URL(location.href).searchParams;
      this.activeYear = this.years.includes(params.get('year') || '')
        ? params.get('year')!
        : 'all';
      const requestedPage = Number(params.get('page'));
      this.currentPage =
        Number.isSafeInteger(requestedPage) && requestedPage > 0
          ? requestedPage
          : 1;
      this.abortController = new AbortController();
      this.renderYears();
      this.bindEvents();
      this.render();
      history.replaceState(
        history.state,
        '',
        this.stateUrl(this.activeYear, this.currentPage),
      );
    },
    stateUrl(year: string, page: number) {
      const target = new URL(location.href);
      if (year === 'all') target.searchParams.delete('year');
      else target.searchParams.set('year', year);
      if (page === 1) target.searchParams.delete('page');
      else target.searchParams.set('page', String(page));
      return target;
    },
    bindEvents() {
      if (!this.shell || !this.abortController) return;
      this.shell.addEventListener(
        'click',
        (event) => {
          if (!(event.target instanceof Element)) return;
          const yearButton = event.target.closest<HTMLElement>(
            '.archive-year-button',
          );
          if (yearButton) {
            void navigate(
              this.stateUrl(yearButton.dataset.year || 'all', 1).href,
            );
            return;
          }
          const pageButton = event.target.closest<HTMLButtonElement>(
            '[data-archive-page]',
          );
          if (!pageButton || pageButton.disabled) return;
          void navigate(
            this.stateUrl(
              this.activeYear,
              Number(pageButton.dataset.archivePage),
            ).href,
          );
        },
        { signal: this.abortController.signal },
      );
    },
    renderYears() {
      const yearList = this.yearList;
      if (!yearList) return;
      yearList.replaceChildren();
      this.years.forEach((year) => {
        const button = createElement('button', 'archive-year-button', year);
        button.type = 'button';
        button.dataset.year = year;
        button.setAttribute('aria-pressed', 'false');
        yearList.appendChild(button);
      });
    },
    render() {
      const { shell, list } = this;
      if (!shell || !list) return;
      const filteredPosts =
        this.activeYear === 'all'
          ? this.posts
          : this.posts.filter((post) => String(post.year) === this.activeYear);
      const totalPages = Math.max(
        Math.ceil(filteredPosts.length / this.perPage),
        1,
      );
      this.currentPage = Math.min(this.currentPage, totalPages);
      shell
        .querySelectorAll<HTMLElement>('.archive-year-button')
        .forEach((button) => {
          const active = button.dataset.year === this.activeYear;
          button.classList.toggle('is-active', active);
          button.setAttribute('aria-pressed', String(active));
        });
      list.replaceChildren();
      if (!filteredPosts.length) {
        this.renderState(shell, this.labels.empty);
      } else {
        const start = (this.currentPage - 1) * this.perPage;
        filteredPosts.slice(start, start + this.perPage).forEach((post) => {
          list.appendChild(this.createPostItem(post));
        });
      }
      this.renderPagination(totalPages);
    },
    createPostItem(post: ArchivePost) {
      const postUrl = resolveArchivePostUrl(post.url);
      const item = createElement(postUrl ? 'a' : 'div', 'archive-page-item');
      if (postUrl && item instanceof HTMLAnchorElement) item.href = postUrl;
      else item.setAttribute('aria-disabled', 'true');
      item.title = post.title;
      const thumb = createElement('div', 'archive-page-thumb');
      const image = createElement('img');
      image.src = post.cover;
      image.alt = post.title;
      image.loading = 'lazy';
      image.addEventListener(
        'error',
        () => thumb.classList.add('is-fallback'),
        { once: true },
      );
      const fallback = createElement(
        'span',
        'archive-page-thumb-fallback',
        (post.title || 'A').trim().charAt(0) || 'A',
      );
      thumb.append(image, fallback);
      const main = createElement('div', 'archive-page-item-main');
      const title = createElement('div', 'archive-page-item-title', post.title);
      const meta = createElement('div', 'archive-page-item-meta');
      meta.append(
        createElement(
          'span',
          'archive-page-item-category',
          post.primaryCategory || this.labels.uncategorized,
        ),
        createElement('span', 'archive-page-item-divider', '/'),
        createElement('span', 'archive-page-item-date', post.dateLabel),
      );
      main.append(title, meta);
      const arrow = createElement('div', 'archive-page-item-arrow');
      const arrowIcon = createIcon('lucide:chevron-right');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.appendChild(arrowIcon);
      item.append(thumb, main, arrow);
      return item;
    },
    renderPagination(totalPages: number) {
      const { pagination, paginationSection } = this;
      if (!pagination || !paginationSection) return;
      pagination.replaceChildren();
      paginationSection.hidden = totalPages <= 1;
      if (totalPages <= 1) return;
      pagination.appendChild(
        this.createPageButton(
          this.currentPage - 1,
          this.labels.previous,
          'archive-page-extend prev',
          this.currentPage === 1,
          'lucide:chevron-left',
        ),
      );
      pageRange(this.currentPage, totalPages).forEach((page) => {
        if (page === 'gap') {
          pagination.appendChild(
            createElement('span', 'archive-page-space', '...'),
          );
          return;
        }
        const button = this.createPageButton(
          page,
          String(page),
          'archive-page-number',
          false,
        );
        if (page === this.currentPage) {
          button.classList.add('is-current');
          button.setAttribute('aria-current', 'page');
        }
        pagination.appendChild(button);
      });
      pagination.appendChild(
        this.createPageButton(
          this.currentPage + 1,
          this.labels.next,
          'archive-page-extend next',
          this.currentPage === totalPages,
          'lucide:chevron-right',
        ),
      );
    },
    createPageButton(
      page: number,
      label: string,
      className: string,
      disabled: boolean,
      iconName?: RuntimeIconName,
    ) {
      const button = createElement('button', className);
      button.type = 'button';
      button.disabled = disabled;
      button.dataset.archivePage = String(page);
      button.setAttribute('aria-label', label);
      if (iconName === 'lucide:chevron-left')
        button.appendChild(createIcon(iconName));
      button.appendChild(createElement('span', '', label));
      if (iconName === 'lucide:chevron-right')
        button.appendChild(createIcon(iconName));
      return button;
    },
    renderState(shell: HTMLElement, message: string) {
      const list = shell.querySelector<HTMLElement>('#archives-page-list');
      if (!list) return;
      list.replaceChildren(createElement('div', 'archive-page-state', message));
    },
    destroy() {
      this.abortController?.abort();
      this.abortController = null;
      this.shell = null;
      this.list = null;
      this.yearList = null;
      this.pagination = null;
      this.paginationSection = null;
      this.posts = [];
      this.labels = {};
    },
  };
  return controller;
})();
export const initArchivePage = () => archivePageController.init();
