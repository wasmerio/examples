type InitCallback = () => void;

/** Runs on first load and each Astro navigation, once per URL. */
export function onPageLoad(init: InitCallback): void {
  let lastUrl = "";

  const run = () => {
    const currentUrl = window.location.href;

    if (currentUrl === lastUrl) return;
    lastUrl = currentUrl;
    init();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }

  document.addEventListener("astro:page-load", run);
}
