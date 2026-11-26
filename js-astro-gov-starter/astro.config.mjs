import { defineConfig, envField } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import { resolve } from 'path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Single source of truth for the locale set. Add new locales here, then see
// "Adding a new language" in README.md for the remaining steps.
const LOCALES = { en: 'en-US', es: 'es-US' };
const DEFAULT_LOCALE = 'en';

export default defineConfig({
  // site + base are read from env vars so the same build config works for
  // local dev (base '/'), GitHub Pages subpath (base '/repo-name'), and
  // custom domains (base '/'). Set these in your deploy workflow.
  site: process.env.SITE || 'http://localhost:4321',
  // Ensure BASE_URL always ends with / so ${base}asset paths join correctly
  base: (process.env.BASE_PATH || '/').replace(/\/?$/, '/'),

  integrations: [
    mdx(),
    // Generates /sitemap-index.xml at build time using the SITE env var.
    // The dev-only component preview is excluded from indexing.
    sitemap({
      filter: (page) => !page.includes('/internal/'),
      i18n: {
        defaultLocale: DEFAULT_LOCALE,
        locales: LOCALES,
      },
    }),
  ],

  output: 'static',

  // i18n: English at /, Spanish at /es/
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: Object.keys(LOCALES),
    routing: {
      prefixDefaultLocale: false,
    },
  },

  // ─── Type-safe environment variables ─────────────────────────────────────────
  // Declares and validates the environment variables this project recognises.
  // Run `astro sync` after adding or changing entries to regenerate TypeScript types.
  //
  // To use a variable inside a page or component:
  //   import { SITE } from 'astro:env/server';
  //
  // Note: astro.config.mjs itself must still read these via process.env because
  // astro:env is a runtime virtual module — it is not available at config-load time.
  env: {
    schema: {
      // Full public URL of the deployed site (e.g. https://agency.gov).
      // Astro automatically exposes this as Astro.site and import.meta.env.SITE.
      // Set at deploy time: SITE=https://agency.gov pnpm build
      SITE: envField.string({
        context: 'server',
        access: 'public',
        optional: true,
        default: 'http://localhost:4321',
      }),

      // URL subpath for deployments that don't live at the root domain.
      // Use /repo-name/ for GitHub Pages, or / for a custom root domain.
      // Astro normalises this and exposes it as import.meta.env.BASE_URL.
      BASE_PATH: envField.string({
        context: 'server',
        access: 'public',
        optional: true,
        default: '/',
      }),
    },
  },

  // ─── Content Security Policy ──────────────────────────────────────────────────
  // Astro generates a <meta http-equiv="Content-Security-Policy"> on every page
  // at build time and automatically hashes any inline <script> and <style> blocks
  // it produces, so 'unsafe-inline' is not required for scripts or styles.
  //
  // HOW TO CUSTOMISE:
  //   • Add approved external script origins to scriptDirective.resources
  //     Example: ["'self'", "https://dap.digitalgov.gov"]  (DAP analytics)
  //   • Add external style origins to styleDirective.resources if needed
  //   • Add, remove, or adjust entries in the directives array below
  //   • Full directive reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  //
  // STATIC SITE LIMITATION:
  //   frame-ancestors is included below but browsers only enforce it via an HTTP
  //   response header — it is silently ignored inside a <meta> tag per the CSP spec.
  //   For static deployments also set it in your hosting config.
  //   See public/_headers for a Netlify / Cloudflare Pages example;
  //   translate to vercel.json "headers" for Vercel deployments.
  //
  // TESTING:
  //   CSP is NOT enforced during `astro dev`. Always test with `astro build && astro preview`.
  security: {
    csp: {
      // SHA-256 is universally supported. Upgrade to SHA-512 for stricter integrity if needed.
      algorithm: 'SHA-256',

      directives: [
        // Fall back to same-origin for any resource type not listed explicitly below.
        "default-src 'self'",

        // USWDS images are self-hosted at /uswds/img/.
        // data: covers inline SVG data URIs used by some USWDS components.
        "img-src 'self' data:",

        // USWDS fonts are self-hosted at /uswds/fonts/ — no external font CDN needed.
        "font-src 'self'",

        // No fetch / XHR to third-party origins.
        // Extend this if your site calls an external API:
        //   "connect-src 'self' https://api.agency.gov"
        "connect-src 'self'",

        // Forms must submit to the same origin.
        // Extend if you send form data to a third-party service (e.g. a DKAN endpoint).
        "form-action 'self'",

        // Prevent attackers from injecting a <base> tag to redirect relative URLs.
        "base-uri 'self'",

        // Block plugins (Flash, Java applets). No government site should need these.
        "object-src 'none'",

        // Prevent the site from being embedded in iframes on other domains (clickjacking).
        // Only enforced via HTTP header — see the note above and public/_headers.
        "frame-ancestors 'none'",
      ],

      // script-src: USWDS JS is loaded from /uswds/js/uswds.min.js (same origin).
      // Astro auto-hashes any inline scripts it generates, so no 'unsafe-inline' needed.
      //
      // 'wasm-unsafe-eval' is required by Pagefind, which runs its search index
      // as WebAssembly (see /search/). It permits same-origin WASM only — it
      // does NOT allow JavaScript eval().
      //
      // To allow the Digital Analytics Program (DAP) or another approved script CDN:
      //   resources: ["'self'", "https://dap.digitalgov.gov"]
      scriptDirective: {
        resources: ["'self'", "'wasm-unsafe-eval'"],
      },

      // style-src: Astro auto-hashes the inline <style> blocks it generates.
      // No 'unsafe-inline' needed unless a third-party injects <style> tags at runtime.
      //
      // To allow an external stylesheet CDN:
      //   resources: ["'self'", "https://fonts.googleapis.com"]
      styleDirective: {
        resources: ["'self'"],
      },
    },
  },

  vite: {
    plugins: [tailwindcss()],
    css: {
      preprocessorOptions: {
        scss: {
          // Allow @use "uswds-core" and @use "uswds" without full paths
          loadPaths: [resolve(__dirname, 'node_modules/@uswds/uswds/packages')],
          // Suppress deprecation warnings from USWDS internals
          quietDeps: true,
          silenceDeprecations: ['legacy-js-api', 'import'],
        },
      },
    },
  },
});
