
import { defineConfig } from 'astro/config';

/* import data from "./OpenLinks.json"; */


import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  }
});