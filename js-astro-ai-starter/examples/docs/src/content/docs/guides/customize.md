---
title: Customize
description: Change the name, logo, colors, sidebar and the Ask AI button.
---

## Name and logo

Both are in `astro.config.mjs`:

```js
starlight({
	title: 'Astro AI Docs',
	logo: { src: './src/assets/ai-docs.svg' },
	social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/you/your-docs' }],
})
```

Replace `src/assets/ai-docs.svg` with your own file. Starlight shows the logo next to the title; add `replacesTitle: true` to the `logo` object to show only the logo.

## Colors

`src/styles/custom.css` sets four Starlight variables for dark mode and four for light mode. Change the accent values and the whole site follows, the Ask AI button included.

## Sidebar

See [Writing content](/guides/writing-content/#sidebar).

## The Ask AI button

The button and dialog come from the [starlight-onetag](https://github.com/fengyiqicoder/starlight-onetag) plugin. Things people usually change, all as options of `starlightOnetag({ ... })` in `astro.config.mjs`:

- `placeholder`, the example question in the input.
- `rules`, the instructions given to the model.
- `topPages` and `perPage`, how much text is retrieved.
- `label`, the button text.

To remove the feature, delete `starlightOnetag()` from `plugins` in `astro.config.mjs`. Starlight falls back to its default search button.

## Everything else

Astro AI Docs is a plain Starlight site. The [Starlight docs](https://starlight.astro.build/guides/customization/) cover fonts, custom pages, internationalization and component overrides.
