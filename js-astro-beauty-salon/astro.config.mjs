import node from '@astrojs/node';
// astro.config.mjs
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

export default defineConfig({
  // URL de tu sitio web
  site: 'https://beauty-template.demo',

  // ¡ESTA LÍNEA ES LA CLAVE!
  integrations: [tailwind(), react(), sitemap()],

  adapter: node({ mode: 'standalone' }),

  // 'static': Genera HTML estático por defecto, solo lo que marques como dinámico usará servidor. (Recomendado para tu web)
  // 'server': Todo es dinámico por defecto.
  output: 'static',
});
