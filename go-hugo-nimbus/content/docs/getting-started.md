+++
title = 'Getting Started'
description = 'Install Hugo, clone the theme, and get the example site running locally.'
weight = 10
date = 2024-03-01
+++

## Prerequisites

- **Hugo Extended ≥ 0.146.0** — check with `hugo version`.
- **Node.js** (any recent LTS) — needed for the Tailwind/PostCSS build step.

## Run the example site

The example site lives in `exampleSite/` and references the theme one
directory up, so it's built with the `--themesDir` flag rather than a copy of
the theme inside it:

```bash
git clone https://github.com/your-org/hugo-theme-nimbus.git
cd hugo-theme-nimbus/exampleSite
npm install
hugo server -D --themesDir ../..
```

Open `http://localhost:1313` to see it running.

## Use Nimbus in your own site

```bash
cd my-site
git submodule add https://github.com/your-org/hugo-theme-nimbus.git themes/nimbus
```

Then set `theme = "nimbus"` in your site's `hugo.toml`, and copy
`exampleSite/package.json`, `postcss.config.js`, `tailwind.config.js`, and
`assets/css/tailwind.built.css` into your site root — see
[Installation]({{< relref "installation" >}}) for the full walkthrough.
