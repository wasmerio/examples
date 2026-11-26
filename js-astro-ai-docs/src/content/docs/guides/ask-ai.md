---
title: How Ask AI works
description: What happens when a reader asks a question, what is sent to the model, and how to change the rules.
---

The Ask AI dialog comes from one Starlight plugin, [starlight-onetag](https://github.com/fengyiqicoder/starlight-onetag), added in `astro.config.mjs`. It renders Starlight's normal search button and adds its own button next to it. Everything below happens in the reader's browser.

## Step by step

1. **Retrieve.** The question goes to [Pagefind](https://pagefind.app), the static search index Starlight builds on every `astro build`. The top 5 matching pages are loaded, up to 6,000 characters each and 20,000 in total.
2. **Ask.** The question, the page texts and a short rule set go to OneTag AI with `ask(question, pages, { system, history, stream })` from the [`onetagai`](https://www.npmjs.com/package/onetagai) package. The answer streams into the dialog as it is written.
3. **Cite.** The titles of the pages that were used appear under the answer as links.
4. **Follow up.** The last four exchanges are kept as `history`, so "and on Netlify?" works after "how do I deploy to GitHub Pages?".

Nothing is stored on a server. OneTag AI keeps token counts and timestamps, not questions or page text; see its [privacy page](https://onetagai.com/privacy?ref=astro-ai-docs).

## The rules

The model is told to answer only from the pages it was given, to say so when they do not cover the question, to keep it under 150 words and to reply in the language of the question. To change them, pass your own text as the plugin's `rules` option; it is plain English.

## Limits

One call accepts up to 32,000 characters of text. Astro AI Docs uses at most 20,000 for pages so the question and the history always fit. If your pages are very long, lower the plugin's `perPage` or `topPages` option.

## When there is no key

On localhost the dialog answers without a key, using a shared demo key, so you can try it right after install. On a deployed site without `PUBLIC_ONETAG_KEY` (this key is designed to be public: it ships in the HTML like an analytics ID) the button still shows, and the dialog explains that Ask AI is not set up on this site. The rest of the site, the search included, works exactly as before. If you do not want the button at all, remove `starlightOnetag()` from `plugins` in `astro.config.mjs`.
