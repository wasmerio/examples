# Languages and Translations

BlogGPT treats multi-language publishing as a first-class feature. You can run a single-language blog or publish side-by-side translations in English, Simplified Chinese, or other locales.

## Enable Languages

Configure your supported languages in `blog.config.ts` under `site`:

```ts
export default {
  site: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    localePrefixPolicy: 'omit-default-prefix',
  },
};
```

### URL Prefix Policies (`localePrefixPolicy`)

- **`'omit-default-prefix'`** _(Recommended)_: The default language lives at the root (`/posts/hello`), while secondary languages use a prefix (`/en/posts/hello`).
- **`'redirect-to-default'`**: Visiting `/` redirects to `/${defaultLocale}/`, and every language uses an explicit prefix (`/zh/...`, `/en/...`).
- **`'require-prefix'`**: All language routes require their locale prefix.

## Content File Naming

You can specify the language of a Markdown file in two ways:

1. **Filename suffix** _(Recommended)_: Append `.zh.md` or `.en.md` to the filename:
   - Single files: `content/posts/hello.zh.md` and `content/posts/hello.en.md`
   - Content bundles: `content/posts/hello/index.zh.md` and `content/posts/hello/index.en.md`
2. **Unsuffixed content**: A file without a language suffix (such as `content/posts/hello.md`) serves as the shared version of that content family and takes priority when the requested translation is missing.

## Link Sibling Translations

To let readers switch directly to a translated counterpart, keep sibling translations in the same folder with the same base filename, such as `hello.zh.md` and `hello.en.md`, or `index.zh.md` and `index.en.md` inside one bundle. Every version must use the same `slug`; if you set it explicitly, update all translations together.

Translations are linked by their file paths and names. Custom frontmatter identifiers are not supported.

## Missing Translations & Fallback

You don't have to translate every single post into every language. When a reader browses in English (`/en/`) and opens a post that only exists in Chinese:

- BlogGPT looks for the requested language, then an unsuffixed version, the default language, and finally the remaining languages in `site.locales` order, so a missing translation can still use available content.
- A subtle banner informs the reader that the article is displayed in its original language.

## Customizing UI Text

Built-in interface strings come pre-translated for Simplified Chinese (`zh`) and English (`en`). To customize headings, search prompts, or footer descriptions per language, pass a `Localized` object in `blog.config.ts`:

```ts
export default {
  site: {
    title: {
      zh: '我的技术博客',
      en: 'My Tech Blog',
    },
  },
  text: {
    homeHeading: {
      zh: '今天想读点什么？',
      en: 'What would you like to read today?',
    },
    searchPlaceholder: {
      zh: '搜索文章、标题或正文...',
      en: 'Search posts, titles, or full text...',
    },
  },
};
```
