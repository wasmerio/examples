import { iconMarkup } from '@/scripts/core/icons';
interface SearchStats {
  nbHits: number;
  processingTimeMS: number;
}
interface SearchHit {
  permalink?: string;
  path?: string;
  _highlightResult: { title?: { value: string } };
}
interface SearchHelper {
  state: { query?: string };
  search(): void;
}
interface SearchInstance {
  addWidgets(widgets: unknown[]): void;
  start(): void;
  dispose(): void;
  on(event: string, listener: () => void): void;
}
declare const instantsearch: {
  (options: {
    indexName: string;
    searchClient: unknown;
    searchFunction: (helper: SearchHelper) => void;
  }): SearchInstance;
  widgets: Record<
    'configure' | 'searchBox' | 'stats' | 'hits' | 'pagination',
    (options: Record<string, unknown>) => unknown
  >;
};
declare const algoliasearch: {
  algoliasearch(appId: string, apiKey: string): unknown;
};
/** Browser behavior preserved from Solitude Hugo; typed boundary: core/api.ts. */
import { Solitude } from '@/scripts/core/api';
export class AlgoliaSearch {
  #controller = new AbortController();
  #focusTimer: number | undefined;
  searchInstance: SearchInstance | null;
  isInitialized: boolean;
  elements: ReturnType<AlgoliaSearch['cacheElements']>;
  config: import('@/types/runtime').SolitudeSiteConfiguration['algolia'];
  constructor() {
    this.searchInstance = null;
    this.isInitialized = false;
    // DOM 元素缓存
    this.elements = this.cacheElements();
    // Algolia 配置
    this.config = Solitude.config.algolia;
    // 初始化
    this.init();
  }
  /**
   * 缓存常用的DOM元素
   */
  cacheElements() {
    return {
      searchMask: document.getElementById('search-mask'),
      searchDialog: document.querySelector<HTMLElement>(
        '#algolia-search .search-dialog',
      ),
      searchButton: document.querySelector<HTMLElement>(
        '#search-button > .search',
      ),
      closeButton: document.querySelector<HTMLElement>(
        '#algolia-search .search-close-button',
      ),
      menuSearch: document.getElementById('menu-search'),
      hitsContainer: document.getElementById('algolia-hits'),
      inputContainer: '#algolia-search-input',
      paginationContainer: '#algolia-pagination',
      statsContainer: '#algolia-tips > #algolia-stats',
    };
  }
  /**
   * 初始化搜索功能
   */
  init() {
    try {
      if (!this.validateConfig()) {
        console.error('Algolia configuration is invalid!');
        return;
      }
      this.setupSearchInstance();
      this.bindEvents();
      Solitude.listen(document, 'keydown', (event) => {
        if (
          (event.ctrlKey || event.metaKey) &&
          event.key.toLowerCase() === 'k'
        ) {
          event.preventDefault();
          this.openSearch();
        }
        if (event.key === 'Escape') this.closeSearch();
      });
      this.isInitialized = true;
    } catch (error) {
      console.error('Algolia search initialization failed:', error);
    }
  }
  /**
   * 验证 Algolia 配置
   */
  validateConfig() {
    return (
      this.config &&
      this.config.appId &&
      this.config.apiKey &&
      this.config.indexName
    );
  }
  /**
   * 设置搜索实例
   */
  setupSearchInstance() {
    this.searchInstance = instantsearch({
      indexName: this.config.indexName,
      searchClient: algoliasearch.algoliasearch(
        this.config.appId,
        this.config.apiKey,
      ),
      searchFunction: (helper: SearchHelper) => this.handleSearch(helper),
    });
    this.addWidgets();
    this.searchInstance.start();
  }
  /**
   * 处理搜索逻辑
   */
  handleSearch(helper: SearchHelper) {
    if (helper.state.query) {
      this.showLoading();
      helper.search();
    } else {
      this.clearResults();
    }
  }
  /**
   * 显示加载状态
   */
  showLoading() {
    if (this.elements.hitsContainer) {
      const loadingHtml = `<div class="loading">${Solitude.config.lang?.search?.loading || 'Searching...'}</div>`;
      this.elements.hitsContainer.innerHTML = loadingHtml;
    }
  }
  /**
   * 清空搜索结果
   */
  clearResults() {
    if (this.elements.hitsContainer) {
      this.elements.hitsContainer.innerHTML = '';
    }
  }
  /**
   * 添加搜索组件
   */
  addWidgets() {
    const widgets = [
      this.createConfigureWidget(),
      this.createSearchBoxWidget(),
      this.createStatsWidget(),
      this.createHitsWidget(),
      this.createPaginationWidget(),
    ];
    this.searchInstance?.addWidgets(widgets);
  }
  /**
   * 创建配置组件
   */
  createConfigureWidget() {
    return instantsearch.widgets.configure({
      hitsPerPage: this.config.hits?.per_page || 5,
    });
  }
  /**
   * 创建搜索框组件
   */
  createSearchBoxWidget() {
    return instantsearch.widgets.searchBox({
      container: this.elements.inputContainer,
      showReset: false,
      showSubmit: false,
      placeholder:
        Solitude.config.lang?.search?.placeholder || 'Search by keywords',
      showLoadingIndicator: false,
      searchAsYouType: true,
    });
  }
  /**
   * 创建统计组件
   */
  createStatsWidget() {
    return instantsearch.widgets.stats({
      container: this.elements.statsContainer,
      templates: {
        text: (data: SearchStats) => this.formatStatsText(data),
      },
    });
  }
  /**
   * 格式化统计文本
   */
  formatStatsText(data: SearchStats) {
    const statsText =
      Solitude.config.lang?.search?.hit
        ?.replace(/\$\{hits}/, String(data.nbHits))
        ?.replace(/\$\{time}/, String(data.processingTimeMS)) ||
      `Found ${data.nbHits} results, took ${data.processingTimeMS} ms`;
    return `<hr>${statsText}`;
  }
  /**
   * 创建结果组件
   */
  createHitsWidget() {
    return instantsearch.widgets.hits({
      container: '#algolia-hits',
      templates: {
        item: (data: SearchHit) => this.renderHitItem(data),
        empty: (data: { query: string }) => this.renderEmptyState(data),
      },
      cssClasses: {
        item: 'algolia-hit-item',
      },
    });
  }
  /**
   * 渲染搜索结果项
   */
  renderHitItem(data: SearchHit) {
    try {
      const link = data.permalink || Solitude.config.root + data.path;
      const result = data._highlightResult;
      // 隐藏加载状态
      this.hideLoadingIndicator();
      // 延迟聚焦搜索框
      this.delayedFocus();
      return `
                <a href="${this.escapeHtml(link)}" class="algolia-hit-item-link">
                    <span class="algolia-hits-item-title">${result.title?.value || Solitude.config.lang?.ui?.untitled || 'Untitled'}</span>
                </a>`;
    } catch (error) {
      console.error('Failed to render search result item:', error);
      return '<div class="algolia-hit-error">Failed to render</div>';
    }
  }
  /**
   * 渲染空状态
   */
  renderEmptyState(data: { query: string }) {
    this.hideLoadingIndicator();
    this.delayedFocus();
    const emptyText =
      Solitude.config.lang?.search?.empty?.replace(/\$\{query}/, data.query) ||
      `No results found for "${data.query}"`;
    return `<div id="algolia-hits-empty">${emptyText}</div>`;
  }
  /**
   * 隐藏加载指示器
   */
  hideLoadingIndicator() {
    const loadingElement = document.querySelector<HTMLElement>(
      '#algolia-hits .loading',
    );
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
  }
  /**
   * 延迟聚焦搜索框
   */
  delayedFocus(delay = 200) {
    window.clearTimeout(this.#focusTimer);
    if (this.#controller.signal.aborted) return;
    this.#focusTimer = window.setTimeout(() => {
      if (!this.#controller.signal.aborted && this.isSearchOpen()) {
        this.elements.searchDialog
          ?.querySelector<HTMLElement>('.ais-SearchBox-input')
          ?.focus();
      }
    }, delay);
  }
  /**
   * 转义HTML
   */
  escapeHtml(text: string) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  /**
   * 创建分页组件
   */
  createPaginationWidget() {
    return instantsearch.widgets.pagination({
      container: this.elements.paginationContainer,
      totalPages: this.config.hits?.per_page ?? 5,
      scrollTo: false,
      showFirstLast: false,
      templates: {
        first: iconMarkup('lucide:chevrons-left'),
        last: iconMarkup('lucide:chevrons-right'),
        previous: iconMarkup('lucide:chevron-left'),
        next: iconMarkup('lucide:chevron-right'),
      },
      cssClasses: {
        root: 'pagination',
        item: 'pagination-item',
        link: 'page-number',
        active: 'current',
        disabled: 'disabled-item',
      },
    });
  }
  /**
   * 绑定事件监听器
   */
  bindEvents() {
    // 基础搜索事件
    this.bindSearchEvents();
    // 右键菜单搜索
    this.bindRightMenuSearch();
    // PJAX 兼容性
  }
  /**
   * 绑定搜索相关事件
   */
  bindSearchEvents() {
    // 搜索按钮
    if (this.elements.searchButton) {
      Solitude.addEventListenerPjax(
        this.elements.searchButton,
        'click',
        (event) => {
          event.preventDefault();
          this.openSearch();
        },
      );
    }
    // 关闭按钮和遮罩
    if (this.elements.closeButton) {
      this.elements.closeButton.addEventListener(
        'click',
        () => this.closeSearch(),
        { signal: this.#controller.signal },
      );
    }
    if (this.elements.searchMask) {
      this.elements.searchMask.addEventListener(
        'click',
        () => this.closeSearch(),
        { signal: this.#controller.signal },
      );
    }
  }
  /**
   * 绑定右键菜单搜索
   */
  bindRightMenuSearch() {
    if (Solitude.config.right_menu && this.elements.menuSearch) {
      this.elements.menuSearch.addEventListener(
        'click',
        () => {
          Solitude.hideRightMenu?.();
          this.openSearch();
          // 设置选中文本
          if (Solitude.selectedText) {
            const searchInput = document.querySelector<HTMLInputElement>(
              '.ais-SearchBox-input',
            );
            if (searchInput) {
              searchInput.value = Solitude.selectedText;
              const event = new Event('input', { bubbles: true });
              searchInput.dispatchEvent(event);
            }
          }
        },
        { signal: this.#controller.signal },
      );
    }
  }
  /**
   * 绑定 PJAX 事件
   */
  bindPjaxEvents() {
    window.addEventListener(
      'solitude:afterNavigate',
      () => {
        if (
          this.elements.searchMask &&
          !Solitude.isHidden(this.elements.searchMask)
        ) {
          this.closeSearch();
        }
        // 重新缓存元素并绑定事件
        this.elements = this.cacheElements();
        this.bindSearchEvents();
      },
      { signal: this.#controller.signal },
    );
    // PJAX 刷新搜索结果
    if (Solitude.pjax && this.searchInstance) {
      this.searchInstance.on('render', () => {
        const hitsElement = document.getElementById('algolia-hits');
        if (hitsElement) {
          Solitude.pjax?.refresh(hitsElement);
        }
      });
    }
  }
  /**
   * 绑定键盘快捷键
   */
  bindKeyboardShortcuts() {
    document.addEventListener(
      'keydown',
      (event) => {
        // Ctrl+K 打开搜索
        if (event.ctrlKey && event.key === 'k') {
          event.preventDefault();
          this.openSearch();
          return;
        }
        // ESC 关闭搜索
        if (event.code === 'Escape' && this.isSearchOpen()) {
          this.closeSearch();
        }
      },
      { signal: this.#controller.signal },
    );
  }
  /**
   * 打开搜索框
   */
  openSearch() {
    if (!this.elements.searchMask || !this.elements.searchDialog) return;
    Solitude.animateIn(this.elements.searchMask, 'to_show 0.5s');
    this.elements.searchDialog.style.display = 'flex';
    // 延迟聚焦以确保动画完成
    this.delayedFocus(100);
    this.fixSafariHeight();
    window.addEventListener('resize', this.fixSafariHeight, {
      signal: this.#controller.signal,
    });
    // 暴露到全局作用域以保持兼容性
    Solitude.openSearch = () => this.openSearch();
  }
  /**
   * 关闭搜索框
   */
  closeSearch() {
    window.clearTimeout(this.#focusTimer);
    if (!this.elements.searchMask || !this.elements.searchDialog) return;
    Solitude.animateOut(this.elements.searchDialog, 'search_close .5s');
    Solitude.animateOut(this.elements.searchMask, 'to_hide 0.5s');
    window.removeEventListener('resize', this.fixSafariHeight);
  }
  /**
   * 检查搜索框是否打开
   */
  isSearchOpen() {
    return this.elements.searchDialog?.style.display === 'flex';
  }
  /**
   * 修复Safari高度问题
   */
  fixSafariHeight = () => {
    if (window.innerWidth < 768 && this.elements.searchDialog) {
      this.elements.searchDialog.style.setProperty(
        '--search-height',
        `${window.innerHeight}px`,
      );
    }
  };
  /**
   * 销毁搜索实例
   */
  destroy() {
    this.#controller.abort();
    window.clearTimeout(this.#focusTimer);
    if (this.searchInstance) {
      this.searchInstance.dispose();
      this.searchInstance = null;
    }
    this.isInitialized = false;
  }
}
// DOM 加载完成后初始化搜索功能
const initializeAlgoliaSearch = () => {
  Solitude.algoliaSearch?.destroy();
  const search = new AlgoliaSearch();
  Solitude.algoliaSearch = search;
  Solitude.onPageCleanup(() => search.destroy());
};
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAlgoliaSearch, {
    once: true,
  });
} else {
  initializeAlgoliaSearch();
}

document.addEventListener('solitude:afterNavigate', initializeAlgoliaSearch);
