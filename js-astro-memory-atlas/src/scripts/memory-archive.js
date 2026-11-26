import { createMemoryImageViewer } from './memory-image-viewer.js';
import { text } from '../i18n/copy.js';
import { activeLanguage } from '../lib/i18n.js';

export function initializeMemoryArchiveLayout() {
  const gallery = document.querySelector('.book-spread');
  if (!gallery) return { gallery: null, entries: [], galleryGroups: new Map() };
  const entries = [...gallery.querySelectorAll('.memory-entry')];
  const galleryGroups = new Map();
  entries.forEach((entry) => {
    const date = entry.querySelector('.timeline-date')?.textContent || '';
    const year = date.match(/20\d{2}/)?.[0] || '其他';
    let group = galleryGroups.get(year);
    if (!group) {
      group = document.createElement('section');
      group.className = 'memory-year-group';
      group.dataset.galleryGroupYear = year;
      const heading = document.createElement('h3');
      heading.className = 'memory-year-title';
      heading.id = `gallery-year-${year}`;
      heading.textContent = year;
      const grid = document.createElement('div');
      grid.className = 'memory-year-grid';
      group.append(heading, grid);
      galleryGroups.set(year, group);
    }
    group.querySelector('.memory-year-grid').append(entry);
  });
  gallery.replaceChildren(...galleryGroups.values());
  return { gallery, entries, galleryGroups };
}

