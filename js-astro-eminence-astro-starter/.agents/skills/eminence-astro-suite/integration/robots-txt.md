# `robotsTxt` — `robots.txt` generation

Generates `dist/robots.txt` with one or more crawler rule blocks and optional sitemap pointers.

## Minimal usage

```ts title="astro.config.mjs"
eminence({
  robotsTxt: {
    rules: [{ agent: "*", disallow: "/private/" }],
    sitemap: "/sitemap-index.xml",
  },
});
```

Output:

```txt
User-agent: *
Disallow: /private/

Sitemap: https://example.com/sitemap-index.xml
```

## Options

```ts
type RobotsTxtOptions = {
  rules: RobotsTxtRule | RobotsTxtRule[];
  sitemap?: string | string[];
};
```

| Field     | Type                               | Required | Description                                                                     |
| --------- | ---------------------------------- | -------- | ------------------------------------------------------------------------------- |
| `rules`   | `RobotsTxtRule \| RobotsTxtRule[]` | yes      | One or more rule blocks. Must contain at least one entry.                       |
| `sitemap` | `string \| string[]`               | no       | Absolute `http(s)` URL or site-relative path (requires `site` in Astro config). |

### `RobotsTxtRule`

| Field        | Type                 | Required | Description                                                        |
| ------------ | -------------------- | -------- | ------------------------------------------------------------------ |
| `agent`      | `string \| string[]` | yes      | User-agent name(s). At least one required. Empty strings rejected. |
| `allow`      | `string \| string[]` | no       | Allowed path(s). Each must start with `/`.                         |
| `disallow`   | `string \| string[]` | no       | Disallowed path(s). Each must start with `/`.                      |
| `noindex`    | `string \| string[]` | no       | `Noindex:` path(s). Each must start with `/`.                      |
| `cleanParam` | `string \| string[]` | no       | `Clean-param:` values (non-empty strings).                         |
| `crawlDelay` | `number`             | no       | `Crawl-delay:` seconds. Must be a finite non-negative number.      |

## Examples

### Multiple agents and rules

```ts
eminence({
  robotsTxt: {
    rules: [
      { agent: ["Googlebot", "Bingbot"], allow: "/" },
      {
        agent: "*",
        disallow: ["/private/", "/admin/"],
        crawlDelay: 1,
      },
    ],
    sitemap: ["/sitemap-index.xml", "https://cdn.example.com/sitemap.xml"],
  },
});
```

Output:

```txt
User-agent: Googlebot
User-agent: Bingbot
Allow: /

User-agent: *
Disallow: /private/
Disallow: /admin/
Crawl-delay: 1

Sitemap: https://example.com/sitemap-index.xml
Sitemap: https://cdn.example.com/sitemap.xml
```

### Block all crawlers (e.g. staging)

```ts
eminence({
  robotsTxt: {
    rules: [{ agent: "*", disallow: "/" }],
  },
});
```

## Behavior

- Generation is skipped (with a warning) if `dist/robots.txt` already exists.
- Omitting `robotsTxt` triggers a recommendation warning at build time. Pass `robotsTxt: false` to disable explicitly and silence the warning.
- Site-relative sitemap entries are resolved against `site` in `astro.config.mjs`. If `site` is not set and you pass a relative sitemap, generation fails with a clear error.
- Only `http://` and `https://` sitemap URLs are accepted.

## Rules

- All path values (`allow`, `disallow`, `noindex`) **must** start with `/`. Anything else throws at build time.
- `crawlDelay` must be a finite non-negative number (TypeScript types allow any `number`; the integration validates at build time).
- `agent` cannot be empty or whitespace.
- `rules` must contain at least one entry — `rules: []` throws.

## Cross-references

- Why a robots.txt at all: [../recommendations/robots-txt.md](../recommendations/robots-txt.md).
- Sitemap generation: [./sitemap.md](./sitemap.md).
