function initBookLanding() {
  const shell = document.querySelector<HTMLElement>(".book-landing-shell");
  if (shell?.dataset.bookLandingInitialized !== undefined) return;
  if (shell) shell.dataset.bookLandingInitialized = "";

  const controller = new AbortController();
  const { signal } = controller;
  const frame = document.querySelector<HTMLIFrameElement>(
    "[data-book-wormhole-frame]",
  );

  const hideVendorContent = () => {
    if (!frame) return;

    try {
      const frameDocument = frame.contentDocument;
      if (!frameDocument) return;

      if (!frameDocument.querySelector("style[data-book-landing-cleanup]")) {
        const style = frameDocument.createElement("style");
        style.dataset.bookLandingCleanup = "";
        style.textContent = `
          .container.content,
          .stats {
            display: none !important;
            visibility: hidden !important;
          }
        `;
        frameDocument.head.append(style);
      }

      const content =
        frameDocument.querySelector<HTMLElement>(".container.content");
      if (content) {
        content.hidden = true;
        content.inert = true;
        content.setAttribute("aria-hidden", "true");
      }
    } catch {
      // The scene remains a decorative fallback if iframe access is unavailable.
    }
  };

  frame?.addEventListener("load", hideVendorContent, { signal });
  hideVendorContent();

  const dialog = document.querySelector<HTMLDialogElement>(
    "[data-book-dossier]",
  );
  const supportsModalDialog =
    dialog &&
    typeof dialog.showModal === "function" &&
    typeof dialog.close === "function";

  if (dialog && supportsModalDialog && !dialog.dataset.dossierEnhanced) {
    const closeButton = dialog.querySelector<HTMLButtonElement>(
      "[data-dossier-close]",
    );
    const openers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-dossier-open]"),
    );
    let activeOpener: HTMLElement | null = null;
    let shellScrollTop = 0;

    dialog.close();
    dialog.dataset.dossierEnhanced = "";
    if (closeButton) closeButton.hidden = false;

    const openDossier = (event: Event) => {
      event.preventDefault();
      const opener = event.currentTarget;
      if (!(opener instanceof HTMLElement) || dialog.open) return;

      activeOpener = opener;
      shellScrollTop = shell?.scrollTop ?? 0;
      dialog.showModal();
      closeButton?.focus({ preventScroll: true });
    };

    const closeDossier = () => {
      if (dialog.open) dialog.close();
    };

    const restoreLanding = () => {
      const opener = activeOpener;
      activeOpener = null;
      opener?.focus({ preventScroll: true });
      if (shell) {
        shell.scrollTop = shellScrollTop;
        requestAnimationFrame(() => {
          shell.scrollTop = shellScrollTop;
        });
      }
    };

    openers.forEach((opener) =>
      opener.addEventListener("click", openDossier, { signal }),
    );
    closeButton?.addEventListener("click", closeDossier, { signal });
    dialog.addEventListener(
      "click",
      (event) => {
        if (event.target === dialog) closeDossier();
      },
      { signal },
    );
    dialog.addEventListener("close", restoreLanding, { signal });
  }

  window.addEventListener(
    "pagehide",
    () => {
      controller.abort();
      if (dialog?.dataset.dossierEnhanced !== undefined) {
        delete dialog.dataset.dossierEnhanced;
      }
      if (shell?.dataset.bookLandingInitialized !== undefined) {
        delete shell.dataset.bookLandingInitialized;
      }
    },
    { once: true },
  );
}

window.addEventListener("pageshow", (event) => {
  if (event.persisted) initBookLanding();
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBookLanding, {
    once: true,
  });
} else {
  initBookLanding();
}
