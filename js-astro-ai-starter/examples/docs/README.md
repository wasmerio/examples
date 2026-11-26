# Astro AI Docs

Free Astro docs template with built-in AI Q&A that answers from your own pages. Starlight, Pagefind retrieval, OneTag AI, llms.txt, Lighthouse 100, one-click deploy, MIT.

**Live demo:** https://fengyiqicoder.github.io/astro-ai-docs/ · open the **Ask AI** button in the header or press `Ctrl` + `/`.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ffengyiqicoder%2Fastro-ai-docs&env=PUBLIC_ONETAG_KEY&envDescription=Free%20key%20from%20onetagai.com&envLink=https%3A%2F%2Fonetagai.com%2F%3Fref%3Dastro-ai-docs&project-name=my-docs&repository-name=my-docs)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/fengyiqicoder/astro-ai-docs)

## What it does

A reader types a question. The site searches its own pages with the [Pagefind](https://pagefind.app) index that Starlight already builds, hands the best five pages and the question to [OneTag AI](https://onetagai.com/?ref=astro-ai-docs), and streams the answer back with links to the pages it used. Follow-up questions keep the thread. The whole thing runs in the browser: no backend, no API keys in the code, nothing stored.

- Answers only from your pages; says so when a question is not covered.
- Works in any language the reader asks in.
- Loads the AI script only when the dialog opens, so page speed is untouched.
- `llms.txt` generated on every build for AI coding tools and search engines.
- More AI for readers, each one optional: an AI answer inside search, **Read in your language** page translation, **Explain this code** under code blocks, **Summarize this page**, and ask-about-a-selection. All from [starlight-onetag](https://github.com/fengyiqicoder/starlight-onetag).
- Everything else is standard [Starlight](https://starlight.astro.build): sidebar, search, dark mode, i18n.

## Use it

```bash
npm create astro@latest my-docs -- --template fengyiqicoder/astro-ai-docs
cd my-docs && npm install && npm run dev
```

It answers on localhost right away, on a shared demo key. Before you deploy, get your own free key. Either at [onetagai.com](https://onetagai.com/?ref=astro-ai-docs), or without leaving the terminal (the key arrives in that inbox; one key per email):

```bash
curl -X POST https://onetagai.com/api/signup -H "Content-Type: application/json" -d '{"email":"you@example.com"}'
```

Put it in `.env`:

```ini
PUBLIC_ONETAG_KEY=ot_your_key_here
```

If an AI coding tool is setting this up for you, it can run that request with your email and ask you to paste the key from your inbox. Without a key a deployed site works as a normal Starlight site; the Ask AI dialog just says it is not set up yet. This key is designed to be public, like an analytics ID: it can only spend that account's allowance of 1,000,000 free tokens, one time, no monthly reset.

## Deploy

- **GitHub Pages:** the included workflow builds and publishes on every push to `main`. Set Pages source to *GitHub Actions* and add a repository secret `ONETAG_KEY`.
- **Vercel / Netlify:** the buttons above, with `PUBLIC_ONETAG_KEY` as an environment variable.

Full docs, written as the demo content: [Getting started](https://fengyiqicoder.github.io/astro-ai-docs/guides/getting-started/), [How Ask AI works](https://fengyiqicoder.github.io/astro-ai-docs/guides/ask-ai/), [Deploy](https://fengyiqicoder.github.io/astro-ai-docs/guides/deploy/).

## Project layout

```
src/content/docs/             your pages (Markdown / MDX)
src/styles/custom.css         four accent colors
astro.config.mjs              title, logo, sidebar, the Ask AI plugin (starlight-onetag), llms.txt plugin
.github/workflows/deploy.yml  GitHub Pages
```

## See also

- [Astro AI Landing Page](https://github.com/fengyiqicoder/astro-ai-landing): the matching landing page template, with a fit check and an ask-the-page box.
- [Static AI Block](https://github.com/fengyiqicoder/static-ai-block): twelve copy-paste AI blocks for any static page.
- [starlight-onetag](https://github.com/fengyiqicoder/starlight-onetag): the Ask AI dialog from this template as a Starlight plugin for existing sites.

## License

MIT. Built on Starlight and Pagefind; AI answers by OneTag AI.
