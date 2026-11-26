import type { APIRoute } from "astro";
import config from "@/config";
import { renderOgImage } from "@/utils/og/renderOg";

export const GET: APIRoute = () =>
  renderOgImage({
    title: config.site.title,
    description: config.site.description,
  });
