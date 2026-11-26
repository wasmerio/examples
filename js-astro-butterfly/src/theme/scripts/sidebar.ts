/**
 * Mobile navigation drawer, a native modal <dialog>. `showModal()` makes the rest
 * of the page inert (Tab stays inside), Escape closes it natively, and closing
 * returns focus to the button that opened it.
 */
export function initSidebar() {
  const sidebar = () => document.getElementById('sidebar') as HTMLDialogElement | null;
  const close = () => {
    const s = sidebar();
    if (s?.open) s.close();
  };

  document.addEventListener('click', (e) => {
    const t = e.target as Element;
    if (t.closest('[data-sidebar-open]')) {
      const s = sidebar();
      if (!s || s.open) return;
      s.showModal();
      document.documentElement.style.overflow = 'hidden';
    } else if (t === sidebar() || t.closest('#sidebar a')) {
      close(); // the backdrop targets the dialog itself; links navigate away
    }
  });

  document.addEventListener('close', (e) => {
    if ((e.target as Element).id === 'sidebar') document.documentElement.style.overflow = '';
  }, true);
  document.addEventListener('astro:before-swap', close);
}
