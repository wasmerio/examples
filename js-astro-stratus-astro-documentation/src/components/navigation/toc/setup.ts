// Also registered in `editor-live-sync.js`.

export function setupToc(toc: HTMLElement): void {
  if (toc.hasAttribute("data-toc-initialized")) return;
  toc.setAttribute("data-toc-initialized", "");

  const links = Array.from(toc.querySelectorAll<HTMLAnchorElement>(".toc-sidebar a[href^='#']"));

  if (!links.length) return;

  const linkById = new Map<string, HTMLAnchorElement>();

  for (const link of links) {
    linkById.set(decodeURIComponent(link.hash.slice(1)), link);
  }

  const headings = [...linkById.keys()]
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => Boolean(el));

  if (!headings.length) return;

  let activeLink: HTMLAnchorElement | null = null;

  const setActive = (id: string) => {
    const link = linkById.get(id);

    if (!link || link === activeLink) return;

    activeLink?.removeAttribute("aria-current");
    link.setAttribute("aria-current", "true");
    activeLink = link;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible[0]) setActive(visible[0].target.id);
    },
    { rootMargin: "0px 0px -66% 0px" }
  );

  headings.forEach((heading) => observer.observe(heading));
}

export function setupAllTocs(): void {
  document.querySelectorAll<HTMLElement>(".toc").forEach(setupToc);
}
