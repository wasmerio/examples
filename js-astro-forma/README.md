<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Forma](https://github.com/Wiktorkulas51/forma-astro-template) Astro theme by Wiktorkulas51, copied from commit `98ad90a6668299f1b115a4719bd2e5c69fe99ddf` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-forma.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** The theme's example env file lists `PUBLIC_SITE_URL`, `PUBLIC_BASE_PATH`. The demo builds and runs without them; set them in the app's settings to turn on the features that use them.
- **Credit:** theme by [Wiktorkulas51](https://github.com/Wiktorkulas51), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# FORMA

FORMA is a free, bilingual Astro template for construction and renovation businesses. It includes an English homepage at `/`, a Polish homepage at `/pl/`, reusable sections, responsive image handling, and a contact form demo that does not send data.

The public package uses neutral SVG image placeholders. Photography from the development demo is not included. Use **Use this template** on GitHub to start your own repository, or download the source ZIP from the **Code** menu.

Live demo: https://webscale-forma.vercel.app/

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWiktorkulas51%2Fforma-astro-template&project-name=forma-astro-template&repository-name=forma-astro-template)

More templates for local businesses: [WebScale Astro templates](https://webscale.pl/en/astro-templates/?utm_source=github&utm_medium=readme&utm_campaign=forma-free).

## Animated versions on onepaste

[![onepaste: animated websites with copy-paste prompts](https://raw.githubusercontent.com/Wiktorkulas51/webscale-templates/master/assets/onepaste/onepaste-preview.gif)](https://onepaste.dev/?utm_source=github&utm_medium=referral&utm_campaign=forma-astro-template)

Want these designs with scroll animations, micro-interactions and copy-paste prompts to rebuild them with AI (Lovable, v0, Bolt, Claude, Cursor)? We're developing them further at [onepaste](https://onepaste.dev/?utm_source=github&utm_medium=referral&utm_campaign=forma-astro-template). Some templates are free.

## Need help adapting FORMA?

Need help adapting this template for your business? [Work with WebScale](https://webscale.pl/?utm_source=github&utm_medium=readme&utm_campaign=forma-free) for custom design, development and implementation support.

## Start

Requirements: Node.js 22.12 or newer.

```bash
npm ci
npm run dev
```

Astro serves the site at `http://localhost:4345`. To create a static production build, run:

```bash
npm run build
```

The output is written to `dist/`. See the [deployment guide](docs/guides/deployment.md) before publishing a customized site.

## Customize

Start with the [customization guide](docs/guides/customization.md) and [content guide](docs/guides/content.md). Site details, navigation, SEO and homepage sections are stored in `src/data/`. Theme tokens are defined in `design/default.md`; run `npm run design:sync` after changing them.

All business details, project descriptions and testimonials in the demo are fictional examples. Replace them with verified information and images you have permission to use. The contact form only validates locally and displays a demo confirmation. Connect and test a service before collecting inquiries.

## More WebScale templates

WebScale publishes more templates for local businesses in its [Astro template catalog](https://webscale.pl/en/astro-templates/?utm_source=github&utm_medium=readme&utm_campaign=forma-free), with source code included. Each template can be adapted to your brand, content and sections. [Need it set up for your business?](https://webscale.pl/en/quote/?utm_source=github&utm_medium=readme&utm_campaign=forma-free)

## License

The source code and included FORMA demo graphics are available under the MIT License. You may use the template in commercial projects and redistribute it, provided you include the copyright and permission notice. Third-party components and fonts retain their own licenses. See [LICENSE.md](LICENSE.md) and [asset and license notes](docs/assets-and-licenses.md) for the full boundary.

## Checks

```bash
npm run ai:check
npm run build
```
