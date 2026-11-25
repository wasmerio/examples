import type { APIRoute } from "astro";

import { SITE } from "../config";
import { renderOgImage } from "../utils/og-image";

/** The preview used by every page that is not an article. */
export const GET: APIRoute = async () => {
  const png = await renderOgImage({
    title: SITE.tagline,
    stamp: SITE.url.replace(/^https?:\/\//, ""),
  });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
