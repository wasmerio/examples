# Turning features off

starglow keeps its extras behind switches, so a smaller site is mostly a config change.

## Config switches

### Search

```ts
features: { search: false },
```

The header search link goes away and `/search/` redirects to the 404 page. The `build:site` script in `package.json` still runs `scripts/build-search-index.ts`; remove that step too if you want to skip the index.

### Generated social images

```ts
features: { dynamicOgImage: false },
site: { ogImage: "og.jpg" },
```

With generated images off, pages without their own `ogImage` use one static image from `public/`. The build fails if that file is missing, so add it first.

### Motion and decoration

```ts
appearance: { ambient: "none", wordmarkGlow: false, statusline: false },
```

These are also the defaults, so you can simply remove the `appearance` block.

### The credit line

```ts
footer: { credit: false },
```

## Files you can delete

### Docker tooling

`Dockerfile`, `compose.yaml`, `.dockerignore` and `dev.sh` exist only for the containerised workflow. Without them, use the pnpm scripts directly:

| Instead of             | Run           |
| :--------------------- | :------------ |
| `./dev.sh`             | `pnpm dev`    |
| `./dev.sh build`       | `pnpm build`  |
| `./dev.sh pnpm verify` | `pnpm verify` |

`./dev.sh new` and the offline link check run through `dev.sh`, so you lose those two helpers.

#### What stays

The checks in `scripts/` have no dependencies beyond Node, so `pnpm verify` and `pnpm markers` keep working without Docker.

### Example content

Delete the example posts in `src/content/blog/`, the notes in `src/content/notes/` and the projects in `src/content/projects/`. Keep the three files in `src/content/pages/` and rewrite them.
