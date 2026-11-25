// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://astro-scifi-ui.netlify.app/",
  vite: {
    plugins: [tailwindcss()],
    /** TensorFlow.js pulls many submodules; avoid SSR touching them and help Vite chunk resolution. */
    ssr: {
      external: ["@tensorflow/tfjs", "@tensorflow-models/coco-ssd"],
    },
    optimizeDeps: {
      include: ["@tensorflow/tfjs", "@tensorflow-models/coco-ssd"],
    },
  },

  integrations: [react()],
});
