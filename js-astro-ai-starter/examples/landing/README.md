# Astro AI Landing Page

Free Astro landing page template with built-in AI. Visitors ask the page questions and check whether the product fits them; every answer is written from the page's own copy. Tailwind 4, OneTag AI, Lighthouse 100, one-click deploy, MIT.

**Live demo:** https://fengyiqicoder.github.io/astro-ai-landing/ · try the fit check at the top and the question box in the FAQ.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ffengyiqicoder%2Fastro-ai-landing&env=PUBLIC_ONETAG_KEY&envDescription=Free%20key%20from%20onetagai.com&envLink=https%3A%2F%2Fonetagai.com%2F%3Fref%3Dastro-ai-landing&project-name=my-landing-page&repository-name=my-landing-page)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/fengyiqicoder/astro-ai-landing)

## Two AI features, no backend

- **Fit check** in the hero. A visitor writes what they do and how they bill; the model reads the page and answers whether the product fits, which features matter for them and which plan to pick. Returned as JSON, rendered in place.
- **Ask the page** in the FAQ. Free-form questions answered from the page copy only, streamed, with follow-ups.

Both run in the browser through [OneTag AI](https://onetagai.com/?ref=astro-ai-landing): one script tag, one public key, no server, nothing stored. The script loads only when a visitor uses a feature, so the page stays at Lighthouse 100.

The rest is a complete one-page site: header, hero, how it works, features, pricing, testimonials, FAQ, email form, footer. All copy lives in one file, `src/data/site.ts`.

## Use it

```bash
npm create astro@latest my-landing-page -- --template fengyiqicoder/astro-ai-landing
cd my-landing-page && npm install && npm run dev
```

1. Edit `src/data/site.ts`: name, tagline, features, prices, FAQ. The AI reads the rendered page, so specific copy (numbers, limits, names) gives specific answers.
2. Get a free key before you deploy (on localhost both features answer right away, on a shared demo key). Either at [onetagai.com](https://onetagai.com/?ref=astro-ai-landing), or without leaving the terminal (the key arrives in that inbox; one key per email):

```bash
curl -X POST https://onetagai.com/api/signup -H "Content-Type: application/json" -d '{"email":"you@example.com"}'
```

An AI coding tool can run that request with your email and ask you to paste the key. Put it in `.env`:

```ini
PUBLIC_ONETAG_KEY=ot_your_key_here
```

Without a key a deployed page works as a normal landing page; the two AI features show a short "not set up" message. This key is designed to be public, like an analytics ID: it can only spend that account's allowance of 1,000,000 free tokens, one time, no monthly reset.

3. Point the email form at your form service: `contact.endpoint` in `site.ts`.

## Deploy

- **GitHub Pages:** the included workflow builds and publishes on every push to `main`. Set Pages source to *GitHub Actions* and add a repository secret `ONETAG_KEY`. The workflow sets `BASE_PATH` for project pages; delete that line for a `you.github.io` site.
- **Vercel / Netlify:** the buttons above, with `PUBLIC_ONETAG_KEY` as an environment variable.

## Project layout

```
src/data/site.ts              every word on the page
src/components/Hero.astro     the fit check (onetag.ask with json: true)
src/components/Faq.astro      the question box (streaming, with history)
src/scripts/onetag.ts         loads the OneTag script on first use; error messages
src/styles/global.css         Tailwind 4 theme tokens: colors and fonts
.github/workflows/deploy.yml  GitHub Pages
```

## See also

- [Astro AI Docs](https://github.com/fengyiqicoder/astro-ai-docs): the matching docs template, with an Ask AI dialog that answers from your pages.
- [Static AI Block](https://github.com/fengyiqicoder/static-ai-block): twelve copy-paste AI blocks for any static page.

## License

MIT.
