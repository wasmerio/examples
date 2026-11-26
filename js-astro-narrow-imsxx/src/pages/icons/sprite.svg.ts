import type { APIRoute } from "astro"

const icons = import.meta.glob("../../icons/*.svg", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>

function toSymbol(path: string, raw: string): string {
  const name = path
    .split("/")
    .pop()!
    .replace(/\.svg$/, "")
  const content = raw
    .replace(/<svg(\s[^>]*)?>/, `<symbol id="icon-${name}"$1>`)
    .replace(/<\/svg>\s*$/, "</symbol>")
    // Drop the width/height on the root only: the rects and lines inside an
    // icon need their own sizes to keep drawing.
    .replace(/(<symbol id="icon-[^"]*"[^>]*?)\s+width="[^"]*"/, "$1")
    .replace(/(<symbol id="icon-[^"]*"[^>]*?)\s+height="[^"]*"/, "$1")
  return content.trim()
}

export const GET: APIRoute = () => {
  const symbols = Object.entries(icons)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, raw]) => toSymbol(path, raw))
    .join("\n")

  return new Response(
    `<svg xmlns="http://www.w3.org/2000/svg">${symbols}</svg>`,
    {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  )
}
