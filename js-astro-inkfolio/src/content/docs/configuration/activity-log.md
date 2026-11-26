---
title: Activity log
order: 5
description: The commit heatmap at /log. Real data from GitHub, refreshed by one script.
---

The `/log/` page reads `src/data/log.json`:

```json
{
  "updated": "2026-11-16",
  "repos": ["owner/name"],
  "repoStats": [{ "name": "owner/name", "commits": 425, "last": "2026-11-11" }],
  "days": [{ "date": "2026-11-16", "count": 3 }]
}
```

## Two data sources, on purpose

- **The heatmap is pulled.** `scripts/fetch-log.mjs` reads public commit data from the repositories in `REPOS` and writes per-day counts plus per-repo totals. Nothing here is typed by hand, so it stays honest when you skip a week.
- **The notes are written by hand.** `src/data/log-notes.yaml` holds the weekly record that appears under the grid: one entry per week or release, with a title and a few bullets in English and Chinese.

```yaml
- date: 2026-11-16
  title: v1.0.0 released
  titleZh: v1.0.0 发布
  items:
    en: [Docs section, Static search]
    zh: [文档区, 静态搜索]
```

Keeping them apart is deliberate: automation can lie about what matters, and a hand-written line cannot be regenerated from commits.

## Refresh it

```bash
npm run log
```

No token is involved, and that is deliberate: a personal access token sitting in a build script can read every private repository it was granted, so one leak becomes a full exposure. The script only reads **public** repositories.

```js title="scripts/fetch-log.mjs"
export const REPOS = [
  'owner/repo-one',
  'owner/repo-two',
  'owner/repo-three',
];
```

One `owner/name` per line, public only. Private work simply does not appear on the page — that is the right trade, not a limitation to work around.

## What it writes

- 365 days of per-day counts, bucketed in `Asia/Shanghai` so late-night commits do not land on the previous UTC day and look like a broken streak
- per-repository totals and the last commit date
- `updated`, shown at the bottom of the page

> [!IMPORTANT]
> The script is not part of `npm run build`. On failure it keeps the existing file and exits non-zero, so a flaky network never breaks a deploy. Run it from cron or by hand, then commit the JSON.
