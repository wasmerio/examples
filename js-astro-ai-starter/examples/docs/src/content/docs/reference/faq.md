---
title: FAQ
description: Short answers to the questions people ask about Astro AI Docs and Ask AI.
---

## Is it free?

The template is MIT licensed. OneTag AI gives every account 1,000,000 free tokens, one time, no monthly reset; a question that reads five pages costs roughly 5,000 to 8,000 tokens, so that is around 150 questions a month. A paid plan with a larger allowance exists for busier sites.

## Does it work without a key?

Yes. The site, the search and the llms.txt all work. Only the Ask AI dialog shows a message saying it is not set up.

## Is my key safe in the HTML?

This key is designed to be public, like an analytics ID. Anyone who copies it can spend that account's allowance, and that is the whole risk: it cannot read your data or change your site. Keys are tied to an email address; paid plans can restrict a key to a domain.

## Which model answers?

OneTag AI routes to a fast, inexpensive model (Qwen 3.7 Flash at the time of writing) with an automatic fallback. The template does not choose the model.

## Can readers ask in other languages?

Yes. The rules tell the model to reply in the language of the question, and retrieval works on whatever language the pages are written in.

## Does the dialog slow the site down?

No. The AI script is loaded the first time someone opens the dialog. Before that the page carries one small custom element and no extra network requests.

## Can I use this outside Starlight?

The same approach works on any static site that has a Pagefind index: Astro, Hugo, Eleventy, Jekyll. The dialog in [starlight-onetag](https://github.com/fengyiqicoder/starlight-onetag) is plain browser code apart from the Starlight wrapper, and [astro-onetag](https://www.npmjs.com/package/astro-onetag) is the same idea as a component for any Astro site.
