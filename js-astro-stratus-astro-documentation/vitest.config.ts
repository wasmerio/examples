import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
    alias: {
      // `astro:assets` only exists inside Astro's Vite pipeline.
      "astro:assets": new URL("./tests/unit/stubs/astro-assets.ts", import.meta.url).pathname,
      // Mirrors tsconfig `paths`, which Vitest doesn't read.
      "@utils": new URL("./src/utils", import.meta.url).pathname,
      "@component-utils": new URL("./src/components/utils", import.meta.url).pathname,
    },
  },
});
