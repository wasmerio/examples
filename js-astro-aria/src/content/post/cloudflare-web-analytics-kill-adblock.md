---
layout: ../../layouts/post.astro
title: Preventing AdBlock from Blocking Cloudflare Web Analytics
description: Proxy Cloudflare Web Analytics through a Cloudflare Worker to bypass common ad-block filter lists.
dateFormatted: Jan 8th, 2024
---

After routing around ad-blockers for [Vercel Analytics](/post/vercel-kill-adblock) and [Umami](/post/umami-kill-adblock), I decided to do the same for [TempMail.Best](https://tempmail.best/), which uses [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/).

AdBlock catches Cloudflare Web Analytics with the `||cloudflareinsights.com^` rule. The tracker script loads from `https://static.cloudflareinsights.com/beacon.min.js`, and telemetry is sent to `https://cloudflareinsights.com/cdn-cgi/rum`.

![||cloudflareinsights.com^](https://static.miantiao.me/share/2024/U4WHW7/GtPNhj.png)

The fix is identical to what I did for Umami: proxy the JavaScript beacon through your own domain and forward ingest requests to Cloudflare's endpoint.

## Setup

Create a new Cloudflare Worker and paste in the script below. Bind your custom domain and verify the script path (mine is `https://cwa.miantiao.me/mt-demo.js`). You can rename `mt-demo` to any path slug you prefer:

```js
const CWA_API = 'https://cloudflareinsights.com/cdn-cgi/rum'
const CWA_SCRIPT = 'https://static.cloudflareinsights.com/beacon.min.js'

export default {
  async fetch(request, env, ctx) {
    let { pathname, search } = new URL(request.url)
    if (pathname.endsWith('.js')) {
      let response = await caches.default.match(request)
      if (!response) {
          response = await fetch(CWA_SCRIPT, request)
          ctx.waitUntil(caches.default.put(request, response.clone()))
      }
      return response
    }
    const req = new Request(request)
    req.headers.delete("cookie")
    const response = await fetch(`${CWA_API}${search}`, req)
    const headers = Object.fromEntries(response.headers.entries())
    if (!response.headers.has('Access-Control-Allow-Origin')) {
      headers['Access-Control-Allow-Origin'] = request.headers.get('Origin') || '*'
    }
    if (!response.headers.has('Access-Control-Allow-Headers')) {
      headers['Access-Control-Allow-Headers'] = 'content-type'
    }
    if (!response.headers.has('Access-Control-Allow-Credentials')) {
      headers['Access-Control-Allow-Credentials'] = 'true'
    }
    return new Response(response.body, {
      status: response.status,
      headers
    })
  },
};
```

Inject the tracking script into your site's HTML:

```html
<script async src='https://cwa.miantiao.me/mt-demo.js' data-cf-beacon='{"send":{"to": "https://cwa.miantiao.me/mt-demo"},"token": "5403f4dc926c4e61a757d630b1ec21ad"}'></script>
```

- `src` is the script URL on your proxy domain.
- `data-cf-beacon` contains the `send.to` ingest endpoint, also pointing to your proxy domain.
- Remember to replace the `token` with your site's actual token.

You can test this setup live on [TempMail.Best](https://tempmail.best/) or [HTML.ZONE](https://html.zone/).

**Important: In the Cloudflare dashboard, make sure to disable "Automatic Setup", or your custom snippet won't record page views.**

![Disable automatic configuration](https://static.miantiao.me/share/2024/AnFeat/jqthrz.png)
