interface TunnelStar {
  angle: number;
  radius: number;
  depth: number;
}

export function mountWormholeTransition(): void {
  const overlay = document.querySelector<HTMLElement>(
    "[data-wormhole-transition]",
  );
  if (!overlay) return;
  const canvas = overlay.querySelector<HTMLCanvasElement>(
    ".wormhole-overlay__canvas",
  );
  const skip = overlay.querySelector<HTMLButtonElement>(
    ".wormhole-overlay__skip",
  );
  const context = canvas?.getContext("2d");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  let destination = "";
  let timer: number | undefined;
  let frame = 0;
  let stars: TunnelStar[] = [];
  let selectedLink: HTMLAnchorElement | undefined;

  const finish = () => {
    if (timer !== undefined) window.clearTimeout(timer);
    cancelAnimationFrame(frame);
    selectedLink?.classList.remove("is-transitioning");
    if (destination) window.location.assign(destination);
  };
  const draw = (start: number) => {
    if (!canvas || !context) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const cx = width / 2;
    const cy = height / 2;
    canvas.width = width * Math.min(window.devicePixelRatio || 1, 2);
    canvas.height = height * Math.min(window.devicePixelRatio || 1, 2);
    context.setTransform(
      canvas.width / width,
      0,
      0,
      canvas.height / height,
      0,
      0,
    );
    const elapsed = Math.min(1, (performance.now() - start) / 1200);
    context.fillStyle = "#010208";
    context.fillRect(0, 0, width, height);
    for (const star of stars) {
      const depth = Math.max(0.01, star.depth - elapsed * 1.2);
      const radius = star.radius / depth;
      const x = cx + Math.cos(star.angle) * radius;
      const y = cy + Math.sin(star.angle) * radius;
      const previous = star.radius / Math.max(0.01, depth + 0.08);
      context.strokeStyle = `rgba(190, 213, 255, ${Math.min(1, elapsed + 0.15)})`;
      context.lineWidth = 1 + elapsed * 2;
      context.beginPath();
      context.moveTo(
        cx + Math.cos(star.angle) * previous,
        cy + Math.sin(star.angle) * previous,
      );
      context.lineTo(x, y);
      context.stroke();
    }
    context.strokeStyle = "rgba(131, 165, 255, .8)";
    context.lineWidth = 1;
    context.beginPath();
    context.ellipse(
      cx,
      cy,
      Math.min(width, height) * (0.1 + elapsed * 0.6),
      Math.min(width, height) * (0.025 + elapsed * 0.16),
      0,
      0,
      Math.PI * 2,
    );
    context.stroke();
    if (elapsed < 1) frame = requestAnimationFrame(() => draw(start));
  };
  function begin(event: MouseEvent) {
    const target = event.target as Element;
    const link = target.closest<HTMLAnchorElement>("a[data-wormhole-link]");
    if (!link || !link.href || link.target === "_blank") return;
    event.preventDefault();
    destination = link.href;
    selectedLink = link;
    link.classList.add("is-transitioning");
    if (reducedMotion) {
      finish();
      return;
    }
    overlay!.removeAttribute("aria-hidden");
    overlay!.removeAttribute("inert");
    overlay!.classList.add("is-active");
    stars = Array.from({ length: 180 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: Math.random() * Math.min(innerWidth, innerHeight) * 0.7 + 10,
      depth: Math.random(),
    }));
    draw(performance.now());
    skip?.focus({ preventScroll: true });
    timer = window.setTimeout(finish, 1250);
  }
  document.addEventListener("click", begin);
  skip?.addEventListener("click", finish);
}
