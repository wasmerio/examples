# Astro Memory Atlas Template Design

**Date:** 2026-10-05  
**Status:** Design approved in chat; GitHub Pages demo added to scope.

## Goal

Extract the reusable Astro memory-album experience into a public, forkable starter repository at `Liyuk/astro-memory-atlas`, with no source-owner personal data and an automatically deployed GitHub Pages demo.

## Audience and product shape

This is a Chinese-first personal memory-site starter for people who want a keepsake site with an album, chronology, yearly recaps, a map, shared wishes, and relationship anniversary moments. The public sample content is clearly fictional. The README provides an English-first setup guide and a concise Chinese guide.

## Scope

Keep and generalize the current six-page experience:

- Home with featured memories and anniversary / birthday moments.
- Photo album with search, year filters, page-turn mode, and image viewer.
- Relationship timeline and yearly recaps derived from shared example data.
- Place atlas with a local map and a memory list.
- Future wishes list.
- Configurable locale/time zone and anniversary dates.

Keep reusable visual and technical systems: the inline Lucide-style icon sprite, local Noto Sans SC font with its OFL notice, responsive layouts, reduced-motion behavior, image optimization, static map assets, and locally vendored dependencies with their notices.

Remove source-specific identity and content rather than attempting reversible redaction. The template must not contain the source site's real or nicknames, personal dates, birthdays, relationship history, factual travel memories, exact private coordinates, images or image metadata, original-image folders, user-specific docs, screenshots, build output, source domain, `CNAME`, or source Git history. Build a small synthetic sample dataset with neutral fictional names, invented dates, and generic demo locations; use locally authored abstract placeholder illustrations instead of source photos. Preserve a clean Git history for the new repository.

## Configuration and content model

Provide one documented site configuration for title, description, canonical URL, base path, locale, time zone, anniversary settings, and debug visibility. Keep memories as the single source of truth for their IDs, dates, title, description, image, alt text, and optional place references. Keep relationship phases, yearly highlights, wishes, and map locations in focused sample-data modules linked by stable sample IDs. Validate references and date formats during tests/build so a fork gets useful errors when editing data.

Defaults must be safe for a new public fork: example identity and dates only, generic sample imagery, no production canonical URL, and no source-owner details. GitHub Pages must build with the repository base path and deploy the anonymized sample site to `https://liyuk.github.io/astro-memory-atlas/`.

## Debug and demo behavior

The existing acceptance panel becomes a documented template feature. It is enabled by default in the sample configuration and starts visible and expanded on every page, without a `?debug=1` query. It remains collapsible. A single configuration setting can disable it for a customized site. Replace personal quick actions with reusable sample actions for simulated anniversaries, birthday moments when configured, page navigation, album filters and viewer, map selection, and a structural page audit. Its UI and sample state must never include source data.

A GitHub Actions workflow deploys the demo to GitHub Pages on pushes to `main` and through manual workflow dispatch. It performs a clean install, runs the project's quality checks and production build with the correct `BASE_PATH`, uploads the Pages artifact, and deploys it using the supported Pages actions. Document the one-time repository Pages setting and the live demo URL. The committed public demo must show only synthetic content.

## Repository and release shape

Create a fresh `main` branch and repository in the authenticated `Liyuk` GitHub account. The public repository name is `astro-memory-atlas`; its package name can remain private/unpublished unless a future npm package is explicitly designed. Include an English README with screenshots made from the anonymized demo, a concise Chinese quick-start section, MIT license, dependency notices, `.gitignore`, sample content guidance, local development/build commands, configuration reference, debug-panel guide, GitHub Pages deployment notes, and contribution instructions. Do not include screenshots or visuals captured from the private source site.

## Acceptance criteria

1. The target is an independent public Git repository with no source repository history or remote.
2. The app builds and runs from a clean install using the README instructions.
3. The six page areas, album interactions, map, anniversaries, and debug tools operate with sample data.
4. The debug panel is visible and expanded by default on every route, and can be disabled through configuration.
5. The GitHub Pages build respects a repository subpath and the workflow publishes the demo automatically.
6. A privacy scan over every committed file and the repository history finds no source names, source dates, source domain, private photo assets, EXIF-bearing source images, screenshots, or copied private docs.
7. All carried third-party dependencies and font assets retain their required license notices.

## Risks and boundaries

- The source app has user edits and untracked output. Extraction must use an allowlist of reusable implementation and must leave the source worktree untouched.
- The current feature set encodes private names and timeline assumptions inside UI labels and test fixtures, not only in data files. Those strings and assertions must be generalized too.
- The GitHub Pages demo is public. Only synthetic data and newly created generic placeholder art may enter the target repository or deployment artifact.
- Publishing the initial repository is within the user's request. Do not push source files or source history to the new remote.
