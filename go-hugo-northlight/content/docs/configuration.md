---
title: "Configuration"
description: "Every parameter the theme reads, its default, and what it changes."
weight: 2
date: 2026-07-27
---


Config flows one way: `site.Params` into `_partials/init.html`, which resolves defaults
once, and out to the templates. Templates read resolved values and never re-derive a
default inline, so every default below lives in exactly one place in the source.

> [!CAUTION]
> Config keys are API. Once published, a key is never renamed or repurposed without a
> major version bump and a changelog note. If you are reading this from a fork, that
> promise is yours to keep too.

## Site parameters

| Key | Default | What it does |
|---|---|---|
| `description` | — | Site description. Meta tags, the RSS channel, the home page. |
| `colorScheme` | `"periwinkle"` | `periwinkle`, `sage`, `clay`, `plum`, `slate` or `rose`. An unknown value falls back rather than rendering unstyled. |
| `defaultAppearance` | `"light"` | `light` or `dark`. Only applies when `autoSwitchAppearance` is off. |
| `autoSwitchAppearance` | `true` | Follow the reader's operating system. |
| `enableSearch` | `true` | The ⌘K modal. Needs `JSON` in `[outputs].home`. |
| `enableCodeCopy` | `true` | Copy button on code blocks. |
| `fingerprintAlgorithm` | `"sha512"` | `md5`, `sha256`, `sha384` or `sha512`. Changing it renames every asset at once — a cache bust, not a stale asset, but worth knowing. |
| `disableTextInHeader` | `false` | Logo-only header. The home link keeps an `aria-label`, or it would be unlabelled on every page. |
| `enableStyledScrollbar` | `true` | Hand the scrollbar back to the operating system when off. |
| `smartTOCHideUnfocusedChildren` | `false` | Collapse TOC child lists except under the current heading. Off by default: extra motion in a component whose job is to stay still. |
| `backgroundImageWidth` | `1600` | Scale target for the full-bleed background image, the largest image on any page that uses one. |
| `hotlinkFeatureImage` | `false` | Allow `featureImageURL` in front matter to point at a remote image. Off, because that is a third-party request on page view. |
| `defaultFeaturedImage` | — | Site-wide cover for posts that have none. A configured-but-missing file renders nothing rather than a 404 on every page. |
| `defaultSocialImage` | — | The OpenGraph/Twitter card image for pages without a cover of their own. |
| `seo.metaDescriptionOrder` | `["description", "summary", "siteDescription"]` | Which source fills the meta description, first non-empty wins. An unknown name is skipped rather than failing the build. |
| `header.showSubNav` | `false` | A second navigation row from the `subnav` menu. Renders only when that menu has entries. |
| `imagePosition` | `"center"` | `object-position` for cropped images — the avatar and card thumbnails. Covers are never cropped, so it does not affect the hero. |
| `disableImageOptimization` | `false` | Hand raster images to the browser unresized. For a site whose images are already optimised upstream. |
| `layoutBackgroundBlur` | `false` | Blurs background and hero artwork. Applied to the image, not the block, so text over it stays sharp. |
| `layoutBackgroundHeaderSpace` | `false` | Extra room between the header and the body. |
| `enableLightbox` | `false` | Click a prose image to open it, then zoom to 6x and pan around it — by the dialog's own buttons, the scroll wheel, a double-click, a trackpad or touch pinch, or `+` / `-` / `0` and the arrow keys. Uses a `<dialog>`, so the modal semantics, backdrop, focus trap and Escape handling come from the browser. Images that are already links are left alone. |
| `enableA11y` | `false` | Shows a control that underlines every link on the page. Named for what it does: a control whose effect a reader cannot predict is not an accessibility feature. |
| `accentEmphasis` | `false` | Lets the palette reach five surfaces the theme otherwise leaves neutral: section headings, the year rules on the post index, tag chips, a card's hover border and the blockquote edge. Invents no colours, so every palette gets it. See "More of it" on [Appearance]({{< ref "/docs/appearance" >}}). |
| `header.layout` | `"fixed"` | `fixed` keeps the header sticky (the current behaviour); `basic` lets it scroll away. |
| `mainSections` | `["blog"]` | Which sections count as posts for the home page, index, RSS and search. |
