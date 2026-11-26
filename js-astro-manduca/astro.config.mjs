// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [icon()],
  build: {
    relative: true,
    inlineStylesheets: 'auto',
    assets: '_astro'
  },
  fonts: [{
    provider: fontProviders.local(),
    name: "Inter",
    cssVariable: "--font-inter",
    styles: ["normal"],
    formats: ["woff2"],
    fallbacks: ["sans-serif"],
    options: {
      variants: [{
        src: ['./src/assets/fonts/InterVariable.woff2'],
        weight: '100 700',
        style: 'normal'
      },
      {
        src: ['./src/assets/fonts/InterVariable-Italic.woff2'],
        weight: '100 700',
        style: 'italic'
      }]
    }
  }]
});
