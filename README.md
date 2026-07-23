# Wasmer Edge Examples

This repository contains runnable examples for deploying applications to **Wasmer Edge**. Each example mirrors the structure used in [`python-fastapi`](python-fastapi/README.md), with a concise walkthrough of how it works, instructions for running locally, and a short deployment guide.

## Getting Started

1. Install the [Wasmer CLI](https://docs.wasmer.io/install) and log in with `wasmer login`.
2. Clone this repository:
   ```bash
   git clone https://github.com/wasmerio/examples.git
   cd examples
   ```
3. Pick an example, read its `README.md`, and follow the “Running Locally” steps.
4. When you are ready to publish, use `wasmer deploy` from that example directory.

> Every example is self-contained. Dependencies, entry points, and Wasmer-specific configuration are documented in the example’s own README.

## Repository Overview

Examples are grouped by runtime. “Skip” directories hold work-in-progress templates; “fail” directories capture known issues or failing scenarios for regression testing.

### Python

- [`python-http`](python-http/README.md) – stdlib `http.server` JSON responder.
- [`python-django`](python-django/README.md) – Django 5 project using WSGI.
- [`python-fastapi`](python-fastapi/README.md) – minimal FastAPI hello world.
- [`python-fastapi-pandoc-converter`](python-fastapi-pandoc-converter/README.md) – FastAPI + pypandoc conversion service.
- [`python-fastapi-pystone`](python-fastapi-pystone/README.md) – Pystone benchmark exposed via FastAPI.
- [`python-ffmpeg`](python-ffmpeg/README.md) – Frame extraction with `ffmpeg-python`.
- [`python-flask`](python-flask/README.md) – Flask hello world.
- [`python-langchain-starter`](python-langchain-starter/README.md) – Streamlit chat UI backed by LangChain.
- [`python-mcp`](python-mcp/README.md) – FastMCP server exposing basic tools/resources.
- [`python-mcp-chatgpt`](python-mcp-chatgpt/README.md) – Cupcake search MCP server for ChatGPT.
- [`python-mkdocs`](python-mkdocs/README.md) – MkDocs static documentation site.
- [`python-pillow`](python-pillow/README.md) – Image transforms with Pillow.

### JavaScript & TypeScript

- [`js-angular-staticsite`](js-angular-staticsite/README.md) – Angular-style static build.
- [`js-assemble-staticsite`](js-assemble-staticsite/README.md) – Assemble-generated static site.
- [`js-astro-ssr`](js-astro-ssr/README.md) – Astro SSR (Node standalone adapter) on EdgeJS, with `wasmer.toml`/`app.yaml`.
- [`js-astro-staticsite`](js-astro-staticsite/README.md) – Astro static export.
- [`js-brunch-staticsite`](js-brunch-staticsite/README.md) – Brunch-style static build.
- [`js-create-react-app-staticsite`](js-create-react-app-staticsite/README.md) – Create React App-style static build.
- [`js-dashy`](js-dashy/README.md) – Dashy dashboard on EdgeJS (no database).
- [`js-docusaurus-staticsite`](js-docusaurus-staticsite/README.md) – Docusaurus docs site.
- [`js-eleventy-staticsite`](js-eleventy-staticsite/README.md) – Eleventy-generated static site.
- [`js-elysia`](js-elysia/README.md) – Elysia HTTP server.
- [`js-ember-staticsite`](js-ember-staticsite/README.md) – Ember-style static build.
- [`js-etherpad`](js-etherpad/README.md) – Etherpad 3.3 collaborative editor on EdgeJS.
- [`js-express`](js-express/README.md) – Express HTTP server.
- [`js-fastify`](js-fastify/README.md) – Fastify HTTP server.
- [`js-gatsby-staticsite`](js-gatsby-staticsite/README.md) – Gatsby static site.
- [`js-gatsby-staticsite2`](js-gatsby-staticsite2/README.md) – Gatsby default starter static site.
- [`js-h3`](js-h3/README.md) – H3 HTTP server.
- [`js-harp-staticsite`](js-harp-staticsite/README.md) – Harp-generated static site.
- [`js-hedgedoc`](js-hedgedoc/README.md) – HedgeDoc 1.11 markdown editor on EdgeJS (PostgreSQL required).
- [`js-hexo-staticsite`](js-hexo-staticsite/README.md) – Hexo-generated static site.
- [`js-hono`](js-hono/README.md) – Hono app served by the Node.js adapter.
- [`js-htmlwithjs-staticsite`](js-htmlwithjs-staticsite/README.md) – Plain static HTML/CSS/JavaScript site.
- [`js-hydrogen`](js-hydrogen/README.md) – Hydrogen-oriented Node.js runtime example.
- [`js-ionic-angular-staticsite`](js-ionic-angular-staticsite/README.md) – Ionic Angular-style static build.
- [`js-ionic-react-staticsite`](js-ionic-react-staticsite/README.md) – Ionic React-style static build.
- [`js-koa`](js-koa/README.md) – Koa HTTP server.
- [`js-mastra`](js-mastra/README.md) – Mastra-oriented Node.js runtime example.
- [`js-mcp`](js-mcp/README.md) – HTTP Model Context Protocol server.
- [`js-metalsmith-staticsite`](js-metalsmith-staticsite/README.md) – Metalsmith-generated static site.
- [`js-nestjs`](js-nestjs/README.md) – NestJS-oriented Node.js runtime example.
- [`js-next-ssr`](js-next-ssr/README.md) – Next.js SSR (standalone output) on EdgeJS, with `wasmer.toml`/`app.yaml`.
- [`js-next-staticsite`](js-next-staticsite/README.md) – Next.js `output: "export"` sample.
- [`js-nitro`](js-nitro/README.md) – Nitro-oriented Node.js runtime example.
- [`js-node`](js-node/README.md) – Minimal Node.js HTTP server.
- [`js-npm-file-subdir`](js-npm-file-subdir/README.md) – npm subdirectory app using a local `file:` dependency.
- [`js-nuxt-staticsite`](js-nuxt-staticsite/README.md) – Nuxt-generated static site.
- [`js-parcel-staticsite`](js-parcel-staticsite/README.md) – Parcel-style static build.
- [`js-pnpm-workspace-subdir`](js-pnpm-workspace-subdir/README.md) – pnpm workspace app in a subdirectory.
- [`js-polymer-staticsite`](js-polymer-staticsite/README.md) – Polymer-style static build.
- [`js-preact-staticsite`](js-preact-staticsite/README.md) – Preact-style static build.
- [`js-react-router`](js-react-router/README.md) – React Router-oriented Node.js runtime example.
- [`js-remix-ssr`](js-remix-ssr/README.md) – Remix-oriented server runtime example.
- [`js-remix-staticsite`](js-remix-staticsite/README.md) – Remix static export.
- [`js-rssmonster`](js-rssmonster/README.md) – RSSMonster RSS aggregator on EdgeJS (MySQL required).
- [`js-sanity-staticsite`](js-sanity-staticsite/README.md) – Sanity-style static build.
- [`js-solidstart`](js-solidstart/README.md) – SolidStart-oriented Node.js runtime example.
- [`js-stencil-staticsite`](js-stencil-staticsite/README.md) – Stencil-style static build.
- [`js-storybook-staticsite`](js-storybook-staticsite/README.md) – Storybook static build.
- [`js-svelte`](js-svelte/README.md) – Vite-powered Svelte app.
- [`js-sveltekit-staticsite`](js-sveltekit-staticsite/README.md) – Compact SvelteKit-style static build.
- [`js-tanstack-start`](js-tanstack-start/README.md) – TanStack Start-oriented Node.js runtime example.
- [`js-totaljs-cms`](js-totaljs-cms/README.md) – Total.js CMS on EdgeJS (filesystem database).
- [`js-umami`](js-umami/README.md) – Umami web analytics on EdgeJS (PostgreSQL required).
- [`js-umijs-staticsite`](js-umijs-staticsite/README.md) – UmiJS-style static build.
- [`js-vite-react-staticsite`](js-vite-react-staticsite/README.md) – Vite React static build.
- [`js-vite-staticsite`](js-vite-staticsite/README.md) – Vite-powered static site.
- [`js-vite-standalone`](js-vite-standalone/README.md) – Vite site served by a small Node.js server on EdgeJS.
- [`js-vitepress-staticsite`](js-vitepress-staticsite/README.md) – VitePress documentation site.
- [`js-vue-staticsite`](js-vue-staticsite/README.md) – Vue static build.
- [`js-vuepress-staticsite`](js-vuepress-staticsite/README.md) – VuePress documentation site.
- [`js-xmcp`](js-xmcp/README.md) – XMCP-oriented Node.js runtime example.
- [`skip-js-hono-wintercg`](skip-js-hono-wintercg/README.md) – Hono app targeting WinterCG workers.
- [`skip-js-worker-wintercg`](skip-js-worker-wintercg/README.md) – Plain WinterCG-compatible worker template.
- [`fail-js-nuxt-staticsite`](fail-js-nuxt-staticsite/README.md) – Nuxt static export (tracking open issues).

### PHP

- [`php-basic`](php-basic/README.md) – Minimal PHP script starter.
- [`php-laravel`](php-laravel/README.md) – Laravel application.
- [`php-reactphp`](php-reactphp/README.md) – ReactPHP HTTP server.
- [`php-symfony`](php-symfony/README.md) – Symfony Demo application.
- [`fail-php-amphp`](fail-php-amphp/README.md) – AMPHP event-loop demo (known limitations).
- [`fail-php-madeline`](fail-php-madeline/README.md) – MadelineProto client sample (requires Telegram credentials).

### Go & Rust

- [`go-hugo-staticsite`](go-hugo-staticsite/README.md) – Hugo-generated static site.
- [`skip-rust-axum`](skip-rust-axum/README.md) – Axum server compiled to WASIX.

### Static Sites & Misc

- [`staticsite`](staticsite) – Shared static assets and helper scripts.

## Working With the Examples

- **Local development** – Most projects rely on the platform tooling for their language (e.g., `uvicorn`, `npm run dev`, `composer install`). Follow the steps in each example README to run locally.
- **Deploying** – `wasmer deploy` bundles the selected example, configures routes, and uploads it to your Edge namespace.
- **Environment variables and secrets** – Use `wasmer secret add` or set values in your deployment pipeline. Examples that require API keys (e.g., `python-langchain-starter`) note them explicitly.

## Contributing

Contributions are welcome! If you have an example that showcases a new framework or highlights a best practice:

1. Follow the template established in existing READMEs (overview → demo → how it works → local run → Wasmer deployment).
2. Add your directory under the appropriate language prefix (`python-`, `js-`, `php-`, etc.).
3. Update this root README with a short description and link.
4. Open a pull request describing the scenario and any prerequisites.

## Additional Resources

- [Wasmer Edge documentation](https://docs.wasmer.io/edge)
- [Wasmer CLI reference](https://docs.wasmer.io/cli)
- [Support & community forums](https://discord.gg/wasmer)

Happy deploying!
