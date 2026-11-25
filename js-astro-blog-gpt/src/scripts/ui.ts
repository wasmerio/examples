import { searchTokens } from '../../scripts/lib/search-tokens.mjs';
import { t } from '../lib/i18n';
import type { Locale } from '../types/config';
import { navigate } from 'astro:transitions/client';

import {
  matchesSearch,
  searchScope,
  type SearchEntry,
  type SearchScope,
} from '../lib/search';

import { setupComposer } from './composer';
import { setupPagination } from './pagination';
import {
  contextSnippets,
  renderedSections,
  type SearchSection,
} from '../lib/search-context';
import { searchIndexes } from '../lib/search-client';

let controller: AbortController | undefined;
let selectedTheme = 'system';
let themeInitialized = false;
let preferredSidebarWidth: number | undefined;
const media = matchMedia('(prefers-color-scheme: dark)');
const resolveTheme = () =>
  selectedTheme === 'system'
    ? media.matches
      ? 'dark'
      : 'light'
    : selectedTheme;
const applyTheme = () => {
  document.documentElement.dataset.theme = resolveTheme();
};
media.addEventListener('change', () => {
  if (selectedTheme === 'system') applyTheme();
});

function setup() {
  controller?.abort();
  controller = new AbortController();
  const { signal } = controller;
  const lang = document.body.dataset.locale as Locale;
  const ui = t(lang);
  setupPagination(signal);
  const friendsDirectory = document.querySelector('[data-friends-directory]');
  const friendsSearch = friendsDirectory?.querySelector<HTMLInputElement>(
    '[data-friends-search]',
  );
  friendsSearch?.addEventListener(
    'input',
    () => {
      const query = friendsSearch.value.trim().toLocaleLowerCase();
      let matches = 0;
      friendsDirectory
        ?.querySelectorAll<HTMLElement>('[data-friend-group]')
        .forEach((group) => {
          let groupMatches = 0;
          group
            .querySelectorAll<HTMLElement>('[data-friend-card]')
            .forEach((card) => {
              card.hidden = !(card.dataset.searchText ?? '')
                .toLocaleLowerCase()
                .includes(query);
              if (!card.hidden) groupMatches++;
            });
          group.hidden = groupMatches === 0;
          matches += groupMatches;
        });
      const empty = friendsDirectory?.querySelector<HTMLElement>(
        '[data-friends-empty]',
      );
      if (empty) empty.hidden = matches > 0;
    },
    { signal },
  );
  document
    .querySelectorAll<HTMLButtonElement>('.expressive-code .copy button')
    .forEach((button) => {
      button.title = ui.copyCode;
      button.dataset.copied = ui.copied;
    });
  const base = document.body.dataset.base ?? '/';
  const tooltip = document.querySelector<HTMLElement>('#ui-tooltip');
  const tooltipLabel = tooltip?.querySelector<HTMLElement>(
    '[data-tooltip-label]',
  );
  const tooltipKey = tooltip?.querySelector<HTMLElement>('[data-tooltip-key]');
  let tooltipTarget: HTMLElement | undefined;
  let tooltipShowTimer: ReturnType<typeof setTimeout> | undefined;
  let tooltipHideTimer: ReturnType<typeof setTimeout> | undefined;
  const hideTooltip = () => {
    clearTimeout(tooltipShowTimer);
    clearTimeout(tooltipHideTimer);
    if (tooltip?.isConnected && tooltip.matches(':popover-open'))
      tooltip.hidePopover();
    if (tooltipTarget) {
      const ids = (tooltipTarget.getAttribute('aria-describedby') ?? '')
        .split(/\s+/)
        .filter((id) => id && id !== 'ui-tooltip');
      if (ids.length)
        tooltipTarget.setAttribute('aria-describedby', ids.join(' '));
      else tooltipTarget.removeAttribute('aria-describedby');
    }
    tooltipTarget = undefined;
  };
  const showTooltip = (target: HTMLElement) => {
    hideTooltip();
    if (
      !tooltip ||
      !tooltipLabel ||
      !tooltipKey ||
      !target.isConnected ||
      target.closest('[inert]') ||
      (target.hasAttribute('popovertarget') &&
        target.getAttribute('aria-expanded') === 'true')
    )
      return;
    tooltipTarget = target;
    tooltipLabel.textContent = target.dataset.tooltip ?? '';
    tooltipKey.textContent = target.dataset.tooltipShortcut ?? '';
    tooltipKey.hidden = !tooltipKey.textContent;
    // clientWidth excludes the scrollbar gutter; innerWidth includes it.
    const viewport = document.documentElement;
    const viewportLeft = viewport.clientLeft;
    const viewportRight = viewportLeft + viewport.clientWidth;
    tooltip.style.maxWidth = `${Math.max(0, viewport.clientWidth - 16)}px`;
    tooltip.showPopover();
    const anchor = target.getBoundingClientRect();
    const panel = tooltip.getBoundingClientRect();
    tooltip.style.left = `${Math.max(viewportLeft + 8, Math.min(anchor.left + anchor.width / 2 - panel.width / 2, viewportRight - panel.width - 8))}px`;
    tooltip.style.top = `${anchor.bottom + 8 + panel.height <= viewport.clientHeight - 8 ? anchor.bottom + 8 : Math.max(8, anchor.top - panel.height - 8)}px`;
    const ids = (target.getAttribute('aria-describedby') ?? '')
      .split(/\s+/)
      .filter(Boolean);
    target.setAttribute('aria-describedby', [...ids, 'ui-tooltip'].join(' '));
  };
  const leaveTooltip = () => {
    clearTimeout(tooltipShowTimer);
    clearTimeout(tooltipHideTimer);
    tooltipHideTimer = setTimeout(hideTooltip, 100);
  };
  for (const target of document.querySelectorAll<HTMLElement>(
    '[data-tooltip]',
  )) {
    if (target.dataset.tooltipShortcut) {
      if (/Mac|iPhone|iPad/.test(navigator.platform))
        target.dataset.tooltipShortcut = target.dataset.tooltipShortcut.replace(
          'Ctrl',
          '⌘',
        );
      target.setAttribute(
        'aria-keyshortcuts',
        target.dataset.tooltipShortcut
          .replace('⌘', 'Meta')
          .replace('Ctrl', 'Control'),
      );
    }
    target.addEventListener(
      'pointerenter',
      (event) => {
        if (event.pointerType === 'touch') return;
        hideTooltip();
        tooltipShowTimer = setTimeout(() => showTooltip(target), 350);
      },
      { signal },
    );
    target.addEventListener('pointerleave', leaveTooltip, { signal });
    target.addEventListener('focus', () => showTooltip(target), { signal });
    target.addEventListener('blur', hideTooltip, { signal });
    target.addEventListener('pointerdown', hideTooltip, { signal });
    target.addEventListener('click', hideTooltip, { signal });
  }
  tooltip?.addEventListener(
    'pointerenter',
    () => clearTimeout(tooltipHideTimer),
    { signal },
  );
  tooltip?.addEventListener('pointerleave', leaveTooltip, { signal });
  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape') hideTooltip();
    },
    { signal },
  );
  document.addEventListener('astro:before-preparation', hideTooltip, {
    signal,
  });
  document.addEventListener('scroll', hideTooltip, { signal, capture: true });
  window.addEventListener('resize', hideTooltip, { signal });
  signal.addEventListener('abort', hideTooltip, { once: true });
  for (const root of document.querySelectorAll<HTMLElement>(
    '[data-popover-root]',
  )) {
    const trigger = root.querySelector<HTMLButtonElement>(
      '[data-popover-trigger]',
    )!;
    const panel = root.querySelector<HTMLElement>('.popover-panel')!;
    const items = () =>
      Array.from(panel.querySelectorAll<HTMLElement>('[role^="menuitem"]'));
    const position = () => {
      const anchor = trigger.getBoundingClientRect();
      const bounds = panel.getBoundingClientRect();
      const width =
        bounds.width ||
        Math.min(
          parseFloat(panel.style.getPropertyValue('--popover-width')),
          innerWidth - 16,
        );
      const height = bounds.height || panel.childElementCount * 36 + 12;
      let left =
        panel.dataset.popoverAlign === 'end'
          ? anchor.right - width
          : anchor.left;
      const gap = panel.classList.contains('site-menu') ? 5 : 6;
      const below = anchor.bottom + gap;
      let top =
        below + height > innerHeight - 8 ? anchor.top - height - gap : below;
      if (panel.classList.contains('site-menu')) left = anchor.left + 1;
      if (panel.dataset.popoverSide === 'right' && innerWidth > 760) {
        const parent =
          trigger.closest('.profile-menu')?.getBoundingClientRect() ?? anchor;
        left = parent.right + 6;
        if (left + width > innerWidth - 8) left = parent.left - width - 6;
        top = anchor.top - 6;
      }
      panel.style.setProperty(
        '--popover-x',
        `${Math.max(8, Math.min(left, innerWidth - width - 8))}px`,
      );
      panel.style.setProperty(
        '--popover-y',
        `${Math.max(8, Math.min(top, innerHeight - height - 8))}px`,
      );
    };
    panel.addEventListener('beforetoggle', position, { signal });
    panel.addEventListener('beforetoggle', hideTooltip, { signal });
    panel.addEventListener(
      'toggle',
      () => {
        const open = panel.matches(':popover-open');
        trigger.setAttribute('aria-expanded', String(open));
        if (open) position();
      },
      { signal },
    );
    trigger.addEventListener(
      'keydown',
      (event) => {
        const keys =
          panel.dataset.popoverSide === 'right'
            ? ['ArrowDown', 'ArrowUp', 'ArrowRight']
            : ['ArrowDown', 'ArrowUp'];
        if (!keys.includes(event.key)) return;
        event.preventDefault();
        if (!panel.matches(':popover-open')) panel.showPopover();
        (event.key === 'ArrowUp' ? items().at(-1) : items()[0])?.focus();
      },
      { signal },
    );
    panel.addEventListener(
      'keydown',
      (event) => {
        const options = items();
        const index = options.indexOf(document.activeElement as HTMLElement);
        if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
          event.preventDefault();
          const next =
            event.key === 'Home'
              ? 0
              : event.key === 'End'
                ? options.length - 1
                : (index +
                    (event.key === 'ArrowUp' ? -1 : 1) +
                    options.length) %
                  options.length;
          options[next]?.focus();
        }
        if (event.key === 'Tab') panel.hidePopover();
        if (
          event.key === 'ArrowLeft' &&
          panel.dataset.popoverSide === 'right'
        ) {
          event.preventDefault();
          panel.hidePopover();
          trigger.focus();
        }
      },
      { signal },
    );
    window.addEventListener(
      'resize',
      () => {
        if (panel.matches(':popover-open')) position();
      },
      { signal },
    );
    document.addEventListener(
      'scroll',
      () => {
        if (panel.matches(':popover-open')) position();
      },
      { signal, capture: true },
    );
  }
  if (!themeInitialized) {
    selectedTheme = document.documentElement.dataset.defaultTheme ?? 'system';
    try {
      selectedTheme = localStorage.getItem('bloggpt-theme') ?? selectedTheme;
    } catch {
      /* Storage may be disabled. */
    }
    if (!['light', 'dark', 'system'].includes(selectedTheme))
      selectedTheme = 'system';
    themeInitialized = true;
  }
  applyTheme();
  delete document.documentElement.dataset.mobileSidebar;
  const updateThemeControls = () => {
    document
      .querySelectorAll<HTMLElement>('[data-theme-label]')
      .forEach((label) => {
        label.textContent = ui[selectedTheme as 'system' | 'light' | 'dark'];
      });
    document
      .querySelectorAll<HTMLButtonElement>('[data-theme-option]')
      .forEach((button) => {
        button.setAttribute(
          'aria-checked',
          String(button.dataset.themeOption === selectedTheme),
        );
      });
  };
  updateThemeControls();
  const setTheme = (theme: string) => {
    selectedTheme = theme;
    try {
      localStorage.setItem('bloggpt-theme', theme);
    } catch {
      /* Storage is optional. */
    }
    applyTheme();
    updateThemeControls();
  };
  document
    .querySelectorAll<HTMLButtonElement>('[data-theme-option]')
    .forEach((button) => {
      button.addEventListener(
        'click',
        () => {
          setTheme(button.dataset.themeOption!);
          button.closest<HTMLElement>('[popover]')?.hidePopover();
        },
        { signal },
      );
    });
  document
    .querySelectorAll<HTMLButtonElement>('[data-section-toggle]')
    .forEach((button) => {
      const list = document.getElementById(
        button.getAttribute('aria-controls')!,
      );
      if (!list) return;
      const storageKey = `bloggpt-section-${button.dataset.sectionToggle}`;
      let expanded = true;
      let animation: Animation | undefined;
      const update = (open: boolean, animate = false) => {
        const height = list.hidden ? 0 : list.getBoundingClientRect().height;
        const opacity = list.hidden
          ? 0
          : Number(getComputedStyle(list).opacity);
        animation?.cancel();
        animation = undefined;
        expanded = open;
        list.inert = !open;
        button.setAttribute('aria-expanded', String(open));
        if (
          !animate ||
          matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
          list.hidden = !open;
          return;
        }
        // Keep the rows in place while their container shrinks. Hidden is set only after closing.
        list.hidden = false;
        const current = list.animate(
          [
            { height: `${height}px`, opacity },
            {
              height: `${open ? list.scrollHeight : 0}px`,
              opacity: open ? 1 : 0,
            },
          ],
          { duration: 200, easing: 'cubic-bezier(0.2, 0, 0, 1)', fill: 'both' },
        );
        animation = current;
        void current.finished
          .then(() => {
            if (animation !== current) return;
            list.hidden = !expanded;
            current.cancel();
            animation = undefined;
          })
          .catch(() => {
            /* Reversing or navigating cancels the previous animation. */
          });
      };
      try {
        update(localStorage.getItem(storageKey) !== 'collapsed');
      } catch {
        /* Persistence is optional. */
      }
      button.addEventListener(
        'click',
        () => {
          const open = !expanded;
          update(open, true);
          try {
            localStorage.setItem(storageKey, open ? 'expanded' : 'collapsed');
          } catch {
            /* Persistence is optional. */
          }
        },
        { signal },
      );
      signal.addEventListener(
        'abort',
        () => {
          animation?.cancel();
          list.hidden = !expanded;
        },
        { once: true },
      );
    });
  const toggles = document.querySelectorAll<HTMLButtonElement>(
    '[data-sidebar-toggle]',
  );
  const shell = document.documentElement;
  const resizeHandle = document.querySelector<HTMLButtonElement>(
    '[data-sidebar-resize]',
  );
  const defaultWidth = Number(shell.dataset.sidebarDefaultWidth);
  const minWidth = Number(shell.dataset.sidebarMinWidth);
  const maxWidth = Number(shell.dataset.sidebarMaxWidth);
  let preferredWidth =
    preferredSidebarWidth ??
    (parseFloat(shell.style.getPropertyValue('--sidebar-width')) ||
      defaultWidth);
  if (preferredSidebarWidth === undefined) {
    try {
      const savedWidth = Number(localStorage.getItem('bloggpt-sidebar-width'));
      if (
        Number.isFinite(savedWidth) &&
        savedWidth >= minWidth &&
        savedWidth <= maxWidth
      )
        preferredWidth = savedWidth;
    } catch {
      /* Storage is optional. */
    }
  }
  let drag: { pointer: number; x: number; width: number } | undefined;
  const applySidebarWidth = () => {
    // Retain the preference before viewport clamping, even if storage writes fail.
    preferredSidebarWidth = preferredWidth;
    const width = Math.round(
      Math.max(
        minWidth,
        Math.min(
          preferredWidth,
          maxWidth,
          innerWidth > 760 ? innerWidth - 320 : maxWidth,
        ),
      ),
    );
    shell.style.setProperty('--sidebar-width', `${width}px`);
    resizeHandle?.setAttribute('aria-valuenow', String(width));
    resizeHandle?.setAttribute('aria-valuetext', `${width}px`);
  };
  const saveSidebarWidth = () => {
    try {
      localStorage.setItem('bloggpt-sidebar-width', String(preferredWidth));
    } catch {
      /* Nonessential persistence. */
    }
  };
  const stopResize = () => {
    if (drag && resizeHandle?.hasPointerCapture(drag.pointer))
      resizeHandle.releasePointerCapture(drag.pointer);
    drag = undefined;
    delete shell.dataset.sidebarResizing;
  };
  resizeHandle?.addEventListener(
    'pointerdown',
    (event) => {
      if (event.button !== 0 || innerWidth <= 760) return;
      event.preventDefault();
      resizeHandle.focus({ preventScroll: true });
      drag = {
        pointer: event.pointerId,
        x: event.clientX,
        width: parseFloat(
          getComputedStyle(shell).getPropertyValue('--sidebar-width'),
        ),
      };
      resizeHandle.setPointerCapture(event.pointerId);
      shell.dataset.sidebarResizing = 'true';
    },
    { signal },
  );
  resizeHandle?.addEventListener(
    'pointermove',
    (event) => {
      if (!drag || event.pointerId !== drag.pointer) return;
      preferredWidth = Math.round(
        Math.max(
          minWidth,
          Math.min(
            maxWidth,
            innerWidth - 320,
            drag.width + event.clientX - drag.x,
          ),
        ),
      );
      applySidebarWidth();
    },
    { signal },
  );
  resizeHandle?.addEventListener(
    'pointerup',
    () => {
      if (!drag) return;
      saveSidebarWidth();
      stopResize();
    },
    { signal },
  );
  resizeHandle?.addEventListener(
    'pointercancel',
    () => {
      if (drag) preferredWidth = drag.width;
      stopResize();
      applySidebarWidth();
    },
    { signal },
  );
  resizeHandle?.addEventListener('lostpointercapture', stopResize, { signal });
  const resetWidth = () => {
    preferredWidth = defaultWidth;
    applySidebarWidth();
    saveSidebarWidth();
  };
  resizeHandle?.addEventListener('dblclick', resetWidth, { signal });
  resizeHandle?.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Home') {
        event.preventDefault();
        resetWidth();
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        preferredWidth = Math.max(
          minWidth,
          Math.min(
            maxWidth,
            innerWidth - 320,
            preferredWidth +
              (event.key === 'ArrowRight' ? 1 : -1) * (event.shiftKey ? 32 : 8),
          ),
        );
        applySidebarWidth();
        saveSidebarWidth();
      }
    },
    { signal },
  );
  signal.addEventListener('abort', stopResize, { once: true });
  const updateSidebar = () => {
    stopResize();
    applySidebarWidth();
    const mobile = innerWidth <= 760;
    const expanded = mobile
      ? document.documentElement.dataset.mobileSidebar === 'open'
      : document.documentElement.dataset.sidebar !== 'collapsed';
    const sidebar = document.querySelector<HTMLElement>('#sidebar');
    const main = document.querySelector<HTMLElement>('.main-shell');
    if (sidebar) sidebar.inert = !expanded;
    if (main) main.inert = mobile && expanded;
    toggles.forEach((button) => {
      button.setAttribute('aria-expanded', String(expanded));
      button.dataset.tooltip = ui.sidebar;
    });
  };
  const closeSidebar = () => {
    const wasOpen = document.documentElement.dataset.mobileSidebar === 'open';
    delete document.documentElement.dataset.mobileSidebar;
    updateSidebar();
    if (wasOpen)
      document.querySelector<HTMLButtonElement>('.reopen-sidebar')?.focus();
  };
  toggles.forEach((button) =>
    button.addEventListener(
      'click',
      () => {
        if (innerWidth <= 760) {
          document.documentElement.dataset.mobileSidebar =
            document.documentElement.dataset.mobileSidebar === 'open'
              ? ''
              : 'open';
        } else {
          const collapsed =
            document.documentElement.dataset.sidebar !== 'collapsed';
          document.documentElement.dataset.sidebar = collapsed
            ? 'collapsed'
            : 'expanded';
          try {
            localStorage.setItem(
              'bloggpt-sidebar',
              collapsed ? 'collapsed' : 'expanded',
            );
          } catch {
            /* Nonessential persistence. */
          }
        }
        updateSidebar();
        if (
          innerWidth <= 760 &&
          document.documentElement.dataset.mobileSidebar === 'open'
        )
          document
            .querySelector<HTMLAnchorElement>('#sidebar .nav-item')
            ?.focus();
      },
      { signal },
    ),
  );
  document
    .querySelector('[data-sidebar-close]')
    ?.addEventListener('click', closeSidebar, { signal });
  window.addEventListener('resize', updateSidebar, { signal });
  updateSidebar();

  const wrap = document.querySelector<HTMLElement>('[data-profile-wrap]');
  const menu = document.querySelector<HTMLElement>('[data-profile-menu]');
  const profileButton = document.querySelector<HTMLButtonElement>(
    '[data-profile-toggle]',
  );
  let closeTimer: ReturnType<typeof setTimeout>;
  let profilePinned = false;
  const showProfile = (show: boolean) => {
    if (!menu || !profileButton) return;
    clearTimeout(closeTimer);
    menu.hidden = !show;
    profileButton.setAttribute('aria-expanded', String(show));
    if (!show) profilePinned = false;
  };
  wrap?.addEventListener(
    'pointerenter',
    (event) => {
      if (event.pointerType !== 'touch') showProfile(true);
    },
    { signal },
  );
  wrap?.addEventListener(
    'pointerleave',
    () => {
      closeTimer = setTimeout(() => {
        if (!profilePinned && !wrap.contains(document.activeElement))
          showProfile(false);
      }, 180);
    },
    { signal },
  );
  wrap?.addEventListener(
    'focusout',
    (event) => {
      if (!wrap.contains(event.relatedTarget as Node)) showProfile(false);
    },
    { signal },
  );
  profileButton?.addEventListener(
    'click',
    () => {
      profilePinned = !profilePinned;
      showProfile(profilePinned);
    },
    { signal },
  );
  profileButton?.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        showProfile(true);
        menu?.querySelector<HTMLElement>('a,select')?.focus();
      }
    },
    { signal },
  );
  document.addEventListener(
    'pointerdown',
    (event) => {
      if (!wrap?.contains(event.target as Node)) showProfile(false);
    },
    { signal },
  );

  const dialog = document.querySelector<HTMLDialogElement>('#search-dialog');
  const shortcutDialog =
    document.querySelector<HTMLDialogElement>('#shortcut-dialog');
  const openShortcuts = () => {
    hideTooltip();
    dialog?.close();
    closeSidebar();
    showProfile(false);
    if (!shortcutDialog?.open) shortcutDialog?.showModal();
  };
  document
    .querySelectorAll('[data-open-shortcuts]')
    .forEach((button) =>
      button.addEventListener('click', openShortcuts, { signal }),
    );
  if (/Mac|iPhone|iPad/.test(navigator.platform)) {
    shortcutDialog?.querySelectorAll('kbd').forEach((key) => {
      key.textContent = key.textContent?.replace('Ctrl', '⌘') ?? '';
    });
  }
  const openSearch = () => {
    hideTooltip();
    showProfile(false);
    closeSidebar();
    document
      .querySelectorAll<HTMLElement>('.popover-panel:popover-open')
      .forEach((panel) => panel.hidePopover());
    if (!dialog?.open) dialog?.showModal();
    dialog?.querySelector<HTMLInputElement>('input')?.focus();
  };
  document
    .querySelectorAll<HTMLAnchorElement>('[data-open-search]')
    .forEach((link) =>
      link.addEventListener(
        'click',
        (event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
            return;
          event.preventDefault();
          openSearch();
        },
        { signal },
      ),
    );
  document
    .querySelector('[data-close-search]')
    ?.addEventListener('click', () => dialog?.close(), { signal });
  document
    .querySelector('[data-close-shortcuts]')
    ?.addEventListener('click', () => shortcutDialog?.close(), { signal });
  if (shortcutDialog) {
    let pressedBackdrop = false;
    const onBackdrop = (event: MouseEvent) => {
      const rect = shortcutDialog.getBoundingClientRect();
      return (
        event.target === shortcutDialog &&
        (event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom)
      );
    };
    shortcutDialog.addEventListener(
      'pointerdown',
      (event) => {
        pressedBackdrop = onBackdrop(event);
      },
      { signal },
    );
    shortcutDialog.addEventListener(
      'click',
      (event) => {
        if (pressedBackdrop && onBackdrop(event)) shortcutDialog.close();
        pressedBackdrop = false;
      },
      { signal },
    );
    shortcutDialog.addEventListener(
      'pointercancel',
      () => {
        pressedBackdrop = false;
      },
      { signal },
    );
  }
  for (const link of document.querySelectorAll<HTMLAnchorElement>(
    '[data-random-posts]',
  )) {
    const urls: string[] = JSON.parse(link.dataset.randomPosts ?? '[]');
    link.addEventListener(
      'click',
      (event) => {
        if (
          event.button !== 0 ||
          event.ctrlKey ||
          event.metaKey ||
          event.shiftKey ||
          event.altKey ||
          !urls.length
        )
          return;
        event.preventDefault();
        const target = urls[Math.floor(Math.random() * urls.length)];
        void navigate(target);
      },
      { signal },
    );
  }
  dialog?.addEventListener(
    'click',
    (event) => {
      if (event.target === dialog) {
        const rect = dialog.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          dialog.close();
      }
    },
    { signal },
  );
  document.addEventListener(
    'keydown',
    (event) => {
      if (event.isComposing || event.repeat || event.altKey) return;
      const primary = event.ctrlKey || event.metaKey;
      const key = event.key.toLowerCase();
      if (primary && !event.shiftKey && key === 'k') {
        event.preventDefault();
        shortcutDialog?.close();
        openSearch();
      }
      if (
        primary &&
        event.shiftKey &&
        key === 's' &&
        !dialog?.open &&
        !shortcutDialog?.open
      ) {
        event.preventDefault();
        const button = [...toggles].find(
          (button) =>
            button.getClientRects().length > 0 && !button.closest('[inert]'),
        );
        button?.click();
      }
      if (primary && event.shiftKey && key === 'o') {
        event.preventDefault();
        void navigate(document.body.dataset.localeRoot!);
      }
      if (
        !primary &&
        event.shiftKey &&
        event.key === 'Escape' &&
        !dialog?.open &&
        !shortcutDialog?.open
      ) {
        event.preventDefault();
        closeSidebar();
        document
          .querySelector<HTMLInputElement>(
            '.main-shell [data-search-form] input',
          )
          ?.focus();
        return;
      }
      if (
        primary &&
        !event.shiftKey &&
        (key === '/' || event.code === 'Slash')
      ) {
        event.preventDefault();
        openShortcuts();
      }
      if (
        event.key === 'Escape' &&
        !document.querySelector('.popover-panel:popover-open')
      ) {
        if (dialog?.open) return;
        if (menu && !menu.hidden) {
          showProfile(false);
          profileButton?.focus();
        } else closeSidebar();
      }
      if (
        event.key === 'Tab' &&
        innerWidth <= 760 &&
        document.documentElement.dataset.mobileSidebar === 'open'
      ) {
        const elements = [
          ...document.querySelectorAll<HTMLElement>(
            '#sidebar a, #sidebar button, #sidebar select',
          ),
        ].filter((el) => el.offsetParent !== null);
        const first = elements[0],
          last = elements.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    },
    { signal },
  );

  const getSearchIndex = searchIndexes(base, signal);
  let fallbackPromise: Promise<SearchEntry[]> | undefined;
  const renderedCache = new Map<string, Promise<SearchSection[]>>();
  const loadRenderedSections = (url: string) => {
    let pending = renderedCache.get(url);
    if (!pending) {
      pending = fetch(url, { signal })
        .then(async (res) => {
          if (!res.ok) throw new Error('Search content unavailable');
          return renderedSections(
            new DOMParser().parseFromString(await res.text(), 'text/html'),
          );
        })
        .catch((error) => {
          renderedCache.delete(url);
          throw error;
        });
      renderedCache.set(url, pending);
    }
    return pending;
  };
  const dev = document.body.dataset.searchDev === 'true';
  const loadResults = async (query: string, scope: SearchScope) => {
    if (dev) {
      fallbackPromise ??= fetch(
        `${document.body.dataset.localeRoot}search-data.json`,
        {
          signal,
        },
      )
        .then((res) => {
          if (!res.ok) throw new Error('Search index unavailable');
          return res.json();
        })
        .catch((error) => {
          fallbackPromise = undefined;
          throw error;
        });
      const candidates = (await fallbackPromise)
        .filter((entry) => matchesSearch(entry, query, scope))
        .slice(0, 30);
      return Promise.all(
        candidates.map(async (entry) => ({
          ...entry,
          sections:
            scope === 'title' ? [] : await loadRenderedSections(entry.url),
        })),
      );
    }
    const folder =
      scope === 'title' || scope === 'body' ? `pagefind-${scope}` : 'pagefind';
    const pagefind = await getSearchIndex(folder);
    try {
      const result = await pagefind.search(searchTokens(query), {
        filters: {
          locale: lang.toLowerCase(),
          ...(scope === 'articles' ? { kind: 'posts' } : {}),
        },
      });
      const matches: {
        title: string;
        description: string;
        sections: SearchSection[];
        url: string;
      }[] = [];
      const runs = query.match(/\p{Script=Han}+/gu) ?? [];
      // Load ranked candidates in batches; common characters must not download
      // the whole corpus when the first batch already fills the results page.
      for (
        let offset = 0;
        offset < result.results.length && matches.length < 30;
        offset += 30
      ) {
        if (signal.aborted)
          throw new DOMException('Navigation cancelled', 'AbortError');
        const batch = await Promise.all(
          result.results.slice(offset, offset + 30).map(async (item) => {
            const data = await item.data();
            const parsed = new DOMParser().parseFromString(
              data.excerpt,
              'text/html',
            );
            return {
              title: data.meta.title ?? '',
              description:
                data.meta.description ??
                (parsed.body.textContent ?? '').slice(0, 180),
              sections: JSON.parse(
                data.meta.sections ?? '[]',
              ) as SearchSection[],
              url: data.url,
            };
          }),
        );
        // Character tokens are candidates; verify original CJK runs to exclude
        // unrelated occurrences of individual characters in distant paragraphs.
        matches.push(
          ...batch.filter((entry) => {
            const text =
              scope === 'title'
                ? `${entry.title} ${entry.description}`
                : scope === 'body'
                  ? entry.sections.map((section) => section.text).join(' ')
                  : `${entry.title} ${entry.description} ${entry.sections.map((section) => section.text).join(' ')}`;
            return runs.every((run) => text.includes(run));
          }),
        );
      }
      return matches.slice(0, 30);
    } catch (error) {
      await getSearchIndex.invalidate(folder, pagefind);
      throw error;
    }
  };
  const commandStatus =
    document.querySelector<HTMLDialogElement>('#blog-status');
  document
    .querySelector('[data-close-status]')
    ?.addEventListener('click', () => commandStatus?.close(), { signal });
  const openStatistics = () => {
    if (!commandStatus) return;
    showProfile(false);
    dialog?.close();
    if (!commandStatus.open) commandStatus.showModal();
  };
  document
    .querySelectorAll('[data-open-status]')
    .forEach((button) =>
      button.addEventListener('click', openStatistics, { signal }),
    );
  const executeCommand = (value: string): boolean => {
    const [name, argument] = value.trim().slice(1).toLowerCase().split(/\s+/);
    const languageLinks = Object.entries(
      JSON.parse(document.body.dataset.languageUrls ?? '{}') as Record<
        string,
        string
      >,
    ).map(([locale, href]) => ({ locale, href }));
    const requestedLanguage = languageLinks.find(
      (link) => link.locale.toLowerCase() === argument,
    );
    if (
      !['random', 'lang', 'theme', 'status', 'categories', 'archives'].includes(
        name,
      )
    )
      return false;
    if (name === 'lang' && argument && !requestedLanguage) return false;
    if (
      name === 'theme' &&
      argument &&
      !['light', 'dark', 'system'].includes(argument)
    )
      return false;
    document
      .querySelectorAll<HTMLElement>('.popover-panel:popover-open')
      .forEach((panel) => panel.hidePopover());
    if (name === 'random') {
      const urls: string[] = JSON.parse(
        document.body.dataset.recentUrls ?? '[]',
      );
      if (urls.length)
        void navigate(urls[Math.floor(Math.random() * urls.length)]);
    }
    if (name === 'theme')
      setTheme(argument ?? (resolveTheme() === 'light' ? 'dark' : 'light'));
    if (name === 'lang') {
      const current = languageLinks.findIndex((link) => link.locale === lang);
      const link = argument
        ? requestedLanguage
        : languageLinks[(current + 1) % languageLinks.length];
      if (link) void navigate(link.href);
    }
    if (name === 'status') {
      if (!commandStatus) return false;
      openStatistics();
    }
    if (name === 'categories' || name === 'archives')
      void navigate(`${document.body.dataset.localeRoot}${name}/`);
    return true;
  };
  const highlight = (element: HTMLElement, text: string, query: string) => {
    const words = query
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    if (!words.length) {
      element.textContent = text;
      return;
    }
    const pattern = new RegExp(`(${words.join('|')})`, 'gi');
    for (const piece of text.split(pattern)) {
      if (words.some((word) => new RegExp(`^${word}$`, 'i').test(piece))) {
        const mark = document.createElement('mark');
        mark.textContent = piece;
        element.append(mark);
      } else element.append(document.createTextNode(piece));
    }
  };
  for (const form of document.querySelectorAll<HTMLFormElement>(
    '[data-search-form]',
  )) {
    setupComposer(form, signal);
    const input = form.querySelector<HTMLInputElement>('input[name="q"]')!;
    const scopeInput = form.querySelector<HTMLInputElement>(
      'input[name="scope"]',
    )!;
    const setScope = (scope: SearchScope) => {
      scopeInput.value = scope;
      form
        .querySelectorAll<HTMLButtonElement>('[data-search-scope]')
        .forEach((button) => {
          const selected = button.dataset.searchScope === scope;
          button.setAttribute('aria-checked', String(selected));
          if (selected)
            form.querySelector<HTMLElement>('[data-scope-label]')!.textContent =
              button.dataset.scopeText!;
        });
    };
    setScope(
      form.closest('.search-page')
        ? searchScope(new URLSearchParams(location.search).get('scope'))
        : 'articles',
    );
    form
      .querySelectorAll<HTMLButtonElement>('[data-search-scope]')
      .forEach((button) => {
        button.addEventListener(
          'click',
          () => {
            setScope(searchScope(button.dataset.searchScope));
            button.closest<HTMLElement>('[popover]')?.hidePopover();
            form.dispatchEvent(new Event('search-scope-change'));
            form.querySelector<HTMLButtonElement>('.scope-button')?.focus();
          },
          { signal },
        );
      });
    form.addEventListener(
      'submit',
      (event) => {
        if (input.value.trim().startsWith('@')) {
          setScope('title');
        } else if (
          input.value.trim().startsWith('/') &&
          executeCommand(input.value)
        ) {
          event.preventDefault();
          event.stopImmediatePropagation();
          input.value = '';
          input.dispatchEvent(new Event('input'));
        }
      },
      { signal },
    );
    const queryButton = form.querySelector<HTMLButtonElement>(
      '[data-query-button]',
    );
    if (queryButton) {
      const updateQueryButton = () => {
        const filled = Boolean(input.value.trim());
        queryButton.dataset.hasQuery = String(filled);
        queryButton.setAttribute(
          'aria-label',
          filled ? ui.search : ui.openSearch,
        );
        queryButton.dataset.tooltip = filled ? ui.search : ui.searchTooltip;
      };
      updateQueryButton();
      input.addEventListener('input', updateQueryButton, { signal });
      form.addEventListener(
        'submit',
        (event) => {
          if (!input.value.trim()) {
            event.preventDefault();
            openSearch();
          }
        },
        { signal },
      );
    }
    const container = form.closest('.search-dialog, .search-page');
    const output = container?.querySelector<HTMLElement>(
      '[data-search-output]',
    );
    if (!output) continue; // The homepage composer navigates to the dedicated search route.
    output.addEventListener(
      'click',
      (event) => {
        if (
          event.button !== 0 ||
          event.ctrlKey ||
          event.metaKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        if ((event.target as Element).closest('a[href]')) dialog?.close();
      },
      { signal },
    );
    let sequence = 0;
    let timer: ReturnType<typeof setTimeout>;
    const showMessage = (text: string) => {
      output.replaceChildren();
      const p = document.createElement('p');
      p.className = 'search-hint';
      p.textContent = text;
      output.append(p);
    };
    const search = async () => {
      const value = input.value.trim();
      // Keep @ in the input so another submit remains a literal title search.
      const titleSearch = value.startsWith('@');
      if (titleSearch) setScope('title');
      const query = titleSearch ? value.slice(1).trim() : value;
      const request = ++sequence;
      if (!query) {
        const recent = document.querySelector<HTMLTemplateElement>(
          '[data-search-recent]',
        );
        if (container?.classList.contains('search-dialog') && recent)
          output.replaceChildren(recent.content.cloneNode(true));
        else showMessage(ui.searchHelp);
        return;
      }
      showMessage(ui.searching);
      try {
        const scope = searchScope(scopeInput.value);
        const results = await loadResults(query, scope);
        if (request !== sequence || signal.aborted) return;
        output.replaceChildren();
        if (!results.length) {
          showMessage(ui.noResults);
          return;
        }
        const count = document.createElement('p');
        count.className = 'search-result-count';
        count.textContent = `${results.length} ${ui.resultCount}`;
        output.append(count);
        for (const result of results) {
          const url = new URL(result.url, location.origin);
          if (url.origin !== location.origin) continue;
          const item = document.createElement('article');
          item.className = 'search-result';
          const link = document.createElement('a');
          link.href = `${url.pathname}${url.search}`;
          const title = document.createElement('h3');
          highlight(title, result.title, query);
          link.append(title);
          const description = document.createElement('p');
          highlight(description, result.description, query);
          item.append(link, description);
          if (scope !== 'title') {
            for (const snippet of contextSnippets(result.sections, query)) {
              const context = document.createElement('a');
              context.className = 'search-context';
              const target = new URL(url);
              if (snippet.id) target.hash = snippet.id;
              context.href = `${target.pathname}${target.search}${target.hash}`;
              const location = document.createElement('span');
              location.className = 'search-context-location';
              highlight(location, snippet.heading || ui.bodyMatch, query);
              const text = document.createElement('span');
              highlight(text, snippet.text, query);
              context.append(location, text);
              item.append(context);
            }
          }
          output.append(item);
        }
      } catch {
        if (request === sequence && !signal.aborted)
          showMessage(ui.searchError);
      }
    };
    form.addEventListener(
      'search-scope-change',
      () => {
        clearTimeout(timer);
        void search();
      },
      { signal },
    );
    input.addEventListener(
      'input',
      () => {
        clearTimeout(timer);
        timer = setTimeout(search, 180);
      },
      { signal },
    );
    form.addEventListener(
      'submit',
      (event) => {
        event.preventDefault();
        clearTimeout(timer);
        if (container?.classList.contains('search-page')) {
          const url = new URL(location.href);
          url.searchParams.set('q', input.value);
          url.searchParams.set('scope', scopeInput.value);
          history.replaceState(null, '', url);
        }
        void search();
      },
      { signal },
    );
    if (container?.classList.contains('search-page')) {
      input.value = new URLSearchParams(location.search).get('q') ?? '';
      if (input.value) void search();
    }
    signal.addEventListener('abort', () => clearTimeout(timer), { once: true });
  }
  signal.addEventListener('abort', () => clearTimeout(closeTimer), {
    once: true,
  });
}
document.addEventListener('astro:before-swap', (event) => {
  const next = (event as Event & { newDocument: Document }).newDocument;
  next.documentElement.dataset.theme = resolveTheme();
  if (document.documentElement.dataset.sidebar)
    next.documentElement.dataset.sidebar =
      document.documentElement.dataset.sidebar;
  next.documentElement.style.setProperty(
    '--sidebar-width',
    document.documentElement.style.getPropertyValue('--sidebar-width'),
  );
});
document.addEventListener('astro:page-load', setup);
