/**
 * Copy buttons under `root` (those matching `selector`): a click copies the
 * text of the <pre> right before the button, and the button shows `copied`
 * for 1.5 s before its own label returns.
 */
export function copyButtons(root: HTMLElement, selector: string, copied: string) {
  const labels = new WeakMap<HTMLButtonElement, string>();
  // One reset timer per button, so a second click restarts the 1.5 s.
  const timers = new WeakMap<HTMLButtonElement, ReturnType<typeof setTimeout>>();
  root.addEventListener('click', async (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>(selector);
    const pre = button?.previousElementSibling;
    if (!button || !pre) return;
    // No clipboard (insecure origin) or no permission: leave the label as is.
    try {
      if (!navigator.clipboard) return;
      await navigator.clipboard.writeText(pre.textContent ?? '');
    } catch {
      return;
    }
    if (!labels.has(button)) labels.set(button, button.innerHTML);
    button.textContent = copied;
    clearTimeout(timers.get(button));
    timers.set(button, setTimeout(() => (button.innerHTML = labels.get(button)!), 1500));
  });
}
