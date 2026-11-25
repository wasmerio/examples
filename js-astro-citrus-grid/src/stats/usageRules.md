# Statistics Script (Plugin) Usage Rules

This directory is CitrusGrid's statistics plugin directory. The site itself does not have any built-in statistics service; it only provides a set of browser-side injection interfaces. Statistics capabilities are provided by scripts (plugins) in this directory, similar to a plugin mechanism: place a script into this directory and fill in the script name in `site.config.ts` to complete the integration.

## I. Enabling and Disabling

In the site's sole configuration source `src/site.config.ts`:

```ts
// Statistics script name (without extension), corresponding to <script-name>.ts in this directory
statsScript: 'visitor-stats',  // Enabled: loads src/stats/visitor-stats.ts
statsScript: '',               // Disabled (default): no script is injected, no stats mount points on the page, no stats requests sent
```

Rules:

- Value is the script file name (without `.ts` suffix), e.g., `visitor-stats`;
- Leave empty (default) to completely disable: page does not render stats mount points, browser does not load stats client, no requests are sent;
- If the script name is invalid or the file does not exist, no error is thrown; only a console warning is output and it is treated as disabled;
- Numbers are retrieved in real time on the browser side; every page load (including Swup page transitions) refreshes them, no rebuild or redeployment is required.

## II. Directory Structure

```text
src/stats/
├── client.ts          # Framework client runtime (do not modify): collects mount points, caching, rate limiting, fills numbers
├── visitor-stats.ts   # Example plugin: Cloudflare Worker statistics service implementation
└── usage-rules.md     # This file
```

## III. Runtime Mechanism (Guaranteed by Framework-side `client.ts`)

| Mechanism | Description |
| --- | --- |
| Tracking/Ping | When the plugin exports `trackVisit`, the client calls it once on every page load (initial full page + Swup navigation) to record a visit to the stats service (fire-and-forget, no caching, no rate limiting) |
| Injection Timing | When enabled in `site.config.ts`, BaseLayout injects the client runtime (production only; dev automatically does not inject or send requests); on every page load (initial + Swup navigation), collects mount points for the current page and fills them |
| Caching | sessionStorage + TTL (5 min in production / 1 min in dev): repeated visits / page transitions within the same browser session do not repeat requests; both success and failure are cached (failure is negative cache, no retry within TTL to avoid repeated requests to failing endpoints on refresh) |
| Site-wide Reuse | When `getArticleStats` response includes `siteTotal`/`siteUnique` fields, they are reused directly, saving the `/total` request (article pages usually require only 1 request to fulfill both article and site-wide stats) |
| Rate Limiting | Serial queue + minimum interval of 150ms between adjacent requests; plugins may collapse further (e.g., visitor-stats routes all queries through `/total` with plugin-side TTL cache / in-flight dedup), so each page load issues at most 1 stats request |
| Failover Graceful Degradation | Plugin errors / request failures: the corresponding mount point retains a "‑" placeholder; only console warnings are output |

TTL and request gap are constants at the top of `client.ts` (`CACHE_TTL` / `REQUEST_GAP`), adjustable as needed.

## IV. Plugin Interface Contract (Must Follow)

A plugin is a plain TypeScript module that provides the following optional functions via named exports (no default export required). Scripts run in the browser environment, can use `fetch`, and must not use Node-specific APIs:

### 1. `getSiteTotal()` — Site-wide totals (optional)

```ts
export function getSiteTotal(): Promise<{
  siteTotal: number        // site-wide total PV (page views)
  siteUnique: number       // site-wide total UV (unique visitors)
}>
```

- Rendered in: the personal profile stats card (ProfileCard), alongside "Total Posts".
- If this function is not exported, the card does not display site-wide stats, and other functions are unaffected.

### 2. `getArticleStats(path)` — Per-article totals (optional)

