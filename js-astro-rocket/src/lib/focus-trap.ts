/**
 * trapFocus — keep Tab / Shift+Tab cycling inside `container`.
 *
 * The standard dialog focus-trap pattern (the same one the theme's Dialog
 * component implements internally): while active, tabbing past the last
 * focusable descendant wraps to the first, and Shift+Tab from the first
 * wraps to the last — so keyboard focus can't walk out behind an open
 * overlay into page content that is visually blocked.
 *
 * Returns a cleanup function that releases the trap. The caller moves focus
 * into the container on open and restores it to the opening control on
 * close; this utility only fences Tab while active.
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function trapFocus(container: HTMLElement): () => void {
  function onKeydown(e: KeyboardEvent): void {
    if (e.key !== 'Tab') return;

    // Query live so dynamically added content (e.g. search results) counts,
    // and skip elements that are currently display:none inside the container.
    const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    const inside = active instanceof Node && container.contains(active);

    if (e.shiftKey) {
      if (!inside || active === first) {
        e.preventDefault();
        last.focus();
      }
    } else if (!inside || active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  document.addEventListener('keydown', onKeydown);
  return () => document.removeEventListener('keydown', onKeydown);
}
