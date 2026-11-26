// @ts-check
import { cp, copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import expressiveCode from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rehypeSlug from "rehype-slug";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { remarkReadingTime } from "./plugins/remark-reading-time.mjs";
import { remarkMermaid } from "./plugins/remark-mermaid.mjs";
import { rehypeTaskListA11y } from "./plugins/rehype-task-list-a11y.mjs";
import SITE from "./src/config.ts";
// Works from config-land because src/locales uses relative imports only —
// the config loader does not resolve the `@/` alias.
import { t } from "./src/locales/index.ts";

// Vite statically discovers `import("katex/dist/katex.min.css")` no matter which
// runtime branch guards it, so a conditional dynamic import still ships the CSS
// (and Vite's asset copy still ships every font file) even with features.math
// off. Copying the vendored assets ourselves — only when the flag is on — keeps
// the off-cost at zero. Build-only hook: `astro dev` never runs build hooks, so
// math styling only appears in `build`/`preview`, not in the dev server.
/** Copies katex.min.css + fonts into dist/vendor/katex when features.math is on.
 * @type {() => import("astro").AstroIntegration} */
const katexAssets = () => ({
  name: "katex-assets",
  hooks: {
    "astro:build:done": async ({ dir }) => {
      const out = fileURLToPath(new URL("vendor/katex/", dir));
      await cp("node_modules/katex/dist/katex.min.css", out + "katex.min.css", {
        force: true,
      });
      await cp("node_modules/katex/dist/fonts", out + "fonts", {
        recursive: true,
        force: true,
      });
    },
  },
});

// Noto Sans TC's @font-face declarations are 95% of the page CSS bundle
// (315 blocks x ~1.2 KB: 3 weights x 105 CJK unicode-range slices — the
// slicing itself is right, browsers only fetch the slices a page uses,
// but the declarations are a fixed cost). Importing @fontsource CSS in
// BaseHead put all of it in the render-blocking bundle (~160 KB gzip,
// 900 ms of LCP on a cold load). Instead this integration copies the
// declarations + woff2 files into dist/fonts/ and BaseHead loads that
// stylesheet ASYNC (media="print" swap): text paints immediately with
// the system fallback. font-display is rewritten swap -> optional
// (Google's guidance for CJK): with swap, a slow connection re-paints
// the text whenever the 30-45 KB slices land, and since Chrome counts
// that re-paint as the text's LCP, the mobile score sat at ~56 with a
// 9.5 s LCP pinned to the font download. optional means a cold slow
// visit just keeps the system font (no reflow, LCP = first paint) and
// warm visits get Noto from cache. woff fallbacks are dropped (every
// browser with @font-face unicode-range support does woff2).
// Build-only like katexAssets: the dev server shows system fonts.
/** @type {() => import("astro").AstroIntegration} */
const notoFonts = () => ({
  name: "noto-fonts",
  hooks: {
    "astro:build:done": async ({ dir }) => {
      const src = "node_modules/@fontsource/noto-sans-tc";
      const out = fileURLToPath(new URL("fonts/", dir));
      await mkdir(out + "files", { recursive: true });
      let css = "";
      for (const w of [400, 500, 700])
        css += await readFile(`${src}/${w}.css`, "utf8");
      css = css.replace(
        /,\s*url\(\.\/files\/[^)]*\.woff\)\s*format\('woff'\)/g,
        "",
      );
      css = css.replaceAll("font-display: swap;", "font-display: optional;");
      await writeFile(out + "noto-sans-tc.css", css);
      // Copy exactly the files the stripped CSS references — a filename
      // filter either drags in the unreferenced combined-CJK woff2s or,
      // tightened to numbered slices, drops the referenced combined
      // latin/cyrillic ones. Deriving from the CSS keeps referenced ==
      // copied by construction.
      const referenced = [...css.matchAll(/url\(\.\/files\/([^)]+)\)/g)].map(
        (m) => m[1],
      );
      await Promise.all(
        referenced.map((f) => copyFile(`${src}/files/${f}`, `${out}files/${f}`)),
      );
    },
  },
});

