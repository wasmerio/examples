// @ts-check
import { defineConfig } from 'astro/config';

import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
      enabled: false
  },

  integrations: [icon()],
});