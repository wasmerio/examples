import { t } from '../lib/i18n';
let controller: AbortController | undefined;
function setup() {
  const ui = t(document.body.dataset.locale ?? 'en');
  controller?.abort();
  controller = new AbortController();
  const { signal } = controller;
  const root = document.querySelector<HTMLElement>('[data-share-root]');
  const panel = root?.querySelector<HTMLElement>('[data-share-panel]');
  const trigger = root?.querySelector<HTMLButtonElement>(
    '[data-share-trigger]',
  );
  if (!root || !panel || !trigger) return;
  let timer: ReturnType<typeof setTimeout>;
  let opening = false;
  let closing = false;
  const position = () => {
    const anchor = trigger.getBoundingClientRect();
    const bounds = panel.getBoundingClientRect();
    panel.style.left = `${Math.max(8, Math.min(anchor.right - bounds.width, innerWidth - bounds.width - 8))}px`;
    panel.style.top = `${Math.max(8, anchor.top - bounds.height - 8)}px`;
  };
  const show = () => {
    clearTimeout(timer);
    // Native popovers can focus their first control while showPopover is still running.
    if (opening || closing) return;
    opening = true;
    try {
      if (!panel.matches(':popover-open')) panel.showPopover();
      position();
    } finally {
      opening = false;
    }
  };
  const hide = (restoreFocus = false) => {
    clearTimeout(timer);
    closing = true;
    try {
      if (panel.matches(':popover-open')) panel.hidePopover();
      if (restoreFocus) trigger.focus({ preventScroll: true });
    } finally {
      closing = false;
    }
  };
  const deferClose = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (!root.contains(document.activeElement)) hide();
    }, 180);
  };
  root.addEventListener(
    'pointerenter',
    (event) => {
      if (event.pointerType !== 'touch') show();
    },
    { signal },
  );
  root.addEventListener('pointerleave', deferClose, { signal });
  root.addEventListener('focusin', show, { signal });
  root.addEventListener('focusout', deferClose, { signal });
  let copiedTimer: ReturnType<typeof setTimeout>;
  const label = trigger.querySelector<HTMLElement>('[data-share-label-text]')!;
  const animateLabel = (text: string) => {
    label.textContent = text;
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches)
      label.animate(
        [
          { opacity: 0, transform: 'translateY(4px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 180, easing: 'ease-out' },
      );
  };
  trigger.addEventListener(
    'click',
    async () => {
      try {
        await navigator.clipboard.writeText(root.dataset.shareText ?? '');
        if (signal.aborted) return;
        clearTimeout(copiedTimer);
        animateLabel(root.dataset.shareCopied ?? 'Copied');
        copiedTimer = setTimeout(
          () => animateLabel(root.dataset.shareLabel ?? 'Share'),
          2000,
        );
      } catch {
        if (signal.aborted) return;
        show();
        const input = panel.querySelector<HTMLInputElement>('input')!;
        input.value = root.dataset.shareText ?? input.value;
        input.focus();
        input.select();
        panel.querySelector<HTMLElement>('[data-share-message]')!.textContent =
          ui.manualShareCopy;
      }
    },
    { signal },
  );
  document.addEventListener(
    'pointerdown',
    (event) => {
      if (!root.contains(event.target as Node)) hide();
    },
    { signal },
  );
  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape' && panel.matches(':popover-open')) {
        event.preventDefault();
        hide(true);
      }
    },
    { signal },
  );
  panel.addEventListener(
    'toggle',
    () => {
      trigger.setAttribute(
        'aria-expanded',
        String(panel.matches(':popover-open')),
      );
    },
    { signal },
  );
  panel.querySelector('img')?.addEventListener(
    'load',
    () => {
      if (panel.matches(':popover-open')) position();
    },
    { signal },
  );
  window.addEventListener('resize', position, { signal });
  document.addEventListener(
    'scroll',
    () => {
      if (panel.matches(':popover-open')) position();
    },
    { signal, capture: true },
  );
  panel.querySelector('[data-share-copy]')?.addEventListener(
    'click',
    async () => {
      const input = panel.querySelector<HTMLInputElement>('input')!;
      const message = panel.querySelector<HTMLElement>('[data-share-message]')!;
      try {
        await navigator.clipboard.writeText(input.value);
        if (signal.aborted) return;
        message.textContent = ui.linkCopied;
      } catch {
        if (signal.aborted) return;
        input.focus();
        input.select();
        message.textContent = ui.manualLinkCopy;
      }
    },
    { signal },
  );
  signal.addEventListener(
    'abort',
    () => {
      clearTimeout(copiedTimer);
      hide();
    },
    { once: true },
  );
}
document.addEventListener('astro:before-swap', () => controller?.abort());
document.addEventListener('astro:page-load', setup);
