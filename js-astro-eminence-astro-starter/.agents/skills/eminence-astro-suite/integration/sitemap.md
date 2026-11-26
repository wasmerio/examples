# `sitemap` — `@astrojs/sitemap` wrapper

Registers `@astrojs/sitemap` automatically. The `sitemap` option is forwarded directly.

## Peer dependency

```bash
pnpm add @astrojs/sitemap
```

If `@astrojs/sitemap` is not installed but `sitemap` is enabled, the integration logs an error at config setup with the install instruction and does not register the sub-integration (the build will then fail when Astro tries to use it — install the peer).

## Minimal usage

```ts title="astro.config.mjs"
eminence({
  // Omitting `sitemap` is equivalent to `sitemap: {}` — enabled with defaults.
});
```

The `@astrojs/sitemap` integration is registered automatically using `Astro.site` as the base URL. Set `site` in `astro.config.mjs` for sitemap URLs to resolve.

## Options

```ts
// IntegrationInput["sitemap"]
type SitemapInput = SitemapOptions | false;
```

`SitemapOptions` is re-exported from `@astrojs/sitemap`. All of its options pass through unchanged. Common ones:

| Option       | Type                                                                              | Description                                 |
| ------------ | --------------------------------------------------------------------------------- | ------------------------------------------- |
| `filter`     | `(page: string) => boolean`                                                       | Exclude pages from the sitemap.             |
| `changefreq` | `"always" \| "hourly" \| "daily" \| "weekly" \| "monthly" \| "yearly" \| "never"` | Page change frequency hint.                 |
| `priority`   | `number` (0–1)                                                                    | Page priority hint.                         |
| `lastmod`    | `Date`                                                                            | Last modification date.                     |
| `i18n`       | `{ defaultLocale: string; locales: Record<string, string> }`                      | Multi-locale config.                        |
| `entryLimit` | `number`                                                                          | Split into multiple sitemaps when exceeded. |
| `serialize`  | `(item) => SitemapItem \| undefined`                                              | Per-entry transformation.                   |

See the upstream docs for the complete surface: <https://docs.astro.build/en/guides/integrations-guide/sitemap/>.

## Example

```ts
eminence({
  sitemap: {
    filter: (page) => !page.includes("/private/"),
    changefreq: "weekly",
    priority: 0.8,
    i18n: {
      defaultLocale: "en",
      locales: { en: "en-US", es: "es-ES" },
    },
  },
});
```

## Disabling

Pass `sitemap: false` to skip registering `@astrojs/sitemap` entirely:

```ts
eminence({ sitemap: false });
```

When disabled, no sitemap is generated and `@astrojs/sitemap` does not need to be installed.

## Rules

- `Astro.site` must be set in `astro.config.mjs` for `@astrojs/sitemap` to emit absolute URLs.
- The integration loads `@astrojs/sitemap` via `require()` at config setup; missing peer is logged and gracefully skipped at that step.
- Pair sitemap entries with `robotsTxt.sitemap` to advertise them to crawlers (see [./robots-txt.md](./robots-txt.md)).

## Cross-references

- Reference sitemap from robots.txt: [./robots-txt.md](./robots-txt.md).
- Upstream `@astrojs/sitemap` docs: <https://docs.astro.build/en/guides/integrations-guide/sitemap/>.
