// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    // @ts-expect-error - Tailwind plugin returns an array of plugins which conflicts with Astro Vite PluginOption
    plugins: [tailwindcss()],
  },
});
