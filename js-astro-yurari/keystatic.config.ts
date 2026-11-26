import { collection, config, fields, singleton } from "@keystatic/core";

// 貼り付け/アップロードした画像のファイル名を UUID にする (拡張子は元のものを維持)
const uuidFilename = (original: string) => {
  const dot = original.lastIndexOf(".");
  const ext = dot > 0 ? original.slice(dot).toLowerCase() : "";
  return `${crypto.randomUUID()}${ext}`;
};

// 画像は src/assets に置き、Astro の画像最適化 (WebP変換・サイズ属性・遅延読み込み) の対象にする。
// publicPath の `@/` は tsconfig の paths (`@/*` → `src/*`) で解決される。
const imageOptions = (name: string) => ({
  image: { directory: `src/assets/images/${name}`, publicPath: `@/assets/images/${name}/`, transformFilename: uuidFilename },
});

// ローカルモード: ファイルを直接読み書きする (開発サーバーの /keystatic で編集)
export default config({
  storage: { kind: "local" },
  ui: { brand: { name: "Yurari" } },

  collections: {
    posts: collection({
      label: "Posts",
      slugField: "title",
      path: "src/content/posts/*",
      format: { contentField: "content" },
      entryLayout: "content",
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        published: fields.date({ label: "Published", validation: { isRequired: true } }),
        description: fields.text({ label: "Description", multiline: true }),
        category: fields.text({ label: "Category", defaultValue: "Uncategorized" }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => props.value,
        }),
        draft: fields.checkbox({ label: "Draft", defaultValue: false }),
        content: fields.markdoc({
          label: "Content",
          extension: "md",
          options: imageOptions("posts"),
        }),
      },
    }),
  },

  singletons: {
    about: singleton({
      label: "About",
      path: "src/content/spec/about",
      format: { contentField: "content" },
      schema: {
        title: fields.text({ label: "Title" }),
        description: fields.text({ label: "Description" }),
        content: fields.markdoc({
          label: "Content",
          extension: "md",
          options: imageOptions("about"),
        }),
      },
    }),
  },
});