// A static `{SITE.features.mermaid && <Mermaid />}` in BlogPost.astro (the
// KaTeX-era pattern) was tried first and rejected: Astro hoists and Vite
// bundles a referenced .astro file's <script> — and everything it
// dynamically imports — purely from static analysis of the compiled module
// graph, regardless of which runtime branch guards the component's usage.
// That shipped the ~600kB mermaid renderer, plus a sub-chunk per diagram
// type, on every build even with the flag off (verified: removing the
// import made every mermaid-named chunk disappear; guarding it with a
// runtime ternary did not). injectScript, called only when the flag is on,
// keeps Astro from ever discovering the reference: Mermaid.astro stays the
// single, type-checked source of the client logic (astro check still lints
// it even though nothing imports it), and this integration just reads its
// <script> body in as plain text at config time and injects it into every
// page — the script's own `if (nodes.length)` guard makes that a no-op on
// pages without a diagram.
/** @type {() => import("astro").AstroIntegration} */
const mermaidClient = () => ({
  name: "mermaid-client",
  hooks: {
    "astro:config:setup": ({ injectScript }) => {
      const source = readFileSync(
        fileURLToPath(
          new URL("./src/components/Mermaid.astro", import.meta.url),
        ),
        "utf8",
      );
      // Drop the frontmatter comment before matching so a `<script>` mentioned
      // in prose up there (it happened once) can never be mistaken for the tag.
      const body = source.slice(source.indexOf("---", 3) + 3);
      const match = body.match(/<script>([\s\S]*)<\/script>/);
      if (!match) throw new Error("Mermaid.astro: no <script> tag found");
      injectScript("page", match[1]);
    },
  },
});

// Search during `astro dev`: the Pagefind index is a postbuild artifact
// (pagefind --site dist), so the dev server 404s /pagefind/* and
// Search.astro's dynamic import degrades into a silent no-op — search
// looks broken in dev while working fine on any built deploy. This
// middleware serves dist/pagefind/ on that path in dev. Run `npm run
// build` once to (re)generate the index; new posts appear after the next
// build. Dev-server hook only: build output is untouched.
/** @type {() => import("astro").AstroIntegration} */
const pagefindDev = () => ({
  name: "pagefind-dev",
  hooks: {
    "astro:server:setup": ({ server }) => {
      const mime = {
        ".js": "text/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".wasm": "application/wasm",
      };
      // No trailing slash: `root + sep` below is the containment prefix,
      // and a trailing slash here would make it `…/pagefind//` and reject
      // every real asset.
      const root = fileURLToPath(new URL("dist/pagefind", import.meta.url));
      server.middlewares.use((req, res, next) => {
        // Vite's own base middleware strips the base prefix before this
        // runs (the dev log shows bare /pagefind/* URLs), but strip it
        // ourselves too in case ordering ever changes.
        let path = decodeURIComponent((req.url ?? "").split("?")[0]);
        if (SITE.base && path.startsWith(SITE.base))
          path = path.slice(SITE.base.length);
        if (!path.startsWith("/pagefind/")) return next();
        // /pagefind/* is entirely this middleware's namespace — resolve
        // the request against root and serve from dist/pagefind/, or 404.
        // Never fall through to Vite on a miss: Vite would happily serve a
        // `/pagefind/../../src/config.ts` by normalizing the `..` up out of
        // the directory (arbitrary project-file read on the dev server).
        // A string `..` check can't guard this alone — it runs before
        // percent-decoding, so `%2e%2e` slips past it; resolve + a root
        // prefix check is what actually confines the path.
        const send404 = () => {
          res.statusCode = 404;
          res.end("Not found");
        };
        const file = resolve(root, "." + path.slice("/pagefind".length));
        if (file !== root && !file.startsWith(root + sep)) return send404();
        readFile(file)
          .then((buf) => {
            const ext = path.slice(path.lastIndexOf("."));
            res.setHeader(
              "Content-Type",
              mime[/** @type {keyof mime} */ (ext)] ??
                "application/octet-stream",
            );
            res.end(buf);
          })
          .catch(send404);
      });
    },
  },
});

