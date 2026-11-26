/*
 * Every scroll and pointer effect on the site. Each one looks for its data
 * attribute and does nothing when the page has none. Under reduced motion only
 * the clocks and the reel's first frame run.
 */

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const all = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T & Element>(selector)) as T[];

/* ---------- Live clocks ---------- */

for (const el of all<HTMLTimeElement>("[data-clock]")) {
  const format = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: el.dataset.clock,
  });
  const tick = () => (el.textContent = format.format(new Date()));
  tick();
  window.setInterval(tick, 20_000);
}

/* ---------- Shared-element page transition ---------- */

/* Only the clicked card carries the name, so its frame alone morphs into the next page. */
document.addEventListener("click", (event) => {
  const link = (event.target as Element).closest("a");
  const image = link?.querySelector<HTMLElement>("[data-vt]");
  if (image) image.style.viewTransitionName = image.dataset.vt ?? "";
});

/* ---------- Header: hides going down, returns going up ---------- */

const header = document.querySelector<HTMLElement>("[data-header]");
let lastY = window.scrollY;

/* Light text over images and dark or deep-coloured sections, dark text elsewhere. */
const toneUnderHeader = () => {
  if (!header) return;
  const y = header.offsetHeight / 2;
  const below = document
    .elementsFromPoint(window.innerWidth / 2, y)
    .find((el) => !header.contains(el));
  const surface = below?.closest("[data-tone], .on-ink, .ink-light, .ink-dark, .media, img");
  const tone =
    surface instanceof HTMLElement && surface.dataset.tone
      ? surface.dataset.tone
      : surface?.matches(".on-ink, .ink-light, .media, img")
        ? "dark"
        : "light";
  header.dataset.tone = tone;
  /* The bar takes the colour of the section below; over images it falls back to the tone. */
  let paint = "";
  const overImage = surface?.matches(".media, img");
  for (let el: Element | null | undefined = below; el && !overImage; el = el.parentElement) {
    const color = getComputedStyle(el).backgroundColor;
    if (color !== "rgba(0, 0, 0, 0)" && color !== "transparent") {
      paint = color;
      break;
    }
  }
  header.style.setProperty("--surface", paint || "var(--bg)");
};

let toneQueued = false;
window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    if (header && Math.abs(y - lastY) > 4) {
      header.toggleAttribute("data-hidden", y > lastY && y > 240);
      lastY = y;
    }
    if (!toneQueued) {
      toneQueued = true;
      requestAnimationFrame(() => {
        toneQueued = false;
        toneUnderHeader();
      });
    }
  },
  { passive: true },
);
window.addEventListener("resize", toneUnderHeader);
toneUnderHeader();

/* ---------- Reel: cycles through stacked images ---------- */

for (const reel of all("[data-reel]")) {
  const frames = all("[data-frame]", reel);
  const labels = all("[data-frame-label]", reel);
  if (frames.length < 2 || reduce) continue;
  let index = 0;
  let visible = false;
  new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(reel);
  window.setInterval(
    () => {
      if (!visible || document.hidden) return;
      frames[index].removeAttribute("data-active");
      labels[index]?.removeAttribute("data-active");
      index = (index + 1) % frames.length;
      frames[index].setAttribute("data-active", "");
      labels[index]?.setAttribute("data-active", "");
    },
    Number(reel.dataset.reel) || 1400,
  );
}

if (!reduce) {
  /* ---------- Scroll-linked effects, batched into one frame ---------- */

  type Updater = (vh: number) => void;
  const updaters: Updater[] = [];

  /* A block that grows from an inset card to full bleed as it scrolls in. */
  for (const el of all("[data-expand]")) {
    updaters.push((vh) => {
      const rect = el.getBoundingClientRect();
      const p = clamp(1 - (rect.top - vh * 0.1) / (vh * 0.75));
      el.style.setProperty("--p", p.toFixed(4));
    });
  }

  /* Words that light up one by one as the paragraph crosses the screen. */
  for (const el of all("[data-words]")) {
    updaters.push((vh) => {
      const rect = el.getBoundingClientRect();
      const p = clamp((vh * 0.85 - rect.top) / (rect.height + vh * 0.35));
      el.style.setProperty("--p", p.toFixed(4));
    });
  }

  let queued = false;
  const run = () => {
    queued = false;
    const vh = window.innerHeight;
    for (const update of updaters) update(vh);
  };
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(run);
  };
  if (updaters.length) {
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    run();
  }

  /* ---------- Marquee: drifts on its own, speeds up and turns with the scroll ---------- */

  for (const marquee of all("[data-marquee]")) {
    const track = marquee.querySelector<HTMLElement>("[data-marquee-track]");
    if (!track) continue;
    let x = 0;
    let direction = 1;
    let boost = 0;
    let visible = false;
    let previous = window.scrollY;
    new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(marquee);
    window.addEventListener(
      "scroll",
      () => {
        const delta = window.scrollY - previous;
        previous = window.scrollY;
        if (delta !== 0) direction = delta > 0 ? 1 : -1;
        boost = Math.min(boost + Math.abs(delta) * 0.08, 14);
      },
      { passive: true },
    );
    const frame = () => {
      if (visible) {
        const half = track.scrollWidth / 2;
        x -= (0.6 + boost) * direction;
        if (x <= -half) x += half;
        if (x > 0) x -= half;
        track.style.transform = `translate3d(${x}px,0,0)`;
        boost *= 0.92;
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  /* ---------- Numbers that count up once ---------- */

  const counter = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        counter.unobserve(entry.target);
        const el = entry.target as HTMLElement;
        const target = Number(el.dataset.count);
        const start = performance.now();
        const step = (now: number) => {
          const t = clamp((now - start) / 1800);
          el.textContent = String(Math.round(target * (1 - Math.pow(2, -10 * t))));
          if (t < 1) requestAnimationFrame(step);
          else el.textContent = String(target);
        };
        el.textContent = "0";
        requestAnimationFrame(step);
      }
    },
    { threshold: 0.6 },
  );
  all("[data-count]").forEach((el) => counter.observe(el));
}

if (!reduce && finePointer) {
  /* ---------- An image that trails the pointer over a list ---------- */

  for (const list of all("[data-follow]")) {
    const float = list.querySelector<HTMLElement>("[data-follow-float]");
    if (!float) continue;
    const images = all("[data-follow-image]", float);
    let fx = 0;
    let fy = 0;
    let tx = 0;
    let ty = 0;
    let vx = 0;
    let active = false;
    list.addEventListener("pointermove", (event) => {
      const rect = list.getBoundingClientRect();
      tx = event.clientX - rect.left;
      ty = event.clientY - rect.top;
      if (!active) {
        fx = tx;
        fy = ty;
      }
      const item = (event.target as Element).closest<HTMLElement>("[data-follow-key]");
      active = Boolean(item);
      float.toggleAttribute("data-active", active);
      if (item) {
        for (const image of images) {
          image.toggleAttribute(
            "data-active",
            image.dataset.followImage === item.dataset.followKey,
          );
        }
      }
    });
    list.addEventListener("pointerleave", () => {
      active = false;
      float.removeAttribute("data-active");
    });
    const frame = () => {
      const nx = lerp(fx, tx, 0.14);
      vx = lerp(vx, nx - fx, 0.2);
      fx = nx;
      fy = lerp(fy, ty, 0.14);
      float.style.transform = `translate3d(${fx}px, ${fy}px, 0) translate(-50%, -50%) rotate(${clamp(vx * 0.6, -12, 12)}deg)`;
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
}
