---
title: AI features
description: Six AI features for Starlight readers, each one a plugin from the starlight-onetag package, all answered in the browser with no backend.
---

This site runs every plugin in the [starlight-onetag](https://github.com/fengyiqicoder/starlight-onetag) package. Each one is optional; they share one OneTag AI key and add no component overrides.

## Try them on this page

- **Ask AI.** Click **Ask AI** in the header, or press `Ctrl` + `/`, and ask how to deploy this site.
- **AI answers in search.** Open search, type a question such as "how do I deploy to Netlify", and click the **Ask AI** row above the results.
- **Read in your language.** Use the button under the page title. The next pages open in the same language until you click **Show original**.
- **Summarize this page.** Long pages get a button under the title that lists the key points.
- **Explain this code.** Click the button under the code block below.
- **Ask about a selection.** Select any sentence on this page and click the **Ask AI** button that appears next to it.

## Add them to your site

```js
// astro.config.mjs
import starlightOnetag from "starlight-onetag";
import starlightOnetagSearch from "starlight-onetag/search";
import starlightOnetagTranslate from "starlight-onetag/translate";
import starlightOnetagExplain from "starlight-onetag/explain";
import starlightOnetagSummary from "starlight-onetag/summary";
import starlightOnetagSelection from "starlight-onetag/selection";

starlight({
  plugins: [
    starlightOnetag(),
    starlightOnetagSearch(),
    starlightOnetagTranslate(),
    starlightOnetagExplain(),
    starlightOnetagSummary(),
    starlightOnetagSelection(),
  ],
});
```

Remove the lines for features you do not want. The key comes from `PUBLIC_ONETAG_KEY` in `.env`, as in [Getting started](../getting-started/).

## What each request sends

| Feature | What goes to OneTag AI | When |
| --- | --- | --- |
| Ask AI, search answers | The question and the top pages from the Pagefind index | When the reader asks |
| Translate | The page text in batches, code left out | When the reader picks a language, then on each new page until they switch back |
| Summary | The page text | When the reader clicks, then cached in their browser |
| Explain code | The code block, its section heading and the paragraph before it | When the reader clicks |
| Selection | The selected text, its paragraph and the page text | When the reader clicks |

Nothing is stored on a server. OneTag AI keeps token counts and timestamps, not questions or page text.
