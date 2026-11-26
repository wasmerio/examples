# Publishing Notes

This branch is intended to behave more like a reusable theme than a personal site snapshot.

## Suggested release checklist

Before sharing the project as a public template or applying for hosting support, confirm these points:

- the repository still includes the upstream MIT license and attribution
- a top-level `CODE_OF_CONDUCT.md` is present
- the footer keeps a visible Netlify service link if you are using the Netlify open source program
- all personal writing, commissioned artwork, private avatars, and non-redistributable assets have been removed or replaced
- `src/config.ts`, `giscus.json`, and manifest files no longer point to private domains or accounts

## Suggested structure for public distribution

The current setup already separates most editable content into predictable places:

- `src/content/posts/`
- `src/content/gallery/`
- `src/data/friends.ts`
- `src/config.ts`

That makes the branch suitable for:

- a dedicated public template branch
- a separate public repository forked from this branch
- a packaged Astro starter with sample content

## If you want to distribute it more widely later

A stronger public release usually includes:

- a short changelog
- preview screenshots in the README
- a setup guide for replacing sample content
- sample deploy instructions for Netlify
- a clean issue template and contribution notes

## Recommendation for Astro ecosystem distribution

If you want this to read as a standalone theme later, the cleanest path is usually:

1. keep your real site on `main`
2. keep this branch as the reusable template baseline
3. when the template stabilizes, publish a separate repository from this branch

That avoids mixing personal site history with theme releases and makes future maintenance much easier.
