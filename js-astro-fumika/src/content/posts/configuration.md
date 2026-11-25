---

title: Configuration Guides for Fumika Site
published: 2026-09-11
description: "How to configure this blog template."
tags: ["Fumika", "Blogging", "Customization"]
category: Guides
draft: false
---

This guide walks you through configuring your site using the `src/config.ts` file in the **Fumika** Astro theme. If you are unfamiliar with JavaScript syntax, consider reviewing basic variable usage. TypeScript will also help catch any data type mismatches.

## Site Configuration

The `siteConfig` object controls core site metadata, layout behaviors, and multi-language support.

```typescript export const siteConfig: SiteConfig = {
    title: "Fumika",
    subtitle: "Blog",
    lang: "en",
    supportedLangs: ["en", "es", "id", "ja"],
    theme: {
        hue: 75,
        mode: "light",
    },
    banner: {
        enable: true,
        src: "assets/images/demo-banner.jpg",
        position: "center",
        credit: {
            enable: true,
            text: "Artist Name",
            url: "https://example.com"
        },
    },
    toc: {
        enable: true,
        depth: 2,
    },
    favicon: [],
    ogImage: {
        useDefault: true,
        defaultSrc: "/media/images/banner.jpg",
    },
};
```

Attribute `title` and `subtitle` are displayed like this format in website title homepage:

```
<title> - <subtitle>
```

### Languages

Set `lang` for primary language code for your site.

The `supportedLangs` attribute is an array of language codes available in the site language switcher. Leave as an empty array `[]` to disable multi-language support. The order of items in the array determines their display order in the switcher.

Available languages:
- `"en"`
- `"zh_CN"`
- `"zh_TW"`
- `"ja"`
- `"ko"`
- `"es"`
- `"th"`
- `"vi"`
- `"tr"`
- `"id"`
- `"fr"`
- `"fa"`

> [!WARNING]
> Currently, Persian `fa` language not set properly.<br/>
> (_Not set to right to left direction_)

### Theme

`theme.color` is the primary accent color hue value ranging from `0` to `360` (e.g., Red: `0`, Teal: `200`, Cyan: `250`, Pink: `345`).

> [!TIP]
> To see the live preview of theme color, run `pnpm dev` and see the display setting in navbar.<br/>
> You can change the theme color without changing `theme.color` manually in `src/config.ts`.<br/>
> _This feature only appear in dev mode_

Set `theme.mode` for default color theme mode (`"light"` or `"dark"`).

### Banner Image

| Attribute       | Description                                                                                                                                                                                                                                                       |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| banner.enable   | Set to `true` to display the hero banner image at the top of pages                                                                                                                                                                                                |
| banner.src      | Image source path.<br/>Relative to `src/` by default (e.g., `src/assets/images/demo-banner.jpg`),<br/>or relative to `public/` if prefixed with `/` (e.g., `/media/images/banner.jpg`).                                                                           |
| banner.position | Object alignment for the banner image. Accepts `"top"`, `"center"`, or `"bottom"`.                                                                                                                                                                                |
| banner.credit   | Artwork attribution configuration:<br/>1. `enable`: Set to `true` to display the credit text of the banner.<br/>2. `text`: The credit string to display (e.g., artist name or source).<br/>3. `url`: (_Optional_) Link to the original artwork or artist profile. |

### TOC

Set `toc.enable` to `true` to display TOC. The `toc.depth` is the maximum heading depth level to display in the TOC, ranging from `1` to `3`.

### Favicon

`favicon` is an array of custom favicon configuration objects. Leave empty `[]` to use the default site favicon.

This is example custom favicon look like:

```typescript
favicon: [
	{
		src: "/favicon/icon.svg", // Path relative to /public
		theme: "light", // Optional: 'light' or 'dark'
		sizes: "32x32", // Optional: image size dimension
	},
];
```

### Open Graph Image

Open Graph image (`ogImage`) is the Social media preview card configuration

| Attribute          | Description                                                                                                                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ogImage.useDefault | Set to `true` to fall back to `defaultSrc` when a post lacks its own cover image.                                                                                                                     |
| ogImage.detaultSrc | The default image path used for Open Graph previews. It's **only** relative to `/public` directory start with `/`<br/>It's also the Open Graph image for other pages tha posts like Home, About, etc. |

## Navigation Bar Configuration

Configure the main navigation links in `navBarConfig`. You can mix default preset links with custom external or internal links.

```typescript
export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		LinkPreset.Friends,
		{
			name: "GitHub",
			url: "https://github.com/your-username/your-repo",
			external: true,
		},
	],
};
```

Custom navigation bar link attributes:

| Attribute  | Description                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| name       | Displayed name in navbar                                                                                                        |
| url        | URL navigation of external or internal links.<br/>Internal links should not include the base path, as it is automatically added |
| external   | If it set to `true`, it will show an external link icon and open in a new tab                                                   |

This is how navigation links that only contain _Home_, _Archive_, and _About_ look like:

```typescript
export const navBarConfig: NavBarConfig = {
	links: [LinkPreset.Home, LinkPreset.Archive, LinkPreset.About],
};
```

## Profile Configuration

The `profileConfig` object populates the sidebar profile card with your avatar, bio, and social links.