// Deploy-target-aware base + site. On Vercel (which sets VERCEL=1 during the
// build) the site is served at the domain root, so base is "" and the
// canonical origin is Vercel's production URL; a GitHub project page keeps
// config.ts's "/repo" base and site. This is the ONLY switch needed — url()
// reads import.meta.env.BASE_URL and BaseHead reads Astro.site, both of which
// come from the values resolved here. Set config.ts's site/base for the
// GitHub Pages path; Vercel fills its own in automatically.
const onVercel = !!process.env.VERCEL;
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const resolvedSite = onVercel && vercelUrl ? `https://${vercelUrl}` : SITE.site;
const resolvedBase = onVercel ? undefined : SITE.base || undefined;

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: resolvedSite,
  base: resolvedBase,
  markdown: {
    // Astro 7's default Markdown processor (Sätteri) has no remark/rehype
    // pipeline; unified() opts back into the remark-based processor the
    // plugins below require. The top-level remarkPlugins/rehypePlugins/
    // remarkRehype options are deprecated — they live inside unified() now.
    processor: unified({
      // GFM footnotes ship an English sr-only "Footnotes" heading — localize
      // it. The ↩ back-reference link is hidden entirely in global.css
      // (owner: redundant on posts this short).
      remarkRehype: {
        footnoteLabel: t["post.footnotesLabel"],
      },
      // remarkMermaid goes first: it must turn ```mermaid fences into a raw
      // <div> before expressive-code's own remark-time processing sees them.
      remarkPlugins: [
        ...(SITE.features.mermaid ? [remarkMermaid] : []),
        remarkReadingTime,
        ...(SITE.features.math ? [remarkMath] : []),
      ],
      rehypePlugins: [
        // rehypeSlug alone: heading ids for the TOC's deep links, without
        // the hover "#" anchor a rehype-autolink-headings setup would add
        // (owner removed it 2026-07-12).
        rehypeSlug,
        // Names GFM task-list checkboxes so they pass the a11y label check.
        [rehypeTaskListA11y, t["post.taskLabel"]],
        ...(SITE.features.math ? [rehypeKatex] : []),
      ],
    }),
  },
  integrations: [
    // Must precede mdx() so it can claim ```fenced blocks before MDX's own
    // markdown processing sees them.
    expressiveCode({
      themes: ["github-light", "github-dark-high-contrast"],
      // Tocas (site theme) puts `.is-dark`/`.is-light` on <html> for an
      // explicit user choice and leaves it unclassed to follow OS
      // prefers-color-scheme otherwise. Returning bare classes here (not
      // ":root:not(...)" — themeCssRoot already prepends ":root") lets
      // useDarkModeMediaQuery's default `true` (exactly 2 themes, opposite
      // types) generate the "@media (prefers-color-scheme: dark) but not
      // .is-light" rule, matching Tocas's own pattern:
      //   .is-dark            -> dark, unconditional (explicit choice wins)
      //   :not(.is-light) + OS dark -> dark (no class = follow OS)
      themeCssSelector: (theme) =>
        theme.type === "dark" ? ".is-dark" : ".is-light",
      useDarkModeMediaQuery: true,
      plugins: [pluginLineNumbers()],
      defaultProps: { showLineNumbers: false },
      // Per-theme code/terminal backgrounds are set on the THEMES, not as a
      // styleOverrides resolver: a `({ theme }) => …` on the top-level
      // codeBackground makes the emitted ec.*.css hash disagree with the URL
      // injected into <link> tags — pages then reference a css file that
      // does not exist and every block renders unstyled (reproduced
      // 2026-07-12; frame-level resolvers below are unaffected). Light
      // value sits between --ts-gray-75 (250) and gray-100 (242): gray-100
      // read too heavy against the white page (owner call). Dark mirrors
      // dark gray-100.
      customizeTheme: (theme) => {
        const bg = theme.type === "dark" ? "#333333" : "#f6f6f6";
        theme.colors["editor.background"] = bg;
        theme.colors["terminal.background"] = bg;
        return theme;
      },
      // Flat, Tocas-gray code surfaces (values mirror --ts-gray-200/300 in
      // both modes). Filename tabs flatten into a plain label strip (no tab
      // chrome, no indicators), terminals lose the macOS window dots, and
      // every frame shadow and border is gone.
      styleOverrides: {
        borderRadius: "0.4rem",
        codeFontSize: "0.9em",
        borderWidth: "0",
        frames: {
          frameBoxShadowCssValue: "none",
          editorTabBarBackground: ({ theme }) =>
            theme.type === "dark" ? "rgb(56, 56, 56)" : "rgb(238, 238, 238)",
          editorTabBarBorderBottomColor: ({ theme }) =>
            theme.type === "dark" ? "rgb(71, 71, 71)" : "rgb(225, 225, 225)",
          editorActiveTabBackground: "transparent",
          editorActiveTabBorderColor: "transparent",
          editorActiveTabIndicatorTopColor: "transparent",
          editorActiveTabIndicatorBottomColor: "transparent",
          terminalTitlebarBackground: ({ theme }) =>
            theme.type === "dark" ? "rgb(56, 56, 56)" : "rgb(238, 238, 238)",
          terminalTitlebarBorderBottomColor: ({ theme }) =>
            theme.type === "dark" ? "rgb(71, 71, 71)" : "rgb(225, 225, 225)",
          terminalTitlebarDotsOpacity: "0",
        },
      },
    }),
    mdx(),
    sitemap(),
    notoFonts(),
    pagefindDev(),
    ...(SITE.features.math ? [katexAssets()] : []),
    ...(SITE.features.mermaid ? [mermaidClient()] : []),
  ],
});
