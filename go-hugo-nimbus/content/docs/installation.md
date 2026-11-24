+++
title = 'Installation'
description = 'Add Nimbus to a new or existing Hugo site, step by step.'
weight = 20
date = 2024-03-05
+++

## 1. Add the theme

As a Git submodule (recommended for most sites):

```bash
git submodule add https://github.com/your-org/hugo-theme-nimbus.git themes/nimbus
```

Or as a Hugo Module:

```bash
hugo mod init github.com/you/your-site
hugo mod get github.com/your-org/hugo-theme-nimbus
```

## 2. Point your site config at it

```toml
theme = "nimbus"
```

## 3. Copy the build tooling

Nimbus's styling is compiled with Tailwind, ahead of time, into a plain
CSS file — Hugo itself never runs Node or PostCSS. Copy these files from
`exampleSite/` into your site root:

- `package.json`
- `postcss.config.js`
- `tailwind.config.js`
- `assets/css/tailwind.built.css` (the pre-compiled output — your site
  works immediately with this even before you run `npm install`)