```typescript
export const profileConfig: ProfileConfig = {
	avatar: "assets/images/demo-avatar.jpg",
	name: "Fumika",
	bio: "Lorem ipsum dolor sit amet",
	links: [
		{
			name: "X",
			icon: "fa6-brands:x-twitter",
			url: "https://x.com",
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com",
		},
	],
};
```

`avatar` path is relative to the `src/` directory by default (e.g., `"assets/images/demo-avatar.jpg"`). Also it relative to the `public/` directory if the path starts with a leading slash `/` (e.g., `"/media/images/avatar.webp"`).

`links` icons are powered by Iconify. If you use an icon set that is not already included in the template, you must install the corresponding package:

```sh
pnpm add @iconify-json/<icon-set-name>
```

Visit [https://icones.js.org](https://icones.js.org) for icon codes.

## License Configuration

Configure the content license displayed at the end of post using `licenseConfig`:

```typescript
export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};
```

## Expressive Code Configuration

:::warning
Please select a dark theme, as **Fumika** currently only supports dark background color.
:::

```typescript
export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: "github-dark",
};
```

## Comment Configuration

**Fumika** targeting 3 comment support, [Disqus](https://disqus.com/), [Giscus](https://giscus.app), and [Twikoo](https://twikoo.js.org/en/). Currently only support Giscus.

### Giscus

Fumika supports Giscus out-of-the-box for GitHub Discussions-powered comments.

```typescript
export const commentConfig: CommentConfig = {
	giscus: {
		repo: "your-username/your-repo",
		repoId: "R_kgDO...",
		category: "General",
		categoryId: "DIC_kwDO...",
		mapping: "pathname",
		strict: "0",
		reactionsEnabled: "1",
		emitMetadata: "1",
		inputPosition: "top",
		theme: "reactive",
		lang: "en",
		loading: "lazy",
	},
};
```

| Attribute        | Description                                                                                                    |
| ---------------- | -------------------------------------------------------------------------------------------------------------- |
| repo             | Repository for discussion database.<br/>Format: `username/repo`                                                |
| repoId           | The unique ID of the GitHub repository. Obtainable from [https://giscus.app](https://giscus.app)               |
| category         | The discussion category name.<br/>Options: `Announcement`, `General`, `Ideas`, `Polls`, `Q&A`, `Show and tell` |
| categoryId       | The unique ID of the discussion category. Obtainable from [https://giscus.app](https://giscus.app)             |
| mapping          | How pages map to GitHub Discussions.<br/>Options: `pathname`, `url`, `title`, `og:title`, and specific         |
| strict           | Whether to strictly match discussion titles.<br/>(`"1"` for enable and `"2"` for disable)                      |
| reactionsEnabled | Enable or disable reaction buttons for the main post.<br/>(`"1"` for enable and `"2"` for disable)             |
| emitMetadata     | Whether to send discussion metadata to the parent page.<br/>(`"1"` for enable and `"2"` for disable)           |
| inputPosition    | Position of the comment box relative to comments.<br/>(`"top"` or `"bottom"`)                                  |
| theme            | Giscus color theme.<br/>(e.g., `"light"`, `"dark"`, `"preferred_color_scheme"`, `"reactive"`)                  |
| lang             | Display language for the Giscus widget.<br/>(e.g., `"en"`, `"zh-CN"`, `"ja"`)                                  |
| loading          | Loading strategy for the comment iframe.<br/>(`"lazy"` or `"eager"`)                                           |

> [!TIP]
> set `theme` to `reactive` to use reactive style using custom CSS.<br/>
> set `category` to `Announcement` to prevent replies directly in repository of discussion.

To disable comments completely, set `giscus` to `undefined`:

```typescript
export const commentConfig: CommentConfig = {
    giscus: undefined;
}
```

## Analytics Configuration

Analytics allow you to monitor and analyze site traffic. **Fumika** integrates with [Partytown](https://partytown.qwik.dev/) to offload third-party scripts to a Web Worker, ensuring your site maintains optimal loading performance.

Currently, **Fumika** natively supports [Google Analytics](https://developers.google.com/analytics) (GA4). Integration with [Umami](https://umami.is/) is planned for a future update.

To disable analytics completely, set `enabled` to `false`:

```typescript
export const analyticsConfig: AnalyticsConfig = {
	enabled: false,
};
```

### Google Analytics

To enable Google Analytics, set `enabled` to `true` and provide your GA4 Measurement ID in `analyticsConfig`:

```typescript
export const analyticsConfig: AnalyticsConfig = {
	enabled: true,
	google: {
		id: "G-XXXXXXXXXX",
	},
};
```

If wanna disable it, set `analyticsConfig` like:

```typescript
export const analyticsConfig: AnalyticsConfig = {
	enabled: false,
};
```

## Deployment Configuration

Configure your site's domain and base path in `deployConfig`:

```typescript
export const deployConfig: DeployConfig = {
	siteUrl: "https://example.com",
	baseUrl: "/",
};
```

Keep `baseUrl` as `"/"` if you are deploying directly to the root domain like `https://example.com`.

**Subpath Deployment Example**

If your site is hosted at `https://example.com/blog`, configure `deployConfig` as follows:

```typescript
export const deployConfig: DeployConfig = {
	siteUrl: "https://example.com",
	baseUrl: "/blog",
};
```
