# Bundles and Attachments

When a post includes several screenshots, photos, or downloadable attachments (such as `.zip` archives or `.pdf` handouts), scattering those files inside the global `public/` folder quickly gets messy. BlogGPT solves this with **Content Bundles**.

## One Directory, One Entry

Instead of creating a single `.md` file, create a folder for your post and place an `index.md` (or `index.<locale>.md`) file inside it:

```text
content/posts/my-trip/
├── index.zh.md
├── index.en.md
├── photos/
│   ├── sunset.jpg
│   └── map.png
└── downloads/
    └── itinerary.pdf
```

You can scaffold a bundle automatically with the CLI:

```bash
pnpm new post my-trip --use bundle --title "My Trip Notes"
```

## Relative References

Inside `index.md` (or `index.en.md`), reference any image or attachment in the same folder using a relative path starting with `./`:

```markdown
![Sunset over the bay](./photos/sunset.jpg)

Download the full PDF itinerary: [Download Notes](./downloads/itinerary.pdf)
```

You can also reference bundle images in frontmatter:

```yaml
---
title: My Trip Notes
image: ./photos/sunset.jpg
---
```

During `pnpm build`, BlogGPT automatically processes images and copies relative attachments alongside the generated post route so all links resolve cleanly. Both languages (`index.zh.md` and `index.en.md`) inside the same bundle folder can share the exact same `./photos/` and `./downloads/` files without duplicating assets.

## Choosing Between a Bundle and `public/`

| Use Case                                                                    | Recommended Location                         | Path Syntax                           |
| --------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------- |
| Post-specific screenshots, diagrams, cover images, or downloadable files    | **Content Bundle** (`content/posts/<slug>/`) | Relative path (`./photos/sunset.jpg`) |
| Site-wide assets (favicon, author avatar, global fonts, verification files) | **`public/` directory**                      | Root-relative path (`/favicon.svg`)   |
