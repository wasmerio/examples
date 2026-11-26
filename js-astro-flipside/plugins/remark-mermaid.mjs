// Escapes for raw HTML text content only — unlike Search.astro's esc(),
// which also escapes into an href attribute. The escape sets differ on
// purpose: do not unify them.
const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Turns ```mermaid fences into a raw <div class="mermaid"> before
// expressive-code's own remark-time processing ever sees them (this plugin
// must run first in remarkPlugins). Mermaid.astro hydrates the div lazily on
// the client; escaping here keeps the source intact as text content until then.
export function remarkMermaid() {
  const walk = (node) => {
    node.children?.forEach((child, i) => {
      if (child.type === "code" && child.lang === "mermaid") {
        node.children[i] = {
          type: "html",
          value: `<div class="mermaid">${esc(child.value)}</div>`,
        };
      } else walk(child);
    });
  };
  return walk;
}
