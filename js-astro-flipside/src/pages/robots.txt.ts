import type { APIRoute } from "astro";
import { url } from "@/utils/url";

// url() prepends the configured base (see BaseHead.astro's identical
// sitemap <link>) — plain `new URL("sitemap-index.xml", site)` drops it,
// producing a dead link once the site is deployed under a base path.
export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${new URL(url("/sitemap-index.xml"), site)}\n`,
  );
