/** Shared lightbox wiring: every element matching `selector` opens the
 *  <dialog> named by its data-modal attribute. Kept in one place so the
 *  trophy wall (Cards.astro) and the gallery can't drift apart.
 *  getElementById, not querySelector — a modal id built from a CJK title
 *  has no CSS-selector-escaping guarantee. Closing stays local to each
 *  caller: the ts-modal box and the full-viewport gallery stage have
 *  genuinely different backdrop semantics. */
export function wireModalOpeners(selector: string) {
  document.querySelectorAll<HTMLElement>(selector).forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal =
        btn.dataset.modal && document.getElementById(btn.dataset.modal);
      if (modal instanceof HTMLDialogElement) modal.showModal();
    });
  });
}