export function initializeMemoryInteractions({ entries, galleryGroups, reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)') }) {
  const language = () => activeLanguage();
  const gallery = document.querySelector('.book-spread');
  const memorySearch = document.querySelector('[data-memory-search]');
  const memoryYear = document.querySelector('[data-memory-year]');
  const memoryFilterSummary = document.querySelector('[data-memory-filter-summary]');
  const memoryFilterEmpty = document.querySelector('[data-memory-filter-empty]');
  const imageViewer = createMemoryImageViewer();
  const pageToggle = document.querySelector('[data-album-page-toggle]');
  const pageControls = document.querySelector('[data-album-turn-controls]');
  const pagePrevious = document.querySelector('[data-album-previous]');
  const pageNext = document.querySelector('[data-album-next]');
  const pageProgress = document.querySelector('[data-album-progress]');
  let readingPage = 0;
  let pageMode = false;
  const visibleEntries = () => entries.filter((entry) => !entry.hidden);
  function renderPageMode() {
    if (!gallery || !pageProgress) return;
    const visible = visibleEntries();
    readingPage = Math.max(0, Math.min(readingPage, visible.length - 1));
    const active = visible[readingPage];
    gallery.classList.toggle('is-page-turning', pageMode);
    galleryGroups.forEach((group) => {
      group.hidden = pageMode ? !group.contains(active) : ![...group.querySelectorAll('.memory-entry')].some((entry) => !entry.hidden);
      group.querySelectorAll('.memory-entry').forEach((entry) => entry.classList.toggle('is-page-active', entry === active));
    });
    pageToggle?.setAttribute('aria-pressed', String(pageMode));
    if (pageToggle) pageToggle.textContent = text(pageMode ? 'home.continuousMode' : 'home.startPageMode', language());
    if (pageControls) pageControls.hidden = !pageMode;
    pageProgress.textContent = visible.length
      ? text('home.readingProgress', language(), { current: readingPage + 1, total: visible.length })
      : text('home.noReadingMemories', language());
    if (pagePrevious) pagePrevious.disabled = !pageMode || readingPage <= 0 || !visible.length;
    if (pageNext) pageNext.disabled = !pageMode || readingPage >= visible.length - 1 || !visible.length;
  }
  function moveReadingPage(delta) {
    const visible = visibleEntries();
    readingPage = Math.max(0, Math.min(readingPage + delta, visible.length - 1));
    renderPageMode();
    visible[readingPage]?.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'center' });
  }
  document.addEventListener('album-page-jump', (event) => {
    const index = visibleEntries().indexOf(event.detail?.entry);
    if (index < 0) return;
    readingPage = index;
    renderPageMode();
    event.detail.entry.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'center' });
  });
  pageToggle?.addEventListener('click', () => { pageMode = !pageMode; renderPageMode(); });
  pagePrevious?.addEventListener('click', () => moveReadingPage(-1));
  pageNext?.addEventListener('click', () => moveReadingPage(1));
  document.addEventListener('keydown', (event) => {
    const target = event.target;
    const isTextEntry = target?.isContentEditable || /INPUT|SELECT|TEXTAREA/.test(target?.tagName ?? '');
    const isModalOpen = document.querySelector('.pswp--open, [role="dialog"][aria-modal="true"], dialog[open]');
    if (!pageMode || isModalOpen || isTextEntry || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); moveReadingPage(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); moveReadingPage(1); }
  });
  const describeEntry = (entry) => {
    const image = entry.querySelector('.memory-entry-art img');
    const copy = entry.querySelector('.memory-entry-copy');
    return {
      src: image?.dataset.pswpSrc || image?.currentSrc || image?.src,
      element: image,
      msrc: image?.currentSrc || image?.src,
      width: Number(image?.dataset.pswpWidth || image?.naturalWidth || image?.getAttribute('width')),
      height: Number(image?.dataset.pswpHeight || image?.naturalHeight || image?.getAttribute('height')),
      alt: image?.alt || '',
      title: entry.querySelector('h3')?.innerText.trim() || '',
      date: entry.querySelector('.timeline-date')?.textContent.trim() || '',
      description: [...(copy?.querySelectorAll('p') || [])].find((paragraph) => !paragraph.classList.contains('timeline-date') && !paragraph.classList.contains('place'))?.innerText || '',
      place: copy?.querySelector('.place')?.innerText || '',
    };
  };

  entries.forEach((entry, index) => {
    const image = entry.querySelector('.memory-entry-art img');
    if (!image) return;
    image.dataset.memoryIndex = String(index);
    image.setAttribute('role', 'button');
    image.setAttribute('tabindex', '0');
    const updateImageLabel = () => image.setAttribute('aria-label', text('home.zoomMemory', language(), { title: entry.querySelector('h3')?.innerText || image.alt }));
    updateImageLabel();
    document.addEventListener('site:language-change', updateImageLabel);
    image.addEventListener('error', () => {
      image.hidden = true;
      const placeholder = document.createElement('span');
      placeholder.className = 'memory-art-pending';
      placeholder.textContent = text('home.illustrationLoading', language());
      image.parentElement.append(placeholder);
    }, { once: true });
  });

  let reapplyFilters = () => {};
  function initializeFilters() {
    if (!memorySearch || !memoryYear || !memoryFilterSummary || !memoryFilterEmpty) return;
    const years = [...new Set(entries.flatMap((entry) =>
      (entry.querySelector('.timeline-date')?.textContent.match(/20\d{2}/g) || [])
    ))].sort();
    years.forEach((year) => {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      memoryYear.append(option);
    });
    const params = new URLSearchParams(window.location.search);
    memorySearch.value = params.get('q') ?? '';
    if ([...memoryYear.options].some((option) => option.value === params.get('year'))) {
      memoryYear.value = params.get('year');
    }
    const applyFilters = () => {
      const query = memorySearch.value.trim().toLocaleLowerCase();
      const year = memoryYear.value;
      const isFiltering = Boolean(query || year);
      let matchCount = 0;
      entries.forEach((entry) => {
        const date = entry.querySelector('.timeline-date')?.textContent || '';
        const matchesYear = !year || date.includes(year);
        const matchesQuery = !query || entry.innerText.toLocaleLowerCase().includes(query)
          || (entry.querySelector('img')?.alt || '').toLocaleLowerCase().includes(query);
        entry.hidden = !(matchesYear && matchesQuery);
        if (!entry.hidden) matchCount += 1;
      });
      galleryGroups.forEach((group) => {
        group.hidden = ![...group.querySelectorAll('.memory-entry')].some((entry) => !entry.hidden);
      });
      memoryFilterEmpty.hidden = !isFiltering || matchCount > 0;
      memoryFilterSummary.textContent = isFiltering
        ? text('home.searchResultCount', language(), { count: matchCount })
        : text('home.totalMemoryCount', language(), { count: entries.length });
      const activeEntry = visibleEntries()[readingPage];
      if (activeEntry) readingPage = Math.max(0, visibleEntries().indexOf(activeEntry));
      renderPageMode();
    };
    memorySearch.addEventListener('input', applyFilters);
    memoryYear.addEventListener('change', applyFilters);
    reapplyFilters = applyFilters;
    applyFilters();
  }

  function clearMemoryFilters() {
    if (!memorySearch || !memoryYear) return;
    memorySearch.value = '';
    memoryYear.value = '';
    memorySearch.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function openViewer(sourceEntries, index, opener) {
    imageViewer.open(sourceEntries.map(describeEntry), index, opener);
  }

  function jumpToEntry(index) {
    if (!Number.isInteger(index) || index < 0 || index >= entries.length) return;
    clearMemoryFilters();
    const entry = entries[index];
    entry.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'center' });
    window.setTimeout(() => {
      entries.forEach((item) => item.classList.remove('memory-entry--highlight'));
      entry.classList.add('memory-entry--highlight');
      window.setTimeout(() => entry.classList.remove('memory-entry--highlight'), 1800);
    }, 0);
  }

  initializeFilters();
  renderPageMode();
  document.addEventListener('site:language-change', () => {
    reapplyFilters();
    renderPageMode();
  });
  if (gallery || document.querySelector('[data-story-memory]')) {
    document.addEventListener('click', (event) => {
      const storyMemory = event.target.closest('[data-story-memory]');
      const image = event.target.closest('img[data-memory-index]');
      if (storyMemory) {
        const index = entries.findIndex((entry) => entry.id === `memory-${storyMemory.dataset.storyMemory}`);
        if (index >= 0) openViewer(entries, index, storyMemory);
        return;
      }
      if (image) {
        const visibleEntries = entries.filter((entry) => !entry.hidden);
        const index = visibleEntries.indexOf(image.closest('.memory-entry'));
        if (index >= 0) openViewer(visibleEntries, index, image);
      }
    });
    document.addEventListener('keydown', (event) => {
      const image = event.target.closest?.('img[data-memory-index]');
      if (image && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        const visibleEntries = entries.filter((entry) => !entry.hidden);
        const index = visibleEntries.indexOf(image.closest('.memory-entry'));
        if (index >= 0) openViewer(visibleEntries, index, image);
        return;
      }
    });
  }
  return { clearMemoryFilters, jumpToEntry, memorySearch, memoryYear };
}
