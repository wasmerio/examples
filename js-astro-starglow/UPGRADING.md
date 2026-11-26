# Upgrading starglow

starglow is a template: your site is a copy of the theme, and upgrades are
merged into it. Keep your changes in the places starglow never overwrites,
and an upgrade stays a small, reviewable diff.

## Files that are yours

starglow never changes these after release:

| File                       | Use it for                                          |
| -------------------------- | --------------------------------------------------- |
| `starglow.config.ts`       | All site settings                                   |
| `src/content/**`           | Your posts, notes, projects and pages               |
| `src/custom/Head.astro`    | Extra tags in `<head>`: analytics, fonts, meta      |
| `src/custom/BodyEnd.astro` | Scripts or widgets at the end of `<body>`           |
| `src/custom/PostEnd.astro` | Comments, newsletter or author bio after each post  |
| `public/**`                | Favicon, static OG image and other static files     |

New config keys always get a default, so an existing `starglow.config.ts`
keeps working. A key that is removed or renamed is first marked
`@deprecated` in `src/types/config.ts` for at least one minor release.

## How to upgrade

If you cloned starglow as in the README, the `starglow` remote is already
there. Sites created another way (the npm template, "Use this template") add
it once:

```sh
git remote add starglow https://github.com/glowing-space/starglow.git
```

Then, for each release:

```sh
git fetch starglow --tags
git merge vX.Y.Z    # add --allow-unrelated-histories the first time, for sites not cloned from starglow
./dev.sh ci         # or: pnpm install && pnpm build
```

Resolve conflicts in favour of your version for the files above, and of the
theme's version everywhere else. Read the section for every release you
skip below.

## Release notes with upgrade steps

### Unreleased

First version, nothing to migrate. Coming from AstroPaper: rename
`astro-paper.config.ts` to `starglow.config.ts` and
`defineAstroPaperConfig` to `defineStarglowConfig`.
