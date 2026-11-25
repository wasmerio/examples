# Site and Appearance

This page covers the core identity of your blog (`site`), its visual styling (`appearance`), and custom UI prompts (`text`) in `blog.config.ts`.

## Basic Site Settings (`site`)

| Key                       | Type                                                                 | Default                 | Description                                                                                                             |
| ------------------------- | -------------------------------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `site.title`              | `Localized`                                                          | _(Required)_            | Site name displayed in the browser title bar, sidebar header, and RSS feed.                                             |
| `site.baseUrl`            | `string`                                                             | _(Required)_            | Full production URL (e.g., `'https://blog.example.com'`), used for canonical URLs, Sitemap, RSS, and Open Graph images. |
| `site.defaultLocale`      | `string`                                                             | `'zh'`                  | Primary language code of your blog.                                                                                     |
| `site.locales`            | `string[]`                                                           | `['zh', 'en']`          | Array of enabled language codes.                                                                                        |
| `site.localePrefixPolicy` | `'redirect-to-default' \| 'omit-default-prefix' \| 'require-prefix'` | `'redirect-to-default'` | Controls how language prefixes appear in URLs. See [Languages and Translations](../content/languages.md).               |
| `site.timezone`           | `string`                                                             | `'Asia/Shanghai'`       | IANA timezone used when formatting publication dates and building the activity heatmap.                                 |

## Visual Appearance (`appearance`)

Control color modes, page transitions, and category card styles under `appearance`:

```ts
export default {
  appearance: {
    defaultTheme: 'system', // 'light' | 'dark' | 'system'
    pageTransition: 'fade', // 'fade' | 'none'
    codeThemes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    showCodeLineNumbers: false,
    categoryCoverStyle: 'thumbnail', // 'thumbnail' | 'fade' | 'background'
  },
};
```

- **`defaultTheme`**: Sets the initial color scheme before a visitor manually toggles light/dark mode.
- **`pageTransition`**: Enables a smooth fade animation during client-side navigation (`'fade'`), or switches pages instantaneously (`'none'`).
- **`categoryCoverStyle`**: Controls how cover images appear on category cards (`'thumbnail'` places the image beside the text, `'fade'` blends it softly into the card edge, and `'background'` uses a full-bleed background image). Individual categories or posts can override this via `coverStyle` in frontmatter.

## Customizing UI Text (`text`)

Use `text` in `blog.config.ts` to customize the ChatGPT-style greeting on the home page, search placeholders, and 404 messages without editing theme source files:

| Key                                    | Description                                                                                             |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `text.siteDescription`                 | Default meta description for SEO and feeds when a page has no custom `description`.                     |
| `text.homeHeading`                     | Main prompt shown above the search box on the home page (e.g., `"What would you like to read today?"`). |
| `text.searchHeading`                   | Heading displayed on the dedicated search view.                                                         |
| `text.searchPlaceholder`               | Placeholder text inside the search input box.                                                           |
| `text.notFoundMessage`                 | Message displayed on the 404 page.                                                                      |
| `text.footerDescription`               | Optional tagline displayed in the site footer.                                                          |
| `text.tabs.search` / `text.tabs.posts` | Labels for the mobile/sidebar view switcher tabs.                                                       |
