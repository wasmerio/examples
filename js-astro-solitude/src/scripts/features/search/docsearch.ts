import { Solitude } from '@/scripts/core/api';
import { lifecycle } from '@/scripts/core/lifecycle';

const initializeDocSearch = async () => {
  const container = document.getElementById('docsearch');
  const options =
    Solitude.config.search?.docsearch || Solitude.config.docsearch || {};
  if (!container || container.dataset.initialized === 'true') return;
  container.dataset.initialized = 'true';

  const signal = lifecycle.signal;
  try {
    if (Solitude.config.cdn?.docsearch_css) {
      await Solitude.loadStyle(Solitude.config.cdn.docsearch_css, {
        id: 'docsearch-css',
      });
    }
    await Solitude.loadScript(Solitude.config.cdn?.docsearch_js);
    if (signal.aborted || !container.isConnected) return;
    const docsearch = window.docsearch;
    if (
      typeof docsearch !== 'function' ||
      !options.appId ||
      !options.apiKey ||
      !options.indexName
    ) {
      throw new Error('DocSearch configuration is incomplete');
    }
    docsearch({
      container: '#docsearch',
      ...options,
      placeholder:
        options.placeholder || Solitude.config.lang?.search?.placeholder,
      ...(options.option || {}),
    });
    const trigger = document.querySelector<HTMLElement>(
      '#search-button > .search',
    );
    Solitude.listen(trigger, 'click', (event: Event) => {
      event.preventDefault();
      document.querySelector<HTMLElement>('.DocSearch-Button')?.click();
    });
  } catch (error) {
    container.hidden = false;
    container.classList.add('docsearch-unavailable');
    container.textContent =
      Solitude.config.lang?.ui?.docsearchUnavailable ||
      'DocSearch is unavailable. Check appId, apiKey, and indexName.';
    console.warn(error);
  }
};

initializeDocSearch();
document.addEventListener('solitude:afterNavigate', initializeDocSearch);
