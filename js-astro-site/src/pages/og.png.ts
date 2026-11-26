import type { APIRoute } from "astro";
import { useSiteOgImage } from "@/utils/useOgImages";

export const GET: APIRoute = async () =>
  new Response(await useSiteOgImage(), {
    headers: { "Content-Type": "image/png" },
  });
