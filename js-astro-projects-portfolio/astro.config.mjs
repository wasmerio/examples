import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    icon({
      include: {
        ph: ['*'],
      },
    }),
  ],
});
