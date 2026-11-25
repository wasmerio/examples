# Comment Adapter Rules

This directory holds CitrusGrid's comment adapters. The site itself ships with no comment system — only a unified browser-side comment interface. Actual commenting capability is provided by adapters in this directory (one standalone ts file per comment system), plug-and-play style: drop an adapter here, put its name in `site.config.ts`, and it is wired up. The site body depends only on the interface, never on any specific comment system.

## 1. Enabling and Disabling

In the single source of site config `src/site.config.ts`:

```ts
// Comment adapter name (without extension), matching <name>.ts in this directory
commentScript: 'utterances',  // Enabled: uses src/comments/utterances.ts
commentScript: '',            // Disabled (default): no comment section, no scripts, no requests
```

Rules:

- The value is the adapter file name (without the `.ts` suffix), e.g. `utterances`;
- Empty (default) fully disables: no comment section is rendered, the comment runtime is not loaded, no requests are made;
- An invalid name or missing file never throws — it only logs a console warning and is treated as disabled;
- Comment-system-specific settings (e.g. utterances' repo) do **not** go into site.config.ts; they live in the settings block at the top of the adapter ts file (see section 5).

## 2. Directory Structure

```text
src/comments/
├── client.ts          # Framework client runtime (do not modify): lazy-load scheduling, adapter loading, placeholder state machine, theme forwarding
├── utterances.ts      # Adapter: utterances (GitHub Issues comments), settings block at the top
└── usageRules.md      # This file
```

## 3. How It Works (guaranteed by client.ts)

| Mechanism | Description |
| --- | --- |
| Lazy loading | The comment mount point is watched by an IntersectionObserver; the adapter loads only when the section approaches the viewport (300px early). While comments sit below the fold, the first screen requests nothing comment-related. Falls back to immediate loading when IntersectionObserver is unavailable |
| Code splitting | `import.meta.glob` turns every adapter into its own chunk; only the one named in site.config.ts is ever fetched. Adapter modules are cached per browser session, so Swup navigations never refetch |
| Placeholder | The comment section is server-rendered (min height + shimmer skeleton); the skeleton is removed once the adapter renders its first content node, so there is no layout shift during loading |
| Async loading | Both the adapter chunk and third-party scripts (e.g. utteranc.es/client.js) are injected asynchronously, never blocking the page |
| Theme sync | The runtime listens to the global `theme-change` event and forwards it to the adapter's `onThemeChange`; the adapter syncs its own widget |
| Page transitions | The mount flow re-runs on every page load (first load + Swup navigations); before a navigation destroys the old section, the adapter's `unmountComment` (if exported) is called |
| Graceful failure | Adapter load failure, missing `mountComment` export, or a thrown mount error: a console warning is logged and the whole comment section is hidden (`is-error`); the rest of the page is unaffected |

The preload margin and the skeleton fallback timeout are constants at the top of client.ts (`LOAD_MARGIN` / `SKELETON_TIMEOUT`), adjustable as needed.

## 4. Adapter Contract (must follow)

An adapter is an ordinary TypeScript module that provides the following functions to the runtime via named exports (no default export). Adapters run in the browser — do not use Node-only APIs:

### 1. `mountComment(container)` — Mount the comments (required)

```ts
export function mountComment(container: HTMLElement): void | Promise<void>
```

- `container` is the comment mount element (the empty `.comment-mount` inside the section); render the comment widget into it;
- Throw on incomplete configuration (e.g. a required field is empty); the runtime hides the section and logs a warning;
- Return as soon as possible (e.g. only inject the third-party bootstrap script); subsequent loading/rendering is handled by the comment system itself;
- Re-entry safety is handled by the runtime (every page transition gets a fresh container); adapters do not need their own dedup.

### 2. `onThemeChange(dark)` — Theme switching (optional)

```ts
export function onThemeChange(dark: boolean): void
```

- Forwarded by the runtime when the global `theme-change` event fires; `dark` is `true` for dark mode;
- The initial theme does not go through this function: `mountComment` must initialize according to the current theme (`document.documentElement.classList.contains('dark')`);
- If the comment widget has no theme support, simply omit this export.

### 3. `unmountComment()` — Teardown on navigation (optional)

```ts
export function unmountComment(): void
```

- Called before a Swup navigation destroys the section; use it to clear timers and global listeners. Most adapters do not need it.

### 4. Error-handling convention (important)

- Throw on missing config, load failure, or mount failure; the runtime catches and hides the whole section;
- Do not signal failure by returning `null` or similar — just throw.

## 5. Settings Block Convention

Comment-system-specific settings live in the settings block at the top of the adapter ts file, **not in site.config.ts**: the comment entry in site.config.ts only decides which adapter to use — nothing else. Field names and defaults are up to each adapter; comments must explain every field and how to fill it in.

## 6. Mount Points (handled by the framework; adapter authors need not care)

When enabled, `src/components/Comments.astro` renders the comment section mount point; client.ts does the rest:

| Mount point | Location | Structure |
| --- | --- | --- |
| `<section data-comment-script="adapter-name">` | End of PostPage and FriendsPage | Contains a `.comment-skeleton` skeleton and the `.comment-mount` mount container |

The skeleton is removed when the mount container gains its first non-`script` child (i.e. the widget's real content), with an 8-second timeout as a failsafe against a stuck skeleton.

## 7. Writing Your Own Adapter (example skeleton)

Using giscus as an example: create `src/comments/giscus.ts`, then set `commentScript: 'giscus'` in site.config.ts — done:

```ts
// src/comments/giscus.ts —— set commentScript: 'giscus' in site.config.ts to enable

// ========== Settings ==========
const config = {
  repo: '',
  repoId: '',
  category: '',
  categoryId: '',
  lightTheme: 'light',
  darkTheme: 'dark',
}
// ==============================

const isDark = () => document.documentElement.classList.contains('dark')

export function mountComment(container: HTMLElement): void {
  if (!config.repo) throw new Error('[comments] giscus.repo is not configured')
  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.async = true
  script.setAttribute('data-repo', config.repo)
  // ...other data-* attributes
  script.setAttribute('data-theme', isDark() ? config.darkTheme : config.lightTheme)
  container.appendChild(script)
}

export function onThemeChange(dark: boolean): void {
  document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')?.contentWindow?.postMessage(
    { giscus: { setConfig: { theme: dark ? config.darkTheme : config.lightTheme } } },
    'https://giscus.app',
  )
}
```

Notes:

1. `mountComment` is required; `onThemeChange` / `unmountComment` are optional — export only what you need;
2. Adapters run in the browser only; they never execute at build time and are not bundled when disabled;
3. Everything an adapter exports ends up in the browser chunk — never embed secrets or credentials in the settings block (comment systems generally only need public values);
4. The file name is the adapter name; prefer naming files after the system (`giscus.ts`, `waline.ts`, ...).
