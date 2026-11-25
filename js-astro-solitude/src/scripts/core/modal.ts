/** Focus and background isolation for theme-owned dialogs. */
export function modalSession(
  panel: HTMLElement,
  dismiss: () => void,
  exceptions: HTMLElement[] = [],
  returnTarget?: HTMLElement,
) {
  const trigger =
    returnTarget ??
    (document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null);
  const inert: [HTMLElement, boolean][] = [];
  let branch: HTMLElement = panel;
  while (branch.parentElement) {
    for (const sibling of branch.parentElement.children) {
      if (
        sibling instanceof HTMLElement &&
        sibling !== branch &&
        !exceptions.includes(sibling)
      ) {
        inert.push([sibling, sibling.inert]);
        sibling.inert = true;
      }
    }
    branch = branch.parentElement;
    if (branch === document.body) break;
  }
  const overflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  const controller = new AbortController();
  const focusables = () =>
    Array.from(
      panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex="0"]',
      ),
    ).filter(
      (el) => el.getClientRects().length && !el.closest('[hidden], [inert]'),
    );
  document.addEventListener(
    'keydown',
    (event) => {
      if (event.isComposing) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        dismiss();
      } else if (event.key === 'Tab') {
        const items = focusables();
        const first = items[0];
        const last = items.at(-1);
        if (!first) {
          event.preventDefault();
          panel.focus();
          return;
        }
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            !panel.contains(document.activeElement))
        ) {
          event.preventDefault();
          last?.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === last ||
            !panel.contains(document.activeElement))
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    },
    { signal: controller.signal },
  );
  let closed = false;
  return (restoreFocus = true) => {
    if (closed) return;
    closed = true;
    controller.abort();
    inert.forEach(([el, value]) => {
      el.inert = value;
    });
    document.body.style.overflow = overflow;
    if (restoreFocus && trigger?.isConnected) {
      trigger.focus({ preventScroll: true });
      // Inert and inherited visibility can settle after the current event.
      requestAnimationFrame(() => {
        if (
          trigger.isConnected &&
          !trigger.closest('[inert]') &&
          (document.activeElement === document.body ||
            panel.contains(document.activeElement))
        ) {
          trigger.focus({ preventScroll: true });
        }
      });
    }
  };
}
