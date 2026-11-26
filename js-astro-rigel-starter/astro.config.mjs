import { defineConfig } from "astro/config";

import { rigel } from "@rigel-cms/rigel";
import schema from "./src/content/schema";
import { multilingual } from "./src/multilang.mjs";

const backend = process.env.RIGEL_BACKEND ?? (process.env.RIGEL_GITHUB_REPO ? "github" : "local");
if (!["local", "github", "demo"].includes(backend)) throw new Error("RIGEL_BACKEND must be local, github or demo");

const postFields = [
  { key: "title", label: "Article title", type: "string" },
  { key: "date", label: "Date", type: "date" },
  { key: "author", label: "Author", type: "reference", to: "author" },
  { key: "draft", label: "Draft", type: "boolean" },
];

export default defineConfig({
  vite: { server: { watch: { ignored: ["**/_temp/**"] } } },
  integrations: [
    rigel({
      ...(multilingual ? { contentLocales: { defaultLocale: "en", locales: [{ code: "en", label: "English" }, { code: "fr", label: "Français" }] } } : {}),
      // Remove unused languages to keep the CMS browser bundle small. English is always included.
      languages: ["en", "fr", "es", "ru", "zh", "ja", "it", "de", "nl"],
      extensions: ["./src/rigel/call-to-action.ts", "./src/rigel/widgets.ts"],
      copyDir: "src/content/copy",
      maxFileSize: 2 * 1024 * 1024,
      backend,
      repo: process.env.RIGEL_GITHUB_REPO,
      repoRoot: "",
      demo: process.env.RIGEL_DEMO !== "false",
      schema,
      sidebar: [
        { kind: "heading", label: "Website" },
        { kind: "link", target: { kind: "pages" } },
        { kind: "link", target: { kind: "collection", name: "blog" }, label: "Blog" },
        { kind: "link", target: { kind: "collection", name: "news" }, icon: "megaphone" },
        ...(multilingual ? [
          { kind: "link", target: { kind: "collection", name: "articles-en" }, label: "English articles" },
          { kind: "link", target: { kind: "collection", name: "articles-fr" }, label: "Articles français" },
        ] : []),
        { kind: "heading", label: "Shared content" },
        { kind: "link", target: { kind: "documents", type: "author" }, icon: "users" },
        { kind: "link", target: { kind: "documents", type: "logoSet" }, icon: "images" },
        { kind: "link", target: { kind: "documents", type: "callout" }, icon: "megaphone" },
        { kind: "link", target: { kind: "menus" } },
        { kind: "heading", label: "Assets" },
        { kind: "link", target: { kind: "media" } },
        { kind: "separator" },
        { kind: "link", target: { kind: "document", type: "settings", id: "settings:site" }, label: "Site settings", icon: "gear" },
        { kind: "link", target: { kind: "document", type: "demo", id: "demo:fields" }, label: "Demo", icon: "squares-four" },
      ],
      preview: {
        documents: {
          page: { url: "/{slug}/", index: "/", template: "/preview/documents/page/" },
          legalPage: { url: "/legal/{slug}/", template: "/preview/documents/legalPage/" },
          ...(multilingual ? {
            pageEn: { url: "/en/{slug}/", template: "/preview/documents/pageEn/" },
            pageFr: { url: "/fr/{slug}/", template: "/preview/documents/pageFr/" },
            legalPageEn: { url: "/en/legal/{slug}/", template: "/preview/documents/legalPageEn/" },
            legalPageFr: { url: "/fr/legal/{slug}/", template: "/preview/documents/legalPageFr/" },
          } : {}),
        },
        collections: {
          blog: { url: "/blog/{slug}/", new: "/preview/blog/" },
          news: { url: "/news/{slug}/", new: "/preview/news/" },
          ...(multilingual ? {
            "articles-en": { url: "/en/articles/{slug}/", template: "/preview/articles-en/" },
            "articles-fr": { url: "/fr/articles/{slug}/", template: "/preview/articles-fr/" },
          } : {}),
        },
      },
      menus: { folder: "src/content/menus", maxDepth: 3 },
      collections: [
        ...(multilingual ? ["en", "fr"].map(locale => ({
          name: `articles-${locale}`,
          label: locale === "en" ? "English articles" : "Articles français",
          locale,
          folder: `src/content/multilang/${locale}/articles`,
          fields: postFields,
          columns: ["title", "date", "author"],
        })) : []),
        {
          name: "blog",
          label: "Blogs",
          folder: "src/content/blog",
          fields: [...postFields, { key: "tags", label: "Tags", type: "tags" }],
          columns: ["title", "date", "author", "tags"],
        },
        {
          name: "news",
          label: "News",
          folder: "src/content/news",
          fields: postFields.map(field => field.key === "author" ? { ...field, label: "Authors", multiple: true } : field),
          columns: ["title", "date", "author"],
        },
      ],
    }),
  ],
});