```ts
export function getArticleStats(path: string): Promise<{
  articleTotal: number     // article total PV (reads)
  articleUnique: number    // article total UV (unique readers)
  siteTotal?: number       // optional: site-wide PV attached (if provided, avoids /total request)
  siteUnique?: number      // optional: site-wide UV attached
}>
```

- `path` parameter is the canonical path of the article page, e.g., `/posts/hello-world` (independent of language prefix, always starts with `/posts/`). The plugin may internally normalise more flexibly, but must be able to handle the standard `/posts/xxx` form.
- Rendered in: the article card next to the "Read More" badge (listing pages), and in the article reading page header after "Reading time". Queries for multiple badges on listing pages are collapsed by the plugin into a single request (e.g., visitor-stats routes everything through `/total` with plugin-side TTL caching + in-flight dedup), so listing pages never hammer the stats service per-article.
- Suggestion: prefer a single bulk endpoint that returns everything at once (see visitor-stats `/total`: site-wide + all-article list in one response); or attach site-wide data to the article response — the client will automatically reuse it, minimising requests per page.

### 3. `trackVisit(path?)` — Visit tracking/ping (optional)

```ts
export function trackVisit(path?: string): void
```

- The client calls this once on every page load (initial full page + Swup navigation) to record a visit to the stats service (PV tracking). No caching, no rate limiting — every real visit should be reported;
- `path` parameter is the current page path (`location.pathname`); the plugin may ignore the parameter and obtain the path itself;
- Implementation must be fire-and-forget: all errors must be swallowed internally (e.g., `fetch(...).catch(() => {})`), and no exceptions must be thrown to the page;
- If this function is not exported, the client skips tracking; number display is unaffected.

### 4. Error Handling Convention (Important)

- On request failure, service unreachable, etc., throw an exception (reject), and the client will catch it uniformly and hide the corresponding stats;
- Do not use `-1`, `null`, etc. to indicate failure; simply `throw`.

## V. Page Mount Points (Handled Automatically by Framework; Plugin Authors Need Not Worry)

When enabled, components render `data-stats` mount points, which are filled by `client.ts`:

| Mount Point | Location | Filled Content |
| --- | --- | --- |
| `data-stats="site-pv"` / `"site-uv"` | ProfileCard | Site-wide total PV / UV |
| `data-stats="article-pv"` / `"article-uv"` (container has `data-stats-path="/posts/xxx"`) | PostCard badge, PostPage header | Article total PV / UV |

Mount points are rendered along with the page (initial placeholder "‑"); after successful retrieval, the client fills in numbers; on failure, "‑" remains.

## VI. Writing Your Own Plugin (Example Skeleton)

```ts
// src/stats/my-stats.ts — set statsScript: 'my-stats' in site.config.ts to enable

export function trackVisit(path: string = location.pathname) {
  // fire-and-forget: fail silently, does not affect the page
  fetch(`https://your-api.example/log?path=${encodeURIComponent(path)}`).catch(() => {})
}

export function getSiteTotal() {
  return fetch('https://your-api.example/site')
    .then((r) => r.json())
    .then((d) => ({ siteTotal: d.views, siteUnique: d.visitors }))
}

export function getArticleStats(path: string) {
  return fetch(`https://your-api.example/page?path=${encodeURIComponent(path)}`)
    .then((r) => r.json())
    .then((d) => ({
      articleTotal: d.views,
      articleUnique: d.visitors,
      siteTotal: d.siteViews,      // optional, include if available
      siteUnique: d.siteVisitors,  // optional
    }))
}
```

Notes:

1. All three functions are optional; export only the ones you need;
2. Scripts run only in the browser, are not executed at build time, and are not bundled when disabled;
3. Plugins may export additional helper functions intended only for server-side use (e.g., `getRealtimeStats` in visitor-stats). The client only calls the three contract functions; any other exports will be bundled into the browser package as well, so do not embed sensitive credentials like API keys in them;
4. It is recommended that server endpoints have a short cache (e.g., 60s), combined with client-side TTL caching to minimise requests.
