# Image Organization Rules

All project media lives in **one folder per project** under `public/images/projects/`.

## Folder Structure

```
public/images/projects/
  <slug>/
    logo.png            ← Project icon/logo (transparent PNG)
    cover.png           ← Primary screenshot (1400×900, PNG/JPG/WebP)
    screenshot-1.png    ← Additional screenshots
    screenshot-2.png
    demo.gif            ← Animated demo
```

## Frontmatter References

All paths are **absolute** from the site root:

```yaml
image: "/images/projects/<slug>/logo.png"
coverImage: "/images/projects/<slug>/cover.png"
gallery:
  - "/images/projects/<slug>/screenshot-1.png"
  - "/images/projects/<slug>/demo.gif"
```

## How Each Field Renders

| Field        | Card (grid)                        | Detail page (hero)              | Homepage (featured)          |
|-------------|------------------------------------|---------------------------------|------------------------------|
| `coverImage` | Edge-to-edge screenshot            | Full-width hero (max 480px)     | Large cover image            |
| `image`      | Centered on gradient background    | Centered with accent glow       | Centered in gradient box     |
| `gallery[0]` | Hover-swap overlay on card         | —                               | —                            |
| `gallery[*]` | —                                  | Scrollable thumbnail strip      | —                            |

### Rendering priority
1. If `coverImage` exists → shows screenshot mode
2. Else if `image` exists → shows logo-on-gradient mode
3. Else → shows "NO_PREVIEW" placeholder

## Image Guidelines

| Type        | Recommended size | Format       | Notes                                    |
|-------------|------------------|--------------|------------------------------------------|
| Logo        | 400–800px wide   | PNG (transparent) | Drop-shadow applied automatically    |
| Cover       | 1400×900         | PNG/JPG/WebP | `object-fit: cover` from top-left        |
| Screenshots | 1200–1400px wide | PNG/JPG/WebP | For gallery strip and inline content     |
| GIFs        | Up to 1400px     | GIF          | Must be in `public/` — Astro strips animation from `src/` |

## Inline Markdown Images

For screenshots inside the content body, use absolute paths:

```markdown
![Dashboard overview](/images/projects/<slug>/dashboard.png)
```

Or with a caption:

```html
<figure>
  <img src="/images/projects/<slug>/dashboard.png" alt="Dashboard overview" />
  <figcaption>The main dashboard showing execution metrics</figcaption>
</figure>
```

## Why Everything Is in `public/`

- **One location** — no split between `src/assets/` and `public/`
- GIFs require `public/` (Astro's optimizer strips animation)
- Markdown inline images require `public/` paths
- Gallery items use plain `<img>` tags (no Astro `<Image>` optimization)
- Pre-optimize images as WebP before committing for best performance
