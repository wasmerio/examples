import { save, toast } from './store';

const root = document.documentElement;

function setTheme(theme: 'light' | 'dark') {
  // flip colours instantly; transitions would still be running in the view-transition snapshot
  root.classList.add('theme-switching');
  root.dataset.theme = theme;
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')));
  // Butterfly autoChangeMode: an explicit choice is remembered for 2 days, then follow the system again
  save('theme', theme, 2);
  document.dispatchEvent(new CustomEvent('theme-change', { detail: theme }));
}

export function initPreferences() {
  document.addEventListener('click', (e) => {
    const t = (e.target as Element).closest('[data-darkmode],[data-hide-aside],[data-readmode],[data-readmode-exit],[data-rightside-config]');
    if (!t) return;

    if (t.matches('[data-darkmode]')) {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      const go = () => setTheme(next);
      // smooth cross-fade where supported
      if ('startViewTransition' in document && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        (document as Document & { startViewTransition: (cb: () => void) => unknown }).startViewTransition(go);
      } else go();
      toast(next === 'dark' ? '已切换为深色模式' : '已切换为浅色模式', next);
    } else if (t.matches('[data-hide-aside]')) {
      const hidden = root.classList.toggle('hide-aside');
      save('aside-status', hidden ? 'hide' : 'show', 2);
    } else if (t.matches('[data-readmode]')) {
      root.classList.add('read-mode');
      root.classList.remove('rightside-config-open');
    } else if (t.matches('[data-readmode-exit]')) {
      root.classList.remove('read-mode');
    } else if (t.matches('[data-rightside-config]')) {
      const open = root.classList.toggle('rightside-config-open');
      t.setAttribute('aria-expanded', String(open));
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.classList.contains('read-mode') && !document.querySelector('dialog[open]')) {
      root.classList.remove('read-mode');
    }
  });

  // follow OS changes when the user hasn't chosen explicitly
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    try {
      if (localStorage.getItem('theme')) return;
    } catch {
      /* ignore */
    }
    root.dataset.theme = e.matches ? 'dark' : 'light';
  });

  // read mode is per-page
  document.addEventListener('astro:before-swap', () => root.classList.remove('read-mode', 'rightside-config-open'));
}
