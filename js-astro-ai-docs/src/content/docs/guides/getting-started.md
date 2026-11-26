---
title: Getting started
description: Create a site from the Astro AI Docs template, run it locally and add your OneTag AI key.
---

Astro AI Docs is a [Starlight](https://starlight.astro.build) site with one extra plugin: an **Ask AI** button in the header that answers questions from the pages on the site.

## Create a site

```bash
npm create astro@latest my-docs -- --template fengyiqicoder/astro-ai-docs
cd my-docs
npm install
npm run dev
```

Open `http://localhost:4321` and click **Ask AI**. On localhost it answers without any key, using a shared demo key. A deployed site needs its own.

## Add your key before you deploy

1. Get a free key. Fill in your email at [onetagai.com](https://onetagai.com/?ref=astro-ai-docs), or POST it from the terminal; either way the key arrives in that inbox, one key per email:

   ```bash
   curl -X POST https://onetagai.com/api/signup -H "Content-Type: application/json" -d '{"email":"you@example.com"}'
   ```

   An AI coding tool can run that request for you and ask you to paste the key.
2. Create a `.env` file in the project root:

```ini
PUBLIC_ONETAG_KEY=ot_your_key_here
```

3. Restart `npm run dev`. Open the dialog with the button or with `Ctrl` + `/`.

This key is designed to be public: it ends up in the built HTML, like any analytics ID. Every account has a free allowance of 1,000,000 tokens, one time, no monthly reset; the dialog shows a plain message when it is used up.

## Build

```bash
npm run build
npm run preview
```

Retrieval uses the Pagefind index that `astro build` creates, so the full "search the whole site, then answer" flow only works on a built site. In `npm run dev` the dialog answers from the current page instead.

## Next steps

- [How Ask AI works](/guides/ask-ai/), and what is sent where.
- [Deploy](/guides/deploy/) to GitHub Pages, Vercel or Netlify.
- [Customize](/guides/customize/) the name, colors and sidebar.
