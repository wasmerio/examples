import { lifecycle } from '@/scripts/core/lifecycle';
import { modalSession } from '@/scripts/core/modal';

export function initToc() {
  const panel = document.getElementById('card-toc');
  const content = document.getElementById('toc-content');
  if (!panel || !content) return;
  const links = Array.from(
    panel.querySelectorAll<HTMLAnchorElement>('.toc-link'),
  );
  const entries = links.flatMap((link) => {
    try {
      const heading = document.getElementById(
        decodeURIComponent(link.hash.slice(1)),
      );
      return heading ? [{ link, heading }] : [];
    } catch {
      return [];
    }
  });
  if (!entries.length) return;
  const toggles = document.querySelectorAll<HTMLElement>(
    '[data-solitude-toc-toggle]',
  );
  const compact = matchMedia('(max-width: 1200px)');
  const placeholder = document.createComment('Solitude TOC position');
  panel.before(placeholder);
  const mask = document.createElement('div');
  mask.id = 'toc-mask';
  mask.hidden = true;
  document.body.append(mask);
  let opened = false;
  let release: ReturnType<typeof modalSession> | undefined;
  const close = (restoreFocus = true) => {
    if (!opened) return;
    opened = false;
    panel.classList.remove('open');
    mask.hidden = true;
    document.documentElement.classList.remove('toc-open');
    toggles.forEach((button) => button.setAttribute('aria-expanded', 'false'));
    release?.(restoreFocus);
    release = undefined;
    panel.inert = compact.matches;
  };
  const open = (event: Event) => {
    const trigger =
      event.currentTarget instanceof HTMLElement
        ? event.currentTarget
        : undefined;
    if (!compact.matches) return;
    if (opened) {
      close();
      return;
    }
    opened = true;
    panel.inert = false;
    panel.classList.add('open');
    mask.hidden = false;
    document.documentElement.classList.add('toc-open');
    toggles.forEach((button) => button.setAttribute('aria-expanded', 'true'));
    release = modalSession(panel, () => close(), [mask], trigger);
    const current =
      panel.querySelector<HTMLElement>('[aria-current="location"]') ??
      entries[0].link;
    current.focus({ preventScroll: true });
    requestAnimationFrame(() => {
      if (opened && panel.isConnected) current.focus({ preventScroll: true });
    });
    const relativeTop =
      current.getBoundingClientRect().top - content.getBoundingClientRect().top;
    content.scrollTop += relativeTop - content.clientHeight / 2;
  };
  const syncLayout = () => {
    close(false);
    panel.inert = compact.matches;
    if (compact.matches) {
      document.body.append(panel);
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'true');
      panel.setAttribute('aria-labelledby', 'toc-title');
    } else {
      placeholder.after(panel);
      panel.removeAttribute('role');
      panel.removeAttribute('aria-modal');
      panel.removeAttribute('aria-labelledby');
    }
  };
  let active: HTMLAnchorElement | undefined;
  const update = () => {
    const offset =
      (document.getElementById('nav')?.getBoundingClientRect().height ?? 60) +
      24;
    const current =
      entries
        .filter((entry) => entry.heading.getBoundingClientRect().top <= offset)
        .at(-1) ?? entries[0];
    if (active === current.link) return;
    active = current.link;
    panel
      .querySelectorAll<HTMLElement>('.active')
      .forEach((el) => el.classList.remove('active'));
    links.forEach((link) => link.removeAttribute('aria-current'));
    active.classList.add('active');
    active.setAttribute('aria-current', 'location');
    let ancestor = active.parentElement;
    while (ancestor && ancestor !== content) {
      ancestor.classList.add('active');
      ancestor = ancestor.parentElement;
    }
    if (!compact.matches || opened) {
      const top =
        active.getBoundingClientRect().top -
        content.getBoundingClientRect().top;
      if (top < 0 || top > content.clientHeight - active.offsetHeight)
        content.scrollTop += top - content.clientHeight / 2;
    }
  };
  let frame = 0;
  lifecycle.listen(
    window,
    'scroll',
    () => {
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          update();
        });
    },
    { passive: true },
  );
  lifecycle.listen(panel, 'click', (event) => {
    const link =
      event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>('.toc-link')
        : null;
    const entry = entries.find((item) => item.link === link);
    if (!entry) return;
    event.preventDefault();
    close();
    const offset =
      (document.getElementById('nav')?.getBoundingClientRect().height ?? 60) +
      16;
    history.replaceState(history.state, '', entry.link.hash);
    window.scrollTo({
      top: window.scrollY + entry.heading.getBoundingClientRect().top - offset,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
    update();
  });
  toggles.forEach((button) => lifecycle.listen(button, 'click', open));
  lifecycle.listen(
    panel.querySelector<HTMLElement>('.toc-close'),
    'click',
    () => close(),
  );
  lifecycle.listen(mask, 'click', () => close());
  lifecycle.listen(compact, 'change', syncLayout);
  lifecycle.add(() => {
    close(false);
    cancelAnimationFrame(frame);
    panel.inert = false;
    if (placeholder.isConnected) placeholder.replaceWith(panel);
    mask.remove();
  });
  syncLayout();
  update();
}
