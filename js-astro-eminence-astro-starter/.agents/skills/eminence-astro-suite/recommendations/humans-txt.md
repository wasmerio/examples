# Why add a `humans.txt`

A `humans.txt` file credits the people behind the site and publishes lightweight project context in a machine-discoverable place.

## Why it matters

- Credits authors, maintainers, and teams.
- Provides transparent ownership and contact context.
- Encourages documentation discipline on smaller sites.
- Integrates naturally with the `rel="author"` discovery pattern (which [`HumansTxt`](../components/humans-txt.md) emits).

## What to include

- Team or author names.
- Optional role information.
- Contact channel(s) you are comfortable publishing.
- Optional stack or build notes if useful.

## Keep it simple

A short, accurate file beats a long stale one. Update it when ownership or contact details change.

## Setup

The integration does **not** generate this file. Author it yourself at `public/humans.txt`, then enable the discovery link:

```ts title="astro.config.mjs"
eminence({ headTags: { humansTxt: true } });
```

To silence the build-time recommendation without enabling the link tag, pass `humansTxt: false`.

## Cross-references

- Integration behavior: [../integration/humans-txt.md](../integration/humans-txt.md).
- Link tag component: [../components/humans-txt.md](../components/humans-txt.md).
- <https://humanstxt.org/>.
