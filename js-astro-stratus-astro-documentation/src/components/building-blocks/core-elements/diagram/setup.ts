/**
 * Client-side only: Mermaid needs a DOM, so a build-time render would mean a
 * headless browser in the build. Keep the import dynamic — the library is large.
 */
let mermaidPromise: Promise<typeof import("mermaid").default> | undefined;
let themeWatcherBound = false;

function loadMermaid() {
  mermaidPromise ??= import("mermaid").then((module) => module.default);

  return mermaidPromise;
}

/** Mermaid ignores the site theme unless handed its tokens. */
function themeVariables(): Record<string, string> {
  const styles = getComputedStyle(document.documentElement);
  const token = (name: string) => styles.getPropertyValue(name).trim();

  return {
    background: token("--color-bg-surface"),
    primaryColor: token("--color-bg"),
    primaryTextColor: token("--color-text"),
    primaryBorderColor: token("--color-border-strong"),
    secondaryColor: token("--color-bg-muted"),
    secondaryTextColor: token("--color-text"),
    secondaryBorderColor: token("--color-border-strong"),
    tertiaryColor: token("--color-bg-muted"),
    tertiaryTextColor: token("--color-text"),
    tertiaryBorderColor: token("--color-border-strong"),
    lineColor: token("--color-accent"),
    textColor: token("--color-text"),
    mainBkg: token("--color-bg"),
    nodeBorder: token("--color-border-strong"),
    clusterBkg: token("--color-bg-surface"),
    clusterBorder: token("--color-border"),
    edgeLabelBackground: token("--color-bg-surface"),
    fontFamily: styles.getPropertyValue("--font-body").trim() || "system-ui, sans-serif",
    fontSize: "14px",
  };
}

async function render(root: HTMLElement): Promise<void> {
  const source = root.querySelector<HTMLElement>("[data-diagram-source]");
  const target = root.querySelector<HTMLElement>("[data-diagram-output]");
  const definition = source?.textContent ?? "";

  if (!source || !target || !definition.trim()) return;

  try {
    const mermaid = await loadMermaid();

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "base",
      themeVariables: themeVariables(),
    });

    const id = `diagram-${Math.random().toString(36).slice(2, 10)}`;
    const { svg } = await mermaid.render(id, definition);

    target.innerHTML = svg;
    root.setAttribute("data-diagram-rendered", "");
  } catch {
    // A parse error leaves the source visible rather than an empty box.
    root.removeAttribute("data-diagram-rendered");
  }
}

/** Re-render on a theme flip: the SVG bakes its colors in at render time. */
function watchTheme(): void {
  if (themeWatcherBound) return;
  themeWatcherBound = true;

  new MutationObserver(() => {
    document
      .querySelectorAll<HTMLElement>(".diagram[data-diagram-rendered]")
      .forEach((el) => void render(el));
  }).observe(document.documentElement, { attributeFilter: ["data-theme"] });
}

const nearViewport =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            void render(entry.target as HTMLElement);
          });
        },
        { rootMargin: "50%" }
      )
    : undefined;

/** Renders once the diagram nears the viewport, so Mermaid stays off the critical path. */
export async function setupDiagram(root: HTMLElement): Promise<void> {
  if (root.hasAttribute("data-diagram-initialized")) return;
  root.setAttribute("data-diagram-initialized", "");

  watchTheme();
  if (nearViewport) nearViewport.observe(root);
  else await render(root);
}

export function setupAllDiagrams(): void {
  document.querySelectorAll<HTMLElement>(".diagram").forEach((el) => void setupDiagram(el));
}
