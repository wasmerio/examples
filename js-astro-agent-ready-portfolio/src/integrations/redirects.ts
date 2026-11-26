import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import type { AstroIntegration } from "astro";
import { parseFrontmatter, parseList } from "../../scripts/lib/frontmatter.ts";

// Cloudflare Pages and Netlify read `_redirects` from the site root: "<from> <to> <status>" per line.
// Posts list their old slugs under `aliases`, so renaming a post file keeps the old URL alive.
// Astro does not route files that start with `_`, so the file is written after the build.
export function blogRedirects(): AstroIntegration {
  return {
    name: "blog-redirects",
    hooks: {
      "astro:build:done": ({ dir }) => {
        const postsDir = new URL("../../content/posts/", import.meta.url);
        const lines = readdirSync(postsDir)
          .filter((name) => name.endsWith(".md"))
          .flatMap((name) => {
            const slug = name.replace(/\.md$/, "");
            const { data } = parseFrontmatter(readFileSync(new URL(name, postsDir), "utf8"));
            if (data.draft === "true") return [];
            return parseList(data.aliases).flatMap((alias) => [
              `/blog/${alias} /blog/${slug} 301`,
              `/blog/${alias}.md /blog/${slug}.md 301`,
            ]);
          });
        writeFileSync(new URL("_redirects", dir), `${lines.join("\n")}\n`);
      },
    },
  };
}
