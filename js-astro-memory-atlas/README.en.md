# Astro Memory Atlas

A starter for a personal memory site you can copy, customize, and deploy. The demo uses fictional people, dates, places, and original abstract illustrations. Replace the sample content before publishing your own site.

**中文：** [README.md](README.md)

![English homepage of the fictional memory atlas demo](docs/images/home-demo-en.png)

![English mobile preview of the fictional memory atlas demo](docs/images/home-demo-mobile-en.png)

**Live demo:** <https://liyuk.com/astro-memory-atlas/>

## Quick start

Requirements: Node.js 22 or newer and npm.

```sh
npm ci
npm run dev
```

The terminal prints the local preview address. Validate the sample data and build the static site with:

```sh
npm test
npm run build
npm run preview
```

## Customize the site

- Edit the site name, description, canonical URL, deployment path, time zone, anniversaries, birthdays, and debug panel setting in [`src/config/site.js`](src/config/site.js).
- Sample memories, places, annual recaps, timeline entries, and wishes include `zh` and `en` copy. Edit `src/data/memories.js`, `src/data/places.js`, `src/data/annual-recaps.js`, `src/data/relationship-timeline.js`, and `src/data/shared-wishes.js`.
- Shared interface copy lives in `src/i18n/copy.js`. Add both Chinese and English text for every new user-facing string.
- Replace the sample illustrations in `src/assets/images/demo/` with your own artwork or photos, then update the image paths and alt text in the memory data.

Use the “EN / 中文” buttons in the top navigation to switch languages. The selection is saved in the current browser. With no saved choice, the page, title, and share metadata are English, and Chinese remains one tap away. To hide the sample debug panel, set `debugPanel` to `false` in `src/config/site.js`.

`npm run validate` checks dates, unique IDs, data references, and that both language versions are present. The production build runs this validation automatically.

## Pages and features

The starter has six areas: a home page, memory album, relationship timeline, annual recaps, places map, and future wishes. The album supports keyword search, year filtering, page-turn reading, and an image viewer. The map uses the locally bundled Leaflet files and original illustrated maps; it does not request online map tiles or external fonts. The Chinese font is self-hosted in two slices: pages preload the characters used by the sample, and the remaining GB2312 characters download only when new copy needs them. After adding copy, run `python3 scripts/subset-font.py`; the tests fail if those characters would pull in the larger file. The sample scenes are original illustrations made for this template, not photographs of real people.

The sample debug panel is expanded by default on every page. It can simulate dates, preview anniversaries and birthdays, exercise album and map interactions, and audit all six routes.

## Deploy to GitHub Pages

The included GitHub Actions workflow deploys automatically when you push to `main`. You can also run it manually from the Actions page. For the first deployment, open **Settings → Pages → Build and deployment** and choose **GitHub Actions** as the source.

The demo uses `/astro-memory-atlas/` as its deployment path. If you publish under a different domain or path, update `siteUrl` and `basePath` in `src/config/site.js`. To check a subpath build locally:

```sh
BASE_PATH=/astro-memory-atlas/ npm run build
```

## License and contributions

This project is available under the MIT License. See [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) for the bundled font and dependency notices. Contributions are welcome. Keep public sample content fictional, and do not add private photos, metadata, or personal information.
