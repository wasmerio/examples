import { defineConfig } from "astro/config";
import { SITE } from "./src/consts.ts";

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  prefetch: true,
});
