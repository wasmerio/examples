---
title: Configuration
description: Environment variables and the Ask AI plugin options Astro AI Docs reads.
---

## Environment variables

| Variable | Default | Used for |
| --- | --- | --- |
| `PUBLIC_ONETAG_KEY` | `YOUR_ONETAG_KEY` | The OneTag AI key. Without it the dialog answers on localhost with a shared demo key and shows a "not set up" message on a deployed site. |
| `PUBLIC_ONETAG_SITE` | `https://onetagai.com` | Where the API lives. Only needed for self-hosted deployments. |
| `BASE_PATH` | `/` | Sub-path the site is served from, for example `/astro-ai-docs` on a GitHub project page. |

Variables starting with `PUBLIC_` are read at build time and written into the HTML, which is why This key is designed to be public.

## Ask AI options

Passed to `starlightOnetag({ ... })` in `astro.config.mjs`. The full list is in the [starlight-onetag README](https://github.com/fengyiqicoder/starlight-onetag#options).

| Option | Default | Meaning |
| --- | --- | --- |
| `topPages` | `5` | Pages retrieved per question. |
| `perPage` | `6000` | Characters kept from each page. |
| `maxContext` | `20000` | Characters of page text sent in total. The service limit for one call is 32,000, question and history included. |
| `rules` | see the plugin | The instructions given to the model. |
| `placeholder` | set in `astro.config.mjs` | The example question in the input. |
| `label` | `Ask AI` | Button text. |

## Answer length

The `maxTokens` option (default `400`) caps the answer at about 300 words. The service allows up to 10,000.
