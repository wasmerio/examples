# Why add a `robots.txt`

A `robots.txt` file declares crawler guidance in a standard location. Even when your effective rules allow normal crawling, having an explicit file makes your indexing policy intentional and visible.

## Why it matters

- Declares crawler rules in a standard, well-known location.
- Reduces accidental crawling of private or low-value paths.
- Helps search engines discover your sitemap when listed.
- Makes your crawl policy explicit for operators and teams.
- Makes the **absence** of a sitemap explicit too, when you intentionally do not have one.

Add a `robots.txt` even if your rules are minimal. Explicit policy beats implicit assumptions.

## Good baseline

```ts title="astro.config.mjs"
eminence({
  robotsTxt: {
    rules: [{ agent: "*", disallow: ["/admin/", "/private/"] }],
    sitemap: "/sitemap-index.xml",
  },
});
```

- Start with `User-agent: *`.
- Disallow clearly non-public paths (`/admin/`, `/private/`, staging).
- Add a sitemap URL when one exists.
- Omit the `sitemap` field intentionally if you do not have one yet; add it later.

## Important boundary

`robots.txt` controls **crawler behavior**, not access control. Sensitive data must still be protected with authentication and authorization. Disallowing a path does not stop a determined visitor from fetching it.

## Silence the recommendation when you intentionally skip

Pass `robotsTxt: false` to disable the feature and suppress the build-time recommendation:

```ts
eminence({ robotsTxt: false });
```

## Cross-references

- Generation feature: [../integration/robots-txt.md](../integration/robots-txt.md).
- Per-page crawler directives: [../components/robots.md](../components/robots.md).
- <https://www.rfc-editor.org/rfc/rfc9309>.
