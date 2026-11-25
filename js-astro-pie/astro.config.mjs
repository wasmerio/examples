// @ts-check
import { defineConfig } from "astro/config";
import alpinejs from "@astrojs/alpinejs";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import playformInline from "@playform/inline";

// https://astro.build/config
export default defineConfig({
    site: "https://astropie.netlify.app",
    base: "/",
    // trailingSlash: 'always',
    integrations: [alpinejs(), mdx(), (await import("@playform/inline")).default()],
    output: "static",
    devToolbar: {
        enabled: false,
    },
    vite: {
        plugins: [tailwindcss()],
    },
});