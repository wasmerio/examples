import { initializeMemoryArchiveLayout, initializeMemoryInteractions } from './memory-archive.js';

const { entries, galleryGroups } = initializeMemoryArchiveLayout();
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const { jumpToEntry } = initializeMemoryInteractions({ entries, galleryGroups, reduceMotion });
const firstEntry = entries[0];
const title = document.querySelector('[data-memory-title]');
const date = document.querySelector('[data-memory-date]');
const jump = document.querySelector('[data-memory-jump]');

if (firstEntry && title && date && jump) {
  const updateNudgeTitle = () => {
    const heading = firstEntry.querySelector('h3');
    const zh = heading?.querySelector('[data-locale-copy="zh"]')?.textContent || '一段一起走过的日子';
    const en = heading?.querySelector('[data-locale-copy="en"]')?.textContent || 'A day we shared';
    title.querySelector('[data-locale-copy="zh"]').textContent = zh;
    title.querySelector('[data-locale-copy="en"]').textContent = en;
  };
  updateNudgeTitle();
  document.addEventListener('site:language-change', updateNudgeTitle);
  date.textContent = firstEntry.querySelector('.timeline-date')?.textContent || '';
  jump.addEventListener('click', () => jumpToEntry(0));
}

document.querySelectorAll('[data-chapter]').forEach((button) => {
  button.addEventListener('click', () => {
    const group = galleryGroups.get(button.dataset.chapter);
    document.querySelectorAll('[data-chapter]').forEach((item) => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    if (document.querySelector('.book-spread.is-page-turning')) {
      const entry = group?.querySelector('.memory-entry:not([hidden])');
      if (entry) document.dispatchEvent(new CustomEvent('album-page-jump', { detail: { entry } }));
      return;
    }
    group?.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
  });
});

