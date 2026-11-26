<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Track](https://github.com/shadcnstudio/shadcn-astro-track-landing-page-free) Astro theme by shadcnstudio, copied from commit `c76455f12524e1a29a7e48c2476207c753c38814` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-shadcn-astro-track-landing-page-free.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: vercel.json.
- **Environment variables:** The theme's example env file lists `SITE_URL`, `EMAIL`, `LICENSE_KEY`. The demo builds and runs without them; set them in the app's settings to turn on the features that use them.
- **Credit:** theme by [shadcnstudio](https://github.com/shadcnstudio), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

<p align="center">
   <a href="https://shadcnstudio.com/templates/track-changelog-template-free" target="_blank">
      <img src="https://cdn.shadcnstudio.com/ss-assets/template/landing-page/track/logo.png" alt="track-logo" width="32px" height="32px">
   </a>
</p>

<h1 align="center">
   <a href="https://shadcnstudio.com/templates/track-changelog-template-free" target="_blank" align="center">
      Track - Shadcn UI Changelog Landing Page Template - Free
   </a>
</h1>

<p align="start">Track is a Free Shadcn UI Changelog Landing Page template to publish updates, releases, fixes, and improvements with clarity and consistency.</p>

![GitHub](https://img.shields.io/github/license/shadcnstudio/shadcn-astro-track-landing-page-free) ![GitHub issues](https://img.shields.io/github/issues/shadcnstudio/shadcn-astro-track-landing-page-free) ![GitHub closed issues](https://img.shields.io/github/issues-closed/shadcnstudio/shadcn-astro-track-landing-page-free) ![Twitter Follow](https://img.shields.io/twitter/follow/ShadcnStudio?style=social)

<kbd>[![Track - Shadcn UI Changelog Landing Page Template Demo Screenshot](https://cdn.shadcnstudio.com/ss-assets/landing-page/template-page/template-detail-page/landing-page/track/og-image.png)](https://shadcnstudio.com/templates/track-changelog-template-free)</kbd>

## Introduction 🚀

Track is a Free Shadcn UI Changelog Landing Page template to publish updates, releases, fixes, and improvements with clarity and consistency. Designed for SaaS products, startups, and development teams, Track delivers a transparent, professional experience with structured content, smooth animations, and easy customization.

[View Demo](https://shadcnstudio.com/preview/templates/shadcn-astro-track-landing-page)

[View Documentation](https://shadcnstudio.com/docs/getting-started/shadcn-studio-template-astro)

<p>
  Supported by
  <a href="https://shadcnstudio.com" target="_blank">
    Shadcn Studio
  </a>
  , with a commitment to empowering the open-source community.
</p>

## Key Features ✨

- **Changelog-Focused Sections** - Versioned updates, release summaries, feature additions, improvements, bug fixes, FAQs, and footer structured for clear product communication
- **Creative Animations & Design** - Smooth animations and thoughtfully crafted visual design that's easy to customize and extend
- **Built with Astro** - Static-first rendering, partial hydration, and lightning-fast performance with built-in SEO support
- **Tailwind CSS v4+ Ready** - Fully compatible with Tailwind CSS 4+, leveraging the latest utilities and design tokens
- **Powered by Pro Blocks** - Built using production-ready UI sections that follow best practices in accessibility and scalability
- **Figma Design Files Included** - Complete design files for customization, handoff, and maintaining design-to-code parity
- **Multiple Theme Support** - Easily switch between light, dark, and system themes with custom shadcn themes
- **Mobile-First & Fully Responsive** - Designed with a mobile-first approach for seamless experiences across all devices
- **Fast & SEO-Optimized** - Optimized for speed, Core Web Vitals, and SEO to help your site rank better
- **Hassle-Free Support** - Reliable and responsive support from the creators for setup and customization

## Page Structure & Sections

**Pages**

- **Homepage** - Hero section with featured changelog sections, version overview, and latest updates
- **Changelog Timeline** - Structured versioned updates with timeline view showing all releases and improvements
- **Release Details** - Detailed release page with features added, bug fixes, improvements, and version history
- **FAQ Section** - Frequently asked questions with accordion interface for easy browsing

**Key UI Sections**

- **Hero Section** - Customizable headline and call-to-action to introduce your product's story
- **Version Timeline** - Visual timeline displaying all major releases and updates chronologically
- **Feature Highlights** - Showcase new features, improvements, and bug fixes clearly organized
- **Release Summary** - Quick overview of what's new, changed, and fixed in each version
- **FAQ Block** - Common questions answered with expandable accordion component
- **CTA Blocks** - Convert users with strategically placed call-to-action sections
- **Footer** - Social links, navigation, and support information

---

<br />

<a href="https://shadcnstudio.com" target="_blank">
  <img src="https://cdn.shadcnstudio.com/ss-assets/smm/marketing/shadcn-studio-smm-banner.png" alt="shadcn/studio banner" width="1200">
</a>

<p>
   <a href="https://shadcnstudio.com" target="_blank">
      shadcn/studio
   </a>
   is an open-source collection of copy-and-paste shadcn components, blocks, and templates - paired with a powerful theme generator & AI Tools to craft, customize, and ship faster. 🚀
</p>

## Table of Contents 📋

- [Table of Contents 📋](#table-of-contents-)
- [Overview 🌏](#overview-)
  - [Not a standard library, but a distribution of components](#not-a-standard-library-but-a-distribution-of-components)
- [Why should I use shadcn/studio? 💡](#why-should-i-use-shadcnstudio-)
- [This is where shadcn/studio shines ✨](#this-is-where-shadcnstudio-shines-)
- [Features ✨](#features-)
- [Documentation 📚](#documentation-)
- [Community 🤝](#community-)
- [Credits 🤘](#credits-)
- [Useful Links 🎁](#useful-links-)
- [Social Media :earth_africa:](#social-media-earth_africa)

---

## Overview 🌏

**This isn&apos;t a traditional component library or a replacement for Shadcn**. Instead, it&apos;s a unique collection offers customizable variants of components, blocks, and templates. Preview, customize, and copy-paste them into your apps with ease.

Building on the solid foundation of the Shadcn components & blocks, we&apos;ve enhanced it with custom-designed components & blocks to give you a head start. This allows you to craft, customize, and ship your projects faster and more efficiently.

### Not a standard library, but a distribution of components

Following the philosophy of Shadcn, shadcn/studio isn&apos;t a conventional &quot;install-from-NPM&quot; library. Rather, it&apos;s an open-source distribution of components designed for maximum adaptability. You can copy the code, modify styles, adjust logic, or integrate it with other tools—free from the limitations of typical libraries. This &quot;open code&quot; model empowers you to customize with confidence and creativity.

## Why should I use shadcn/studio? 💡

shadcn/ui aims to provide core components with a unique distribution system, allowing developers to copy and paste reusable, customizable UI elements directly into their codebase.

While this approach offers flexibility and control, it comes with some limitations: a lack of diverse component variants examples, limited theme customization options, and limited pre-built blocks. Additionally, its extensive customization options, though powerful, can sometimes feel overwhelming, especially for those seeking a more guided or streamlined experience.

## This is where shadcn/studio shines ✨

An open-source & premium collection of copy-and-paste shadcn components, blocks, and templates - paired with a powerful theme generator to craft, customize, and ship faster 🚀. It provides a robust toolkit for building stunning, interactive user interfaces with ease.

- **Open-source:** Dive into a growing, community-driven collection of copy-and-paste [shadcn/ui components]('https://shadcnstudio.com/components'), shadcn blocks, and templates.

- **Component & Blocks variants:** Access a diverse, collection of customizable [shadcn blocks](https://shadcnstudio.com/blocks) and component variants to quickly build and style your UI with ease.

- **Animated variants with Motion:** Add smooth, modern animations to your components, enhancing user experiences with minimal effort.

- **Landing pages & Dashboards:** Explore 20+ premium & free [Shadcn templates](https://shadcnstudio.com/templates) for dashboards, landing pages & more. Fully customizable & easy to use.

- **shadcn/ui for Figma:** Speed up your workflow with [Shadcn Figma](https://shadcnstudio.com/figma) UI components, blocks & templates — a full design library inspired by shadcn/ui.

- **Powerful theme generator:** Customize your UI instantly with [Shadcn Theme Generator](https://shadcnstudio.com/theme-generator). Preview changes in real time and create consistent, on-brand designs faster.

- **shadcn/studio MCP:** Integrate [shadcn/studio MCP](https://shadcnstudio.com/mcp) Server directly into your favorite IDE and craft stunning shadcn/ui Components, Blocks and Pages inspired by shadcn/studio.

- **Shadcn Figma To Code Plugin:** Convert your Figma designs into production-ready code instantly with the [Shadcn Figma Plugin](https://shadcnstudio.com/figma-plugin).

## Features ✨

1. **Live Theme Generator:** See your shadcn components transform instantly as you experiment with styles in real time.
2. **Color Mastery:** Play with background, text, and border hues using a sleek color picker for a unified design.
3. **Typography Fine-Tuning:** Perfect your text with adjustable font sizes, weights, and transformations for a polished look.
4. **Tailwind v4 Compatibility:** Effortlessly use Tailwind v4, supporting OKLCH, HSL, RGB & HEX color formats.
5. **Stunning Theme Starters:** Kick off with gorgeous pre-built themes and customize light or dark modes in a breeze.
6. **Hold to Save Theme:** Preserve your custom themes with a quick hold, making them easy to reuse or share later.

## Documentation 📚

For comprehensive documentation, please visit [shadcn/studio documentation](https://shadcnstudio.com/docs/getting-started/introduction).

## Community 🤝

Join the shadcn/studio community to discuss the library, ask questions, and share your experiences:

- 🐦 [Follow us on Twitter](https://x.com/ShadCNStudio)
- 🎮 [Join us on Discord](https://discord.com/invite/kBHkY7DekX)

## Credits 🤘

We are grateful for the contributions of the open-source community, particularly:

- [shadcn/ui](https://ui.shadcn.com/)
- [tweakcn](https://tweakcn.com/) (Our Theme Generator is heavily inspired by tweakcn)

These projects form the backbone of shadcn/studio, allowing us to build a powerful copy-and-paste components.

## Useful Links 🎁

- [Shadcn Blocks](https://shadcnstudio.com/blocks)
- [Shadcn Templates](https://shadcnstudio.com/templates)
- [Shadcn Figma UI Kit](https://shadcnstudio.com/figma)
- [Shadcn Theme Generator](https://shadcnstudio.com/theme-generator)
- [Shadcn MCP Server](https://shadcnstudio.com/mcp)
- [Shadcn IDE Extension](https://shadcnstudio.com/ide-extension)
- [Shadcn Components](https://shadcnstudio.com/components)
- [Shadcn Figma to Code](https://shadcnstudio.com/figma-plugin)

## Social Media :earth_africa:

- [x](https://x.com/ShadcnStudio)
- [Discord](https://discord.com/invite/kBHkY7DekX)
- [YouTube](https://www.youtube.com/@themeselection)
