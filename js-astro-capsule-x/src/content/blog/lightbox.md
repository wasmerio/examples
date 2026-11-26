---
title: "Image Lightbox"
description: "Click images to view them in fullscreen lightbox"
pubDate: 2026-07-04T12:00:00
tags: ["tutorial", "components"]
---

## Image Lightbox

CapsuleX includes a built-in lightbox for viewing images in fullscreen mode.

### How It Works

Click any image in a blog post to open it in a fullscreen lightbox overlay.

![Demo Image 1](/images/demo-1.svg)

### Features

- **Fullscreen view** — Images are displayed in a fullscreen overlay
- **Keyboard navigation** — Use arrow keys to navigate between images
- **Close options** — Click the close button, press ESC, or click the overlay background
- **Smooth animations** — Fade in/out transitions for a polished experience
- **Multiple images** — Navigate between all images in the post

### Multiple Images

Here are more example images to test navigation:

![Demo Image 2](/images/demo-2.svg)

![Demo Image 3](/images/demo-3.svg)

### Usage

The lightbox is automatically enabled for all blog posts. Simply:

1. Add images to your Markdown file using standard syntax
2. The lightbox will automatically attach click handlers
3. Click any image to open the fullscreen view

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `ESC` | Close lightbox |
| `←` | Previous image |
| `→` | Next image |

### Configuration

The lightbox can be toggled in `src/config.ts`:

```ts
features: {
  lightbox: true,  // Enable image lightbox on click
}
```
