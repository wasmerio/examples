/**
 * Used by `Video.astro`'s inline script, `editor-live-sync.js` (inline scripts
 * don't run in the editor) and `VideoElements.astro` on preview shells that
 * inject the tags without Video.astro.
 */

function containsSelector(root: ParentNode, selector: string): boolean {
  return (
    (root instanceof Element && root.matches(selector)) || Boolean(root.querySelector?.(selector))
  );
}

const facadeLoaded = { vimeo: false, youtube: false };

function defineUsedVideoElements(root: ParentNode = document): void {
  if (!facadeLoaded.vimeo && containsSelector(root, "lite-vimeo")) {
    facadeLoaded.vimeo = true;
    void import("@choctawnationofoklahoma/lite-vimeo");
  }

  if (!facadeLoaded.youtube && containsSelector(root, "lite-youtube")) {
    facadeLoaded.youtube = true;
    void import("@justinribeiro/lite-youtube");
  }
}

/**
 * Must run before `defineUsedVideoElements`: the custom elements' attributes
 * can only change while the facade library is unimported.
 */
function disarmHostedAutoplay(root: ParentNode = document): void {
  const scope = (selector: string) => [
    ...(root instanceof Element && root.matches(selector) ? [root] : []),
    ...Array.from(root.querySelectorAll(selector)),
  ];

  scope("lite-vimeo[autoload], lite-youtube[autoplay]").forEach((embed) => {
    embed.removeAttribute("autoload");
    embed.removeAttribute("autoplay");
  });

  scope('iframe.video-embed[src*="autoplay=1"]').forEach((embed) => {
    const iframe = embed as HTMLIFrameElement;

    iframe.src = iframe.src.replace("autoplay=1", "autoplay=0");
  });
}

function isBroken(video: HTMLVideoElement) {
  return (
    Boolean(video.error) ||
    video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE ||
    (video.paused && video.readyState === HTMLMediaElement.HAVE_NOTHING)
  );
}

function repairAndPlay(video: HTMLVideoElement) {
  // load() alone isn't enough in Firefox: <source> nodes can carry a failed
  // selection over from the view-transition swap, so replace them first.
  video.querySelectorAll("source").forEach((source) => {
    const fresh = document.createElement("source");

    fresh.src = source.src;
    fresh.type = source.type;
    source.replaceWith(fresh);
  });

  video.load();
  video.play().catch(() => {});
}

function tryPlay(video: HTMLVideoElement) {
  video.play().catch(() => {});

  // Repair only on confirmed failure: an unconditional load() aborts a load
  // still in flight (Chrome), yet Firefox can stick without setting video.error.
  if (isBroken(video)) {
    repairAndPlay(video);
    return;
  }

  setTimeout(() => {
    if (isBroken(video)) repairAndPlay(video);
  }, 2000);
}

function playAutoplayVideos(root: ParentNode = document) {
  // This repair calls play() directly, which the global reduced-motion CSS
  // reset cannot reach — a visitor who asked for no motion gets no autoplay.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Not scoped under ".video": that class sits on the <video> itself except in
  // the background variant, so a descendant selector silently misses the rest.
  const videos = [
    ...(root instanceof Element && root.matches("video[autoplay]")
      ? [root as HTMLVideoElement]
      : []),
    ...Array.from(root.querySelectorAll<HTMLVideoElement>("video[autoplay]")),
  ].filter((video) => !video.hasAttribute("data-video-autoplay-initialized"));

  if (!videos.length) return;

  // Deferred to scroll-into-view so the swapped-in element has settled first.
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const video = entry.target as HTMLVideoElement;

        if (video.paused) tryPlay(video);
        obs.unobserve(video);
      });
    },
    { threshold: 0.1 }
  );

  videos.forEach((video) => {
    video.setAttribute("data-video-autoplay-initialized", "");
    observer.observe(video);
  });
}

export function setupAllVideos(root: ParentNode = document): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    disarmHostedAutoplay(root);
  }

  defineUsedVideoElements(root);
  playAutoplayVideos(root);
}
