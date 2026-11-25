<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Latentfolio](https://github.com/Dharani-Eswaramurthi/latentfolio) Astro theme by Dharani-Eswaramurthi, copied from commit `6f9beaec795c674b6ff7418c51865133c024117e` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-latentfolio.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** The theme's example env file lists `SITE_URL`, `TEMPLATE_DEMO`. The demo builds and runs without them; set them in the app's settings to turn on the features that use them.
- **Credit:** theme by [Dharani-Eswaramurthi](https://github.com/Dharani-Eswaramurthi), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# LatentFolio Free

An evidence-first Astro portfolio starter for AI, ML, and GenAI engineers. It helps technical professionals explain the problem, engineering decisions, evaluation method, and outcome behind their work—not just list tools.

Created and maintained by [Dharani Eswaramurthi](https://github.com/Dharani-Eswaramurthi).

[Explore the free live demo](https://latentfolio.vercel.app/) · [Compare Free and Pro](https://latentfolio-pro.netlify.app/template?utm_source=github&utm_medium=website&utm_campaign=latentfolio_2026_11)

> Every person, employer, project, and metric in the demo is fictional. Replace the sample content before publishing.

## Included

- One-page portfolio with hero, project snapshots, expertise, experience, writing, education, and contact sections
- Interactive hero demonstration using lightweight browser JavaScript
- Persistent light and dark themes with system-preference fallback
- Responsive layouts, keyboard support, visible focus, and reduced-motion handling
- Canonical URLs, Open Graph and X metadata, JSON-LD, sitemap, robots file, and `llms.txt`
- Central profile and portfolio content in `src/data/site.ts`
- Static Astro output, self-hosted fonts, and GitHub Actions build checks

## Free and Pro

| Free | Pro |
|---|---|
| One-page starter | Full portfolio product |
| Project snapshots | Dedicated evidence-led case-study pages |
| Interactive hero demo | Hero demo plus three-mode AI systems lab |
| Core profile sections | Richer modules and release documentation |
| MIT License | Commercial single-user license |

**Have completed projects that need more room?** [LatentFolio Pro is $29 once](https://dharani96556.gumroad.com/l/latentfolio-pro?utm_source=github&utm_medium=website&utm_campaign=latentfolio_2026_11&utm_content=free_readme). It adds three detailed project examples, reusable evaluation/decision/limitation sections, the AI Systems Lab, and launch documentation. [Inspect a Pro case study](https://latentfolio-pro.netlify.app/work/support-copilot) before choosing. The Pro license covers your own personal portfolio; Free remains MIT-licensed.

## Requirements

- Node.js 22.23.4 or later
- npm 10 or later

## Start locally

```bash
npm install
npm run dev
```

Run the production checks:

```bash
npm test
npm run audit
npm run build
npm run preview
```

You can also start a new Astro project directly from this repository after it is public:

```bash
npm create astro@latest -- --template Dharani-Eswaramurthi/latentfolio
```

## Customize

The seller's hosted demo includes an optional Pro comparison banner. Buyer/fork builds hide it by default. Set `TEMPLATE_DEMO=false` to explicitly disable it; `true` is for the creator's demo. It also activates for the exact creator-owned `SITE_URL` origin or Vercel production hostname `latentfolio.vercel.app` unless explicitly disabled. When `SITE_URL` is unset, Vercel builds use the platform's production hostname for canonical URLs.

1. Replace the fictional profile, projects, experience, skills, writing, and education in `src/data/site.ts`.
2. Replace `public/avatar-placeholder.svg`, `public/resume-placeholder.pdf`, `public/og-cover.svg`, and `public/og-cover.png`.
3. Set `SITE_URL` to the exact public production origin in your deployment environment.
4. Update the favicon and web manifest, then test every email and external link.
5. Run `npm run build` and inspect the site on mobile and desktop in both themes.

Do not publish claims or metrics you cannot substantiate. If work is confidential, describe the evaluation method and use an approved range or qualitative outcome.

## Deploy

The output is static and can be deployed to Vercel, Netlify, Cloudflare Pages, GitHub Pages, or another static host. For Vercel, import the repository, keep the Astro defaults, add `SITE_URL`, and redeploy so canonical and social URLs use the production origin.

## License

LatentFolio Free is available under the [MIT License](LICENSE). You may use, modify, and distribute it, including commercially, while preserving the copyright and license notice. The visible creator link is appreciated but not required by the MIT License.

Third-party notices are listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

