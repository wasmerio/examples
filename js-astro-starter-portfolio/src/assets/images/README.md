# src/assets/images

Drop images you want Astro to optimize here (resized, converted to webp/avif,
lazy-loaded automatically) — a headshot for the About page, project covers,
an Open Graph image, etc.

Reference them with the built-in `<Image />` component instead of a plain
`<img>` tag:

```astro
---
import { Image } from 'astro:assets';
import portrait from '@/assets/images/portrait.jpg';
---

<Image src={portrait} alt="A short, real description of the photo" width={480} />
```

Anything that should be served as-is, unprocessed (favicon, robots.txt,
downloadable files), belongs in `public/` at the project root instead.
