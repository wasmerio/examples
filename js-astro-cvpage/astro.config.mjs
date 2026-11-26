// @ts-check
import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro'

export default defineConfig({
    redirects: {
        '/': '/en',
    },
    integrations: [
        UnoCSS({
            injectReset: true
        }),
    ],
});
