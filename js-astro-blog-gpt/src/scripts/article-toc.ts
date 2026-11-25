import { t } from '../lib/i18n';
import { visibleSections } from '../lib/visible-sections';
import { stationaryHover } from '../lib/stationary-hover';
let dispose: (() => void) | undefined;
document.addEventListener('astro:before-swap', () => dispose?.());
document.addEventListener('astro:page-load', () => {
  dispose?.();
  const ui = t(document.body.dataset.locale ?? 'en');
  const root = document.querySelector<HTMLElement>('[data-article-toc]');
  if (!root) return;
  const rail = root.querySelector<HTMLElement>('[data-toc-rail]')!;
  const panel = root.querySelector<HTMLElement>('[data-toc-panel]')!;
  const toggle = document.querySelector<HTMLButtonElement>('[data-toc-toggle]');
  const preview = panel.querySelector<HTMLElement>('[data-toc-preview]')!;
  const full = panel.querySelector<HTMLElement>('[data-toc-full]')!;
  const items = full.querySelector<HTMLElement>('[data-toc-items]')!;
  const heading = panel.querySelector<HTMLElement>('[data-toc-title]')!;
  const excerpt = panel.querySelector<HTMLElement>('[data-toc-excerpt]')!;
  const links = [
    ...root.querySelectorAll<HTMLAnchorElement>('[data-toc-entry]'),
  ];
  const railLinks = [
    ...rail.querySelectorAll<HTMLAnchorElement>('[data-toc-entry]'),
  ];
  const hoverRail = (link?: HTMLAnchorElement) => {
    rail.toggleAttribute('data-pointer-active', !!link);
    for (const item of railLinks)
      item.toggleAttribute('data-pointer-current', item === link);
  };
  // MDX headings may contain expressions: use their rendered text for the outline.
  for (const link of links) {
    const title = document
      .getElementById(link.dataset.tocEntry!)
      ?.textContent?.trim();
    if (!title) continue;
    if (link.closest('[data-toc-rail]')) {
      link.dataset.title = title;
      link.setAttribute('aria-label', title);
    } else link.textContent = title;
  }
  const sections = railLinks
    .map((link) => document.getElementById(link.dataset.tocEntry!))
    .filter((element): element is HTMLElement => !!element);
  const controller = new AbortController();
  const { signal } = controller;
  let closeTimer: ReturnType<typeof setTimeout> | undefined;
  let anchor: HTMLAnchorElement | undefined;
  let expanded = false;
  let restoringFocus = false;
  let keyboardInteraction = false;
  let frame = 0;
  let dragging:
    | {
        pointer: number;
        element: HTMLElement;
        x: number;
        y: number;
        moved: boolean;
      }
    | undefined;
  let ignoreClick = false;
  let clickTimer: ReturnType<typeof setTimeout>;
  const main = document.querySelector<HTMLElement>('.article-main');
  const hide = () => {
    dwell.cancel();
    clearTimeout(closeTimer);
    if (panel.matches(':popover-open')) panel.hidePopover();
    expanded = false;
    panel.classList.remove('is-expanded');
    panel.style.height = '';
    toggle?.setAttribute('aria-expanded', 'false');
    for (const link of links) delete link.dataset.tocHighlight;
  };
  const highlight = (id: string) => {
    for (const link of links) {
      if (link.dataset.tocEntry === id) link.dataset.tocHighlight = '';
      else delete link.dataset.tocHighlight;
    }
  };
  const position = (height = panel.offsetHeight) => {
    const viewport = document.documentElement;
    if (root.dataset.layout === 'compact') {
      const top =
        document.querySelector('.topbar')?.getBoundingClientRect().bottom ?? 52;
      panel.style.left = `${Math.max(8, viewport.clientWidth - panel.offsetWidth - 12)}px`;
      panel.style.top = `${Math.max(8, top + 8)}px`;
      return;
    }
    if (!anchor) return;
    const rect = rail.getBoundingClientRect();
    panel.style.left = `${Math.max(8, Math.min(rect.right + 12, viewport.clientWidth - panel.offsetWidth - 12))}px`;
    panel.style.top = expanded
      ? `${Math.max(12, (innerHeight - height) / 2)}px`
      : `${Math.max(12, Math.min(anchor.getBoundingClientRect().top - 12, innerHeight - height - 12))}px`;
  };
  const fitExpanded = () => {
    const header = full.querySelector<HTMLElement>('.toc-panel-heading')!;
    // The visible-range overlay stays within the padded items, so it cannot
    // enlarge scrollHeight after this measurement or introduce a scrollbar.
    const natural = header.offsetHeight + 8 + items.scrollHeight + 34;
    const top =
      root.dataset.layout === 'compact'
        ? (document.querySelector('.topbar')?.getBoundingClientRect().bottom ??
            52) + 8
        : 12;
    const height = Math.min(natural, innerHeight * 0.7, innerHeight - top - 12);
    panel.style.height = `${height}px`;
    position(height);
  };
  const expand = () => {
    dwell.cancel();
    if (expanded || !panel.matches(':popover-open')) return;
    const previous = panel.getBoundingClientRect().height;
    expanded = true;
    preview.hidden = true;
    full.hidden = false;
    panel.classList.add('is-expanded');
    panel.style.height = `${previous}px`;
    requestAnimationFrame(() => {
      if (signal.aborted || !expanded) return;
      update();
      fitExpanded();
    });
  };
  const dwell = stationaryHover<HTMLAnchorElement>(
    Number(root.dataset.delay ?? 1000),
    (link) => {
      if (anchor === link) expand();
    },
  );
  const armExpand = (link: HTMLAnchorElement) => {
    if (!expanded) dwell.move(link);
  };
  const show = (link: HTMLAnchorElement) => {
    clearTimeout(closeTimer);
    anchor = link;
    highlight(link.dataset.tocEntry!);
    if (expanded) return;
    const section = document.getElementById(link.dataset.tocEntry!);
    let text = '';
    let next = section?.nextElementSibling;
    const omit =
      'script, style, .katex, .katex-display, .mermaid-figure, .expressive-code, pre, button';
    while (next && !/^H[1-6]$/.test(next.tagName) && text.length < 220) {
      if (!next.matches(omit)) {
        const snippet = next.cloneNode(true) as HTMLElement;
        for (const element of snippet.querySelectorAll(omit)) element.remove();
        text += `${snippet.textContent ?? ''} `;
      }
      next = next.nextElementSibling;
    }
    heading.textContent = link.dataset.title ?? '';
    excerpt.textContent =
      text.replace(/\s+/g, ' ').trim().slice(0, 180) || ui.jumpSection;
    preview.hidden = false;
    full.hidden = true;
    panel.style.height = '';
    if (!panel.matches(':popover-open')) panel.showPopover();
    position();
    armExpand(link);
  };
  const scheduleClose = () => {
    clearTimeout(closeTimer);
    dwell.cancel();
    if (dragging || root.dataset.layout === 'compact') return;
    closeTimer = setTimeout(
      () => {
        const focused = document.activeElement;
        const keyboardFocus =
          keyboardInteraction &&
          focused?.matches(':focus-visible') &&
          (rail.contains(focused) || panel.contains(focused));
        if (
          !rail.matches(':hover') &&
          !panel.matches(':hover') &&
          !keyboardFocus
        )
          hide();
      },
      Number(root.dataset.hideDelay ?? 800),
    );
  };
  root.addEventListener(
    'keydown',
    () => {
      keyboardInteraction = true;
    },
    { signal, capture: true },
  );
  document.addEventListener(
    'pointermove',
    () => {
      keyboardInteraction = false;
    },
    { signal, passive: true },
  );
  root.addEventListener(
    'pointerdown',
    () => {
      keyboardInteraction = false;
    },
    { signal, capture: true },
  );
  for (const link of railLinks) {
    link.addEventListener(
      'pointerenter',
      (event) => {
        if (event.pointerType !== 'touch') {
          hoverRail(link);
          show(link);
        }
      },
      { signal },
    );
    link.addEventListener(
      'pointermove',
      (event) => {
        if (event.pointerType !== 'touch' && anchor === link) armExpand(link);
      },
      { signal },
    );
    link.addEventListener('pointerleave', dwell.cancel, { signal });
    link.addEventListener(
      'focus',
      () => {
        if (!restoringFocus) show(link);
      },
      { signal },
    );
    link.addEventListener('blur', scheduleClose, { signal });
  }
  rail.addEventListener(
    'pointerleave',
    () => {
      hoverRail();
      scheduleClose();
    },
    { signal },
  );
  panel.addEventListener('pointerenter', () => clearTimeout(closeTimer), {
    signal,
  });
  panel.addEventListener('pointerleave', scheduleClose, { signal });
  panel.addEventListener('focusout', scheduleClose, { signal });
  for (const link of full.querySelectorAll<HTMLAnchorElement>(
    '[data-toc-entry]',
  )) {
    const select = () => highlight(link.dataset.tocEntry!);
    link.addEventListener('pointerenter', select, { signal });
    link.addEventListener('focus', select, { signal });
  }
  const closeAndRestore = () => {
    restoringFocus = true;
    hide();
    (root.dataset.layout === 'compact' ? toggle : anchor)?.focus({
      preventScroll: true,
    });
    restoringFocus = false;
  };
  panel.querySelector('[data-toc-expand]')?.addEventListener(
    'click',
    () => {
      expand();
      full
        .querySelector<HTMLAnchorElement>('[data-toc-highlight], a')
        ?.focus({ preventScroll: true });
    },
    { signal },
  );
  panel
    .querySelector('[data-toc-close]')
    ?.addEventListener('click', closeAndRestore, { signal });
  toggle?.addEventListener(
    'click',
    () => {
      if (panel.matches(':popover-open')) {
        hide();
        return;
      }
      anchor =
        railLinks.find((link) => link.hasAttribute('aria-current')) ??
        railLinks[0];
      if (anchor) highlight(anchor.dataset.tocEntry!);
      preview.hidden = true;
      full.hidden = false;
      panel.style.height = '34px';
      panel.showPopover();
      toggle.setAttribute('aria-expanded', 'true');
      position();
      expand();
    },
    { signal },
  );
  document.addEventListener(
    'pointerdown',
    (event) => {
      if (
        event.target instanceof Node &&
        !root.contains(event.target) &&
        !toggle?.contains(event.target)
      )
        hide();
    },
    { signal },
  );
  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape' && panel.matches(':popover-open'))
        closeAndRestore();
    },
    { signal },
  );
  for (const link of links)
    link.addEventListener(
      'click',
      (event) => {
        if (ignoreClick) {
          event.preventDefault();
          return;
        }
        hide();
      },
      { signal },
    );
  const update = () => {
    frame = 0;
    const starts = sections.map(
      (section) => section.getBoundingClientRect().top,
    );
    let current = sections[0];
    for (let index = 0; index < sections.length; index++) {
      if (starts[index] <= 130) current = sections[index];
      else break;
    }
    const contentEnd =
      document.querySelector('.article-content')?.getBoundingClientRect()
        .bottom ?? innerHeight;
    const visible = visibleSections(
      starts,
      contentEnd,
      Math.max(
        0,
        document.querySelector('.topbar')?.getBoundingClientRect().bottom ?? 0,
      ),
      innerHeight,
    );
    for (const link of links) {
      if (link.dataset.tocEntry === current?.id)
        link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
      link.toggleAttribute(
        'data-toc-visible',
        visible.some((index) => sections[index].id === link.dataset.tocEntry),
      );
    }
    const range = full.querySelector<HTMLElement>('[data-toc-visible-range]')!;
    const visibleLinks = [
      ...full.querySelectorAll<HTMLElement>('a[data-toc-visible]'),
    ];
    range.hidden = !visibleLinks.length;
    if (visibleLinks.length) {
      const first = visibleLinks[0],
        last = visibleLinks.at(-1)!;
      range.style.top = `${first.offsetTop - 2}px`;
      range.style.height = `${last.offsetTop + last.offsetHeight - first.offsetTop + 4}px`;
    }
  };
  const scrub = (x: number, y: number) => {
    const link = document
      .elementFromPoint(x, y)
      ?.closest<HTMLAnchorElement>('a[data-toc-entry]');
    if (!link || !root.contains(link)) return;
    const railLink = railLinks.find(
      (entry) => entry.dataset.tocEntry === link.dataset.tocEntry,
    );
    if (railLink) {
      if (rail.contains(link)) hoverRail(railLink);
      else hoverRail();
      show(railLink);
    }
    const section = document.getElementById(link.dataset.tocEntry!);
    if (section)
      window.scrollTo({
        top: window.scrollY + section.getBoundingClientRect().top - 96,
        behavior: 'instant',
      });
  };
  for (const surface of [rail, full]) {
    surface.addEventListener('dragstart', (event) => event.preventDefault(), {
      signal,
    });
    surface.addEventListener('contextmenu', (event) => event.preventDefault(), {
      signal,
    });
    surface.addEventListener(
      'pointerdown',
      (event) => {
        if (
          event.button !== 0 ||
          !(event.target as Element).closest('a[data-toc-entry]')
        )
          return;
        event.preventDefault();
        clearTimeout(closeTimer);
        dwell.cancel();
        dragging = {
          pointer: event.pointerId,
          element: surface,
          x: event.clientX,
          y: event.clientY,
          moved: false,
        };
        surface.setPointerCapture(event.pointerId);
        scrub(event.clientX, event.clientY);
      },
      { signal },
    );
    surface.addEventListener(
      'pointermove',
      (event) => {
        if (!dragging || dragging.pointer !== event.pointerId) return;
        dragging.moved ||=
          Math.hypot(event.clientX - dragging.x, event.clientY - dragging.y) >
          3;
        scrub(event.clientX, event.clientY);
        dwell.cancel();
      },
      { signal },
    );
    const stop = () => {
      if (!dragging) return;
      ignoreClick = dragging.moved;
      if (surface.hasPointerCapture(dragging.pointer))
        surface.releasePointerCapture(dragging.pointer);
      dragging = undefined;
      scheduleClose();
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        ignoreClick = false;
      }, 0);
    };
    surface.addEventListener('pointerup', stop, { signal });
    surface.addEventListener('pointercancel', stop, { signal });
  }
  const scroll = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  window.addEventListener('scroll', scroll, { passive: true, signal });
  const resize = () => {
    const useRail =
      innerWidth >= 1000 && (main?.getBoundingClientRect().width ?? 0) >= 660;
    const layout = useRail ? 'rail' : 'compact';
    if (root.dataset.layout !== layout) hide();
    root.dataset.layout = layout;
    if (main) main.dataset.tocLayout = layout;
    if (toggle) toggle.hidden = useRail;
    if (expanded) fitExpanded();
    else position();
    update();
  };
  const observer = new ResizeObserver(resize);
  if (main) observer.observe(main);
  window.addEventListener('resize', resize, { signal });
  resize();
  update();
  dispose = () => {
    hide();
    clearTimeout(clickTimer);
    controller.abort();
    observer.disconnect();
    cancelAnimationFrame(frame);
  };
});
